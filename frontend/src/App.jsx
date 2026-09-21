import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

import Silence from "./pages/Silence";
import Mystery from "./pages/Mystery";
import Letter from "./pages/Letter";
import Teasing from "./pages/Teasing";
import GameTransition from "./pages/GameTransition";
import MatchingGame from "./pages/MatchingGame";
import PhotoTransition from "./pages/PhotoTransition";
import PhotoUpload from "./pages/PhotoUpload";
import Finale from "./pages/Finale";

const scenes = [
  Silence,
  Mystery,
  Letter,
  Teasing,
  GameTransition,
  MatchingGame,
  PhotoTransition,
  PhotoUpload,
  Finale,
];

const sceneNames = [
  "Silence",
  "Mystery",
  "Letter",
  "Teasing",
  "Game Transition",
  "Matching Game",
  "Photo Transition",
  "Photo Upload",
  "Finale",
];

const transitionVariants = {
  initial: {
    opacity: 0,
    scale: 1.04,
    filter: "blur(10px)",
  },

  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },

  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
  },
};

export default function App() {
  /*
    Ambil scene dari URL.

    Contoh:
    ?scene=0 → Silence
    ?scene=5 → Matching Game
    ?scene=7 → Photo Upload
  */

  const params = new URLSearchParams(
    window.location.search
  );

  const testScene = Number(
    params.get("scene")
  );

  const hasTestScene =
    Number.isInteger(testScene) &&
    testScene >= 0 &&
    testScene < scenes.length;

  const initialScene = hasTestScene
    ? testScene
    : 0;

  const [scene, setScene] =
    useState(initialScene);

  const [photos, setPhotos] = useState([
    null,
    null,
    null,
  ]);

  const CurrentScene =
    scenes[scene];

  const nextScene = () => {
    setScene((current) =>
      Math.min(
        current + 1,
        scenes.length - 1
      )
    );
  };

  return (
    <main className="app-shell">

      <div
        className="global-vignette"
        aria-hidden="true"
      />

      <div
        className="global-grain"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="scene-wrapper"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.85,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <CurrentScene
            onNext={nextScene}
            photos={photos}
            setPhotos={setPhotos}
          />
        </motion.div>
      </AnimatePresence>

      {/* ==========================================
          DEVELOPMENT TEST PANEL
          
          Hanya muncul kalau ?scene=...
      =========================================== */}

      {hasTestScene && (
        <div
          className="dev-scene-panel"
        >
          <div className="dev-scene-title">
            TEST SCENE
          </div>

          <div className="dev-scene-current">
            {String(scene + 1).padStart(
              2,
              "0"
            )}
            {" — "}
            {sceneNames[scene]}
          </div>

          <div className="dev-scene-buttons">
            {scenes.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    scene === index
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setScene(index)
                  }
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}

    </main>
  );
}