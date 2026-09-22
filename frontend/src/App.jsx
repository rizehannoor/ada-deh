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
import BirthdayLetter from "./pages/BirthdayLetter";

function App() {
  const [photos, setPhotos] = useState([
    null,
    null,
    null,
  ]);

  const [scene, setScene] = useState(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const requestedScene = Number(
      params.get("scene")
    );

    if (
      Number.isInteger(requestedScene) &&
      requestedScene >= 0 &&
      requestedScene <= 9
    ) {
      return requestedScene;
    }

    return 0;
  });

  const nextScene = () => {
    setScene((currentScene) => {
      const nextSceneIndex = currentScene + 1;

      if (nextSceneIndex > 9) {
        return 9;
      }

      return nextSceneIndex;
    });
  };

  const previousScene = () => {
    setScene((currentScene) => {
      const previousSceneIndex =
        currentScene - 1;

      if (previousSceneIndex < 0) {
        return 0;
      }

      return previousSceneIndex;
    });
  };

  const goToScene = (targetScene) => {
    if (
      Number.isInteger(targetScene) &&
      targetScene >= 0 &&
      targetScene <= 9
    ) {
      setScene(targetScene);
    }
  };

  const scenes = [
    <Silence onNext={nextScene} />,

    <Mystery onNext={nextScene} />,

    <Letter onNext={nextScene} />,

    <Teasing onNext={nextScene} />,

    <GameTransition onNext={nextScene} />,

    <MatchingGame onNext={nextScene} />,

    <PhotoTransition onNext={nextScene} />,

    <PhotoUpload
      photos={photos}
      setPhotos={setPhotos}
      onNext={nextScene}
    />,

    <Finale
      photos={photos}
      onNext={nextScene}
    />,

    <BirthdayLetter
      onNext={() => goToScene(9)}
      onBack={() => goToScene(8)}
    />,
  ];

  return (
    <main className="app">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="scene-wrapper"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.65,
            ease: "easeInOut",
          }}
        >
          {scenes[scene]}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default App;