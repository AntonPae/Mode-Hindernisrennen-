/**
 * Utility to render a modular 2D vector-style character with cinematic golden lighting,
 * dynamic wind sway on hair/mane, skin color customization, riding outfits, sticker emblems,
 * and authentic 2D animated cartoon (Zeichentrick) movie character styling.
 */

export function renderCharacter(ctx, x, y, playerConfig, animationState = { frame: 0, pose: 'idle' }) {
  ctx.save();
  ctx.translate(x, y);

  const scaleX = playerConfig.body.width || 1.0;
  const scaleY = playerConfig.body.height || 1.0;

  // Base proportions (standing tall around 160px height)
  const headRadius = 24 * Math.min(scaleX, scaleY);
  const headY = -120 * scaleY;
  const torsoWidth = 36 * scaleX;
  const torsoHeight = 50 * scaleY;
  const torsoY = headY + headRadius + 6;

  const legWidth = 14 * scaleX;
  const legHeight = 50 * scaleY;
  const legY = torsoY + torsoHeight;

  const armWidth = 12 * scaleX;
  const armHeight = 45 * scaleY;

  const skinColor = playerConfig.body.skinColor || '#f5c29b';

  // Dynamic wind sway for hair
  const windSway = animationState.pose === 'run' ? Math.sin(animationState.frame * 0.3) * 6 : Math.sin(animationState.frame * 0.1) * 2;

  // Animation leg/arm angles
  let leg1Angle = 0;
  let leg2Angle = 0;
  let arm1Angle = 0;
  let arm2Angle = 0;

  if (animationState.pose === 'run') {
    const runCycle = Math.sin(animationState.frame * 0.28);
    leg1Angle = runCycle * 0.65;
    leg2Angle = -runCycle * 0.65;
    arm1Angle = -runCycle * 0.75;
    arm2Angle = runCycle * 0.75;
  } else if (animationState.pose === 'jump') {
    leg1Angle = -0.45;
    leg2Angle = 0.35;
    arm1Angle = -1.3;
    arm2Angle = -0.85;
  } else if (animationState.pose === 'duck') {
    ctx.scale(1, 0.6);
  }

  // Dynamic Ground Shadow (shrinks when high in the air)
  ctx.save();
  const jumpHeightOffset = animationState.pose === 'jump' ? 25 : 0;
  ctx.beginPath();
  ctx.ellipse(0, jumpHeightOffset, (34 * scaleX) * (1 - jumpHeightOffset * 0.015), 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fill();
  ctx.restore();

  // Neck with soft cell-shadow
  ctx.fillStyle = getShadowColor(skinColor, 0.2);
  ctx.fillRect(-headRadius * 0.25, headY + headRadius - 2, headRadius * 0.5, torsoY - (headY + headRadius) + 4);
  ctx.fillStyle = skinColor;
  ctx.fillRect(-headRadius * 0.2, headY + headRadius - 2, headRadius * 0.4, torsoY - (headY + headRadius) + 4);

  // Back Arm
  drawArm(ctx, -torsoWidth / 2 - 2, torsoY + 8, armWidth, armHeight, arm2Angle, playerConfig.clothes.top, skinColor);

  // Back Leg & Shoe
  drawLeg(ctx, -torsoWidth / 4 - legWidth / 2, legY, legWidth, legHeight, leg1Angle, playerConfig.clothes.pants, playerConfig.clothes.shoes, skinColor);

  // Front Leg & Shoe
  drawLeg(ctx, torsoWidth / 4 - legWidth / 2, legY, legWidth, legHeight, leg2Angle, playerConfig.clothes.pants, playerConfig.clothes.shoes, skinColor);

  // Torso / Top Clothing
  drawTorso(ctx, -torsoWidth / 2, torsoY, torsoWidth, torsoHeight, playerConfig.clothes.top, skinColor);

  // Front Arm
  drawArm(ctx, torsoWidth / 2 + 2, torsoY + 8, armWidth, armHeight, arm1Angle, playerConfig.clothes.top, skinColor);

  // Head & Cartoon Features & Hair
  drawHead(ctx, 0, headY, headRadius, playerConfig.body, windSway, skinColor);

  ctx.restore();
}

/** Helper to darken colors for cartoon cell-shading */
function getShadowColor(hex, factor = 0.25) {
  if (!hex || !hex.startsWith('#')) return 'rgba(0, 0, 0, 0.25)';
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) - Math.round(255 * factor);
  let g = ((num >> 8) & 0x00FF) - Math.round(255 * factor);
  let b = (num & 0x0000FF) - Math.round(255 * factor);
  r = Math.max(0, r); g = Math.max(0, g); b = Math.max(0, b);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawArm(ctx, x, y, width, height, angle, topConfig, skinColor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = topConfig.color || '#8b4513';
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2;

  let sleeveH = height * 0.7;
  if (topConfig.style === 'tshirt' || topConfig.style === 'riding_vest') sleeveH = height * 0.35;

  ctx.beginPath();
  ctx.roundRect(-width / 2, 0, width, sleeveH, [3]);
  ctx.fill();
  ctx.stroke();

  // Cartoon Cell Shadow on sleeve
  ctx.fillStyle = getShadowColor(topConfig.color || '#8b4513', 0.2);
  ctx.fillRect(width * 0.1, 0, width * 0.4, sleeveH);

  // Exposed skin arm
  if (sleeveH < height) {
    ctx.fillStyle = skinColor;
    ctx.fillRect(-width / 2 + 1, sleeveH, width - 2, height - sleeveH);
    ctx.strokeRect(-width / 2 + 1, sleeveH, width - 2, height - sleeveH);

    // Hand
    ctx.beginPath();
    ctx.arc(0, height, width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawHead(ctx, x, y, radius, bodyConfig, windSway = 0, skinColor = '#f5c29b') {
  ctx.save();
  ctx.translate(x, y);

  // Face Shape (2D Cartoon Soft Oval / Chin Contour)
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 1.05, 0, 0, Math.PI * 2);
  ctx.fillStyle = skinColor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2d1810';
  ctx.stroke();

  // Soft Cell-Shading on Right Jawline
  ctx.save();
  ctx.clip();
  ctx.fillStyle = getShadowColor(skinColor, 0.12);
  ctx.beginPath();
  ctx.ellipse(radius * 0.4, radius * 0.3, radius * 0.8, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Soft Blush Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.45, radius * 0.15, radius * 0.22, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.45, radius * 0.15, radius * 0.22, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Nose Line
  ctx.strokeStyle = '#8c533e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-1, radius * 0.05);
  ctx.lineTo(2, radius * 0.12);
  ctx.lineTo(-1, radius * 0.18);
  ctx.stroke();

  // Draw 2D Cartoon Animated Eyes & Face Expression
  drawCartoonFace(ctx, radius, bodyConfig.faceId);

  // Hair / Flowing Mane in Wind / Cap
  if (bodyConfig.hairId !== 'hair_none') {
    drawCartoonHair(ctx, radius, bodyConfig.hairId, bodyConfig.hairColor || '#4a2e00', windSway);
  }

  ctx.restore();
}

function drawCartoonFace(ctx, radius, faceId) {
  const eyeY = -radius * 0.12;
  const eyeDist = radius * 0.38;
  const eyeW = radius * 0.26;
  const eyeH = radius * 0.34;

  switch (faceId) {
    case 'face_2': // Cool (Sunglasses)
      // Cartoon Dark Sunglasses
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(-radius * 0.7, -radius * 0.25, radius * 0.62, radius * 0.4, [4, 4, 12, 12]);
      ctx.roundRect(radius * 0.08, -radius * 0.25, radius * 0.62, radius * 0.4, [4, 4, 12, 12]);
      ctx.fill();
      ctx.stroke();

      // Sunglasses Bridge & Shine Reflection
      ctx.beginPath();
      ctx.moveTo(-radius * 0.08, -radius * 0.12);
      ctx.lineTo(radius * 0.08, -radius * 0.12);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.polygon = [[-radius * 0.5, -radius * 0.2], [-radius * 0.3, -radius * 0.2], [-radius * 0.5, radius * 0.05]];
      ctx.moveTo(-radius * 0.55, -radius * 0.2);
      ctx.lineTo(-radius * 0.35, -radius * 0.2);
      ctx.lineTo(-radius * 0.55, radius * 0.05);
      ctx.fill();

      // Confident Smile
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, radius * 0.2, radius * 0.28, 0.1, Math.PI - 0.1);
      ctx.stroke();
      break;

    case 'face_3': // Determined 😤
      drawSingleCartoonEye(ctx, -eyeDist, eyeY, eyeW, eyeH, false, 'determined');
      drawSingleCartoonEye(ctx, eyeDist, eyeY, eyeW, eyeH, true, 'determined');

      // Furrowed Eyebrows
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-radius * 0.6, -radius * 0.38);
      ctx.lineTo(-radius * 0.15, -radius * 0.25);
      ctx.moveTo(radius * 0.6, -radius * 0.38);
      ctx.lineTo(radius * 0.15, -radius * 0.25);
      ctx.stroke();

      // Determined Smirk
      ctx.beginPath();
      ctx.moveTo(-radius * 0.25, radius * 0.32);
      ctx.lineTo(radius * 0.2, radius * 0.28);
      ctx.stroke();
      break;

    case 'face_4': // Surprised 😲
      drawSingleCartoonEye(ctx, -eyeDist, eyeY - 2, eyeW * 1.1, eyeH * 1.1, false, 'wide');
      drawSingleCartoonEye(ctx, eyeDist, eyeY - 2, eyeW * 1.1, eyeH * 1.1, true, 'wide');

      // High Eyebrows
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-eyeDist, -radius * 0.42, eyeW * 0.8, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(eyeDist, -radius * 0.42, eyeW * 0.8, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Open Cartoon Mouth
      ctx.fillStyle = '#450a0a';
      ctx.strokeStyle = '#2d1810';
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.3, radius * 0.16, radius * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'face_5': // Smiling / Happy 🙂
    case 'face_6': // Cute 😊
    case 'face_1':
    default:
      drawSingleCartoonEye(ctx, -eyeDist, eyeY, eyeW, eyeH, false, faceId === 'face_6' ? 'cute' : 'normal');
      drawSingleCartoonEye(ctx, eyeDist, eyeY, eyeW, eyeH, true, faceId === 'face_6' ? 'cute' : 'normal');

      // Curved Gentle Eyebrows
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-eyeDist, -radius * 0.38, eyeW * 0.7, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(eyeDist, -radius * 0.38, eyeW * 0.7, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Big Cartoon Movie Smile with Tongue
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, radius * 0.22, radius * 0.32, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tongue arc inside mouth
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, radius * 0.38, radius * 0.18, Math.PI, Math.PI * 2);
      ctx.fill();
      break;
  }
}

/** Renders a detailed 2D animated movie cartoon eye */
function drawSingleCartoonEye(ctx, cx, cy, w, h, isRight, type = 'normal') {
  ctx.save();
  ctx.translate(cx, cy);

  if (type === 'cute') {
    // Arc eyelashes cute eye
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.8, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Eyelash flicks
    const side = isRight ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(side * w * 0.7, -h * 0.2);
    ctx.lineTo(side * w * 1.1, -h * 0.5);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // 1. Sclera (Eye White)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2d1810';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Iris (Warm Chestnut Hazel Cartoon Iris)
  const irisR = w * 0.72;
  const irisX = isRight ? -w * 0.1 : w * 0.1;

  ctx.fillStyle = '#451a03'; // Outer iris rim
  ctx.beginPath();
  ctx.arc(irisX, 0, irisR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d97706'; // Golden iris core
  ctx.beginPath();
  ctx.arc(irisX, 0, irisR * 0.75, 0, Math.PI * 2);
  ctx.fill();

  // 3. Pupil
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(irisX, 0, irisR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // 4. Cartoon Catchlight / Sparkle Highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(irisX - irisR * 0.35, -irisR * 0.35, irisR * 0.3, 0, Math.PI * 2);
  ctx.arc(irisX + irisR * 0.25, irisR * 0.25, irisR * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // 5. Upper Eyeliner & Lashes
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // Flick eyelash
  const lashDir = isRight ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(lashDir * w * 0.8, -h * 0.5);
  ctx.lineTo(lashDir * w * 1.25, -h * 0.85);
  ctx.stroke();

  ctx.restore();
}

/** Draws 2D Cartoon Hair with Cell-Shading Highlights */
function drawCartoonHair(ctx, radius, hairId, hairColor, windSway) {
  ctx.fillStyle = hairColor;
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2;

  const shadowHair = getShadowColor(hairColor, 0.25);
  const highlightHair = 'rgba(254, 240, 138, 0.35)';

  if (hairId === 'hair_1') { // Short Cartoon Hair
    ctx.beginPath();
    ctx.arc(0, -radius * 0.2, radius * 1.05, Math.PI * 0.98, Math.PI * 2.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stylized Front Bangs (sitting high above eyes)
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, -radius * 0.35);
    ctx.quadraticCurveTo(-radius * 0.3, -radius * 0.2, 0, -radius * 0.45);
    ctx.quadraticCurveTo(radius * 0.4, -radius * 0.2, radius * 0.8, -radius * 0.35);
    ctx.quadraticCurveTo(0, -radius * 0.9, -radius * 0.8, -radius * 0.35);
    ctx.fill();
    ctx.stroke();
  } else if (hairId === 'hair_ponytail') { // Spirit Style Zopf / Pferdeschwanz
    // Main Hair Dome (Top of head down to forehead top)
    ctx.beginPath();
    ctx.arc(0, -radius * 0.2, radius * 1.05, Math.PI * 0.98, Math.PI * 2.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Side Framing Strands (beside face, leaving face open)
    ctx.beginPath();
    ctx.moveTo(-radius * 0.95, -radius * 0.3);
    ctx.quadraticCurveTo(-radius * 1.1, radius * 0.1, -radius * 0.8, radius * 0.5);
    ctx.quadraticCurveTo(-radius * 0.6, radius * 0.1, -radius * 0.75, -radius * 0.3);
    ctx.fill();
    ctx.stroke();

    // Flowing Ponytail extending to the left in wind
    ctx.save();
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, -radius * 0.5);
    ctx.quadraticCurveTo(-radius * 1.6 - windSway, -radius * 0.8, -radius * 2.2 - windSway * 1.5, radius * 0.2);
    ctx.quadraticCurveTo(-radius * 1.4, radius * 0.5, -radius * 0.8, -radius * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hair Band
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-radius * 0.95, -radius * 0.5, 6, 12);
    ctx.restore();
  } else if (hairId === 'hair_waves' || hairId === 'hair_3') { // Long Wild Mane / Waves
    // Hair Dome (top head)
    ctx.beginPath();
    ctx.arc(0, -radius * 0.2, radius * 1.05, Math.PI * 0.98, Math.PI * 2.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left Long Waves (framing face to the left)
    ctx.beginPath();
    ctx.moveTo(-radius * 0.95, -radius * 0.3);
    ctx.quadraticCurveTo(-radius * 1.3 - windSway * 0.5, radius * 0.6, -radius * 0.9 - windSway * 0.8, radius * 1.6);
    ctx.quadraticCurveTo(-radius * 0.6, radius * 0.8, -radius * 0.7, -radius * 0.3);
    ctx.fill();
    ctx.stroke();

    // Right Long Waves (framing face to the right)
    ctx.beginPath();
    ctx.moveTo(radius * 0.7, -radius * 0.3);
    ctx.quadraticCurveTo(radius * 1.1, radius * 0.6, radius * 1.2 + windSway, radius * 1.6);
    ctx.quadraticCurveTo(radius * 1.4 + windSway * 1.2, radius * 0.5, radius * 0.95, -radius * 0.3);
    ctx.fill();
    ctx.stroke();
  } else if (hairId === 'hair_cap') { // Reitkappe / Cap
    // Cap Helmet Dome
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(0, -radius * 0.25, radius * 1.1, Math.PI * 0.9, Math.PI * 2.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cap Visor
    ctx.fillStyle = getShadowColor(hairColor, 0.25);
    ctx.beginPath();
    ctx.ellipse(0, -radius * 0.3, radius * 1.1, radius * 0.3, 0, Math.PI * 0.1, Math.PI * 0.9);
    ctx.fill();
    ctx.stroke();
  } else if (hairId === 'hair_curly') { // Afro / Curly
    for (let angle = Math.PI * 0.95; angle <= Math.PI * 2.05; angle += 0.3) {
      const cx = Math.cos(angle) * (radius * 0.95);
      const cy = Math.sin(angle) * (radius * 0.95) - radius * 0.25;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Cartoon Hair Shine Highlight Arc
  ctx.strokeStyle = highlightHair;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -radius * 0.15, radius * 0.85, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();
}

function drawTorso(ctx, x, y, width, height, topConfig, skinColor) {
  ctx.save();
  ctx.translate(x + width / 2, y);

  ctx.fillStyle = topConfig.color || '#8b4513';
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2;

  const style = topConfig.style || 'riding_vest';
  let extraW = 0;

  if (style === 'jacket' || style === 'sweater') extraW = width * 0.15;

  const w = width + extraW;

  // Under-shirt if riding vest
  if (style === 'riding_vest') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w * 0.35, 0, w * 0.7, height * 0.8);
  }

  ctx.fillStyle = topConfig.color || '#8b4513';

  // Draw Top Base
  ctx.beginPath();
  ctx.roundRect(-w / 2, 0, w, height, [4, 4, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // Cell-Shading Side Shadow
  ctx.fillStyle = getShadowColor(topConfig.color || '#8b4513', 0.18);
  ctx.fillRect(w * 0.1, 0, w * 0.4, height);

  // Style Details
  if (style === 'riding_vest') {
    // Vest open center zipper
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-w * 0.2, height * 0.6);
    ctx.lineTo(w * 0.2, height * 0.6);
    ctx.closePath();
    ctx.fill();

    // Buttons
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-w * 0.25, height * 0.4, 2.5, 0, Math.PI * 2);
    ctx.arc(w * 0.25, height * 0.4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'hoodie') {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.roundRect(-w * 0.35, height * 0.55, w * 0.7, height * 0.35, [2]);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 2);
    ctx.lineTo(-4, 18);
    ctx.moveTo(4, 2);
    ctx.lineTo(4, 18);
    ctx.stroke();
  } else if (style === 'tshirt') {
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.25, 0, Math.PI);
    ctx.stroke();
  }

  // Draw Stickers / Decals
  if (topConfig.stickers && topConfig.stickers.length > 0) {
    topConfig.stickers.forEach(s => {
      ctx.save();
      const stickerX = (s.x || 0) * (w / 2);
      const stickerY = (s.y || 0.5) * height;
      const stickerScale = s.scale || 1.0;

      ctx.translate(stickerX, stickerY);
      ctx.scale(stickerScale, stickerScale);

      drawStickerGraphic(ctx, s.type);
      ctx.restore();
    });
  }

  ctx.restore();
}

function drawStickerGraphic(ctx, type) {
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  switch (type) {
    case 'star':
      ctx.fillText('⭐', 0, 0);
      break;
    case 'horse':
      ctx.fillText('🐴', 0, 0);
      break;
    case 'horseshoe':
      ctx.fillText('🧲', 0, 0);
      break;
    case 'flame':
      ctx.fillText('🔥', 0, 0);
      break;
    case 'crown':
      ctx.fillText('👑', 0, 0);
      break;
    case 'heart':
      ctx.fillText('❤️', 0, 0);
      break;
    case 'lightning':
      ctx.fillText('⚡', 0, 0);
      break;
    default:
      ctx.fillText('⭐', 0, 0);
      break;
  }
}

function drawLeg(ctx, x, y, width, height, angle, pantsConfig, shoesConfig, skinColor) {
  ctx.save();
  ctx.translate(x + width / 2, y);
  ctx.rotate(angle);

  // Upper/Lower Pants
  ctx.fillStyle = pantsConfig.color || '#3d2b1f';
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2;

  let legH = height;
  if (pantsConfig.style === 'shorts') legH = height * 0.5;

  ctx.fillRect(-width / 2, 0, width, legH);
  ctx.strokeRect(-width / 2, 0, width, legH);

  // Knee pads for Riding Breeches
  if (pantsConfig.style === 'riding_breeches') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, height * 0.5, width * 0.45, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Skin showing if shorts
  if (pantsConfig.style === 'shorts') {
    ctx.fillStyle = skinColor;
    ctx.fillRect(-width / 2 + 1, legH, width - 2, height - legH);
  }

  // Shoes
  ctx.save();
  ctx.translate(0, height);
  drawShoe(ctx, width, shoesConfig);
  ctx.restore();

  ctx.restore();
}

function drawShoe(ctx, legWidth, shoesConfig) {
  if (shoesConfig.style === 'sandals') {
    ctx.fillStyle = shoesConfig.color || '#8b4513';
    ctx.fillRect(-legWidth / 2, 6, legWidth * 1.3, 4);
    return;
  }

  ctx.fillStyle = shoesConfig.color || '#1a0f08';
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 2;

  const shoeWidth = legWidth * 1.4;
  const shoeHeight = (shoesConfig.style === 'riding_boots' || shoesConfig.style === 'boots') ? 18 : 10;
  const shoeYOffset = (shoesConfig.style === 'riding_boots' || shoesConfig.style === 'boots') ? -10 : -2;

  ctx.beginPath();
  ctx.roundRect(-legWidth / 2, shoeYOffset, shoeWidth, shoeHeight, [2, 6, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Buckle / Silver accent for riding boots
  if (shoesConfig.style === 'riding_boots') {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-legWidth / 2 + 2, shoeYOffset + 3, 4, 3);
  }

  // Sole detail
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-legWidth / 2, shoeYOffset + shoeHeight - 3, shoeWidth, 3);
}
