import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const lines = [
  "nah, sekarang bagian kamu.",
  "dari tadi aku yang banyak ngomong.",
  "sekarang gantian aku mau lihat pilihan kamu.",
  "cari tiga foto.",
  "bebas mau foto apa.",
  "tapi jangan foto KTP ya wkwk.",
];

export default function PhotoTransition({ onNext }) {
  const [typingLine, setTypingLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (typingLine >= lines.length) {
      setIsFinished(true);
      return;
    }

    const currentLine = lines[typingLine];
    let characterIndex = 0;

    setDisplayedText("");

    const typingInterval = setInterval(() => {
      characterIndex += 1;

      setDisplayedText(
        currentLine.slice(0, characterIndex)
      );

      if (characterIndex >= currentLine.length) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setTypingLine((current) => current + 1);
        }, 430);
      }
    }, 55);

    return () => clearInterval(typingInterval);
  }, [typingLine]);

  return (
    <section className="scene scene-photo-transition">
      <div
        className="cosmic-background"
        aria-hidden="true"
      >
        <div className="cosmic-nebula cosmic-nebula-one" />
        <div className="cosmic-nebula cosmic-nebula-two" />
        <div className="cosmic-nebula cosmic-nebula-three" />

        <div className="cosmic-stars cosmic-stars-one" />
        <div className="cosmic-stars cosmic-stars-two" />

        <div className="cosmic-moon" />

        <div className="cosmic-horizon" />
        <div className="cosmic-vignette" />
        <div className="cosmic-grain" />
      </div>

      <div
        className="photo-transition-glow"
        aria-hidden="true"
      />

      <div className="typewriter-content">
        <div className="typewriter-lines">
          {lines.map((line, index) => {
            const isCompleted = index < typingLine;
            const isCurrent = index === typingLine;

            if (index > typingLine) {
              return null;
            }

            let text = "";

            if (isCompleted) {
              text = line;
            } else if (isCurrent) {
              text = displayedText;
            }

            return (
              <motion.div
                key={`${line}-${index}`}
                className={`typewriter-line ${
                  isCompleted
                    ? "completed"
                    : isCurrent
                    ? "active"
                    : ""
                }`}
                initial={{
                  opacity: 0,
                  x: -12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {text}

                {isCurrent && (
                  <span
                    className="typewriter-cursor"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {isFinished && (
            <motion.div
  className="photo-transition-next"
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{
    duration: 0.8,
    delay: 0.15,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  <button
    type="button"
    className="photo-transition-next-button"
    onClick={onNext}
    aria-label="Lanjut"
  >
    <span className="photo-next-button-line" />
    <span className="photo-next-button-arrow">
      →
    </span>
  </button>
</motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}