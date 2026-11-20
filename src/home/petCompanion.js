import { HomeManager, HOME_CATALOG } from './homeData.js';
import { PetCommandStore } from '../social/socialData.js';

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
    speechText = '',
    command = 'follow',
    trickTimer = 0,
    isSick = false,
    isSleeping = false
  } = opts;

  const meta = getPetMeta(petRef);
  const petId = meta.species || (typeof petRef === 'string' ? petRef : 'dog');
  const isRestPose = command === 'rest' || isSleeping;
  const isSitPose = !isRestPose && (command === 'sit' || command === 'stay');
  const spinHop = trickTimer > 0 ? Math.abs(Math.sin(trickTimer * 0.28)) * 12 : 0;

  const walkBob = isWalking
    ? Math.abs(Math.sin(frame * 0.28)) * 5.5
    : isRestPose
      ? Math.sin(frame * 0.05) * 0.6
      : isSitPose
        ? Math.sin(frame * 0.07) * 0.8
        : Math.sin(frame * 0.08) * 1.8;
  const bounceY = tapBounce > 0 ? Math.abs(Math.sin(tapBounce * 0.35)) * 7 : 0;
  const restOffset = isRestPose ? 4 : isSitPose ? 1.5 : 0;
  const drawY = y - walkBob - bounceY - spinHop + restOffset;

  ctx.save();
  ctx.translate(x, drawY);

  // Soft ground shadow (stays near ground level)
  ctx.fillStyle = 'rgba(88, 28, 135, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 3 + walkBob + bounceY * 0.6 + spinHop * 0.8 - restOffset, 15 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(facing * scale, scale);
  if (trickTimer > 0) {
    ctx.rotate((1 - trickTimer / 28) * Math.PI * 2);
  } else if (isSitPose) {
    ctx.rotate(-0.18);
  } else if (isRestPose) {
    ctx.scale(1.08, 0.78);
  }

  // Species wings (parrot / dragon / phoenix)
  if (petId === 'parrot' || petId === 'dragon' || petId === 'phoenix') {
    const flap = isRestPose ? 0 : Math.sin(frame * 0.3) * 5;
    ctx.fillStyle = meta.accent;
    ctx.beginPath();
    ctx.ellipse(-2, -14 + flap * 0.35, 9, 5.5, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tail (bushy for fox, cute curl otherwise; wags faster when petted)
  const wagSpeed = tapBounce > 0 || trickTimer > 0 ? 0.55 : isRestPose ? 0.08 : 0.24;
  ctx.strokeStyle = meta.body;
  ctx.lineWidth = petId === 'fox' ? 6 : 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.quadraticCurveTo(-19, -18 + Math.sin(frame * wagSpeed) * (isRestPose ? 2 : 6), -16, -23);
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

  // Legs (tucked when resting or sitting)
  if (!isRestPose) {
    const stride = isWalking ? Math.sin(frame * 0.35) * 3 : 0;
    ctx.fillStyle = meta.body;
    ctx.beginPath();
    if (isSitPose) {
      ctx.roundRect(-10, -4, 6, 5, [2]);
      ctx.roundRect(5, -5, 4.5, 7, [2]);
    } else {
      ctx.roundRect(-9 + stride, -5, 4.5, 7, [2]);
      ctx.roundRect(5 - stride, -5, 4.5, 7, [2]);
    }
    ctx.fill();
  }

  // Collar
  ctx.strokeStyle = meta.collar;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(6, -15);
  ctx.lineTo(12, -10);
  ctx.stroke();

  // Head
  const headY = isRestPose ? -14 : -18;
  ctx.fillStyle = meta.body;
  ctx.beginPath();
  ctx.arc(10, headY, 9, 0, Math.PI * 2);
  ctx.fill();

  // Panda eye patch
  if (petId === 'panda') {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(13.5, headY - 1, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ears / Beak / Horn
  ctx.fillStyle = meta.ear;
  if (petId === 'bunny') {
    ctx.beginPath();
    ctx.ellipse(7.5, headY - 14, 3, 9.5, -0.15, 0, Math.PI * 2);
    ctx.ellipse(12.5, headY - 13, 3, 8.5, 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (petId === 'dog') {
    ctx.beginPath();
    ctx.ellipse(5, headY + 1, 3.8, 7.5, 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (petId === 'panda' || petId === 'hamster') {
    ctx.beginPath();
    ctx.arc(5, headY - 7, 4, 0, Math.PI * 2);
    ctx.arc(13, headY - 7, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(4.5, headY - 6);
    ctx.lineTo(7, headY - 14);
    ctx.lineTo(12.5, headY - 7);
    ctx.closePath();
    ctx.fill();
  }

  if (petId === 'unicorn') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(12, headY - 7);
    ctx.lineTo(16, headY - 19);
    ctx.lineTo(17.5, headY - 6);
    ctx.closePath();
    ctx.fill();
  }

  if (petId === 'parrot' || petId === 'phoenix') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(18, headY - 1);
    ctx.lineTo(24, headY + 2);
    ctx.lineTo(18, headY + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Eye (peaceful closed eyelid when resting, sleepy/feverish if sick, sparkling open eye otherwise)
  if (isRestPose) {
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(14, headY - 1, 2.2, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else {
    ctx.fillStyle = petId === 'panda' ? '#ffffff' : '#1e1b4b';
    ctx.beginPath();
    ctx.arc(14, headY - 1, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14.6, headY - 1.7, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fever blush + tiny thermometer if pet is sick
  if (isSick) {
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.beginPath();
    ctx.arc(13, headY + 2.8, 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(16, headY + 3.2);
    ctx.rotate(0.35);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(0, -1.2, 8, 2.4, [1]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(1, -0.6, 4.5, 1.2);
    ctx.restore();
  }

  ctx.restore();

  // Gentle Zzz indicator when sleeping
  if (isRestPose && !speechText) {
    const zFloat = Math.sin(frame * 0.08) * 2.5;
    ctx.save();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6366f1';
    ctx.textAlign = 'center';
    ctx.fillText('💤', 14 * scale, -30 * scale + zFloat);
    ctx.restore();
  }

  // Command status pill or custom badge
  const effectiveBadge = isSick
    ? '🤒 Braucht Pflege'
    : badgeText
      || (command === 'stay' ? '🐾 Bleibt' : command === 'sit' ? '🪑 Sitz' : isRestPose ? '💤 Schläft' : '');
  const effectiveColor = isSick ? '#e11d48' : badgeText ? badgeColor : '#0284c7';

  if (effectiveBadge && !speechText) {
    ctx.save();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    const tw = ctx.measureText(effectiveBadge).width + 14;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = effectiveColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-tw / 2, -52 * scale, tw, 18, [9]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = effectiveColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(effectiveBadge, 0, -43 * scale);
    ctx.restore();
  }

  // Happy speech / command reaction bubble
  if (speechText) {
    ctx.save();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    const tw = Math.max(72, ctx.measureText(speechText).width + 18);
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
    PetCommandStore.clearStayPositions();
    const entries = this._getCompanionEntries();
    this.followers = entries.map((entry, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const savedCmd = PetCommandStore.getCommand(entry.id);
      return {
        id: entry.id,
        petRef: entry.petRef,
        isSitting: entry.isSitting,
        x: anchorX - (36 + row * 28),
        y: anchorY + (col === 0 ? 1 : -1) * (10 + (row % 2) * 8),
        facing: 1,
        isWalking: false,
        tapBounce: 0,
        trickTimer: 0,
        fetchTimer: 0,
        speechTimer: 0,
        speechText: '',
        command: savedCmd.command || 'follow',
        stayX: null,
        stayY: null
      };
    });
  }

  issueCommand(targetIdOrAll, commandId, speechText = '', anchorPos = null) {
    const targets = targetIdOrAll === 'all'
      ? this.followers
      : this.followers.filter((f) => f.id === targetIdOrAll);

    targets.forEach((f) => {
      const meta = getPetMeta(f.petRef || f.id);
      if (commandId === 'spin') {
        f.trickTimer = 28;
        f.tapBounce = 22;
      } else if (commandId === 'fetch') {
        f.fetchTimer = 76;
        f.command = 'follow';
        PetCommandStore.setCommand(f.id, 'follow');
      } else if (commandId === 'praise') {
        f.tapBounce = 26;
      } else {
        f.command = commandId;
        if (commandId === 'stay') {
          f.stayX = f.x || anchorPos?.x || 200;
          f.stayY = f.y || anchorPos?.y || 260;
          PetCommandStore.setCommand(f.id, 'stay', f.stayX, f.stayY);
        } else {
          f.stayX = null;
          f.stayY = null;
          PetCommandStore.setCommand(f.id, commandId);
        }
      }
      f.speechText = speechText || meta.say;
      f.speechTimer = 115;
    });
    return targets.length;
  }

  setSpeech(targetIdOrAll, speechText, duration = 115) {
    const targets = targetIdOrAll === 'all'
      ? this.followers
      : this.followers.filter((f) => f.id === targetIdOrAll);
    targets.forEach((f) => {
      f.speechText = speechText;
      f.speechTimer = duration;
      f.tapBounce = 18;
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
      const savedCmd = PetCommandStore.getCommand(entry.id);

      const f = prev
        ? { ...prev, petRef: entry.petRef, isSitting: entry.isSitting }
        : {
            id: entry.id,
            petRef: entry.petRef,
            isSitting: entry.isSitting,
            x: anchorX - facing * slotOffset,
            y: anchorY + spreadY,
            facing,
            isWalking: false,
            tapBounce: 0,
            trickTimer: 0,
            fetchTimer: 0,
            speechTimer: 0,
            speechText: '',
            command: savedCmd.command || 'follow',
            stayX: savedCmd.stayX,
            stayY: savedCmd.stayY
          };

      let targetX = anchorX - facing * slotOffset;
      let targetY = anchorY + spreadY;

      if (f.fetchTimer > 0) {
        f.fetchTimer--;
        if (f.fetchTimer > 34) {
          targetX = anchorX + facing * (72 + idx * 14);
          targetY = anchorY + spreadY * 0.6;
        }
      } else if (f.command === 'stay') {
        if (f.stayX === null || f.stayY === null) {
          f.stayX = f.x;
          f.stayY = f.y;
        }
        targetX = f.stayX;
        targetY = f.stayY;
      }

      const clampedTargetX = bounds
        ? Math.max(bounds.minX, Math.min(bounds.maxX, targetX))
        : targetX;
      const clampedTargetY = bounds
        ? Math.max(bounds.minY, Math.min(bounds.maxY, targetY))
        : targetY;

      const dx = clampedTargetX - f.x;
      const dy = clampedTargetY - f.y;
      const dist = Math.hypot(dx, dy);

      if (f.command === 'stay') {
        if (dist > 4) {
          f.x += dx * 0.16;
          f.y += dy * 0.16;
        }
        f.isWalking = false;
        f.facing = anchorX >= f.x ? 1 : -1;
      } else if ((f.command === 'sit' || f.command === 'rest') && dist <= 56 && f.fetchTimer <= 0) {
        f.isWalking = false;
        f.facing = anchorX >= f.x ? 1 : -1;
      } else if (dist > 4) {
        const moveRate = f.fetchTimer > 0 ? 0.22 : 0.14;
        f.x += dx * moveRate;
        f.y += dy * moveRate;
        f.isWalking = dist > 7;
        if (Math.abs(dx) > 1.5) f.facing = dx > 0 ? 1 : -1;
      } else {
        f.isWalking = false;
        f.facing = facing;
      }

      if (f.tapBounce > 0) f.tapBounce--;
      if (f.trickTimer > 0) f.trickTimer--;
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
      facing = 1,
      sleepMode = false
    } = opts;

    const sickPets = HomeManager.getState().health?.sickPets || {};
    this.hitboxes = [];

    this.followers.forEach((f, idx) => {
      const meta = getPetMeta(f.petRef);
      const isSick = Boolean(sickPets[f.id]);
      const stayingFar = f.command === 'stay' && Math.hypot(anchorX - f.x, anchorY - f.y) > 95;
      if ((showLeashes || f.isSitting) && !stayingFar && f.fetchTimer <= 0) {
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
        isWalking: sleepMode ? false : f.isWalking,
        tapBounce: f.tapBounce,
        command: sleepMode ? 'rest' : (f.fetchTimer > 0 ? 'follow' : f.command),
        isSleeping: sleepMode,
        isSick,
        trickTimer: f.trickTimer,
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

