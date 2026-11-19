import { HomeManager, HOME_CATALOG } from './homeData.js';

export const PET_PALETTES = {
  dog: { body: '#d97706', ear: '#92400e', accent: '#fef3c7', collar: '#ec4899', say: 'Wuff! ❤️' },
  cat: { body: '#f472b6', ear: '#db2777', accent: '#fff1f2', collar: '#fde047', say: 'Miau! ❤️' },
  bunny: { body: '#ffffff', ear: '#fbcfe8', accent: '#f472b6', collar: '#10b981', say: 'Hoppel! 💕' },
  parrot: { body: '#10b981', ear: '#fbbf24', accent: '#38bdf8', collar: '#f43f5e', say: 'Piep! 🎵' },
  turtle: { body: '#059669', ear: '#34d399', accent: '#fbbf24', collar: '#f59e0b', say: 'Gemütlich! 🌿' },
  hamster: { body: '#fbbf24', ear: '#f59e0b', accent: '#ffffff', collar: '#ec4899', say: 'Knusper! ✨' },
  fox: { body: '#f97316', ear: '#9a3412', accent: '#ffffff', collar: '#38bdf8', say: 'Jip! 🦊' },
  unicorn: { body: '#ffffff', ear: '#f472b6', accent: '#fde047', collar: '#a855f7', say: 'Glitzer! ✨' },
  panda: { body: '#f8fafc', ear: '#1e293b', accent: '#cbd5e1', collar: '#10b981', say: 'Bambus! 🎋' },
  dragon: { body: '#10b981', ear: '#fbbf24', accent: '#6ee7b7', collar: '#f43f5e', say: 'Fauch! ✨' },
  phoenix: { body: '#f43f5e', ear: '#fbbf24', accent: '#fde047', collar: '#fbbf24', say: 'Funkel! 🌟' }
};

export function getPetMeta(petRef) {
  if (petRef && typeof petRef === 'object') {
    const species = petRef.species || 'dog';
    const pal = PET_PALETTES[species] || PET_PALETTES.dog;
    return {
      ...pal,
      ...petRef,
      id: petRef.id || species,
      species,
      name: petRef.name || 'Pflege-Hund',
      icon: petRef.icon || '🐕'
    };
  }
  if (typeof petRef === 'string' && petRef.startsWith('sit_')) {
    const sitting = HomeManager.getSittingCompanionById(petRef);
    if (sitting) return getPetMeta(sitting);
  }
  const petId = typeof petRef === 'string' ? petRef : 'dog';
  const catalog = HOME_CATALOG.pets.find((p) => p.id === petId);
  const pal = PET_PALETTES[petId] || PET_PALETTES.dog;
  return {
    id: petId,
    species: petId,
    name: catalog ? catalog.name : 'Tierchen',
    icon: catalog ? catalog.icon : '🐾',
    ...pal
  };
}

export function drawVectorPet(ctx, petRef, x, y, opts = {}) {
  const {
    frame = 0,
    facing = 1,
    scale = 1,
    isWalking = false,
    tapBounce = 0,
    badgeText = '',
    badgeColor = '#ec4899',
    speechText = ''
  } = opts;

  const meta = getPetMeta(petRef);
  const petId = meta.species || (typeof petRef === 'string' ? petRef : 'dog');
  const walkBob = isWalking
    ? Math.abs(Math.sin(frame * 0.28)) * 5.5
    : Math.sin(frame * 0.08) * 1.8;
  const bounceY = tapBounce > 0 ? Math.abs(Math.sin(tapBounce * 0.4)) * 14 : 0;
  const drawY = y - walkBob - bounceY;

  ctx.save();
  ctx.translate(x, drawY);

  // Soft ground shadow (stays near ground level)
  ctx.fillStyle = 'rgba(88, 28, 135, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 3 + walkBob + bounceY * 0.6, 15 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(facing * scale, scale);

  // Species wings (parrot / dragon / phoenix)
  if (petId === 'parrot' || petId === 'dragon' || petId === 'phoenix') {
    const flap = Math.sin(frame * 0.3) * 5;
    ctx.fillStyle = meta.accent;
    ctx.beginPath();
    ctx.ellipse(-2, -14 + flap * 0.35, 9, 5.5, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tail (bushy for fox, cute curl otherwise)
  ctx.strokeStyle = petId === 'fox' ? meta.body : meta.body;
  ctx.lineWidth = petId === 'fox' ? 6 : 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.quadraticCurveTo(-19, -18 + Math.sin(frame * 0.24) * 5, -16, -23);
  ctx.stroke();
  if (petId === 'fox') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-16, -23, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Turtle shell
  if (petId === 'turtle') {
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(0, -11, 13, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  // Body
  const bGrad = ctx.createRadialGradient(-3, -14, 2, 0, -10, 16);
  bGrad.addColorStop(0, meta.accent);
  bGrad.addColorStop(0.65, meta.body);
  bGrad.addColorStop(1, meta.ear);
  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.ellipse(0, -10, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  const stride = isWalking ? Math.sin(frame * 0.35) * 3 : 0;
  ctx.fillStyle = meta.body;
  ctx.beginPath();
  ctx.roundRect(-9 + stride, -5, 4.5, 7, [2]);
  ctx.roundRect(5 - stride, -5, 4.5, 7, [2]);
  ctx.fill();

  // Collar
  ctx.strokeStyle = meta.collar;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(6, -15);
  ctx.lineTo(12, -10);
  ctx.stroke();

  // Head
  ctx.fillStyle = meta.body;
  ctx.beginPath();
  ctx.arc(10, -18, 9, 0, Math.PI * 2);
  ctx.fill();

  // Panda eye patch
  if (petId === 'panda') {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(13.5, -19, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ears / Beak / Horn
  ctx.fillStyle = meta.ear;
  if (petId === 'bunny') {
    ctx.beginPath();
    ctx.ellipse(7.5, -32, 3, 9.5, -0.15, 0, Math.PI * 2);
    ctx.ellipse(12.5, -31, 3, 8.5, 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (petId === 'dog') {
    ctx.beginPath();
    ctx.ellipse(5, -17, 3.8, 7.5, 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (petId === 'panda' || petId === 'hamster') {
    ctx.beginPath();
    ctx.arc(5, -25, 4, 0, Math.PI * 2);
    ctx.arc(13, -25, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(4.5, -24);
    ctx.lineTo(7, -32);
    ctx.lineTo(12.5, -25);
    ctx.closePath();
    ctx.fill();
  }

  if (petId === 'unicorn') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(12, -25);
    ctx.lineTo(16, -37);
    ctx.lineTo(17.5, -24);
    ctx.closePath();
    ctx.fill();
  }

  if (petId === 'parrot' || petId === 'phoenix') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(18, -19);
    ctx.lineTo(24, -16);
    ctx.lineTo(18, -14);
    ctx.closePath();
    ctx.fill();
  }

  // Eye & Catchlight
  ctx.fillStyle = petId === 'panda' ? '#ffffff' : '#1e1b4b';
  ctx.beginPath();
  ctx.arc(14, -19, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(14.6, -19.7, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Optional tiny floating badge (e.g. "🎒 Mit" or "👆 Mitnehmen")
  if (badgeText) {
    ctx.save();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    const tw = ctx.measureText(badgeText).width + 14;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-tw / 2, -52 * scale, tw, 18, [9]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = badgeColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, 0, -43 * scale);
    ctx.restore();
  }

  // Optional happy speech reaction when tapped
  if (speechText) {
    ctx.save();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    const tw = Math.max(66, ctx.measureText(speechText).width + 16);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-tw / 2, -64 * scale, tw, 22, [11]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(speechText, 0, -53 * scale);
    ctx.restore();
  }

  ctx.restore();
}

export class PetFollowerController {
  constructor(opts = {}) {
    this.includeSitting = opts.includeSitting !== false;
    this.followers = [];
    this.hitboxes = [];
  }

  _getCompanionEntries() {
    const ownEntries = HomeManager.getCompanionPets().map((id) => ({
      id,
      petRef: id,
      isSitting: false
    }));
    if (!this.includeSitting) return ownEntries;
    const sitEntries = HomeManager.getSittingCompanions().map((sit) => ({
      id: sit.id,
      petRef: sit,
      isSitting: true
    }));
    return [...ownEntries, ...sitEntries];
  }

  reset(anchorX, anchorY) {
    const entries = this._getCompanionEntries();
    this.followers = entries.map((entry, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      return {
        id: entry.id,
        petRef: entry.petRef,
        isSitting: entry.isSitting,
        x: anchorX - (36 + row * 28),
        y: anchorY + (col === 0 ? 1 : -1) * (10 + (row % 2) * 8),
        facing: 1,
        isWalking: false,
        tapBounce: 0,
        speechTimer: 0,
        speechText: ''
      };
    });
  }

  update(anchorX, anchorY, facing = 1, bounds = null) {
    const entries = this._getCompanionEntries();
    const existingById = new Map(this.followers.map((f) => [f.id, f]));

    this.followers = entries.map((entry, idx) => {
      const prev = existingById.get(entry.id);
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const slotOffset = 36 + row * 28;
      const spreadY = (col === 0 ? 1 : -1) * (10 + (row % 2) * 8);
      const targetX = anchorX - facing * slotOffset;
      const targetY = anchorY + spreadY;

      const f = prev
        ? { ...prev, petRef: entry.petRef, isSitting: entry.isSitting }
        : {
            id: entry.id,
            petRef: entry.petRef,
            isSitting: entry.isSitting,
            x: targetX,
            y: targetY,
            facing,
            isWalking: false,
            tapBounce: 0,
            speechTimer: 0,
            speechText: ''
          };

      const clampedTargetX = bounds
        ? Math.max(bounds.minX, Math.min(bounds.maxX, targetX))
        : targetX;
      const clampedTargetY = bounds
        ? Math.max(bounds.minY, Math.min(bounds.maxY, targetY))
        : targetY;

      const dx = clampedTargetX - f.x;
      const dy = clampedTargetY - f.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        f.x += dx * 0.14;
        f.y += dy * 0.14;
        f.isWalking = dist > 7;
        if (Math.abs(dx) > 1.5) f.facing = dx > 0 ? 1 : -1;
      } else {
        f.isWalking = false;
        f.facing = facing;
      }

      if (f.tapBounce > 0) f.tapBounce--;
      if (f.speechTimer > 0) f.speechTimer--;

      return f;
    });
  }

  draw(ctx, animFrame, opts = {}) {
    const {
      scale = 0.94,
      showLeashes = false,
      anchorX = 0,
      anchorY = 0,
      facing = 1
    } = opts;

    this.hitboxes = [];

    this.followers.forEach((f, idx) => {
      const meta = getPetMeta(f.petRef);
      if (showLeashes || f.isSitting) {
        ctx.save();
        ctx.strokeStyle = meta.collar;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(anchorX + facing * 10, anchorY - 40);
        ctx.quadraticCurveTo(
          (anchorX + f.x) / 2,
          Math.max(anchorY, f.y) - 10,
          f.x + f.facing * 8,
          f.y - 12
        );
        ctx.stroke();
        ctx.restore();
      }

      drawVectorPet(ctx, f.petRef, f.x, f.y, {
        frame: animFrame + idx * 17,
        facing: f.facing,
        scale,
        isWalking: f.isWalking,
        tapBounce: f.tapBounce,
        badgeText: f.isSitting ? `🐾 ${meta.name}` : '',
        badgeColor: '#0284c7',
        speechText: f.speechTimer > 0 ? f.speechText : ''
      });

      this.hitboxes.push({
        id: f.id,
        petRef: f.petRef,
        isSitting: f.isSitting,
        x: f.x,
        y: f.y - 16,
        r: 36
      });
    });
  }

  handleTap(cx, cy) {
    for (let i = this.hitboxes.length - 1; i >= 0; i--) {
      const box = this.hitboxes[i];
      if (Math.hypot(cx - box.x, cy - box.y) <= box.r) {
        const follower = this.followers.find((f) => f.id === box.id);
        const meta = getPetMeta(box.petRef || box.id);
        if (follower) {
          follower.tapBounce = 24;
          follower.speechTimer = 95;
          follower.speechText = meta.say;
        }
        const res = HomeManager.cuddleCompanionPet(box.id);
        return {
          hit: true,
          petId: box.id,
          isSitting: box.isSitting,
          x: box.x,
          y: box.y,
          meta,
          ...res
        };
      }
    }
    return { hit: false };
  }
}
