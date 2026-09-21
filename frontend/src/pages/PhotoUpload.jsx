import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const feedbackMessages = [
  "",
  "wkwk, oke.",
  "masih satu lagi.",
  "nah, selesai.",
];

const backgroundStars = [
  { left: "5%", top: "10%", size: 2, delay: 0 },
  { left: "11%", top: "27%", size: 1.5, delay: 1.2 },
  { left: "18%", top: "73%", size: 2, delay: 0.7 },
  { left: "27%", top: "15%", size: 1.5, delay: 1.8 },
  { left: "35%", top: "84%", size: 2, delay: 2.1 },
  { left: "43%", top: "9%", size: 1.5, delay: 0.5 },
  { left: "51%", top: "23%", size: 2, delay: 1.5 },
  { left: "59%", top: "90%", size: 1.5, delay: 0.9 },
  { left: "66%", top: "13%", size: 2, delay: 2.4 },
  { left: "73%", top: "77%", size: 1.5, delay: 1.1 },
  { left: "80%", top: "26%", size: 2, delay: 0.3 },
  { left: "88%", top: "11%", size: 1.5, delay: 1.7 },
  { left: "95%", top: "51%", size: 2, delay: 0.8 },
  { left: "91%", top: "86%", size: 1.5, delay: 2.2 },
  { left: "16%", top: "55%", size: 1.5, delay: 1.4 },
  { left: "4%", top: "64%", size: 2, delay: 2.5 },
  { left: "97%", top: "34%", size: 1.5, delay: 0.4 },
];

/* =========================================================
   PHOTO PROCESSOR
   =========================================================
   Semua foto akan dibuat menjadi rasio 3:4.

   Yang penting:
   - Tidak dipaksa menjadi 1200x1600.
   - Resolusi hasil mengikuti hasil crop dari foto asli.
   - Tidak melakukan upscale.
   - Kualitas JPEG 98%.
========================================================= */

function cropImageToThreeByFour(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const sourceWidth = image.naturalWidth;
        const sourceHeight = image.naturalHeight;

        if (!sourceWidth || !sourceHeight) {
          reject(
            new Error("Resolusi foto tidak valid.")
          );
          return;
        }

        const targetRatio = 3 / 4;
        const sourceRatio =
          sourceWidth / sourceHeight;

        let cropWidth;
        let cropHeight;
        let cropX;
        let cropY;

        /*
         * FOTO LEBIH LEBAR DARI 3:4
         *
         * Contoh:
         * 4000 x 3000
         *
         * Tinggi dipertahankan.
         * Lebar dipotong dari kiri dan kanan.
         */
        if (sourceRatio > targetRatio) {
          cropHeight = sourceHeight;

          cropWidth = Math.round(
            sourceHeight * targetRatio
          );

          cropX = Math.round(
            (sourceWidth - cropWidth) / 2
          );

          cropY = 0;
        }

        /*
         * FOTO LEBIH TINGGI DARI 3:4
         *
         * Contoh:
         * 3000 x 5000
         *
         * Lebar dipertahankan.
         * Tinggi dipotong dari atas dan bawah.
         */
        else if (sourceRatio < targetRatio) {
          cropWidth = sourceWidth;

          cropHeight = Math.round(
            sourceWidth / targetRatio
          );

          cropX = 0;

          cropY = Math.round(
            (sourceHeight - cropHeight) / 2
          );
        }

        /*
         * FOTO SUDAH 3:4
         *
         * Tidak perlu crop.
         */
        else {
          cropWidth = sourceWidth;
          cropHeight = sourceHeight;

          cropX = 0;
          cropY = 0;
        }

        /*
         * Jangan pernah menghasilkan ukuran 0.
         */
        if (
          cropWidth <= 0 ||
          cropHeight <= 0
        ) {
          reject(
            new Error(
              "Ukuran crop foto tidak valid."
            )
          );

          return;
        }

        const canvas =
          document.createElement("canvas");

        /*
         * Canvas menggunakan resolusi crop asli.
         * Tidak ada resize ke 1200x1600.
         */
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx =
          canvas.getContext("2d");

        if (!ctx) {
          reject(
            new Error(
              "Canvas tidak tersedia."
            )
          );

          return;
        }

        /*
         * Rendering berkualitas tinggi.
         */
        ctx.imageSmoothingEnabled = true;

        ctx.imageSmoothingQuality = "high";

        /*
         * Draw foto ke canvas.
         */
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        /*
         * JPEG kualitas 98%.
         *
         * Ini menjaga kualitas foto tetap tinggi
         * tanpa membuat ukuran file PNG yang sangat besar.
         */
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  "Gagal membuat file foto."
                )
              );

              return;
            }

            const objectUrl =
              URL.createObjectURL(blob);

            resolve({
              src: objectUrl,
              width: cropWidth,
              height: cropHeight,
              blob,
              ratio: "3:4",
            });
          },
          "image/jpeg",
          0.98
        );
      };

      image.onerror = () => {
        reject(
          new Error(
            "Foto tidak dapat dibaca."
          )
        );
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(
        new Error(
          "File tidak dapat dibaca."
        )
      );
    };

    reader.readAsDataURL(file);
  });
}

/* =========================================================
   BACKGROUND
========================================================= */

function FinaleLikeBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: `
          radial-gradient(
            ellipse at 50% 40%,
            rgba(255, 20, 147, 0.18) 0%,
            rgba(210, 20, 170, 0.10) 25%,
            rgba(100, 20, 120, 0.05) 46%,
            transparent 72%
          ),
          radial-gradient(
            ellipse at 5% 5%,
            rgba(255, 0, 153, 0.22) 0%,
            rgba(190, 0, 145, 0.09) 28%,
            transparent 60%
          ),
          radial-gradient(
            ellipse at 95% 15%,
            rgba(145, 55, 255, 0.22) 0%,
            rgba(100, 30, 190, 0.08) 30%,
            transparent 62%
          ),
          radial-gradient(
            ellipse at 15% 90%,
            rgba(220, 20, 180, 0.14) 0%,
            transparent 55%
          ),
          radial-gradient(
            ellipse at 88% 88%,
            rgba(125, 45, 220, 0.16) 0%,
            transparent 58%
          ),
          linear-gradient(
            145deg,
            #100014 0%,
            #19001f 22%,
            #26002e 46%,
            #19001f 72%,
            #0d0012 100%
          )
        `,
      }}
    >
      {/* Pink ambient */}
      <motion.div
        style={{
          position: "absolute",
          width: "58%",
          height: "58%",
          left: "-20%",
          top: "-22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,20,147,0.17), transparent 68%)",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: [0.55, 0.85, 0.55],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Violet ambient */}
      <motion.div
        style={{
          position: "absolute",
          width: "56%",
          height: "56%",
          right: "-18%",
          top: "-2%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(143,58,255,0.17), transparent 68%)",
          filter: "blur(42px)",
        }}
        animate={{
          opacity: [0.5, 0.82, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Bottom magenta ambient */}
      <motion.div
        style={{
          position: "absolute",
          width: "75%",
          height: "42%",
          left: "12.5%",
          bottom: "-24%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(210,20,180,0.15), transparent 68%)",
          filter: "blur(48px)",
        }}
        animate={{
          opacity: [0.45, 0.72, 0.45],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Tiny stars */}
      {backgroundStars.map((star, index) => (
        <motion.span
          key={index}
          style={{
            position: "absolute",
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background:
              index % 3 === 0
                ? "rgba(255,178,232,0.72)"
                : index % 3 === 1
                ? "rgba(213,178,255,0.68)"
                : "rgba(255,255,255,0.58)",
            boxShadow:
              "0 0 8px rgba(255,100,210,0.45)",
          }}
          animate={{
            opacity: [0.12, 0.72, 0.12],
            scale: [0.7, 1.25, 0.7],
          }}
          transition={{
            duration:
              3.5 + (index % 4) * 0.7,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center atmospheric light */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: "76%",
          height: "64%",
          transform:
            "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,20,147,0.045), transparent 66%)",
          filter: "blur(32px)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "radial-gradient(ellipse at center, transparent 32%, rgba(7,0,12,0.46) 100%)",
        }}
      />
    </div>
  );
}

/* =========================================================
   PHOTO UPLOAD
========================================================= */

export default function PhotoUpload({
  onNext,
  photos,
  setPhotos,
}) {
  const fileInputRefs = useRef([]);

  const [feedback, setFeedback] =
    useState("");

  const openFilePicker = (index) => {
    fileInputRefs.current[index]?.click();
  };

  /* =======================================================
     UPLOAD FOTO
  ======================================================= */

  const handleFileChange = async (
    event,
    index
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback(
        "pilih file foto ya."
      );

      event.target.value = "";

      return;
    }

    try {
      /*
       * Proses foto:
       *
       * foto asli
       * ↓
       * crop 3:4
       * ↓
       * resolusi maksimal
       * ↓
       * JPEG kualitas 98%
       */
      const processedPhoto =
        await cropImageToThreeByFour(
          file
        );

      setPhotos(
        (currentPhotos) => {
          const updatedPhotos = [
            ...currentPhotos,
          ];

          updatedPhotos[index] =
            processedPhoto;

          const uploadedCount =
            updatedPhotos.filter(Boolean)
              .length;

          setFeedback(
            feedbackMessages[
              Math.min(
                uploadedCount,
                feedbackMessages.length -
                  1
              )
            ]
          );

          return updatedPhotos;
        }
      );
    } catch (error) {
      console.error(
        "Gagal memproses foto:",
        error
      );

      setFeedback(
        "foto itu nggak bisa diproses."
      );
    }

    /*
     * Supaya foto yang sama bisa
     * dipilih lagi.
     */
    event.target.value = "";
  };

  /* =======================================================
     REMOVE FOTO
  ======================================================= */

  const removePhoto = (index) => {
    setPhotos(
      (currentPhotos) => {
        const updatedPhotos = [
          ...currentPhotos,
        ];

        const oldPhoto =
          updatedPhotos[index];

        /*
         * Bersihkan object URL.
         */
        if (
          oldPhoto &&
          typeof oldPhoto === "object" &&
          oldPhoto.src
        ) {
          URL.revokeObjectURL(
            oldPhoto.src
          );
        }

        updatedPhotos[index] = null;

        return updatedPhotos;
      }
    );

    setFeedback("");
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const uploadedCount =
    photos.filter(Boolean).length;

  const allPhotosUploaded =
    uploadedCount === 3;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="scene scene-photo-upload"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#100014",
      }}
    >
      {/* =====================================================
          FULL PAGE BACKGROUND
      ====================================================== */}

      <FinaleLikeBackground />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <motion.div
        className="photo-upload-copy"
        style={{
          position: "relative",
          zIndex: 10,
        }}
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
          delay: 0.08,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <div className="photo-upload-eyebrow">
          A LITTLE SOMETHING FROM YOU
        </div>

        <h1>
          taruh 3 foto
          <br />
          <span>
            kamu di sini.
          </span>
        </h1>

        <div className="photo-upload-description">
          <p>
            bisa selfie asal-asalan.
          </p>

          <p>
            bisa foto random di
            galeri kamu.
          </p>

          <p>apapun.</p>
        </div>

        <p className="photo-copy-highlight">
          yang penting itu kamu.
        </p>
      </motion.div>

      {/* =====================================================
          PHOTO SLOTS
      ====================================================== */}

      <motion.div
        className="photo-slots"
        style={{
          position: "relative",
          zIndex: 10,
        }}
        initial={{
          opacity: 0,
          y: 22,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
          delay: 0.24,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        {photos.map(
          (photo, index) => (
            <motion.div
              key={index}
              className={`photo-slot-wrapper ${
                photo
                  ? "has-photo"
                  : ""
              }`}
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                delay:
                  0.32 +
                  index * 0.1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <div
                className={`photo-slot ${
                  photo
                    ? "photo-slot-filled"
                    : "photo-slot-empty-state"
                }`}
              >
                <div className="photo-slot-number">
                  0{index + 1}
                </div>

                <div className="photo-slot-label">
                  MEMORY
                </div>

                {/* =========================================
                    EMPTY
                ========================================== */}

                {!photo && (
                  <button
                    type="button"
                    className="photo-empty"
                    onClick={() =>
                      openFilePicker(
                        index
                      )
                    }
                    aria-label={`Tambah foto ${
                      index + 1
                    }`}
                  >
                    <span className="photo-empty-plus">
                      +
                    </span>

                    <span className="photo-empty-title">
                      add memory
                    </span>

                    <span className="photo-empty-hint">
                      tap to choose
                    </span>
                  </button>
                )}

                {/* =========================================
                    PHOTO
                ========================================== */}

                {photo && (
                  <motion.div
                    className="photo-filled"
                    initial={{
                      opacity: 0,
                      scale: 1.05,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <img
                      src={
                        typeof photo ===
                        "string"
                          ? photo
                          : photo.src
                      }
                      alt={`Memory ${
                        index + 1
                      }`}
                      className="photo-preview"
                      draggable="false"
                    />

                    <div className="photo-image-overlay" />

                    <div className="photo-filled-bottom">
                      <div className="photo-filled-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openFilePicker(
                              index
                            )
                          }
                        >
                          Ganti foto
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(
                              index
                            )
                          }
                        >
                          Hapus foto
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =========================================
                    CORNERS
                ========================================== */}

                <span className="photo-corner photo-corner-tl" />

                <span className="photo-corner photo-corner-tr" />

                <span className="photo-corner photo-corner-bl" />

                <span className="photo-corner photo-corner-br" />
              </div>

              {/* ===========================================
                  FILE INPUT
              ============================================ */}

              <input
                ref={(element) => {
                  fileInputRefs.current[
                    index
                  ] = element;
                }}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleFileChange(
                    event,
                    index
                  )
                }
                hidden
              />
            </motion.div>
          )
        )}
      </motion.div>

      {/* =====================================================
          FEEDBACK
      ====================================================== */}

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            className="photo-upload-feedback"
            style={{
              position: "relative",
              zIndex: 20,
            }}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.4,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          NEXT BUTTON
      ====================================================== */}

      <AnimatePresence>
        {allPhotosUploaded && (
          <motion.button
            type="button"
            className="photo-upload-next"
            style={{
              position: "relative",
              zIndex: 20,
            }}
            onClick={onNext}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
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
            <span className="photo-next-text">
              lanjut
            </span>

            <span className="photo-next-line" />

            <span
              className="photo-next-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}