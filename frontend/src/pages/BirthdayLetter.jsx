import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LETTER_PAGES = [
  {
    number: "01",
    section: "A LITTLE LETTER",
    title: "for you, Tari.",
    subtitle: "just a few things I wanted to say",
    text: `Aku sebenarnya nggak terlalu pandai menyusun kata-kata seperti ini.

Biasanya aku lebih suka bercanda, jahilin kamu, atau bikin kamu ngambek. Tapi kali ini aku mau sedikit serius.

Jadi sebelum semuanya selesai, aku mau ninggalin beberapa kalimat kecil yang mungkin bisa kamu baca lagi kapan pun kamu mau.`,
    quote: "Some things are easier to write than to say.",
  },

  {
    number: "02",
    section: "THE LITTLE THINGS",
    title: "tentang kamu.",
    subtitle: "the things that make you, you",
    text: `Ada banyak hal kecil tentang kamu yang mungkin kelihatannya biasa saja.

Cara kamu membalas pesan, cara kamu tiba-tiba ngambek, cara kamu bercanda, bahkan hal-hal kecil yang mungkin kamu sendiri nggak sadar.

Tapi justru dari hal-hal kecil itu, kamu jadi seseorang yang terasa berbeda.`,
    quote: "It is always the little things that stay.",
  },

  {
    number: "03",
    section: "SOMEWHERE BETWEEN",
    title: "obrolan dan cerita.",
    subtitle: "somewhere between jokes and everything else",
    text: `Mungkin awalnya cuma obrolan biasa.

Sedikit bercanda, sedikit saling ganggu, sedikit kode-kodean yang kadang bikin bingung.

Tapi entah sejak kapan, semua percakapan kecil itu mulai punya tempatnya sendiri.

Dan ternyata, beberapa orang memang datang tanpa rencana, lalu perlahan menjadi bagian dari cerita.`,
    quote: "Maybe some stories begin without us realizing it.",
  },

  {
    number: "04",
    section: "FOR THE YEAR AHEAD",
    title: "semoga selalu baik.",
    subtitle: "for everything waiting ahead",
    text: `Di umur yang baru ini, aku cuma berharap semoga banyak hal baik datang ke kamu.

Semoga kamu selalu punya alasan untuk tersenyum, orang-orang yang membuat kamu merasa nyaman, dan keberanian untuk mengejar apa pun yang kamu inginkan.

Kalau nanti ada hari yang terasa berat, semoga kamu selalu ingat kalau kamu sudah melewati banyak hal sampai sejauh ini.`,
    quote: "May the next chapter be gentle with you.",
  },

  {
    number: "05",
    section: "ONE LAST THING",
    title: "selamat ulang tahun.",
    subtitle: "and thank you for being here",
    text: `Terima kasih sudah menjadi bagian kecil dari cerita yang mungkin awalnya nggak pernah kita rencanakan.

Maaf kalau selama ini aku sering jahilin kamu sampai ngambek.

Tapi mungkin justru itu salah satu hal kecil yang akan selalu aku ingat.

Selamat ulang tahun, Tari.

Semoga tahun ini membawa banyak cerita baik untuk kamu.`,
    quote: "For you, today and all the little days after.",
    signature: "— Rizehan",
  },
];

export default function BirthdayLetter({
  onNext,
  onBack,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const changePage = (nextPage, nextDirection) => {
    if (isAnimating) return;

    if (
      nextPage < 0 ||
      nextPage >= LETTER_PAGES.length
    ) {
      return;
    }

    setDirection(nextDirection);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentPage(nextPage);
    }, 520);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1750);
  };

  const handleNext = () => {
    if (
      currentPage <
      LETTER_PAGES.length - 1
    ) {
      changePage(
        currentPage + 1,
        1
      );

      return;
    }

    if (typeof onNext === "function") {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      changePage(
        currentPage - 1,
        -1
      );

      return;
    }

    if (typeof onBack === "function") {
      onBack();
    }
  };

  const handleMemoryBack = () => {
    if (isAnimating) return;

    if (typeof onBack === "function") {
      onBack();
    }
  };

  const page = LETTER_PAGES[currentPage];

  return (
    <section className="birthday-letter-scene">

      {/* =====================================================
          BRIGHT PURPLE BACKGROUND
      ===================================================== */}

      <div className="birthday-letter-background">

        <div
          className="
            birthday-letter-glow
            birthday-letter-glow-one
          "
        />

        <div
          className="
            birthday-letter-glow
            birthday-letter-glow-two
          "
        />

        <div
          className="
            birthday-letter-glow
            birthday-letter-glow-three
          "
        />

      </div>


      {/* =====================================================
          FLOATING HEARTS
      ===================================================== */}

      <div className="birthday-letter-hearts">

        {Array.from({ length: 18 }).map(
          (_, index) => (
            <span
              key={index}
              className="birthday-letter-floating-heart"
              style={{
                "--heart-delay": `${index * 0.7}s`,
                "--heart-left": `${(index * 19) % 100}%`,
                "--heart-size": `${8 + (index % 4) * 3}px`,
              }}
            >
              ♥
            </span>
          )
        )}

      </div>


      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="birthday-letter-topbar">

        <div className="birthday-letter-topbar-left">
          <span className="birthday-letter-small-label">
            A LETTER
          </span>
        </div>


        <div className="birthday-letter-topbar-center">

          <span>
            {String(
              currentPage + 1
            ).padStart(2, "0")}
          </span>

          <span className="birthday-letter-topbar-slash">
            /
          </span>

          <span>
            {String(
              LETTER_PAGES.length
            ).padStart(2, "0")}
          </span>

        </div>


        <div className="birthday-letter-topbar-right">

          <span className="birthday-letter-small-label">
            FOR YOU
          </span>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="birthday-letter-main">

        <motion.div
          className="birthday-letter-paper-stage"

          initial={{
            opacity: 0,
            scaleX: 0.72,
            scaleY: 0.96,
          }}

          animate={{
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
          }}

          transition={{
            opacity: {
              duration: 0.8,
              ease: "easeOut",
            },

            scaleX: {
              duration: 1.4,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            },

            scaleY: {
              duration: 1.2,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >

          {/* =================================================
              LETTER PAGE
          ================================================= */}

          <AnimatePresence
            mode="wait"
            custom={direction}
          >

            <motion.article
              key={currentPage}
              className="birthday-letter-page"
              custom={direction}

              initial={(animationDirection) => ({
                opacity: 0,

                clipPath:
                  animationDirection > 0
                    ? "inset(0 0 0 100%)"
                    : "inset(0 100% 0 0)",

                x:
                  animationDirection > 0
                    ? 35
                    : -35,

                scaleX: 0.97,
                scaleY: 0.995,
              })}

              animate={{
                opacity: 1,

                clipPath:
                  "inset(0 0 0 0)",

                x: 0,

                scaleX: 1,
                scaleY: 1,
              }}

              exit={(animationDirection) => ({
                opacity: 0,

                clipPath:
                  animationDirection > 0
                    ? "inset(0 100% 0 0)"
                    : "inset(0 0 0 100%)",

                x:
                  animationDirection > 0
                    ? -35
                    : 35,

                scaleX: 0.98,
                scaleY: 0.995,
              })}

              transition={{
                opacity: {
                  duration: 0.45,
                  delay: 0.18,
                  ease: "easeOut",
                },

                clipPath: {
                  duration: 1.15,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                },

                x: {
                  duration: 1.15,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                },

                scaleX: {
                  duration: 1.15,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                },

                scaleY: {
                  duration: 1.15,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
            >

              <div className="birthday-letter-page-inner">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="birthday-letter-page-header">

                  <span className="birthday-letter-page-number">
                    {page.number}
                  </span>

                  <span className="birthday-letter-page-section">
                    {page.section}
                  </span>

                </div>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <div className="birthday-letter-page-content">

                  {/* TITLE */}

                  <motion.h2
                    className="birthday-letter-heading"

                    initial={{
                      opacity: 0,
                      y: 18,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.7,
                      delay: 0.7,
                      ease: "easeOut",
                    }}
                  >
                    {page.title}
                  </motion.h2>


                  {/* SUBTITLE */}

                  <motion.p
                    className="birthday-letter-subtitle"

                    initial={{
                      opacity: 0,
                      y: 12,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.7,
                      delay: 0.82,
                      ease: "easeOut",
                    }}
                  >
                    {page.subtitle}
                  </motion.p>


                  {/* DIVIDER */}

                  <motion.div
                    className="birthday-letter-divider"

                    initial={{
                      width: 0,
                      opacity: 0,
                    }}

                    animate={{
                      width: "100%",
                      opacity: 1,
                    }}

                    transition={{
                      duration: 0.8,
                      delay: 0.95,
                      ease: "easeOut",
                    }}
                  />


                  {/* BODY */}

                  <motion.p
                    className="birthday-letter-text"

                    initial={{
                      opacity: 0,
                      y: 15,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.8,
                      delay: 1.05,
                      ease: "easeOut",
                    }}
                  >
                    {page.text}
                  </motion.p>


                  {/* QUOTE */}

                  <motion.div
                    className="birthday-letter-quote"

                    initial={{
                      opacity: 0,
                      y: 12,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.8,
                      delay: 1.22,
                      ease: "easeOut",
                    }}
                  >

                    <span className="birthday-letter-quote-mark">
                      “
                    </span>

                    <span>
                      {page.quote}
                    </span>

                  </motion.div>


                  {/* SIGNATURE */}

                  {page.signature && (
                    <motion.div
                      className="birthday-letter-signature"

                      initial={{
                        opacity: 0,
                      }}

                      animate={{
                        opacity: 1,
                      }}

                      transition={{
                        duration: 0.8,
                        delay: 1.4,
                      }}
                    >
                      {page.signature}
                    </motion.div>
                  )}

                </div>


                {/* =================================================
                    PAGE FOOTER
                ================================================= */}

                <div className="birthday-letter-page-footer">

                  <span>
                    with a little sincerity
                  </span>

                  <span>
                    ♥
                  </span>

                </div>

              </div>

            </motion.article>

          </AnimatePresence>


          {/* =====================================================
              NAVIGATION
          ===================================================== */}

          <div className="birthday-letter-navigation">

            {/* BACK */}

            {currentPage > 0 ? (
              <button
                type="button"
                className="
                  birthday-letter-nav-button
                  birthday-letter-back
                "
                onClick={handleBack}
                disabled={isAnimating}
                aria-label="Previous page"
              >
                <span className="birthday-letter-arrow">
                  ←
                </span>
              </button>
            ) : (
              <div />
            )}


            {/* PAGE INDICATOR */}

            <div className="birthday-letter-navigation-center">

              <div className="birthday-letter-dots">

                {LETTER_PAGES.map(
                  (_, index) => (
                    <span
                      key={index}
                      className={`birthday-letter-dot ${
                        index === currentPage
                          ? "active"
                          : ""
                      }`}
                    />
                  )
                )}

              </div>


              <div className="birthday-letter-count">

                {String(
                  currentPage + 1
                ).padStart(2, "0")}

                {" "}

                /

                {" "}

                {String(
                  LETTER_PAGES.length
                ).padStart(2, "0")}

              </div>

            </div>


            {/* NEXT */}

            {currentPage <
            LETTER_PAGES.length - 1 ? (
              <button
                type="button"
                className="
                  birthday-letter-nav-button
                  birthday-letter-next
                "
                onClick={handleNext}
                disabled={isAnimating}
                aria-label="Next page"
              >
                <span className="birthday-letter-arrow">
                  →
                </span>
              </button>
            ) : (
              <div />
            )}

          </div>


          {/* =====================================================
              BACK TO MEMORY
          ===================================================== */}

          <button
            type="button"
            className="birthday-letter-memory-link"
            onClick={handleMemoryBack}
            disabled={isAnimating}
            aria-label="Back to memory"
          >
            <span className="birthday-letter-memory-text">
              BACK TO MEMORY
            </span>
          </button>


          {/* =====================================================
              CENTER HEART
          ===================================================== */}

          <div className="birthday-letter-center-heart">
            ♡
          </div>

        </motion.div>

      </main>


      {/* =====================================================
          BOTTOM NOTE
      ===================================================== */}

      <div className="birthday-letter-bottom-note">

        <span>
          take your time.
        </span>

      </div>

    </section>
  );
}