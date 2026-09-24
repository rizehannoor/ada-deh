import { useState } from "react";
import { motion } from "framer-motion";

/* =========================================================
   FINALE
   ---------------------------------------------------------
   WEBSITE:
   - Cosmic background existing
   - Editorial ivory memory card
   - Visible floral / botanical decorations
   - Vertical 1:1 photos
   - Birthday greeting above photos
   - No PHOTO labels on website
   - ONE MORE THING envelope
   - Download CTA

   PNG:
   - STATIC RECREATION OF FINALE MEMORY CARD
   - Same ivory card
   - Same proportions
   - Same typography hierarchy
   - Same floral corners
   - Same botanical decorations
   - Same 1:1 photos
   - Same photo decorations
   - Same special-day divider
========================================================= */


/* =========================================================
   PNG CONFIGURATION
========================================================= */

const PNG_WIDTH = 2400;

const PNG_BACKGROUND = "#f7f4ed";
const PNG_TEXT = "#24211f";
const PNG_MUTED = "#817a73";
const PNG_LINE = "rgba(36, 33, 31, 0.15)";
const PNG_PHOTO_BORDER = "rgba(36, 33, 31, 0.09)";


/* =========================================================
   WEBSITE CONFIGURATION
========================================================= */

const WEBSITE_COLORS = {
  card: "#f7f4ed",
  cardWarm: "#fbf9f4",

  text: "#24211f",
  textSoft: "#5d5853",
  textMuted: "#817a73",

  border: "rgba(36, 33, 31, 0.15)",
  borderSoft: "rgba(36, 33, 31, 0.09)",

  botanical: "#6f7565",
  botanicalSoft: "#a3a998",

  gold: "#9c8760",

  flower: "#b88791",
  flowerSoft: "#d2aeb5",
  flowerDeep: "#9d6877",

  leaf: "#69745f",
  leafSoft: "#9aa38e",
};


/* =========================================================
   PHOTO SOURCE
========================================================= */

function getPhotoSrc(photo) {
  if (!photo) {
    return null;
  }

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

    if (
      typeof src === "string" &&
      !src.startsWith("data:") &&
      !src.startsWith("blob:")
    ) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(
        new Error(
          "Gagal memuat gambar untuk Canvas."
        )
      );
    };

    image.src = src;
  });
}


/* =========================================================
   DRAW TEXT
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
    options.baseline || "alphabetic";

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
   DRAW LETTER-SPACED TEXT
   ---------------------------------------------------------
   Canvas fillText tidak mempunyai letter-spacing.
   Helper ini digunakan untuk teks editorial kecil
   seperti A LITTLE MEMORY FOR YOU.
========================================================= */

function drawLetterSpacedText(
  ctx,
  text,
  x,
  y,
  font,
  color,
  letterSpacing,
  options = {}
) {
  ctx.save();

  ctx.font = font;
  ctx.fillStyle = color;

  const align =
    options.align || "center";

  const characters =
    [...text];

  const widths =
    characters.map(
      (character) =>
        ctx.measureText(character).width
    );

  const totalWidth =
    widths.reduce(
      (sum, width) =>
        sum + width,
      0
    ) +
    Math.max(
      characters.length - 1,
      0
    ) *
      letterSpacing;

  let cursorX;

  if (align === "left") {
    cursorX = x;
  } else if (align === "right") {
    cursorX =
      x -
      totalWidth;
  } else {
    cursorX =
      x -
      totalWidth / 2;
  }

  characters.forEach(
    (
      character,
      index
    ) => {
      ctx.fillText(
        character,
        cursorX,
        y
      );

      cursorX +=
        widths[index] +
        letterSpacing;
    }
  );

  ctx.restore();
}


/* =========================================================
   DRAW IMAGE COVER
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
   PNG FLOWER
   ---------------------------------------------------------
   Canvas recreation of FinaleFlower.
========================================================= */

function drawPngFlower(
  ctx,
  x,
  y,
  size = 54,
  petalColor = "rgba(184,135,145,0.92)",
  centerColor = "#9c8760",
  scale = 1
) {
  ctx.save();

  const petalSize =
    size * 0.38;

  const petalHeight =
    size * 0.62;

  const centerSize =
    size * 0.24;

  ctx.translate(
    x,
    y
  );

  [
    0,
    60,
    120,
    180,
    240,
    300,
  ].forEach(
    (rotation) => {
      ctx.save();

      ctx.rotate(
        rotation *
          Math.PI /
          180
      );

      const top =
        -(petalHeight *
          0.82);

      const halfWidth =
        petalSize / 2;

      const halfHeight =
        petalHeight / 2;

      ctx.translate(
        0,
        top
      );

      ctx.beginPath();

      ctx.moveTo(
        0,
        -halfHeight
      );

      ctx.bezierCurveTo(
        halfWidth * 1.1,
        -halfHeight * 0.9,
        halfWidth * 1.05,
        halfHeight * 0.45,
        0,
        halfHeight
      );

      ctx.bezierCurveTo(
        -halfWidth * 1.05,
        halfHeight * 0.45,
        -halfWidth * 1.1,
        -halfHeight * 0.9,
        0,
        -halfHeight
      );

      ctx.closePath();

      ctx.fillStyle =
        petalColor;

      ctx.fill();

      ctx.strokeStyle =
        "rgba(112,76,86,0.18)";

      ctx.lineWidth =
        1 * scale;

      ctx.stroke();

      ctx.restore();
    }
  );

  /* CENTER */

  const gradient =
    ctx.createRadialGradient(
      -centerSize * 0.15,
      -centerSize * 0.18,
      0,
      0,
      0,
      centerSize
    );

  gradient.addColorStop(
    0,
    "#d7c29a"
  );

  gradient.addColorStop(
    0.58,
    centerColor
  );

  gradient.addColorStop(
    1,
    "#806d4e"
  );

  ctx.shadowColor =
    "rgba(60,40,40,0.14)";

  ctx.shadowBlur =
    3 * scale;

  ctx.shadowOffsetY =
    1 * scale;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    centerSize / 2,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    gradient;

  ctx.fill();

  ctx.shadowColor =
    "transparent";

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle =
    "rgba(86,65,45,0.25)";

  ctx.lineWidth =
    1 * scale;

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   PNG LEAF
========================================================= */

function drawPngLeaf(
  ctx,
  x,
  y,
  width,
  height,
  rotation = 0,
  color = "rgba(105,116,95,0.68)",
  scale = 1
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.rotate(
    rotation
  );

  ctx.beginPath();

  ctx.moveTo(
    0,
    -height / 2
  );

  ctx.bezierCurveTo(
    width,
    -height / 2,
    width,
    height / 2,
    0,
    height / 2
  );

  ctx.bezierCurveTo(
    -width,
    height / 2,
    -width,
    -height / 2,
    0,
    -height / 2
  );

  ctx.closePath();

  ctx.fillStyle =
    color;

  ctx.globalAlpha =
    0.72;

  ctx.fill();

  ctx.globalAlpha =
    1;

  ctx.strokeStyle =
    "rgba(75,82,66,0.18)";

  ctx.lineWidth =
    1 * scale;

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   PNG FLORAL CORNER
   ---------------------------------------------------------
   Direct canvas recreation of FinaleFloralCorner.
========================================================= */

function drawPngFloralCorner(
  ctx,
  x,
  y,
  scale = 1,
  mirrored = false,
  flippedVertical = false
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.scale(
    mirrored ? -1 : 1,
    flippedVertical ? -1 : 1
  );

  /*
   * Browser version:
   *
   * width: 112px
   * height: 112px
   *
   * Corner itself is positioned outside the card.
   */

  /* STEM 1 */

  ctx.save();

  ctx.translate(
    -30 * scale,
    -28 * scale
  );

  ctx.rotate(
    -12 *
      Math.PI /
      180
  );

  ctx.strokeStyle =
    "rgba(105,116,95,0.82)";

  ctx.lineWidth =
    2 * scale;

  ctx.lineCap =
    "round";

  ctx.beginPath();

  ctx.moveTo(
    30 * scale,
    24 * scale
  );

  ctx.lineTo(
    30 * scale,
    110 * scale
  );

  ctx.stroke();

  /* SECOND STEM */

  ctx.strokeStyle =
    "rgba(105,116,95,0.55)";

  ctx.lineWidth =
    2 * scale;

  ctx.beginPath();

  ctx.moveTo(
    42 * scale,
    35 * scale
  );

  ctx.lineTo(
    42 * scale,
    93 * scale
  );

  ctx.stroke();

  /* LEAF 1 */

  drawPngLeaf(
    ctx,
    14 * scale,
    52 * scale,
    10 * scale,
    19 * scale,
    -58 *
      Math.PI /
      180,
    "rgba(105,116,95,0.68)",
    scale
  );

  /* LEAF 2 */

  drawPngLeaf(
    ctx,
    24 * scale,
    72 * scale,
    10 * scale,
    20 * scale,
    -58 *
      Math.PI /
      180,
    "rgba(105,116,95,0.68)",
    scale
  );

  /* LEAF 3 */

  drawPngLeaf(
    ctx,
    57 * scale,
    70 * scale,
    9.5 * scale,
    18 * scale,
    42 *
      Math.PI /
      180,
    "rgba(120,129,106,0.62)",
    scale
  );

  /* LEAF 4 */

  drawPngLeaf(
    ctx,
    38 * scale,
    92 * scale,
    8.5 * scale,
    17 * scale,
    -52 *
      Math.PI /
      180,
    "rgba(120,129,106,0.52)",
    scale
  );

  /* MAIN FLOWER */

  drawPngFlower(
    ctx,
    0,
    0,
    55 * scale,
    "rgba(184,135,145,0.92)",
    "#9c8760",
    scale
  );

  /* SMALL FLOWER */

  drawPngFlower(
    ctx,
    62 * scale,
    12 * scale,
    31 * scale,
    "rgba(205,169,177,0.86)",
    "#aa9166",
    scale
  );

  ctx.restore();

  ctx.restore();
}


/* =========================================================
   PNG PHOTO DECORATION
   ---------------------------------------------------------
   Exact structural equivalent of FinalePhotoDecoration.
========================================================= */

function drawFinalePhotoDecoration(
  ctx,
  x,
  y,
  size,
  scale = 1
) {
  const outer =
    17 * scale;

  /* TOP LEFT */

  drawPngFlower(
    ctx,
    x -
      outer -
      16 * scale +
      24 * scale,
    y -
      outer -
      16 * scale +
      24 * scale,
    48 * scale,
    "rgba(184,135,145,0.90)",
    "#9c8760",
    scale
  );

  /* TOP RIGHT */

  drawPngFlower(
    ctx,
    x +
      size +
      outer -
      8 * scale -
      16 * scale,
    y -
      outer -
      9 * scale +
      16 * scale,
    32 * scale,
    "rgba(205,169,177,0.82)",
    "#aa9166",
    scale
  );

  /* BOTTOM LEFT */

  drawPngFlower(
    ctx,
    x -
      outer -
      10 * scale +
      17 * scale,
    y +
      size +
      outer -
      9 * scale -
      17 * scale,
    34 * scale,
    "rgba(193,151,159,0.72)",
    "#a28b65",
    scale
  );

  /* BOTTOM RIGHT */

  drawPngFlower(
    ctx,
    x +
      size +
      outer -
      16 * scale +
      23.5 * scale,
    y +
      size +
      outer -
      15 * scale -
      23.5 * scale,
    47 * scale,
    "rgba(184,135,145,0.84)",
    "#9c8760",
    scale
  );

  /* TOP LEFT LEAF */

  drawPngLeaf(
    ctx,
    x +
      20 * scale +
      5.5 * scale,
    y +
      2 * scale +
      13 * scale,
    5.5 * scale,
    13 * scale,
    -38 *
      Math.PI /
      180,
    "rgba(105,116,95,0.68)",
    scale
  );

  /* TOP RIGHT LEAF */

  drawPngLeaf(
    ctx,
    x +
      size -
      20 * scale -
      5 * scale,
    y +
      18 * scale +
      12.5 * scale,
    5 * scale,
    12.5 * scale,
    38 *
      Math.PI /
      180,
    "rgba(105,116,95,0.62)",
    scale
  );

  /* BOTTOM LEFT LINE */

  ctx.save();

  ctx.strokeStyle =
    "rgba(105,116,95,0.52)";

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    x +
      10 * scale,
    y +
      size +
      outer -
      18 * scale
  );

  ctx.lineTo(
    x +
      56 * scale,
    y +
      size +
      outer -
      18 * scale
  );

  ctx.stroke();

  ctx.restore();

  /* BOTTOM RIGHT LINE */

  ctx.save();

  ctx.strokeStyle =
    "rgba(105,116,95,0.52)";

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    x +
      size +
      outer -
      56 * scale,
    y +
      size +
      outer -
      18 * scale
  );

  ctx.lineTo(
    x +
      size +
      outer -
      10 * scale,
    y +
      size +
      outer -
      18 * scale
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   PNG CARD CENTER ORNAMENT
========================================================= */

function drawFinaleCardOrnament(
  ctx,
  centerX,
  topY,
  scale = 1
) {
  ctx.save();

  ctx.globalAlpha =
    0.85;

  const width =
    150 * scale;

  const lineWidth =
    42 * scale;

  const lineY =
    topY +
    14 * scale;

  /* LEFT LINE */

  const leftGradient =
    ctx.createLinearGradient(
      centerX -
        width / 2,
      0,
      centerX -
        width / 2 +
        lineWidth,
      0
    );

  leftGradient.addColorStop(
    0,
    "rgba(156,135,96,0)"
  );

  leftGradient.addColorStop(
    1,
    "rgba(156,135,96,0.65)"
  );

  ctx.strokeStyle =
    leftGradient;

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    centerX -
      width / 2,
    lineY
  );

  ctx.lineTo(
    centerX -
      width / 2 +
      lineWidth,
    lineY
  );

  ctx.stroke();

  /* RIGHT LINE */

  const rightGradient =
    ctx.createLinearGradient(
      centerX +
        width / 2 -
        lineWidth,
      0,
      centerX +
        width / 2,
      0
    );

  rightGradient.addColorStop(
    0,
    "rgba(156,135,96,0.65)"
  );

  rightGradient.addColorStop(
    1,
    "rgba(156,135,96,0)"
  );

  ctx.strokeStyle =
    rightGradient;

  ctx.beginPath();

  ctx.moveTo(
    centerX +
      width / 2 -
      lineWidth,
    lineY
  );

  ctx.lineTo(
    centerX +
      width / 2,
    lineY
  );

  ctx.stroke();

  /* DIAMOND */

  const diamondSize =
    14 * scale;

  ctx.save();

  ctx.translate(
    centerX,
    topY +
      14 * scale
  );

  ctx.rotate(
    Math.PI / 4
  );

  ctx.fillStyle =
    "rgba(156,135,96,0.08)";

  ctx.strokeStyle =
    "rgba(156,135,96,0.62)";

  ctx.lineWidth =
    1 * scale;

  ctx.fillRect(
    -diamondSize / 2,
    -diamondSize / 2,
    diamondSize,
    diamondSize
  );

  ctx.strokeRect(
    -diamondSize / 2,
    -diamondSize / 2,
    diamondSize,
    diamondSize
  );

  ctx.restore();

  /* PINK DOT */

  ctx.beginPath();

  ctx.arc(
    centerX,
    topY +
      14 * scale,
    5 * scale,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(184,135,145,0.75)";

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   PNG TOP BOTANICAL
========================================================= */

function drawFinaleTopBotanical(
  ctx,
  x,
  y,
  scale = 1,
  mirrored = false
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );

  if (mirrored) {
    ctx.scale(
      -1,
      1
    );
  }

  ctx.globalAlpha =
    0.7;

  /* STEM */

  ctx.strokeStyle =
    "rgba(105,116,95,0.55)";

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    26 * scale,
    0
  );

  ctx.lineTo(
    26 * scale,
    76 * scale
  );

  ctx.stroke();

  /* LEAF 1 */

  drawPngLeaf(
    ctx,
    21 * scale,
    43 * scale,
    8 * scale,
    16 * scale,
    -52 *
      Math.PI /
      180,
    "rgba(105,116,95,0.30)",
    scale
  );

  /* LEAF 2 */

  drawPngLeaf(
    ctx,
    35.5 * scale,
    61 * scale,
    7.5 * scale,
    15 * scale,
    38 *
      Math.PI /
      180,
    "rgba(105,116,95,0.24)",
    scale
  );

  ctx.restore();
}


/* =========================================================
   PNG BOTTOM BOTANICAL
========================================================= */

function drawFinaleBottomBotanical(
  ctx,
  centerX,
  bottomY,
  scale = 1
) {
  ctx.save();

  const width =
    120 * scale;

  const top =
    bottomY -
    35 * scale;

  /* LEFT LINE */

  ctx.save();

  ctx.strokeStyle =
    "rgba(105,116,95,0.48)";

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    centerX -
      width / 2,
    top +
      16 * scale
  );

  ctx.lineTo(
    centerX -
      width / 2 +
      45 * scale,
    top +
      16 * scale
  );

  ctx.stroke();

  ctx.restore();

  /* RIGHT LINE */

  ctx.save();

  ctx.strokeStyle =
    "rgba(105,116,95,0.48)";

  ctx.lineWidth =
    1 * scale;

  ctx.beginPath();

  ctx.moveTo(
    centerX +
      width / 2 -
      45 * scale,
    top +
      16 * scale
  );

  ctx.lineTo(
    centerX +
      width / 2,
    top +
      16 * scale
  );

  ctx.stroke();

  ctx.restore();

  /* LEFT LEAF */

  drawPngLeaf(
    ctx,
    centerX -
      60 * scale +
      37 * scale,
    top +
      6 * scale +
      12.5 * scale,
    7 * scale,
    12.5 * scale,
    -35 *
      Math.PI /
      180,
    "rgba(105,116,95,0.32)",
    scale
  );

  /* RIGHT LEAF */

  drawPngLeaf(
    ctx,
    centerX +
      60 * scale -
      37 * scale,
    top +
      6 * scale +
      12.5 * scale,
    7 * scale,
    12.5 * scale,
    35 *
      Math.PI /
      180,
    "rgba(105,116,95,0.32)",
    scale
  );

  /* CENTER FLOWER */

  drawPngFlower(
    ctx,
    centerX,
    top +
      5 * scale +
      13.5 * scale,
    27 * scale,
    "rgba(184,135,145,0.68)",
    "#9c8760",
    scale
  );

  ctx.restore();
}


/* =========================================================
   CREATE MEMORY IMAGE
   ---------------------------------------------------------
   IMPORTANT:
   PNG ini sekarang mengambil struktur visual dari:
   
   <motion.article className="finale-memory-card">

   BUKAN desain PNG lama.
========================================================= */

async function createMemoryImage(
  photos
) {
  const usablePhotos =
    photos
      .map(getPhotoSrc)
      .filter(Boolean)
      .slice(0, 3);

  if (
    usablePhotos.length === 0
  ) {
    throw new Error(
      "Tidak ada foto yang dapat digunakan."
    );
  }

  /* =======================================================
     LOAD ALL PHOTOS
  ======================================================= */

  const loadedImages = [];

  for (
    const src of usablePhotos
  ) {
    try {
      const image =
        await loadImage(src);

      loadedImages.push(
        image
      );
    } catch (error) {
      console.error(
        "Gagal memuat foto:",
        error
      );
    }
  }

  if (
    loadedImages.length === 0
  ) {
    throw new Error(
      "Foto tidak berhasil dimuat."
    );
  }


  /* =======================================================
     FINALE CARD GEOMETRY
     -------------------------------------------------------
     Website:
       width  = 520px
       padding = 52px

     PNG:
       width = 2400px

     Semua ukuran mengikuti scale yang sama.
  ======================================================= */

  const FINALE_CARD_WIDTH =
    520;

  const FINALE_CARD_PADDING =
    52;

  const scale =
    PNG_WIDTH /
    FINALE_CARD_WIDTH;

  const cardPadding =
    FINALE_CARD_PADDING *
    scale;

  const contentWidth =
    (
      FINALE_CARD_WIDTH -
      FINALE_CARD_PADDING * 2
    ) *
    scale;

  const photoSize =
    contentWidth;

  const photoGap =
    34 * scale;


  /* =======================================================
     HEADER GEOMETRY
  ======================================================= */

  const eyebrowFontSize =
    8 * scale;

  const eyebrowMarginBottom =
    16 * scale;

  const dividerWidth =
    90 * scale;

  const dividerHeight =
    1 * scale;

  const dividerMarginBottom =
    20 * scale;

  const titleFontSize =
    34 * scale;

  const titleLineHeight =
    titleFontSize * 1.25;

  const secondLineMargin =
    4 * scale;

  const secondLineFontSize =
    titleFontSize * 1.18;

  const secondLineHeight =
    secondLineFontSize * 1.25;

  const headerBottomGap =
    38 * scale;


  /* =======================================================
     SPECIAL DAY
  ======================================================= */

  const specialDayMarginTop =
    46 * scale;

  const specialDayPaddingTop =
    34 * scale;

  const specialDayBorderHeight =
    1 * scale;

  const specialDayFlowerOffset =
    88 * scale;

  const specialDayFlowerSize =
    24 * scale;


  /* =======================================================
     CARD BOTTOM
  ======================================================= */

  const bottomDecorationHeight =
    35 * scale;

  const bottomDecorationBottom =
    20 * scale;


  /* =======================================================
     HEADER HEIGHT
  ======================================================= */

  const eyebrowHeight =
    eyebrowFontSize;

  const titleHeight =
    titleLineHeight +
    secondLineMargin +
    secondLineHeight;

  const headerHeight =
    eyebrowHeight +
    eyebrowMarginBottom +
    dividerHeight +
    dividerMarginBottom +
    titleHeight;


  /* =======================================================
     PHOTO HEIGHT
  ======================================================= */

  const photosHeight =
    loadedImages.length *
      photoSize +
    Math.max(
      loadedImages.length - 1,
      0
    ) *
      photoGap;


  /* =======================================================
     SPECIAL DAY HEIGHT
  ======================================================= */

  const specialDayContentHeight =
    specialDayMarginTop +
    specialDayPaddingTop +
    specialDayBorderHeight +
    8 * scale;


  /* =======================================================
     TOTAL CARD HEIGHT
  ======================================================= */

  const canvasHeight =
    cardPadding +
    20 * scale +
    30 * scale +
    headerHeight +
    headerBottomGap +
    photosHeight +
    specialDayContentHeight +
    45 * scale +
    bottomDecorationBottom +
    bottomDecorationHeight +
    cardPadding;


  /* =======================================================
     CREATE CANVAS
  ======================================================= */

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    PNG_WIDTH;

  canvas.height =
    Math.ceil(
      canvasHeight
    );


  const ctx =
    canvas.getContext(
      "2d",
      {
        alpha: false,
      }
    );

  if (!ctx) {
    throw new Error(
      "Canvas 2D context tidak tersedia."
    );
  }


  /* =======================================================
     CARD BACKGROUND
  ======================================================= */

  ctx.fillStyle =
    WEBSITE_COLORS.card;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* =======================================================
     CARD BORDER
  ======================================================= */

  ctx.save();

  ctx.strokeStyle =
    WEBSITE_COLORS.border;

  ctx.lineWidth =
    1 * scale;

  ctx.strokeRect(
    0.5 * scale,
    0.5 * scale,
    PNG_WIDTH -
      scale,
    canvas.height -
      scale
  );

  ctx.restore();


  /* =======================================================
     FLORAL CORNERS
  ======================================================= */

  drawPngFloralCorner(
    ctx,
    0,
    0,
    0.92,
    false,
    false
  );

  drawPngFloralCorner(
    ctx,
    PNG_WIDTH,
    0,
    0.92,
    true,
    false
  );

  drawPngFloralCorner(
    ctx,
    0,
    canvas.height,
    0.78,
    false,
    true
  );

  drawPngFloralCorner(
    ctx,
    PNG_WIDTH,
    canvas.height,
    0.78,
    true,
    true
  );


  /* =======================================================
     TOP CENTER ORNAMENT
  ======================================================= */

  drawFinaleCardOrnament(
    ctx,
    PNG_WIDTH / 2,
    20 * scale,
    scale
  );


  /* =======================================================
     TOP BOTANICAL LEFT
     -------------------------------------------------------
     Finale:
       top: 82px
       left: 18px
       width: 65px
       height: 80px
  ======================================================= */

  drawFinaleTopBotanical(
    ctx,
    18 * scale,
    82 * scale,
    scale,
    false
  );


  /* =======================================================
     TOP BOTANICAL RIGHT
  ======================================================= */

  drawFinaleTopBotanical(
    ctx,
    PNG_WIDTH -
      18 * scale,
    82 * scale,
    scale,
    true
  );


  /* =======================================================
     CURRENT Y
  ======================================================= */

  let currentY =
    cardPadding +
    20 * scale +
    30 * scale;


  /* =======================================================
     HEADER
  ======================================================= */

  /* A LITTLE MEMORY FOR YOU */

  currentY +=
    eyebrowHeight;

  drawLetterSpacedText(
    ctx,
    "A LITTLE MEMORY FOR YOU",
    PNG_WIDTH / 2,
    currentY,
    `600 ${eyebrowFontSize}px Arial, sans-serif`,
    WEBSITE_COLORS.textMuted,
    0.28 * scale
  );

  currentY +=
    eyebrowMarginBottom;


  /* HEADER DIVIDER */

  currentY +=
    dividerHeight;

  ctx.save();

  ctx.strokeStyle =
    WEBSITE_COLORS.border;

  ctx.lineWidth =
    dividerHeight;

  ctx.beginPath();

  ctx.moveTo(
    PNG_WIDTH / 2 -
      dividerWidth / 2,
    currentY
  );

  ctx.lineTo(
    PNG_WIDTH / 2 +
      dividerWidth / 2,
    currentY
  );

  ctx.stroke();

  ctx.restore();

  currentY +=
    dividerMarginBottom;


  /* =======================================================
     SELAMAT ULANG TAHUN
  ======================================================= */

  drawCenteredText(
    ctx,
    "selamat ulang tahun,",
    PNG_WIDTH / 2,
    currentY +
      titleFontSize,
    `400 ${titleFontSize}px Georgia, "Times New Roman", serif`,
    WEBSITE_COLORS.text
  );

  currentY +=
    titleLineHeight;


  /* =======================================================
     TARI. ♡
  ======================================================= */

  currentY +=
    secondLineMargin;

  drawCenteredText(
    ctx,
    "Tari. ♡",
    PNG_WIDTH / 2,
    currentY +
      secondLineFontSize,
    `italic 400 ${secondLineFontSize}px Georgia, "Times New Roman", serif`,
    WEBSITE_COLORS.text
  );

  currentY +=
    secondLineHeight;


  /* =======================================================
     HEADER → PHOTOS
  ======================================================= */

  currentY +=
    headerBottomGap;


  /* =======================================================
     PHOTOS
  ======================================================= */

  loadedImages.forEach(
    (
      image,
      index
    ) => {
      const photoX =
        cardPadding;

      const photoY =
        currentY;


      /* ================================================
         PHOTO BACKGROUND
      ================================================= */

      ctx.save();

      ctx.fillStyle =
        "#ebe8e0";

      ctx.fillRect(
        photoX,
        photoY,
        photoSize,
        photoSize
      );

      ctx.restore();


      /* ================================================
         OUTER PHOTO BORDER
      ================================================= */

      ctx.save();

      ctx.strokeStyle =
        WEBSITE_COLORS.borderSoft;

      ctx.lineWidth =
        1 * scale;

      ctx.strokeRect(
        photoX +
          0.5 * scale,
        photoY +
          0.5 * scale,
        photoSize -
          scale,
        photoSize -
          scale
      );

      ctx.restore();


      /* ================================================
         PHOTO
         object-fit: cover
         object-position: center
         saturate(0.94)
         contrast(0.98)
      ================================================= */

      ctx.save();

      ctx.beginPath();

      ctx.rect(
        photoX,
        photoY,
        photoSize,
        photoSize
      );

      ctx.clip();

      ctx.filter =
        "saturate(0.94) contrast(0.98)";

      drawImageCover(
        ctx,
        image,
        photoX,
        photoY,
        photoSize,
        photoSize
      );

      ctx.filter =
        "none";

      ctx.restore();


      /* ================================================
         FLORAL PHOTO DECORATION
      ================================================= */

      drawFinalePhotoDecoration(
        ctx,
        photoX,
        photoY,
        photoSize,
        scale
      );


      /* ================================================
         INNER EDITORIAL FRAME
         inset: 8px
      ================================================= */

      ctx.save();

      ctx.strokeStyle =
        "rgba(255,255,255,0.30)";

      ctx.lineWidth =
        1 * scale;

      ctx.strokeRect(
        photoX +
          8 * scale,
        photoY +
          8 * scale,
        photoSize -
          16 * scale,
        photoSize -
          16 * scale
      );

      ctx.restore();


      /* NEXT PHOTO */

      currentY +=
        photoSize;

      if (
        index <
        loadedImages.length - 1
      ) {
        currentY +=
          photoGap;
      }
    }
  );


  /* =======================================================
     SPECIAL DAY
  ======================================================= */

  currentY +=
    specialDayMarginTop;

  const specialDayY =
    currentY;


  /* TOP BORDER */

  ctx.save();

  ctx.strokeStyle =
    WEBSITE_COLORS.border;

  ctx.lineWidth =
    specialDayBorderHeight;

  ctx.beginPath();

  ctx.moveTo(
    cardPadding,
    specialDayY
  );

  ctx.lineTo(
    PNG_WIDTH -
      cardPadding,
    specialDayY
  );

  ctx.stroke();

  ctx.restore();


  /* FLOWER LEFT */

  drawPngFlower(
    ctx,
    PNG_WIDTH / 2 -
      specialDayFlowerOffset,
    specialDayY +
      18 * scale,
    specialDayFlowerSize,
    "rgba(184,135,145,0.72)",
    "#9c8760",
    scale
  );


  /* FLOWER RIGHT */

  drawPngFlower(
    ctx,
    PNG_WIDTH / 2 +
      specialDayFlowerOffset,
    specialDayY +
      18 * scale,
    specialDayFlowerSize,
    "rgba(184,135,145,0.72)",
    "#9c8760",
    scale
  );


  /* FOR YOUR SPECIAL DAY */

  drawLetterSpacedText(
    ctx,
    "FOR YOUR SPECIAL DAY",
    PNG_WIDTH / 2,
    specialDayY +
      specialDayPaddingTop,
    `600 ${8 * scale}px Arial, sans-serif`,
    WEBSITE_COLORS.textSoft,
    0.27 * scale
  );


  /* =======================================================
     BOTTOM BOTANICAL
  ======================================================= */

  drawFinaleBottomBotanical(
    ctx,
    PNG_WIDTH / 2,
    canvas.height -
      bottomDecorationBottom,
    scale
  );


  /* =======================================================
     RETURN CANVAS
  ======================================================= */

  return canvas;
}


/* =========================================================
   WEBSITE FLOWER COMPONENT
========================================================= */

function FinaleFlower({
  size = 54,
  className = "",
  flowerColor = WEBSITE_COLORS.flower,
  centerColor = WEBSITE_COLORS.gold,
}) {
  const petalSize =
    size * 0.38;

  const petalHeight =
    size * 0.62;

  const centerSize =
    size * 0.24;

  return (
    <span
      className={
        `finale-floral-flower ${className}`
      }
      aria-hidden="true"
      style={{
        position:
          "absolute",

        width:
          `${size}px`,

        height:
          `${size}px`,

        display:
          "block",

        pointerEvents:
          "none",

        zIndex:
          8,
      }}
    >
      {[
        0,
        60,
        120,
        180,
        240,
        300,
      ].map(
        (
          rotation
        ) => (
          <span
            key={
              rotation
            }
            className="finale-floral-petal"
            style={{
              position:
                "absolute",

              left:
                "50%",

              top:
                "50%",

              width:
                `${petalSize}px`,

              height:
                `${petalHeight}px`,

              borderRadius:
                "55% 55% 48% 48%",

              background:
                flowerColor,

              border:
                "1px solid rgba(112,76,86,0.18)",

              boxSizing:
                "border-box",

              transformOrigin:
                `50% ${petalHeight * 0.82}px`,

              transform:
                `translate(-50%, -82%) rotate(${rotation}deg)`,
            }}
          />
        )
      )}

      <span
        className="finale-floral-center"
        style={{
          position:
            "absolute",

          left:
            "50%",

          top:
            "50%",

          width:
            `${centerSize}px`,

          height:
            `${centerSize}px`,

          transform:
            "translate(-50%, -50%)",

          borderRadius:
            "50%",

          background:
            `radial-gradient(circle at 35% 30%, #d7c29a 0%, ${centerColor} 58%, #806d4e 100%)`,

          border:
            "1px solid rgba(86,65,45,0.25)",

          boxShadow:
            "0 1px 3px rgba(60,40,40,0.14)",
        }}
      />
    </span>
  );
}


/* =========================================================
   WEBSITE LEAF COMPONENT
========================================================= */

function FinaleLeaf({
  width = 22,
  height = 42,
  rotation = 0,
  color = WEBSITE_COLORS.leaf,
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position:
          "absolute",

        width:
          `${width}px`,

        height:
          `${height}px`,

        borderRadius:
          "100% 0 100% 0",

        background:
          color,

        border:
          "1px solid rgba(75,82,66,0.18)",

        opacity:
          0.72,

        transform:
          `rotate(${rotation}deg)`,

        pointerEvents:
          "none",

        zIndex:
          7,
      }}
    />
  );
}


/* =========================================================
   WEBSITE FLORAL CORNER
========================================================= */

function FinaleFloralCorner({
  position = "top-left",
  scale = 1,
}) {
  const positions = {
    "top-left": {
      top: "-28px",
      left: "-30px",
      transform:
        `rotate(-12deg) scale(${scale})`,
    },

    "top-right": {
      top: "-28px",
      right: "-30px",
      transform:
        `scaleX(-1) rotate(-12deg) scale(${scale})`,
    },

    "bottom-left": {
      bottom: "-32px",
      left: "-28px",
      transform:
        `scaleY(-1) rotate(-8deg) scale(${scale})`,
    },

    "bottom-right": {
      bottom: "-32px",
      right: "-28px",
      transform:
        `scale(-1,-1) rotate(-8deg) scale(${scale})`,
    },
  };

  const placement =
    positions[position];

  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        width:
          "112px",

        height:
          "112px",

        pointerEvents:
          "none",

        zIndex:
          12,

        ...placement,
      }}
    >
      <span
        style={{
          position:
            "absolute",

          left:
            "30px",

          top:
            "24px",

          width:
            "2px",

          height:
            "86px",

          background:
            "linear-gradient(180deg, rgba(105,116,95,0.82), rgba(105,116,95,0.18))",

          borderRadius:
            "100%",

          transform:
            "rotate(28deg)",

          transformOrigin:
            "top center",
        }}
      />

      <span
        style={{
          position:
            "absolute",

          left:
            "42px",

          top:
            "35px",

          width:
            "2px",

          height:
            "58px",

          background:
            "rgba(105,116,95,0.55)",

          transform:
            "rotate(-38deg)",

          transformOrigin:
            "top center",

          borderRadius:
            "100%",
        }}
      />

      <FinaleLeaf
        width={20}
        height={38}
        rotation={-58}
        color="rgba(105,116,95,0.68)"
      />

      <span
        style={{
          position:
            "absolute",

          left:
            "14px",

          top:
            "52px",
        }}
      >
        <FinaleLeaf
          width={20}
          height={40}
          rotation={-58}
          color="rgba(105,116,95,0.68)"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          left:
            "48px",

          top:
            "52px",
        }}
      >
        <FinaleLeaf
          width={19}
          height={36}
          rotation={42}
          color="rgba(120,129,106,0.62)"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          left:
            "29px",

          top:
            "75px",
        }}
      >
        <FinaleLeaf
          width={17}
          height={34}
          rotation={-52}
          color="rgba(120,129,106,0.52)"
        />
      </span>

      <FinaleFlower
        size={55}
        className="finale-floral-main"
        flowerColor="rgba(184,135,145,0.92)"
        centerColor="#9c8760"
      />

      <span
        style={{
          position:
            "absolute",

          left:
            "62px",

          top:
            "12px",
        }}
      >
        <FinaleFlower
          size={31}
          flowerColor="rgba(205,169,177,0.86)"
          centerColor="#aa9166"
        />
      </span>
    </div>
  );
}


/* =========================================================
   WEBSITE PHOTO FRAME DECORATION
========================================================= */

function FinalePhotoDecoration() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        inset:
          "-17px",

        pointerEvents:
          "none",

        zIndex:
          8,
      }}
    >
      <span
        style={{
          position:
            "absolute",

          top:
            "-16px",

          left:
            "-16px",

          width:
            "48px",

          height:
            "48px",
        }}
      >
        <FinaleFlower
          size={48}
          flowerColor="rgba(184,135,145,0.90)"
          centerColor="#9c8760"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          top:
            "-9px",

          right:
            "-8px",

          width:
            "32px",

          height:
            "32px",
        }}
      >
        <FinaleFlower
          size={32}
          flowerColor="rgba(205,169,177,0.82)"
          centerColor="#aa9166"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          bottom:
            "-9px",

          left:
            "-10px",

          width:
            "34px",

          height:
            "34px",
        }}
      >
        <FinaleFlower
          size={34}
          flowerColor="rgba(193,151,159,0.72)"
          centerColor="#a28b65"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          bottom:
            "-15px",

          right:
            "-16px",

          width:
            "47px",

          height:
            "47px",
        }}
      >
        <FinaleFlower
          size={47}
          flowerColor="rgba(184,135,145,0.84)"
          centerColor="#9c8760"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          top:
            "2px",

          left:
            "20px",

          transform:
            "rotate(-38deg)",
        }}
      >
        <FinaleLeaf
          width={11}
          height={26}
          rotation={0}
          color="rgba(105,116,95,0.68)"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          top:
            "18px",

          right:
            "20px",

          transform:
            "rotate(38deg)",
        }}
      >
        <FinaleLeaf
          width={10}
          height={25}
          rotation={0}
          color="rgba(105,116,95,0.62)"
        />
      </span>

      <span
        style={{
          position:
            "absolute",

          left:
            "10px",

          bottom:
            "18px",

          width:
            "46px",

          height:
            "1px",

          background:
            "linear-gradient(90deg, rgba(105,116,95,0.08), rgba(105,116,95,0.52))",

          transform:
            "rotate(-15deg)",
        }}
      />

      <span
        style={{
          position:
            "absolute",

          right:
            "10px",

          bottom:
            "18px",

          width:
            "46px",

          height:
            "1px",

          background:
            "linear-gradient(90deg, rgba(105,116,95,0.52), rgba(105,116,95,0.08))",

          transform:
            "rotate(15deg)",
        }}
      />
    </div>
  );
}


/* =========================================================
   WEBSITE CARD CENTER ORNAMENT
========================================================= */

function FinaleCardOrnament() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        left:
          "50%",

        top:
          "20px",

        transform:
          "translateX(-50%)",

        width:
          "150px",

        height:
          "30px",

        pointerEvents:
          "none",

        zIndex:
          4,

        opacity:
          0.85,
      }}
    >
      <span
        style={{
          position:
            "absolute",

          left:
            0,

          top:
            "14px",

          width:
            "42px",

          height:
            "1px",

          background:
            "linear-gradient(90deg, transparent, rgba(156,135,96,0.65))",
        }}
      />

      <span
        style={{
          position:
            "absolute",

          right:
            0,

          top:
            "14px",

          width:
            "42px",

          height:
            "1px",

          background:
            "linear-gradient(90deg, rgba(156,135,96,0.65), transparent)",
        }}
      />

      <span
        style={{
          position:
            "absolute",

          left:
            "50%",

          top:
            "7px",

          width:
            "14px",

          height:
            "14px",

          border:
            "1px solid rgba(156,135,96,0.62)",

          transform:
            "translateX(-50%) rotate(45deg)",

          background:
            "rgba(156,135,96,0.08)",
        }}
      />

      <span
        style={{
          position:
            "absolute",

          left:
            "50%",

          top:
            "9px",

          width:
            "10px",

          height:
            "10px",

          transform:
            "translateX(-50%)",

          borderRadius:
            "50%",

          background:
            "rgba(184,135,145,0.75)",
        }}
      />
    </div>
  );
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
    photos
      .filter(Boolean)
      .slice(0, 3);


  /* =======================================================
     OPEN LETTER
  ======================================================= */

  const handleOpenLetter =
    () => {
      if (
        isEnvelopeOpening
      ) {
        return;
      }

      setIsEnvelopeOpening(
        true
      );

      setTimeout(() => {
        if (
          typeof onNext ===
          "function"
        ) {
          onNext();
        }
      }, 1500);
    };


  /* =======================================================
     DOWNLOAD PNG
     -------------------------------------------------------
     JANGAN DIUBAH.
  ======================================================= */

  const handleDownload =
    async () => {
      if (
        isDownloading ||
        uploadedPhotos.length ===
          0
      ) {
        return;
      }

      setIsDownloading(
        true
      );

      try {
        const canvas =
          await createMemoryImage(
            uploadedPhotos
          );

        canvas.toBlob(
          (
            blob
          ) => {
            if (!blob) {
              setIsDownloading(
                false
              );

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

            link.href =
              url;

            link.download =
              "for-tari-memory.png";

            document.body.appendChild(
              link
            );

            link.click();

            link.remove();

            setTimeout(() => {
              URL.revokeObjectURL(
                url
              );

              setIsDownloading(
                false
              );
            }, 700);
          },
          "image/png"
        );
      } catch (error) {
        console.error(
          "Gagal membuat memory image:",
          error
        );

        setIsDownloading(
          false
        );
      }
    };


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <section
      className="scene scene-finale"
    >

      {/* ===================================================
          EXISTING COSMIC BACKGROUND
      =================================================== */}

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


      {/* ===================================================
          EXISTING AMBIENT GLOW
      =================================================== */}

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

      <div
        className="finale-content"
        style={{
          position:
            "relative",

          zIndex:
            2,
        }}
      >

        {/* =================================================
            MEMORY CARD
        ================================================= */}

        <motion.article
          className="finale-memory-card"
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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          style={{
            position:
              "relative",

            width:
              "min(88vw, 520px)",

            margin:
              "0 auto",

            padding:
              "clamp(30px, 6vw, 52px)",

            boxSizing:
              "border-box",

            background:
              WEBSITE_COLORS.card,

            border:
              `1px solid ${WEBSITE_COLORS.border}`,

            color:
              WEBSITE_COLORS.text,

            boxShadow:
              "0 30px 90px rgba(0, 0, 0, 0.28)",

            overflow:
              "visible",
          }}
        >

          {/* =================================================
              VISIBLE FLORAL CORNERS
          ================================================= */}

          <FinaleFloralCorner
            position="top-left"
            scale={0.92}
          />

          <FinaleFloralCorner
            position="top-right"
            scale={0.92}
          />

          <FinaleFloralCorner
            position="bottom-left"
            scale={0.78}
          />

          <FinaleFloralCorner
            position="bottom-right"
            scale={0.78}
          />


          {/* =================================================
              TOP CENTER ORNAMENT
          ================================================= */}

          <FinaleCardOrnament />


          {/* =================================================
              BOTANICAL TOP LEFT
          ================================================= */}

          <div
            className="finale-card-botanical finale-card-botanical-left"
            aria-hidden="true"
            style={{
              position:
                "absolute",

              top:
                "82px",

              left:
                "18px",

              width:
                "65px",

              height:
                "80px",

              zIndex:
                3,

              opacity:
                0.7,

              pointerEvents:
                "none",
            }}
          >
            <span
              style={{
                position:
                  "absolute",

                left:
                  "26px",

                top:
                  "0",

                width:
                  "1px",

                height:
                  "76px",

                background:
                  "linear-gradient(180deg, rgba(105,116,95,.55), transparent)",

                transform:
                  "rotate(28deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "13px",

                top:
                  "27px",

                width:
                  "16px",

                height:
                  "32px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.30)",

                transform:
                  "rotate(-52deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "28px",

                top:
                  "46px",

                width:
                  "15px",

                height:
                  "30px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.24)",

                transform:
                  "rotate(38deg)",
              }}
            />
          </div>


          {/* =================================================
              BOTANICAL TOP RIGHT
          ================================================= */}

          <div
            className="finale-card-botanical finale-card-botanical-right"
            aria-hidden="true"
            style={{
              position:
                "absolute",

              top:
                "82px",

              right:
                "18px",

              width:
                "65px",

              height:
                "80px",

              zIndex:
                3,

              opacity:
                0.7,

              pointerEvents:
                "none",

              transform:
                "scaleX(-1)",
            }}
          >
            <span
              style={{
                position:
                  "absolute",

                left:
                  "26px",

                top:
                  "0",

                width:
                  "1px",

                height:
                  "76px",

                background:
                  "linear-gradient(180deg, rgba(105,116,95,.55), transparent)",

                transform:
                  "rotate(28deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "13px",

                top:
                  "27px",

                width:
                  "16px",

                height:
                  "32px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.30)",

                transform:
                  "rotate(-52deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "28px",

                top:
                  "46px",

                width:
                  "15px",

                height:
                  "30px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.24)",

                transform:
                  "rotate(38deg)",
              }}
            />
          </div>


          {/* =================================================
              CARD HEADER
          ================================================= */}

          <motion.div
            className="finale-card-header"
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
              delay: 0.15,
            }}
            style={{
              position:
                "relative",

              zIndex:
                4,

              textAlign:
                "center",

              marginBottom:
                "clamp(26px, 5vw, 38px)",
            }}
          >

            <p
              className="finale-card-eyebrow"
              style={{
                margin:
                  "0 0 16px",

                fontFamily:
                  "Arial, sans-serif",

                fontSize:
                  "8px",

                fontWeight:
                  600,

                letterSpacing:
                  "0.28em",

                color:
                  WEBSITE_COLORS.textMuted,

                textTransform:
                  "uppercase",
              }}
            >
              A LITTLE MEMORY FOR YOU
            </p>


            <div
              aria-hidden="true"
              style={{
                width:
                  "90px",

                height:
                  "1px",

                margin:
                  "0 auto 20px",

                background:
                  WEBSITE_COLORS.border,
              }}
            />


            <h1
              className="finale-card-title"
              style={{
                margin:
                  0,

                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  "clamp(24px, 6vw, 34px)",

                fontWeight:
                  400,

                lineHeight:
                  1.25,

                letterSpacing:
                  "-0.02em",

                color:
                  WEBSITE_COLORS.text,
              }}
            >
              selamat ulang tahun,
              <br />

              <span
                style={{
                  display:
                    "inline-block",

                  marginTop:
                    "4px",

                  fontStyle:
                    "italic",

                  fontSize:
                    "1.18em",
                }}
              >
                Tari. ♡
              </span>
            </h1>

          </motion.div>


          {/* =================================================
              PHOTOS
          ================================================= */}

          <div
            className="finale-photo-column"
            style={{
              position:
                "relative",

              zIndex:
                4,

              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "clamp(24px, 5vw, 34px)",

              width:
                "100%",
            }}
          >

            {uploadedPhotos.map(
              (
                photo,
                index
              ) => {
                const photoSrc =
                  getPhotoSrc(
                    photo
                  );

                if (!photoSrc) {
                  return null;
                }

                return (
                  <motion.figure
                    className="finale-photo-item"
                    key={
                      `${photoSrc}-${index}`
                    }
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration:
                        0.8,

                      delay:
                        0.25 +
                        index *
                          0.1,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    style={{
                      margin:
                        0,

                      width:
                        "100%",

                      position:
                        "relative",
                    }}
                  >

                    <div
                      className="finale-photo-frame"
                      style={{
                        position:
                          "relative",

                        width:
                          "100%",

                        aspectRatio:
                          "1 / 1",

                        overflow:
                          "visible",

                        background:
                          "#ebe8e0",

                        border:
                          `1px solid ${WEBSITE_COLORS.borderSoft}`,

                        boxSizing:
                          "border-box",
                      }}
                    >

                      <div
                        style={{
                          position:
                            "absolute",

                          inset:
                            0,

                          overflow:
                            "hidden",

                          background:
                            "#ebe8e0",
                        }}
                      >
                        <img
                          src={
                            photoSrc
                          }
                          alt={`Memory ${
                            index + 1
                          }`}
                          style={{
                            display:
                              "block",

                            width:
                              "100%",

                            height:
                              "100%",

                            objectFit:
                              "cover",

                            objectPosition:
                              "center",

                            filter:
                              "saturate(0.94) contrast(0.98)",

                            transition:
                              "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </div>


                      <FinalePhotoDecoration />


                      <span
                        aria-hidden="true"
                        style={{
                          position:
                            "absolute",

                          inset:
                            "8px",

                          border:
                            "1px solid rgba(255,255,255,0.30)",

                          zIndex:
                            7,

                          pointerEvents:
                            "none",
                        }}
                      />

                    </div>

                  </motion.figure>
                );
              }
            )}

          </div>


          {/* =================================================
              SPECIAL DAY
          ================================================= */}

          {uploadedPhotos.length >
            0 && (
            <motion.div
              className="finale-card-special-day"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration:
                  0.75,

                delay:
                  0.55,
              }}
              style={{
                position:
                  "relative",

                zIndex:
                  4,

                marginTop:
                  "clamp(32px, 6vw, 46px)",

                paddingTop:
                  "clamp(24px, 5vw, 34px)",

                borderTop:
                  `1px solid ${WEBSITE_COLORS.border}`,

                textAlign:
                  "center",
              }}
            >

              <span
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  top:
                    "18px",

                  left:
                    "calc(50% - 88px)",

                  width:
                    "24px",

                  height:
                    "24px",

                  transform:
                    "translateX(-50%)",
                }}
              >
                <FinaleFlower
                  size={24}
                  flowerColor="rgba(184,135,145,0.72)"
                  centerColor="#9c8760"
                />
              </span>


              <span
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  top:
                    "18px",

                  left:
                    "calc(50% + 88px)",

                  width:
                    "24px",

                  height:
                    "24px",

                  transform:
                    "translateX(-50%)",
                }}
              >
                <FinaleFlower
                  size={24}
                  flowerColor="rgba(184,135,145,0.72)"
                  centerColor="#9c8760"
                />
              </span>


              <p
                style={{
                  margin:
                    0,

                  fontFamily:
                    "Arial, sans-serif",

                  fontSize:
                    "8px",

                  fontWeight:
                    600,

                  letterSpacing:
                    "0.27em",

                  color:
                    WEBSITE_COLORS.textSoft,

                  textTransform:
                    "uppercase",
                }}
              >
                FOR YOUR SPECIAL DAY
              </p>

            </motion.div>
          )}


          {/* =================================================
              BOTTOM BOTANICAL
          ================================================= */}

          <div
            className="finale-card-botanical-bottom"
            aria-hidden="true"
            style={{
              position:
                "absolute",

              bottom:
                "20px",

              left:
                "50%",

              transform:
                "translateX(-50%)",

              width:
                "120px",

              height:
                "35px",

              zIndex:
                3,

              pointerEvents:
                "none",
            }}
          >
            <span
              style={{
                position:
                  "absolute",

                left:
                  "0",

                top:
                  "16px",

                width:
                  "45px",

                height:
                  "1px",

                background:
                  "linear-gradient(90deg, transparent, rgba(105,116,95,.48))",

                transform:
                  "rotate(-8deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                right:
                  "0",

                top:
                  "16px",

                width:
                  "45px",

                height:
                  "1px",

                background:
                  "linear-gradient(90deg, rgba(105,116,95,.48), transparent)",

                transform:
                  "rotate(8deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "30px",

                top:
                  "6px",

                width:
                  "14px",

                height:
                  "25px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.32)",

                transform:
                  "rotate(-35deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                right:
                  "30px",

                top:
                  "6px",

                width:
                  "14px",

                height:
                  "25px",

                borderRadius:
                  "100% 0 100% 0",

                background:
                  "rgba(105,116,95,.32)",

                transform:
                  "rotate(35deg)",
              }}
            />

            <span
              style={{
                position:
                  "absolute",

                left:
                  "50%",

                top:
                  "5px",

                transform:
                  "translateX(-50%)",
              }}
            >
              <FinaleFlower
                size={27}
                flowerColor="rgba(184,135,145,0.68)"
                centerColor="#9c8760"
              />
            </span>
          </div>

        </motion.article>


        {/* =================================================
            ONE MORE THING
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
            delay: 0.45,
          }}
          style={{
            width:
              "100%",

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            marginTop:
              "clamp(48px, 9vw, 72px)",

            position:
              "relative",

            zIndex:
              10,

            overflow:
              "visible",
          }}
        >

          <p
            className="finale-letter-eyebrow"
            style={{
              position:
                "relative",

              zIndex:
                20,

              margin:
                "0 0 17px",

              fontFamily:
                "Arial, sans-serif",

              fontSize:
                "8px",

              letterSpacing:
                "0.28em",

              color:
                "rgba(255,249,253,0.68)",

              textTransform:
                "uppercase",

              lineHeight:
                1.4,
            }}
          >
            ONE MORE THING
          </p>


          <div
            aria-hidden="true"
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              marginBottom:
                "28px",
            }}
          >
            <span
              style={{
                display:
                  "block",

                width:
                  "52px",

                height:
                  "1px",

                background:
                  "rgba(255,249,253,0.16)",
              }}
            />

            <span
              style={{
                display:
                  "block",

                width:
                  "6px",

                height:
                  "6px",

                border:
                  "1px solid rgba(255,249,253,0.45)",

                transform:
                  "rotate(45deg)",
              }}
            />

            <span
              style={{
                display:
                  "block",

                width:
                  "52px",

                height:
                  "1px",

                background:
                  "rgba(255,249,253,0.16)",
              }}
            />
          </div>


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
            style={{
              position:
                "relative",

              width:
                "min(82vw, 360px)",

              height:
                "230px",

              margin:
                "0 auto",

              padding:
                0,

              border:
                "none",

              background:
                "transparent",

              cursor:
                isEnvelopeOpening
                  ? "default"
                  : "pointer",

              overflow:
                "visible",

              perspective:
                "1000px",

              WebkitTapHighlightColor:
                "transparent",
            }}
          >

            <motion.div
              className="finale-envelope"
              animate={
                isEnvelopeOpening
                  ? {
                      y: 8,
                      rotate: -1.5,
                    }
                  : {
                      y: [
                        0,
                        -3,
                        0,
                      ],
                      rotate: 0,
                    }
              }
              transition={
                isEnvelopeOpening
                  ? {
                      duration:
                        0.55,

                      ease:
                        "easeInOut",
                    }
                  : {
                      duration:
                        4,

                      repeat:
                        Infinity,

                      ease:
                        "easeInOut",
                    }
              }
              style={{
                position:
                  "absolute",

                left:
                  "50%",

                top:
                  "50%",

                width:
                  "100%",

                height:
                  "100%",

                transform:
                  "translate(-50%, -50%)",

                transformStyle:
                  "preserve-3d",

                filter:
                  "drop-shadow(0 22px 32px rgba(0,0,0,.42))",
              }}
            >

              <div
                className="envelope-back"
                style={{
                  position:
                    "absolute",

                  inset:
                    0,

                  borderRadius:
                    "5px",

                  background:
                    "linear-gradient(145deg, #714966 0%, #5d3856 48%, #472b45 100%)",

                  border:
                    "1px solid rgba(231,191,210,.24)",

                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,.15), inset 0 -10px 20px rgba(20,5,20,.15)",

                  overflow:
                    "hidden",
                }}
              />


              <motion.div
                className="envelope-letter"
                animate={
                  isEnvelopeOpening
                    ? {
                        y: -82,
                        opacity: 1,
                        rotate: 0,
                      }
                    : {
                        y: 8,
                        opacity: 0.96,
                        rotate: 0,
                      }
                }
                transition={{
                  duration:
                    0.8,

                  delay:
                    0.2,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                style={{
                  position:
                    "absolute",

                  left:
                    "11%",

                  top:
                    "10%",

                  width:
                    "78%",

                  height:
                    "82%",

                  background:
                    "#fffafd",

                  borderRadius:
                    "3px",

                  boxShadow:
                    "0 5px 20px rgba(0,0,0,.18)",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  zIndex:
                    2,

                  color:
                    "#6f315e",

                  fontFamily:
                    "Georgia, serif",

                  fontSize:
                    "12px",

                  letterSpacing:
                    ".08em",
                }}
              >
                <span
                  style={{
                    opacity:
                      0.45,
                  }}
                >
                  a little letter
                </span>
              </motion.div>


              <div
                className="envelope-fold envelope-fold-left"
                style={{
                  position:
                    "absolute",

                  left:
                    0,

                  bottom:
                    0,

                  width:
                    0,

                  height:
                    0,

                  borderTop:
                    "115px solid transparent",

                  borderBottom:
                    "115px solid transparent",

                  borderLeft:
                    "168px solid #54324f",

                  zIndex:
                    5,

                  filter:
                    "drop-shadow(1px 0 1px rgba(255,255,255,.05))",
                }}
              />


              <div
                className="envelope-fold envelope-fold-right"
                style={{
                  position:
                    "absolute",

                  right:
                    0,

                  bottom:
                    0,

                  width:
                    0,

                  height:
                    0,

                  borderTop:
                    "115px solid transparent",

                  borderBottom:
                    "115px solid transparent",

                  borderRight:
                    "168px solid #54324f",

                  zIndex:
                    5,

                  filter:
                    "drop-shadow(-1px 0 1px rgba(255,255,255,.05))",
                }}
              />


              <div
                className="envelope-fold envelope-fold-bottom"
                style={{
                  position:
                    "absolute",

                  left:
                    0,

                  bottom:
                    0,

                  width:
                    0,

                  height:
                    0,

                  borderLeft:
                    "180px solid transparent",

                  borderRight:
                    "180px solid transparent",

                  borderBottom:
                    "118px solid #472b45",

                  zIndex:
                    6,

                  filter:
                    "drop-shadow(0 -1px 1px rgba(255,255,255,.04))",
                }}
              />


              <motion.div
                className="envelope-flap"
                animate={
                  isEnvelopeOpening
                    ? {
                        rotateX:
                          -178,
                      }
                    : {
                        rotateX:
                          0,
                      }
                }
                transition={{
                  duration:
                    0.85,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                style={{
                  position:
                    "absolute",

                  top:
                    0,

                  left:
                    0,

                  width:
                    "100%",

                  height:
                    "55%",

                  transformOrigin:
                    "50% 0%",

                  transformStyle:
                    "preserve-3d",

                  zIndex:
                    9,

                  pointerEvents:
                    "none",
                }}
              >
                <div
                  style={{
                    position:
                      "absolute",

                    left:
                      0,

                    top:
                      0,

                    width:
                      0,

                    height:
                      0,

                    borderLeft:
                      "180px solid transparent",

                    borderRight:
                      "180px solid transparent",

                    borderTop:
                      "112px solid #79516f",

                    filter:
                      "drop-shadow(0 2px 3px rgba(0,0,0,.25))",
                  }}
                />

                <div
                  style={{
                    position:
                      "absolute",

                    left:
                      "8%",

                    top:
                      "1px",

                    width:
                      "84%",

                    height:
                      "1px",

                    background:
                      "rgba(255,255,255,.22)",

                    opacity:
                      0.8,
                  }}
                />
              </motion.div>


              <motion.div
                className="envelope-seal"
                animate={
                  isEnvelopeOpening
                    ? {
                        scale:
                          0.94,

                        opacity:
                          0.9,
                      }
                    : {
                        scale: [
                          1,
                          1.035,
                          1,
                        ],
                      }
                }
                transition={
                  isEnvelopeOpening
                    ? {
                        duration:
                          0.35,
                      }
                    : {
                        duration:
                          3.2,

                        repeat:
                          Infinity,

                        ease:
                          "easeInOut",
                      }
                }
                style={{
                  position:
                    "absolute",

                  left:
                    "50%",

                  top:
                    "58%",

                  transform:
                    "translate(-50%, -50%)",

                  width:
                    "62px",

                  height:
                    "62px",

                  borderRadius:
                    "50%",

                  background:
                    "radial-gradient(circle at 35% 30%, #dcb4ca 0%, #a56e91 38%, #734764 100%)",

                  border:
                    "2px solid rgba(255,248,252,.62)",

                  boxShadow:
                    "0 6px 18px rgba(20,5,20,.38), inset 0 2px 4px rgba(255,255,255,.25)",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  zIndex:
                    12,

                  color:
                    "#fff8fc",

                  fontFamily:
                    "Georgia, serif",

                  fontSize:
                    "27px",

                  lineHeight:
                    1,
                }}
              >
                ♡
              </motion.div>


              <div
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  left:
                    "calc(50% - 19px)",

                  top:
                    "calc(58% - 19px)",

                  width:
                    "10px",

                  height:
                    "6px",

                  borderRadius:
                    "50%",

                  background:
                    "rgba(255,255,255,.30)",

                  filter:
                    "blur(1px)",

                  zIndex:
                    13,

                  pointerEvents:
                    "none",
                }}
              />

            </motion.div>


            <div
              className="finale-envelope-sparkles"
              aria-hidden="true"
              style={{
                position:
                  "absolute",

                inset:
                  "-20px",

                pointerEvents:
                  "none",

                zIndex:
                  15,
              }}
            >

              <span
                className="envelope-sparkle sparkle-a"
                style={{
                  position:
                    "absolute",

                  left:
                    "5%",

                  top:
                    "15%",

                  color:
                    "rgba(231,191,210,.75)",

                  fontSize:
                    "15px",
                }}
              >
                ✦
              </span>

              <span
                className="envelope-sparkle sparkle-b"
                style={{
                  position:
                    "absolute",

                  right:
                    "7%",

                  top:
                    "19%",

                  color:
                    "rgba(231,191,210,.55)",

                  fontSize:
                    "13px",
                }}
              >
                ✧
              </span>

              <span
                className="envelope-sparkle sparkle-c"
                style={{
                  position:
                    "absolute",

                  left:
                    "12%",

                  bottom:
                    "12%",

                  color:
                    "rgba(212,154,183,.55)",

                  fontSize:
                    "12px",
                }}
              >
                ✦
              </span>

              <span
                className="envelope-sparkle sparkle-d"
                style={{
                  position:
                    "absolute",

                  right:
                    "12%",

                  bottom:
                    "13%",

                  color:
                    "rgba(212,154,183,.55)",

                  fontSize:
                    "11px",
                }}
              >
                ✧
              </span>

            </div>

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
              duration:
                0.35,
            }}
            style={{
              position:
                "relative",

              zIndex:
                20,

              margin:
                "16px 0 0",

              fontFamily:
                "Georgia, serif",

              fontSize:
                "11px",

              fontStyle:
                "italic",

              color:
                "rgba(255,248,252,.58)",

              textAlign:
                "center",

              lineHeight:
                1.5,
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
              duration:
                0.4,

              delay:
                0.65,
            }}
            style={{
              position:
                "relative",

              zIndex:
                20,

              margin:
                "10px 0 0",

              fontFamily:
                "Arial, sans-serif",

              fontSize:
                "9px",

              letterSpacing:
                "0.18em",

              textTransform:
                "uppercase",

              color:
                "rgba(231,191,210,.72)",
            }}
          >
            membuka surat...
          </motion.p>

        </motion.div>


        {/* =================================================
            DOWNLOAD ACTION
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
            delay: 0.65,
          }}
          style={{
            marginTop:
              "clamp(30px, 6vw, 42px)",

            position:
              "relative",

            zIndex:
              20,

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",
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
              uploadedPhotos.length ===
                0
            }
            aria-label="Simpan kenangan sebagai PNG"
          >

            <span>
              {isDownloading
                ? "sedang menyimpan kenangan..."
                : "simpan kenangan ini"}
            </span>


            <span
              className="save-download-icon"
              aria-hidden="true"
            >

              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >

                <path
                  d="M12 3V14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <path
                  d="M7.5 10.5L12 15L16.5 10.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M4 17V18.5C4 19.9 5.1 21 6.5 21H17.5C18.9 21 20 19.9 20 18.5V17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </span>

          </button>


          <p className="finale-quality">
            PNG · high resolution · lossless
          </p>

        </motion.div>


        {/* =================================================
            SIGNATURE
        ================================================= */}

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
            delay: 0.75,
          }}
        >
          made with a little too much effort ♡
        </motion.p>

      </div>

    </section>
  );
}