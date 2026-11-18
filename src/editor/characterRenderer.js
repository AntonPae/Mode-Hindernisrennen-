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

  // Back Hair / Cape layer behind body
  if (playerConfig.clothes.top.style === 'cape') {
    ctx.save();
    const flutter = Math.sin(animationState.frame * 0.25) * 6;
    ctx.fillStyle = '#e11d48';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-torsoWidth * 0.45, torsoY + 4);
    ctx.lineTo(-torsoWidth * 1.15 - flutter, torsoY + torsoHeight + 28);
    ctx.lineTo(torsoWidth * 0.2, torsoY + torsoHeight + 22);
    ctx.lineTo(torsoWidth * 0.4, torsoY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

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
  } else if (playerConfig.body.hairId === 'hair_afro') {
    ctx.save();
    ctx.translate(0, headY);
    ctx.fillStyle = playerConfig.body.hairColor || '#4a2e00';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -headRadius * 0.25, headRadius * 1.45, 0, Math.PI * 2);
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
    } else if (bodyConfig.hairId === 'hair_afro') { // Afro front curls
      ctx.beginPath();
      ctx.arc(-radius * 0.55, -radius * 0.85, radius * 0.45, Math.PI, 2 * Math.PI);
      ctx.arc(0, -radius * 0.95, radius * 0.5, Math.PI, 2 * Math.PI);
      ctx.arc(radius * 0.55, -radius * 0.85, radius * 0.45, Math.PI, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (bodyConfig.hairId === 'hair_crown') { // Golden Royal Crown
      // Hair base underneath
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.02, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Crown
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-radius * 0.75, -radius * 0.7);
      ctx.lineTo(-radius * 0.85, -radius * 1.45);
      ctx.lineTo(-radius * 0.35, -radius * 1.05);
      ctx.lineTo(0, -radius * 1.6);
      ctx.lineTo(radius * 0.35, -radius * 1.05);
      ctx.lineTo(radius * 0.85, -radius * 1.45);
      ctx.lineTo(radius * 0.75, -radius * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gem in center
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.98, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (bodyConfig.hairId === 'hair_cat') { // Cute Cat Ears 🐱
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.03, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Left & Right Cat Ears
      [-1, 1].forEach((dir) => {
        ctx.fillStyle = bodyConfig.hairColor || '#4a2e00';
        ctx.beginPath();
        ctx.moveTo(dir * radius * 0.35, -radius * 0.85);
        ctx.lineTo(dir * radius * 0.85, -radius * 1.55);
        ctx.lineTo(dir * radius * 0.92, -radius * 0.65);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fda4af';
        ctx.beginPath();
        ctx.moveTo(dir * radius * 0.5, -radius * 0.88);
        ctx.lineTo(dir * radius * 0.78, -radius * 1.32);
        ctx.lineTo(dir * radius * 0.82, -radius * 0.75);
        ctx.closePath();
        ctx.fill();
      });
    } else if (bodyConfig.hairId === 'hair_wizard') { // Wizard Hat 🧙
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.72, radius * 1.35, radius * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-radius * 0.85, -radius * 0.75);
      ctx.lineTo(radius * 0.1, -radius * 2.15);
      ctx.lineTo(radius * 0.85, -radius * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐', 0, -radius * 1.2);
    } else if (bodyConfig.hairId === 'hair_halo') { // Golden Halo 😇
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 1.03, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, -radius * 1.45, radius * 0.82, radius * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
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

    case 'face_4': // Starry Eyes 🤩
      drawStarEye(ctx, -radius * 0.32, -radius * 0.05, radius * 0.26);
      drawStarEye(ctx, radius * 0.32, -radius * 0.05, radius * 0.26);

      ctx.beginPath();
      ctx.arc(0, radius * 0.22, radius * 0.35, 0, Math.PI);
      ctx.closePath();
      ctx.fillStyle = '#e11d48';
      ctx.fill();
      ctx.stroke();
      break;

    case 'face_5': // Ninja Mask 🥷
      // Lower face mask
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, radius - 1, 0.12, Math.PI - 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Headband
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-radius * 0.96, -radius * 0.42, radius * 1.92, radius * 0.24);
      ctx.strokeRect(-radius * 0.96, -radius * 0.42, radius * 1.92, radius * 0.24);

      // Sharp glowing eyes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(-radius * 0.32, -radius * 0.05, radius * 0.2, radius * 0.1, -0.2, 0, Math.PI * 2);
      ctx.ellipse(radius * 0.32, -radius * 0.05, radius * 0.2, radius * 0.1, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'face_6': // Heart Eyes 😍
      drawHeartEye(ctx, -radius * 0.32, -radius * 0.06, radius * 0.22);
      drawHeartEye(ctx, radius * 0.32, -radius * 0.06, radius * 0.22);

      ctx.beginPath();
      ctx.arc(0, radius * 0.22, radius * 0.34, 0, Math.PI);
      ctx.closePath();
      ctx.fillStyle = '#e11d48';
      ctx.fill();
      ctx.stroke();
      break;

    case 'face_7': // Cyber Robot Visor 🤖
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-radius * 0.78, -radius * 0.28, radius * 1.56, radius * 0.45, [8]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(-radius * 0.62, -radius * 0.14, radius * 1.24, radius * 0.16);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-radius * 0.35, radius * 0.34, radius * 0.7, 5);
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

function drawStarEye(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawHeartEye(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#f43f5e';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.8);
  ctx.bezierCurveTo(-r * 1.3, 0, -r * 0.8, -r * 1.1, 0, -r * 0.35);
  ctx.bezierCurveTo(r * 0.8, -r * 1.1, r * 1.3, 0, 0, r * 0.8);
  ctx.fill();
  ctx.stroke();
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
  } else if (style === 'jacket') {
    // Racing stripe & zipper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w * 0.42, height * 0.22, w * 0.84, 7);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-w * 0.42, height * 0.36, w * 0.84, 5);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(0, height - 2);
    ctx.stroke();
  } else if (style === 'cape') {
    // Superhero Golden Emblem
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.18);
    ctx.lineTo(w * 0.24, height * 0.36);
    ctx.lineTo(0, height * 0.62);
    ctx.lineTo(-w * 0.24, height * 0.36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'pirate') {
    // Striped Pirate Vest & Gold Buckle Belt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-w * 0.48, height * 0.7, w * 0.96, 9);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-7, height * 0.68, 14, 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w * 0.2, 4, 4, height * 0.62);
    ctx.fillRect(w * 0.14, 4, 4, height * 0.62);
  } else if (style === 'astronaut') {
    // Space Suit Chest Control Box
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-w * 0.32, height * 0.2, w * 0.64, height * 0.36, [4]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-w * 0.2, height * 0.28, w * 0.18, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(w * 0.06, height * 0.28, 6, 6);
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
    case 'crown':
      ctx.fillText('👑', 0, 1);
      break;
    case 'rainbow':
      ctx.fillText('🌈', 0, 1);
      break;
    case 'diamond':
      ctx.fillText('💎', 0, 1);
      break;
    case 'rocket':
      ctx.fillText('🚀', 0, 1);
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

  // Sweatpants stripe or Cargo pocket
  if (pantsConfig.style === 'sweatpants') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-width * 0.18, 4, 3, legH - 8);
  } else if (pantsConfig.style === 'cargo') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-width * 0.45, legH * 0.32, width * 0.9, legH * 0.28, [3]);
    ctx.fill();
    ctx.stroke();
  } else if (pantsConfig.style === 'robot_legs') {
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(0, legH * 0.48, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-width * 0.4, legH * 0.15, width * 0.8, 4);
  }

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

  if (shoesConfig.style === 'wings') {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-legWidth * 0.4, 0);
    ctx.lineTo(-legWidth * 1.15, -10);
    ctx.lineTo(-legWidth * 0.85, 2);
    ctx.lineTo(-legWidth * 1.05, 6);
    ctx.lineTo(-legWidth * 0.4, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (shoesConfig.style === 'rocket') {
    // Rocket flame glow under boot
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-legWidth * 0.2, shoeHeight);
    ctx.lineTo(legWidth * 0.25, shoeHeight + 11);
    ctx.lineTo(legWidth * 0.65, shoeHeight);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(legWidth * 0.22, shoeHeight + 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (shoesConfig.style === 'skates') {
    // Silver Ice Skate Blade
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-legWidth * 0.45, shoeHeight + 3);
    ctx.lineTo(shoeWidth * 0.85, shoeHeight + 3);
    ctx.arc(shoeWidth * 0.85, shoeHeight - 1, 4, Math.PI * 0.5, -Math.PI * 0.5, true);
    ctx.stroke();
  }
}
