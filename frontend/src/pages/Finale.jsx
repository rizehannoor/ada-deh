import { useState } from "react";
import { motion } from "framer-motion";

/* =========================================================
   CANVAS CONFIGURATION
========================================================= */

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 3200;


/* =========================================================
   COLOR SYSTEM
   ONE CONSISTENT PALETTE
========================================================= */

const COLORS = {
  backgroundTop: "#08040d",
  backgroundMid: "#17091d",
  backgroundBottom: "#050207",

  plum: "#6f315e",
  deepPlum: "#4b203f",
  dustyRose: "#b9789d",
  rose: "#d49ab7",
  softPink: "#e7bfd2",

  white: "#fff8fc",

  mutedWhite: "rgba(255, 248, 252, 0.68)",
  faintWhite: "rgba(255, 248, 252, 0.34)",
  veryFaintWhite: "rgba(255, 248, 252, 0.16)",

  candle: "#d8a7c0",
  flame: "#f0c6d9",
};


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
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = reject;

    image.src = src;
  });
}


/* =========================================================
   ROUNDED RECTANGLE
========================================================= */

function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  fillStyle
) {
  ctx.save();

  ctx.beginPath();

  ctx.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

  ctx.fillStyle = fillStyle;

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   ROUNDED RECTANGLE STROKE
========================================================= */

function drawRoundedRectStroke(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  strokeStyle,
  lineWidth = 2
) {
  ctx.save();

  ctx.beginPath();

  ctx.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

  ctx.strokeStyle = strokeStyle;

  ctx.lineWidth = lineWidth;

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   DRAW IMAGE COVER
   Keeps exact 3:4 frame
========================================================= */

function drawImageCover(
  ctx,
  image,
  x,
  y,
  width,
  height
) {
  const sourceWidth =
    image.naturalWidth ||
    image.width;

  const sourceHeight =
    image.naturalHeight ||
    image.height;

  if (
    !sourceWidth ||
    !sourceHeight
  ) {
    return;
  }

  const sourceRatio =
    sourceWidth /
    sourceHeight;

  const targetRatio =
    width /
    height;

  let sourceX = 0;
  let sourceY = 0;

  let cropWidth =
    sourceWidth;

  let cropHeight =
    sourceHeight;

  if (
    sourceRatio >
    targetRatio
  ) {
    cropWidth =
      sourceHeight *
      targetRatio;

    sourceX =
      (sourceWidth -
        cropWidth) /
      2;
  } else {
    cropHeight =
      sourceWidth /
      targetRatio;

    sourceY =
      (sourceHeight -
        cropHeight) /
      2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    cropWidth,
    cropHeight,
    x,
    y,
    width,
    height
  );
}


/* =========================================================
   PHOTO FRAME
   PNG ONLY
   Supports controlled rotation
========================================================= */

function drawPhotoFrame(
  ctx,
  image,
  x,
  y,
  width,
  height,
  z = 1,
  rotation = 0
) {
  const radius = 42;

  ctx.save();


  /* -------------------------------------------------------
     ROTATION
     Rotate around the exact center of the photo.
  ------------------------------------------------------- */

  ctx.translate(
    x + width / 2,
    y + height / 2
  );

  ctx.rotate(
    (rotation * Math.PI) / 180
  );

  ctx.translate(
    -(x + width / 2),
    -(y + height / 2)
  );


  /* -------------------------------------------------------
     SOFT SHADOW
  ------------------------------------------------------- */

  ctx.shadowColor =
    "rgba(0, 0, 0, 0.58)";

  ctx.shadowBlur = 55;

  ctx.shadowOffsetY = 24;

  drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    "#10070f"
  );


  ctx.shadowColor =
    "transparent";


  /* -------------------------------------------------------
     SOLID OUTER FRAME
  ------------------------------------------------------- */

  const frameColor =
    z === 2
      ? COLORS.rose
      : COLORS.dustyRose;

  drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    frameColor
  );


  /* -------------------------------------------------------
     DARK PHOTO BASE
  ------------------------------------------------------- */

  const padding = 14;

  drawRoundedRect(
    ctx,
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2,
    radius - 10,
    "#09050b"
  );


  /* -------------------------------------------------------
     PHOTO CLIPPING
  ------------------------------------------------------- */

  ctx.save();

  ctx.beginPath();

  ctx.roundRect(
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2,
    radius - 10
  );

  ctx.clip();


  drawImageCover(
    ctx,
    image,
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2
  );

  ctx.restore();


  /* -------------------------------------------------------
     PHOTO INNER SHADOW
  ------------------------------------------------------- */

  const photoGradient =
    ctx.createLinearGradient(
      x,
      y,
      x,
      y + height
    );

  photoGradient.addColorStop(
    0,
    "rgba(0, 0, 0, 0.04)"
  );

  photoGradient.addColorStop(
    0.65,
    "rgba(0, 0, 0, 0.00)"
  );

  photoGradient.addColorStop(
    1,
    "rgba(0, 0, 0, 0.18)"
  );

  ctx.save();

  ctx.beginPath();

  ctx.roundRect(
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2,
    radius - 10
  );

  ctx.clip();

  ctx.fillStyle =
    photoGradient;

  ctx.fillRect(
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2
  );

  ctx.restore();


  /* -------------------------------------------------------
     INNER WHITE LINE
  ------------------------------------------------------- */

  drawRoundedRectStroke(
    ctx,
    x + 20,
    y + 20,
    width - 40,
    height - 40,
    radius - 15,
    "rgba(255, 248, 252, 0.44)",
    2
  );


  /* -------------------------------------------------------
     OUTER FINE LINE
  ------------------------------------------------------- */

  drawRoundedRectStroke(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    "rgba(231, 191, 210, 0.78)",
    3
  );


  /* -------------------------------------------------------
     HERO ACCENT
  ------------------------------------------------------- */

  if (z === 2) {
    ctx.save();

    ctx.shadowColor =
      "rgba(212, 154, 183, 0.28)";

    ctx.shadowBlur = 26;

    drawRoundedRectStroke(
      ctx,
      x - 1,
      y - 1,
      width + 2,
      height + 2,
      radius + 1,
      "rgba(231, 191, 210, 0.35)",
      2
    );

    ctx.restore();
  }

  ctx.restore();
}


/* =========================================================
   BALLOON
========================================================= */

function drawBalloon(
  ctx,
  x,
  y,
  scale = 1,
  color = COLORS.dustyRose
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.scale(
    scale,
    scale
  );


  /* -------------------------------------------------------
     BALLOON SHADOW
  ------------------------------------------------------- */

  ctx.shadowColor =
    "rgba(0, 0, 0, 0.30)";

  ctx.shadowBlur = 24;

  ctx.shadowOffsetY = 10;


  /* -------------------------------------------------------
     BALLOON BODY
  ------------------------------------------------------- */

  const gradient =
    ctx.createRadialGradient(
      -30,
      -45,
      10,
      0,
      0,
      150
    );

  gradient.addColorStop(
    0,
    "#ead0dc"
  );

  gradient.addColorStop(
    0.32,
    color
  );

  gradient.addColorStop(
    0.72,
    color
  );

  gradient.addColorStop(
    1,
    COLORS.deepPlum
  );

  ctx.fillStyle =
    gradient;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -120
  );

  ctx.bezierCurveTo(
    85,
    -120,
    120,
    -35,
    70,
    55
  );

  ctx.bezierCurveTo(
    48,
    95,
    18,
    125,
    0,
    145
  );

  ctx.bezierCurveTo(
    -18,
    125,
    -48,
    95,
    -70,
    55
  );

  ctx.bezierCurveTo(
    -120,
    -35,
    -85,
    -120,
    0,
    -120
  );

  ctx.fill();


  ctx.shadowColor =
    "transparent";


  /* -------------------------------------------------------
     BALLOON HIGHLIGHT
  ------------------------------------------------------- */

  const highlight =
    ctx.createRadialGradient(
      -28,
      -62,
      2,
      -28,
      -62,
      55
    );

  highlight.addColorStop(
    0,
    "rgba(255,255,255,0.42)"
  );

  highlight.addColorStop(
    1,
    "rgba(255,255,255,0)"
  );

  ctx.fillStyle =
    highlight;

  ctx.beginPath();

  ctx.ellipse(
    -28,
    -58,
    25,
    48,
    -0.35,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* -------------------------------------------------------
     BALLOON KNOT
  ------------------------------------------------------- */

  ctx.fillStyle =
    color;

  ctx.beginPath();

  ctx.moveTo(
    -9,
    130
  );

  ctx.lineTo(
    9,
    130
  );

  ctx.lineTo(
    0,
    148
  );

  ctx.closePath();

  ctx.fill();


  /* -------------------------------------------------------
     STRING
  ------------------------------------------------------- */

  ctx.strokeStyle =
    "rgba(231, 191, 210, 0.44)";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    0,
    148
  );

  ctx.bezierCurveTo(
    20,
    210,
    -15,
    260,
    10,
    320
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   SPARKLE
========================================================= */

function drawSparkle(
  ctx,
  x,
  y,
  size = 12,
  alpha = 0.6
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.fillStyle =
    `rgba(231,191,210,${alpha})`;

  ctx.shadowColor =
    `rgba(212,154,183,${alpha})`;

  ctx.shadowBlur =
    size * 2.2;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size
  );

  ctx.lineTo(
    size * 0.25,
    -size * 0.25
  );

  ctx.lineTo(
    size,
    0
  );

  ctx.lineTo(
    size * 0.25,
    size * 0.25
  );

  ctx.lineTo(
    0,
    size
  );

  ctx.lineTo(
    -size * 0.25,
    size * 0.25
  );

  ctx.lineTo(
    -size,
    0
  );

  ctx.lineTo(
    -size * 0.25,
    -size * 0.25
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   SMALL STAR
========================================================= */

function drawSmallStar(
  ctx,
  x,
  y,
  size = 5,
  alpha = 0.4
) {
  ctx.save();

  ctx.fillStyle =
    `rgba(255,248,252,${alpha})`;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    size,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   DIAMOND SPARKLE
========================================================= */

function drawDiamondSparkle(
  ctx,
  x,
  y,
  size = 18,
  alpha = 0.6
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.strokeStyle =
    `rgba(231,191,210,${alpha})`;

  ctx.lineWidth = 3;

  ctx.shadowColor =
    `rgba(212,154,183,${alpha})`;

  ctx.shadowBlur =
    size * 1.5;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size
  );

  ctx.lineTo(
    0,
    size
  );

  ctx.moveTo(
    -size,
    0
  );

  ctx.lineTo(
    size,
    0
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   CONFETTI
   MONOCHROMATIC
========================================================= */

function drawConfetti(
  ctx,
  x,
  y,
  width,
  height
) {
  const pieces = [
    [x + 90, y + 120, 8, 35, 0.45],
    [x + width - 120, y + 170, 7, 28, 0.38],
    [x + 155, y + 610, 6, 30, 0.30],
    [x + width - 90, y + 540, 8, 36, 0.34],
    [x + 55, y + height - 190, 7, 31, 0.35],
    [x + width - 140, y + height - 260, 8, 34, 0.30],
    [x + 220, y + height - 120, 6, 25, 0.28],
    [x + width - 230, y + height - 90, 7, 30, 0.32],
  ];

  pieces.forEach(
    ([px, py, w, h, alpha], index) => {
      ctx.save();

      ctx.translate(
        px,
        py
      );

      ctx.rotate(
        index % 2 === 0
          ? -0.35
          : 0.45
      );

      ctx.fillStyle =
        `rgba(212,154,183,${alpha})`;

      ctx.fillRect(
        -w / 2,
        -h / 2,
        w,
        h
      );

      ctx.restore();
    }
  );
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

  ctx.translate(
    x,
    y
  );

  ctx.scale(
    scale,
    scale
  );


  /* -------------------------------------------------------
     PLATE GLOW
  ------------------------------------------------------- */

  ctx.save();

  ctx.shadowColor =
    "rgba(212,154,183,0.24)";

  ctx.shadowBlur = 35;

  ctx.fillStyle =
    "rgba(231,191,210,0.15)";

  ctx.beginPath();

  ctx.ellipse(
    0,
    170,
    310,
    50,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();


  /* -------------------------------------------------------
     CAKE BODY
  ------------------------------------------------------- */

  const cakeGradient =
    ctx.createLinearGradient(
      -230,
      0,
      230,
      0
    );

  cakeGradient.addColorStop(
    0,
    COLORS.deepPlum
  );

  cakeGradient.addColorStop(
    0.5,
    COLORS.plum
  );

  cakeGradient.addColorStop(
    1,
    COLORS.deepPlum
  );

  ctx.fillStyle =
    cakeGradient;

  ctx.beginPath();

  ctx.roundRect(
    -230,
    -50,
    460,
    210,
    34
  );

  ctx.fill();


  /* -------------------------------------------------------
     CAKE BODY HIGHLIGHT
  ------------------------------------------------------- */

  ctx.strokeStyle =
    "rgba(231,191,210,0.22)";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.roundRect(
    -230,
    -50,
    460,
    210,
    34
  );

  ctx.stroke();


  /* -------------------------------------------------------
     FROSTING
  ------------------------------------------------------- */

  ctx.fillStyle =
    COLORS.softPink;

  ctx.beginPath();

  ctx.roundRect(
    -230,
    -70,
    460,
    65,
    28
  );

  ctx.fill();


  /* -------------------------------------------------------
     FROSTING DRIPS
  ------------------------------------------------------- */

  const drips = [
    -175,
    -90,
    0,
    90,
    175,
  ];

  drips.forEach(
    (dx, index) => {
      const dripHeight =
        index % 2 === 0
          ? 38
          : 25;

      ctx.beginPath();

      ctx.arc(
        dx,
        -5,
        18,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillRect(
        dx - 18,
        -5,
        36,
        dripHeight
      );
    }
  );


  /* -------------------------------------------------------
     CAKE DETAIL
  ------------------------------------------------------- */

  ctx.strokeStyle =
    "rgba(231,191,210,0.28)";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    -180,
    80
  );

  ctx.lineTo(
    180,
    80
  );

  ctx.stroke();


  /* -------------------------------------------------------
     CANDLES
  ------------------------------------------------------- */

  const candles = [
    -105,
    0,
    105,
  ];

  candles.forEach(
    (cx) => {
      ctx.fillStyle =
        COLORS.candle;

      ctx.beginPath();

      ctx.roundRect(
        cx - 10,
        -145,
        20,
        80,
        8
      );

      ctx.fill();


      ctx.strokeStyle =
        "rgba(255,248,252,0.32)";

      ctx.lineWidth = 2;

      ctx.stroke();


      /* flame */

      ctx.save();

      ctx.shadowColor =
        "rgba(240,198,217,0.55)";

      ctx.shadowBlur = 24;

      ctx.fillStyle =
        COLORS.flame;

      ctx.beginPath();

      ctx.moveTo(
        cx,
        -178
      );

      ctx.bezierCurveTo(
        cx - 18,
        -154,
        cx - 11,
        -138,
        cx,
        -132
      );

      ctx.bezierCurveTo(
        cx + 11,
        -138,
        cx + 18,
        -154,
        cx,
        -178
      );

      ctx.fill();

      ctx.restore();
    }
  );


  /* -------------------------------------------------------
     CAKE BASE
  ------------------------------------------------------- */

  ctx.fillStyle =
    COLORS.deepPlum;

  ctx.beginPath();

  ctx.roundRect(
    -250,
    145,
    500,
    35,
    17
  );

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   RIBBON DIVIDER
========================================================= */

function drawRibbon(
  ctx,
  x,
  y,
  width = 460
) {
  ctx.save();

  ctx.strokeStyle =
    "rgba(212,154,183,0.46)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    x - width / 2,
    y
  );

  ctx.lineTo(
    x - 35,
    y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    x + 35,
    y
  );

  ctx.lineTo(
    x + width / 2,
    y
  );

  ctx.stroke();


  /* center diamond */

  ctx.fillStyle =
    COLORS.rose;

  ctx.beginPath();

  ctx.moveTo(
    x,
    y - 13
  );

  ctx.lineTo(
    x + 13,
    y
  );

  ctx.lineTo(
    x,
    y + 13
  );

  ctx.lineTo(
    x - 13,
    y
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   CANVAS TEXT HELPERS
========================================================= */

function drawCenteredText(
  ctx,
  text,
  x,
  y,
  font,
  color,
  options = {}
) {
  ctx.save();

  ctx.textAlign =
    options.align || "center";

  ctx.textBaseline =
    options.baseline ||
    "alphabetic";

  ctx.font = font;

  ctx.fillStyle = color;

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.restore();
}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground(ctx) {
  const background =
    ctx.createLinearGradient(
      0,
      0,
      0,
      CANVAS_HEIGHT
    );

  background.addColorStop(
    0,
    COLORS.backgroundTop
  );

  background.addColorStop(
    0.42,
    COLORS.backgroundMid
  );

  background.addColorStop(
    0.72,
    "#100616"
  );

  background.addColorStop(
    1,
    COLORS.backgroundBottom
  );

  ctx.fillStyle =
    background;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );


  /* -------------------------------------------------------
     TOP ROSE GLOW
  ------------------------------------------------------- */

  const topGlow =
    ctx.createRadialGradient(
      350,
      380,
      0,
      350,
      380,
      900
    );

  topGlow.addColorStop(
    0,
    "rgba(185,120,157,0.18)"
  );

  topGlow.addColorStop(
    0.45,
    "rgba(111,49,94,0.08)"
  );

  topGlow.addColorStop(
    1,
    "rgba(111,49,94,0)"
  );

  ctx.fillStyle =
    topGlow;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    1500
  );


  /* -------------------------------------------------------
     RIGHT VIOLET / PLUM GLOW
  ------------------------------------------------------- */

  const rightGlow =
    ctx.createRadialGradient(
      2050,
      1100,
      0,
      2050,
      1100,
      900
    );

  rightGlow.addColorStop(
    0,
    "rgba(111,49,94,0.17)"
  );

  rightGlow.addColorStop(
    0.55,
    "rgba(75,32,63,0.08)"
  );

  rightGlow.addColorStop(
    1,
    "rgba(75,32,63,0)"
  );

  ctx.fillStyle =
    rightGlow;

  ctx.fillRect(
    1300,
    300,
    1100,
    1700
  );


  /* -------------------------------------------------------
     LOWER ROSE GLOW
  ------------------------------------------------------- */

  const lowerGlow =
    ctx.createRadialGradient(
      1200,
      2700,
      0,
      1200,
      2700,
      900
    );

  lowerGlow.addColorStop(
    0,
    "rgba(212,154,183,0.12)"
  );

  lowerGlow.addColorStop(
    0.5,
    "rgba(111,49,94,0.06)"
  );

  lowerGlow.addColorStop(
    1,
    "rgba(111,49,94,0)"
  );

  ctx.fillStyle =
    lowerGlow;

  ctx.fillRect(
    300,
    2100,
    1800,
    1100
  );
}


/* =========================================================
   VIGNETTE
========================================================= */

function drawVignette(ctx) {
  const vignette =
    ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      900,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      1900
    );

  vignette.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );

  vignette.addColorStop(
    0.68,
    "rgba(0,0,0,0.05)"
  );

  vignette.addColorStop(
    1,
    "rgba(0,0,0,0.52)"
  );

  ctx.fillStyle =
    vignette;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
}


/* =========================================================
   CREATE MEMORY IMAGE
========================================================= */

async function createMemoryImage(
  photos
) {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    CANVAS_WIDTH;

  canvas.height =
    CANVAS_HEIGHT;

  const ctx =
    canvas.getContext(
      "2d",
      {
        alpha: false,
      }
    );


  /* =======================================================
     BACKGROUND
  ======================================================= */

  drawBackground(ctx);


  /* =======================================================
     DECORATIVE ELEMENTS — TOP
  ======================================================= */

  drawBalloon(
    ctx,
    150,
    340,
    0.48,
    COLORS.plum
  );

  drawBalloon(
    ctx,
    2240,
    390,
    0.54,
    COLORS.dustyRose
  );


  drawSmallStar(
    ctx,
    390,
    250,
    5,
    0.45
  );

  drawSmallStar(
    ctx,
    2020,
    270,
    4,
    0.40
  );

  drawSparkle(
    ctx,
    530,
    390,
    10,
    0.52
  );

  drawDiamondSparkle(
    ctx,
    1870,
    480,
    16,
    0.44
  );


  /* =======================================================
     HEADER
  ======================================================= */

  drawCenteredText(
    ctx,
    "A LITTLE MEMORY",
    1200,
    150,
    '600 34px Arial, sans-serif',
    COLORS.rose
  );


  drawCenteredText(
    ctx,
    "FOR YOUR SPECIAL DAY",
    1200,
    205,
    '500 23px Arial, sans-serif',
    COLORS.faintWhite
  );


  /* header line */

  ctx.strokeStyle =
    "rgba(212,154,183,0.28)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    900,
    245
  );

  ctx.lineTo(
    1500,
    245
  );

  ctx.stroke();


  /* =======================================================
     MAIN TITLE
  ======================================================= */

  drawCenteredText(
    ctx,
    "selamat ulang tahun,",
    1200,
    350,
    '400 105px Georgia, serif',
    COLORS.white
  );


  drawCenteredText(
    ctx,
    "Tari.",
    1200,
    465,
    'italic 125px Georgia, serif',
    COLORS.rose
  );


  /* =======================================================
     SMALL TITLE DECORATION
  ======================================================= */

  drawRibbon(
    ctx,
    1200,
    505,
    360
  );


  /* =======================================================
     PHOTO POSITIONS
     ALL 3:4

     PNG ONLY:
     PHOTO 1  -> LEFT
     PHOTO 2  -> RIGHT
     PHOTO 3  -> CENTER
  ======================================================= */

  const photoPositions = [
    {
      x: 390,
      y: 570,
      width: 690,
      height: 920,
      z: 1,
      rotation: -4.5,
    },

    {
      x: 1320,
      y: 570,
      width: 690,
      height: 920,
      z: 1,
      rotation: 4.5,
    },

    {
      x: 855,
      y: 1570,
      width: 690,
      height: 920,
      z: 2,
      rotation: 2.5,
    },
  ];


  /* =======================================================
     LOAD ONLY EXISTING PHOTOS
  ======================================================= */

  const loadedPhotos = [];

  for (
    let index = 0;
    index <
    photoPositions.length;
    index += 1
  ) {
    const src =
      getPhotoSrc(
        photos[index]
      );

    if (!src) {
      loadedPhotos.push(null);
      continue;
    }

    try {
      const image =
        await loadImage(src);

      loadedPhotos.push(
        image
      );
    } catch (error) {
      console.error(
        "Gagal memuat foto:",
        error
      );

      loadedPhotos.push(null);
    }
  }


  /* =======================================================
     PHOTO LABEL
  ======================================================= */

  drawCenteredText(
    ctx,
    "MEMORIES",
    1200,
    535,
    '600 19px Arial, sans-serif',
    COLORS.faintWhite
  );


  /* =======================================================
     PHOTOS
  ======================================================= */

  photoPositions.forEach(
    (
      position,
      index
    ) => {
      const image =
        loadedPhotos[index];

      if (!image) {
        return;
      }

      drawPhotoFrame(
        ctx,
        image,
        position.x,
        position.y,
        position.width,
        position.height,
        position.z,
        position.rotation
      );
    }
  );


  /* =======================================================
     PHOTO SIDE SPARKLES
  ======================================================= */

  drawSparkle(
    ctx,
    185,
    1080,
    13,
    0.48
  );

  drawSparkle(
    ctx,
    2215,
    1050,
    11,
    0.42
  );

  drawDiamondSparkle(
    ctx,
    200,
    1900,
    13,
    0.35
  );

  drawDiamondSparkle(
    ctx,
    2195,
    1960,
    12,
    0.34
  );


  /* =======================================================
     BALLOONS AROUND LOWER AREA
  ======================================================= */

  drawBalloon(
    ctx,
    145,
    2490,
    0.38,
    COLORS.deepPlum
  );

  drawBalloon(
    ctx,
    2260,
    2500,
    0.42,
    COLORS.plum
  );


  /* =======================================================
     CONFETTI
  ======================================================= */

  drawConfetti(
    ctx,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );


  /* =======================================================
     CAKE SECTION
  ======================================================= */

  drawCenteredText(
    ctx,
    "A LITTLE CELEBRATION",
    1200,
    2585,
    '600 23px Arial, sans-serif',
    COLORS.rose
  );


  drawCake(
    ctx,
    1200,
    2690,
    0.68
  );


  /* =======================================================
     MESSAGE DIVIDER
  ======================================================= */

  drawRibbon(
    ctx,
    1200,
    2910,
    500
  );


  /* =======================================================
     MESSAGE HEADER
  ======================================================= */

  drawCenteredText(
    ctx,
    "A SMALL THING TO KEEP",
    1200,
    2975,
    '600 22px Arial, sans-serif',
    COLORS.rose
  );


  /* =======================================================
     MAIN MESSAGE
  ======================================================= */

  drawCenteredText(
    ctx,
    "mungkin ini cuma hal kecil,",
    1200,
    3035,
    '400 35px Georgia, serif',
    COLORS.mutedWhite
  );


  drawCenteredText(
    ctx,
    "tapi semoga nanti kamu senang",
    1200,
    3085,
    '400 35px Georgia, serif',
    COLORS.mutedWhite
  );


  drawCenteredText(
    ctx,
    "pernah menyimpannya.",
    1200,
    3135,
    'italic 38px Georgia, serif',
    COLORS.white
  );


  /* =======================================================
     FOOTER
  ======================================================= */

  drawCenteredText(
    ctx,
    "some moments are small, but worth keeping.",
    1200,
    3180,
    'italic 22px Georgia, serif',
    COLORS.faintWhite
  );


  /* =======================================================
     FINAL VIGNETTE
  ======================================================= */

  drawVignette(ctx);


  /* =======================================================
     RETURN CANVAS
  ======================================================= */

  return canvas;
}


/* =========================================================
   FINALE COMPONENT
========================================================= */

export default function Finale({
  photos = [],
  onNext,
}) {
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [
    isEnvelopeOpening,
    setIsEnvelopeOpening,
  ] = useState(false);


  const uploadedPhotos =
    photos.filter(Boolean);


  /* =======================================================
     OPEN LETTER
  ======================================================= */

  const handleOpenLetter =
    () => {
      if (isEnvelopeOpening) {
        return;
      }

      setIsEnvelopeOpening(true);

      setTimeout(() => {
        if (typeof onNext === "function") {
          onNext();
        }
      }, 1500);
    };


  /* =======================================================
     DOWNLOAD
  ======================================================= */

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


            setTimeout(
              () => {
                URL.revokeObjectURL(
                  url
                );

                setIsDownloading(
                  false
                );
              },
              700
            );
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


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <section
      className="scene scene-finale"
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="cosmic-background"
        aria-hidden="true"
      >

        <div
          className="cosmic-nebula cosmic-nebula-one"
        />

        <div
          className="cosmic-nebula cosmic-nebula-two"
        />

        <div
          className="cosmic-nebula cosmic-nebula-three"
        />

        <div
          className="cosmic-stars cosmic-stars-one"
        />

        <div
          className="cosmic-stars cosmic-stars-two"
        />

        <div
          className="cosmic-moon"
        />

        <div
          className="cosmic-horizon"
        />

        <div
          className="cosmic-vignette"
        />

        <div
          className="cosmic-grain"
        />

      </div>


      {/* =================================================
          AMBIENT GLOW
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
          CONTENT
      ================================================= */}

      <div className="finale-content">

        {/* HEADER */}

        <motion.p
          className="finale-eyebrow"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          A LITTLE MEMORY FOR YOU
        </motion.p>


        {/* TITLE */}

        <motion.h1
          className="finale-title"
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
            delay: 0.1,
          }}
        >
          selamat ulang tahun,
          <br />

          <span>
            Tari.
          </span>
        </motion.h1>


        {/* MESSAGE */}

        <motion.p
          className="finale-message"
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
            delay: 0.2,
          }}
        >
          mungkin ini cuma hal kecil,
          <br />
          tapi semoga nanti
          <br />
          kamu senang pernah
          <br />
          menyimpannya.
        </motion.p>


        {/* =================================================
            PHOTO PREVIEW
            TIDAK DIUBAH
        ================================================= */}

        <motion.div
          className="finale-photo-strip"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.3,
          }}
        >

          {photos.map(
            (
              photo,
              index
            ) => {

              const photoSrc =
                getPhotoSrc(
                  photo
                );


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
            LETTER ENVELOPE
        ================================================= */}

        <motion.div
          className={`finale-letter-area ${
            isEnvelopeOpening
              ? "is-opening"
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
            duration: 0.9,
            delay: 0.42,
          }}
        >

          <p className="finale-letter-eyebrow">
            ONE MORE THING
          </p>


          <motion.button
            type="button"
            className="finale-envelope-button"
            onClick={
              handleOpenLetter
            }
            disabled={
              isEnvelopeOpening
            }
            aria-label="Open the letter"
            whileHover={
              !isEnvelopeOpening
                ? {
                    y: -5,
                  }
                : undefined
            }
            whileTap={
              !isEnvelopeOpening
                ? {
                    scale: 0.97,
                  }
                : undefined
            }
          >

            {/* SPARKLES */}

            <div
              className="finale-envelope-sparkles"
              aria-hidden="true"
            >

              <span className="envelope-sparkle sparkle-a">
                ✦
              </span>

              <span className="envelope-sparkle sparkle-b">
                ✧
              </span>

              <span className="envelope-sparkle sparkle-c">
                ✦
              </span>

              <span className="envelope-sparkle sparkle-d">
                ✧
              </span>

              <span className="envelope-sparkle sparkle-e">
                ✦
              </span>

              <span className="envelope-sparkle sparkle-f">
                ·
              </span>

            </div>


            {/* ENVELOPE */}

            <motion.div
              className="finale-envelope"
              animate={
                isEnvelopeOpening
                  ? {
                      y: 8,
                      rotate: -2,
                    }
                  : {
                      y: [0, -3, 0],
                      rotate: 0,
                    }
              }
              transition={
                isEnvelopeOpening
                  ? {
                      duration: 0.55,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >

              {/* BACK */}

              <div className="envelope-back" />


              {/* LETTER INSIDE */}

              <motion.div
                className="envelope-letter"
                animate={
                  isEnvelopeOpening
                    ? {
                        y: -62,
                        opacity: 1,
                        rotate: 0,
                      }
                    : {
                        y: 0,
                        opacity: 0.92,
                        rotate: 0,
                      }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >

                <span>
                  a little letter
                </span>

              </motion.div>


              {/* LEFT FOLD */}

              <div className="envelope-fold envelope-fold-left" />


              {/* RIGHT FOLD */}

              <div className="envelope-fold envelope-fold-right" />


              {/* BOTTOM FOLD */}

              <div className="envelope-fold envelope-fold-bottom" />


              {/* TOP FLAP */}

              <motion.div
                className="envelope-flap"
                animate={
                  isEnvelopeOpening
                    ? {
                        rotateX: -178,
                      }
                    : {
                        rotateX: 0,
                      }
                }
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >

                <span className="envelope-seal">
                  ♡
                </span>

              </motion.div>

            </motion.div>

          </motion.button>


          <motion.p
            className="finale-letter-hint"
            animate={
              isEnvelopeOpening
                ? {
                    opacity: 0,
                    y: 8,
                  }
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={{
              duration: 0.35,
            }}
          >
            ada satu surat kecil buat kamu
          </motion.p>


          <motion.p
            className="finale-letter-open-text"
            animate={
              isEnvelopeOpening
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    y: 8,
                  }
            }
            transition={{
              duration: 0.4,
              delay: 0.65,
            }}
          >
            membuka surat...
          </motion.p>

        </motion.div>


        {/* =================================================
            DOWNLOAD
        ================================================= */}

        <motion.div
          className="finale-actions"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.55,
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


        {/* SIGNATURE */}

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
            delay: 0.65,
          }}
        >
          made with a little too much effort ♡
        </motion.p>

      </div>

    </section>
  );
}