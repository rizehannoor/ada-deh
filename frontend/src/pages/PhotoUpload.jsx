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

function cropImageToThreeByFour(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const sourceWidth = image.naturalWidth;
        const sourceHeight = image.naturalHeight;

        if (!sourceWidth || !sourceHeight) {
          reject(new Error("Resolusi foto tidak valid."));
          return;
        }

        const targetRatio = 3 / 4;
        const sourceRatio = sourceWidth / sourceHeight;

        let cropWidth;
        let cropHeight;
        let cropX;
        let cropY;

        if (sourceRatio > targetRatio) {
          cropHeight = sourceHeight;
          cropWidth = Math.round(sourceHeight * targetRatio);

          cropX = Math.round((sourceWidth - cropWidth) / 2);
          cropY = 0;
        } else if (sourceRatio < targetRatio) {
          cropWidth = sourceWidth;
          cropHeight = Math.round(sourceWidth / targetRatio);

          cropX = 0;
          cropY = Math.round((sourceHeight - cropHeight) / 2);
        } else {
          cropWidth = sourceWidth;
          cropHeight = sourceHeight;
          cropX = 0;
          cropY = 0;
        }

        if (cropWidth <= 0 || cropHeight <= 0) {
          reject(new Error("Ukuran crop foto tidak valid."));
          return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas tidak tersedia."));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

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

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal membuat file foto."));
              return;
            }

            const objectUrl = URL.createObjectURL(blob);

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
        reject(new Error("Foto tidak dapat dibaca."));
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error("File tidak dapat dibaca."));
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
      className="photo-upload-background"
      aria-hidden="true"
    >
      <div className="photo-upload-cosmic-base" />

      <div className="photo-upload-cosmic-nebula photo-upload-cosmic-nebula-one" />

      <div className="photo-upload-cosmic-nebula photo-upload-cosmic-nebula-two" />

      <div className="photo-upload-cosmic-nebula photo-upload-cosmic-nebula-three" />

      <motion.div
        className="photo-upload-ambient-glow photo-upload-ambient-glow-left"
        animate={{
          opacity: [0.16, 0.28, 0.16],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="photo-upload-ambient-glow photo-upload-ambient-glow-right"
        animate={{
          opacity: [0.12, 0.24, 0.12],
          scale: [1, 1.07, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <motion.div
        className="photo-upload-ambient-glow photo-upload-ambient-glow-bottom"
        animate={{
          opacity: [0.08, 0.17, 0.08],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="photo-upload-cosmic-stars photo-upload-cosmic-stars-one" />

      <div className="photo-upload-cosmic-stars photo-upload-cosmic-stars-two" />

      {backgroundStars.map((star, index) => (
        <motion.span
          key={index}
          className="photo-upload-bg-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.06, 0.32, 0.06],
            scale: [0.7, 1.15, 0.7],
          }}
          transition={{
            duration: 4 + (index % 4) * 0.7,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="photo-upload-floating-hearts">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="photo-upload-floating-heart"
            style={{
              "--heart-left": `${(index * 23) % 100}%`,
              "--heart-delay": `${index * 1.6}s`,
              "--heart-size": `${6 + (index % 3) * 2}px`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="photo-upload-bg-center" />

      <div className="photo-upload-bg-vignette" />

      <div className="photo-upload-bg-grain" />
    </div>
  );
}


/* =========================================================
   MAIN
========================================================= */

export default function PhotoUpload({
  onNext,
  photos,
  setPhotos,
}) {
  const fileInputRefs = useRef([]);

  const [feedback, setFeedback] = useState("");
  const [isNextAnimating, setIsNextAnimating] = useState(false);

  const openFilePicker = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = async (event, index) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback("pilih file foto ya.");
      event.target.value = "";
      return;
    }

    try {
      const processedPhoto =
        await cropImageToThreeByFour(file);

      setPhotos((currentPhotos) => {
        const updatedPhotos = [...currentPhotos];

        updatedPhotos[index] = processedPhoto;

        const uploadedCount =
          updatedPhotos.filter(Boolean).length;

        setFeedback(
          feedbackMessages[
            Math.min(
              uploadedCount,
              feedbackMessages.length - 1
            )
          ]
        );

        return updatedPhotos;
      });
    } catch (error) {
      console.error("Gagal memproses foto:", error);

      setFeedback("foto itu nggak bisa diproses.");
    }

    event.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((currentPhotos) => {
      const updatedPhotos = [...currentPhotos];

      const oldPhoto = updatedPhotos[index];

      if (
        oldPhoto &&
        typeof oldPhoto === "object" &&
        oldPhoto.src
      ) {
        URL.revokeObjectURL(oldPhoto.src);
      }

      updatedPhotos[index] = null;

      return updatedPhotos;
    });

    setFeedback("");
  };

  const uploadedCount =
    photos.filter(Boolean).length;

  const allPhotosUploaded =
    uploadedCount === 3;

  const handleNext = () => {
    if (isNextAnimating) {
      return;
    }

    setIsNextAnimating(true);

    setTimeout(() => {
      if (typeof onNext === "function") {
        onNext();
      }
    }, 520);
  };

  return (
    <section className="scene scene-photo-upload">

      <FinaleLikeBackground />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="photo-upload-content">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          className="photo-upload-copy"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="photo-upload-eyebrow">
            A LITTLE SOMETHING FROM YOU
          </div>

          <div className="photo-upload-divider">
            <span />
            <i />
            <span />
          </div>

          <h1>
            simpan sedikit
            <br />
            <em>tentang kamu.</em>
          </h1>

          <div className="photo-upload-description">
            <p>
              pilih 3 foto yang paling kamu suka.
            </p>

            <p>
              foto random juga boleh.
            </p>

            <p>
              nggak harus sempurna.
            </p>
          </div>

          <div className="photo-upload-instruction">
            <span>
              aku cuma ingin melihat dunia dari sisi kamu.
            </span>
          </div>
        </motion.div>


        {/* ===================================================
            PHOTO GRID
        =================================================== */}

        <motion.div
          className="photo-slots"
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.95,
            delay: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className={`photo-slot-wrapper ${
                photo ? "has-photo" : ""
              }`}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.25 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >

              <div
                className={`photo-slot ${
                  photo
                    ? "photo-slot-filled"
                    : "photo-slot-empty-state"
                }`}
              >

                {/* TOP META */}

                <div className="photo-slot-meta">
                  <span className="photo-slot-number">
                    0{index + 1}
                  </span>

                  <span className="photo-slot-label">
                    MEMORY
                  </span>
                </div>


                {/* EMPTY */}

                {!photo && (
                  <button
                    type="button"
                    className="photo-empty"
                    onClick={() =>
                      openFilePicker(index)
                    }
                    aria-label={`Tambah foto ${
                      index + 1
                    }`}
                  >
                    <span className="photo-empty-plus">
                      +
                    </span>

                    <span className="photo-empty-title">
                      ADD A PHOTO
                    </span>

                    <span className="photo-empty-hint">
                      tap to choose
                    </span>
                  </button>
                )}


                {/* FILLED */}

                {photo && (
                  <motion.div
                    className="photo-filled"
                    initial={{
                      opacity: 0,
                      scale: 1.035,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <img
                      src={
                        typeof photo === "string"
                          ? photo
                          : photo.src
                      }
                      alt={`Memory ${index + 1}`}
                      className="photo-preview"
                      draggable="false"
                    />

                    <div className="photo-image-overlay" />

                    <div className="photo-filled-bottom">
                      <div className="photo-filled-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openFilePicker(index)
                          }
                        >
                          Ganti
                        </button>

                        <span />

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(index)
                          }
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}


                {/* CORNERS */}

                <span className="photo-corner photo-corner-tl" />
                <span className="photo-corner photo-corner-tr" />
                <span className="photo-corner photo-corner-bl" />
                <span className="photo-corner photo-corner-br" />

              </div>


              {/* HIDDEN INPUT */}

              <input
                ref={(element) => {
                  fileInputRefs.current[index] =
                    element;
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
          ))}
        </motion.div>


        {/* ===================================================
            PROGRESS
        =================================================== */}

        <motion.div
          className="photo-upload-progress"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.55,
            duration: 0.6,
          }}
        >
          <div className="photo-upload-progress-line">
            <span
              style={{
                width: `${(uploadedCount / 3) * 100}%`,
              }}
            />
          </div>

          <div className="photo-upload-progress-text">
            <span>
              {uploadedCount === 0
                ? "three little memories"
                : `${uploadedCount} of 3 memories`}
            </span>

            <span>
              {uploadedCount === 3
                ? "complete"
                : "your turn"}
            </span>
          </div>
        </motion.div>


        {/* ===================================================
            FEEDBACK
        =================================================== */}

        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback}
              className="photo-upload-feedback"
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>


        {/* ===================================================
            CONTINUE
        =================================================== */}

        <AnimatePresence>
          {allPhotosUploaded && (
            <motion.button
              type="button"
              className={`editorial-navigation ${
                isNextAnimating
                  ? "is-next-moving"
                  : ""
              }`}
              onClick={handleNext}
              disabled={isNextAnimating}
              aria-label="Continue"
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
                duration: 0.65,
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
        </AnimatePresence>

      </div>
    </section>
  );
}