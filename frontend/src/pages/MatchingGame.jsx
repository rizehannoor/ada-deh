import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================
   VISUAL ELEMENTS
========================================================= */

const elements = [
  { type: "star", color: "pink" },
  { type: "diamond", color: "violet" },
  { type: "orbit", color: "magenta" },
  { type: "flower", color: "pink" },
  { type: "moon", color: "violet" },
  { type: "spark", color: "magenta" },
  { type: "ring", color: "pink" },
  { type: "cross", color: "violet" },
  { type: "petal", color: "magenta" },
  { type: "halo", color: "pink" },
  { type: "wave", color: "violet" },
  { type: "constellation", color: "magenta" },
];

/* =========================================================
   CREATE CARDS
========================================================= */

function createCards() {
  const result = [];

  elements.forEach((element, index) => {
    result.push({
      id: `${index}-one`,
      pair: index,
      element,
    });

    result.push({
      id: `${index}-two`,
      pair: index,
      element,
    });
  });

  return result;
}

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleCards(cards) {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[random]] = [
      shuffled[random],
      shuffled[i],
    ];
  }

  return shuffled;
}

/* =========================================================
   VISUAL ELEMENT
========================================================= */

function VisualElement({ type, color }) {
  return (
    <span
      className={`game-element game-element-${type} game-element-${color}`}
      aria-hidden="true"
    >
      {type === "star" && (
        <>
          <span className="element-star-main">✦</span>
          <span className="element-star-glow" />
        </>
      )}

      {type === "diamond" && (
        <>
          <span className="element-diamond-outer" />
          <span className="element-diamond-inner" />
        </>
      )}

      {type === "orbit" && (
        <>
          <span className="element-orbit-core" />
          <span className="element-orbit-ring one" />
          <span className="element-orbit-ring two" />
          <span className="element-orbit-dot" />
        </>
      )}

      {type === "flower" && (
        <>
          <span className="element-flower-petal one" />
          <span className="element-flower-petal two" />
          <span className="element-flower-petal three" />
          <span className="element-flower-petal four" />
          <span className="element-flower-center" />
        </>
      )}

      {type === "moon" && (
        <>
          <span className="element-moon-body" />
          <span className="element-moon-cut" />

          <span className="element-moon-star one">
            ✦
          </span>

          <span className="element-moon-star two">
            ·
          </span>
        </>
      )}

      {type === "spark" && (
        <>
          <span className="element-spark-main">✧</span>

          <span className="element-spark-dot one">·</span>
          <span className="element-spark-dot two">·</span>
          <span className="element-spark-dot three">·</span>
        </>
      )}

      {type === "ring" && (
        <>
          <span className="element-ring-outer" />
          <span className="element-ring-inner" />
          <span className="element-ring-dot" />
        </>
      )}

      {type === "cross" && (
        <>
          <span className="element-cross-horizontal" />
          <span className="element-cross-vertical" />
          <span className="element-cross-center" />
        </>
      )}

      {type === "petal" && (
        <>
          <span className="element-petal one" />
          <span className="element-petal two" />
          <span className="element-petal three" />
          <span className="element-petal four" />
        </>
      )}

      {type === "halo" && (
        <>
          <span className="element-halo-outer" />
          <span className="element-halo-middle" />
          <span className="element-halo-core" />
        </>
      )}

      {type === "wave" && (
        <>
          <span className="element-wave one" />
          <span className="element-wave two" />
          <span className="element-wave three" />
        </>
      )}

      {type === "constellation" && (
        <>
          <span className="element-constellation-line one" />
          <span className="element-constellation-line two" />
          <span className="element-constellation-line three" />

          <span className="element-constellation-dot one" />
          <span className="element-constellation-dot two" />
          <span className="element-constellation-dot three" />
          <span className="element-constellation-dot four" />
        </>
      )}
    </span>
  );
}

/* =========================================================
   MATCHING GAME
========================================================= */

export default function MatchingGame({ onNext }) {
  const cards = useMemo(
    () => shuffleCards(createCards()),
    []
  );

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [feedback, setFeedback] = useState("");

  /*
    playing
      = game normal

    leaving
      = semua pasangan selesai,
        scene langsung fade out
  */
  const [completionStage, setCompletionStage] =
    useState("playing");

  const compareTimer = useRef(null);
  const leaveTimer = useRef(null);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (compareTimer.current) {
        clearTimeout(compareTimer.current);
      }

      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
      }
    };
  }, []);

  /* =======================================================
     COMPLETION
  ======================================================= */

  useEffect(() => {
    if (
      matched.length === cards.length &&
      cards.length > 0 &&
      completionStage === "playing"
    ) {
      setLocked(true);
      setFeedback("");

      /*
        Beri sedikit waktu agar pasangan terakhir
        selesai terlihat, kemudian langsung fade out.
      */

      leaveTimer.current = setTimeout(() => {
        setCompletionStage("leaving");
      }, 450);
    }
  }, [
    matched,
    cards.length,
    completionStage,
  ]);

  useEffect(() => {
    if (completionStage !== "leaving") {
      return;
    }

    /*
      Tunggu fade-out selesai,
      kemudian pindah ke scene berikutnya.
    */

    const timer = setTimeout(() => {
      onNext();
    }, 800);

    return () => clearTimeout(timer);
  }, [completionStage, onNext]);

  /* =======================================================
     CARD CLICK
  ======================================================= */

  const handleCardClick = useCallback(
    (card) => {
      if (locked) return;

      if (completionStage !== "playing") {
        return;
      }

      if (flipped.includes(card.id)) {
        return;
      }

      if (matched.includes(card.id)) {
        return;
      }

      if (flipped.length >= 2) {
        return;
      }

      setFeedback("");

      const nextFlipped = [
        ...flipped,
        card.id,
      ];

      setFlipped(nextFlipped);

      /* FIRST CARD */

      if (nextFlipped.length === 1) {
        return;
      }

      /* SECOND CARD */

      const firstCard = cards.find(
        (item) =>
          item.id === nextFlipped[0]
      );

      const secondCard = cards.find(
        (item) =>
          item.id === nextFlipped[1]
      );

      if (!firstCard || !secondCard) {
        setFlipped([]);
        return;
      }

      setLocked(true);

      setAttempts(
        (current) => current + 1
      );

      /* MATCH */

      if (
        firstCard.pair ===
        secondCard.pair
      ) {
        setFeedback("that's it.");

        compareTimer.current =
          setTimeout(() => {
            setMatched((current) => [
              ...current,
              firstCard.id,
              secondCard.id,
            ]);

            setFlipped([]);
            setLocked(false);
          }, 500);

        return;
      }

      /* WRONG */

      setWrong(
        (current) => current + 1
      );

      setFeedback("not quite.");

      compareTimer.current =
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
          setFeedback("");
        }, 900);
    },
    [
      cards,
      flipped,
      matched,
      locked,
      completionStage,
    ]
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className={`scene scene-game ${
        completionStage === "leaving"
          ? "game-leaving"
          : ""
      }`}
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

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

      {/* =================================================
          GLOW
      ================================================= */}

      <div
        className="ambient-glow ambient-glow-left"
        aria-hidden="true"
      />

      <div
        className="ambient-glow ambient-glow-right"
        aria-hidden="true"
      />

      {/* =================================================
          GAME EXPERIENCE
      ================================================= */}

      <AnimatePresence mode="wait">
        {completionStage === "playing" && (
          <motion.div
            key="game"
            className="matching-experience"
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
            {/* HEADER */}

            <motion.header
              className="matching-header"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="matching-small-title">
                A LITTLE GAME
              </div>

              <h1 className="matching-main-title">
                cari yang sama.
              </h1>
            </motion.header>

            {/* STATUS */}

            <motion.div
              className="matching-info"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
            >
              <div className="game-stat">
                <span>ATTEMPTS</span>

                <strong>
                  {String(
                    attempts
                  ).padStart(2, "0")}
                </strong>
              </div>

              <span className="game-stat-divider" />

              <div className="game-stat">
                <span>WRONG</span>

                <strong>
                  {String(
                    wrong
                  ).padStart(2, "0")}
                </strong>
              </div>

              <span className="game-stat-divider" />

              <div className="game-stat">
                <span>FOUND</span>

                <strong>
                  {String(
                    matched.length / 2
                  ).padStart(2, "0")}

                  <small>/12</small>
                </strong>
              </div>
            </motion.div>

            {/* FEEDBACK */}

            <div
              className="matching-feedback"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.span
                    key={feedback}
                    initial={{
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                  >
                    {feedback}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* CARD GRID */}

            <motion.div
              className="matching-grid"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {cards.map(
                (card, index) => {
                  const isFlipped =
                    flipped.includes(
                      card.id
                    ) ||
                    matched.includes(
                      card.id
                    );

                  const isMatched =
                    matched.includes(
                      card.id
                    );

                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      className={`memory-card ${
                        isFlipped
                          ? "is-flipped"
                          : ""
                      } ${
                        isMatched
                          ? "is-matched"
                          : ""
                      }`}
                      onClick={() =>
                        handleCardClick(
                          card
                        )
                      }
                      disabled={
                        locked ||
                        isMatched ||
                        isFlipped
                      }
                      aria-label="Kartu permainan"
                      initial={{
                        opacity: 0,
                        y: 12,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.45,
                        delay:
                          0.18 +
                          index * 0.025,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      whileHover={{
                        y:
                          locked ||
                          isFlipped
                            ? 0
                            : -5,
                        scale:
                          locked ||
                          isFlipped
                            ? 1
                            : 1.025,
                      }}
                      whileTap={{
                        scale:
                          locked ||
                          isFlipped
                            ? 1
                            : 0.96,
                      }}
                    >
                      <span className="card-inner">

                        {/* FRONT */}

                        <span className="card-front">
                          <span className="card-front-glow" />

                          <span className="card-front-decoration decoration-one" />

                          <span className="card-front-decoration decoration-two" />

                          <span className="card-front-decoration decoration-three" />

                          <span className="card-front-center">
                            <span className="card-front-center-ring">
                              <span />
                            </span>
                          </span>

                          <span className="card-front-shine" />
                        </span>

                        {/* BACK */}

                        <span className="card-back">
                          <span className="card-back-glow" />

                          <VisualElement
                            type={
                              card.element.type
                            }
                            color={
                              card.element.color
                            }
                          />

                          <span className="card-back-shine" />
                        </span>

                      </span>
                    </motion.button>
                  );
                }
              )}
            </motion.div>

            {/* HINT */}

            <motion.div
              className="matching-hint"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.7,
              }}
            >
              find the matching elements
            </motion.div>
          </motion.div>
        )}

        {/* =================================================
            LEAVING
        ================================================= */}

        {completionStage === "leaving" && (
          <motion.div
            key="leaving"
            className="matching-leaving-overlay"
            initial={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(18px)",
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}