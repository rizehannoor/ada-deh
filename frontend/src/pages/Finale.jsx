import { useState } from "react";
import { motion } from "framer-motion";

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 3000;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Image source is empty."));
      return;
    }

    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error("Failed to load image."));
    };

    image.src = src;
  });
}

function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  const safeRadius = Math.min(
    radius,
    width / 2,
    height / 2
  );

  ctx.beginPath();

  ctx.moveTo(
    x + safeRadius,
    y
  );

  ctx.lineTo(
    x + width - safeRadius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + safeRadius
  );

  ctx.lineTo(
    x + width,
    y + height - safeRadius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );

  ctx.lineTo(
    x + safeRadius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - safeRadius
  );

  ctx.lineTo(
    x,
    y + safeRadius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + safeRadius,
    y
  );

  ctx.closePath();
}

function drawImageCover(
  ctx,
  image,
  x,
  y,
  width,
  height,
  radius = 0
) {
  if (
    !image ||
    width <= 0 ||
    height <= 0
  ) {
    return;
  }

  const imageRatio =
    image.width / image.height;

  const boxRatio =
    width / height;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > boxRatio) {
    sourceWidth =
      image.height * boxRatio;

    sourceX =
      (image.width - sourceWidth) / 2;
  } else {
    sourceHeight =
      image.width / boxRatio;

    sourceY =
      (image.height - sourceHeight) / 2;
  }

  ctx.save();

  if (radius > 0) {
    drawRoundedRect(
      ctx,
      x,
      y,
      width,
      height,
      radius
    );

    ctx.clip();
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );

  ctx.restore();
}

async function createMemoryImage(
  photos
) {
  const canvas =
    document.createElement("canvas");

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas context is unavailable."
    );
  }

  /*
   * =====================================================
   * BACKGROUND
   * =====================================================
   */

  const background =
    ctx.createLinearGradient(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

  background.addColorStop(
    0,
    "#07020c"
  );

  background.addColorStop(
    0.45,
    "#17051e"
  );

  background.addColorStop(
    0.75,
    "#0b0311"
  );

  background.addColorStop(
    1,
    "#030107"
  );

  ctx.fillStyle = background;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  /*
   * =====================================================
   * AMBIENT GLOW
   * =====================================================
   */

  const pinkGlow =
    ctx.createRadialGradient(
      250,
      500,
      0,
      250,
      500,
      850
    );

  pinkGlow.addColorStop(
    0,
    "rgba(255,20,147,0.27)"
  );

  pinkGlow.addColorStop(
    1,
    "rgba(255,20,147,0)"
  );

  ctx.fillStyle = pinkGlow;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  const violetGlow =
    ctx.createRadialGradient(
      2100,
      1450,
      0,
      2100,
      1450,
      900
    );

  violetGlow.addColorStop(
    0,
    "rgba(142,45,255,0.27)"
  );

  violetGlow.addColorStop(
    1,
    "rgba(142,45,255,0)"
  );

  ctx.fillStyle = violetGlow;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  /*
   * =====================================================
   * STARS
   * =====================================================
   */

  const stars = [
    [170, 250, 4],
    [2140, 240, 3],
    [1990, 560, 4],
    [270, 1060, 3],
    [2140, 1840, 4],
    [350, 2250, 3],
    [1880, 2470, 3],
    [1200, 340, 2],
  ];

  ctx.fillStyle =
    "rgba(255,255,255,0.65)";

  stars.forEach(
    ([x, y, size]) => {
      ctx.beginPath();

      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  /*
   * =====================================================
   * HEADER
   * =====================================================
   */

  ctx.textAlign = "center";

  ctx.font =
    '500 28px Arial, sans-serif';

  ctx.fillStyle =
    "rgba(255,255,255,0.52)";

  ctx.fillText(
    "A LITTLE MEMORY FOR YOU",
    CANVAS_WIDTH / 2,
    170
  );

  ctx.font =
    '600 100px Georgia, "Times New Roman", serif';

  ctx.fillStyle = "#ffffff";

  ctx.fillText(
    "selamat ulang tahun, Tari.",
    CANVAS_WIDTH / 2,
    305
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.22)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    820,
    365
  );

  ctx.lineTo(
    1580,
    365
  );

  ctx.stroke();

  /*
   * =====================================================
   * PHOTO POSITIONS
   * =====================================================
   */

  const photoPositions = [
    {
      x: 220,
      y: 500,
      width: 760,
      height: 820,
      rotation: -0.025,
    },
    {
      x: 1420,
      y: 480,
      width: 760,
      height: 820,
      rotation: 0.025,
    },
    {
      x: 620,
      y: 1260,
      width: 1160,
      height: 940,
      rotation: 0,
    },
  ];

  /*
   * =====================================================
   * PHOTOS
   * =====================================================
   */

  for (
    let index = 0;
    index < photoPositions.length;
    index += 1
  ) {
    const photo =
      photos[index];

    if (!photo) {
      continue;
    }

    try {
      const image =
        await loadImage(photo);

      const position =
        photoPositions[index];

      ctx.save();

      ctx.translate(
        position.x +
          position.width / 2,
        position.y +
          position.height / 2
      );

      ctx.rotate(
        position.rotation
      );

      const padding = 22;
      const bottomPadding = 55;

      /*
       * SHADOW
       */

      ctx.shadowColor =
        "rgba(0,0,0,0.60)";

      ctx.shadowBlur = 45;

      ctx.shadowOffsetY = 24;

      /*
       * PHOTO FRAME
       */

      ctx.fillStyle =
        "#eee7ef";

      ctx.fillRect(
        -position.width / 2,
        -position.height / 2,
        position.width,
        position.height
      );

      /*
       * REMOVE SHADOW
       */

      ctx.shadowColor =
        "rgba(0,0,0,0)";

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      /*
       * PHOTO AREA
       */

      const photoX =
        -position.width / 2 +
        padding;

      const photoY =
        -position.height / 2 +
        padding;

      const photoWidth =
        position.width -
        padding * 2;

      const photoHeight =
        position.height -
        bottomPadding -
        padding;

      drawImageCover(
        ctx,
        image,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        8
      );

      ctx.restore();
    } catch (error) {
      console.warn(
        `Memory ${index + 1} gagal dimuat.`,
        error
      );
    }
  }

  /*
   * =====================================================
   * MESSAGE
   * =====================================================
   */

  ctx.textAlign = "center";

  ctx.font =
    '400 34px Arial, sans-serif';

  ctx.fillStyle =
    "rgba(255,255,255,0.82)";

  const messageLines = [
    "mungkin nanti kamu lupa sama hari ini.",
    "tapi semoga kamu masih ingat",
    "pernah ada sesuatu kecil",
    "yang dibuat khusus buat kamu.",
    "",
    "semoga tahun ini banyak hal baik datang.",
  ];

  let messageY = 2380;

  messageLines.forEach(
    (line) => {
      ctx.fillText(
        line,
        CANVAS_WIDTH / 2,
        messageY
      );

      messageY += 48;
    }
  );

  /*
   * =====================================================
   * SIGNATURE
   * =====================================================
   */

  ctx.textAlign = "right";

  ctx.font =
    'italic 30px Georgia, "Times New Roman", serif';

  ctx.fillStyle =
    "rgba(255,255,255,0.68)";

  ctx.fillText(
    "— dari aku, yang hari ini sibuk banget bikin ini buat kamu.",
    CANVAS_WIDTH - 150,
    CANVAS_HEIGHT - 105
  );

  /*
   * =====================================================
   * HEART
   * =====================================================
   */

  ctx.textAlign = "center";

  ctx.font =
    '40px Georgia, "Times New Roman", serif';

  ctx.fillStyle =
    "rgba(255,80,180,0.92)";

  ctx.fillText(
    "♡",
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 90
  );

  return canvas;
}

export default function Finale({
  photos = [],
}) {
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const uploadedPhotos =
    photos.filter(Boolean);

  const handleDownload =
    async () => {
      if (
        isDownloading ||
        uploadedPhotos.length === 0
      ) {
        return;
      }

      setIsDownloading(true);

      try {
        const canvas =
          await createMemoryImage(
            photos
          );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsDownloading(false);
              return;
            }

            const url =
              URL.createObjectURL(blob);

            const link =
              document.createElement("a");

            link.href = url;

            link.download =
              "untuk-tari-memory.png";

            document.body.appendChild(
              link
            );

            link.click();

            link.remove();

            setTimeout(() => {
              URL.revokeObjectURL(url);
              setIsDownloading(false);
            }, 700);
          },
          "image/png"
        );
      } catch (error) {
        console.error(
          "Gagal membuat memory image:",
          error
        );

        setIsDownloading(false);
      }
    };

  return (
    <section className="scene scene-finale">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

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

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="finale-content">

        <motion.p
          className="finale-eyebrow"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
          }}
        >
          A LITTLE MEMORY FOR YOU
        </motion.p>

        <motion.h1
          className="finale-title"
          initial={{
            opacity: 0,
            y: 22,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          selamat ulang tahun,
          <br />
          <span>Tari.</span>
        </motion.h1>

        <motion.p
          className="finale-message"
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
          }}
        >
          satu kecil dari hari ini,
          <br />
          buat kamu simpan kalau nanti mau
          <br />
          mengingat hari ini lagi.
        </motion.p>

        {/* =====================================================
            PHOTOS
        ===================================================== */}

        <motion.div
          className="finale-photo-strip"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.5,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          {photos.map(
            (photo, index) =>
              photo ? (
                <div
                  className={`finale-photo finale-photo-${
                    index + 1
                  }`}
                  key={index}
                >
                  <img
                    src={photo}
                    alt={`Memory ${
                      index + 1
                    }`}
                  />
                </div>
              ) : (
                <div
                  className={`finale-photo finale-photo-${
                    index + 1
                  } is-empty`}
                  key={index}
                />
              )
          )}
        </motion.div>

        {/* =====================================================
            DOWNLOAD
        ===================================================== */}

        <motion.div
          className="finale-actions"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.95,
          }}
        >
          <button
            type="button"
            className="finale-save-button"
            onClick={handleDownload}
            disabled={
              isDownloading ||
              uploadedPhotos.length === 0
            }
          >
            <span>
              {isDownloading
                ? "creating memory..."
                : "save this memory"}
            </span>

            <span
              className="save-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>

          <p className="finale-quality">
            PNG · 2400 × 3000 · lossless
          </p>
        </motion.div>

        <motion.p
          className="finale-signature"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1.1,
          }}
        >
          made with a little too much effort ♡
        </motion.p>

      </div>
    </section>
  );
}