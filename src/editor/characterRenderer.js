/**
 * Modern 3D-Illustrated Animated Feature Character Renderer
 * Articulated 2-segment anatomy, 3/4 fashion-doll proportions, subsurface skin shading,
 * anisotropic hair highlights, rim lighting, and house-activity poses.
 */

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return { r: 236, g: 72, b: 153 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return { r: 236, g: 72, b: 153 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function shadeHex(hex, amount, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const nr = clamp(r + amount);
  const ng = clamp(g + amount);
  const nb = clamp(b + amount);
  if (alpha < 1) return `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
  return `rgb(${nr}, ${ng}, ${nb})`;
}

function mixHex(hex1, hex2, t) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function makeStudioGrad(ctx, x1, y1, x2, y2, baseHex, hi = 54, lo = -46) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, shadeHex(baseHex, hi));
  grad.addColorStop(0.45, baseHex);
  grad.addColorStop(1, shadeHex(baseHex, lo));
  return grad;
}

export function renderCharacter(ctx, x, y, playerConfig, animationState = { frame: 0, pose: 'idle', facing: 1 }) {
  ctx.save();
  ctx.translate(x, y);
  const facing = animationState.facing === -1 ? -1 : 1;
  ctx.scale(facing, 1);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const scaleX = playerConfig.body.width || 1.0;
  const scaleY = playerConfig.body.height || 1.0;
  const f = animationState.frame || 0;
  const pose = animationState.pose || 'idle';

  // Proportions (~5.3-head stylized animated feature heroine/hero, ~136px tall at 1.0x)
  const headW = 16.5 * Math.min(scaleX * 1.04, scaleY * 1.02);
  const headH = 20.5 * Math.min(scaleX * 1.02, scaleY * 1.04);

  const hipY = -58 * scaleY;
  const thighLen = 27 * scaleY;
  const calfLen = 26 * scaleY;
  const legThick = 11.2 * scaleX;

  const torsoH = 40 * scaleY;
  const shoulderY = hipY - torsoH;
  const shoulderHalfW = 14.5 * scaleX;
  const waistHalfW = 10.2 * scaleX;
  const hipHalfW = 13.0 * scaleX;

  const upperArmLen = 20 * scaleY;
  const forearmLen = 19 * scaleY;
  const armThick = 7.4 * scaleX;

  const neckH = 7.5 * scaleY;
  const headY = shoulderY - neckH - headH * 0.88;

  // Articulated Pose Kinematics
  let backThigh = 0.06;
  let backKnee = 0.04;
  let frontThigh = -0.06;
  let frontKnee = 0.05;

  let backUpperArm = 0.18;
  let backElbow = -0.25;
  let frontUpperArm = -0.14;
  let frontElbow = -0.22;

  let torsoBounce = 0;
  let leanAngle = 0.02;
  let headTilt = 0;
  let squashX = 1;
  let squashY = 1;
  let propType = null; // 'spoon' | 'broom' | 'can'

  if (pose === 'run') {
    const cyc = f * 0.27;
    const s = Math.sin(cyc);
    const c = Math.cos(cyc);
    frontThigh = s * 0.68 - 0.12;
    frontKnee = Math.max(0.08, -c * 0.72 + 0.35);
    backThigh = -s * 0.68 - 0.12;
    backKnee = Math.max(0.08, c * 0.72 + 0.35);

    frontUpperArm = -s * 0.72 - 0.05;
    frontElbow = -0.78 - Math.max(0, -s * 0.35);
    backUpperArm = s * 0.72 - 0.05;
    backElbow = -0.78 - Math.max(0, s * 0.35);

    torsoBounce = Math.abs(s) * 4.5 * scaleY;
    leanAngle = 0.12;
    headTilt = -0.06;
    squashX = 1 + s * 0.025;
    squashY = 1 - s * 0.025;
  } else if (pose === 'walk') {
    const cyc = f * 0.19;
    const s = Math.sin(cyc);
    const c = Math.cos(cyc);
    frontThigh = s * 0.42;
    frontKnee = Math.max(0.04, -c * 0.34 + 0.14);
    backThigh = -s * 0.42;
    backKnee = Math.max(0.04, c * 0.34 + 0.14);

    frontUpperArm = -s * 0.36;
    frontElbow = -0.26 - Math.max(0, -s * 0.18);
    backUpperArm = s * 0.36;
    backElbow = -0.26 - Math.max(0, s * 0.18);

    torsoBounce = Math.abs(s) * 2.2 * scaleY;
    leanAngle = 0.05;
  } else if (pose === 'jump') {
    frontThigh = -0.58;
    frontKnee = 0.92;
    backThigh = 0.36;
    backKnee = 0.55;

    frontUpperArm = -1.38;
    frontElbow = -0.35;
    backUpperArm = -0.82;
    backElbow = -0.55;

    squashX = 0.93;
    squashY = 1.07;
    leanAngle = -0.04;
    headTilt = -0.05;
  } else if (pose === 'duck') {
    squashX = 1.18;
    squashY = 0.54;
    frontThigh = -0.95;
    frontKnee = 1.35;
    backThigh = -0.75;
    backKnee = 1.2;
    frontUpperArm = 0.35;
    frontElbow = -0.85;
    backUpperArm = 0.5;
    backElbow = -0.9;
    leanAngle = 0.18;
  } else if (pose === 'cook') {
    const stir = Math.sin(f * 0.22);
    const stirCos = Math.cos(f * 0.22);
    frontUpperArm = -0.75 + stir * 0.16;
    frontElbow = -0.72 + stirCos * 0.24;
    backUpperArm = -0.35;
    backElbow = -0.55;
    torsoBounce = Math.abs(stir) * 1.5;
    leanAngle = 0.08;
    headTilt = 0.06 + stir * 0.03;
    propType = 'spoon';
  } else if (pose === 'clean') {
    const sweep = Math.sin(f * 0.24);
    frontUpperArm = -0.45 + sweep * 0.32;
    frontElbow = -0.45 - sweep * 0.12;
    backUpperArm = -0.2 + sweep * 0.25;
    backElbow = -0.65;
    frontThigh = sweep * 0.24;
    backThigh = -sweep * 0.24;
    leanAngle = 0.12;
    torsoBounce = Math.abs(sweep) * 2;
    propType = 'broom';
  } else if (pose === 'water') {
    const pour = Math.sin(f * 0.14);
    frontUpperArm = -0.85 + pour * 0.1;
    frontElbow = -0.38;
    backUpperArm = 0.22;
    backElbow = -0.3;
    leanAngle = 0.09;
    headTilt = 0.08;
    propType = 'can';
  } else if (pose === 'pet') {
    const wave = Math.sin(f * 0.22);
    frontUpperArm = -0.65 + wave * 0.24;
    frontElbow = -0.6 + wave * 0.2;
    leanAngle = 0.16;
    headTilt = 0.12;
    torsoBounce = Math.abs(wave) * 1.5;
  } else if (pose === 'sit') {
    const breathe = Math.sin(f * 0.055);
    frontThigh = -1.46;
    frontKnee = 1.36;
    backThigh = -1.38;
    backKnee = 1.32;
    frontUpperArm = -0.52 + breathe * 0.03;
    frontElbow = -0.68;
    backUpperArm = -0.34 - breathe * 0.03;
    backElbow = -0.62;
    torsoBounce = -14 * scaleY + breathe * 0.8;
    leanAngle = 0.04;
    headTilt = breathe * 0.02;
  } else if (pose === 'sleep') {
    const breathe = Math.sin(f * 0.045);
    frontThigh = -0.14;
    frontKnee = 0.18;
    backThigh = 0.08;
    backKnee = 0.12;
    frontUpperArm = -0.38 + breathe * 0.03;
    frontElbow = -0.65;
    backUpperArm = 0.12;
    backElbow = -0.35;
    torsoBounce = breathe * 0.9;
    leanAngle = 0;
    headTilt = 0.06;
  } else {
    // Graceful idle breathing + gentle sway
    const breathe = Math.sin(f * 0.06);
    torsoBounce = breathe * 1.6;
    frontUpperArm = -0.1 + breathe * 0.04;
    frontElbow = -0.24 + breathe * 0.05;
    backUpperArm = 0.14 - breathe * 0.04;
    backElbow = -0.2;
    headTilt = breathe * 0.025;
  }

  ctx.scale(squashX, squashY);

  // Soft Ambient Ground Shadow (suppressed while lying on a bed/sofa)
  if (pose !== 'sleep' && !animationState.noShadow) {
    ctx.save();
    const shadowW = 26 * scaleX * (pose === 'jump' ? 0.72 : pose === 'sit' ? 0.82 : 1.0);
    const shGrad = ctx.createRadialGradient(0, 2, 2, 0, 2, shadowW);
    shGrad.addColorStop(0, 'rgba(65, 25, 85, 0.30)');
    shGrad.addColorStop(0.6, 'rgba(65, 25, 85, 0.12)');
    shGrad.addColorStop(1, 'rgba(65, 25, 85, 0)');
    ctx.fillStyle = shGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, shadowW, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (pose === 'sleep') {
    // Rotate character horizontally onto the mattress/sofa centered gently around hips/waist
    ctx.translate(22 * scaleY, -14 * scaleX);
    ctx.rotate(-Math.PI / 2);
  }

  ctx.translate(0, -torsoBounce);
  ctx.rotate(leanAngle);

  const hairBase = playerConfig.body.hairColor || '#d97706';

  // 1. Back Flowing Cape (if equipped)
  if (playerConfig.clothes.top.style === 'cape') {
    drawFlowingCape(ctx, shoulderY, hipY, shoulderHalfW, scaleY, f);
  }

  // 2. Back Hair Volume (behind shoulders & neck)
  drawSculptedHairBack(ctx, 0, headY, headW, headH, playerConfig.body.hairId, hairBase, f);

  // 3. Back Arm
  drawArticulatedArm(
    ctx,
    -shoulderHalfW * 0.72,
    shoulderY + 5 * scaleY,
    armThick,
    upperArmLen,
    forearmLen,
    backUpperArm,
    backElbow,
    playerConfig.clothes.top,
    true,
    null
  );

  // 4. Back Leg & Shoe
  drawArticulatedLeg(
    ctx,
    -hipHalfW * 0.42,
    hipY,
    legThick,
    thighLen,
    calfLen,
    backThigh,
    backKnee,
    playerConfig.clothes.pants,
    playerConfig.clothes.shoes,
    true
  );

  // 5. Front Leg & Shoe
  drawArticulatedLeg(
    ctx,
    hipHalfW * 0.36,
    hipY,
    legThick,
    thighLen,
    calfLen,
    frontThigh,
    frontKnee,
    playerConfig.clothes.pants,
    playerConfig.clothes.shoes,
    false
  );

  // 6. Sculpted Tailored Torso & Neck
  drawSculptedTorso(
    ctx,
    shoulderY,
    hipY,
    shoulderHalfW,
    waistHalfW,
    hipHalfW,
    neckH,
    playerConfig.clothes.top,
    f
  );

  // 7. Front Arm (with interactive prop if cooking/cleaning/watering)
  drawArticulatedArm(
    ctx,
    shoulderHalfW * 0.76,
    shoulderY + 5 * scaleY,
    armThick,
    upperArmLen,
    forearmLen,
    frontUpperArm,
    frontElbow,
    playerConfig.clothes.top,
    false,
    propType,
    f
  );

  // 8. Sculpted 3/4 Animated Feature Head, Face & Front Hair
  const isBlinking = pose === 'sleep' || (f % 190) > 184;
  drawSculptedHead(ctx, 2 * scaleX, headY, headW, headH, headTilt, playerConfig.body, isBlinking, f, {
    isSleeping: pose === 'sleep',
    isSick: Boolean(animationState.isSick)
  });

  ctx.restore();
}

function drawFlowingCape(ctx, shoulderY, hipY, shoulderHalfW, scaleY, frame) {
  ctx.save();
  const wave1 = Math.sin(frame * 0.22) * 8;
  const wave2 = Math.cos(frame * 0.18) * 6;
  const capeGrad = ctx.createLinearGradient(-shoulderHalfW * 3, shoulderY, shoulderHalfW, hipY + 34 * scaleY);
  capeGrad.addColorStop(0, '#fb7185');
  capeGrad.addColorStop(0.5, '#e11d48');
  capeGrad.addColorStop(1, '#9f1239');
  ctx.fillStyle = capeGrad;
  ctx.beginPath();
  ctx.moveTo(-shoulderHalfW * 0.85, shoulderY + 3);
  ctx.bezierCurveTo(
    -shoulderHalfW * 2.2 - wave1 * 0.4,
    shoulderY + 26 * scaleY,
    -shoulderHalfW * 2.8 - wave1,
    hipY + 12 * scaleY,
    -shoulderHalfW * 2.4 - wave2,
    hipY + 36 * scaleY
  );
  ctx.quadraticCurveTo(
    -shoulderHalfW * 0.9,
    hipY + 32 * scaleY + wave2 * 0.3,
    shoulderHalfW * 0.3,
    hipY + 24 * scaleY
  );
  ctx.lineTo(shoulderHalfW * 0.7, shoulderY + 3);
  ctx.closePath();
  ctx.fill();

  // Soft satin fold sheen
  ctx.fillStyle = 'rgba(255, 228, 230, 0.25)';
  ctx.beginPath();
  ctx.moveTo(-shoulderHalfW * 0.8, shoulderY + 6);
  ctx.quadraticCurveTo(-shoulderHalfW * 1.9, shoulderY + 38 * scaleY, -shoulderHalfW * 1.7 - wave1 * 0.4, hipY + 28 * scaleY);
  ctx.quadraticCurveTo(-shoulderHalfW * 1.2, hipY + 10 * scaleY, -shoulderHalfW * 0.4, shoulderY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSculptedTorso(ctx, shoulderY, hipY, shW, waW, hipW, neckH, topConfig, frame) {
  ctx.save();

  // Neck with soft chin cast shadow
  const neckGrad = ctx.createLinearGradient(-5, shoulderY - neckH, 5, shoulderY + 4);
  neckGrad.addColorStop(0, '#f3b794');
  neckGrad.addColorStop(0.55, '#ffd7bd');
  neckGrad.addColorStop(1, '#ffe6d5');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-5.2, shoulderY - neckH - 2);
  ctx.lineTo(5.6, shoulderY - neckH - 2);
  ctx.quadraticCurveTo(6.5, shoulderY + 2, 10, shoulderY + 6);
  ctx.lineTo(-9, shoulderY + 6);
  ctx.quadraticCurveTo(-5.8, shoulderY + 2, -5.2, shoulderY - neckH - 2);
  ctx.closePath();
  ctx.fill();

  // Chin ambient occlusion shadow on upper neck
  ctx.fillStyle = 'rgba(180, 95, 70, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0.5, shoulderY - neckH + 1, 5.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const style = topConfig.style || 'hoodie';
  const baseColor = topConfig.color || '#ec4899';
  const extraW = style === 'oversize' ? 3.2 : 0;
  const sW = shW + extraW;
  const wW = (style === 'oversize' ? shW * 0.96 : waW) + extraW;
  const hW = (style === 'oversize' ? hipW * 1.15 : hipW) + extraW;
  const torsoH = hipY - shoulderY;

  // Sculpted Torso Contour (shoulders -> tapered waist -> tailored hips)
  const drawBodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(-sW * 0.55, shoulderY);
    ctx.quadraticCurveTo(0, shoulderY + 5, sW * 0.58, shoulderY);
    ctx.quadraticCurveTo(sW * 1.05, shoulderY + 3, sW, shoulderY + 10);
    ctx.bezierCurveTo(sW * 0.98, shoulderY + torsoH * 0.42, wW * 1.06, shoulderY + torsoH * 0.65, hW, hipY + 3);
    ctx.quadraticCurveTo(0, hipY + 8, -hW * 0.94, hipY + 3);
    ctx.bezierCurveTo(-wW * 1.02, shoulderY + torsoH * 0.65, -sW * 0.96, shoulderY + torsoH * 0.42, -sW, shoulderY + 10);
    ctx.quadraticCurveTo(-sW * 1.04, shoulderY + 3, -sW * 0.55, shoulderY);
    ctx.closePath();
  };

  ctx.fillStyle = makeStudioGrad(ctx, -sW, shoulderY, sW, hipY, baseColor, 48, -42);
  drawBodyPath();
  ctx.fill();

  // Clip interior fabric lighting & details
  ctx.save();
  drawBodyPath();
  ctx.clip();

  // Warm key-light rim on front chest/shoulder + cool shadow along back
  const rimGrad = ctx.createLinearGradient(-sW, shoulderY, sW, shoulderY);
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
  rimGrad.addColorStop(0.22, 'rgba(255, 255, 255, 0)');
  rimGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.16)');
  rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.36)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(-sW - 4, shoulderY - 2, (sW + 4) * 2, torsoH + 14);

  // Subtle waist fabric crease
  ctx.strokeStyle = shadeHex(baseColor, -34, 0.35);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-wW * 0.6, shoulderY + torsoH * 0.64);
  ctx.quadraticCurveTo(0, shoulderY + torsoH * 0.68, wW * 0.5, shoulderY + torsoH * 0.61);
  ctx.stroke();

  if (style === 'tshirt') {
    // Exposed skin scoop neckline
    ctx.fillStyle = '#ffd7bd';
    ctx.beginPath();
    ctx.ellipse(1, shoulderY + 1.5, sW * 0.42, 7.5, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = shadeHex(baseColor, -32);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(1, shoulderY + 1.5, sW * 0.44, 8, 0, 0.08, Math.PI - 0.08);
    ctx.stroke();
  } else if (style === 'hoodie') {
    // Draped hood collar & pouch pocket & soft satin cords
    ctx.fillStyle = shadeHex(baseColor, -26);
    ctx.beginPath();
    ctx.ellipse(0, shoulderY + 3, sW * 0.58, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = shadeHex(baseColor, -22, 0.85);
    ctx.beginPath();
    ctx.roundRect(-wW * 0.62, shoulderY + torsoH * 0.56, wW * 1.24, torsoH * 0.35, [6]);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-2.5, shoulderY + 7);
    ctx.quadraticCurveTo(-3.5, shoulderY + 16, -2, shoulderY + 21);
    ctx.moveTo(4.5, shoulderY + 7);
    ctx.quadraticCurveTo(5.5, shoulderY + 16, 4, shoulderY + 21);
    ctx.stroke();
  } else if (style === 'jacket') {
    // Racing diagonal sash & silver zipper sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.moveTo(-sW, shoulderY + torsoH * 0.28);
    ctx.lineTo(sW, shoulderY + torsoH * 0.14);
    ctx.lineTo(sW, shoulderY + torsoH * 0.25);
    ctx.lineTo(-sW, shoulderY + torsoH * 0.39);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-sW, shoulderY + torsoH * 0.39);
    ctx.lineTo(sW, shoulderY + torsoH * 0.25);
    ctx.lineTo(sW, shoulderY + torsoH * 0.31);
    ctx.lineTo(-sW, shoulderY + torsoH * 0.45);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(1.5, shoulderY + 4);
    ctx.lineTo(1.5, hipY + 5);
    ctx.stroke();
  } else if (style === 'pirate') {
    // Crisp ivory shirt center + tailored waistcoat lapels + gold belt buckle
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.moveTo(-3, shoulderY + 2);
    ctx.lineTo(6, shoulderY + 2);
    ctx.lineTo(4, hipY);
    ctx.lineTo(-2, hipY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(-hW, hipY - 7, hW * 2, 7);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.roundRect(-4, hipY - 8, 9, 9, [2]);
    ctx.fill();
  } else if (style === 'cape') {
    // Golden heroic chest emblem
    const embGrad = ctx.createLinearGradient(0, shoulderY + 10, 0, shoulderY + 28);
    embGrad.addColorStop(0, '#fef9c3');
    embGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = embGrad;
    ctx.beginPath();
    ctx.moveTo(1, shoulderY + 10);
    ctx.lineTo(8, shoulderY + 17);
    ctx.lineTo(1, shoulderY + 27);
    ctx.lineTo(-6, shoulderY + 17);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'sparkle_top') {
    // Pastel Shimmer Top with Golden Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, shoulderY + torsoH * 0.25, sW * 0.75, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    [[-4, 14], [5, 22], [-2, 30]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, shoulderY + sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (style === 'princess_coat') {
    // Elegant Gala Sash & Gold Pearl Trim
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.moveTo(-sW * 0.85, shoulderY + 4);
    ctx.lineTo(sW * 0.9, hipY);
    ctx.lineTo(sW * 0.55, hipY);
    ctx.lineTo(-sW, shoulderY + 13);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-hW, hipY - 5, hW * 2, 5);
  } else if (style === 'astronaut') {
    // Sleek glossy pearl chest plate & cyan holo indicator
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(-wW * 0.65, shoulderY + 9, wW * 1.35, 16, [5]);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(-wW * 0.4, shoulderY + 13, 8, 4, [2]);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(wW * 0.35, shoulderY + 15, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Ribbed hem cuff at waist/hip
  ctx.fillStyle = shadeHex(baseColor, -20);
  ctx.beginPath();
  ctx.roundRect(-hW * 0.96, hipY - 1, hW * 1.94, 5.5, [3]);
  ctx.fill();

  // Stickers painted onto chest
  if (topConfig.stickers && topConfig.stickers.length > 0) {
    topConfig.stickers.forEach((s) => {
      ctx.save();
      const sx = (s.x || 0) * (sW * 0.72) + 1.5;
      const sy = shoulderY + (s.y || 0.45) * torsoH;
      const sc = (s.scale || 1.0) * 0.78;
      ctx.translate(sx, sy);
      ctx.scale(sc, sc);
      drawStickerGraphic(ctx, s.type, frame);
      ctx.restore();
    });
  }

  ctx.restore();
}

function drawStickerGraphic(ctx, type) {
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.55)';
  ctx.shadowBlur = 5;

  if (type === 'heart') {
    const g = ctx.createRadialGradient(-2, -3, 1, 0, 0, 10);
    g.addColorStop(0, '#fbcfe8');
    g.addColorStop(0.5, '#f43f5e');
    g.addColorStop(1, '#be123c');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.bezierCurveTo(-11, -1, -7, -9, 0, -3);
    ctx.bezierCurveTo(7, -9, 11, -1, 0, 7);
    ctx.fill();
  } else if (type === 'diamond') {
    const g = ctx.createLinearGradient(-7, -8, 7, 8);
    g.addColorStop(0, '#e0f2fe');
    g.addColorStop(0.5, '#38bdf8');
    g.addColorStop(1, '#0284c7');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 9);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'lightning') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(2, -9);
    ctx.lineTo(-5, 1);
    ctx.lineTo(0, 1);
    ctx.lineTo(-2, 9);
    ctx.lineTo(6, -1);
    ctx.lineTo(1, -1);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'crown') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-7, 5);
    ctx.lineTo(-8, -4);
    ctx.lineTo(-3, 0);
    ctx.lineTo(0, -6);
    ctx.lineTo(3, 0);
    ctx.lineTo(8, -4);
    ctx.lineTo(7, 5);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'rainbow') {
    ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8'].forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 5, 9 - i * 2, Math.PI, 0);
      ctx.stroke();
    });
  } else if (type === 'flame') {
    const g = ctx.createLinearGradient(0, -9, 0, 8);
    g.addColorStop(0, '#fef08a');
    g.addColorStop(0.5, '#fb923c');
    g.addColorStop(1, '#e11d48');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.quadraticCurveTo(8, -1, 5, 6);
    ctx.quadraticCurveTo(0, 9, -5, 6);
    ctx.quadraticCurveTo(-8, -1, 0, -9);
    ctx.fill();
  } else if (type === 'rocket') {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(0, -1, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(4, -4);
    ctx.lineTo(-4, -4);
    ctx.closePath();
    ctx.fill();
  } else {
    // Beveled Golden Star
    const g = ctx.createRadialGradient(-2, -2, 1, 0, 0, 9);
    g.addColorStop(0, '#fef9c3');
    g.addColorStop(0.55, '#fbbf24');
    g.addColorStop(1, '#d97706');
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? 9 : 4;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawArticulatedArm(ctx, shX, shY, thick, upperLen, foreLen, upperAngle, elbowAngle, topConfig, isBack, propType, frame = 0) {
  ctx.save();
  ctx.translate(shX, shY);
  ctx.rotate(upperAngle);

  const baseColor = topConfig.color || '#ec4899';
  const dim = isBack ? -24 : 0;
  const style = topConfig.style || 'hoodie';
  const sleeveFrac = style === 'tshirt' ? 0.52 : 1.0;

  // Upper Arm
  const elX = 0;
  const elY = upperLen;

  const skinGrad = ctx.createLinearGradient(-thick * 0.5, 0, thick * 0.5, 0);
  skinGrad.addColorStop(0, isBack ? '#efb591' : '#ffe8d8');
  skinGrad.addColorStop(0.55, isBack ? '#e39e79' : '#ffd1b3');
  skinGrad.addColorStop(1, isBack ? '#ca835e' : '#eda57f');

  const sleeveColor = style === 'pirate' ? '#fff7ed' : baseColor;
  const sleeveGrad = makeStudioGrad(ctx, -thick * 0.6, 0, thick * 0.6, upperLen, shadeHex(sleeveColor, dim), 44, -40);

  if (sleeveFrac < 1) {
    // T-shirt short sleeve + bare lower upper-arm
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.roundRect(-thick * 0.44, upperLen * 0.35, thick * 0.88, upperLen * 0.68, [4]);
    ctx.fill();

    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.moveTo(-thick * 0.6, 0);
    ctx.quadraticCurveTo(0, -thick * 0.45, thick * 0.6, 0);
    ctx.lineTo(thick * 0.56, upperLen * 0.56);
    ctx.quadraticCurveTo(0, upperLen * 0.62, -thick * 0.56, upperLen * 0.56);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.moveTo(-thick * 0.56, 0);
    ctx.quadraticCurveTo(0, -thick * 0.5, thick * 0.56, 0);
    ctx.lineTo(thick * 0.48, upperLen + 2);
    ctx.quadraticCurveTo(0, upperLen + 5, -thick * 0.48, upperLen + 2);
    ctx.closePath();
    ctx.fill();
  }

  // Forearm from Elbow
  ctx.translate(elX, elY);
  ctx.rotate(elbowAngle);

  const hasLongSleeve = style !== 'tshirt';
  if (hasLongSleeve) {
    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.moveTo(-thick * 0.48, -2);
    ctx.lineTo(thick * 0.48, -2);
    ctx.lineTo(thick * 0.42, foreLen - 2);
    ctx.quadraticCurveTo(0, foreLen + 2, -thick * 0.42, foreLen - 2);
    ctx.closePath();
    ctx.fill();

    // Ribbed cuff
    ctx.fillStyle = shadeHex(sleeveColor, dim - 25);
    ctx.beginPath();
    ctx.roundRect(-thick * 0.44, foreLen - 5, thick * 0.88, 4.5, [2]);
    ctx.fill();
  } else {
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.moveTo(-thick * 0.43, -2);
    ctx.lineTo(thick * 0.43, -2);
    ctx.lineTo(thick * 0.34, foreLen);
    ctx.quadraticCurveTo(0, foreLen + 3, -thick * 0.34, foreLen);
    ctx.closePath();
    ctx.fill();
  }

  // Sculpted Hand (palm + gentle thumb)
  ctx.save();
  ctx.translate(0, foreLen + 2);
  const handGrad = ctx.createRadialGradient(-1, -1, 1, 0, 1, thick * 0.65);
  handGrad.addColorStop(0, isBack ? '#f3bd9a' : '#ffece0');
  handGrad.addColorStop(1, isBack ? '#cf8964' : '#efaa86');
  ctx.fillStyle = handGrad;
  ctx.beginPath();
  ctx.ellipse(0.5, 2.2, thick * 0.48, thick * 0.58, 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(thick * 0.36, 0.4, thick * 0.22, thick * 0.32, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Interactive Home Tool Props!
  if (!isBack && propType === 'spoon') {
    ctx.save();
    ctx.rotate(0.45);
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(-1.8, -4, 3.6, 26, [2]);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 23, 5.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (!isBack && propType === 'broom') {
    ctx.save();
    ctx.rotate(-0.25);
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(-2, -14, 4, 46, [2]);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-7, 30);
    ctx.lineTo(7, 30);
    ctx.lineTo(10, 42);
    ctx.lineTo(-10, 42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (!isBack && propType === 'can') {
    ctx.save();
    ctx.rotate(0.2);
    const canGrad = ctx.createLinearGradient(-8, 0, 8, 14);
    canGrad.addColorStop(0, '#67e8f9');
    canGrad.addColorStop(1, '#0891b2');
    ctx.fillStyle = canGrad;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 15, 13, [4]);
    ctx.fill();
    // Spout
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 8);
    ctx.lineTo(20, 2);
    ctx.stroke();
    // Animated water droplets
    ctx.fillStyle = 'rgba(165, 243, 252, 0.9)';
    for (let d = 0; d < 3; d++) {
      const dy = ((frame * 1.4 + d * 8) % 22);
      ctx.beginPath();
      ctx.arc(22 + d * 2, 4 + dy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
  ctx.restore();
}

function drawArticulatedLeg(ctx, hipX, hipY, thick, thighLen, calfLen, thighAngle, kneeAngle, pantsConfig, shoesConfig, isBack) {
  ctx.save();
  ctx.translate(hipX, hipY);
  ctx.rotate(thighAngle);

  const baseColor = pantsConfig.color || '#38bdf8';
  const style = pantsConfig.style || 'shorts';
  const dim = isBack ? -24 : 0;

  const pantsGrad = makeStudioGrad(ctx, -thick * 0.6, 0, thick * 0.6, thighLen, shadeHex(baseColor, dim), 42, -40);
  const skinGrad = ctx.createLinearGradient(-thick * 0.5, 0, thick * 0.5, 0);
  skinGrad.addColorStop(0, isBack ? '#efb591' : '#ffe8d8');
  skinGrad.addColorStop(0.55, isBack ? '#e39e79' : '#ffd1b3');
  skinGrad.addColorStop(1, isBack ? '#ca835e' : '#eda57f');

  // Thigh
  ctx.fillStyle = pantsGrad;
  ctx.beginPath();
  ctx.moveTo(-thick * 0.64, -3);
  ctx.quadraticCurveTo(0, -thick * 0.6, thick * 0.64, -3);
  ctx.lineTo(thick * 0.52, thighLen + 2);
  ctx.quadraticCurveTo(0, thighLen + 6, -thick * 0.52, thighLen + 2);
  ctx.closePath();
  ctx.fill();

  if (style === 'sweatpants') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.fillRect(thick * 0.14, 2, 2.2, thighLen - 2);
  } else if (style === 'cargo') {
    ctx.fillStyle = shadeHex(baseColor, dim - 25);
    ctx.beginPath();
    ctx.roundRect(-thick * 0.45, thighLen * 0.4, thick * 0.9, thighLen * 0.38, [3]);
    ctx.fill();
  } else if (style === 'robot_legs') {
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-thick * 0.45, thighLen * 0.25, thick * 0.9, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, thighLen, 3.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'star_jeans') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(thick * 0.16, thighLen * 0.45, 2.6, 0, Math.PI * 2);
    ctx.arc(-thick * 0.12, thighLen * 0.72, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Knee -> Calf -> Ankle
  ctx.translate(0, thighLen);
  ctx.rotate(kneeAngle);

  const calfGrad = style === 'shorts' ? skinGrad : pantsGrad;
  ctx.fillStyle = calfGrad;
  ctx.beginPath();
  ctx.moveTo(-thick * 0.5, -2);
  ctx.quadraticCurveTo(0, -4, thick * 0.5, -2);
  ctx.quadraticCurveTo(thick * 0.55, calfLen * 0.35, thick * 0.36, calfLen);
  ctx.lineTo(-thick * 0.36, calfLen);
  ctx.quadraticCurveTo(-thick * 0.5, calfLen * 0.35, -thick * 0.5, -2);
  ctx.closePath();
  ctx.fill();

  if (style === 'sweatpants') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.fillRect(thick * 0.12, 0, 2.2, calfLen - 3);
  }

  // Foot & Sculpted Shoe at Ankle
  ctx.translate(0, calfLen);
  ctx.rotate(-(thighAngle + kneeAngle) * 0.35);
  drawSculptedShoe(ctx, thick, shoesConfig, isBack);

  ctx.restore();
}

function drawSculptedShoe(ctx, legThick, shoesConfig, isBack) {
  const style = shoesConfig.style || 'sneakers';
  const dim = isBack ? -20 : 0;

  if (style === 'barefoot') {
    ctx.fillStyle = isBack ? '#e39e79' : '#ffd7bd';
    ctx.beginPath();
    ctx.ellipse(4, 2, legThick * 0.85, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const shoeBase = shoesConfig.color || '#ffffff';
  const shoeW = legThick * 1.85;
  const shoeH = style === 'boots' || style === 'glitter_boots' ? 14 : 10.5;

  if (style === 'boots' || style === 'glitter_boots') {
    // Tall boot cuff around ankle
    ctx.fillStyle = makeStudioGrad(ctx, -legThick * 0.5, -10, legThick * 0.5, 2, shadeHex(shoeBase, dim), 42, -36);
    ctx.beginPath();
    ctx.roundRect(-legThick * 0.52, -10, legThick * 1.06, 13, [4, 4, 2, 2]);
    ctx.fill();
    if (style === 'glitter_boots') {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -4, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sculpted shoe upper
  ctx.fillStyle = makeStudioGrad(ctx, -legThick * 0.5, -3, shoeW, shoeH, shadeHex(shoeBase, dim), 48, -36);
  ctx.beginPath();
  ctx.moveTo(-legThick * 0.55, -2);
  ctx.quadraticCurveTo(legThick * 0.1, -4, legThick * 0.45, -1);
  ctx.bezierCurveTo(legThick * 1.1, 0, shoeW * 0.82, 3, shoeW * 0.78, shoeH - 3);
  ctx.lineTo(-legThick * 0.55, shoeH - 3);
  ctx.closePath();
  ctx.fill();

  // Specular highlight & sculpted midsole
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.roundRect(-legThick * 0.58, shoeH - 4.5, shoeW * 1.08, 4.5, [2, 3, 3, 3]);
  ctx.fill();

  // Accent strap / laces
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(legThick * 0.15, -0.5);
  ctx.lineTo(legThick * 0.5, 1.5);
  ctx.stroke();

  if (style === 'wings') {
    const wg = ctx.createLinearGradient(-legThick, -9, 0, 4);
    wg.addColorStop(0, '#ffffff');
    wg.addColorStop(1, '#a5f3fc');
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.moveTo(-legThick * 0.4, 0);
    ctx.quadraticCurveTo(-legThick * 1.4, -12, -legThick * 1.5, -3);
    ctx.quadraticCurveTo(-legThick * 1.1, 4, -legThick * 0.4, 4);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'rocket') {
    const fl = ctx.createLinearGradient(0, shoeH, 0, shoeH + 10);
    fl.addColorStop(0, '#fef08a');
    fl.addColorStop(1, '#f43f5e');
    ctx.fillStyle = fl;
    ctx.beginPath();
    ctx.moveTo(-legThick * 0.35, shoeH);
    ctx.lineTo(0, shoeH + 10);
    ctx.lineTo(legThick * 0.35, shoeH);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'skates') {
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-legThick * 0.5, shoeH + 2.5);
    ctx.lineTo(shoeW * 0.8, shoeH + 2.5);
    ctx.arc(shoeW * 0.8, shoeH - 0.5, 3, Math.PI * 0.5, -Math.PI * 0.45, true);
    ctx.stroke();
  }
}

function drawSculptedHairBack(ctx, x, headY, headW, headH, hairId, hairBase, frame) {
  if (hairId === 'hair_none') return;
  ctx.save();
  ctx.translate(x, headY);

  const darkHair = shadeHex(hairBase, -44);
  const midHair = shadeHex(hairBase, -12);
  const sway = Math.sin(frame * 0.1) * 2.2;

  if (
    hairId === 'hair_3' ||
    hairId === 'hair_crown' ||
    hairId === 'hair_cat' ||
    hairId === 'hair_halo' ||
    hairId === 'hair_bunny' ||
    hairId === 'hair_flower' ||
    hairId === 'hair_unicorn'
  ) {
    // Flowing layered S-wave back hair
    const backGrad = ctx.createLinearGradient(-headW, -headH * 0.4, headW, headH * 2.1);
    backGrad.addColorStop(0, midHair);
    backGrad.addColorStop(1, darkHair);
    ctx.fillStyle = backGrad;
    ctx.beginPath();
    ctx.moveTo(-headW * 0.96, -headH * 0.3);
    ctx.bezierCurveTo(-headW * 1.45, headH * 0.45, -headW * 1.55 - sway, headH * 1.35, -headW * 1.12 - sway, headH * 2.05);
    ctx.quadraticCurveTo(-headW * 0.35, headH * 1.85, 0, headH * 1.98);
    ctx.quadraticCurveTo(headW * 0.45, headH * 1.88, headW * 0.88 + sway * 0.4, headH * 1.85);
    ctx.bezierCurveTo(headW * 1.15, headH * 1.1, headW * 1.02, headH * 0.3, headW * 0.85, -headH * 0.3);
    ctx.closePath();
    ctx.fill();
  } else if (hairId === 'hair_afro') {
    const afroGrad = ctx.createRadialGradient(-headW * 0.35, -headH * 0.4, headW * 0.25, 0, -headH * 0.18, headH * 1.65);
    afroGrad.addColorStop(0, shadeHex(hairBase, 40));
    afroGrad.addColorStop(0.6, hairBase);
    afroGrad.addColorStop(1, darkHair);
    ctx.fillStyle = afroGrad;
    ctx.beginPath();
    ctx.arc(-headW * 0.3, -headH * 0.2, headH * 1.48, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSculptedHead(ctx, x, y, w, h, tilt, bodyConfig, isBlinking, frame, headOpts = {}) {
  const { isSleeping = false, isSick = false } = headOpts;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  // Back Ear (left side, 3/4 view)
  const earGrad = ctx.createRadialGradient(-w * 0.95, h * 0.04, 1, -w * 0.92, h * 0.08, 6.5);
  earGrad.addColorStop(0, '#ffe4d2');
  earGrad.addColorStop(1, '#e8a27d');
  ctx.fillStyle = earGrad;
  ctx.beginPath();
  ctx.ellipse(-w * 0.92, h * 0.08, 4.2, 6.2, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Cute Pearl Stud
  ctx.fillStyle = '#fff1f2';
  ctx.beginPath();
  ctx.arc(-w * 0.92, h * 0.24, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Sculpted 3/4 Oval Head Silhouette (gentle cheekbones & tapered chin)
  const drawFaceContour = () => {
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w * 0.82, -h, w * 1.02, -h * 0.35, w * 0.96, h * 0.15);
    ctx.bezierCurveTo(w * 0.90, h * 0.68, w * 0.48, h * 0.98, w * 0.12, h);
    ctx.bezierCurveTo(-w * 0.45, h * 0.98, -w * 0.92, h * 0.62, -w * 0.98, h * 0.08);
    ctx.bezierCurveTo(-w * 1.02, -h * 0.45, -w * 0.82, -h, 0, -h);
    ctx.closePath();
  };

  // Subsurface Skin Lighting Gradient
  const skinGrad = ctx.createRadialGradient(w * 0.22, -h * 0.28, w * 0.15, 0, 0, h * 1.18);
  skinGrad.addColorStop(0, '#fff4ec');
  skinGrad.addColorStop(0.55, '#ffd7be');
  skinGrad.addColorStop(0.88, '#f5b895');
  skinGrad.addColorStop(1, '#e69f7b');
  ctx.fillStyle = skinGrad;
  drawFaceContour();
  ctx.fill();

  // Soft Warm Cheekbone Blush + Highlighter (warmer rose if feverish/sick)
  const blushAlpha = isSick ? 0.54 : 0.34;
  [
    { cx: -w * 0.34, cy: h * 0.24, rx: w * (isSick ? 0.31 : 0.26) },
    { cx: w * 0.56, cy: h * 0.24, rx: w * (isSick ? 0.29 : 0.24) }
  ].forEach((b) => {
    const blush = ctx.createRadialGradient(b.cx, b.cy, 0.5, b.cx, b.cy, b.rx);
    blush.addColorStop(0, `rgba(244, 63, 94, ${blushAlpha})`);
    blush.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, b.rx, 0, Math.PI * 2);
    ctx.fill();
  });

  // Delicate 3/4 Sculpted Nose (soft bridge shadow + pearl tip highlight)
  ctx.fillStyle = isSick ? 'rgba(225, 29, 72, 0.42)' : 'rgba(195, 110, 82, 0.32)';
  ctx.beginPath();
  ctx.ellipse(w * 0.26, h * 0.14, 2.2, 1.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 250, 245, 0.72)';
  ctx.beginPath();
  ctx.arc(w * 0.28, h * 0.08, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Sculpted Expressive Feature-Film Face
  drawSculptedFace(ctx, w, h, bodyConfig.faceId, isBlinking, { isSleeping, isSick });

  // Tiny Thermometer if sick
  if (isSick && bodyConfig.faceId !== 'face_5') {
    ctx.save();
    ctx.translate(w * 0.35, h * 0.48);
    ctx.rotate(0.45);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0, -1.6, 13, 3.2, [1.5]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(1.5, -0.8, 6.5, 1.6);
    ctx.restore();
  }

  // Lush Layered Front Hair & Accessories
  const hairBase = bodyConfig.hairColor || '#d97706';
  drawSculptedHairFront(ctx, w, h, bodyConfig.hairId, hairBase, frame);

  ctx.restore();
}

function drawSculptedFace(ctx, w, h, faceId, isBlinking, faceOpts = {}) {
  const { isSleeping = false, isSick = false } = faceOpts;
  // 3/4 shifted eye positions
  const eyeLx = -w * 0.20;
  const eyeRx = w * 0.50;
  const eyeY = -h * 0.08;
  const eyeW = w * 0.25;
  const eyeH = h * 0.15;

  switch (faceId) {
    case 'face_2': { // Chic Rose-Gold Dream Aviator Sunglasses
      const lensGrad = ctx.createLinearGradient(-w * 0.5, -h * 0.25, w * 0.85, h * 0.12);
      lensGrad.addColorStop(0, '#f472b6');
      lensGrad.addColorStop(0.55, '#9333ea');
      lensGrad.addColorStop(1, '#3b0764');

      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.8;
      ctx.fillStyle = lensGrad;

      [
        { cx: eyeLx, w: eyeW * 1.45 },
        { cx: eyeRx, w: eyeW * 1.3 }
      ].forEach((l) => {
        ctx.beginPath();
        ctx.roundRect(l.cx - l.w, eyeY - eyeH * 1.15, l.w * 2, eyeH * 2.25, [6, 6, 9, 9]);
        ctx.fill();
        ctx.stroke();

        // Diagonal lens reflection
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(l.cx - l.w * 0.45, eyeY - eyeH * 0.7);
        ctx.lineTo(l.cx + l.w * 0.15, eyeY + eyeH * 0.6);
        ctx.stroke();
        ctx.strokeStyle = '#fde68a';
      });

      // Gold bridge
      ctx.beginPath();
      ctx.moveTo(eyeLx + eyeW * 1.45, eyeY - eyeH * 0.5);
      ctx.quadraticCurveTo(w * 0.18, eyeY - eyeH * 0.9, eyeRx - eyeW * 1.3, eyeY - eyeH * 0.5);
      ctx.stroke();

      drawGlossyLips(ctx, w * 0.16, h * 0.46, w * 0.28, false);
      break;
    }

    case 'face_3': // Focused & Determined Heroine
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.5, eyeW * 1.1, 0.22);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.5, eyeW * 0.95, -0.26);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW, eyeH, isBlinking, '#0ea5e9');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.85, eyeH, isBlinking, '#0ea5e9');
      drawGlossyLips(ctx, w * 0.16, h * 0.46, w * 0.24, false);
      break;

    case 'face_4': // Starry Wonder Eyes
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.75, eyeW * 1.1, -0.14);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.75, eyeW * 0.95, 0.14);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW * 1.05, eyeH * 1.08, isSleeping, '#f59e0b', 'star');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.88, eyeH * 1.08, isSleeping, '#f59e0b', 'star');
      drawGlossyLips(ctx, w * 0.16, h * 0.45, w * 0.30, !isSleeping && !isSick);
      break;

    case 'face_5': // Sleek Velvet Ninja Veil
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.moveTo(-w * 0.92, h * 0.08);
      ctx.quadraticCurveTo(w * 0.2, h * 0.24, w * 0.95, h * 0.06);
      ctx.bezierCurveTo(w * 0.9, h * 0.68, w * 0.48, h * 0.98, w * 0.12, h);
      ctx.bezierCurveTo(-w * 0.45, h * 0.98, -w * 0.9, h * 0.6, -w * 0.92, h * 0.08);
      ctx.closePath();
      ctx.fill();

      drawAlmondEye(ctx, eyeLx, eyeY, eyeW, eyeH * 0.9, isBlinking, '#38bdf8');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.85, eyeH * 0.9, isBlinking, '#38bdf8');
      break;

    case 'face_6': // Dreamy Heart Eyes
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.65, eyeW * 1.05, -0.12);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.65, eyeW * 0.9, 0.12);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW * 1.05, eyeH * 1.05, isSleeping, '#ec4899', 'heart');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.88, eyeH * 1.05, isSleeping, '#ec4899', 'heart');
      drawGlossyLips(ctx, w * 0.16, h * 0.45, w * 0.30, !isSleeping && !isSick);
      break;

    case 'face_7': { // Futuristic Hologram Visor
      const visorGrad = ctx.createLinearGradient(-w * 0.6, eyeY, w * 0.95, eyeY);
      visorGrad.addColorStop(0, 'rgba(236, 72, 153, 0.88)');
      visorGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.92)');
      visorGrad.addColorStop(1, 'rgba(168, 85, 247, 0.88)');
      ctx.fillStyle = visorGrad;
      ctx.beginPath();
      ctx.roundRect(-w * 0.56, eyeY - eyeH * 1.1, w * 1.48, eyeH * 2.1, [8]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      drawGlossyLips(ctx, w * 0.16, h * 0.46, w * 0.26, false);
      break;
    }

    case 'face_8': // Butterfly Sparkle Eyes
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.65, eyeW * 1.05, -0.14);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.65, eyeW * 0.9, 0.14);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW * 1.04, eyeH * 1.04, isBlinking, '#a855f7', 'star');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.88, eyeH * 1.04, isBlinking, '#a855f7', 'star');
      // Tiny pastel butterfly wing accent on cheek
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(-w * 0.42, h * 0.26, 3.2, 2.1, -0.4, 0, Math.PI * 2);
      ctx.ellipse(-w * 0.34, h * 0.30, 2.4, 1.8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      drawGlossyLips(ctx, w * 0.16, h * 0.45, w * 0.30, true);
      break;

    case 'face_9': // Rainbow Star Eyes
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.7, eyeW * 1.05, -0.12);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.7, eyeW * 0.9, 0.12);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW * 1.08, eyeH * 1.08, isBlinking, '#ec4899', 'star');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.92, eyeH * 1.08, isBlinking, '#0ea5e9', 'star');
      drawGlossyLips(ctx, w * 0.16, h * 0.45, w * 0.31, true);
      break;

    case 'face_1':
    default: // Sparkling Feature-Film Eyes & Warm Glossy Smile
      drawBrow(ctx, eyeLx, eyeY - eyeH * 1.65, eyeW * 1.05, -0.12);
      drawBrow(ctx, eyeRx, eyeY - eyeH * 1.65, eyeW * 0.9, 0.12);
      drawAlmondEye(ctx, eyeLx, eyeY, eyeW, eyeH, isBlinking, '#0284c7');
      drawAlmondEye(ctx, eyeRx, eyeY, eyeW * 0.85, eyeH, isBlinking, '#0284c7');
      drawGlossyLips(ctx, w * 0.16, h * 0.45, w * 0.30, true);
      break;
  }
}

function drawBrow(ctx, cx, cy, halfW, tilt) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.strokeStyle = '#6d3b2e';
  ctx.lineWidth = 1.9;
  ctx.beginPath();
  ctx.moveTo(-halfW, 1);
  ctx.quadraticCurveTo(0, -2.5, halfW, 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawAlmondEye(ctx, cx, cy, ew, eh, isBlinking, irisColor, specialCatchlight = null) {
  ctx.save();
  ctx.translate(cx, cy);

  if (isBlinking) {
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-ew, 0.5);
    ctx.quadraticCurveTo(0, eh * 0.9, ew, 0.5);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Soft Almond Sclera with top eyelid shadow
  const scleraPath = () => {
    ctx.beginPath();
    ctx.moveTo(-ew, 0.5);
    ctx.bezierCurveTo(-ew * 0.5, -eh * 1.15, ew * 0.5, -eh * 1.15, ew, 0.5);
    ctx.bezierCurveTo(ew * 0.5, eh * 1.0, -ew * 0.5, eh * 1.0, -ew, 0.5);
    ctx.closePath();
  };

  ctx.fillStyle = '#fff9f5';
  scleraPath();
  ctx.fill();

  ctx.save();
  scleraPath();
  ctx.clip();

  // Subtle cool shadow at top of eyeball
  ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.fillRect(-ew - 1, -eh * 1.2, ew * 2 + 2, eh * 0.55);

  // Jewel-toned Multi-Ring Iris
  const ir = Math.min(ew * 0.72, eh * 0.96);
  const irisX = ew * 0.1;
  const irisGrad = ctx.createRadialGradient(irisX, eh * 0.15, ir * 0.15, irisX, 0, ir);
  irisGrad.addColorStop(0, shadeHex(irisColor, 55));
  irisGrad.addColorStop(0.65, irisColor);
  irisGrad.addColorStop(1, shadeHex(irisColor, -65));
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.arc(irisX, 0, ir, 0, Math.PI * 2);
  ctx.fill();

  // Warm bottom iris bounce light
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.arc(irisX, ir * 0.45, ir * 0.45, 0, Math.PI);
  ctx.fill();

  // Deep Pupil
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(irisX, 0, ir * 0.46, 0, Math.PI * 2);
  ctx.fill();

  // Special star / heart iris shimmer
  if (specialCatchlight === 'star') {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(irisX - ir * 0.22, -ir * 0.25, ir * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (specialCatchlight === 'heart') {
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(irisX - ir * 0.22, -ir * 0.25, ir * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crisp Double Specular Catchlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(irisX - ir * 0.28, -ir * 0.3, ir * 0.26, 0, Math.PI * 2);
  ctx.arc(irisX + ir * 0.34, ir * 0.25, ir * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Upper Eyelash Wing & Soft Crease
  ctx.strokeStyle = '#3b1c4a';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-ew * 1.04, 0.5);
  ctx.bezierCurveTo(-ew * 0.45, -eh * 1.18, ew * 0.45, -eh * 1.18, ew * 1.06, -0.2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(180, 100, 80, 0.38)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(-ew * 0.7, -eh * 1.15);
  ctx.quadraticCurveTo(0, -eh * 1.55, ew * 0.7, -eh * 1.15);
  ctx.stroke();

  ctx.restore();
}

function drawGlossyLips(ctx, cx, cy, halfW, openSmile) {
  ctx.save();
  ctx.translate(cx, cy);

  if (openSmile) {
    // Joyful parted lips with subtle teeth glint
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.quadraticCurveTo(0, 1.5, halfW, -0.5);
    ctx.quadraticCurveTo(0, halfW * 1.05, -halfW, 0);
    ctx.closePath();
    ctx.fill();

    // Pearly teeth top curve
    ctx.fillStyle = '#fff9f5';
    ctx.beginPath();
    ctx.moveTo(-halfW * 0.72, 0.4);
    ctx.quadraticCurveTo(0, 1.8, halfW * 0.72, 0.2);
    ctx.quadraticCurveTo(0, halfW * 0.42, -halfW * 0.72, 0.4);
    ctx.closePath();
    ctx.fill();

    // Glossy rose lower lip rim
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-halfW * 0.85, 0.6);
    ctx.quadraticCurveTo(0, halfW * 1.1, halfW * 0.85, 0.2);
    ctx.stroke();
  } else {
    // Sculpted Cupid's Bow & Glossy Lower Lip
    const lipGrad = ctx.createLinearGradient(0, -2, 0, 4);
    lipGrad.addColorStop(0, '#f43f5e');
    lipGrad.addColorStop(1, '#fb7185');
    ctx.fillStyle = lipGrad;
    ctx.beginPath();
    ctx.moveTo(-halfW, 0.5);
    ctx.quadraticCurveTo(-halfW * 0.3, -2.5, 0, -1);
    ctx.quadraticCurveTo(halfW * 0.3, -2.5, halfW, 0);
    ctx.quadraticCurveTo(0, 4.5, -halfW, 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // Specular Lip Gloss Dot
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.beginPath();
  ctx.ellipse(0, openSmile ? halfW * 0.78 : 2.1, halfW * 0.24, 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSculptedHairFront(ctx, w, h, hairId, hairBase, frame) {
  if (hairId === 'hair_none') return;
  ctx.save();

  const hairGrad = makeStudioGrad(ctx, -w, -h * 1.25, w, h * 0.3, hairBase, 52, -40);
  const sheen = () => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, -h * 0.32, w * 0.76, Math.PI * 1.15, Math.PI * 1.56);
    ctx.stroke();
  };

  if (hairId === 'hair_2') {
    // Chic Sculpted Glam Swoop / Faux-Hawk
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.moveTo(-w * 0.95, -h * 0.15);
    ctx.bezierCurveTo(-w * 1.05, -h * 1.15, -w * 0.25, -h * 1.58, w * 0.28, -h * 1.48);
    ctx.bezierCurveTo(w * 0.78, -h * 1.38, w * 1.02, -h * 0.95, w * 0.85, -h * 0.45);
    ctx.quadraticCurveTo(w * 0.2, -h * 0.65, -w * 0.45, -h * 0.42);
    ctx.quadraticCurveTo(-w * 0.75, -h * 0.25, -w * 0.95, -h * 0.15);
    ctx.closePath();
    ctx.fill();
    sheen();
  } else if (hairId === 'hair_afro') {
    // Fluffy Textured Crown Curls
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.arc(-w * 0.52, -h * 0.86, w * 0.48, Math.PI * 0.8, Math.PI * 2.1);
    ctx.arc(0, -h * 0.98, w * 0.55, Math.PI, Math.PI * 2);
    ctx.arc(w * 0.56, -h * 0.84, w * 0.44, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
  } else {
    // Stylish Side-Swept Sculpted Bangs & Crown Volume (used by hair_1, hair_3, crown, cat, halo)
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.moveTo(-w * 1.04, 0.08 * h);
    ctx.bezierCurveTo(-w * 1.15, -h * 0.85, -w * 0.55, -h * 1.24, 0.08 * w, -h * 1.18);
    ctx.bezierCurveTo(w * 0.78, -h * 1.14, w * 1.08, -h * 0.62, w * 0.98, -h * 0.22);
    // Side-swept bangs swoop
    ctx.quadraticCurveTo(w * 0.55, -h * 0.58, 0.05 * w, -h * 0.56);
    ctx.bezierCurveTo(-w * 0.45, -h * 0.54, -w * 0.72, -h * 0.12, -w * 0.86, h * 0.28);
    ctx.quadraticCurveTo(-w * 1.02, h * 0.22, -w * 1.04, 0.08 * h);
    ctx.closePath();
    ctx.fill();
    sheen();
  }

  if (hairId === 'hair_crown') {
    // Jeweled Royal Tiara
    const tiGrad = ctx.createLinearGradient(-w * 0.65, -h * 1.5, w * 0.65, -h * 0.95);
    tiGrad.addColorStop(0, '#fef9c3');
    tiGrad.addColorStop(0.5, '#fbbf24');
    tiGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = tiGrad;
    ctx.beginPath();
    ctx.moveTo(-w * 0.65, -h * 0.95);
    ctx.lineTo(-w * 0.72, -h * 1.42);
    ctx.lineTo(-w * 0.28, -h * 1.18);
    ctx.lineTo(0, -h * 1.62);
    ctx.lineTo(w * 0.28, -h * 1.18);
    ctx.lineTo(w * 0.72, -h * 1.42);
    ctx.lineTo(w * 0.65, -h * 0.95);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(0, -h * 1.22, 3.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (hairId === 'hair_cat') {
    // Velvet Cat-Ear Headband
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = hairGrad;
      ctx.beginPath();
      ctx.moveTo(dir * w * 0.22, -h * 1.04);
      ctx.quadraticCurveTo(dir * w * 0.64, -h * 1.58, dir * w * 0.8, -h * 1.54);
      ctx.quadraticCurveTo(dir * w * 0.92, -h * 1.15, dir * w * 0.84, -h * 0.8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(dir * w * 0.38, -h * 1.06);
      ctx.lineTo(dir * w * 0.7, -h * 1.38);
      ctx.lineTo(dir * w * 0.74, -h * 0.9);
      ctx.closePath();
      ctx.fill();
    });
  } else if (hairId === 'hair_wizard') {
    const wg = ctx.createLinearGradient(-w, -h * 2.1, w, -h * 0.8);
    wg.addColorStop(0, '#c084fc');
    wg.addColorStop(0.5, '#7e22ce');
    wg.addColorStop(1, '#4c1d95');
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.92, w * 1.35, h * 0.2, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-w * 0.8, -h * 0.96);
    ctx.quadraticCurveTo(-w * 0.2, -h * 1.68, w * 0.18, -h * 2.18);
    ctx.quadraticCurveTo(w * 0.5, -h * 1.52, w * 0.8, -h * 0.96);
    ctx.closePath();
    ctx.fill();

    // Gold band + vector star
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.roundRect(-w * 0.76, -h * 1.06, w * 1.52, 4, [2]);
    ctx.fill();
  } else if (hairId === 'hair_halo') {
    ctx.save();
    const floatY = Math.sin(frame * 0.1) * 1.8;
    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.ellipse(0, -h * 1.46 + floatY, w * 0.78, h * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (hairId === 'hair_bunny') {
    // Cute Tall Pastel Bunny Ears
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(dir * w * 0.45, -h * 1.48, w * 0.22, h * 0.62, dir * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f9a8d4';
      ctx.beginPath();
      ctx.ellipse(dir * w * 0.45, -h * 1.46, w * 0.11, h * 0.42, dir * 0.14, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (hairId === 'hair_flower') {
    // Pastel Blossom Crown
    const petals = ['#f472b6', '#fde047', '#ffffff', '#c084fc', '#fb7185'];
    [-0.7, -0.35, 0, 0.35, 0.7].forEach((px, idx) => {
      ctx.fillStyle = petals[idx];
      ctx.beginPath();
      ctx.arc(px * w, -h * 1.05 + Math.abs(px) * 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px * w, -h * 1.05 + Math.abs(px) * 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (hairId === 'hair_unicorn') {
    // Golden Unicorn Horn & Pastel Ears
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(dir * w * 0.55, -h * 1.15, w * 0.16, h * 0.26, dir * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
    const hornGrad = ctx.createLinearGradient(0, -h * 1.85, 0, -h * 1.0);
    hornGrad.addColorStop(0, '#fef9c3');
    hornGrad.addColorStop(0.5, '#fbbf24');
    hornGrad.addColorStop(1, '#f472b6');
    ctx.fillStyle = hornGrad;
    ctx.beginPath();
    ctx.moveTo(-w * 0.16, -h * 1.02);
    ctx.lineTo(w * 0.04, -h * 1.86);
    ctx.lineTo(w * 0.22, -h * 1.02);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
