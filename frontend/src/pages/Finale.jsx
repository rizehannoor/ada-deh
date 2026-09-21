import { useState } from "react";
import { motion } from "framer-motion";

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 3200;

/* =========================================================
   PHOTO SOURCE
========================================================= */

function getPhotoSrc(photo) {
  if (!photo) return null;

  if (typeof photo === "string") {
    return photo;
  }

  if (
    typeof photo === "object" &&
    photo.src
  ) {
    return photo.src;
  }

  return null;
}

/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(
        new Error("Image source is empty.")
      );
      return;
    }

    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(
        new Error(
          "Failed to load image."
        )
      );

    image.src = src;
  });
}

/* =========================================================
   ROUNDED RECT
========================================================= */

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

/* =========================================================
   IMAGE COVER
========================================================= */

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

  let sourceWidth =
    image.width;

  let sourceHeight =
    image.height;

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

/* =========================================================
   BALLOON
========================================================= */

function drawBalloon(
  ctx,
  x,
  y,
  scale,
  color,
  rotation = 0
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  ctx.beginPath();

  ctx.moveTo(0, 115);

  ctx.bezierCurveTo(
    -18,
    175,
    18,
    230,
    0,
    325
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.34)";

  ctx.lineWidth = 3;

  ctx.stroke();

  const gradient =
    ctx.createRadialGradient(
      -35,
      -60,
      5,
      0,
      0,
      140
    );

  gradient.addColorStop(
    0,
    "rgba(255,255,255,0.45)"
  );

  gradient.addColorStop(
    0.18,
    color
  );

  gradient.addColorStop(
    1,
    color
  );

  ctx.fillStyle = gradient;

  ctx.beginPath();

  ctx.moveTo(0, 125);

  ctx.bezierCurveTo(
    -75,
    105,
    -125,
    45,
    -110,
    -35
  );

  ctx.bezierCurveTo(
    -95,
    -120,
    -40,
    -145,
    0,
    -145
  );

  ctx.bezierCurveTo(
    40,
    -145,
    95,
    -120,
    110,
    -35
  );

  ctx.bezierCurveTo(
    125,
    45,
    75,
    105,
    0,
    125
  );

  ctx.fill();

  ctx.beginPath();

  ctx.ellipse(
    -42,
    -68,
    17,
    38,
    -0.35,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.28)";

  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(-10, 115);
  ctx.lineTo(0, 138);
  ctx.lineTo(10, 115);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

/* =========================================================
   CONFETTI
========================================================= */

function drawConfetti(
  ctx,
  items
) {
  items.forEach(
    ({
      x,
      y,
      width,
      height,
      rotation,
      color,
    }) => {
      ctx.save();

      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = color;

      ctx.fillRect(
        -width / 2,
        -height / 2,
        width,
        height
      );

      ctx.restore();
    }
  );
}

/* =========================================================
   SPARKLE
========================================================= */

function drawSparkle(
  ctx,
  x,
  y,
  size,
  alpha = 0.8
) {
  ctx.save();

  ctx.strokeStyle =
    `rgba(255,255,255,${alpha})`;

  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    x - size,
    y
  );

  ctx.lineTo(
    x + size,
    y
  );

  ctx.moveTo(
    x,
    y - size
  );

  ctx.lineTo(
    x,
    y + size
  );

  ctx.stroke();

  ctx.restore();
}

/* =========================================================
   DIAMOND SPARKLE
========================================================= */

function drawDiamondSparkle(
  ctx,
  x,
  y,
  size,
  color
) {
  ctx.save();

  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.moveTo(
    x,
    y - size
  );

  ctx.lineTo(
    x + size * 0.35,
    y - size * 0.35
  );

  ctx.lineTo(
    x + size,
    y
  );

  ctx.lineTo(
    x + size * 0.35,
    y + size * 0.35
  );

  ctx.lineTo(
    x,
    y + size
  );

  ctx.lineTo(
    x - size * 0.35,
    y + size * 0.35
  );

  ctx.lineTo(
    x - size,
    y
  );

  ctx.lineTo(
    x - size * 0.35,
    y - size * 0.35
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}

/* =========================================================
   CAKE
========================================================= */

function drawCake(
  ctx,
  x,
  y,
  scale = 1
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.beginPath();

  ctx.ellipse(
    0,
    105,
    150,
    28,
    0,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(0,0,0,0.35)";

  ctx.fill();

  const cakeGradient =
    ctx.createLinearGradient(
      -145,
      0,
      145,
      0
    );

  cakeGradient.addColorStop(
    0,
    "#bd147f"
  );

  cakeGradient.addColorStop(
    0.5,
    "#f34ca8"
  );

  cakeGradient.addColorStop(
    1,
    "#a90f70"
  );

  ctx.fillStyle = cakeGradient;

  drawRoundedRect(
    ctx,
    -145,
    -5,
    290,
    110,
    24
  );

  ctx.fill();

  ctx.fillStyle =
    "#ffe9f6";

  ctx.beginPath();

  ctx.moveTo(
    -150,
    0
  );

  ctx.bezierCurveTo(
    -110,
    -35,
    -70,
    16,
    -32,
    -10
  );

  ctx.bezierCurveTo(
    5,
    -38,
    45,
    16,
    82,
    -10
  );

  ctx.bezierCurveTo(
    115,
    -35,
    138,
    -5,
    150,
    0
  );

  ctx.lineTo(150, 30);
  ctx.lineTo(-150, 30);
  ctx.closePath();

  ctx.fill();

  ctx.fillStyle =
    "#f7d8ff";

  ctx.fillRect(
    -12,
    -85,
    24,
    80
  );

  ctx.strokeStyle =
    "#d650c9";

  ctx.lineWidth = 7;

  ctx.beginPath();

  ctx.moveTo(
    -10,
    -72
  );

  ctx.lineTo(
    10,
    -60
  );

  ctx.moveTo(
    -10,
    -43
  );

  ctx.lineTo(
    10,
    -31
  );

  ctx.stroke();

  const flame =
    ctx.createRadialGradient(
      0,
      -112,
      2,
      0,
      -112,
      34
    );

  flame.addColorStop(
    0,
    "#fff9bc"
  );

  flame.addColorStop(
    0.45,
    "#ff9c3b"
  );

  flame.addColorStop(
    1,
    "rgba(255,50,170,0)"
  );

  ctx.fillStyle = flame;

  ctx.beginPath();

  ctx.ellipse(
    0,
    -112,
    20,
    34,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  [
    [-95, 65],
    [-47, 82],
    [0, 64],
    [47, 82],
    [95, 65],
  ].forEach(
    ([dotX, dotY]) => {
      ctx.beginPath();

      ctx.arc(
        dotX,
        dotY,
        7,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#ffd2ed";

      ctx.fill();
    }
  );

  ctx.restore();
}

/* =========================================================
   RIBBON
========================================================= */

function drawRibbon(
  ctx,
  x,
  y,
  scale = 1
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle =
    "#ff5ab8";

  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(
    -115,
    0
  );

  ctx.bezierCurveTo(
    -75,
    -45,
    -40,
    45,
    0,
    0
  );

  ctx.bezierCurveTo(
    40,
    -45,
    75,
    45,
    115,
    0
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    -30,
    60,
    -20,
    100,
    -60,
    125
  );

  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    30,
    60,
    20,
    100,
    60,
    125
  );

  ctx.stroke();

  ctx.restore();
}

/* =========================================================
   PREMIUM PHOTO FRAME
========================================================= */

function drawPhotoFrame(
  ctx,
  image,
  position,
  index
) {
  const {
    x,
    y,
    width,
    height,
    rotation,
    z,
  } = position;

  ctx.save();

  ctx.translate(
    x + width / 2,
    y + height / 2
  );

  ctx.rotate(rotation);

  /*
   * Frame dibuat tipis supaya foto
   * tetap dominan.
   */

  const framePadding =
    z === 2 ? 15 : 14;

  const outerRadius =
    z === 2 ? 48 : 42;

  const photoRadius =
    z === 2 ? 38 : 34;

  const photoX =
    -width / 2 +
    framePadding;

  const photoY =
    -height / 2 +
    framePadding;

  const photoWidth =
    width -
    framePadding * 2;

  const photoHeight =
    height -
    framePadding * 2;

  /*
   * =====================================================
   * SOFT BLACK SHADOW
   * =====================================================
   */

  ctx.save();

  ctx.shadowColor =
    "rgba(0,0,0,0.50)";

  ctx.shadowBlur =
    z === 2 ? 45 : 32;

  ctx.shadowOffsetX = 0;

  ctx.shadowOffsetY =
    z === 2 ? 20 : 15;

  ctx.fillStyle =
    "#fffafd";

  drawRoundedRect(
    ctx,
    -width / 2,
    -height / 2,
    width,
    height,
    outerRadius
  );

  ctx.fill();

  ctx.restore();

  /*
   * =====================================================
   * PHOTO
   * =====================================================
   */

  drawImageCover(
    ctx,
    image,
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    photoRadius
  );

  /*
   * =====================================================
   * MAIN PINK BORDER
   * =====================================================
   */

  drawRoundedRect(
    ctx,
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    photoRadius
  );

  ctx.strokeStyle =
    z === 2
      ? "#ff1f9b"
      : "#ff329f";

  ctx.lineWidth =
    z === 2 ? 12 : 10;

  ctx.stroke();

  /*
   * =====================================================
   * OUTER PINK HALO
   * =====================================================
   */

  drawRoundedRect(
    ctx,
    photoX - 6,
    photoY - 6,
    photoWidth + 12,
    photoHeight + 12,
    photoRadius + 6
  );

  ctx.strokeStyle =
    z === 2
      ? "rgba(255,45,164,0.58)"
      : "rgba(255,45,164,0.46)";

  ctx.lineWidth = 3;

  ctx.stroke();

  /*
   * =====================================================
   * INNER WHITE HIGHLIGHT
   * =====================================================
   */

  const highlightInset = 10;

  drawRoundedRect(
    ctx,
    photoX + highlightInset,
    photoY + highlightInset,
    photoWidth -
      highlightInset * 2,
    photoHeight -
      highlightInset * 2,
    photoRadius - 7
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.55)";

  ctx.lineWidth = 2;

  ctx.stroke();

  /*
   * =====================================================
   * SECOND PINK ACCENT
   * =====================================================
   */

  const accentInset = 3;

  drawRoundedRect(
    ctx,
    photoX + accentInset,
    photoY + accentInset,
    photoWidth -
      accentInset * 2,
    photoHeight -
      accentInset * 2,
    photoRadius - 2
  );

  ctx.strokeStyle =
    "rgba(255,105,190,0.68)";

  ctx.lineWidth = 2;

  ctx.stroke();

  /*
   * =====================================================
   * PHOTO NUMBER
   * =====================================================
   */

  ctx.textAlign = "right";

  ctx.font =
    "500 17px Arial, sans-serif";

  ctx.fillStyle =
    "rgba(70,20,58,0.45)";

  ctx.fillText(
    `0${index + 1}`,
    width / 2 - 28,
    height / 2 - 27
  );

  /*
   * =====================================================
   * HERO LABEL
   * =====================================================
   */

  if (z === 2) {
    ctx.textAlign = "left";

    ctx.font =
      "500 15px Arial, sans-serif";

    ctx.fillStyle =
      "rgba(80,20,65,0.48)";

    ctx.fillText(
      "A LITTLE MEMORY",
      -width / 2 + 30,
      height / 2 - 29
    );
  }

  ctx.restore();
}

/* =========================================================
   CREATE MEMORY IMAGE
========================================================= */

async function createMemoryImage(
  photos
) {
  const canvas =
    document.createElement("canvas");

  canvas.width =
    CANVAS_WIDTH;

  canvas.height =
    CANVAS_HEIGHT;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas context unavailable."
    );
  }

  ctx.imageSmoothingEnabled = true;

  ctx.imageSmoothingQuality = "high";

  /*
   * =======================================================
   * BACKGROUND
   * =======================================================
   */

  const background =
    ctx.createLinearGradient(
      0,
      0,
      0,
      CANVAS_HEIGHT
    );

  background.addColorStop(
    0,
    "#08020e"
  );

  background.addColorStop(
    0.24,
    "#19051f"
  );

  background.addColorStop(
    0.50,
    "#30062f"
  );

  background.addColorStop(
    0.72,
    "#18051e"
  );

  background.addColorStop(
    1,
    "#050108"
  );

  ctx.fillStyle =
    background;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  /*
   * =======================================================
   * PINK GLOW
   * =======================================================
   */

  const pinkGlow =
    ctx.createRadialGradient(
      180,
      520,
      0,
      180,
      520,
      1050
    );

  pinkGlow.addColorStop(
    0,
    "rgba(255,20,147,0.36)"
  );

  pinkGlow.addColorStop(
    0.38,
    "rgba(240,20,180,0.15)"
  );

  pinkGlow.addColorStop(
    1,
    "rgba(255,20,147,0)"
  );

  ctx.fillStyle =
    pinkGlow;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  /*
   * =======================================================
   * VIOLET GLOW
   * =======================================================
   */

  const violetGlow =
    ctx.createRadialGradient(
      2200,
      1250,
      0,
      2200,
      1250,
      1000
    );

  violetGlow.addColorStop(
    0,
    "rgba(135,45,255,0.34)"
  );

  violetGlow.addColorStop(
    0.45,
    "rgba(115,30,220,0.14)"
  );

  violetGlow.addColorStop(
    1,
    "rgba(100,30,220,0)"
  );

  ctx.fillStyle =
    violetGlow;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  /*
   * =======================================================
   * LOWER GLOW
   * =======================================================
   */

  const lowerGlow =
    ctx.createRadialGradient(
      1200,
      2750,
      0,
      1200,
      2750,
      850
    );

  lowerGlow.addColorStop(
    0,
    "rgba(255,20,147,0.20)"
  );

  lowerGlow.addColorStop(
    1,
    "rgba(255,20,147,0)"
  );

  ctx.fillStyle =
    lowerGlow;

  ctx.fillRect(
    0,
    2100,
    CANVAS_WIDTH,
    1100
  );

  /*
   * =======================================================
   * CONFETTI
   * =======================================================
   */

  drawConfetti(
    ctx,
    [
      {
        x: 120,
        y: 390,
        width: 20,
        height: 65,
        rotation: -0.5,
        color: "#ff4db3",
      },
      {
        x: 2280,
        y: 390,
        width: 20,
        height: 65,
        rotation: 0.55,
        color: "#9f6cff",
      },
      {
        x: 95,
        y: 840,
        width: 18,
        height: 52,
        rotation: 0.7,
        color: "#ffd1ed",
      },
      {
        x: 2310,
        y: 850,
        width: 18,
        height: 55,
        rotation: -0.65,
        color: "#ff55b6",
      },
      {
        x: 120,
        y: 1460,
        width: 18,
        height: 58,
        rotation: 0.4,
        color: "#9d6aff",
      },
      {
        x: 2290,
        y: 1490,
        width: 20,
        height: 62,
        rotation: -0.4,
        color: "#ff80c8",
      },
      {
        x: 160,
        y: 2240,
        width: 18,
        height: 55,
        rotation: -0.6,
        color: "#ffd1ed",
      },
      {
        x: 2240,
        y: 2270,
        width: 18,
        height: 60,
        rotation: 0.6,
        color: "#9d6aff",
      },
    ]
  );

  /*
   * =======================================================
   * BALLOONS
   * =======================================================
   */

  drawBalloon(
    ctx,
    125,
    470,
    0.52,
    "#e91e9b",
    -0.08
  );

  drawBalloon(
    ctx,
    2270,
    470,
    0.50,
    "#733de0",
    0.08
  );

  drawBalloon(
    ctx,
    120,
    1790,
    0.36,
    "#ff55b7",
    -0.04
  );

  drawBalloon(
    ctx,
    2280,
    1820,
    0.38,
    "#954cff",
    0.05
  );

  /*
   * =======================================================
   * SPARKLES
   * =======================================================
   */

  drawSparkle(
    ctx,
    365,
    350,
    20,
    0.72
  );

  drawSparkle(
    ctx,
    2035,
    350,
    22,
    0.68
  );

  drawSparkle(
    ctx,
    310,
    1320,
    14,
    0.55
  );

  drawSparkle(
    ctx,
    2100,
    1360,
    17,
    0.65
  );

  drawSparkle(
    ctx,
    260,
    2470,
    14,
    0.52
  );

  drawSparkle(
    ctx,
    2140,
    2500,
    18,
    0.62
  );

  drawDiamondSparkle(
    ctx,
    670,
    1510,
    13,
    "rgba(255,110,195,0.72)"
  );

  drawDiamondSparkle(
    ctx,
    1740,
    1515,
    15,
    "rgba(255,255,255,0.55)"
  );

  /*
   * =======================================================
   * HEADER
   * =======================================================
   */

  ctx.textAlign = "center";

  ctx.font =
    "500 27px Arial, sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,0.48)";

  ctx.fillText(
    "A LITTLE MEMORY FOR YOU",
    CANVAS_WIDTH / 2,
    130
  );

  ctx.font =
    '600 88px Georgia, "Times New Roman", serif';

  ctx.fillStyle =
    "rgba(255,255,255,0.97)";

  ctx.fillText(
    "selamat ulang tahun, Tari.",
    CANVAS_WIDTH / 2,
    255
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.17)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    820,
    315
  );

  ctx.lineTo(
    1580,
    315
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    CANVAS_WIDTH / 2,
    315,
    5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#ff4db3";

  ctx.fill();

  /*
   * =======================================================
   * PHOTO POSITIONS
   * =======================================================
   */

  const photoPositions = [
    {
      x: 300,
      y: 430,
      width: 660,
      height: 880,
      rotation: -0.035,
      z: 1,
    },

    {
      x: 1440,
      y: 430,
      width: 660,
      height: 880,
      rotation: 0.035,
      z: 1,
    },

    {
      x: 720,
      y: 1240,
      width: 960,
      height: 1280,
      rotation: -0.006,
      z: 2,
    },
  ];

  /*
   * =======================================================
   * DRAW PHOTOS
   * =======================================================
   */

  for (
    let index = 0;
    index <
    photoPositions.length;
    index += 1
  ) {
    const photo =
      photos[index];

    if (!photo) continue;

    const photoSrc =
      getPhotoSrc(photo);

    if (!photoSrc) continue;

    try {
      const image =
        await loadImage(
          photoSrc
        );

      drawPhotoFrame(
        ctx,
        image,
        photoPositions[index],
        index
      );
    } catch (error) {
      console.warn(
        `Memory ${index + 1} gagal dimuat.`,
        error
      );
    }
  }

  /*
   * =======================================================
   * EXTRA SPARKLES
   * =======================================================
   */

  drawDiamondSparkle(
    ctx,
    640,
    1430,
    12,
    "rgba(255,90,184,0.65)"
  );

  drawDiamondSparkle(
    ctx,
    1760,
    1435,
    13,
    "rgba(255,255,255,0.52)"
  );

  /*
   * =======================================================
   * CAKE
   * =======================================================
   */

  drawCake(
    ctx,
    1200,
    2670,
    0.36
  );

  /*
   * =======================================================
   * RIBBON
   * =======================================================
   */

  drawRibbon(
    ctx,
    1200,
    2760,
    0.46
  );

  /*
   * =======================================================
   * LOWER DIVIDER
   * =======================================================
   */

  ctx.strokeStyle =
    "rgba(255,255,255,0.17)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    500,
    2825
  );

  ctx.lineTo(
    900,
    2825
  );

  ctx.moveTo(
    1500,
    2825
  );

  ctx.lineTo(
    1900,
    2825
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    1200,
    2825,
    5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#ff4db3";

  ctx.fill();

  /*
   * =======================================================
   * MESSAGE
   * =======================================================
   */

  ctx.textAlign = "center";

  ctx.font =
    "400 35px Arial, sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,0.90)";

  const messageLines = [
    "mungkin ini cuma hal kecil,",
    "tapi semoga nanti",
    "kamu senang pernah",
    "menyimpannya.",
  ];

  const messageStartY =
    2890;

  const messageLineHeight =
    43;

  messageLines.forEach(
    (line, index) => {
      ctx.fillText(
        line,
        CANVAS_WIDTH / 2,
        messageStartY +
          index *
            messageLineHeight
      );
    }
  );

  /*
   * =======================================================
   * HEART
   * =======================================================
   */

  ctx.font =
    '45px Georgia, "Times New Roman", serif';

  ctx.fillStyle =
    "#ff55b7";

  ctx.fillText(
    "♡",
    CANVAS_WIDTH / 2,
    3085
  );

  /*
   * =======================================================
   * SIGNATURE
   * =======================================================
   */

  ctx.font =
    'italic 22px Georgia, "Times New Roman", serif';

  ctx.fillStyle =
    "rgba(255,255,255,0.42)";

  ctx.fillText(
    "made with a little too much effort",
    CANVAS_WIDTH / 2,
    3140
  );

  /*
   * =======================================================
   * VIGNETTE
   * =======================================================
   */

  const vignette =
    ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      1000,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      1800
    );

  vignette.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );

  vignette.addColorStop(
    0.75,
    "rgba(0,0,0,0.06)"
  );

  vignette.addColorStop(
    1,
    "rgba(0,0,0,0.40)"
  );

  ctx.fillStyle =
    vignette;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  return canvas;
}

/* =========================================================
   FINALE COMPONENT
========================================================= */

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
              URL.createObjectURL(
                blob
              );

            const link =
              document.createElement(
                "a"
              );

            link.href = url;

            link.download =
              "untuk-tari-memory.png";

            document.body.appendChild(
              link
            );

            link.click();

            link.remove();

            setTimeout(() => {
              URL.revokeObjectURL(
                url
              );

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

      {/* ===================================================
          BACKGROUND
      =================================================== */}

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

      {/* ===================================================
          CONTENT
      =================================================== */}

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
          mungkin ini cuma hal kecil,
          <br />
          tapi semoga nanti...
          <br />
          kamu senang pernah
          <br />
          menyimpannya.
        </motion.p>

        {/* =================================================
            PHOTO PREVIEW
        ================================================= */}

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
            (photo, index) => {
              const photoSrc =
                getPhotoSrc(photo);

              return photoSrc ? (
                <div
                  className={`finale-photo finale-photo-${
                    index + 1
                  }`}
                  key={index}
                >
                  <img
                    src={photoSrc}
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
              );
            }
          )}
        </motion.div>

        {/* =================================================
            DOWNLOAD
        ================================================= */}

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
            onClick={
              handleDownload
            }
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
            PNG · 2400 × 3200 · 3:4 · lossless
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