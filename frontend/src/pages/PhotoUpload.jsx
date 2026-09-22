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

        if (sourceRatio > targetRatio) {
          cropHeight = sourceHeight;
          cropWidth = Math.round(
            sourceHeight * targetRatio
          );

          cropX = Math.round(
            (sourceWidth - cropWidth) / 2
          );

          cropY = 0;
        } else if (sourceRatio < targetRatio) {
          cropWidth = sourceWidth;
          cropHeight = Math.round(
            sourceWidth / targetRatio
          );

          cropX = 0;

          cropY = Math.round(
            (sourceHeight - cropHeight) / 2
          );
        } else {
          cropWidth = sourceWidth;
          cropHeight = sourceHeight;
          cropX = 0;
          cropY = 0;
        }

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

function FinaleLikeBackground() {
  return (
    <div
      className="photo-upload-background"
      aria-hidden="true"
    >
      <div className="photo-upload-bg-glow photo-upload-bg-glow-main" />

      <motion.div
        className="photo-upload-bg-glow photo-upload-bg-glow-pink"
        animate={{
          opacity: [0.34, 0.52, 0.34],
          scale: [1, 1.07, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="photo-upload-bg-glow photo-upload-bg-glow-violet"
        animate={{
          opacity: [0.22, 0.4, 0.22],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <motion.div
        className="photo-upload-bg-glow photo-upload-bg-glow-bottom"
        animate={{
          opacity: [0.2, 0.34, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {backgroundStars.map(
        (star, index) => (
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
              opacity: [0.08, 0.5, 0.08],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration:
                4 + (index % 4) * 0.7,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      )}

      <div className="photo-upload-floating-hearts">
        {Array.from({ length: 10 }).map(
          (_, index) => (
            <span
              key={index}
              className="photo-upload-floating-heart"
              style={{
                "--heart-left": `${
                  (index * 19) % 100
                }%`,
                "--heart-delay": `${
                  index * 1.3
                }s`,
                "--heart-size": `${
                  7 + (index % 3) * 3
                }px`,
              }}
            >
              ♥
            </span>
          )
        )}
      </div>

      <div className="photo-upload-bg-center" />
      <div className="photo-upload-bg-vignette" />
      <div className="photo-upload-bg-grain" />
    </div>
  );
}

export default function PhotoUpload({
  onNext,
  photos,
  setPhotos,
}) {
  const fileInputRefs = useRef([]);

  const [feedback, setFeedback] =
    useState("");

  const [isNextAnimating, setIsNextAnimating] =
    useState(false);

  const openFilePicker = (index) => {
    fileInputRefs.current[index]?.click();
  };

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
      const processedPhoto =
        await cropImageToThreeByFour(file);

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
                feedbackMessages.length - 1
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

    event.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos(
      (currentPhotos) => {
        const updatedPhotos = [
          ...currentPhotos,
        ];

        const oldPhoto =
          updatedPhotos[index];

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

      <motion.div
        className="photo-upload-copy"
        initial={{
          opacity: 0,
          y: 22,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
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

        <div className="photo-upload-title-wrap">
          <h1>
            taruh 3 foto
            <br />
            kamu di sini.
          </h1>
        </div>

        <div className="photo-upload-description">
          <p>
            bisa selfie asal-asalan.
          </p>

          <p>
            bisa foto random di galeri kamu.
          </p>

          <p>
            apapun.
          </p>
        </div>

        <div className="photo-upload-instruction">
          <span>
            yang penting itu kamu.
          </span>
        </div>
      </motion.div>

      <motion.div
        className="photo-slots"
        initial={{
          opacity: 0,
          y: 28,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 0.18,
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
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay:
                  0.3 +
                  index * 0.1,
                ease: "easeOut",
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
                      add memory
                    </span>

                    <span className="photo-empty-hint">
                      tap to choose
                    </span>
                  </button>
                )}

                {photo && (
                  <motion.div
                    className="photo-filled"
                    initial={{
                      opacity: 0,
                      scale: 1.04,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                  >
                    <img
                      src={
                        typeof photo === "string"
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
                            openFilePicker(index)
                          }
                        >
                          Ganti foto
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(index)
                          }
                        >
                          Hapus foto
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <span className="photo-corner photo-corner-tl" />
                <span className="photo-corner photo-corner-tr" />
                <span className="photo-corner photo-corner-bl" />
                <span className="photo-corner photo-corner-br" />
              </div>

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
          )
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            className="photo-upload-feedback"
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.96,
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
              duration: 0.45,
              ease: "easeOut",
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

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
              duration: 0.7,
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
      </AnimatePresence>
    </section>
  );
}