/**
 * Modern 2D Vector Cartoon Character Renderer
 * Features cartoon lineart, squash & stretch animation, layered shading, detailed faces, hair, clothing, and stickers.
 */

export function renderCharacter(ctx, x, y, playerConfig, animationState = { frame: 0, pose: 'idle' }) {
  ctx.save();
  ctx.translate(x, y);

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const scaleX = playerConfig.body.width || 1.0;
  const scaleY = playerConfig.body.height || 1.0;

  // Base dimensions
  const headRadius = 24 * Math.min(scaleX, scaleY);
  const legWidth = 14 * scaleX;
  const legHeight = 52 * scaleY;
  const legY = -56 * scaleY; // Leg attachment base

  const torsoWidth = 38 * scaleX;
  const torsoHeight = 52 * scaleY;
  const torsoY = legY - torsoHeight;

  const headY = torsoY - 6 * scaleY - headRadius;

  const armWidth = 12 * scaleX;
  const armHeight = 46 * scaleY;

  // Animation angles & squash-and-stretch parameters
  let leg1Angle = 0;
  let leg2Angle = 0;
  let arm1Angle = 0;
  let arm2Angle = 0;
  let torsoBounce = 0;
  let squashX = 1;
  let squashY = 1;

  if (animationState.pose === 'run') {
    const runCycle = Math.sin(animationState.frame * 0.28);
    leg1Angle = runCycle * 0.7;
    leg2Angle = -runCycle * 0.7;
    arm1Angle = -runCycle * 0.8;
    arm2Angle = runCycle * 0.8;
    torsoBounce = Math.abs(Math.sin(animationState.frame * 0.28)) * 4 * scaleY;
    squashX = 1 + Math.sin(animationState.frame * 0.28) * 0.04;
    squashY = 1 - Math.sin(animationState.frame * 0.28) * 0.04;
  } else if (animationState.pose === 'jump') {
    leg1Angle = -0.4;
    leg2Angle = 0.3;
    arm1Angle = -1.3;
    arm2Angle = -0.7;
    squashX = 0.88;
    squashY = 1.15;
  } else if (animationState.pose === 'duck') {
    squashX = 1.3;
    squashY = 0.55;
    leg1Angle = -0.8;
    leg2Angle = -0.8;
  } else {
    // Idle gentle float/breath
    torsoBounce = Math.sin(animationState.frame * 0.08) * 2;
  }

  ctx.scale(squashX, squashY);

  // Cartoon Shadow on ground
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 2, 34 * scaleX * (squashX * 0.9), 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fill();
  ctx.restore();

  // Shift character according to bounce
  ctx.translate(0, -torsoBounce);

  // Back Hair (if long hair)
  if (playerConfig.body.hairId === 'hair_3') {
    ctx.save();
    ctx.translate(0, headY);
    ctx.fillStyle = playerConfig.body.hairColor || '#4a2e00';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-headRadius * 1.15, -headRadius * 0.2, headRadius * 0.4, headRadius * 1.6, [10]);
    ctx.roundRect(headRadius * 0.75, -headRadius * 0.2, headRadius * 0.4, headRadius * 1.6, [10]);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

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

  // Head & Skin & Face & Front Hair
  drawHead(ctx, 0, headY, headRadius, playerConfig.body);

  ctx.restore();
}

function drawArm(ctx, x, y, width, height, angle, topConfig) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0f172a';

  let sleeveH = height * 0.65;
  if (topConfig.style === 'tshirt') sleeveH = height * 0.35;

  // Sleeve fill & cell shading
  ctx.fillStyle = topConfig.color || '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(-width / 2, 0, width, sleeveH, [4, 4, 2, 2]);
  ctx.fill();

  // Dark shade overlay on sleeve
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(-width / 2, sleeveH * 0.7, width, sleeveH * 0.3);

  ctx.stroke();

  // Exposed skin arm
  if (sleeveH < height) {
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.roundRect(-width / 2 + 1, sleeveH, width - 2, height - sleeveH, [0, 0, 6, 6]);
    ctx.fill();
    ctx.stroke();

    // Hand / Glove
    ctx.beginPath();
    ctx.arc(0, height, width * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeaad';
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawHead(ctx, x, y, radius, bodyConfig) {
  ctx.save();
  ctx.translate(x, y);

  // Head Base / Skin
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffdbac';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Subtle Skin Highlight / Cheek Rosy Glow
  ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
  ctx.beginPath();
  ctx.arc(-radius * 0.45, radius * 0.22, radius * 0.22, 0, Math.PI * 2);
  ctx.arc(radius * 0.45, radius * 0.22, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Expressive Cartoon Face
  drawCartoonFace(ctx, radius, bodyConfig.faceId);

  // Front Hair / Bangs
  if (bodyConfig.hairId !== 'hair_none') {
    ctx.fillStyle = bodyConfig.hairColor || '#4a2e00';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;

    if (bodyConfig.hairId === 'hair_1') { // Short Crop
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.05, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (bodyConfig.hairId === 'hair_2') { // Spiky Anime / Mohawk
      ctx.beginPath();
      ctx.moveTo(-radius * 0.9, -radius * 0.3);
      ctx.lineTo(-radius * 0.6, -radius * 1.35);
      ctx.lineTo(-radius * 0.2, -radius * 0.85);
      ctx.lineTo(0, -radius * 1.5);
      ctx.lineTo(radius * 0.3, -radius * 0.85);
      ctx.lineTo(radius * 0.7, -radius * 1.3);
      ctx.lineTo(radius * 0.9, -radius * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (bodyConfig.hairId === 'hair_3') { // Flowing Long Hair (Bangs on top)
      ctx.beginPath();
      ctx.arc(0, -radius * 0.25, radius * 1.05, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawCartoonFace(ctx, radius, faceId) {
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;

  switch (faceId) {
    case 'face_2': // Cool Sunglasses
      // Frame
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-radius * 0.75, -radius * 0.22, radius * 0.68, radius * 0.42, [4]);
      ctx.roundRect(radius * 0.07, -radius * 0.22, radius * 0.68, radius * 0.42, [4]);
      ctx.fill();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(-radius * 0.1, -radius * 0.08);
      ctx.lineTo(radius * 0.1, -radius * 0.08);
      ctx.stroke();

      // Confident Smile
      ctx.beginPath();
      ctx.arc(0, radius * 0.28, radius * 0.3, 0.1, Math.PI - 0.1);
      ctx.stroke();
      break;

    case 'face_3': // Focused / Fierce
      // Angled Brows
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-radius * 0.55, -radius * 0.32);
      ctx.lineTo(-radius * 0.15, -radius * 0.15);
      ctx.moveTo(radius * 0.55, -radius * 0.32);
      ctx.lineTo(radius * 0.15, -radius * 0.15);
      ctx.stroke();

      // Focused Eyes with Pupils
      drawCartoonEye(ctx, -radius * 0.3, 0, radius * 0.18);
      drawCartoonEye(ctx, radius * 0.3, 0, radius * 0.18);

      // Determined Mouth
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-radius * 0.25, radius * 0.38);
      ctx.lineTo(radius * 0.25, radius * 0.38);
      ctx.stroke();
      break;

    case 'face_1':
    default: // Big Happy Eyes & Grin
      // High brows
      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.18, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(radius * 0.3, -radius * 0.3, radius * 0.18, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Big Eyes
      drawCartoonEye(ctx, -radius * 0.3, -radius * 0.02, radius * 0.22);
      drawCartoonEye(ctx, radius * 0.3, -radius * 0.02, radius * 0.22);

      // Wide Open Happy Mouth
      ctx.beginPath();
      ctx.arc(0, radius * 0.22, radius * 0.35, 0, Math.PI);
      ctx.closePath();
      ctx.fillStyle = '#e11d48';
      ctx.fill();
      ctx.stroke();

      // Tongue inside mouth
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, radius * 0.22, radius * 0.35, 0, Math.PI);
      ctx.clip();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(0, radius * 0.48, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
  }
}

function drawCartoonEye(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);

  // Eye White
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Pupil
  ctx.beginPath();
  ctx.arc(r * 0.15, r * 0.1, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // White Pupil Reflection Catchlight
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.2, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

function drawTorso(ctx, x, y, width, height, topConfig) {
  ctx.save();
  ctx.translate(x + width / 2, y);

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#0f172a';

  const style = topConfig.style || 'hoodie';
  let extraW = 0;
  if (style === 'oversize') extraW = width * 0.18;

  const w = width + extraW;

  // Base Top Fill
  ctx.fillStyle = topConfig.color || '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(-w / 2, 0, w, height, [8, 8, 12, 12]);
  ctx.fill();

  // Cell Shading Side Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.beginPath();
  ctx.roundRect(w * 0.1, 0, w * 0.4, height, [0, 8, 12, 0]);
  ctx.fill();

  ctx.stroke();

  // Style Details
  if (style === 'hoodie') {
    // Hoodie Pocket
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(-w * 0.38, height * 0.52, w * 0.76, height * 0.38, [6]);
    ctx.fill();
    ctx.stroke();

    // White Hoodie Strings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-6, 22);
    ctx.moveTo(6, 4);
    ctx.lineTo(6, 22);
    ctx.stroke();
  } else if (style === 'tshirt') {
    // Curved Neckline
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.28, 0, Math.PI);
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
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Sticker background glow/outline
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  switch (type) {
    case 'star':
      ctx.fillText('⭐', 0, 1);
      break;
    case 'flame':
      ctx.fillText('🔥', 0, 1);
      break;
    case 'heart':
      ctx.fillText('❤️', 0, 1);
      break;
    case 'lightning':
      ctx.fillText('⚡', 0, 1);
      break;
    default:
      ctx.fillText('⭐', 0, 1);
      break;
  }
}

function drawLeg(ctx, x, y, width, height, angle, pantsConfig, shoesConfig) {
  ctx.save();
  ctx.translate(x + width / 2, y);
  ctx.rotate(angle);

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#0f172a';

  let legH = height;
  if (pantsConfig.style === 'shorts') legH = height * 0.5;

  // Pants Fill
  ctx.fillStyle = pantsConfig.color || '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-width / 2, 0, width, legH, [4, 4, 4, 4]);
  ctx.fill();

  // Cell shade
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, width / 2, legH);

  ctx.stroke();

  // Exposed Skin for Shorts
  if (pantsConfig.style === 'shorts') {
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.roundRect(-width / 2 + 1, legH, width - 2, height - legH, [0, 0, 4, 4]);
    ctx.fill();
    ctx.stroke();
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
    ctx.ellipse(3, 2, legWidth * 0.65, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
    return;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0f172a';

  const shoeWidth = legWidth * 1.5;
  const shoeHeight = shoesConfig.style === 'boots' ? 16 : 12;

  // Shoe Upper
  ctx.fillStyle = shoesConfig.color || '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-legWidth / 2, -3, shoeWidth, shoeHeight, [4, 8, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Chunky Cartoon Sole
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-legWidth / 2 - 1, shoeHeight - 5, shoeWidth + 2, 5, [0, 0, 3, 3]);
  ctx.fill();
}
