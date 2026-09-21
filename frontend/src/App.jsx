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

const transitionVariants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};

export default function App() {
  const [scene, setScene] = useState(0);

  const [photos, setPhotos] = useState([
    null,
    null,
    null,
  ]);

  const CurrentScene = scenes[scene];

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
            duration: 0.65,
            ease: "easeInOut",
          }}
        >
          <CurrentScene
            onNext={nextScene}
            photos={photos}
            setPhotos={setPhotos}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}