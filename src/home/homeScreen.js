import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { HOME_CATALOG, HomeManager } from './homeData.js';

const CATEGORY_TABS = [
  { id: 'expansions', label: '🏗️ Anbau' },
  { id: 'furniture', label: '🛋️ Möbel' },
  { id: 'decor', label: '🖼️ Deko' },
  { id: 'garden', label: '🌳 Garten' },
  { id: 'pets', label: '🐾 Tiere' },
  { id: 'petItems', label: '🧸 Tiersachen' },
  { id: 'supplies', label: '🛒 Vorräte' }
];

const ROOMS = [
  { id: 'living_room', label: '🛋️ Wohnzimmer', alwaysUnlocked: true },
  { id: 'kitchen', label: '🍳 Küche', alwaysUnlocked: true },
  { id: 'bedroom', label: '🛏️ Schlafzimmer', unlockItem: 'bedroom' },
  { id: 'conservatory', label: '🪴 Wintergarten', unlockItem: 'conservatory' },
  { id: 'garden', label: '🌳 Garten', alwaysUnlocked: true }
];

export function setupHomeScreen(stateManager) {
  const canvas = document.getElementById('homeCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsVal = document.getElementById('homeCoinsVal');
  const levelVal = document.getElementById('homeLevelVal');
  const homeMysteryBtn = document.getElementById('homeMysteryBtn');
  const toastEl = document.getElementById('homeToast');
  const roomTabsEl = document.getElementById('homeRoomTabs');
  const taskTextEl = document.getElementById('homeTaskText');
  const stirBtn = document.getElementById('homeStirBtn');
  const tabsEl = document.getElementById('homeShopTabs');
  const itemsGridEl = document.getElementById('homeShopGrid');

  const walkLeftBtn = document.getElementById('homeWalkLeftBtn');
  const walkRightBtn = document.getElementById('homeWalkRightBtn');
  const jumpBtn = document.getElementById('homeJumpBtn');

  const cleanBar = document.getElementById('cleanBar');
  const hungerBar = document.getElementById('hungerBar');
  const petBar = document.getElementById('petBar');
  const gardenBar = document.getElementById('gardenBar');

  const cleanPct = document.getElementById('cleanPct');
  const hungerPct = document.getElementById('hungerPct');
  const petPct = document.getElementById('petPct');
  const gardenPct = document.getElementById('gardenPct');

  const foodCountEl = document.getElementById('foodCountVal');
  const petFoodCountEl = document.getElementById('petFoodCountVal');

  const cookBtn = document.getElementById('cookBtn');
  const cleanBtn = document.getElementById('cleanBtn');
  const feedPetsBtn = document.getElementById('feedPetsBtn');
  const petAnimalsBtn = document.getElementById('petAnimalsBtn');
  const gardenBtn = document.getElementById('gardenBtn');

  const backToEditorBtn = document.getElementById('homeToEditorBtn');
  const playFromHomeBtn = document.getElementById('homeToGameBtn');

  let activeTab = 'expansions';
  let activeRoom = 'living_room';
  let animFrame = 0;
  let rafId = null;
  let decayInterval = null;
  let toastTimer = null;

  // Player Movement & Interactive Task State inside Room
  const player = {
    x: 260,
    z: 0, // subtle depth offset (-14..+26)
    yOffset: 0, // vertical jump offset
    vy: 0,
    facing: 1,
    targetX: null,
    targetZ: null,
    pose: 'idle',
    poseTimer: 0
  };

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false };

  let activeTask = null;
  let doorHotspots = [];
  const fxParticles = [];
  let activeFind = null;
  let nextFindTimer = 210;

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3000);
  }

  function setTaskBanner(text, showStir = false) {
    if (taskTextEl) taskTextEl.textContent = text;
    if (stirBtn) {
      stirBtn.classList.toggle('hidden', !showStir);
    }
  }

  function spawnFX(kind, x, y, count = 8) {
    const palette = kind === 'heart'
      ? ['#f43f5e', '#fb7185', '#fbcfe8']
      : kind === 'water'
        ? ['#38bdf8', '#7dd3fc', '#e0f2fe']
        : kind === 'coin'
          ? ['#fbbf24', '#fef08a', '#f59e0b']
          : ['#fde047', '#f472b6', '#67e8f9', '#ffffff'];

    for (let i = 0; i < count; i++) {
      fxParticles.push({
        kind,
        color: palette[i % palette.length],
        x: x + (Math.random() - 0.5) * 44,
        y: y + (Math.random() - 0.5) * 26,
        vx: (Math.random() - 0.5) * 2.4,
        vy: -1.4 - Math.random() * 1.8,
        size: 4 + Math.random() * 4,
        life: 48
      });
    }
  }

  function isRoomUnlocked(room) {
    if (room.alwaysUnlocked) return true;
    return HomeManager.hasItem('expansions', room.unlockItem);
  }

  function switchRoom(roomId, entryX = null) {
    const room = ROOMS.find((r) => r.id === roomId);
    if (!room) return false;
    if (!isRoomUnlocked(room)) {
      activeTab = 'expansions';
      renderTabs();
      renderShopGrid();
      const catalogItem = HOME_CATALOG.expansions.find((e) => e.id === room.unlockItem);
      showToast(`🔒 "${catalogItem ? catalogItem.name : room.label}" kannst du rechts unter "🏗️ Anbau" freischalten!`, 'warn');
      return false;
    }

    activeRoom = roomId;
    activeTask = null;
    activeFind = null;
    player.x = entryX !== null ? entryX : 240;
    player.z = 0;
    player.targetX = null;
    player.targetZ = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    renderRoomTabs();
    setTaskBanner(`Du bist jetzt in: ${room.label.replace(/^[^\s]+\s/, '')} · Klicke auf den Boden oder nutze ← → / A D zum Laufen!`);
    return true;
  }

  function renderRoomTabs() {
    if (!roomTabsEl) return;
    roomTabsEl.innerHTML = '';
    ROOMS.forEach((room) => {
      const unlocked = isRoomUnlocked(room);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-room-tab${activeRoom === room.id ? ' active' : ''}${!unlocked ? ' locked' : ''}`;
      btn.textContent = unlocked ? room.label : `🔒 ${room.label.replace(/^[^\s]+\s/, '')}`;
      btn.addEventListener('click', () => switchRoom(room.id));
      roomTabsEl.appendChild(btn);
    });
  }

  function updateUI() {
    const state = HomeManager.getState();
    if (coinsVal) coinsVal.textContent = ShopManager.getCoins();
    if (levelVal) levelVal.textContent = ShopManager.getStats().level;

    const setBar = (bar, pctEl, val) => {
      const clamped = Math.max(0, Math.min(100, Math.round(val)));
      if (bar) {
        bar.style.width = `${clamped}%`;
        bar.style.background =
          clamped >= 70
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : clamped >= 35
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #f43f5e, #fb7185)';
      }
      if (pctEl) pctEl.textContent = `${clamped}%`;
    };

    setBar(cleanBar, cleanPct, state.needs.cleanliness);
    setBar(hungerBar, hungerPct, state.needs.hunger);
    setBar(petBar, petPct, state.owned.pets.length > 0 ? state.needs.petCare : 100);
    setBar(gardenBar, gardenPct, state.needs.gardenGrowth);

    if (foodCountEl) foodCountEl.textContent = state.inventory.food || 0;
    if (petFoodCountEl) petFoodCountEl.textContent = state.inventory.petFood || 0;

    if (gardenBtn) {
      if (state.needs.gardenGrowth >= 100) {
        gardenBtn.textContent = '🍎 Im Garten ernten (+🪙)';
        gardenBtn.classList.add('btn-harvest-ready');
      } else {
        gardenBtn.textContent = '🚿 Garten gießen';
        gardenBtn.classList.remove('btn-harvest-ready');
      }
    }
  }

  function notifyMoneyOrMissionChange() {
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));
  }

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = '';
    CATEGORY_TABS.forEach((tab) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-tab-btn${activeTab === tab.id ? ' active' : ''}`;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => {
        activeTab = tab.id;
        renderTabs();
        renderShopGrid();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderShopGrid() {
    if (!itemsGridEl) return;
    const list = HOME_CATALOG[activeTab] || [];
    const coins = ShopManager.getCoins();

    itemsGridEl.innerHTML = '';
    list.forEach((item) => {
      const owned = !item.isConsumable && HomeManager.hasItem(activeTab, item.id);
      const levelOk = HomeManager.isLevelUnlocked(item);
      const price = HomeManager.getEffectivePrice(activeTab, item);
      const isDeal = !owned && !item.isConsumable && HomeManager.isDailyDeal(activeTab, item.id);
      const canAfford = coins >= price;

      const card = document.createElement('div');
      card.className = `home-shop-card${owned ? ' owned' : ''}${!owned && levelOk && canAfford ? ' affordable' : ''}${!levelOk ? ' level-locked' : ''}`;

      const badgeHtml = !owned && isDeal
        ? '<span class="home-inline-tag deal">🔥 -30%</span>'
        : !owned && item.isNew
          ? '<span class="home-inline-tag new">✨ NEU</span>'
          : '';

      const btnLabel = owned
        ? '✓ Im Besitz'
        : !levelOk
          ? `🔒 Ab Level ${item.unlockLevel}`
          : `${isDeal ? '🔥 ' : ''}Kaufen (${price} 🪙)`;

      card.innerHTML = `
        <div class="home-shop-top">
          <span class="home-shop-icon">${item.icon}</span>
          <div>
            <strong>${item.name} ${badgeHtml}</strong>
            <p>${item.desc}</p>
          </div>
        </div>
        <button type="button" class="btn btn-small ${owned || !levelOk ? 'btn-secondary' : 'btn-primary'}" ${owned || !levelOk ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      `;

      const buyBtn = card.querySelector('button');
      if (buyBtn && !owned && levelOk) {
        buyBtn.addEventListener('click', () => {
          const res = HomeManager.buyItem(activeTab, item.id);
          if (res.ok) {
            updateUI();
            renderRoomTabs();
            renderShopGrid();
            spawnFX('sparkle', player.x, 220, 12);
            showToast(`🎉 "${item.name}" gekauft!`, 'success');
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${item.name}"!`, 'warn');
          }
        });
      }

      itemsGridEl.appendChild(card);
    });
  }

  // --- INTERACTIVE MOVEMENT TASKS ---

  function startCookingTask() {
    const state = HomeManager.getState();
    if ((state.inventory.food || 0) <= 0) {
      showToast('🥘 Keine Koch-Zutaten mehr! Kauf welche unter "🛒 Vorräte".', 'warn');
      return;
    }
    if (activeRoom !== 'kitchen') {
      switchRoom('kitchen', 110);
    }
    activeTask = {
      type: 'cook',
      phase: 'gather',
      stirProgress: 0,
      targets: [
        { id: 'ing1', kind: 'tomato', label: 'Tomaten', x: 165, collected: false },
        { id: 'ing2', kind: 'cheese', label: 'Käse', x: 355, collected: false },
        { id: 'ing3', kind: 'herb', label: 'Kräuter', x: 605, collected: false }
      ],
      stoveX: 470
    };
    setTaskBanner('🍳 Kochen (1/2): Lauf durch die Küche & sammle alle 3 frischen Zutaten ein! (0/3)', false);
  }

  function startCleaningTask() {
    const state = HomeManager.getState();
    if (state.needs.cleanliness >= 98) {
      showToast('✨ Dein Zuhause glänzt schon perfekt!', 'info');
      return;
    }
    const xs = [130, 265, 405, 535, 650];
    activeTask = {
      type: 'clean',
      targets: xs.map((x, idx) => ({
        id: `dust_${idx}`,
        x,
        collected: false
      }))
    };
    setTaskBanner('🧹 Putzen: Lauf über alle 5 Staubwölkchen im Raum, um sie wegzufegen! (0/5)', false);
  }

  function startGardenTask() {
    const state = HomeManager.getState();
    const isHarvest = state.needs.gardenGrowth >= 100;
    if (activeRoom !== 'garden') {
      switchRoom('garden', 110);
    }
    activeTask = {
      type: 'garden',
      mode: isHarvest ? 'harvest' : 'water',
      targets: [
        { id: 'g1', x: 185, collected: false },
        { id: 'g2', x: 345, collected: false },
        { id: 'g3', x: 505, collected: false },
        { id: 'g4', x: 645, collected: false }
      ]
    };
    setTaskBanner(
      isHarvest
        ? '🍎 Ernten: Lauf zu allen 4 reifen Stellen im Garten & pflücke die Ernte! (0/4)'
        : '🚿 Gießen: Lauf zu allen 4 Gartenbeeten & gieße die Pflanzen! (0/4)',
      false
    );
  }

  function startPetTask(mode) {
    const state = HomeManager.getState();
    if (state.owned.pets.length === 0) {
      showToast('🐾 Du hast noch kein Tier! Hol dir eins unter "🐾 Tiere".', 'warn');
      return;
    }
    if (mode === 'feed' && (state.inventory.petFood || 0) <= 0) {
      showToast('🦴 Kein Tierfutter mehr! Kauf Nachschub unter "🛒 Vorräte".', 'warn');
      return;
    }
    activeTask = {
      type: mode === 'feed' ? 'feed_pets' : 'pet_pets',
      targets: state.owned.pets.slice(0, 3).map((petId, idx) => ({
        id: petId,
        x: 200 + idx * 175,
        collected: false
      }))
    };
    setTaskBanner(
      mode === 'feed'
        ? `🦴 Füttern: Lauf zu deinen Tieren im Raum, um sie zu füttern! (0/${activeTask.targets.length})`
        : `🤗 Streicheln: Lauf zu deinen Tieren, um sie zu knuddeln! (0/${activeTask.targets.length})`,
      false
    );
  }

  function performStirAction() {
    if (!activeTask || activeTask.type !== 'cook' || activeTask.phase !== 'stir') return;
    if (Math.abs(player.x - activeTask.stoveX) > 75) {
      player.targetX = activeTask.stoveX;
      showToast('🚶 Lauf zuerst zum Herd in der Mitte!', 'info');
      return;
    }
    player.pose = 'cook';
    player.poseTimer = 28;
    activeTask.stirProgress = Math.min(100, activeTask.stirProgress + 25);
    spawnFX('sparkle', activeTask.stoveX, 235, 6);

    if (activeTask.stirProgress >= 100) {
      const res = HomeManager.cookMeal();
      activeTask = null;
      setTaskBanner('🍽️ Lecker gekocht! Lauf gerne weiter durch die Küche oder besuche einen anderen Raum!', false);
      if (res.ok) {
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        spawnFX('coin', player.x, 190, 10);
        showToast(`🍽️ Lecker gekocht! +${res.bonusCoins} 🪙 Wohlfühl-Bonus!`, 'success');
      }
    } else {
      setTaskBanner(`🍳 Am Herd rühren (${activeTask.stirProgress}%) — tippe weiter auf "🥄 Rühren!" oder Leertaste!`, true);
    }
  }

  if (stirBtn) {
    stirBtn.addEventListener('click', performStirAction);
  }

  if (homeMysteryBtn) {
    homeMysteryBtn.addEventListener('click', () => {
      const res = HomeManager.buyHomeMysteryBox();
      if (res.ok) {
        updateUI();
        renderRoomTabs();
        renderShopGrid();
        spawnFX('sparkle', player.x, 210, 12);
        showToast(`🎁 Haus-Überraschung! Freigeschaltet: ${res.item.icon} ${res.item.name}!`, 'success');
      } else if (res.reason === 'all_unlocked') {
        showToast('🏆 Alle aktuell freigeschalteten Haus-Sachen gehören dir schon!', 'info');
      } else if (res.reason === 'insufficient_funds') {
        showToast(`🔒 Noch ${res.missing} 🪙 nötig für die Haus-Überraschung!`, 'warn');
      }
    });
  }

  if (cookBtn) cookBtn.addEventListener('click', startCookingTask);
  if (cleanBtn) cleanBtn.addEventListener('click', startCleaningTask);
  if (feedPetsBtn) feedPetsBtn.addEventListener('click', () => startPetTask('feed'));
  if (petAnimalsBtn) petAnimalsBtn.addEventListener('click', () => startPetTask('pet'));
  if (gardenBtn) gardenBtn.addEventListener('click', startGardenTask);

  // Movement Key & Touch Pad Listeners
  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'HOME') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.targetX = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.targetX = null;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = true;
      player.targetZ = null;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      keys.down = true;
      player.targetZ = null;
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'stir' && Math.abs(player.x - activeTask.stoveX) <= 75) {
        performStirAction();
      } else if (player.yOffset === 0) {
        player.vy = -8.5;
      }
    } else if (e.code === 'KeyE' || e.code === 'Enter') {
      if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'stir') {
        performStirAction();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const onDown = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.targetX = null;
    };
    const onUp = () => {
      holdPad[dir] = false;
    };
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  };
  bindHold(walkLeftBtn, 'left');
  bindHold(walkRightBtn, 'right');

  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      if (player.yOffset === 0) player.vy = -8.5;
    });
  }

  // Click / Tap inside Room Canvas: Doors, Treasure Finds, Stove Stir, or Walk-to-Position!
  if (canvas) {
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

      // 1. Sparkling Find pickup
      if (activeFind && Math.hypot(cx - activeFind.x, cy - activeFind.y) <= 38) {
        const reward = activeFind.coins;
        ShopManager.addCoins(reward);
        spawnFX('coin', activeFind.x, activeFind.y, 9);
        activeFind = null;
        nextFindTimer = 500 + Math.floor(Math.random() * 280);
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        showToast(`✨ Glücksfund entdeckt! +${reward} 🪙 eingesammelt!`, 'success');
        return;
      }

      // 2. Interactive Stove click during Cooking Stir phase
      if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'stir') {
        if (Math.abs(cx - activeTask.stoveX) < 55 && cy > 180 && cy < 330) {
          performStirAction();
          return;
        }
      }

      // 3. Clickable Room Doors inside Canvas
      for (const door of doorHotspots) {
        if (cx >= door.x && cx <= door.x + door.w && cy >= door.y && cy <= door.y + door.h) {
          switchRoom(door.targetRoom, door.entryX);
          return;
        }
      }

      // 4. Otherwise walk character to clicked floor spot!
      const clampedX = Math.max(55, Math.min(canvas.width - 55, cx));
      const floorBaseY = canvas.height - 62;
      const clampedZ = Math.max(-14, Math.min(26, cy - floorBaseY));
      player.targetX = clampedX;
      player.targetZ = clampedZ;
    });
  }

  if (backToEditorBtn) {
    backToEditorBtn.addEventListener('click', () => {
      stateManager.setState('EDITOR');
    });
  }

  if (playFromHomeBtn) {
    playFromHomeBtn.addEventListener('click', () => {
      stateManager.setState('BACKGROUND_SELECT');
    });
  }

  // --- PHYSICS & TASK UPDATE ---
  function updateMovementAndTasks() {
    const w = canvas.width;
    let vx = 0;
    let vz = 0;
    const speed = 3.6;

    if (keys.left || holdPad.left) vx -= speed;
    if (keys.right || holdPad.right) vx += speed;
    if (keys.up) vz -= 1.8;
    if (keys.down) vz += 1.8;

    if (vx === 0 && vz === 0 && player.targetX !== null) {
      const dx = player.targetX - player.x;
      const dz = (player.targetZ ?? 0) - player.z;
      if (Math.abs(dx) > 4) {
        vx = Math.sign(dx) * Math.min(speed, Math.abs(dx));
      } else {
        player.targetX = null;
      }
      if (Math.abs(dz) > 2) {
        vz = Math.sign(dz) * Math.min(1.8, Math.abs(dz));
      } else {
        player.targetZ = null;
      }
    }

    player.x = Math.max(52, Math.min(w - 52, player.x + vx));
    player.z = Math.max(-14, Math.min(26, player.z + vz));
    if (vx !== 0) {
      player.facing = vx > 0 ? 1 : -1;
    }

    // Jump gravity
    if (player.yOffset < 0 || player.vy < 0) {
      player.yOffset += player.vy;
      player.vy += 0.55;
      if (player.yOffset >= 0) {
        player.yOffset = 0;
        player.vy = 0;
      }
    }

    // Determine Pose
    if (player.yOffset < -2) {
      player.pose = 'jump';
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
    } else if (Math.abs(vx) > 0.2 || Math.abs(vz) > 0.2) {
      player.pose = activeTask && activeTask.type === 'clean' ? 'clean' : 'walk';
    } else {
      player.pose = 'idle';
    }

    // Task Proximity Checks
    if (activeTask) {
      if (activeTask.type === 'cook') {
        if (activeTask.phase === 'gather') {
          let newlyCollected = false;
          activeTask.targets.forEach((t) => {
            if (!t.collected && Math.abs(player.x - t.x) < 42) {
              t.collected = true;
              newlyCollected = true;
              spawnFX('sparkle', t.x, 275, 7);
            }
          });
          const done = activeTask.targets.filter((t) => t.collected).length;
          if (newlyCollected) {
            if (done === activeTask.targets.length) {
              activeTask.phase = 'stir';
              setTaskBanner('🍳 Kochen (2/2): Super! Lauf jetzt zum Herd & tippe auf "🥄 Rühren!" (oder Leertaste)!', true);
            } else {
              setTaskBanner(`🍳 Kochen (1/2): Zutaten einsammeln! (${done}/3)`, false);
            }
          }
        } else if (activeTask.phase === 'stir') {
          const nearStove = Math.abs(player.x - activeTask.stoveX) <= 75;
          if (stirBtn) {
            stirBtn.classList.toggle('hidden', !nearStove);
          }
          if (nearStove && Math.abs(vx) < 0.1 && player.poseTimer === 0) {
            player.pose = 'cook';
          }
        }
      } else if (activeTask.type === 'clean') {
        let swept = false;
        activeTask.targets.forEach((t) => {
          if (!t.collected && Math.abs(player.x - t.x) < 38) {
            t.collected = true;
            swept = true;
            player.pose = 'clean';
            player.poseTimer = 18;
            spawnFX('sparkle', t.x, 315, 8);
          }
        });
        if (swept) {
          const done = activeTask.targets.filter((t) => t.collected).length;
          if (done === activeTask.targets.length) {
            const res = HomeManager.cleanHouse();
            activeTask = null;
            setTaskBanner('✨ Blitzblank geputzt! Alles strahlt wieder!', false);
            if (res.ok) {
              updateUI();
              renderShopGrid();
              notifyMoneyOrMissionChange();
              spawnFX('coin', player.x, 220, 10);
              showToast(`🧹 Alles sauber gefegt! +${res.bonusCoins} 🪙 Fleiß-Bonus!`, 'success');
            }
          } else {
            setTaskBanner(`🧹 Putzen: Weiter fegen! (${done}/${activeTask.targets.length})`, false);
          }
        }
      } else if (activeTask.type === 'garden') {
        let tended = false;
        activeTask.targets.forEach((t) => {
          if (!t.collected && Math.abs(player.x - t.x) < 42) {
            t.collected = true;
            tended = true;
            player.pose = 'water';
            player.poseTimer = 26;
            spawnFX(activeTask.mode === 'harvest' ? 'coin' : 'water', t.x, 285, 8);
          }
        });
        if (tended) {
          const done = activeTask.targets.filter((t) => t.collected).length;
          if (done === activeTask.targets.length) {
            const res = HomeManager.waterOrHarvestGarden();
            activeTask = null;
            if (res.ok && res.action === 'harvest') {
              setTaskBanner('🍎 Garten abgeerntet! Schau dir deine Blüten & Bäume an!', false);
              spawnFX('coin', player.x, 200, 10);
              showToast(`🌾 Reiche Garten-Ernte! +${res.bonusCoins} 🪙 verdient!`, 'success');
            } else {
              setTaskBanner('🚿 Garten komplett gegossen! Alles blüht auf!', false);
              showToast('🚿 Garten gegossen! Die Pflanzen wachsen!', 'info');
            }
            updateUI();
            renderShopGrid();
            notifyMoneyOrMissionChange();
          } else {
            setTaskBanner(
              activeTask.mode === 'harvest'
                ? `🍎 Ernten: Lauf weiter zu den reifen Pflanzen (${done}/4)`
                : `🚿 Gießen: Lauf weiter zu den Beeten (${done}/4)`,
              false
            );
          }
        }
      } else if (activeTask.type === 'feed_pets' || activeTask.type === 'pet_pets') {
        let cared = false;
        activeTask.targets.forEach((t) => {
          if (!t.collected && Math.abs(player.x - t.x) < 45) {
            t.collected = true;
            cared = true;
            player.pose = 'pet';
            player.poseTimer = 24;
            spawnFX('heart', t.x, 285, 7);
          }
        });
        if (cared) {
          const done = activeTask.targets.filter((t) => t.collected).length;
          if (done === activeTask.targets.length) {
            const isFeed = activeTask.type === 'feed_pets';
            const res = isFeed ? HomeManager.feedPets() : HomeManager.petAnimals();
            activeTask = null;
            setTaskBanner('🐾 Deine Tiere sind überglücklich!', false);
            if (res.ok) {
              updateUI();
              renderShopGrid();
              notifyMoneyOrMissionChange();
              if (isFeed) {
                spawnFX('coin', player.x, 210, 8);
                showToast(`🦴 Alle Tiere gefüttert! +${res.bonusCoins} 🪙 Tierfreund-Bonus!`, 'success');
              } else {
                showToast('🤗 Deine Tiere schnurren & freuen sich riesig!', 'success');
              }
            }
          } else {
            setTaskBanner(`🐾 Weiter zu deinen anderen Tieren! (${done}/${activeTask.targets.length})`, false);
          }
        }
      }
    }
  }

  // --- ROOM-BY-ROOM PAINTERLY SCENE RENDERER ---
  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateMovementAndTasks();

    const w = canvas.width;
    const h = canvas.height;
    const floorY = h - 66;
    const state = HomeManager.getState();
    doorHotspots = [];

    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (activeRoom === 'kitchen') {
      drawKitchenRoom(ctx, w, h, floorY, state);
    } else if (activeRoom === 'bedroom') {
      drawBedroomRoom(ctx, w, h, floorY, state);
    } else if (activeRoom === 'conservatory') {
      drawConservatoryRoom(ctx, w, h, floorY, state);
    } else if (activeRoom === 'garden') {
      drawGardenScene(ctx, w, h, floorY, state);
    } else {
      drawLivingRoom(ctx, w, h, floorY, state);
    }

    // Dirty floor dust overlay if cleanliness is low (and no clean task active)
    if (state.needs.cleanliness < 60 && (!activeTask || activeTask.type !== 'clean')) {
      const specks = state.needs.cleanliness < 35 ? 6 : 3;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
      for (let s = 0; s < specks; s++) {
        ctx.beginPath();
        ctx.ellipse(120 + s * 110, floorY + 18 + (s % 2) * 8, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Active Task Visual Targets inside Room
    drawActiveTaskTargets(ctx, floorY);

    // Animated Vector Pets (rendered in current room / garden)
    drawRoomPets(ctx, floorY, state);

    // Character (Walks & Animates smoothly inside the active room!)
    const drawY = floorY + 12 + player.z + player.yOffset;
    ctx.save();
    ctx.translate(player.x, drawY);
    ctx.scale(0.86, 0.86);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    // Thought prompt if hungry
    if (state.needs.hunger < 40 && (!activeTask || activeTask.type !== 'cook')) {
      drawFloatingHint(ctx, player.x, drawY - 134, 'Hunger!', '#f43f5e');
    }

    // Sparkling Lucky Find
    if (!activeFind) {
      nextFindTimer--;
      if (nextFindTimer <= 0) {
        const finds = [
          { label: '+10 🪙', coins: 10 },
          { label: '+14 🪙', coins: 14 },
          { label: '+8 🪙', coins: 8 }
        ];
        const pick = finds[Math.floor(Math.random() * finds.length)];
        activeFind = {
          ...pick,
          x: 110 + Math.random() * (w - 220),
          y: floorY - 35 - Math.random() * 90
        };
      }
    } else {
      const bob = Math.sin(animFrame * 0.1) * 5;
      ctx.save();
      const glow = ctx.createRadialGradient(activeFind.x, activeFind.y + bob, 4, activeFind.x, activeFind.y + bob, 26);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(activeFind.x, activeFind.y + bob, 26, 0, Math.PI * 2);
      ctx.fill();

      // Faceted Gold Star Coin
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(activeFind.x, activeFind.y + bob, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(activeFind.x - 4, activeFind.y + bob - 4, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.fillText('Klick!', activeFind.x, activeFind.y + bob - 20);
      ctx.restore();
    }

    // Painterly Particle FX
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 48);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    rafId = requestAnimationFrame(drawScene);
  }

  // --- INTERIOR ROOM PAINTERS (100% Full-Stage, Zero Emojis) ---

  function drawDoorPortal(ctx, x, y, w, h, label, targetRoom, entryX = 140) {
    doorHotspots.push({ x, y, w, h, targetRoom, entryX });
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.beginPath();
    ctx.roundRect(x - 6, y - 6, w + 12, h + 6, [18, 18, 0, 0]);
    ctx.fill();

    const dGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    dGrad.addColorStop(0, '#fbcfe8');
    dGrad.addColorStop(1, '#c084fc');
    ctx.fillStyle = dGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [14, 14, 0, 0]);
    ctx.fill();

    // Door handle
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x + w - 12, y + h * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();

    // Crisp sign above door
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 26, w + 16, 20, [10]);
    ctx.fill();
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#831843';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y - 16);
    ctx.restore();
  }

  function drawLivingRoom(ctx, w, h, floorY, state) {
    // Warm sunlit cream-blush plaster walls
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#fff7f9');
    wallGrad.addColorStop(0.65, '#fdf2f8');
    wallGrad.addColorStop(1, '#fce7f3');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, floorY);

    // Architectural Wainscot Panelling & Baseboard
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, floorY - 68, w, 68);
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(0, floorY - 70, w, 4);
    for (let px = 24; px < w - 100; px += 110) {
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, floorY - 56, 86, 44);
    }

    // Warm Honey-Oak Hardwood Floor with Perspective Planks
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#f3d5b5');
    floorGrad.addColorStop(1, '#d4a373');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.strokeStyle = 'rgba(146, 64, 14, 0.16)';
    ctx.lineWidth = 1.5;
    for (let fx = -60; fx <= w + 60; fx += 72) {
      ctx.beginPath();
      ctx.moveTo(fx, floorY);
      ctx.lineTo(w / 2 + (fx - w / 2) * 1.35, h);
      ctx.stroke();
    }

    // Tall Sunlit Arched Window Looking Out at Garden
    ctx.save();
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(295, 58, 145, 165, [72, 72, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.arc(367, 228, 74, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(295, 58, 145, 165, [72, 72, 4, 4]);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(367, 58);
    ctx.lineTo(367, 223);
    ctx.moveTo(295, 148);
    ctx.lineTo(440, 148);
    ctx.stroke();

    // Diagonal Sunbeam Shaft onto Floor
    ctx.fillStyle = 'rgba(254, 249, 195, 0.22)';
    ctx.beginPath();
    ctx.moveTo(295, 223);
    ctx.lineTo(440, 223);
    ctx.lineTo(525, h);
    ctx.lineTo(240, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // String Lights across top if owned
    if (HomeManager.hasItem('decor', 'lights')) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, 26);
      ctx.quadraticCurveTo(w / 2, 52, w - 20, 26);
      ctx.stroke();
      for (let lx = 40; lx < w - 40; lx += 44) {
        const ly = 28 + Math.sin((lx / w) * Math.PI) * 18;
        ctx.fillStyle = (animFrame + lx) % 40 < 20 ? '#fef08a' : '#f9a8d4';
        ctx.beginPath();
        ctx.arc(lx, ly, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Framed Landscape Painting
    if (HomeManager.hasItem('decor', 'painting')) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(75, 86, 86, 62, [6]);
      ctx.fill();
      const artG = ctx.createLinearGradient(83, 94, 83, 140);
      artG.addColorStop(0, '#7dd3fc');
      artG.addColorStop(1, '#f472b6');
      ctx.fillStyle = artG;
      ctx.fillRect(83, 94, 70, 46);
    }

    // Trophy Shelf
    if (HomeManager.hasItem('decor', 'trophy_shelf')) {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(185, 112, 82, 8, [3]);
      ctx.fill();
      [205, 232].forEach((tx) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.roundRect(tx - 6, 94, 12, 14, [2, 2, 6, 6]);
        ctx.fill();
        ctx.fillRect(tx - 2, 107, 4, 5);
      });
    }

    // Smart TV on wall
    if (HomeManager.hasItem('furniture', 'tv')) {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.roundRect(176, 134, 96, 58, [8]);
      ctx.fill();
      const tvGrad = ctx.createLinearGradient(182, 140, 266, 186);
      tvGrad.addColorStop(0, '#38bdf8');
      tvGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = tvGrad;
      ctx.beginPath();
      ctx.roundRect(182, 140, 84, 46, [5]);
      ctx.fill();
    }

    // Bookshelf
    if (HomeManager.hasItem('decor', 'bookshelf')) {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(475, floorY - 148, 68, 148, [6, 6, 0, 0]);
      ctx.fill();
      const bColors = ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a855f7'];
      for (let shelf = 0; shelf < 3; shelf++) {
        const sy = floorY - 138 + shelf * 46;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(481, sy, 56, 36);
        for (let b = 0; b < 4; b++) {
          ctx.fillStyle = bColors[(shelf + b) % bColors.length];
          ctx.fillRect(485 + b * 12, sy + 8, 9, 28);
        }
      }
    }

    // Aquarium
    if (HomeManager.hasItem('furniture', 'aquarium')) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(558, floorY - 76, 76, 76, [6, 6, 0, 0]);
      ctx.fill();
      const aqG = ctx.createLinearGradient(562, floorY - 122, 562, floorY - 76);
      aqG.addColorStop(0, '#67e8f9');
      aqG.addColorStop(1, '#0284c7');
      ctx.fillStyle = aqG;
      ctx.beginPath();
      ctx.roundRect(562, floorY - 122, 68, 46, [6]);
      ctx.fill();
      // Swimming vector fish
      const fx = 582 + Math.sin(animFrame * 0.06) * 16;
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.ellipse(fx, floorY - 98, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Woven Plush Rug
    if (HomeManager.hasItem('decor', 'rug')) {
      const rugG = ctx.createLinearGradient(120, floorY, 380, floorY + 28);
      rugG.addColorStop(0, '#fbcfe8');
      rugG.addColorStop(0.5, '#f472b6');
      rugG.addColorStop(1, '#ec4899');
      ctx.fillStyle = rugG;
      ctx.beginPath();
      ctx.ellipse(255, floorY + 14, 130, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tufted Velvet Sofa
    if (HomeManager.hasItem('furniture', 'sofa')) {
      const sofaG = ctx.createLinearGradient(70, floorY - 62, 200, floorY);
      sofaG.addColorStop(0, '#f472b6');
      sofaG.addColorStop(1, '#be185d');
      ctx.fillStyle = sofaG;
      ctx.beginPath();
      ctx.roundRect(70, floorY - 56, 136, 46, [14, 14, 6, 6]);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.roundRect(84, floorY - 38, 52, 22, [8]);
      ctx.roundRect(140, floorY - 38, 52, 22, [8]);
      ctx.fill();
      // Sofa legs
      ctx.fillStyle = '#d97706';
      ctx.fillRect(78, floorY - 10, 8, 10);
      ctx.fillRect(188, floorY - 10, 8, 10);
    }

    // Grand Rose-Gold Piano
    if (HomeManager.hasItem('furniture', 'piano')) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(230, floorY - 72, 84, 72, [8, 8, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(236, floorY - 38, 72, 10);
      ctx.fillStyle = '#1e1b4b';
      for (let k = 0; k < 6; k++) {
        ctx.fillRect(240 + k * 11, floorY - 38, 5, 6);
      }
    }

    // Gaming Desk
    if (HomeManager.hasItem('furniture', 'gaming_setup')) {
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.roundRect(355, floorY - 46, 86, 46, [6, 6, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(374, floorY - 82, 48, 30, [4]);
      ctx.fill();
    }

    // Indoor Monstera Plant
    if (HomeManager.hasItem('decor', 'plant')) {
      ctx.fillStyle = '#f9a8d4';
      ctx.beginPath();
      ctx.moveTo(42, floorY - 30);
      ctx.lineTo(66, floorY - 30);
      ctx.lineTo(62, floorY);
      ctx.lineTo(46, floorY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#10b981';
      [-0.5, 0, 0.5].forEach((a) => {
        ctx.save();
        ctx.translate(54, floorY - 34);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, -14, 7, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Robot Helper gliding gently
    if (HomeManager.hasItem('supplies', 'robot_helper')) {
      const rx = 250 + Math.sin(animFrame * 0.03) * 85;
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.ellipse(rx, floorY + 6, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(rx, floorY + 4, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Doorways to Kitchen & Garden
    drawDoorPortal(ctx, w - 102, floorY - 148, 74, 148, 'Küche ➔', 'kitchen', 110);
  }

  function drawKitchenRoom(ctx, w, h, floorY, state) {
    const isDeluxe = HomeManager.hasItem('expansions', 'kitchen');

    // Sunlit Mint-Cream Kitchen Walls
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#f0fdfa');
    wallGrad.addColorStop(1, '#fce7f3');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, floorY);

    // Scalloped Pastel Backsplash Tiles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, floorY - 145, 500, 62);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.14)';
    ctx.lineWidth = 1.5;
    for (let tx = 100; tx <= 600; tx += 36) {
      ctx.beginPath();
      ctx.moveTo(tx, floorY - 145);
      ctx.lineTo(tx, floorY - 83);
      ctx.stroke();
    }

    // Polished Checkered Marble Floor
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#fff5f7');
    floorGrad.addColorStop(1, '#fbcfe8');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);
    for (let cx = 0; cx < w; cx += 64) {
      ctx.fillStyle = 'rgba(244, 114, 182, 0.14)';
      ctx.fillRect(cx, floorY, 32, h - floorY);
    }

    // Sunlit Kitchen Herb Window
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(380, 44, 140, 108, [12]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.stroke();

    // Retro Rounded Pastel Fridge (Left-Center)
    const fridgeGrad = ctx.createLinearGradient(125, floorY - 175, 205, floorY);
    fridgeGrad.addColorStop(0, isDeluxe ? '#f9a8d4' : '#a5f3fc');
    fridgeGrad.addColorStop(1, isDeluxe ? '#ec4899' : '#06b6d4');
    ctx.fillStyle = fridgeGrad;
    ctx.beginPath();
    ctx.roundRect(125, floorY - 175, isDeluxe ? 88 : 74, 175, [18, 18, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(128, floorY - 72, isDeluxe ? 82 : 68, 3);
    ctx.beginPath();
    ctx.roundRect(136, floorY - 140, 6, 36, [3]);
    ctx.roundRect(136, floorY - 56, 6, 26, [3]);
    ctx.fill();

    // Kitchen Counter & Quartz Top
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(230, floorY - 82, 340, 82, [8, 8, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.roundRect(226, floorY - 88, 348, 12, [6]);
    ctx.fill();

    // Sleek Oven & Glowing Cooktop at x = 470
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.roundRect(432, floorY - 74, 76, 66, [6]);
    ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.roundRect(442, floorY - 58, 56, 36, [4]);
    ctx.fill();

    // Simmering Pot on Burner (x = 470)
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(448, floorY - 110, 44, 24, [4, 4, 10, 10]);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(445, floorY - 114, 50, 5);

    // Rising Steam Wisps if Cooking
    if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'stir') {
      for (let s = 0; s < 3; s++) {
        const sy = floorY - 122 - ((animFrame * 0.9 + s * 16) % 44);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath();
        ctx.arc(462 + Math.sin(sy * 0.1 + s) * 8, sy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Cooking Progress Bar above Stove
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.roundRect(422, floorY - 152, 96, 14, [7]);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(425, floorY - 149, Math.max(8, (activeTask.stirProgress / 100) * 90), 8, [4]);
      ctx.fill();
    }

    // Dining Table (if owned)
    if (HomeManager.hasItem('furniture', 'table')) {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(592, floorY - 64, 96, 10, [5]);
      ctx.fill();
      ctx.fillRect(606, floorY - 54, 8, 54);
      ctx.fillRect(666, floorY - 54, 8, 54);
    }

    // Pet Food Bowl
    if (HomeManager.hasItem('petItems', 'bowl')) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(594, floorY - 10, 32, 12, [4, 4, 8, 8]);
      ctx.fill();
    }

    // Door back to Living Room
    drawDoorPortal(ctx, 26, floorY - 148, 72, 148, '◀ Wohnzimmer', 'living_room', w - 150);
  }

  function drawBedroomRoom(ctx, w, h, floorY) {
    // Cozy Lavender-Blush Dream Bedroom
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#f5f3ff');
    wallGrad.addColorStop(1, '#fce7f3');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, floorY);

    // Soft Cream Carpet Floor
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#fdf2f8');
    floorGrad.addColorStop(1, '#f5d0fe');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);

    // Tall Balcony Window / Terrace Doors
    const hasBalcony = HomeManager.hasItem('expansions', 'balcony');
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.roundRect(475, 56, 155, floorY - 56, [18, 18, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();
    if (hasBalcony) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(585, 105, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // Plush Canopy / Dream Bed
    const bedHeadGrad = ctx.createLinearGradient(170, floorY - 135, 360, floorY);
    bedHeadGrad.addColorStop(0, '#ec4899');
    bedHeadGrad.addColorStop(1, '#a855f7');
    ctx.fillStyle = bedHeadGrad;
    ctx.beginPath();
    ctx.roundRect(175, floorY - 125, 190, 95, [18, 18, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(168, floorY - 56, 204, 46, [10]);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(228, floorY - 58, 144, 42, [10]);
    ctx.fill();
    // Fluffy Pillows
    ctx.fillStyle = '#fff1f2';
    ctx.beginPath();
    ctx.roundRect(184, floorY - 72, 48, 20, [8]);
    ctx.fill();

    // Door back to Living Room
    drawDoorPortal(ctx, 28, floorY - 148, 72, 148, '◀ Wohnzimmer', 'living_room', 240);
  }

  function drawConservatoryRoom(ctx, w, h, floorY) {
    // Glass Sunroom with Sky & Golden Sunbeams
    const skyG = ctx.createLinearGradient(0, 0, 0, floorY);
    skyG.addColorStop(0, '#7dd3fc');
    skyG.addColorStop(0.6, '#e0f2fe');
    skyG.addColorStop(1, '#fef9c3');
    ctx.fillStyle = skyG;
    ctx.fillRect(0, 0, w, floorY);

    // Curved Conservatory Glass Mullions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 6;
    for (let gx = 120; gx < w; gx += 130) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, floorY);
      ctx.stroke();
    }

    // Lush Tropical Indoor Plants
    [210, 390, 565].forEach((px, i) => {
      ctx.fillStyle = '#f9a8d4';
      ctx.beginPath();
      ctx.roundRect(px - 18, floorY - 40, 36, 40, [6]);
      ctx.fill();
      ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#34d399';
      [-0.6, -0.2, 0.25, 0.65].forEach((a) => {
        ctx.save();
        ctx.translate(px, floorY - 44);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, -24, 10, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    });

    // Warm Stone Terrace Floor
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#fef3c7');
    floorGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);

    drawDoorPortal(ctx, 28, floorY - 148, 72, 148, '◀ Wohnzimmer', 'living_room', 240);
    drawDoorPortal(ctx, w - 102, floorY - 148, 72, 148, 'Garten ➔', 'garden', 110);
  }

  function drawGardenScene(ctx, w, h, floorY, state) {
    // Full Wide Outdoor Dream Garden (NO house cutaway clutter!)
    const skyG = ctx.createLinearGradient(0, 0, 0, floorY);
    skyG.addColorStop(0, '#38bdf8');
    skyG.addColorStop(0.58, '#bae6fd');
    skyG.addColorStop(1, '#fef3c7');
    ctx.fillStyle = skyG;
    ctx.fillRect(0, 0, w, floorY);

    // Sun Glow
    const sunG = ctx.createRadialGradient(w - 90, 62, 6, w - 90, 62, 72);
    sunG.addColorStop(0, '#ffffff');
    sunG.addColorStop(0.45, '#fef08a');
    sunG.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = sunG;
    ctx.beginPath();
    ctx.arc(w - 90, 62, 72, 0, Math.PI * 2);
    ctx.fill();

    // Distant Soft Hills
    const hillG = ctx.createLinearGradient(0, floorY - 110, 0, floorY);
    hillG.addColorStop(0, '#6ee7b7');
    hillG.addColorStop(1, '#10b981');
    ctx.fillStyle = hillG;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.bezierCurveTo(180, floorY - 110, 360, floorY - 40, 520, floorY - 88);
    ctx.bezierCurveTo(640, floorY - 120, 720, floorY - 60, w, floorY - 35);
    ctx.lineTo(w, floorY);
    ctx.closePath();
    ctx.fill();

    // Crisp White Garden Picket Fence
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let fx = 110; fx < w - 20; fx += 34) {
      ctx.beginPath();
      ctx.roundRect(fx, floorY - 38, 12, 38, [6, 6, 0, 0]);
      ctx.fill();
    }

    // Lush Lawn
    const lawnG = ctx.createLinearGradient(0, floorY, 0, h);
    lawnG.addColorStop(0, '#34d399');
    lawnG.addColorStop(1, '#059669');
    ctx.fillStyle = lawnG;
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(0, floorY, w, 6);

    const growth = state.needs.gardenGrowth;

    // Flowerbed
    if (HomeManager.hasItem('garden', 'flowerbed')) {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(145, floorY - 12, 95, 14, [6]);
      ctx.fill();
      [165, 192, 220].forEach((fx, i) => {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(fx - 2, floorY - 28, 4, 16);
        if (growth >= 35) {
          ctx.fillStyle = i % 2 === 0 ? '#f472b6' : '#fde047';
          ctx.beginPath();
          ctx.arc(fx, floorY - 32, growth >= 75 ? 9 : 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Veggies
    if (HomeManager.hasItem('garden', 'veggies')) {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(300, floorY - 12, 95, 14, [6]);
      ctx.fill();
      [320, 348, 376].forEach((vx) => {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(vx, floorY - 18, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Apple Tree
    if (HomeManager.hasItem('garden', 'apple_tree')) {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(496, floorY - 108, 18, 108, [6]);
      ctx.fill();
      const treeG = ctx.createRadialGradient(495, floorY - 135, 8, 505, floorY - 122, 52);
      treeG.addColorStop(0, '#bbf7d0');
      treeG.addColorStop(1, '#059669');
      ctx.fillStyle = treeG;
      ctx.beginPath();
      ctx.arc(505, floorY - 122, 48, 0, Math.PI * 2);
      ctx.fill();
      if (growth >= 65) {
        ctx.fillStyle = '#f43f5e';
        [[485, floorY - 115], [520, floorY - 132], [508, floorY - 98]].forEach(([ax, ay]) => {
          ctx.beginPath();
          ctx.arc(ax, ay, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // Turquoise Pool Deck
    if (HomeManager.hasItem('expansions', 'pool_deck')) {
      const poolG = ctx.createRadialGradient(625, floorY + 26, 8, 625, floorY + 28, 72);
      poolG.addColorStop(0, '#67e8f9');
      poolG.addColorStop(1, '#0891b2');
      ctx.fillStyle = poolG;
      ctx.beginPath();
      ctx.ellipse(625, floorY + 28, 72, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Greenhouse
    if (HomeManager.hasItem('garden', 'greenhouse')) {
      ctx.fillStyle = 'rgba(224, 242, 254, 0.72)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(615, floorY - 82, 86, 82, [28, 28, 0, 0]);
      ctx.fill();
      ctx.stroke();
    }

    // Door back inside to Living Room
    drawDoorPortal(ctx, 24, floorY - 138, 66, 138, '◀ Ins Haus', 'living_room', 240);
  }

  function drawActiveTaskTargets(ctx, floorY) {
    if (!activeTask || !activeTask.targets) return;

    activeTask.targets.forEach((t, idx) => {
      if (t.collected) return;
      const bob = Math.sin(animFrame * 0.1 + idx) * 5;
      const ty = floorY - 26 + bob;

      // Glowing target halo
      const halo = ctx.createRadialGradient(t.x, ty, 3, t.x, ty, 28);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.88)');
      halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(t.x, ty, 28, 0, Math.PI * 2);
      ctx.fill();

      if (activeTask.type === 'cook') {
        // Painted Ingredient Circle + Color Shape
        ctx.fillStyle = t.kind === 'tomato' ? '#f43f5e' : t.kind === 'cheese' ? '#fbbf24' : '#10b981';
        ctx.beginPath();
        ctx.arc(t.x, ty, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.label, t.x, ty - 20);
      } else if (activeTask.type === 'clean') {
        // Soft Dust Cloud to Sweep
        ctx.fillStyle = 'rgba(148, 163, 184, 0.72)';
        ctx.beginPath();
        ctx.arc(t.x - 7, floorY + 8, 9, 0, Math.PI * 2);
        ctx.arc(t.x + 6, floorY + 8, 10, 0, Math.PI * 2);
        ctx.arc(t.x, floorY + 2, 11, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTask.type === 'garden') {
        ctx.fillStyle = activeTask.mode === 'harvest' ? '#f43f5e' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(t.x, ty, 11, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTask.type === 'feed_pets' || activeTask.type === 'pet_pets') {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(t.x, ty + 8);
        ctx.bezierCurveTo(t.x - 13, ty - 1, t.x - 8, ty - 11, t.x, ty - 4);
        ctx.bezierCurveTo(t.x + 8, ty - 11, t.x + 13, ty - 1, t.x, ty + 8);
        ctx.fill();
      }
    });

    // Stove beacon during phase 2 of cooking
    if (activeTask.type === 'cook' && activeTask.phase === 'stir') {
      const pulse = 1 + Math.sin(animFrame * 0.14) * 0.12;
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(activeTask.stoveX, floorY - 100, 26 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawRoomPets(ctx, floorY, state) {
    const petPalette = {
      dog: { body: '#d97706', ear: '#92400e', accent: '#fef3c7' },
      cat: { body: '#f472b6', ear: '#db2777', accent: '#fff1f2' },
      bunny: { body: '#ffffff', ear: '#fbcfe8', accent: '#f472b6' },
      parrot: { body: '#10b981', ear: '#fbbf24', accent: '#38bdf8' },
      turtle: { body: '#059669', ear: '#34d399', accent: '#fbbf24' },
      hamster: { body: '#fbbf24', ear: '#f59e0b', accent: '#ffffff' },
      fox: { body: '#f97316', ear: '#9a3412', accent: '#ffffff' },
      unicorn: { body: '#ffffff', ear: '#f472b6', accent: '#fde047' }
    };

    state.owned.pets.forEach((petId, idx) => {
      const pal = petPalette[petId] || petPalette.dog;
      const basePos = 180 + ((idx * 155) % 440);
      const walkX = basePos + Math.sin(animFrame * 0.025 + idx * 2.1) * 34;
      const hopY = floorY + 12 - Math.abs(Math.sin(animFrame * 0.07 + idx)) * (petId === 'bunny' || petId === 'parrot' ? 12 : 4);
      const dir = Math.cos(animFrame * 0.025 + idx * 2.1) >= 0 ? 1 : -1;

      ctx.save();
      ctx.translate(walkX, hopY);
      ctx.scale(dir, 1);

      // Soft pet ground shadow
      ctx.fillStyle = 'rgba(88, 28, 135, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wagging tail
      ctx.strokeStyle = pal.body;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.quadraticCurveTo(-18, -18 + Math.sin(animFrame * 0.25 + idx) * 4, -16, -22);
      ctx.stroke();

      // 3D-shaded pet body
      const bGrad = ctx.createRadialGradient(-3, -14, 2, 0, -10, 16);
      bGrad.addColorStop(0, pal.accent);
      bGrad.addColorStop(0.65, pal.body);
      bGrad.addColorStop(1, pal.ear);
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.ellipse(0, -10, 13, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute head
      ctx.fillStyle = pal.body;
      ctx.beginPath();
      ctx.arc(10, -18, 9, 0, Math.PI * 2);
      ctx.fill();

      // Ears / Horn
      ctx.fillStyle = pal.ear;
      if (petId === 'bunny') {
        ctx.beginPath();
        ctx.ellipse(8, -32, 3, 9, -0.15, 0, Math.PI * 2);
        ctx.ellipse(13, -31, 3, 8, 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(5, -24);
        ctx.lineTo(7, -31);
        ctx.lineTo(12, -25);
        ctx.closePath();
        ctx.fill();
      }

      if (petId === 'unicorn') {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(12, -25);
        ctx.lineTo(16, -36);
        ctx.lineTo(17, -24);
        ctx.closePath();
        ctx.fill();
      }

      // Glossy eye with catchlight
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(14, -19, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(14.6, -19.7, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  function drawFloatingHint(ctx, x, y, text, bgColor) {
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - 32, y - 14, 64, 24, [12]);
    ctx.fill();
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y - 2);
    ctx.restore();
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(drawScene);
    }
    if (!decayInterval) {
      decayInterval = setInterval(() => {
        HomeManager.tickNeeds();
        updateUI();
      }, 6000);
    }
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (decayInterval) {
      clearInterval(decayInterval);
      decayInterval = null;
    }
  }

  window.addEventListener('runner:coins-updated', () => {
    if (stateManager.getState() === 'HOME') {
      updateUI();
      renderRoomTabs();
      renderShopGrid();
    }
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'HOME') {
      const dailyBonus = HomeManager.claimDailyVisitBonus();
      updateUI();
      renderRoomTabs();
      renderTabs();
      renderShopGrid();
      startLoop();
      if (dailyBonus > 0) {
        spawnFX('coin', 380, 180, 10);
        showToast(`🌟 Tages-Willkommensbonus im Haus: +${dailyBonus} 🪙!`, 'success');
      }
    } else {
      stopLoop();
    }
  });
}
