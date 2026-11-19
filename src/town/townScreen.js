import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';

const WORLD_WIDTH = 2240;
const GARDEN_LEFT_X = 280;
const GARDEN_RIGHT_X = 560;
const LEFT_GATE_X = 280;
const RIGHT_GATE_X = 560;

export const TOWN_PLACES = [
  {
    id: 'home',
    label: '🏡 Dein Haus',
    x: 155,
    y: 266,
    targetState: 'HOME',
    badge: 'Betreten',
    color: '#ec4899',
    desc: 'Geh in dein offenes Haus (keine Türen im Weg!)'
  },
  {
    id: 'garden',
    label: '🌳 Dein Garten',
    x: 420,
    y: 320,
    targetState: 'HOME_GARDEN',
    badge: 'Durchs Gartentor!',
    color: '#10b981',
    desc: 'Eingezäunter Garten mit Gartentor & Blick aufs ganze Haus'
  },
  {
    id: 'neighbors',
    label: '🐾 Nachbarn & Hunde',
    x: 840,
    y: 274,
    targetState: 'PETSITTING',
    badge: 'Hundesitting',
    color: '#8b5cf6',
    desc: 'Herr Weber, Oma Frieda & Frau Kaya warten vor ihren Häusern'
  },
  {
    id: 'cafe',
    label: '🍦 Café & Eisdiele',
    x: 1360,
    y: 268,
    targetState: 'ICECREAM',
    badge: 'Arbeiten',
    color: '#f43f5e',
    desc: 'Eis, Waffeln, warmes Essen & Getränke an Tische servieren'
  },
  {
    id: 'boutique',
    label: '🛍️ Style-Boutique',
    x: 1715,
    y: 268,
    targetState: 'EDITOR',
    badge: 'Shop & Outfit',
    color: '#0284c7',
    desc: 'Neue Haare, Outfits, Sticker & Fähigkeiten kaufen'
  },
  {
    id: 'stadium',
    label: '🏃 Renn-Stadion',
    x: 2045,
    y: 268,
    targetState: 'BACKGROUND_SELECT',
    badge: 'Rennen starten',
    color: '#f59e0b',
    desc: 'Starte dein Rennen durch Traumwelten & sammle Münzen'
  }
];

export function setupTownScreen(stateManager) {
  const canvas = document.getElementById('townCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsValEl = document.getElementById('townCoinsVal');
  const levelValEl = document.getElementById('townLevelVal');
  const statusEl = document.getElementById('townStatusText');
  const districtBarEl = document.getElementById('townDistrictBar');
  const enterPlaceBtn = document.getElementById('townEnterBtn');

  const walkLeftBtn = document.getElementById('townWalkLeftBtn');
  const walkRightBtn = document.getElementById('townWalkRightBtn');
  const walkUpBtn = document.getElementById('townWalkUpBtn');
  const walkDownBtn = document.getElementById('townWalkDownBtn');

  const toHomeBtn = document.getElementById('townToHomeBtn');
  const toEditorBtn = document.getElementById('townToEditorBtn');

  let rafId = null;
  let animFrame = 0;
  let cameraX = 0;
  let leftGateOpen = 0;  // 0..1 swing animation for Garden Gate
  let rightGateOpen = 0; // 0..1 swing animation for Neighbor Garden Gate

  const player = {
    x: 195,
    y: 282,
    facing: 1,
    waypoints: [],
    pendingPlace: null,
    pose: 'idle'
  };

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  function updateCoinsUI() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
  }

  function getNearestPlace(px, py) {
    let best = null;
    let bestDist = 135;
    TOWN_PLACES.forEach((p) => {
      const d = Math.hypot(px - p.x, py - p.y);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    });
    return best;
  }

  function enterPlace(place) {
    if (!place) return;
    if (place.targetState === 'HOME_GARDEN') {
      stateManager.setState('HOME', { room: 'garden' });
    } else if (place.targetState === 'HOME') {
      stateManager.setState('HOME', { room: 'living_room' });
    } else {
      stateManager.setState(place.targetState);
    }
  }

  // Routes character cleanly, ALWAYS passing through the Gartentor when entering/leaving the Garden!
  function navigateInTown(tx, ty, pendingPlace = null) {
    const clampedX = Math.max(48, Math.min(WORLD_WIDTH - 48, tx));
    const clampedY = Math.max(246, Math.min(430, ty));
    const startInGarden = player.x > GARDEN_LEFT_X + 6 && player.x < GARDEN_RIGHT_X - 6;
    const endInGarden = clampedX > GARDEN_LEFT_X + 6 && clampedX < GARDEN_RIGHT_X - 6;
    const waypoints = [];

    const gateY = 304;
    if (!startInGarden && endInGarden) {
      // Must go through left or right Gartentor!
      const gateX = player.x <= LEFT_GATE_X + 120 ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -24 : 24), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 28 : -28), y: gateY });
    } else if (startInGarden && !endInGarden) {
      const gateX = clampedX <= LEFT_GATE_X ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 26 : -26), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -28 : 28), y: gateY });
    } else if (player.x <= LEFT_GATE_X && clampedX >= RIGHT_GATE_X) {
      // Crossing past garden via the sidewalk in front of the fence (y = 264), no gate needed unless stepping inside!
      waypoints.push({ x: clampedX, y: Math.min(266, clampedY) });
    } else if (player.x >= RIGHT_GATE_X && clampedX <= LEFT_GATE_X) {
      waypoints.push({ x: clampedX, y: Math.min(266, clampedY) });
    }

    waypoints.push({ x: clampedX, y: clampedY });
    player.waypoints = waypoints;
    player.pendingPlace = pendingPlace;
  }

  function renderDistrictBar() {
    if (!districtBarEl) return;
    districtBarEl.innerHTML = '';
    TOWN_PLACES.forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ice-flavor-btn';
      btn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #ffffff, ${p.color});">${p.label.split(' ')[0]}</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">${p.label.replace(/^[^\s]+\s/, '')}</span>
          <span class="ice-item-price">${p.badge}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        navigateInTown(p.x, p.y, p);
        if (statusEl) statusEl.textContent = `🚶 Du läufst zu: ${p.label} – ${p.desc}`;
      });
      districtBarEl.appendChild(btn);
    });
  }

  if (enterPlaceBtn) {
    enterPlaceBtn.addEventListener('click', () => {
      const near = getNearestPlace(player.x, player.y);
      if (near) {
        enterPlace(near);
      } else if (statusEl) {
        statusEl.textContent = 'Lauf ein Stück näher an ein Haus, den Garten, das Café oder die Boutique heran!';
      }
    });
  }

  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const screenX = (e.clientX - rect.left) * scaleX;
      const worldX = screenX + cameraX;
      const worldY = (e.clientY - rect.top) * scaleY;

      // Clicked directly on one of the town landmarks?
      for (const p of TOWN_PLACES) {
        if (Math.abs(worldX - p.x) <= 96 && worldY >= 55 && worldY <= 360) {
          navigateInTown(p.x, p.y, p);
          return;
        }
      }

      navigateInTown(worldX, worldY, null);
    });
  }

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.waypoints = [];
      player.pendingPlace = null;
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
  bindHold(walkUpBtn, 'up');
  bindHold(walkDownBtn, 'down');

  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'TOWN') return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.waypoints = [];
      player.pendingPlace = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.waypoints = [];
      player.pendingPlace = null;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = true;
      player.waypoints = [];
      player.pendingPlace = null;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      keys.down = true;
      player.waypoints = [];
      player.pendingPlace = null;
    } else if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
      e.preventDefault();
      const near = getNearestPlace(player.x, player.y);
      if (near) enterPlace(near);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  if (toHomeBtn) toHomeBtn.addEventListener('click', () => stateManager.setState('HOME', { room: 'living_room' }));
  if (toEditorBtn) toEditorBtn.addEventListener('click', () => stateManager.setState('EDITOR'));

  function moveWithGardenFence(dx, dy) {
    const nextX = Math.max(42, Math.min(WORLD_WIDTH - 42, player.x + dx));
    const nextY = Math.max(242, Math.min(434, player.y + dy));

    // Only block the garden fence perimeter (y >= 278) EXCEPT at the two Gartentor openings (y: 284..332)!
    const atGatePassage = (y) => y >= 282 && y <= 336;
    const isFenceBlocked = (oldX, newX, y) => {
      if (y < 276) return false; // In front of garden along the town sidewalk
      // Crossing left fence wall (LEFT_GATE_X)
      if ((oldX <= LEFT_GATE_X && newX > LEFT_GATE_X) || (oldX >= LEFT_GATE_X && newX < LEFT_GATE_X)) {
        if (!atGatePassage(y)) return true;
      }
      // Crossing right fence wall (RIGHT_GATE_X)
      if ((oldX <= RIGHT_GATE_X && newX > RIGHT_GATE_X) || (oldX >= RIGHT_GATE_X && newX < RIGHT_GATE_X)) {
        if (!atGatePassage(y)) return true;
      }
      return false;
    };

    if (!isFenceBlocked(player.x, nextX, player.y)) {
      player.x = nextX;
    }
    player.y = nextY;
  }

  function updateSimulation() {
    let moveX = 0;
    let moveY = 0;
    if (keys.left || holdPad.left) moveX -= 1;
    if (keys.right || holdPad.right) moveX += 1;
    if (keys.up || holdPad.up) moveY -= 1;
    if (keys.down || holdPad.down) moveY += 1;

    const speed = 5.4;
    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY) || 1;
      moveWithGardenFence((moveX / len) * speed, (moveY / len) * speed);
      if (moveX !== 0) player.facing = Math.sign(moveX);
      player.pose = 'walk';
    } else if (player.waypoints.length > 0) {
      const wp = player.waypoints[0];
      const dx = wp.x - player.x;
      const dy = wp.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        player.x = wp.x;
        player.y = wp.y;
        player.waypoints.shift();
        if (player.waypoints.length === 0 && player.pendingPlace) {
          const dest = player.pendingPlace;
          player.pendingPlace = null;
          enterPlace(dest);
        }
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        player.x += (dx / dist) * speed;
        player.y += (dy / dist) * speed;
        player.pose = 'walk';
      }
    } else {
      player.pose = 'idle';
    }

    // Animate swinging Gartentor when player approaches either gate!
    const nearLeftGate = Math.abs(player.x - LEFT_GATE_X) < 58 && player.y >= 265;
    const nearRightGate = Math.abs(player.x - RIGHT_GATE_X) < 58 && player.y >= 265;
    leftGateOpen += ((nearLeftGate ? 1 : 0) - leftGateOpen) * 0.16;
    rightGateOpen += ((nearRightGate ? 1 : 0) - rightGateOpen) * 0.16;

    // Smooth camera follow across the 2240px town
    if (canvas) {
      const targetCam = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, player.x - canvas.width * 0.45));
      cameraX += (targetCam - cameraX) * 0.12;
    }

    // Update nearby landmark prompt button
    const near = getNearestPlace(player.x, player.y);
    if (enterPlaceBtn) {
      if (near) {
        enterPlaceBtn.disabled = false;
        enterPlaceBtn.textContent = `✨ ${near.label} (${near.badge})`;
      } else {
        enterPlaceBtn.disabled = true;
        enterPlaceBtn.textContent = '🚶 Lauf zu einem Ort in der Stadt';
      }
    }
  }

  function drawTownHouseBuilding(x, y, w, h, roofColor, wallColor, label, openArch = true) {
    ctx.save();
    // Walls
    ctx.fillStyle = wallColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y + 48, w, h - 48, [10]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pitched roof
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 14, y + 54);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w / 2 + 14, y + 54);
    ctx.closePath();
    ctx.fill();

    // Windows
    [x - w * 0.28, x + w * 0.15].forEach((wx) => {
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(wx, y + 76, 30, 30, [6]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Open entrance archway (no closed blocking door!)
    if (openArch) {
      const archG = ctx.createLinearGradient(0, y + 84, 0, y + h);
      archG.addColorStop(0, '#fdf2f8');
      archG.addColorStop(1, '#fbcfe8');
      ctx.fillStyle = archG;
      ctx.beginPath();
      ctx.roundRect(x - 20, y + 86, 40, h - 86, [18, 18, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Banner sign
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 84, y + h - 10, 168, 24, [12]);
    ctx.fill();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#271333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + h + 2);
    ctx.restore();
  }

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Sunny Sky Backdrop
    const sky = ctx.createLinearGradient(0, 0, 0, 225);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(0.65, '#bae6fd');
    sky.addColorStop(1, '#fef9c3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, 225);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Distant rolling hills
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.moveTo(0, 225);
    for (let hx = 0; hx <= WORLD_WIDTH; hx += 220) {
      ctx.quadraticCurveTo(hx + 110, 165, hx + 220, 225);
    }
    ctx.lineTo(WORLD_WIDTH, 225);
    ctx.closePath();
    ctx.fill();

    // Grass & Town Sidewalk
    const grass = ctx.createLinearGradient(0, 215, 0, h);
    grass.addColorStop(0, '#4ade80');
    grass.addColorStop(1, '#10b981');
    ctx.fillStyle = grass;
    ctx.fillRect(0, 215, WORLD_WIDTH, h - 215);

    // Wide Open Town Promenade Sidewalk (no doors blocking!)
    const walkGrad = ctx.createLinearGradient(0, 232, 0, 290);
    walkGrad.addColorStop(0, '#fef3c7');
    walkGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = walkGrad;
    ctx.fillRect(0, 234, WORLD_WIDTH, 54);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.16)';
    ctx.fillRect(0, 234, WORLD_WIDTH, 4);
    ctx.fillRect(0, 284, WORLD_WIDTH, 4);

    // --- ZONE 1: DEIN TRAUMHAUS (with 2nd floor / conservatory if built!) ---
    const hasUpper = HomeManager.hasItem('expansions', 'bedroom');
    const hasConserv = HomeManager.hasItem('expansions', 'conservatory');
    if (hasUpper) {
      ctx.fillStyle = '#fdf2f8';
      ctx.fillRect(92, 52, 126, 56);
    }
    if (hasConserv) {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(216, 128, 52, 92, [14, 14, 0, 0]);
      ctx.fill();
      ctx.stroke();
    }
    drawTownHouseBuilding(155, 76, 178, 146, '#ec4899', '#fff1f2', '🏡 Dein Haus (Offen!)', true);

    // --- ZONE 2: EINGEZÄUNTER GARTEN MIT GARTENTOR (right beside Dein Haus!) ---
    // Garden lush lawn patch inside fence
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(GARDEN_LEFT_X, 272, GARDEN_RIGHT_X - GARDEN_LEFT_X, 148, [12]);
    ctx.fill();

    // Flowers, Apple Tree & Pool inside Garden
    [330, 360, 390].forEach((fx, i) => {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(fx - 2, 344, 4, 16);
      ctx.fillStyle = i % 2 === 0 ? '#f472b6' : '#fde047';
      ctx.beginPath();
      ctx.arc(fx, 340, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    if (HomeManager.hasItem('garden', 'apple_tree')) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(468, 305, 14, 52);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(475, 294, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Garden label sign
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(352, 384, 136, 24, [12]);
    ctx.fill();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌳 Dein Garten', 420, 396);

    // Front & Back Picket Fence around Garden (with Left & Right Gartentor!)
    ctx.fillStyle = '#ffffff';
    for (let fx = GARDEN_LEFT_X; fx <= GARDEN_RIGHT_X; fx += 22) {
      // Back fence along sidewalk with entrance opening? Keep back fence closed so you go through the Gartentor!
      ctx.beginPath();
      ctx.roundRect(fx - 4, 260, 9, 26, [4, 4, 0, 0]);
      ctx.fill();
    }
    ctx.fillRect(GARDEN_LEFT_X, 270, GARDEN_RIGHT_X - GARDEN_LEFT_X, 5);

    // Side fences with Swinging Gartentor openings at y = 285..335!
    const drawSideFenceAndGate = (fenceX, openProgress, gateLabel) => {
      // Solid lower fence segments (below gate)
      ctx.fillStyle = '#ffffff';
      for (let fy = 338; fy <= 408; fy += 18) {
        ctx.beginPath();
        ctx.roundRect(fenceX - 4, fy, 10, 14, [3]);
        ctx.fill();
      }
      // Hinged Swinging Gartentor!
      ctx.save();
      ctx.translate(fenceX, 286);
      ctx.rotate(-openProgress * 1.15);
      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 48, [4]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Floating Gate Badge
      ctx.fillStyle = openProgress > 0.35 ? '#10b981' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(fenceX - 42, 232, 84, 22, [11]);
      ctx.fill();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = openProgress > 0.35 ? '#ffffff' : '#047857';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gateLabel, fenceX, 243);
    };
    drawSideFenceAndGate(LEFT_GATE_X, leftGateOpen, '🚪 Gartentor');
    drawSideFenceAndGate(RIGHT_GATE_X, rightGateOpen, '🚪 Gartentor');

    // --- ZONE 3: NACHBARSCHAFT (3 Houses + Neighbors waving outside!) ---
    drawTownHouseBuilding(700, 74, 152, 148, '#f43f8e', '#ffe4e6', '🏠 Herr Weber', true);
    drawTownHouseBuilding(885, 74, 152, 148, '#f59e0b', '#fef3c7', '🏡 Oma Frieda', true);
    drawTownHouseBuilding(1070, 74, 152, 148, '#0284c7', '#e0f2fe', '🏘️ Frau Kaya', true);

    // Friendly waving neighbors + dog badge in front
    [
      { x: 700, shirt: '#0284c7', icon: '🐕' },
      { x: 885, shirt: '#a855f7', icon: '🐱' },
      { x: 1070, shirt: '#10b981', icon: '🐶' }
    ].forEach((n, i) => {
      const bob = Math.sin(animFrame * 0.1 + i) * 2;
      ctx.fillStyle = n.shirt;
      ctx.beginPath();
      ctx.roundRect(n.x - 10, 212 + bob, 20, 24, [7]);
      ctx.fill();
      ctx.fillStyle = '#ffdecb';
      ctx.beginPath();
      ctx.arc(n.x, 202 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.icon, n.x + 28, 224);
    });

    // --- ZONE 4: TRAUM-CAFÉ & EISDIELE ---
    drawTownHouseBuilding(1360, 66, 220, 156, '#fb7185', '#fff1f2', '🍦 Traum-Café & Eisdiele', true);
    // Striped Café Awning
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#f43f8e' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(1264 + i * 32, 134, 32, 18, [0, 0, 8, 8]);
      ctx.fill();
    }

    // --- ZONE 5: STYLE-BOUTIQUE ---
    drawTownHouseBuilding(1715, 70, 196, 152, '#a855f7', '#fdf4ff', '🛍️ Style-Boutique', true);

    // --- ZONE 6: RENN-STADION ARCH ---
    ctx.save();
    ctx.strokeStyle = '#f43f8e';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(2045, 222, 86, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(2045, 222, 76, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(1955, 208, 180, 26, [13]);
    ctx.fill();
    ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏃 Renn-Stadion (Start!)', 2045, 221);
    ctx.restore();

    // Draw Player Character walking freely through Town!
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    ctx.restore();

    // Subtle minimap progress bar at top of canvas
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 140, 10, 280, 22, [11]);
    ctx.fill();
    ctx.font = '800 11px "Outfit", sans-serif';
    ctx.fillStyle = '#271333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏙️ TRAUMSTADT · Überall frei herumlaufen!', w / 2, 21);
    ctx.restore();

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
    if (stateManager.getState() === 'TOWN') {
      updateCoinsUI();
    }
  });

  stateManager.onStateChange((newState, payload) => {
    if (newState === 'TOWN') {
      if (payload && payload.from === 'HOME') {
        player.x = 155;
        player.y = 266;
      } else if (payload && payload.from === 'PETSITTING') {
        player.x = 840;
        player.y = 274;
      } else if (payload && payload.from === 'ICECREAM') {
        player.x = 1360;
        player.y = 268;
      }
      player.waypoints = [];
      player.pendingPlace = null;
      updateCoinsUI();
      renderDistrictBar();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
