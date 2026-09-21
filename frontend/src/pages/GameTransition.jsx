import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  "nah...",
  "ada satu hal kecil yang harus kamu selesaikan dulu.",
  "tenang, gampang kok.",
];

export default function GameTransition({ onNext }) {
  const [typingLine, setTypingLine] = useState(0);
  const [displayedText, setDisplayedText] =
    useState("");
  const [isFinished, setIsFinished] =
    useState(false);

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
        currentLine.slice(
          0,
          characterIndex
        )
      );

      if (
        characterIndex >=
        currentLine.length
      ) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setTypingLine(
            (current) => current + 1
          );
        }, 430);
      }
    }, 55);

    return () => {
      clearInterval(typingInterval);
    };
  }, [typingLine]);

  return (
    <section className="scene scene-game-transition">
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
        className="ambient-glow ambient-glow-left"
        aria-hidden="true"
      />

      <div
        className="ambient-glow ambient-glow-right"
        aria-hidden="true"
      />

      <motion.div
        className="flying-cards"
        aria-hidden="true"
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <motion.div
              key={index}
              className={`transition-card card-${index}`}
              animate={{
                y: [0, -8, 0],
                rotate: [
                  index % 2 === 0
                    ? -3
                    : 3,
                  index % 2 === 0
                    ? -1
                    : 1,
                  index % 2 === 0
                    ? -3
                    : 3,
                ],
              }}
              transition={{
                duration:
                  4 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.15,
              }}
            />
          )
        )}
      </motion.div>

      <div className="typewriter-content">
        <div className="typewriter-lines">
          {lines.map((line, index) => {
            const isCompleted =
              index < typingLine;

            const isCurrent =
              index === typingLine;

            if (
              index > typingLine &&
              !isFinished
            ) {
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
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {text}

                {isCurrent &&
                  !isCompleted &&
                  !isFinished && (
                    <span
                      className="typewriter-cursor"
                      aria-hidden="true"
                    />
                  )}
              </motion.div>
            );
          })}
        </div>

        {isFinished && (
          <motion.button
            type="button"
            className="editorial-navigation"
            onClick={onNext}
            aria-label="Lanjut ke game"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <span className="editorial-arrow">
              <span className="editorial-line" />

              <span className="editorial-arrow-symbol">
                →
              </span>
            </span>
          </motion.button>
        )}
      </div>
    </section>
  );
}