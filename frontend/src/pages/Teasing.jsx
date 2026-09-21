import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  "aku sebenarnya sempat mikir, perlu nggak sih bikin sesuatu kayak gini.",
  "soalnya kalau cuma bilang sesuatu lewat chat, rasanya terlalu biasa.",
  "jadi kali ini aku pengin kamu berhenti sebentar, duduk tenang, dan baca ini pelan-pelan.",
  "nggak ada maksud yang aneh-aneh.",
  "aku cuma pengin bikin sesuatu yang bisa kamu buka, lihat, dan mungkin... senyum sedikit.",
  "karena ya...",
  "kamu pantas dapet sesuatu yang dibuat khusus buat kamu.",
];

export default function Teasing({ onNext }) {
  const [visibleLines, setVisibleLines] = useState(0);
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
    setVisibleLines(typingLine);

    const typingInterval = setInterval(() => {
      characterIndex += 1;

      setDisplayedText(
        currentLine.slice(0, characterIndex)
      );

      if (characterIndex >= currentLine.length) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setTypingLine((current) => current + 1);
        }, 420);
      }
    }, 62);

    return () => {
      clearInterval(typingInterval);
    };
  }, [typingLine]);

  return (
    <section className="scene scene-teasing">
      <div className="cosmic-background" aria-hidden="true">
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

      <div className="ambient-glow ambient-glow-left" />
      <div className="ambient-glow ambient-glow-right" />

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
                key={line}
                className={`typewriter-line ${
                  isCompleted
                    ? "completed"
                    : isCurrent
                    ? "active"
                    : ""
                }`}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
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
            aria-label="Lanjut ke bagian berikutnya"
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
              ease: [0.22, 1, 0.36, 1],
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