import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';

export const ICE_FLAVORS = [
  { id: 'erdbeere', name: 'Erdbeere', short: 'Erdbeere', color: '#f43f5e', light: '#fda4af', dark: '#be123c' },
  { id: 'schoko', name: 'Schoko', short: 'Schoko', color: '#78350f', light: '#b45309', dark: '#451a03' },
  { id: 'vanille', name: 'Vanille', short: 'Vanille', color: '#fde047', light: '#fef9c3', dark: '#ca8a04' },
  { id: 'pistazie', name: 'Pistazie', short: 'Pistazie', color: '#34d399', light: '#a7f3d0', dark: '#047857' },
  { id: 'blaubeere', name: 'Blaubeere', short: 'Blaubeere', color: '#6366f1', light: '#c7d2fe', dark: '#3730a3' },
  { id: 'mango', name: 'Mango', short: 'Mango', color: '#fb923c', light: '#fed7aa', dark: '#c2410c' }
];

const FLAVOR_BY_ID = Object.fromEntries(ICE_FLAVORS.map((f) => [f.id, f]));

const TUB_X = [98, 214, 330, 446, 562, 678];
const SEAT_X = [108, 294, 480, 666];
const TRASH_X = 768;

const CUSTOMER_PRESETS = [
  { skin: '#ffdecb', hair: '#78350f', shirt: '#ec4899', hairStyle: 'bob', name: 'Mia' },
  { skin: '#f5c6a5', hair: '#1e1b4b', shirt: '#0ea5e9', hairStyle: 'short', name: 'Leo' },
  { skin: '#d99b72', hair: '#3b1c0a', shirt: '#a855f7', hairStyle: 'ponytail', name: 'Lina' },
  { skin: '#ffe4d6', hair: '#d97706', shirt: '#10b981', hairStyle: 'curly', name: 'Finn' },
  { skin: '#c6865c', hair: '#1f2937', shirt: '#f43f5e', hairStyle: 'bob', name: 'Amira' },
  { skin: '#ffdecb', hair: '#db2777', shirt: '#6366f1', hairStyle: 'ponytail', name: 'Sofie' }
];

function ordersMatch(heldScoops, orderScoops) {
  if (heldScoops.length !== orderScoops.length || heldScoops.length === 0) return false;
  const a = [...heldScoops].sort();
  const b = [...orderScoops].sort();
  return a.every((val, i) => val === b[i]);
}

function getNearbyTubIndex(playerX) {
  let best = -1;
  let bestDist = 42;
  TUB_X.forEach((tx, idx) => {
    const d = Math.abs(playerX - tx);
    if (d < bestDist) {
      bestDist = d;
      best = idx;
    }
  });
  return best;
}

function getNearbySeatIndex(playerX) {
  let best = -1;
  let bestDist = 66;
  SEAT_X.forEach((sx, idx) => {
    const d = Math.abs(playerX - sx);
    if (d < bestDist) {
      bestDist = d;
      best = idx;
    }
  });
  return best;
}

export function setupIceCreamScreen(stateManager) {
  const canvas = document.getElementById('iceCreamCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsValEl = document.getElementById('iceCoinsVal');
  const levelValEl = document.getElementById('iceLevelVal');
  const servedValEl = document.getElementById('iceServedVal');
  const shiftEarningsEl = document.getElementById('iceShiftEarningsVal');
  const toastEl = document.getElementById('iceToast');
  const coneSlotsEl = document.getElementById('iceConeSlots');
  const statusTextEl = document.getElementById('iceStatusText');
  const flavorBarEl = document.getElementById('iceFlavorBar');
  const clearConeBtn = document.getElementById('iceClearConeBtn');

  const walkLeftBtn = document.getElementById('iceWalkLeftBtn');
  const walkRightBtn = document.getElementById('iceWalkRightBtn');
  const actionBtn = document.getElementById('iceActionBtn');

  const toEditorBtn = document.getElementById('iceToEditorBtn');
  const toHomeBtn = document.getElementById('iceToHomeBtn');

  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;
  let servedCount = parseInt(localStorage.getItem('runner_ice_served') || '0', 10) || 0;
  let shiftCoins = 0;
  let streak = 0;

  // Player state behind the counter
  const player = {
    x: 380,
    facing: 1,
    targetX: null,
    pendingAction: null, // { type: 'scoop', flavorIdx } | { type: 'serve', seatIdx } | { type: 'trash' }
    pose: 'idle',
    poseTimer: 0
  };

  const keys = { left: false, right: false };
  const holdPad = { left: false, right: false };

  // Held ice cream cone (up to 3 scoops)
  let heldScoops = [];

  // 4 counter seats in front of the counter
  const seats = [null, null, null, null];
  const seatTimers = [20, 60, 100, 180];
  const fxParticles = [];

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2800);
  }

  function setStatus(msg) {
    if (statusTextEl) statusTextEl.textContent = msg;
  }

  function spawnFX(kind, x, y, count = 10) {
    const colors = kind === 'heart'
      ? ['#f43f5e', '#fb7185', '#fbcfe8']
      : kind === 'coin'
        ? ['#fde047', '#fbbf24', '#f59e0b']
        : ['#67e8f9', '#f472b6', '#fde047', '#ffffff'];

    for (let i = 0; i < count; i++) {
      fxParticles.push({
        kind,
        color: colors[i % colors.length],
        x: x + (Math.random() - 0.5) * 44,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -1.3 - Math.random() * 1.9,
        size: 4 + Math.random() * 4,
        life: 52
      });
    }
  }

  function createCustomer(seatIdx) {
    const preset = CUSTOMER_PRESETS[Math.floor(Math.random() * CUSTOMER_PRESETS.length)];
    const scoopCount = Math.random() < 0.25 ? 1 : Math.random() < 0.72 ? 2 : 3;
    const order = [];
    for (let i = 0; i < scoopCount; i++) {
      const f = ICE_FLAVORS[Math.floor(Math.random() * ICE_FLAVORS.length)];
      order.push(f.id);
    }
    return {
      seatIdx,
      preset,
      order,
      patience: 100, // gentle tip gauge
      state: 'entering', // 'entering' | 'waiting' | 'happy_leaving'
      yOffset: 65,
      happyTimer: 0,
      servedCone: null
    };
  }

  function initShift() {
    heldScoops = [];
    shiftCoins = 0;
    streak = 0;
    player.x = 380;
    player.targetX = null;
    player.pendingAction = null;
    player.pose = 'idle';
    player.poseTimer = 0;

    for (let i = 0; i < 4; i++) {
      seats[i] = i < 3 ? createCustomer(i) : null;
      if (seats[i]) {
        seats[i].state = 'waiting';
        seats[i].yOffset = 0;
      }
      seatTimers[i] = i === 3 ? 110 : 0;
    }

    updateHUD();
    setStatus('Klicke auf eine Eissorte hinter dir (oder laufe hin) und bring das fertige Eis an den passenden Platz!');
  }

  function updateHUD() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (servedValEl) servedValEl.textContent = servedCount;
    if (shiftEarningsEl) shiftEarningsEl.textContent = shiftCoins;

    if (coneSlotsEl) {
      if (heldScoops.length === 0) {
        coneSlotsEl.innerHTML = '<span class="cone-empty-hint">Noch leer – hole Eiskugeln hinter der Theke!</span>';
      } else {
        coneSlotsEl.innerHTML = heldScoops.map((id) => {
          const fl = FLAVOR_BY_ID[id];
          return `<span class="cone-scoop-chip" style="--scoop:${fl.color};--scoop-light:${fl.light};">${fl.short}</span>`;
        }).join('');
      }
    }
  }

  function renderFlavorButtons() {
    if (!flavorBarEl) return;
    flavorBarEl.innerHTML = '';
    ICE_FLAVORS.forEach((fl, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ice-flavor-btn';
      btn.innerHTML = `<span class="ice-swatch" style="background:radial-gradient(circle at 30% 30%, ${fl.light}, ${fl.color});"></span><span>${idx + 1}. ${fl.name}</span>`;
      btn.addEventListener('click', () => {
        walkToAndExecute(TUB_X[idx], { type: 'scoop', flavorIdx: idx });
      });
      flavorBarEl.appendChild(btn);
    });
  }

  function walkToAndExecute(targetX, pendingAction) {
    player.targetX = Math.max(70, Math.min(770, targetX));
    player.pendingAction = pendingAction;
  }

  function scoopFlavor(flavorIdx) {
    const fl = ICE_FLAVORS[flavorIdx];
    if (!fl) return;
    if (heldScoops.length >= 3) {
      showToast('🍦 Maximal 3 Kugeln pro Eistüte! Bringe sie an einen Platz oder leere die Tüte.', 'warn');
      return;
    }
    heldScoops.push(fl.id);
    player.pose = 'cook';
    player.poseTimer = 20;
    spawnFX('sparkle', player.x + player.facing * 18, 178, 6);
    updateHUD();

    const readySeat = seats.findIndex((c) => c && c.state === 'waiting' && ordersMatch(heldScoops, c.order));
    if (readySeat !== -1) {
      setStatus(`✨ Perfekt! Platz ${readySeat + 1} (${seats[readySeat].preset.name}) möchte genau dieses Eis – bring es an den Platz!`);
    } else {
      setStatus(`🍦 ${fl.name} geholt (${heldScoops.length}/3 Kugeln). Klicke auf die nächste Sorte oder bring das Eis zum Gast!`);
    }
  }

  function serveSeat(seatIdx) {
    const customer = seats[seatIdx];
    if (!customer || customer.state !== 'waiting') {
      showToast('An diesem Platz steht gerade kein wartender Gast!', 'info');
      return;
    }
    if (heldScoops.length === 0) {
      showToast('🍦 Deine Eistüte ist noch leer! Hole zuerst die gewünschten Eissorten hinter der Theke.', 'warn');
      return;
    }

    if (!ordersMatch(heldScoops, customer.order)) {
      const wantedNames = customer.order.map((id) => FLAVOR_BY_ID[id].short).join(' + ');
      showToast(`❌ ${customer.preset.name} an Platz ${seatIdx + 1} möchte: ${wantedNames}!`, 'warn');
      return;
    }

    // Success!
    const scoopBonus = customer.order.length * 6;
    const tipBonus = customer.patience >= 55 ? 6 : customer.patience >= 25 ? 3 : 0;
    streak += 1;
    const streakBonus = streak >= 3 ? 4 : 0;
    const totalEarned = 10 + scoopBonus + tipBonus + streakBonus;

    customer.state = 'happy_leaving';
    customer.happyTimer = 75;
    customer.servedCone = [...heldScoops];
    heldScoops = [];
    player.pose = 'pet';
    player.poseTimer = 28;

    servedCount += 1;
    localStorage.setItem('runner_ice_served', String(servedCount));
    shiftCoins += totalEarned;

    ShopManager.addCoins(totalEarned);
    ShopManager.recordProgress(0, totalEarned);
    EarnMoneyManager.recordEvent({ icecream: 1, care: 1 });
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    spawnFX('heart', SEAT_X[seatIdx], 265, 9);
    spawnFX('coin', SEAT_X[seatIdx], 245, 7);
    updateHUD();

    const tipText = tipBonus > 0 ? ` (inkl. +${tipBonus} 🪙 Trinkgeld!)` : '';
    showToast(`🍨 ${customer.preset.name} freut sich riesig! +${totalEarned} 🪙 verdient${tipText}`, 'success');
    setStatus(`Super serviert! Hole die nächsten Eissorten für deine wartenden Gäste.`);
  }

  function clearHeldCone() {
    if (heldScoops.length === 0) return;
    heldScoops = [];
    player.pose = 'idle';
    updateHUD();
    setStatus('🗑️ Eistüte geleert – stelle eine neue Bestellung zusammen!');
  }

  function handleCanvasClick(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    // 1. Clicked on one of the 6 flavor tubs behind the counter?
    if (cy >= 55 && cy <= 165) {
      for (let i = 0; i < TUB_X.length; i++) {
        if (Math.abs(cx - TUB_X[i]) <= 50) {
          walkToAndExecute(TUB_X[i], { type: 'scoop', flavorIdx: i });
          return;
        }
      }
      if (Math.abs(cx - TRASH_X) <= 40) {
        walkToAndExecute(TRASH_X, { type: 'trash' });
        return;
      }
    }

    // 2. Clicked on a counter seat, customer, or speech bubble in front of the counter?
    if (cy >= 195 && cy <= 430) {
      let bestSeat = -1;
      let bestDist = 92;
      for (let i = 0; i < SEAT_X.length; i++) {
        // Account for speech bubble extending to the right of SEAT_X[i]
        const centerZone = SEAT_X[i] + 35;
        const d = Math.abs(cx - centerZone);
        if (d < bestDist && seats[i] && seats[i].state === 'waiting') {
          bestDist = d;
          bestSeat = i;
        }
      }
      if (bestSeat !== -1 && cy >= 210) {
        walkToAndExecute(SEAT_X[bestSeat], { type: 'serve', seatIdx: bestSeat });
        return;
      }
    }

    // 3. Otherwise walk to that X position behind the counter
    walkToAndExecute(cx, null);
  }

  function triggerNearbyAction() {
    // Check if near a tub or seat
    const nearSeat = getNearbySeatIndex(player.x);
    if (nearSeat !== -1 && heldScoops.length > 0 && seats[nearSeat] && seats[nearSeat].state === 'waiting') {
      serveSeat(nearSeat);
      return;
    }
    const nearTub = getNearbyTubIndex(player.x);
    if (nearTub !== -1) {
      scoopFlavor(nearTub);
      return;
    }
    if (Math.abs(player.x - TRASH_X) < 42) {
      clearHeldCone();
    }
  }

  // Input listeners
  if (canvas) {
    canvas.addEventListener('click', (e) => handleCanvasClick(e.clientX, e.clientY));
  }

  if (clearConeBtn) {
    clearConeBtn.addEventListener('click', clearHeldCone);
  }

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.targetX = null;
      player.pendingAction = null;
    };
    const off = () => {
      holdPad[dir] = false;
    };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('pointercancel', off);
  };
  bindHold(walkLeftBtn, 'left');
  bindHold(walkRightBtn, 'right');

  if (actionBtn) {
    actionBtn.addEventListener('click', triggerNearbyAction);
  }

  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'ICECREAM') return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.targetX = null;
      player.pendingAction = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.targetX = null;
      player.pendingAction = null;
    } else if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
      e.preventDefault();
      triggerNearbyAction();
    } else if (e.key >= '1' && e.key <= '6') {
      const idx = parseInt(e.key, 10) - 1;
      walkToAndExecute(TUB_X[idx], { type: 'scoop', flavorIdx: idx });
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  });

  if (toEditorBtn) {
    toEditorBtn.addEventListener('click', () => stateManager.setState('EDITOR'));
  }
  if (toHomeBtn) {
    toHomeBtn.addEventListener('click', () => stateManager.setState('HOME'));
  }

  function updateSimulation() {
    // Player movement behind the counter
    let moveDir = 0;
    if (keys.left || holdPad.left) moveDir -= 1;
    if (keys.right || holdPad.right) moveDir += 1;

    const speed = 4.6;
    if (moveDir !== 0) {
      player.x = Math.max(66, Math.min(776, player.x + moveDir * speed));
      player.facing = moveDir;
      player.pose = 'walk';
    } else if (player.targetX !== null) {
      const dx = player.targetX - player.x;
      if (Math.abs(dx) <= speed + 1) {
        player.x = player.targetX;
        player.targetX = null;
        if (player.pendingAction) {
          const act = player.pendingAction;
          player.pendingAction = null;
          if (act.type === 'scoop') scoopFlavor(act.flavorIdx);
          else if (act.type === 'serve') serveSeat(act.seatIdx);
          else if (act.type === 'trash') clearHeldCone();
        }
      } else {
        player.facing = dx > 0 ? 1 : -1;
        player.x += Math.sign(dx) * speed;
        player.pose = 'walk';
      }
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
      if (player.poseTimer <= 0) player.pose = 'idle';
    } else {
      player.pose = 'idle';
    }

    // Update customers in front of the counter
    for (let i = 0; i < 4; i++) {
      const c = seats[i];
      if (!c) {
        seatTimers[i]--;
        if (seatTimers[i] <= 0) {
          seats[i] = createCustomer(i);
        }
        continue;
      }

      if (c.state === 'entering') {
        c.yOffset = Math.max(0, c.yOffset - 2.6);
        if (c.yOffset <= 0) c.state = 'waiting';
      } else if (c.state === 'waiting') {
        c.patience = Math.max(5, c.patience - 0.032);
      } else if (c.state === 'happy_leaving') {
        c.happyTimer--;
        if (c.happyTimer < 26) {
          c.yOffset += 2.8;
        }
        if (c.happyTimer <= 0) {
          seats[i] = null;
          seatTimers[i] = 70 + Math.floor(Math.random() * 65);
        }
      }
    }

    // Update FX particles
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) fxParticles.splice(i, 1);
    }
  }

  function drawIceConeGraphic(x, y, scoops, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Waffle cone
    const coneGrad = ctx.createLinearGradient(-9, 0, 9, 24);
    coneGrad.addColorStop(0, '#fcd34d');
    coneGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(9, 0);
    ctx.lineTo(0, 24);
    ctx.closePath();
    ctx.fill();

    // Subtle waffle grid lines
    ctx.strokeStyle = 'rgba(146, 64, 14, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-5, 4);
    ctx.lineTo(3, 14);
    ctx.moveTo(5, 4);
    ctx.lineTo(-3, 14);
    ctx.stroke();

    // Stacked scoops
    scoops.forEach((id, idx) => {
      const fl = FLAVOR_BY_ID[id];
      if (!fl) return;
      const sy = -6 - idx * 12;
      const sGrad = ctx.createRadialGradient(-3, sy - 4, 2, 0, sy, 11);
      sGrad.addColorStop(0, fl.light);
      sGrad.addColorStop(0.6, fl.color);
      sGrad.addColorStop(1, fl.dark);
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(0, sy, 10.5, 0, Math.PI * 2);
      ctx.fill();

      // Gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-3.5, sy - 4, 3.2, 2, -0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawCustomer(c) {
    const sx = SEAT_X[c.seatIdx];
    const feetY = 402 + c.yOffset + (c.state === 'happy_leaving' ? -Math.abs(Math.sin(animFrame * 0.25)) * 8 : 0);
    const bob = c.state === 'waiting' ? Math.sin(animFrame * 0.08 + c.seatIdx) * 1.6 : 0;

    ctx.save();
    ctx.translate(sx, feetY + bob);

    // Ground shadow
    ctx.fillStyle = 'rgba(88, 28, 135, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 2, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shoes & Legs
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(-12, -32, 9, 30, [4]);
    ctx.roundRect(3, -32, 9, 30, [4]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-14, -6, 12, 7, [3]);
    ctx.roundRect(2, -6, 12, 7, [3]);
    ctx.fill();

    // Sculpted Shirt / Jacket
    const shirtGrad = ctx.createLinearGradient(-16, -74, 16, -30);
    shirtGrad.addColorStop(0, c.preset.shirt);
    shirtGrad.addColorStop(1, '#3b0764');
    ctx.fillStyle = shirtGrad;
    ctx.beginPath();
    ctx.roundRect(-16, -74, 32, 46, [12, 12, 8, 8]);
    ctx.fill();

    // Soft shirt highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.roundRect(-12, -70, 9, 36, [6]);
    ctx.fill();

    // Arms (one raised happily when served)
    ctx.fillStyle = c.preset.skin;
    ctx.beginPath();
    ctx.roundRect(-22, -70, 7, 26, [4]);
    if (c.state === 'happy_leaving') {
      ctx.roundRect(15, -88, 7, 26, [4]);
    } else {
      ctx.roundRect(15, -70, 7, 26, [4]);
    }
    ctx.fill();

    // Head
    const headGrad = ctx.createRadialGradient(-4, -95, 2, 0, -92, 20);
    headGrad.addColorStop(0, '#fff4ed');
    headGrad.addColorStop(0.55, c.preset.skin);
    headGrad.addColorStop(1, '#d99b72');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -92, 15.5, 17.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blush & Eyes (facing toward counter / slight 3/4)
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-7, -87, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -87, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-5, -93, 2.4, 0, Math.PI * 2);
    ctx.arc(6, -93, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5.6, -93.8, 0.9, 0, Math.PI * 2);
    ctx.arc(5.4, -93.8, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (c.state === 'happy_leaving') {
      ctx.arc(0.5, -86, 5.2, 0.1, Math.PI - 0.1);
    } else {
      ctx.arc(0.5, -86, 3.8, 0.2, Math.PI - 0.2);
    }
    ctx.stroke();

    // Hair style
    ctx.fillStyle = c.preset.hair;
    if (c.preset.hairStyle === 'bob') {
      ctx.beginPath();
      ctx.arc(0, -98, 17, Math.PI * 0.92, Math.PI * 2.08);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-17, -98, 6, 22, [4]);
      ctx.roundRect(11, -98, 6, 22, [4]);
      ctx.fill();
    } else if (c.preset.hairStyle === 'ponytail') {
      ctx.beginPath();
      ctx.arc(16, -98, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -99, 16.5, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
    } else if (c.preset.hairStyle === 'curly') {
      for (let k = -12; k <= 12; k += 6) {
        ctx.beginPath();
        ctx.arc(k, -106 + Math.abs(k) * 0.2, 7.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, -99, 16, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
    }

    // If just served, customer holds the delivered ice cream cone!
    if (c.servedCone) {
      drawIceConeGraphic(22, -96, c.servedCone, 0.85);
    }

    ctx.restore();
  }

  function drawSpeechBubble(c) {
    if (c.state !== 'waiting') return;
    const sx = SEAT_X[c.seatIdx];
    const isMatch = ordersMatch(heldScoops, c.order);
    const bx = Math.min(672, sx + 26);
    const by = 270;
    const bw = 122;
    const bh = 88;

    ctx.save();
    ctx.shadowColor = isMatch ? 'rgba(16, 185, 129, 0.45)' : 'rgba(88, 28, 135, 0.18)';
    ctx.shadowBlur = isMatch ? 18 : 12;
    ctx.fillStyle = isMatch ? '#ecfdf5' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [18]);
    ctx.fill();

    // Pointer tail toward customer's mouth
    ctx.beginPath();
    ctx.moveTo(bx + 2, by + 32);
    ctx.lineTo(sx + 16, by + 44);
    ctx.lineTo(bx + 2, by + 50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = isMatch ? '#10b981' : 'rgba(236, 72, 153, 0.35)';
    ctx.lineWidth = isMatch ? 2.6 : 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [18]);
    ctx.stroke();

    // Visual cone inside speech bubble
    drawIceConeGraphic(bx + 25, by + 50, c.order, 0.85);

    // Flavor names list inside speech bubble
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    c.order.forEach((id, idx) => {
      const fl = FLAVOR_BY_ID[id];
      const ly = by + 20 + idx * 17;
      ctx.fillStyle = fl.color;
      ctx.beginPath();
      ctx.arc(bx + 50, ly, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#271333';
      ctx.fillText(fl.short, bx + 58, ly + 0.5);
    });

    // Patience / Tip bar at bottom of bubble
    const barW = bw - 20;
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 12, barW, 5, [3]);
    ctx.fill();
    ctx.fillStyle = c.patience >= 55 ? '#10b981' : c.patience >= 25 ? '#f59e0b' : '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 12, Math.max(4, (barW * c.patience) / 100), 5, [3]);
    ctx.fill();

    if (isMatch) {
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(bx + 24, by - 12, 74, 20, [10]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ SERVIEREN!', bx + 61, by - 2);
    }

    ctx.restore();
  }

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Parlor Back Wall & Pastel Wallpaper
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 210);
    wallGrad.addColorStop(0, '#fff1f2');
    wallGrad.addColorStop(0.55, '#fdf4ff');
    wallGrad.addColorStop(1, '#ecfeff');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, 215);

    // Pastel vertical wallpaper stripes
    ctx.fillStyle = 'rgba(251, 207, 232, 0.24)';
    for (let sx = 0; sx < w; sx += 44) {
      ctx.fillRect(sx, 36, 22, 174);
    }

    // Sunny arched parlor window in back center
    ctx.save();
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(350, 38, 120, 72, [60, 60, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Striped Ice Cream Awning across top
    const stripeW = 46;
    for (let i = 0; i * stripeW < w + stripeW; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#f43f8e' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(i * stripeW, 0, stripeW, 34, [0, 0, 14, 14]);
      ctx.fill();
    }
    // Sign badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 115, 6, 230, 28, [14]);
    ctx.fill();
    ctx.font = '800 14px "Outfit", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GELATERIA TRAUMHAUS', w / 2, 20);

    // 2. Back Gelato Freezer Shelf & 6 Flavor Tubs (y: 86..155)
    const shelfGrad = ctx.createLinearGradient(0, 108, 0, 165);
    shelfGrad.addColorStop(0, '#e0f2fe');
    shelfGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = shelfGrad;
    ctx.beginPath();
    ctx.roundRect(36, 108, 690, 52, [14]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.28)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const nearTub = getNearbyTubIndex(player.x);
    ICE_FLAVORS.forEach((fl, idx) => {
      const tx = TUB_X[idx];
      const isNear = nearTub === idx;

      ctx.save();
      if (isNear) {
        ctx.shadowColor = fl.color;
        ctx.shadowBlur = 16;
      }

      // Stainless freezer tray rim
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(tx - 40, 100, 80, 44, [10]);
      ctx.fill();

      // Creamy swirled gelato mound
      const scoopGrad = ctx.createRadialGradient(tx - 10, 112, 4, tx, 120, 36);
      scoopGrad.addColorStop(0, fl.light);
      scoopGrad.addColorStop(0.55, fl.color);
      scoopGrad.addColorStop(1, fl.dark);
      ctx.fillStyle = scoopGrad;
      ctx.beginPath();
      ctx.roundRect(tx - 35, 105, 70, 34, [8]);
      ctx.fill();

      // Creamy wave highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(tx - 12, 115, 14, 5, -0.15, 0, Math.PI * 2);
      ctx.ellipse(tx + 14, 121, 12, 4, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Flavor Name Tag
      ctx.fillStyle = isNear ? '#be185d' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(tx - 38, 76, 76, 20, [9]);
      ctx.fill();
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isNear ? '#ffffff' : '#271333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fl.short, tx, 86);
    });

    // Trash / Reset Cone Bin on right side behind counter
    const nearTrash = Math.abs(player.x - TRASH_X) < 42;
    ctx.save();
    ctx.fillStyle = nearTrash ? '#fda4af' : '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(TRASH_X - 20, 112, 40, 44, [8]);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEU', TRASH_X, 138);
    ctx.restore();

    // Work aisle floor behind the counter
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 160, w, 68);

    // 3. Player Standing BEHIND the Counter (drawn BEFORE counter front!)
    ctx.save();
    ctx.translate(player.x, 224);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    // Draw held ice cream cone in player's hand / beside player
    if (heldScoops.length > 0) {
      drawIceConeGraphic(player.x + player.facing * 26, 170, heldScoops, 1.05);
    }

    // 4. Serving Counter (`Die Theke`, y: 204..264) — overlaps player's lower legs!
    const topGrad = ctx.createLinearGradient(0, 204, 0, 222);
    topGrad.addColorStop(0, '#ffffff');
    topGrad.addColorStop(1, '#fce7f3');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.roundRect(24, 204, w - 48, 18, [8]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const frontGrad = ctx.createLinearGradient(0, 222, 0, 264);
    frontGrad.addColorStop(0, '#f472b6');
    frontGrad.addColorStop(1, '#db2777');
    ctx.fillStyle = frontGrad;
    ctx.beginPath();
    ctx.roundRect(30, 221, w - 60, 42, [0, 0, 12, 12]);
    ctx.fill();

    // Pastel counter stripes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let sx = 46; sx < w - 60; sx += 36) {
      ctx.fillRect(sx, 222, 14, 40);
    }

    // 4 Serving Tray Mats on top of the counter
    const nearSeat = getNearbySeatIndex(player.x);
    SEAT_X.forEach((sx, idx) => {
      const c = seats[idx];
      const matchReady = c && c.state === 'waiting' && ordersMatch(heldScoops, c.order);
      ctx.save();
      ctx.fillStyle = matchReady ? '#34d399' : nearSeat === idx ? '#fde047' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(sx - 26, 208, 52, 10, [5]);
      ctx.fill();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`Platz ${idx + 1}`, sx, 246);
      ctx.restore();
    });

    // 5. Guest Floor in Front of the Counter (y: 263..h)
    const guestFloor = ctx.createLinearGradient(0, 263, 0, h);
    guestFloor.addColorStop(0, '#fff5f7');
    guestFloor.addColorStop(1, '#f3e8ff');
    ctx.fillStyle = guestFloor;
    ctx.fillRect(0, 263, w, h - 263);

    // Subtle tile checkerboard perspective
    ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillRect(col * 84, 266 + row * 44, 84, 44);
        }
      }
    }

    // 6. Customers IN FRONT of the Counter + Their Speech Bubbles!
    seats.forEach((c) => {
      if (c) {
        drawCustomer(c);
        drawSpeechBubble(c);
      }
    });

    // 7. Sparkling FX particles
    fxParticles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 52);
      ctx.fillStyle = p.color;
      if (p.kind === 'heart') {
        ctx.beginPath();
        ctx.arc(p.x - 2, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.arc(p.x + 2, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.moveTo(p.x - p.size * 0.85, p.y + 1);
        ctx.lineTo(p.x, p.y + p.size * 1.1);
        ctx.lineTo(p.x + p.size * 0.85, p.y + 1);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    rafId = requestAnimationFrame(drawScene);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(drawScene);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('runner:coins-updated', () => {
    if (stateManager.getState() === 'ICECREAM') {
      updateHUD();
    }
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'ICECREAM') {
      initShift();
      renderFlavorButtons();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
