/**
 * Utility to render a modular 2D vector-style character with cinematic golden lighting,
 * dynamic wind sway on hair/mane, smooth running animation, clothes, and stickers.
 */

export function renderCharacter(ctx, x, y, playerConfig, animationState = { frame: 0, pose: 'idle' }) {
  ctx.save();
  ctx.translate(x, y);

  const scaleX = playerConfig.body.width || 1.0;
  const scaleY = playerConfig.body.height || 1.0;

  // Base proportions (standing tall around 160px height)
  const headRadius = 22 * Math.min(scaleX, scaleY);
  const headY = -120 * scaleY;
  const torsoWidth = 36 * scaleX;
  const torsoHeight = 50 * scaleY;
  const torsoY = headY + headRadius + 5;

  const legWidth = 14 * scaleX;
  const legHeight = 50 * scaleY;
  const legY = torsoY + torsoHeight;

  const armWidth = 12 * scaleX;
  const armHeight = 45 * scaleY;

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
  ctx.ellipse(0, jumpHeightOffset, (32 * scaleX) * (1 - jumpHeightOffset * 0.015), 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fill();
  ctx.restore();

  // Back Arm
  drawArm(ctx, -torsoWidth / 2 - 2, torsoY + 8, armWidth, armHeight, arm2Angle, playerConfig.clothes.top);

  // Back Leg & Shoe
  drawLeg(ctx, -torsoWidth / 4 - legWidth / 2, legY, legWidth, legHeight, leg1Angle, playerConfig.clothes.pants, playerConfig.clothes.shoes);

  // Front Leg & Shoe
  drawLeg(ctx, torsoWidth / 4 - legWidth / 2, legY, legWidth, legHeight, leg2Angle, playerConfig.clothes.pants, playerConfig.clothes.shoes);

  // Torso / Top Clothing
  drawTorso(ctx, -torsoWidth / 2, torsoY, torsoWidth, torsoHeight, playerConfig.clothes.top);

  // Front Arm
  drawArm(ctx, torsoWidth / 2 + 2, torsoY + 8, armWidth, armHeight, arm1Angle, playerConfig.clothes.top);

  // Head & Skin & Flowing Hair
  drawHead(ctx, 0, headY, headRadius, playerConfig.body, windSway);

  ctx.restore();
}

function drawArm(ctx, x, y, width, height, angle, topConfig) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = topConfig.color || '#0055ff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  let sleeveH = height * 0.7;
  if (topConfig.style === 'tshirt') sleeveH = height * 0.35;

  ctx.beginPath();
  ctx.roundRect(-width / 2, 0, width, sleeveH, [2]);
  ctx.fill();
  ctx.stroke();

  // Exposed skin arm
  if (sleeveH < height) {
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(-width / 2 + 1, sleeveH, width - 2, height - sleeveH);
    // Hand
    ctx.beginPath();
    ctx.arc(0, height, width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Golden Sun Highlight
  ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.fillRect(-width / 2, 0, 3, sleeveH);

  ctx.restore();
}

function drawHead(ctx, x, y, radius, bodyConfig, windSway = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Head Base / Skin
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffdbac';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d4a373';
  ctx.stroke();

  // Golden Sun Highlight on forehead
  ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.fill();

  // Face Expression
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;

  switch (bodyConfig.faceId) {
    case 'face_2': // Cool (Sunglasses)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-radius * 0.6, -radius * 0.2, radius * 1.2, radius * 0.35);
      ctx.beginPath();
      ctx.moveTo(-radius * 0.6, -radius * 0.05);
      ctx.lineTo(radius * 0.6, -radius * 0.05);
      ctx.stroke();
      // Cool Smile
      ctx.beginPath();
      ctx.arc(0, radius * 0.3, radius * 0.25, 0, Math.PI);
      ctx.stroke();
      break;
    case 'face_3': // Focused
      // Eyes (Angled eyebrows)
      ctx.beginPath();
      ctx.moveTo(-radius * 0.4, -radius * 0.2);
      ctx.lineTo(-radius * 0.1, -radius * 0.1);
      ctx.moveTo(radius * 0.4, -radius * 0.2);
      ctx.lineTo(radius * 0.1, -radius * 0.1);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-radius * 0.25, -radius * 0.05, 2.5, 0, Math.PI * 2);
      ctx.arc(radius * 0.25, -radius * 0.05, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Focused Mouth
      ctx.beginPath();
      ctx.moveTo(-radius * 0.2, radius * 0.3);
      ctx.lineTo(radius * 0.2, radius * 0.3);
      ctx.stroke();
      break;
    case 'face_1':
    default: // Happy
      // Eyes
      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.1, 3, 0, Math.PI * 2);
      ctx.arc(radius * 0.3, -radius * 0.1, 3, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.beginPath();
      ctx.arc(0, radius * 0.1, radius * 0.4, 0.1, Math.PI - 0.1);
      ctx.stroke();
      break;
  }

  // Hair / Flowing Mane in Wind
  if (bodyConfig.hairId !== 'hair_none') {
    ctx.fillStyle = bodyConfig.hairColor || '#4a2e00';
    ctx.strokeStyle = bodyConfig.hairColor || '#4a2e00';

    if (bodyConfig.hairId === 'hair_1') { // Short
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.05, Math.PI, 0);
      ctx.fill();
    } else if (bodyConfig.hairId === 'hair_2') { // Spiky / Wild Mohawk
      ctx.beginPath();
      ctx.moveTo(-radius * 0.8 + windSway, -radius * 0.5);
      ctx.lineTo(-radius * 0.3 + windSway * 1.5, -radius * 1.4);
      ctx.lineTo(0 + windSway, -radius * 0.8);
      ctx.lineTo(radius * 0.3 + windSway * 1.2, -radius * 1.4);
      ctx.lineTo(radius * 0.8, -radius * 0.5);
      ctx.closePath();
      ctx.fill();
    } else if (bodyConfig.hairId === 'hair_3') { // Flowing Long Mane
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.1, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fillRect(-radius * 1.05 - windSway * 0.5, -radius * 0.2, radius * 0.4, radius * 1.3);
      ctx.fillRect(radius * 0.65 - windSway, -radius * 0.2, radius * 0.5 + windSway * 0.8, radius * 1.4);
      ctx.fill();

      // Flowing strand tip in wind
      ctx.beginPath();
      ctx.moveTo(radius * 0.65, radius * 0.8);
      ctx.quadraticCurveTo(radius * 1.2 - windSway * 1.5, radius * 1.1, radius * 1.5 - windSway * 2, radius * 0.5);
      ctx.lineTo(radius * 0.8, radius * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawTorso(ctx, x, y, width, height, topConfig) {
  ctx.save();
  ctx.translate(x + width / 2, y);

  ctx.fillStyle = topConfig.color || '#0055ff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  const style = topConfig.style || 'hoodie';
  let extraW = 0;

  if (style === 'oversize') extraW = width * 0.15;

  const w = width + extraW;

  // Draw Top Base
  ctx.beginPath();
  ctx.roundRect(-w / 2, 0, w, height, [4, 4, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // Golden Sun Sheen on Torso
  ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
  ctx.fillRect(-w / 2 + 2, 2, w * 0.3, height - 4);

  // Style Details
  if (style === 'hoodie') {
    // Hoodie Pocket & Strings
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.roundRect(-w * 0.35, height * 0.55, w * 0.7, height * 0.35, [2]);
    ctx.fill();
    ctx.stroke();

    // Hoodie Strings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 2);
    ctx.lineTo(-4, 18);
    ctx.moveTo(4, 2);
    ctx.lineTo(4, 18);
    ctx.stroke();
  } else if (style === 'tshirt') {
    // Collar line
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
    case 'flame':
      ctx.fillText('🔥', 0, 0);
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

function drawLeg(ctx, x, y, width, height, angle, pantsConfig, shoesConfig) {
  ctx.save();
  ctx.translate(x + width / 2, y);
  ctx.rotate(angle);

  // Upper/Lower Pants
  ctx.fillStyle = pantsConfig.color || '#222222';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  let legH = height;
  if (pantsConfig.style === 'shorts') legH = height * 0.5;

  ctx.fillRect(-width / 2, 0, width, legH);
  ctx.strokeRect(-width / 2, 0, width, legH);

  // Skin showing if shorts
  if (pantsConfig.style === 'shorts') {
    ctx.fillStyle = '#ffdbac';
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
  if (shoesConfig.style === 'barefoot') {
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.ellipse(2, 2, legWidth * 0.6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = shoesConfig.color || '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  const shoeWidth = legWidth * 1.4;
  const shoeHeight = shoesConfig.style === 'boots' ? 14 : 10;

  ctx.beginPath();
  ctx.roundRect(-legWidth / 2, -2, shoeWidth, shoeHeight, [2, 6, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Sole detail
  ctx.fillStyle = '#333333';
  ctx.fillRect(-legWidth / 2, shoeHeight - 4, shoeWidth, 2);
}
