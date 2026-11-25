import { renderCharacter } from '../editor/characterRenderer.js';

export const MOUNT_META = {
  pony: {
    id: 'pony',
    kind: 'mount',
    name: 'Reit-Pony Sternchen',
    icon: '🐴',
    speedTown: 7.4,
    speedHome: 5.0,
    seatOffsetY: -22,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#d97706',
    bellyColor: '#fef3c7',
    maneColor: '#78350f',
    saddleColor: '#ec4899',
    variant: 'pony'
  },
  alpaca: {
    id: 'alpaca',
    kind: 'mount',
    name: 'Flausch-Alpaka Flocke',
    icon: '🦙',
    speedTown: 7.8,
    speedHome: 5.2,
    seatOffsetY: -24,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#fefce8',
    bellyColor: '#fef3c7',
    maneColor: '#fde68a',
    saddleColor: '#06b6d4',
    variant: 'alpaca'
  },
  horse: {
    id: 'horse',
    kind: 'mount',
    name: 'Reitpferd Blitz',
    icon: '🐎',
    speedTown: 8.8,
    speedHome: 5.6,
    seatOffsetY: -28,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#92400e',
    bellyColor: '#b45309',
    maneColor: '#1e1b4b',
    saddleColor: '#f59e0b',
    variant: 'horse'
  },
  deer: {
    id: 'deer',
    kind: 'mount',
    name: 'Wald-Hirsch Goldhorn',
    icon: '🦌',
    speedTown: 9.2,
    speedHome: 5.8,
    seatOffsetY: -26,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#b45309',
    bellyColor: '#fde68a',
    maneColor: '#78350f',
    saddleColor: '#10b981',
    variant: 'deer'
  },
  mount_unicorn: {
    id: 'mount_unicorn',
    kind: 'mount',
    name: 'Reit-Einhorn Saphira',
    icon: '🦄',
    speedTown: 9.8,
    speedHome: 6.1,
    seatOffsetY: -28,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#ffffff',
    bellyColor: '#fdf2f8',
    maneColor: '#ec4899',
    saddleColor: '#a855f7',
    variant: 'unicorn'
  },
  donkey: {
    id: 'donkey',
    kind: 'mount',
    name: 'Reit-Esel Anton',
    icon: '🫏',
    speedTown: 7.5,
    speedHome: 5.0,
    seatOffsetY: -22,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#94a3b8',
    bellyColor: '#e2e8f0',
    maneColor: '#334155',
    saddleColor: '#3b82f6',
    variant: 'donkey'
  },
  camel: {
    id: 'camel',
    kind: 'mount',
    name: 'Wüsten-Kamel Samir',
    icon: '🐪',
    speedTown: 8.6,
    speedHome: 5.4,
    seatOffsetY: -29,
    seatOffsetX: -1,
    charPose: 'sit',
    charScale: 0.76,
    bodyColor: '#eab308',
    bellyColor: '#fef08a',
    maneColor: '#a16207',
    saddleColor: '#e11d48',
    variant: 'camel'
  },
  pegasus: {
    id: 'pegasus',
    kind: 'mount',
    name: 'Flügel-Pegasus Aura',
    icon: '🪽',
    speedTown: 10.4,
    speedHome: 6.3,
    seatOffsetY: -29,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.78,
    bodyColor: '#f0f9ff',
    bellyColor: '#e0f2fe',
    maneColor: '#38bdf8',
    saddleColor: '#fbbf24',
    variant: 'pegasus'
  }
};

export const VEHICLE_META = {
  skateboard: {
    id: 'skateboard',
    kind: 'vehicle',
    name: 'Profi-Skateboard',
    icon: '🛹',
    speedTown: 7.3,
    speedHome: 5.0,
    seatOffsetY: -8,
    seatOffsetX: 0,
    charPose: 'idle',
    charScale: 0.84,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#f43f5e',
    colorB: '#fbbf24',
    variant: 'skateboard'
  },
  skates: {
    id: 'skates',
    kind: 'vehicle',
    name: 'Retro-Rollschuhe',
    icon: '🛼',
    speedTown: 7.5,
    speedHome: 5.1,
    seatOffsetY: -5,
    seatOffsetX: 0,
    charPose: 'walk',
    charScale: 0.84,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#ec4899',
    colorB: '#38bdf8',
    variant: 'skates'
  },
  scooter: {
    id: 'scooter',
    kind: 'vehicle',
    name: 'City-Stunt-Roller',
    icon: '🛴',
    speedTown: 7.9,
    speedHome: 5.3,
    seatOffsetY: -8,
    seatOffsetX: -2,
    charPose: 'idle',
    charScale: 0.84,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#06b6d4',
    colorB: '#0f172a',
    variant: 'scooter'
  },
  bike: {
    id: 'bike',
    kind: 'vehicle',
    name: 'City-Fahrrad',
    icon: '🚲',
    speedTown: 8.7,
    speedHome: 5.6,
    seatOffsetY: -18,
    seatOffsetX: -4,
    charPose: 'sit',
    charScale: 0.80,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#10b981',
    colorB: '#065f46',
    variant: 'bike'
  },
  roadbike: {
    id: 'roadbike',
    kind: 'vehicle',
    name: 'Turbo-Rennrad',
    icon: '🚴',
    speedTown: 9.6,
    speedHome: 5.8,
    seatOffsetY: -19,
    seatOffsetX: -3,
    charPose: 'sit',
    charScale: 0.80,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#f97316',
    colorB: '#1e293b',
    variant: 'bike'
  },
  escooter: {
    id: 'escooter',
    kind: 'vehicle',
    name: 'Elektro-Roller',
    icon: '⚡',
    speedTown: 9.4,
    speedHome: 5.7,
    seatOffsetY: -9,
    seatOffsetX: -2,
    charPose: 'idle',
    charScale: 0.84,
    allowRoad: false,
    allowInGarden: true,
    colorA: '#3b82f6',
    colorB: '#38bdf8',
    variant: 'escooter'
  },
  moped: {
    id: 'moped',
    kind: 'vehicle',
    name: 'Stadt-Moped',
    icon: '🛵',
    speedTown: 10.6,
    speedHome: 5.2,
    seatOffsetY: -18,
    seatOffsetX: -4,
    charPose: 'sit',
    charScale: 0.80,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#38bdf8',
    colorB: '#ffffff',
    variant: 'moped'
  },
  quad: {
    id: 'quad',
    kind: 'vehicle',
    name: 'Abenteuer-Quad',
    icon: '🛺',
    speedTown: 11.4,
    speedHome: 5.5,
    seatOffsetY: -18,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.80,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#16a34a',
    colorB: '#facc15',
    variant: 'quad'
  },
  motorcycle: {
    id: 'motorcycle',
    kind: 'vehicle',
    name: 'Sport-Motorrad',
    icon: '🏍️',
    speedTown: 12.2,
    speedHome: 5.2,
    seatOffsetY: -19,
    seatOffsetX: -3,
    charPose: 'sit',
    charScale: 0.80,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#ef4444',
    colorB: '#1e293b',
    variant: 'motorcycle'
  },
  compact_car: {
    id: 'compact_car',
    kind: 'vehicle',
    name: 'City-Kleinwagen',
    icon: '🚗',
    speedTown: 13.2,
    speedHome: 5.2,
    seatOffsetY: -16,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.74,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#ec4899',
    colorB: '#fdf2f8',
    variant: 'car'
  },
  convertible: {
    id: 'convertible',
    kind: 'vehicle',
    name: 'Sommer-Cabrio',
    icon: '🚘',
    speedTown: 13.8,
    speedHome: 5.2,
    seatOffsetY: -16,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.76,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#0ea5e9',
    colorB: '#fef08a',
    variant: 'convertible'
  },
  suv: {
    id: 'suv',
    kind: 'vehicle',
    name: 'Abenteuer-SUV',
    icon: '🚙',
    speedTown: 14.0,
    speedHome: 5.2,
    seatOffsetY: -19,
    seatOffsetX: -2,
    charPose: 'sit',
    charScale: 0.74,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#6366f1',
    colorB: '#e0e7ff',
    variant: 'suv'
  },
  camper: {
    id: 'camper',
    kind: 'vehicle',
    name: 'Traum-Camper',
    icon: '🚐',
    speedTown: 12.8,
    speedHome: 5.2,
    seatOffsetY: -18,
    seatOffsetX: 4,
    charPose: 'sit',
    charScale: 0.72,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#f59e0b',
    colorB: '#fffbeb',
    variant: 'camper'
  },
  sportscar: {
    id: 'sportscar',
    kind: 'vehicle',
    name: 'Traum-Sportwagen',
    icon: '🏎️',
    speedTown: 15.4,
    speedHome: 5.2,
    seatOffsetY: -14,
    seatOffsetX: -4,
    charPose: 'sit',
    charScale: 0.74,
    allowRoad: true,
    allowInGarden: false,
    colorA: '#e11d48',
    colorB: '#fbbf24',
    variant: 'sportscar'
  }
};

export function getTransportMeta(transport) {
  if (!transport || !transport.id) return null;
  if (transport.kind === 'mount') return MOUNT_META[transport.id] || null;
  if (transport.kind === 'vehicle') return VEHICLE_META[transport.id] || null;
  return MOUNT_META[transport.id] || VEHICLE_META[transport.id] || null;
}

export function drawMountVector(ctx, mountId, x, y, animFrame = 0, isMoving = false, facing = 1, scale = 1) {
  const m = MOUNT_META[mountId] || MOUNT_META.pony;
  const speed = isMoving ? 0.28 : 0.05;
  const strideA = isMoving ? Math.sin(animFrame * speed) * 8 : 0;
  const strideB = isMoving ? Math.sin(animFrame * speed + Math.PI) * 8 : 0;
  const bob = isMoving ? Math.abs(Math.sin(animFrame * speed)) * -2.8 : Math.sin(animFrame * 0.06) * 0.8;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);

  // Ground shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 6, 28, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bob);

  const isPony = m.variant === 'pony' || m.variant === 'donkey';
  const isAlpaca = m.variant === 'alpaca';
  const isDeer = m.variant === 'deer';
  const isCamel = m.variant === 'camel';
  const hasWings = m.variant === 'pegasus';
  const hasHorn = m.variant === 'unicorn';

  const legLen = isPony ? 18 : 22;
  const bodyW = isPony ? 40 : 48;
  const bodyH = isAlpaca ? 24 : 21;
  const bodyY = -legLen - bodyH / 2 + 2;

  // Back legs
  ctx.fillStyle = m.maneColor;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.roundRect(-bodyW * 0.34 + strideB * 0.6, -legLen, 6.5, legLen + 2, [3]);
  ctx.roundRect(bodyW * 0.22 + strideA * 0.6, -legLen, 6.5, legLen + 2, [3]);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Tail
  ctx.fillStyle = m.maneColor;
  ctx.beginPath();
  const tailWave = Math.sin(animFrame * (isMoving ? 0.24 : 0.08)) * 4;
  ctx.moveTo(-bodyW / 2 + 2, bodyY);
  ctx.quadraticCurveTo(-bodyW / 2 - 14, bodyY + 4 + tailWave, -bodyW / 2 - 10, bodyY + 18);
  ctx.quadraticCurveTo(-bodyW / 2 - 3, bodyY + 10, -bodyW / 2 + 2, bodyY + 4);
  ctx.fill();

  // Body
  ctx.fillStyle = m.bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, bodyY, bodyW / 2, bodyH / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (isCamel) {
    ctx.fillStyle = m.bodyColor;
    ctx.beginPath();
    ctx.arc(-2, bodyY - bodyH / 2 + 2, 11, Math.PI, 0);
    ctx.fill();
  }

  // Front legs
  ctx.fillStyle = m.bodyColor;
  ctx.beginPath();
  ctx.roundRect(-bodyW * 0.28 + strideA * 0.7, -legLen, 7, legLen + 3, [3]);
  ctx.roundRect(bodyW * 0.28 + strideB * 0.7, -legLen, 7, legLen + 3, [3]);
  ctx.fill();
  // Hooves
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-bodyW * 0.28 + strideA * 0.7, -1, 7, 4);
  ctx.fillRect(bodyW * 0.28 + strideB * 0.7, -1, 7, 4);

  // Saddle
  ctx.fillStyle = m.saddleColor;
  ctx.beginPath();
  ctx.roundRect(-12, bodyY - bodyH / 2 - 3, 22, 10, [6]);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-3, bodyY - bodyH / 2 + 3, 6, 7);

  // Neck & Head
  const neckX = bodyW * 0.34;
  const neckY = bodyY - 4;
  ctx.save();
  ctx.translate(neckX, neckY);
  ctx.rotate(-0.32);
  ctx.fillStyle = m.bodyColor;
  ctx.beginPath();
  ctx.roundRect(-7, -26, 14, 28, [7]);
  ctx.fill();

  // Mane
  if (!isDeer) {
    ctx.fillStyle = m.maneColor;
    ctx.beginPath();
    ctx.roundRect(-11, -24, 6, 22, [3]);
    ctx.fill();
  }

  // Head
  ctx.translate(4, -24);
  ctx.rotate(0.28);
  ctx.fillStyle = m.bodyColor;
  ctx.beginPath();
  ctx.ellipse(6, 0, isAlpaca ? 10 : 12, 8.5, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Muzzle
  ctx.fillStyle = m.bellyColor;
  ctx.beginPath();
  ctx.ellipse(14, 2, 5.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ear(s)
  ctx.fillStyle = m.bodyColor;
  ctx.beginPath();
  ctx.moveTo(-2, -6);
  ctx.lineTo(1, isPony ? -16 : -14);
  ctx.lineTo(5, -6);
  ctx.closePath();
  ctx.fill();

  // Antlers for Deer
  if (isDeer) {
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-4, -22);
    ctx.moveTo(-2, -16);
    ctx.lineTo(5, -21);
    ctx.moveTo(-3, -14);
    ctx.lineTo(-9, -18);
    ctx.stroke();
  }

  // Unicorn Horn
  if (hasHorn) {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(6, -7);
    ctx.lineTo(14, -21);
    ctx.lineTo(11, -5);
    ctx.closePath();
    ctx.fill();
  }

  // Cute eye
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(8, -2, 2.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(8.7, -2.7, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Wings for Pegasus / Unicorn sparkle
  if (hasWings) {
    const flap = Math.sin(animFrame * 0.16) * 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, bodyY - 4);
    ctx.quadraticCurveTo(-22, bodyY - 26 + flap, -28, bodyY - 6 + flap);
    ctx.quadraticCurveTo(-14, bodyY + 2, -4, bodyY - 4);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawWheel(ctx, wx, wy, r, spinAngle, rimColor = '#cbd5e1') {
  ctx.save();
  ctx.translate(wx, wy);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rimColor;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.56, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i++) {
    const a = spinAngle + (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52);
    ctx.lineTo(-Math.cos(a) * r * 0.52, -Math.sin(a) * r * 0.52);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawVehicleVector(ctx, vehicleId, x, y, animFrame = 0, isMoving = false, facing = 1, scale = 1, pass = 'full') {
  const v = VEHICLE_META[vehicleId] || VEHICLE_META.skateboard;
  const spin = isMoving ? animFrame * 0.35 : 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);

  if (pass !== 'foreground') {
    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.beginPath();
    const shadowRx = (v.variant === 'car' || v.variant === 'suv' || v.variant === 'sportscar' || v.variant === 'convertible' || v.variant === 'camper') ? 44 : 26;
    ctx.ellipse(0, 6, shadowRx, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (v.variant === 'skateboard' || v.variant === 'skates') {
    if (pass === 'foreground') { ctx.restore(); return; }
    drawWheel(ctx, -15, 2, 4.5, spin, '#fbbf24');
    drawWheel(ctx, 15, 2, 4.5, spin, '#fbbf24');
    ctx.fillStyle = v.colorA;
    ctx.beginPath();
    ctx.roundRect(-24, -6, 48, 6, [4]);
    ctx.fill();
    ctx.fillStyle = v.colorB;
    ctx.fillRect(-16, -6, 32, 2.5);
    ctx.restore();
    return;
  }

  if (v.variant === 'scooter' || v.variant === 'escooter') {
    if (pass === 'foreground') { ctx.restore(); return; }
    drawWheel(ctx, -16, 1, 5.5, spin, '#38bdf8');
    drawWheel(ctx, 18, 1, 5.5, spin, '#38bdf8');
    ctx.fillStyle = v.colorA;
    ctx.beginPath();
    ctx.roundRect(-20, -6, 38, 6, [3]);
    ctx.fill();
    // Steering post & handlebar
    ctx.strokeStyle = v.colorB;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(15, -4);
    ctx.lineTo(11, -38);
    ctx.lineTo(19, -38);
    ctx.stroke();
    if (v.variant === 'escooter') {
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(16, -34, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  if (v.variant === 'bike') {
    if (pass === 'foreground') { ctx.restore(); return; }
    drawWheel(ctx, -21, -2, 12, spin, '#e2e8f0');
    drawWheel(ctx, 21, -2, 12, spin, '#e2e8f0');
    ctx.strokeStyle = v.colorA;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-21, -2);
    ctx.lineTo(-4, -18);
    ctx.lineTo(14, -18);
    ctx.lineTo(21, -2);
    ctx.moveTo(-4, -18);
    ctx.lineTo(0, -2);
    ctx.lineTo(14, -18);
    ctx.stroke();
    // Seat & Handlebar
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-11, -23, 13, 4.5, [2]);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, -18);
    ctx.lineTo(16, -28);
    ctx.lineTo(21, -28);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (v.variant === 'moped' || v.variant === 'motorcycle' || v.variant === 'quad') {
    if (pass === 'foreground') { ctx.restore(); return; }
    const wheelR = v.variant === 'quad' ? 11 : 10.5;
    drawWheel(ctx, -22, -2, wheelR, spin, '#cbd5e1');
    drawWheel(ctx, 22, -2, wheelR, spin, '#cbd5e1');

    ctx.fillStyle = v.colorA;
    ctx.beginPath();
    if (v.variant === 'motorcycle') {
      ctx.roundRect(-24, -22, 48, 15, [8, 12, 6, 6]);
    } else if (v.variant === 'quad') {
      ctx.roundRect(-28, -22, 56, 15, [6]);
    } else {
      ctx.roundRect(-22, -20, 44, 15, [10, 8, 6, 6]);
    }
    ctx.fill();

    // Seat
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-16, -25, 22, 7, [4]);
    ctx.fill();

    // Front shield & headlight
    ctx.fillStyle = v.colorB;
    ctx.beginPath();
    ctx.roundRect(12, -31, 9, 18, [5]);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(23, -22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Cars: compact_car, convertible, suv, sportscar, camper
  const isSuv = v.variant === 'suv' || v.variant === 'camper';
  const isSports = v.variant === 'sportscar';
  const isConvertible = v.variant === 'convertible';
  const bodyW = isSports ? 96 : isSuv ? 94 : 88;
  const bodyH = isSports ? 22 : isSuv ? 28 : 25;
  const bodyY = -30;

  if (pass === 'back' || pass === 'full') {
    // Car interior back & seat
    if (!isConvertible) {
      ctx.fillStyle = v.colorA;
      ctx.beginPath();
      if (v.variant === 'camper') {
        ctx.roundRect(-bodyW / 2, bodyY - 22, bodyW - 6, 26, [12, 12, 0, 0]);
      } else {
        ctx.roundRect(-bodyW * 0.34, bodyY - 20, bodyW * 0.56, 22, [14, 14, 0, 0]);
      }
      ctx.fill();
      // Window pane
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(-bodyW * 0.28, bodyY - 16, bodyW * 0.44, 16, [8, 8, 0, 0]);
      ctx.fill();
    } else {
      // Windshield only on convertible
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(12, bodyY);
      ctx.lineTo(22, bodyY - 15);
      ctx.stroke();
    }
  }

  if (pass === 'foreground' || pass === 'full') {
    // Lower sleek car chassis (draws in front of seated legs!)
    ctx.fillStyle = v.colorA;
    ctx.beginPath();
    ctx.roundRect(-bodyW / 2, bodyY, bodyW, bodyH, [12, isSports ? 16 : 12, 8, 8]);
    ctx.fill();

    // Accent racing stripe or trim
    ctx.fillStyle = v.colorB;
    ctx.fillRect(-bodyW / 2 + 6, bodyY + 8, bodyW - 12, 4);

    // Sports spoiler
    if (isSports) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-bodyW / 2 + 2, bodyY - 9, 4, 9);
      ctx.fillRect(-bodyW / 2 - 4, bodyY - 11, 14, 4);
    }

    // Headlight & taillight
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(bodyW / 2 - 4, bodyY + 10, 4.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(-bodyW / 2 + 3, bodyY + 10, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    drawWheel(ctx, -bodyW * 0.30, -3, isSuv ? 12 : 11, spin, '#e2e8f0');
    drawWheel(ctx, bodyW * 0.30, -3, isSuv ? 12 : 11, spin, '#e2e8f0');
  }

  ctx.restore();
}

export function drawPlayerWithTransport(ctx, x, y, animFrame, isMoving, facing, charConfig, playerPose, isSick, activeTransport, baseScale = 0.84) {
  const meta = getTransportMeta(activeTransport);
  if (!meta) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(baseScale, baseScale);
    renderCharacter(ctx, 0, 0, charConfig, {
      frame: animFrame,
      pose: playerPose,
      facing,
      isSick
    });
    ctx.restore();
    return;
  }

  if (meta.kind === 'mount') {
    drawMountVector(ctx, meta.id, x, y, animFrame, isMoving, facing, 1.0);
    const bounce = isMoving ? Math.abs(Math.sin(animFrame * 0.28)) * -2.8 : Math.sin(animFrame * 0.06) * 0.8;
    ctx.save();
    ctx.translate(x + meta.seatOffsetX * facing, y + meta.seatOffsetY + bounce);
    ctx.scale(meta.charScale, meta.charScale);
    renderCharacter(ctx, 0, 0, charConfig, {
      frame: animFrame,
      pose: meta.charPose,
      facing,
      isSick
    });
    ctx.restore();
    return;
  }

  // Vehicle
  const isEnclosed = meta.variant === 'car' || meta.variant === 'suv' || meta.variant === 'sportscar' || meta.variant === 'convertible' || meta.variant === 'camper';
  if (isEnclosed) {
    drawVehicleVector(ctx, meta.id, x, y, animFrame, isMoving, facing, 1.0, 'back');
    ctx.save();
    ctx.translate(x + meta.seatOffsetX * facing, y + meta.seatOffsetY);
    ctx.scale(meta.charScale, meta.charScale);
    renderCharacter(ctx, 0, 0, charConfig, {
      frame: animFrame,
      pose: 'sit',
      facing,
      isSick
    });
    ctx.restore();
    drawVehicleVector(ctx, meta.id, x, y, animFrame, isMoving, facing, 1.0, 'foreground');
  } else {
    drawVehicleVector(ctx, meta.id, x, y, animFrame, isMoving, facing, 1.0, 'full');
    ctx.save();
    ctx.translate(x + meta.seatOffsetX * facing, y + meta.seatOffsetY);
    ctx.scale(meta.charScale, meta.charScale);
    renderCharacter(ctx, 0, 0, charConfig, {
      frame: animFrame,
      pose: isMoving && meta.variant === 'skates' ? 'walk' : meta.charPose,
      facing,
      isSick
    });
    ctx.restore();
  }
}
