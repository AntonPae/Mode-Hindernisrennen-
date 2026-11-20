import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';
import { PetFollowerController } from '../home/petCompanion.js';

const WORLD_WIDTH = 3420;
const GARDEN_LEFT_X = 280;
const GARDEN_RIGHT_X = 560;
const LEFT_GATE_X = 280;
const RIGHT_GATE_X = 560;
const STREET_START_X = 1170;

export const TOWN_PLACES = [
  {
    id: 'home',
    label: '🏡 Dein Haus',
    x: 155,
    y: 266,
    targetState: 'HOME',
    badge: 'Betreten',
    color: '#ec4899',
    desc: 'Dein offenes Zuhause (ohne Türen im Weg)'
  },
  {
    id: 'garden',
    label: '🌳 Dein Garten',
    x: 420,
    y: 320,
    targetState: 'HOME_GARDEN',
    badge: 'Durchs Gartentor',
    color: '#10b981',
    desc: 'Eingezäunter Garten mit Gartentor & Blick aufs Haus'
  },
  {
    id: 'neighbors',
    label: '🐾 Nachbarn & Hunde',
    x: 880,
    y: 274,
    targetState: 'PETSITTING',
    badge: 'Hundesitting',
    color: '#8b5cf6',
    desc: 'Herr Weber, Oma Frieda & Frau Kaya warten draußen'
  },
  {
    id: 'supermarket',
    label: '🛒 Supermarkt',
    x: 1350,
    y: 266,
    shopId: 'supermarket',
    badge: 'Essen kaufen',
    color: '#10b981',
    desc: 'Frisches Essen & Zutaten für deinen Kühlschrank'
  },
  {
    id: 'salon',
    label: '💇 Friseurladen',
    x: 1665,
    y: 266,
    shopId: 'salon',
    badge: 'Frisur & Farbe',
    color: '#9333ea',
    desc: 'Neue Frisuren, Haar-Schmuck & bunte Haarfarben'
  },
  {
    id: 'boutique',
    label: '👗 Mode-Boutique',
    x: 1980,
    y: 266,
    shopId: 'boutique',
    badge: 'Kleidung kaufen',
    color: '#db2777',
    desc: 'Outfits, Schuhe, Gesichter, Kräfte & Reise-Welten'
  },
  {
    id: 'furniture',
    label: '🛋️ Möbel & Bau',
    x: 2295,
    y: 266,
    shopId: 'furniture',
    badge: 'Möbel & Zimmer',
    color: '#f59e0b',
    desc: 'Neue Räume, Möbel, Deko, Garten & Haus-Geräte'
  },
  {
    id: 'petshop',
    label: '🐾 Tierhandlung',
    x: 2610,
    y: 266,
    shopId: 'petshop',
    badge: 'Tiere & Futter',
    color: '#0ea5e9',
    desc: 'Haustiere, Tiersachen fürs Tierzimmer & Tierfutter'
  },
  {
    id: 'cafe',
    label: '🍦 Café & Eisdiele',
    x: 2925,
    y: 266,
    targetState: 'ICECREAM',
    badge: 'Arbeiten',
    color: '#f43f5e',
    desc: 'Eis, Waffeln, warmes Essen & Getränke servieren'
  },
  {
    id: 'stadium',
    label: '🏃 Renn-Stadion',
    x: 3240,
    y: 266,
    targetState: 'BACKGROUND_SELECT',
    badge: 'Rennen starten',
    color: '#eab308',
    desc: 'Rennen durch Traumwelten & Münzen sammeln'
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
  let leftGateOpen = 0;
  let rightGateOpen = 0;

  const player = {
    x: 1310,
    y: 268,
    facing: 1,
    waypoints: [],
    pendingPlace: null,
    pose: 'idle'
  };

  const petFollowers = new PetFollowerController();
  const fxParticles = [];

  const streetCars = [
    { x: 1320, speed: 1.5, color: '#f43f5e', roof: '#ffe4e6', dir: 1 },
    { x: 2050, speed: 1.25, color: '#0284c7', roof: '#e0f2fe', dir: -1 },
    { x: 2640, speed: 1.65, color: '#fbbf24', roof: '#fef3c7', dir: 1 }
  ];

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  function updateCoinsUI() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
  }

  function getNearestPlace(px, py) {
    let best = null;
    let bestDist = 130;
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
    if (place.shopId) {
      stateManager.setState('STORE', { shopId: place.shopId, aisle: place.preferredTab || null, from: 'TOWN' });
      return;
    }
    if (place.targetState === 'HOME_GARDEN') {
      stateManager.setState('HOME', { room: 'garden' });
    } else if (place.targetState === 'HOME') {
      stateManager.setState('HOME', { room: 'living_room' });
    } else {
      stateManager.setState(place.targetState);
    }
  }

  function navigateInTown(tx, ty, pendingPlace = null) {
    const clampedX = Math.max(48, Math.min(WORLD_WIDTH - 48, tx));
    const clampedY = Math.max(242, Math.min(434, ty));
    const startInGarden = player.x > GARDEN_LEFT_X + 6 && player.x < GARDEN_RIGHT_X - 6;
    const endInGarden = clampedX > GARDEN_LEFT_X + 6 && clampedX < GARDEN_RIGHT_X - 6;
    const waypoints = [];

    const gateY = 304;
    if (!startInGarden && endInGarden) {
      const gateX = player.x <= LEFT_GATE_X + 120 ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -24 : 24), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 28 : -28), y: gateY });
    } else if (startInGarden && !endInGarden) {
      const gateX = clampedX <= LEFT_GATE_X ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 26 : -26), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -28 : 28), y: gateY });
    } else if (player.x <= LEFT_GATE_X && clampedX >= RIGHT_GATE_X) {
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
        statusEl.textContent = 'Lauf ein Stück näher an ein Geschäft, Haus, Café oder den Garten heran!';
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

      const petTap = petFollowers.handleTap(worldX, worldY);
      if (petTap.hit) {
        for (let i = 0; i < 6; i++) {
          fxParticles.push({
            x: petTap.x + (Math.random() - 0.5) * 32,
            y: petTap.y - 12,
            vx: (Math.random() - 0.5) * 1.8,
            vy: -1.1 - Math.random() * 1.4,
            life: 40
          });
        }
        if (statusEl) statusEl.textContent = `❤️ ${petTap.meta.name} freut sich über deine Streicheleinheit!`;
        return;
      }

      if (HomeManager.hasMailbox() && worldX >= 220 && worldX <= 268 && worldY >= 165 && worldY <= 250) {
        window.dispatchEvent(new CustomEvent('runner:open-mailbox', { detail: { tab: 'inbox' } }));
        return;
      }

      for (const p of TOWN_PLACES) {
        if (Math.abs(worldX - p.x) <= 98 && worldY >= 55 && worldY <= 278) {
          navigateInTown(p.x, p.y, p);
          if (statusEl) statusEl.textContent = `🚶 Du läufst zu: ${p.label} – ${p.desc}`;
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
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (document.querySelector('.modal:not(.hidden)')) return;
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

    const atGatePassage = (y) => y >= 282 && y <= 336;
    const isFenceBlocked = (oldX, newX, y) => {
      if (y < 276) return false;
      if ((oldX <= LEFT_GATE_X && newX > LEFT_GATE_X) || (oldX >= LEFT_GATE_X && newX < LEFT_GATE_X)) {
        if (!atGatePassage(y)) return true;
      }
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

    const speed = 5.6;
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

    // Move cute background cars along the shopping street road!
    streetCars.forEach((car) => {
      car.x += car.speed * car.dir;
      if (car.dir > 0 && car.x > WORLD_WIDTH - 40) car.x = STREET_START_X + 20;
      if (car.dir < 0 && car.x < STREET_START_X + 20) car.x = WORLD_WIDTH - 40;
    });

    const nearLeftGate = Math.abs(player.x - LEFT_GATE_X) < 58 && player.y >= 265;
    const nearRightGate = Math.abs(player.x - RIGHT_GATE_X) < 58 && player.y >= 265;
    leftGateOpen += ((nearLeftGate ? 1 : 0) - leftGateOpen) * 0.16;
    rightGateOpen += ((nearRightGate ? 1 : 0) - rightGateOpen) * 0.16;

    if (canvas) {
      const targetCam = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, player.x - canvas.width * 0.45));
      cameraX += (targetCam - cameraX) * 0.12;
    }

    const near = getNearestPlace(player.x, player.y);
    if (enterPlaceBtn) {
      if (near) {
        enterPlaceBtn.disabled = false;
        enterPlaceBtn.textContent = `✨ ${near.label} (${near.badge})`;
      } else {
        enterPlaceBtn.disabled = true;
        enterPlaceBtn.textContent = '🚶 Lauf zu einem Geschäft oder Ort';
      }
    }
  }

  function drawTownHouseBuilding(x, y, w, h, roofColor, wallColor, label, openArch = true) {
    ctx.save();
    ctx.fillStyle = wallColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y + 48, w, h - 48, [10]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 14, y + 54);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w / 2 + 14, y + 54);
    ctx.closePath();
    ctx.fill();

    [x - w * 0.28, x + w * 0.15].forEach((wx) => {
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(wx, y + 76, 30, 30, [6]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

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

  function drawShoppingStreetStore(opts) {
    const { x, w = 224, h = 162, y = 66, wall, trim, awningA, awningB, signText, signColor, windowItems } = opts;
    ctx.save();

    // Main two-tone modern boutique/store building
    ctx.fillStyle = wall;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y, w, h, [14, 14, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Decorative roof cornice
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.roundRect(x - w / 2 - 6, y - 8, w + 12, 16, [8]);
    ctx.fill();

    // Top Store Sign Board
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 92, y + 12, 184, 28, [12]);
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.font = '800 12px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = signColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(signText, x, y + 26);

    // Striped Shop Awning
    const stripeW = (w - 16) / 6;
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? awningA : awningB;
      ctx.beginPath();
      ctx.roundRect(x - w / 2 + 8 + i * stripeW, y + 48, stripeW, 20, [0, 0, 8, 8]);
      ctx.fill();
    }

    // Left Glass Display Window ("Schaufenster") with merchandise icons!
    const winX = x - w / 2 + 16;
    const winY = y + 76;
    const winW = w * 0.48;
    const winH = 66;
    const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    winGrad.addColorStop(0, '#e0f2fe');
    winGrad.addColorStop(1, '#fffbeb');
    ctx.fillStyle = winGrad;
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, [10]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Merchandise inside Schaufenster
    if (Array.isArray(windowItems)) {
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      windowItems.forEach((icon, idx) => {
        ctx.fillText(icon, winX + 22 + idx * 30, winY + 34);
      });
    }

    // Open Shop Glass Entrance on Right Side
    const doorW = 54;
    const doorH = 78;
    const doorX = x + w / 2 - doorW - 18;
    const doorY = y + h - doorH;
    const doorGrad = ctx.createLinearGradient(0, doorY, 0, y + h);
    doorGrad.addColorStop(0, '#bae6fd');
    doorGrad.addColorStop(1, '#fdf2f8');
    ctx.fillStyle = doorGrad;
    ctx.beginPath();
    ctx.roundRect(doorX, doorY, doorW, doorH, [12, 12, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Open Sign on door
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(doorX + 6, doorY + 12, doorW - 12, 18, [8]);
    ctx.fill();
    ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('OFFEN', doorX + doorW / 2, doorY + 21);

    ctx.restore();
  }

  function drawShoppingStreetEnvironment(h) {
    // 1. Stone Sidewalk Promenade along all stores on the shopping street
    const sidewalkG = ctx.createLinearGradient(0, 214, 0, 288);
    sidewalkG.addColorStop(0, '#f8fafc');
    sidewalkG.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = sidewalkG;
    ctx.fillRect(STREET_START_X, 214, WORLD_WIDTH - STREET_START_X, 74);

    // Sidewalk curb line
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(STREET_START_X, 284, WORLD_WIDTH - STREET_START_X, 6);

    // 2. Real Asphalt City Street ("Stadt-Straße")!
    const roadG = ctx.createLinearGradient(0, 290, 0, 392);
    roadG.addColorStop(0, '#475569');
    roadG.addColorStop(0.5, '#334155');
    roadG.addColorStop(1, '#1e293b');
    ctx.fillStyle = roadG;
    ctx.fillRect(STREET_START_X, 290, WORLD_WIDTH - STREET_START_X, 102);

    // Dashed White Road Center Markings
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let rx = STREET_START_X + 20; rx < WORLD_WIDTH - 30; rx += 64) {
      ctx.beginPath();
      ctx.roundRect(rx, 338, 36, 6, [3]);
      ctx.fill();
    }

    // Crisp Crosswalks ("Zebrastreifen") in front of shops!
    [1350, 1665, 1980, 2295, 2610, 2925].forEach((cx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      for (let sy = 296; sy <= 376; sy += 16) {
        ctx.fillRect(cx - 28, sy, 56, 8);
      }
    });

    // Lower Sidewalk Promenade & Flower Planters across the street
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(STREET_START_X, 392, WORLD_WIDTH - STREET_START_X, h - 392);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(STREET_START_X, 392, WORLD_WIDTH - STREET_START_X, 5);

    // Warm Streetlamps & Green Flower Planters along Shopping Street
    for (let lx = STREET_START_X + 35; lx < WORLD_WIDTH - 40; lx += 155) {
      // Planter box
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(lx - 18, 266, 36, 16, [5]);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(lx, 262, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(lx - 5, 259, 4, 0, Math.PI * 2);
      ctx.arc(lx + 5, 261, 4, 0, Math.PI * 2);
      ctx.fill();

      // Streetlamp pole & warm lantern
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lx + 42, 128, 5, 140);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(lx + 44.5, 126, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Street Sign Banner at start of Shopping Street
    ctx.save();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(STREET_START_X + 12, 146, 146, 30, [10]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.font = '800 11.5px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛍️ Einkaufsstraße ➔', STREET_START_X + 85, 161);
    ctx.restore();
  }

  function drawStreetCars() {
    streetCars.forEach((car) => {
      const cy = car.dir > 0 ? 356 : 306;
      const bounce = Math.sin(animFrame * 0.25 + car.x) * 0.8;
      ctx.save();
      ctx.translate(car.x, cy + bounce);
      if (car.dir < 0) ctx.scale(-1, 1);

      // Shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 12, 26, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car body
      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect(-24, -6, 48, 16, [8]);
      ctx.fill();
      ctx.fillStyle = car.roof;
      ctx.beginPath();
      ctx.roundRect(-14, -15, 26, 12, [7, 7, 0, 0]);
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-13, 10, 5.5, 0, Math.PI * 2);
      ctx.arc(13, 10, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
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

    // Residential Lawn (Left District x: 0..STREET_START_X)
    const grass = ctx.createLinearGradient(0, 215, 0, h);
    grass.addColorStop(0, '#4ade80');
    grass.addColorStop(1, '#10b981');
    ctx.fillStyle = grass;
    ctx.fillRect(0, 215, STREET_START_X, h - 215);

    // Residential Promenade Sidewalk leading into the Shopping Street
    const walkGrad = ctx.createLinearGradient(0, 232, 0, 290);
    walkGrad.addColorStop(0, '#fef3c7');
    walkGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = walkGrad;
    ctx.fillRect(0, 234, STREET_START_X, 54);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.16)';
    ctx.fillRect(0, 234, STREET_START_X, 4);
    ctx.fillRect(0, 284, STREET_START_X, 4);

    // --- ZONE 1: DEIN TRAUMHAUS ---
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

    if (HomeManager.hasMailbox()) {
      const isGold = HomeManager.hasItem('garden', 'gold_mailbox');
      const unread = MailboxManager.getUnreadCount();
      ctx.save();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(242, 206, 6, 28);
      ctx.fillStyle = isGold ? '#fbbf24' : '#ec4899';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(232, 188, 26, 18, [8, 8, 3, 3]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = unread > 0 ? '#ef4444' : '#cbd5e1';
      ctx.fillRect(256, unread > 0 ? 178 : 192, 3, 14);
      if (unread > 0) {
        const bob = Math.sin(animFrame * 0.12) * 3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(226, 160 + bob, 38, 18, [9]);
        ctx.fill();
        ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#be185d';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📩 ${unread}`, 245, 169 + bob);
      }
      ctx.restore();
    }

    // --- ZONE 2: EINGEZÄUNTER GARTEN MIT GARTENTOR ---
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(GARDEN_LEFT_X, 272, GARDEN_RIGHT_X - GARDEN_LEFT_X, 148, [12]);
    ctx.fill();

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

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(352, 384, 136, 24, [12]);
    ctx.fill();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌳 Dein Garten', 420, 396);

    ctx.fillStyle = '#ffffff';
    for (let fx = GARDEN_LEFT_X; fx <= GARDEN_RIGHT_X; fx += 22) {
      ctx.beginPath();
      ctx.roundRect(fx - 4, 260, 9, 26, [4, 4, 0, 0]);
      ctx.fill();
    }
    ctx.fillRect(GARDEN_LEFT_X, 270, GARDEN_RIGHT_X - GARDEN_LEFT_X, 5);

    const drawSideFenceAndGate = (fenceX, openProgress, gateLabel) => {
      ctx.fillStyle = '#ffffff';
      for (let fy = 338; fy <= 408; fy += 18) {
        ctx.beginPath();
        ctx.roundRect(fenceX - 4, fy, 10, 14, [3]);
        ctx.fill();
      }
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

    // --- ZONE 3: NACHBARSCHAFT ---
    drawTownHouseBuilding(700, 74, 152, 148, '#f43f8e', '#ffe4e6', '🏠 Herr Weber', true);
    drawTownHouseBuilding(885, 74, 152, 148, '#f59e0b', '#fef3c7', '🏡 Oma Frieda', true);
    drawTownHouseBuilding(1070, 74, 152, 148, '#0284c7', '#e0f2fe', '🏘️ Frau Kaya', true);

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

    // --- ZONE 4: REAL CITY SHOPPING STREET ("Einkaufsstraße") WITH STORES! ---
    drawShoppingStreetEnvironment(h);

    // 1. Supermarkt (Fridge Food!)
    drawShoppingStreetStore({
      x: 1350,
      wall: '#ecfdf5',
      trim: '#059669',
      awningA: '#10b981',
      awningB: '#ffffff',
      signText: '🛒 SUPERMARKT',
      signColor: '#047857',
      windowItems: ['🍎', '🧀', '🥛']
    });

    // 2. Friseurladen (Haircuts, Headwear & Hair Coloring!)
    drawShoppingStreetStore({
      x: 1665,
      wall: '#faf5ff',
      trim: '#9333ea',
      awningA: '#a855f7',
      awningB: '#ffffff',
      signText: '💇 FRISEURLADEN',
      signColor: '#7e22ce',
      windowItems: ['💇', '✂️', '🎨']
    });
    // Animated spinning red-white-blue barber pole beside the Friseurladen door!
    ctx.save();
    const poleX = 1665 + 104;
    const poleY = 148;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(poleX - 7, poleY, 14, 56, [7]);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(poleX - 6, poleY + 6, 12, 44, [4]);
    ctx.clip();
    const stripeShift = (animFrame * 0.8) % 24;
    for (let sy = poleY - 24; sy < poleY + 64; sy += 12) {
      ctx.fillStyle = ((sy / 12) % 2 === 0) ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(poleX - 8, sy + stripeShift);
      ctx.lineTo(poleX + 8, sy + stripeShift - 8);
      ctx.lineTo(poleX + 8, sy + stripeShift - 2);
      ctx.lineTo(poleX - 8, sy + stripeShift + 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(poleX - 7, poleY, 14, 56, [7]);
    ctx.stroke();
    ctx.restore();

    // 3. Mode- & Style-Boutique (Outfits, Shoes, Faces!)
    drawShoppingStreetStore({
      x: 1980,
      wall: '#fdf2f8',
      trim: '#db2777',
      awningA: '#ec4899',
      awningB: '#ffffff',
      signText: '👗 MODE-BOUTIQUE',
      signColor: '#be185d',
      windowItems: ['👗', '👟', '😎']
    });

    // 4. Möbel- & Bau-Kaufhaus (Rooms, Furniture, Garden!)
    drawShoppingStreetStore({
      x: 2295,
      wall: '#fffbeb',
      trim: '#d97706',
      awningA: '#f59e0b',
      awningB: '#ffffff',
      signText: '🛋️ MÖBEL & BAU',
      signColor: '#b45309',
      windowItems: ['🛋️', '📺', '🪴']
    });

    // 5. Tierhandlung (Pets & Pet Items!)
    drawShoppingStreetStore({
      x: 2610,
      wall: '#f0f9ff',
      trim: '#0284c7',
      awningA: '#0ea5e9',
      awningB: '#ffffff',
      signText: '🐾 TIERHANDLUNG',
      signColor: '#0369a1',
      windowItems: ['🐶', '🐱', '🦴']
    });

    // 6. Traum-Café & Eisdiele
    drawShoppingStreetStore({
      x: 2925,
      wall: '#fff1f2',
      trim: '#e11d48',
      awningA: '#f43f5e',
      awningB: '#ffffff',
      signText: '🍦 CAFÉ & EISDIELE',
      signColor: '#be123c',
      windowItems: ['🍦', '🧇', '🥤']
    });

    // 7. Renn-Stadion Arch at end of Street
    ctx.save();
    ctx.strokeStyle = '#f43f8e';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(3240, 222, 86, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(3240, 222, 76, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(3150, 208, 180, 26, [13]);
    ctx.fill();
    ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏃 Renn-Stadion (Start!)', 3240, 221);
    ctx.restore();

    // Animated city cars on the road (drawn behind player when player is in foreground, or nicely along lane)
    drawStreetCars();

    // Companion Pets following player!
    petFollowers.update(player.x, player.y + 4, player.facing, {
      minX: 30,
      maxX: WORLD_WIDTH - 30,
      minY: 238,
      maxY: 438
    });
    petFollowers.draw(ctx, animFrame, {
      scale: 0.92,
      showLeashes: true,
      anchorX: player.x,
      anchorY: player.y + 4,
      facing: player.facing
    });

    // Player Character
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 40);
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    ctx.restore();

    // Banner at top of canvas
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 190, 10, 380, 22, [11]);
    ctx.fill();
    ctx.font = '800 11px "Outfit", sans-serif';
    ctx.fillStyle = '#271333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const zoneLabel = player.x >= STREET_START_X
      ? '🛍️ EINKAUFSSTRASSE · Geh in die Geschäfte!'
      : '🏡 WOHNVIERTEL · Weiter rechts ist die Geschäftsstraße!';
    ctx.fillText(zoneLabel, w / 2, 21);
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
      if (payload && payload.openShop) {
        stateManager.setState('STORE', { shopId: payload.openShop, aisle: payload.shopTab || null, from: payload.from || 'TOWN' });
        return;
      } else if (payload && payload.from === 'STORE' && payload.lastShopId) {
        const target = TOWN_PLACES.find((p) => p.shopId === payload.lastShopId);
        if (target) {
          player.x = target.x;
          player.y = 274;
        }
      } else if (payload && payload.from === 'HOME') {
        player.x = 155;
        player.y = 266;
      } else if (payload && payload.from === 'PETSITTING') {
        player.x = 880;
        player.y = 274;
      } else if (payload && payload.from === 'ICECREAM') {
        player.x = 2925;
        player.y = 266;
      } else if (payload && payload.from === 'EDITOR') {
        player.x = 1980;
        player.y = 266;
      } else {
        // Default landing right on the Shopping Street so the user immediately sees the street & stores!
        player.x = 1490;
        player.y = 268;
      }
      player.waypoints = [];
      player.pendingPlace = null;
      petFollowers.reset(player.x, player.y + 4);
      MailboxManager.ensureDailyMail();
      updateCoinsUI();
      renderDistrictBar();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
