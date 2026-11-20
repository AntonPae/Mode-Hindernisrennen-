import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { HOME_CATALOG, HomeManager } from './homeData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';
import { drawVectorPet, getPetMeta, PetFollowerController } from './petCompanion.js';

const ROOMS = [
  { id: 'living_room', label: '🛋️ Wohnzimmer', alwaysUnlocked: true },
  { id: 'kitchen', label: '🍳 Küche', alwaysUnlocked: true },
  { id: 'pet_room', label: '🐾 Tierzimmer', unlockItem: 'pet_room' },
  { id: 'bedroom', label: '🛏️ Schlafzimmer', unlockItem: 'bedroom' },
  { id: 'conservatory', label: '🪴 Wintergarten', unlockItem: 'conservatory' },
  { id: 'garden', label: '🌳 Garten', alwaysUnlocked: true }
];

export function setupHomeScreen(stateManager) {
  const canvas = document.getElementById('homeCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsVal = document.getElementById('homeCoinsVal');
  const levelVal = document.getElementById('homeLevelVal');
  const toastEl = document.getElementById('homeToast');
  const roomTabsEl = document.getElementById('homeRoomTabs');
  const taskTextEl = document.getElementById('homeTaskText');
  const stirBtn = document.getElementById('homeStirBtn');

  const walkLeftBtn = document.getElementById('homeWalkLeftBtn');
  const walkRightBtn = document.getElementById('homeWalkRightBtn');
  const jumpBtn = document.getElementById('homeJumpBtn');

  const petRoomBar = document.getElementById('homePetRoomBar');
  const pickAllPetsBtn = document.getElementById('homePickAllPetsBtn');
  const leaveAllPetsBtn = document.getElementById('homeLeaveAllPetsBtn');
  const openPetShopBtn = document.getElementById('homeOpenPetShopBtn');

  const fridgeBar = document.getElementById('homeFridgeBar');
  const fridgeStockSummary = document.getElementById('homeFridgeStockSummary');
  const fridgeEatSnackBtn = document.getElementById('homeFridgeEatSnackBtn');
  const fridgeCookBtn = document.getElementById('homeFridgeCookBtn');
  const fridgeMarketBtn = document.getElementById('homeFridgeMarketBtn');
  const fridgeCloseBtn = document.getElementById('homeFridgeCloseBtn');

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
  const homeLeashAllBtn = document.getElementById('homeLeashAllBtn');

  const backToEditorBtn = document.getElementById('homeToEditorBtn');
  const playFromHomeBtn = document.getElementById('homeToGameBtn');

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
  let petHotspots = [];
  let fridgeHotspot = null;
  let fridgeOpen = false;
  const petFollowers = new PetFollowerController();
  const fxParticles = [];
  let activeFind = null;
  let nextFindTimer = 210;
  let gardenGateOpen = 0;
  let edgeCooldown = 0;

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

  function updateFridgeUI() {
    const state = HomeManager.getState();
    const show = activeRoom === 'kitchen' && fridgeOpen;
    if (fridgeBar) {
      fridgeBar.classList.toggle('hidden', !show);
    }
    if (fridgeStockSummary) {
      const food = state.inventory.food || 0;
      const snacks = state.inventory.fridgeSnacks || 0;
      fridgeStockSummary.textContent = `🧊 Im Kühlschrank: ${food} Koch-Zutaten · ${snacks} Frische Snacks`;
    }
    if (fridgeEatSnackBtn) {
      const snacks = state.inventory.fridgeSnacks || 0;
      fridgeEatSnackBtn.disabled = snacks <= 0;
      fridgeEatSnackBtn.textContent = snacks > 0
        ? `🍓 Snack aus Kühlschrank (${snacks})`
        : '🍓 Keine Snacks mehr';
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
      const catalogItem = HOME_CATALOG.expansions.find((e) => e.id === room.unlockItem);
      showToast(`🏗️ "${catalogItem ? catalogItem.name : room.label}" kannst du im 🛋️ Möbel- & Bau-Kaufhaus kaufen!`, 'info');
      stateManager.setState('STORE', { shopId: 'furniture', aisle: 'expansions', from: 'HOME' });
      return false;
    }

    activeRoom = roomId;
    activeTask = null;
    activeFind = null;
    fridgeOpen = false;
    player.x = entryX !== null ? entryX : 240;
    player.z = 0;
    player.targetX = null;
    player.targetZ = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    petFollowers.reset(player.x, canvas ? canvas.height - 54 : 336);
    if (petRoomBar) {
      petRoomBar.classList.toggle('hidden', activeRoom !== 'pet_room');
    }
    updateFridgeUI();
    renderRoomTabs();
    if (activeRoom === 'pet_room') {
      setTaskBanner('🐾 Tierzimmer: Hier bleiben deine Tiere! Tippe ein Tier an, um es abzuholen & mitzunehmen!', false);
    } else if (activeRoom === 'kitchen') {
      setTaskBanner('🍳 Küche: Dein Essen liegt sicher im 🧊 Kühlschrank – tippe auf den Kühlschrank zum Öffnen!', false);
    } else {
      setTaskBanner(`Du bist jetzt in: ${room.label.replace(/^[^\s]+\s/, '')} · Klicke auf den Boden oder gehe frei von Raum zu Raum!`, false);
    }
    return true;
  }

  function renderRoomTabs() {
    if (!roomTabsEl) return;
    const stayingCount = HomeManager.getStayingPets().length;
    roomTabsEl.innerHTML = '';
    ROOMS.forEach((room) => {
      const unlocked = isRoomUnlocked(room);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-room-tab${activeRoom === room.id ? ' active' : ''}${!unlocked ? ' locked' : ''}`;
      if (room.id === 'pet_room' && unlocked && stayingCount > 0) {
        btn.textContent = `${room.label} (${stayingCount})`;
      } else {
        btn.textContent = unlocked ? room.label : `🔒 ${room.label.replace(/^[^\s]+\s/, '')}`;
      }
      btn.addEventListener('click', () => switchRoom(room.id));
      roomTabsEl.appendChild(btn);
    });
  }

  function updateUI() {
    const state = HomeManager.getState();
    const level = ShopManager.getStats().level;
    if (coinsVal) coinsVal.textContent = ShopManager.getCoins();
    if (levelVal) levelVal.textContent = level;

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

    if (foodCountEl) foodCountEl.textContent = (state.inventory.food || 0) + (state.inventory.fridgeSnacks || 0);
    if (petFoodCountEl) petFoodCountEl.textContent = state.inventory.petFood || 0;
    updateFridgeUI();

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

  // --- INTERACTIVE MOVEMENT TASKS ---

  function takeIngredientsFromFridge() {
    if (!activeTask || activeTask.type !== 'cook' || activeTask.phase !== 'fridge') return;
    fridgeOpen = true;
    activeTask.phase = 'stir';
    spawnFX('sparkle', activeTask.fridgeX, 240, 9);
    updateFridgeUI();
    setTaskBanner('🍳 Kochen (2/2): Zutaten aus dem Kühlschrank geholt! Lauf jetzt zum Herd & tippe auf "🥄 Rühren!" (oder Leertaste)!', true);
    showToast('🧊 Frische Zutaten aus dem Kühlschrank genommen – ab zum Herd!', 'success');
  }

  function startCookingTask() {
    const state = HomeManager.getState();
    if ((state.inventory.food || 0) <= 0) {
      showToast('🧊 Dein Kühlschrank hat keine Koch-Zutaten mehr! Kauf neue im 🛒 Supermarkt in der Stadt.', 'warn');
      return;
    }
    if (activeRoom !== 'kitchen') {
      switchRoom('kitchen', 110);
    }
    fridgeOpen = true;
    updateFridgeUI();
    activeTask = {
      type: 'cook',
      phase: 'fridge',
      stirProgress: 0,
      fridgeX: 168,
      stoveX: 470
    };
    setTaskBanner('🧊 Kochen (1/2): Geh links zum Kühlschrank (oder tippe ihn an), um die frischen Zutaten herauszuholen!', false);
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
        { id: 'g1', x: 300, collected: false },
        { id: 'g2', x: 405, collected: false },
        { id: 'g3', x: 515, collected: false },
        { id: 'g4', x: 615, collected: false }
      ]
    };
    setTaskBanner(
      isHarvest
        ? '🍎 Ernten: Lauf durchs Gartentor zu allen 4 reifen Stellen & pflücke die Ernte! (0/4)'
        : '🚿 Gießen: Lauf durchs Gartentor zu allen 4 Gartenbeeten & gieße die Pflanzen! (0/4)',
      false
    );
  }

  function startPetTask(mode) {
    const state = HomeManager.getState();
    if (state.owned.pets.length === 0) {
      showToast('🐾 Du hast noch kein Tier! Besuch die 🐾 Tierhandlung in der Stadt.', 'warn');
      return;
    }
    if (mode === 'feed' && (state.inventory.petFood || 0) <= 0) {
      showToast('🦴 Kein Tierfutter mehr! Kauf Nachschub im 🛒 Supermarkt oder der 🐾 Tierhandlung.', 'warn');
      return;
    }
    if (HomeManager.hasPetRoom() && activeRoom !== 'pet_room') {
      switchRoom('pet_room', 120);
    }
    const list = state.owned.pets.slice(0, 5);
    activeTask = {
      type: mode === 'feed' ? 'feed_pets' : 'pet_pets',
      targets: list.map((petId, idx) => ({
        id: petId,
        x: 170 + idx * (list.length > 1 ? Math.min(130, 440 / (list.length - 1)) : 0),
        collected: false
      }))
    };
    setTaskBanner(
      mode === 'feed'
        ? `🦴 Füttern: Lauf zu deinen Tieren, um sie zu füttern! (0/${activeTask.targets.length})`
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
    fridgeOpen = false;
    updateFridgeUI();
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

  if (cookBtn) cookBtn.addEventListener('click', startCookingTask);
  if (cleanBtn) cleanBtn.addEventListener('click', startCleaningTask);
  if (feedPetsBtn) feedPetsBtn.addEventListener('click', () => startPetTask('feed'));
  if (petAnimalsBtn) petAnimalsBtn.addEventListener('click', () => startPetTask('pet'));
  if (gardenBtn) gardenBtn.addEventListener('click', startGardenTask);

  if (fridgeEatSnackBtn) {
    fridgeEatSnackBtn.addEventListener('click', () => {
      const res = HomeManager.eatFridgeSnack();
      if (res.ok) {
        player.pose = 'pet';
        player.poseTimer = 22;
        spawnFX('heart', player.x, 220, 9);
        updateUI();
        showToast('🍓 Leckerer Snack aus dem Kühlschrank! +25% Sättigung!', 'success');
      } else {
        showToast('🧊 Keine Snacks mehr im Kühlschrank! Kauf neue im 🛒 Supermarkt in der Stadt!', 'info');
      }
    });
  }

  if (fridgeCookBtn) {
    fridgeCookBtn.addEventListener('click', () => {
      const state = HomeManager.getState();
      if ((state.inventory.food || 0) <= 0) {
        showToast('🧊 Keine Koch-Zutaten im Kühlschrank! Kauf welche im 🛒 Supermarkt.', 'warn');
        return;
      }
      activeTask = {
        type: 'cook',
        phase: 'stir',
        stirProgress: 0,
        fridgeX: 168,
        stoveX: 470
      };
      fridgeOpen = false;
      updateFridgeUI();
      player.targetX = 470;
      setTaskBanner('🍳 Kochen: Lauf zum Herd in der Mitte & tippe auf "🥄 Rühren!"', true);
    });
  }

  if (fridgeMarketBtn) {
    fridgeMarketBtn.addEventListener('click', () => {
      stateManager.setState('STORE', { shopId: 'supermarket', aisle: 'fridge', from: 'HOME' });
    });
  }

  if (fridgeCloseBtn) {
    fridgeCloseBtn.addEventListener('click', () => {
      fridgeOpen = false;
      updateFridgeUI();
    });
  }

  if (homeLeashAllBtn) {
    homeLeashAllBtn.addEventListener('click', () => {
      const state = HomeManager.getState();
      const sitting = HomeManager.getSittingCompanions();
      if (!state.owned.pets.length && !sitting.length) {
        showToast('🐾 Besuch die 🐾 Tierhandlung in der Stadt oder hol Hunde bei den Nachbarn ab!', 'info');
        return;
      }
      if (state.owned.pets.length > 0) {
        HomeManager.setAllCompanions(true);
      }
      const total = state.owned.pets.length + sitting.length;
      updateUI();
      renderRoomTabs();
      spawnFX('heart', player.x, 230, 12);
      showToast(`🐕 Alle ${total} Tiere gleichzeitig an der Leine! Sie laufen jetzt überall mit dir mit!`, 'success');
    });
  }

  if (pickAllPetsBtn) {
    pickAllPetsBtn.addEventListener('click', () => {
      const state = HomeManager.getState();
      if (!state.owned.pets.length) {
        showToast('🐾 Kauf dir zuerst ein Tier in der 🐾 Tierhandlung in der Stadt!', 'info');
        return;
      }
      HomeManager.setAllCompanions(true);
      updateUI();
      renderRoomTabs();
      spawnFX('heart', player.x, 230, 12);
      showToast('🐾 Alle deine Tiere abgeholt! Sie begleiten dich jetzt überall hin!', 'success');
    });
  }

  if (leaveAllPetsBtn) {
    leaveAllPetsBtn.addEventListener('click', () => {
      HomeManager.setAllCompanions(false);
      updateUI();
      renderRoomTabs();
      spawnFX('sparkle', player.x, 240, 10);
      showToast('🏠 Deine Tiere bleiben jetzt gemütlich im Tierzimmer!', 'info');
    });
  }

  if (openPetShopBtn) {
    openPetShopBtn.addEventListener('click', () => {
      stateManager.setState('STORE', { shopId: 'petshop', aisle: 'petItems', from: 'HOME' });
    });
  }

  // Movement Key & Touch Pad Listeners
  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'HOME') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (document.querySelector('.modal:not(.hidden)')) return;

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
        notifyMoneyOrMissionChange();
        showToast(`✨ Glücksfund entdeckt! +${reward} 🪙 eingesammelt!`, 'success');
        return;
      }

      // 2. Interactive Refrigerator click in Kitchen (all food is inside the fridge!)
      if (activeRoom === 'kitchen' && fridgeHotspot &&
          cx >= fridgeHotspot.x && cx <= fridgeHotspot.x + fridgeHotspot.w &&
          cy >= fridgeHotspot.y && cy <= fridgeHotspot.y + fridgeHotspot.h) {
        if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'fridge') {
          takeIngredientsFromFridge();
        } else {
          fridgeOpen = !fridgeOpen;
          updateFridgeUI();
          spawnFX('sparkle', fridgeHotspot.x + fridgeHotspot.w / 2, fridgeHotspot.y + 45, 5);
          showToast(fridgeOpen ? '🧊 Kühlschrank geöffnet – hier ist dein ganzes Essen!' : '🧊 Kühlschrank geschlossen.', 'info');
        }
        return;
      }

      // 2b. Interactive Stove click during Cooking Stir phase
      if (activeTask && activeTask.type === 'cook' && activeTask.phase === 'stir') {
        if (Math.abs(cx - activeTask.stoveX) < 55 && cy > 180 && cy < 330) {
          performStirAction();
          return;
        }
      }

      // 2c. Tap directly on a Pet in the room/garden to take it everywhere with you (or leave it in Tierzimmer)!
      for (let i = petHotspots.length - 1; i >= 0; i--) {
        const ph = petHotspots[i];
        if (Math.hypot(cx - ph.x, cy - ph.y) <= ph.r) {
          if (ph.isSitting) {
            const meta = getPetMeta(ph.petRef || ph.petId);
            HomeManager.cuddleCompanionPet(ph.petId);
            spawnFX('heart', ph.x, ph.y - 16, 9);
            showToast(`❤️ ${meta.name} (Pflege-Tier) wedelt fröhlich & läuft überall mit dir mit!`, 'success');
            updateUI();
            return;
          }
          const res = HomeManager.toggleCompanionPet(ph.petId);
          if (res.ok) {
            const meta = getPetMeta(ph.petId);
            const hasPetRoom = HomeManager.hasPetRoom();
            if (res.active) {
              HomeManager.cuddleCompanionPet(ph.petId);
              spawnFX('heart', ph.x, ph.y - 16, 9);
              showToast(
                hasPetRoom
                  ? `🐾 ${meta.name} im Tierzimmer abgeholt! Es kommt jetzt überall mit!`
                  : `🐾 ${meta.name} kommt jetzt überall mit! Tippe es unterwegs an zum Streicheln.`,
                'success'
              );
            } else {
              spawnFX('sparkle', ph.x, ph.y - 14, 6);
              showToast(
                hasPetRoom
                  ? `🐾 ${meta.name} bleibt jetzt gemütlich im Tierzimmer!`
                  : `🏡 ${meta.name} bleibt gemütlich zuhause.`,
                'info'
              );
            }
            updateUI();
            renderRoomTabs();
          }
          return;
        }
      }

      // 3. Clickable Open Archways, Mailbox & Garden Gates inside Canvas
      for (const door of doorHotspots) {
        if (cx >= door.x && cx <= door.x + door.w && cy >= door.y && cy <= door.y + door.h) {
          if (door.targetRoom === 'action:MAILBOX') {
            window.dispatchEvent(new CustomEvent('runner:open-mailbox', { detail: { tab: 'inbox' } }));
            return;
          }
          if (door.targetRoom === 'state:PETSITTING') {
            stateManager.setState('PETSITTING');
            return;
          }
          if (door.targetRoom === 'state:TOWN') {
            stateManager.setState('TOWN', { from: 'HOME' });
            return;
          }
          switchRoom(door.targetRoom, door.entryX);
          return;
        }
      }

      // 4. Otherwise walk character to clicked floor spot!
      const clampedX = Math.max(55, Math.min(canvas.width - 55, cx));
      const floorBaseY = canvas.height - 62;
      let clampedZ = Math.max(-14, Math.min(26, cy - floorBaseY));
      // If crossing the garden picket fence at x = 246, aim through the Gartentor height (z = 6)
      if (activeRoom === 'garden' && ((player.x < 246 && clampedX >= 246) || (player.x >= 246 && clampedX < 246))) {
        clampedZ = 6;
      }
      player.targetX = clampedX;
      player.targetZ = clampedZ;
    });
  }

  if (backToEditorBtn) {
    backToEditorBtn.addEventListener('click', () => {
      stateManager.setState('EDITOR');
    });
  }

  const homeToIceCreamBtn = document.getElementById('homeToIceCreamBtn');
  if (homeToIceCreamBtn) {
    homeToIceCreamBtn.addEventListener('click', () => {
      stateManager.setState('ICECREAM');
    });
  }

  const homeToTownBtn = document.getElementById('homeToTownBtn');
  if (homeToTownBtn) {
    homeToTownBtn.addEventListener('click', () => {
      stateManager.setState('TOWN', { from: 'HOME' });
    });
  }

  const homeToPetSitBtn = document.getElementById('homeToPetSitBtn');
  if (homeToPetSitBtn) {
    homeToPetSitBtn.addEventListener('click', () => {
      stateManager.setState('PETSITTING');
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
    if (edgeCooldown > 0) edgeCooldown--;

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

    let nextX = Math.max(46, Math.min(w - 46, player.x + vx));
    let nextZ = Math.max(-14, Math.min(26, player.z + vz));

    // In the Garden, you MUST go through the Gartentor (x = 246, z = -4..16)!
    if (activeRoom === 'garden') {
      const gateX = 246;
      const crossingGate = (player.x < gateX && nextX >= gateX) || (player.x >= gateX && nextX < gateX);
      if (crossingGate && (nextZ < -4 || nextZ > 16)) {
        // Gently guide character into the Gartentor path!
        nextZ += nextZ < -4 ? 1.8 : -1.8;
        if (nextZ < -6 || nextZ > 18) {
          nextX = player.x;
        }
      }
      const nearGate = Math.abs(nextX - gateX) < 55;
      gardenGateOpen += ((nearGate ? 1 : 0) - gardenGateOpen) * 0.16;
    }

    player.x = nextX;
    player.z = nextZ;
    if (vx !== 0) {
      player.facing = vx > 0 ? 1 : -1;
    }

    // Open-archway seamless walking between rooms (no closed doors blocking!)
    if (!activeTask && edgeCooldown <= 0) {
      if (activeRoom === 'living_room' && player.x >= w - 52 && vx > 0) {
        edgeCooldown = 36;
        switchRoom('kitchen', 110);
        return;
      }
      if (activeRoom === 'living_room' && player.x <= 52 && vx < 0) {
        edgeCooldown = 36;
        stateManager.setState('TOWN', { from: 'HOME' });
        return;
      }
      if (activeRoom === 'kitchen' && player.x <= 52 && vx < 0) {
        edgeCooldown = 36;
        switchRoom('living_room', w - 115);
        return;
      }
      if (activeRoom === 'kitchen' && player.x >= w - 52 && vx > 0) {
        edgeCooldown = 36;
        switchRoom('garden', 290);
        return;
      }
      if (activeRoom === 'pet_room' && player.x <= 52 && vx < 0) {
        edgeCooldown = 36;
        switchRoom('living_room', 590);
        return;
      }
      if (activeRoom === 'garden' && player.x <= 125 && vx < 0) {
        edgeCooldown = 36;
        switchRoom('living_room', w - 130);
        return;
      }
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
        if (activeTask.phase === 'fridge') {
          if (Math.abs(player.x - activeTask.fridgeX) < 52) {
            takeIngredientsFromFridge();
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
    fridgeHotspot = null;

    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (activeRoom === 'kitchen') {
      drawKitchenRoom(ctx, w, h, floorY, state);
    } else if (activeRoom === 'pet_room') {
      drawPetRoom(ctx, w, h, floorY, state);
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

    // Character (Walks & Animates smoothly inside the active room!)
    const drawY = floorY + 12 + player.z + player.yOffset;

    // Animated Vector Pets (roaming pets + companion pets following you!)
    drawRoomPets(ctx, floorY, state, drawY);

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

  // Open arched passage (NO closed door in the way!), except garden gates when style === 'gate'
  function drawDoorPortal(ctx, x, y, w, h, label, targetRoom, entryX = 140, style = 'arch') {
    doorHotspots.push({ x, y, w, h, targetRoom, entryX });
    ctx.save();
    if (style === 'gate') {
      // Garden Gate Portal (white picket gate frame + warm wooden gate)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 5, y + 36, 10, h - 36, [4]);
      ctx.roundRect(x + w - 5, y + 36, 10, h - 36, [4]);
      ctx.fill();

      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 48, w - 8, h - 48, [10, 10, 4, 4]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.beginPath();
      ctx.roundRect(x - 10, y + 18, w + 20, 22, [11]);
      ctx.fill();
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#047857';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + w / 2, y + 29);
      ctx.restore();
      return;
    }

    // Open Sunlit Archway (no blocking door!)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x - 6, y - 6, w + 12, h + 6, [34, 34, 0, 0]);
    ctx.fill();

    const archGrad = ctx.createLinearGradient(x, y, x, y + h);
    archGrad.addColorStop(0, '#bae6fd');
    archGrad.addColorStop(0.65, '#fdf2f8');
    archGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = archGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [28, 28, 0, 0]);
    ctx.fill();

    // Crisp sign above open archway
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 26, w + 20, 20, [10]);
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

    // Crystal Chandelier (Level 4)
    if (HomeManager.hasItem('decor', 'chandelier')) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(368, 0);
      ctx.lineTo(368, 22);
      ctx.stroke();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(338, 22);
      ctx.lineTo(398, 22);
      ctx.lineTo(384, 38);
      ctx.lineTo(352, 38);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      [346, 368, 390].forEach((cx) => {
        ctx.beginPath();
        ctx.arc(cx, 20, 4, 0, Math.PI * 2);
        ctx.fill();
      });
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

    // Smart TV or Home Cinema (Level 5) on wall
    if (HomeManager.hasItem('furniture', 'home_cinema')) {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.roundRect(160, 118, 130, 78, [10]);
      ctx.fill();
      const cinGrad = ctx.createLinearGradient(168, 126, 282, 188);
      cinGrad.addColorStop(0, '#fb7185');
      cinGrad.addColorStop(0.5, '#a855f7');
      cinGrad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = cinGrad;
      ctx.beginPath();
      ctx.roundRect(168, 126, 114, 62, [6]);
      ctx.fill();
    } else if (HomeManager.hasItem('furniture', 'tv')) {
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
      ctx.roundRect(446, floorY - 148, 66, 148, [6, 6, 0, 0]);
      ctx.fill();
      const bColors = ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a855f7'];
      for (let shelf = 0; shelf < 3; shelf++) {
        const sy = floorY - 138 + shelf * 46;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(452, sy, 54, 36);
        for (let b = 0; b < 4; b++) {
          ctx.fillStyle = bColors[(shelf + b) % bColors.length];
          ctx.fillRect(456 + b * 12, sy + 8, 9, 28);
        }
      }
    }

    // Aquarium
    if (HomeManager.hasItem('furniture', 'aquarium')) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(520, floorY - 76, 70, 76, [6, 6, 0, 0]);
      ctx.fill();
      const aqG = ctx.createLinearGradient(524, floorY - 122, 524, floorY - 76);
      aqG.addColorStop(0, '#67e8f9');
      aqG.addColorStop(1, '#0284c7');
      ctx.fillStyle = aqG;
      ctx.beginPath();
      ctx.roundRect(524, floorY - 122, 62, 46, [6]);
      ctx.fill();
      // Swimming vector fish
      const fx = 542 + Math.sin(animFrame * 0.06) * 14;
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

    // DJ Booth (Level 3)
    if (HomeManager.hasItem('furniture', 'dj_booth')) {
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.roundRect(450, floorY - 52, 82, 52, [8, 8, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(474, floorY - 54, 12, 0, Math.PI * 2);
      ctx.arc(508, floorY - 54, 12, 0, Math.PI * 2);
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

    // Open archways — left to Traumstadt & right to Tierzimmer (if owned) + Kitchen (no closed doors!)
    drawDoorPortal(ctx, 14, floorY - 144, 62, 144, '◀ Stadt', 'state:TOWN', 155, 'arch');
    if (HomeManager.hasPetRoom()) {
      drawDoorPortal(ctx, 602, floorY - 142, 64, 142, '🐾 Tierzimmer', 'pet_room', 125, 'arch');
      drawDoorPortal(ctx, 678, floorY - 148, 68, 148, 'Küche ➔', 'kitchen', 110, 'arch');
    } else {
      drawDoorPortal(ctx, w - 102, floorY - 148, 74, 148, 'Küche ➔', 'kitchen', 110, 'arch');
    }
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

    // Retro Rounded Interactive Pastel Fridge (Left-Center — ALL FOOD LIVES INSIDE!)
    const fridgeX = 124;
    const fridgeY = floorY - 176;
    const fridgeW = isDeluxe ? 92 : 78;
    const fridgeH = 176;
    fridgeHotspot = { x: fridgeX - 6, y: fridgeY - 10, w: fridgeW + (fridgeOpen ? 44 : 12), h: fridgeH + 10 };

    if (fridgeOpen) {
      // Glowing open fridge interior shelves stocked with neat food!
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(fridgeX, fridgeY, fridgeW, fridgeH, [16, 16, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = isDeluxe ? '#ec4899' : '#06b6d4';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Interior cool light glow
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(fridgeX + 10, fridgeY + 8, fridgeW - 20, 7);

      // Shelf dividers & neatly stocked food inside the refrigerator!
      const shelfYs = [fridgeY + 46, fridgeY + 84, fridgeY + 122];
      shelfYs.forEach((sy) => {
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(fridgeX + 6, sy, fridgeW - 12, 4);
      });

      const foodAmt = state.inventory.food || 0;
      const snackAmt = state.inventory.fridgeSnacks || 0;
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (foodAmt + snackAmt > 0) {
        ctx.fillText('🥛', fridgeX + 24, fridgeY + 32);
        ctx.fillText('🧀', fridgeX + 54, fridgeY + 32);
        ctx.fillText('🍅', fridgeX + 24, fridgeY + 70);
        ctx.fillText('🍓', fridgeX + 54, fridgeY + 70);
        ctx.fillText('🍎', fridgeX + 26, fridgeY + 108);
        ctx.fillText('🌿', fridgeX + 54, fridgeY + 108);
      } else {
        ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Leer!', fridgeX + fridgeW / 2, fridgeY + 80);
      }

      // Swung-open fridge door on the right edge
      const doorGrad = ctx.createLinearGradient(fridgeX + fridgeW, fridgeY, fridgeX + fridgeW + 34, fridgeY + fridgeH);
      doorGrad.addColorStop(0, isDeluxe ? '#f9a8d4' : '#a5f3fc');
      doorGrad.addColorStop(1, isDeluxe ? '#ec4899' : '#06b6d4');
      ctx.fillStyle = doorGrad;
      ctx.beginPath();
      ctx.roundRect(fridgeX + fridgeW - 2, fridgeY + 4, 34, fridgeH - 6, [4, 14, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fridgeX + fridgeW + 6, fridgeY + 48, 22, 4);
      ctx.fillRect(fridgeX + fridgeW + 6, fridgeY + 96, 22, 4);
    } else {
      const fridgeGrad = ctx.createLinearGradient(fridgeX, fridgeY, fridgeX + fridgeW, floorY);
      fridgeGrad.addColorStop(0, isDeluxe ? '#f9a8d4' : '#a5f3fc');
      fridgeGrad.addColorStop(1, isDeluxe ? '#ec4899' : '#06b6d4');
      ctx.fillStyle = fridgeGrad;
      ctx.beginPath();
      ctx.roundRect(fridgeX, fridgeY, fridgeW, fridgeH, [18, 18, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fridgeX + 3, floorY - 72, fridgeW - 6, 3);
      ctx.beginPath();
      ctx.roundRect(fridgeX + 11, floorY - 140, 6, 36, [3]);
      ctx.roundRect(fridgeX + 11, floorY - 56, 6, 26, [3]);
      ctx.fill();
    }

    // Crisp clickable badge above Fridge
    const totalFridgeItems = (state.inventory.food || 0) + (state.inventory.fridgeSnacks || 0);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.roundRect(fridgeX - 6, fridgeY - 26, fridgeW + 14, 20, [10]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0369a1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🧊 Kühlschrank (${totalFridgeItems})`, fridgeX + fridgeW / 2 + 1, fridgeY - 16);

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

    // Open archways back to Living Room & straight into Garden
    drawDoorPortal(ctx, 26, floorY - 148, 72, 148, '◀ Wohnzimmer', 'living_room', w - 150, 'arch');
    drawDoorPortal(ctx, w - 102, floorY - 148, 72, 148, 'Garten ➔', 'garden', 290, 'arch');
  }

  function drawPetRoom(ctx, w, h, floorY, state) {
    // Cozy Warm Mint-Peach Pet Room Walls
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#ecfeff');
    wallGrad.addColorStop(0.65, '#fdf2f8');
    wallGrad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, floorY);

    // Subtle decorative paw-print wallpaper dots
    ctx.fillStyle = 'rgba(236, 72, 153, 0.1)';
    for (let px = 65; px < w - 50; px += 95) {
      const py = 54 + ((px / 95) % 2) * 32;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.arc(px - 6, py - 8, 3, 0, Math.PI * 2);
      ctx.arc(px, py - 10, 3, 0, Math.PI * 2);
      ctx.arc(px + 6, py - 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pastel Wood Floor + Big Soft Rainbow Play Rug
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#fde68a');
    floorGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);

    const rugG = ctx.createLinearGradient(150, floorY, 590, floorY + 34);
    rugG.addColorStop(0, '#fbcfe8');
    rugG.addColorStop(0.5, '#bae6fd');
    rugG.addColorStop(1, '#a7f3d0');
    ctx.fillStyle = rugG;
    ctx.beginPath();
    ctx.ellipse(385, floorY + 18, 225, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Cheerful Window looking out at sunny trees
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(295, 56, 155, 118, [18]);
    ctx.fill();
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(372, 174, 62, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(295, 56, 155, 118, [18]);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(372, 56);
    ctx.lineTo(372, 174);
    ctx.stroke();

    // Cute Pet Room Wall Plaque
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(286, 16, 174, 28, [14]);
    ctx.fill();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '800 12px "Outfit", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐾 Mein Tierzimmer', 373, 30);

    // Pet Items inside the Tierzimmer (bought in "🧸 Tiersachen"!)
    // 1. Bubble Bath Tub (Schaum-Wanne)
    if (HomeManager.hasItem('petItems', 'pet_bath')) {
      ctx.save();
      ctx.fillStyle = '#e0f2fe';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(102, floorY - 32, 68, 32, [6, 6, 18, 18]);
      ctx.fill();
      ctx.stroke();
      // Bubbles
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      [0, 1, 2, 3].forEach((b) => {
        const by = floorY - 34 - ((animFrame * 0.4 + b * 9) % 18);
        ctx.beginPath();
        ctx.arc(114 + b * 14, by, 5 + (b % 2) * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 2. Golden Food Bowl (Gold-Napf)
    if (HomeManager.hasItem('petItems', 'bowl')) {
      ctx.save();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(178, floorY - 12, 38, 14, [4, 4, 9, 9]);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.fillRect(182, floorY - 14, 30, 5);
      ctx.restore();
    }

    // 3. Bubbling Water Fountain (Trink-Brunnen)
    if (HomeManager.hasItem('petItems', 'water_fountain')) {
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(224, floorY - 16, 40, 16, [6]);
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(240, floorY - 34, 8, 20);
      const sp = Math.sin(animFrame * 0.22) * 3;
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.arc(244, floorY - 38 + sp, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Fluffy Star Cushion (Kuschelkissen)
    if (HomeManager.hasItem('petItems', 'pet_cushion')) {
      ctx.save();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(302, floorY + 4, 34, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fdf2f8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // 5. Cozy Pet Bed Basket (Tierkörbchen)
    if (HomeManager.hasItem('petItems', 'pet_bed')) {
      ctx.save();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(386, floorY - 2, 42, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(386, floorY - 4, 32, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Play Ball (Spielball)
    if (HomeManager.hasItem('petItems', 'ball')) {
      const rollX = 452 + Math.sin(animFrame * 0.04) * 14;
      ctx.save();
      ctx.translate(rollX, floorY - 10);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-3, -3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Rainbow Play Tunnel (Spiel-Tunnel)
    if (HomeManager.hasItem('petItems', 'pet_tunnel')) {
      ctx.save();
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.roundRect(486, floorY - 40, 68, 40, [20, 20, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(500, floorY - 40, 14, 40);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(524, floorY - 40, 14, 40);
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(490, floorY - 18, 8, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. Spinning Hamster Wheel (Laufrad)
    if (HomeManager.hasItem('petItems', 'hamster_wheel')) {
      ctx.save();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(576, floorY);
      ctx.lineTo(590, floorY - 30);
      ctx.lineTo(604, floorY);
      ctx.stroke();

      ctx.translate(590, floorY - 32);
      ctx.rotate(animFrame * 0.05);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 2;
      for (let s = 0; s < 4; s++) {
        const a = (s * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 20, Math.sin(a) * 20);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 9. Cat Climbing Tree (Kletterbaum)
    if (HomeManager.hasItem('petItems', 'cat_tree')) {
      ctx.save();
      ctx.fillStyle = '#92400e';
      ctx.fillRect(634, floorY - 10, 56, 10);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(656, floorY - 115, 12, 106);
      ctx.fillStyle = '#f9a8d4';
      ctx.beginPath();
      ctx.roundRect(628, floorY - 72, 66, 12, [6]);
      ctx.roundRect(634, floorY - 122, 56, 12, [6]);
      ctx.fill();
      // Dangling toy ball
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(644, floorY - 72);
      ctx.lineTo(644, floorY - 50);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(644, floorY - 48, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 10. Cozy Pet House / Tent (Hundehütte)
    if (HomeManager.hasItem('petItems', 'pet_house')) {
      ctx.save();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.moveTo(698, floorY - 62);
      ctx.lineTo(746, floorY - 36);
      ctx.lineTo(698, floorY - 36);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(698, floorY - 36, 48, 36);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(712, floorY - 26, 20, 26, [10, 10, 0, 0]);
      ctx.fill();
      ctx.restore();
    }

    // Helpful wall hint if no pets or no pet items yet
    if (state.owned.petItems.length === 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.roundRect(220, floorY - 78, 320, 30, [15]);
      ctx.fill();
      ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#9d174d';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧸 Kauf Tiersachen im Shop – sie erscheinen direkt hier!', 380, floorY - 63);
      ctx.restore();
    }

    // Open archway back to Living Room
    drawDoorPortal(ctx, 18, floorY - 144, 68, 144, '◀ Wohnzimmer', 'living_room', 590, 'arch');
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
    // Full Wide Outdoor Dream Garden WITH THE FULL HOUSE VISIBLE ON THE LEFT & GARTENTOR!
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

    // FULL HOUSE EXTERIOR VISIBLE FROM THE GARDEN (left side x: 10..210)
    ctx.save();
    const hasUpper = HomeManager.hasItem('expansions', 'bedroom');
    const hasConserv = HomeManager.hasItem('expansions', 'conservatory');
    const hasBalcony = HomeManager.hasItem('expansions', 'balcony');

    // House Chimney
    ctx.fillStyle = '#db2777';
    ctx.fillRect(46, hasUpper ? 44 : 88, 20, 42);

    // Upper floor if unlocked
    if (hasUpper) {
      ctx.fillStyle = '#fdf2f8';
      ctx.beginPath();
      ctx.roundRect(22, 92, 160, 74, [8, 8, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Upper pitched roof
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(8, 98);
      ctx.lineTo(102, 42);
      ctx.lineTo(196, 98);
      ctx.closePath();
      ctx.fill();

      // Upper bedroom window + balcony railing
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(54, 108, 42, 34, [8]);
      ctx.roundRect(114, 108, 42, 34, [8]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (hasBalcony) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(104, 146, 86, 6);
        for (let bx = 110; bx <= 182; bx += 14) {
          ctx.fillRect(bx, 132, 4, 18);
        }
      }
    } else {
      // Single-story pitched roof
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(8, 168);
      ctx.lineTo(102, 96);
      ctx.lineTo(196, 168);
      ctx.closePath();
      ctx.fill();
    }

    // Ground Floor Walls
    const wallG = ctx.createLinearGradient(18, 164, 18, floorY);
    wallG.addColorStop(0, '#fff1f2');
    wallG.addColorStop(1, '#fce7f3');
    ctx.fillStyle = wallG;
    ctx.beginPath();
    ctx.roundRect(18, 164, 168, floorY - 164, [4, 4, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Conservatory glass side-room if built!
    if (hasConserv) {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.78)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(184, floorY - 96, 44, 96, [18, 18, 0, 0]);
      ctx.fill();
      ctx.stroke();
    }

    // Cozy Living Room / Kitchen Windows on House Exterior
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(34, floorY - 122, 44, 46, [10]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.fillRect(38, floorY - 118, 36, 38);

    // House Name Banner on Facade
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(30, floorY - 156, 138, 22, [11]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏡 Dein Traumhaus', 99, floorY - 145);

    // Observatory glass dome on roof (Level 6)
    if (HomeManager.hasItem('expansions', 'observatory')) {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(146, hasUpper ? 64 : 114, 24, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
    }

    // Open House Archway leading straight inside (no door blocking!)
    drawDoorPortal(ctx, 102, floorY - 108, 58, 108, '◀ Ins Haus', 'living_room', w - 130, 'arch');
    ctx.restore();

    // Physical Mailbox outside Dein Traumhaus (with clickable hotspot!)
    if (HomeManager.hasMailbox()) {
      const isGold = HomeManager.hasItem('garden', 'gold_mailbox');
      const unread = MailboxManager.getUnreadCount();
      const mbX = 204;
      const mbY = floorY;
      doorHotspots.push({ x: mbX - 24, y: mbY - 68, w: 48, h: 72, targetRoom: 'action:MAILBOX' });
      ctx.save();
      // Post
      ctx.fillStyle = '#78350f';
      ctx.fillRect(mbX - 4, mbY - 38, 8, 38);
      // Mailbox box
      ctx.fillStyle = isGold ? '#fbbf24' : '#ec4899';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(mbX - 18, mbY - 60, 36, 24, [12, 12, 4, 4]);
      ctx.fill();
      ctx.stroke();
      // Flag up if mail waiting
      ctx.fillStyle = unread > 0 ? '#ef4444' : '#cbd5e1';
      ctx.fillRect(mbX + 16, unread > 0 ? mbY - 72 : mbY - 54, 4, 18);
      if (unread > 0) {
        const bob = Math.sin(animFrame * 0.12) * 3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(mbX - 24, mbY - 88 + bob, 48, 20, [10]);
        ctx.fill();
        ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#be185d';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📩 ${unread}`, mbX, mbY - 78 + bob);
      }
      ctx.restore();
    }

    // Crisp White Garden Picket Fence along background & dividing House Terrace from Garden
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    for (let fx = 248; fx < w - 20; fx += 34) {
      ctx.beginPath();
      ctx.roundRect(fx, floorY - 38, 12, 38, [6, 6, 0, 0]);
      ctx.fill();
    }
    ctx.fillRect(246, floorY - 26, w - 266, 5);

    // Lush Lawn & House Terrace Stone Patio
    const lawnG = ctx.createLinearGradient(0, floorY, 0, h);
    lawnG.addColorStop(0, '#34d399');
    lawnG.addColorStop(1, '#059669');
    ctx.fillStyle = lawnG;
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(0, floorY, w, 6);

    // Stone Terrace under the House (x: 0..246)
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, floorY, 246, h - floorY);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, floorY, 246, 6);

    // GARDEN FENCE + SWINGING GARTENTOR at x = 246!
    ctx.save();
    // Solid fence posts above/below gate path
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(240, floorY - 46, 12, 46, [5]);
    ctx.roundRect(240, floorY + 26, 12, h - floorY - 26, [4]);
    ctx.fill();

    // Swinging Wooden Gartentor!
    ctx.translate(246, floorY - 2);
    ctx.rotate(-gardenGateOpen * 1.15);
    ctx.fillStyle = '#fde68a';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-5, -24, 10, 48, [4]);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Gartentor Badge
    ctx.save();
    ctx.fillStyle = gardenGateOpen > 0.3 ? '#10b981' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(206, floorY - 72, 82, 22, [11]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = gardenGateOpen > 0.3 ? '#ffffff' : '#047857';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪 Gartentor', 247, floorY - 61);
    ctx.restore();

    const growth = state.needs.gardenGrowth;

    // Flowerbed
    if (HomeManager.hasItem('garden', 'flowerbed')) {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(275, floorY - 12, 88, 14, [6]);
      ctx.fill();
      [294, 319, 344].forEach((fx, i) => {
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
      ctx.roundRect(386, floorY - 12, 88, 14, [6]);
      ctx.fill();
      [404, 430, 456].forEach((vx) => {
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
      ctx.roundRect(516, floorY - 108, 18, 108, [6]);
      ctx.fill();
      const treeG = ctx.createRadialGradient(515, floorY - 135, 8, 525, floorY - 122, 52);
      treeG.addColorStop(0, '#bbf7d0');
      treeG.addColorStop(1, '#059669');
      ctx.fillStyle = treeG;
      ctx.beginPath();
      ctx.arc(525, floorY - 122, 48, 0, Math.PI * 2);
      ctx.fill();
      if (growth >= 65) {
        ctx.fillStyle = '#f43f5e';
        [[505, floorY - 115], [540, floorY - 132], [528, floorY - 98]].forEach(([ax, ay]) => {
          ctx.beginPath();
          ctx.arc(ax, ay, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // Turquoise Pool Deck
    if (HomeManager.hasItem('expansions', 'pool_deck')) {
      const poolG = ctx.createRadialGradient(600, floorY + 26, 8, 600, floorY + 28, 66);
      poolG.addColorStop(0, '#67e8f9');
      poolG.addColorStop(1, '#0891b2');
      ctx.fillStyle = poolG;
      ctx.beginPath();
      ctx.ellipse(600, floorY + 28, 66, 17, 0, 0, Math.PI * 2);
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
      ctx.roundRect(585, floorY - 82, 76, 82, [26, 26, 0, 0]);
      ctx.fill();
      ctx.stroke();
    }

    // Garden Fountain (Level 4)
    if (HomeManager.hasItem('garden', 'fountain')) {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(348, floorY + 26, 28, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(348, floorY + 24, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(344, floorY - 12, 8, 36);
      const spray = Math.sin(animFrame * 0.2) * 3;
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(348, floorY - 18 + spray, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hammock (Level 5)
    if (HomeManager.hasItem('garden', 'hammock')) {
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(418, floorY - 46);
      ctx.lineTo(418, floorY);
      ctx.moveTo(504, floorY - 46);
      ctx.lineTo(504, floorY);
      ctx.stroke();
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(418, floorY - 38);
      ctx.quadraticCurveTo(461, floorY - 8, 504, floorY - 38);
      ctx.stroke();
    }

    // Rainbow Slide (Level 6)
    if (HomeManager.hasItem('garden', 'rainbow_slide')) {
      ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8'].forEach((col, i) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(552, floorY - 72 + i * 3);
        ctx.quadraticCurveTo(582, floorY - 22 + i * 3, 624, floorY - 4 + i * 3);
        ctx.stroke();
      });
    }

    // Pet House in Garden (Hundehütte)
    if (HomeManager.hasItem('petItems', 'pet_house')) {
      ctx.save();
      const hy = floorY + 22;
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(262, hy - 30, 40, 30);
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(256, hy - 30);
      ctx.lineTo(282, hy - 50);
      ctx.lineTo(308, hy - 30);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(273, hy - 20, 18, 20, [9, 9, 0, 0]);
      ctx.fill();
      ctx.restore();
    }

    // Neighbor Gartentor on the right side of the Garden!
    drawDoorPortal(ctx, w - 92, floorY - 138, 72, 138, 'Nachbarn 🐾 ▶', 'state:PETSITTING', 140, 'gate');
  }

  function drawActiveTaskTargets(ctx, floorY) {
    if (!activeTask) return;

    // Cooking Phase 1: Highlight the Kühlschrank itself (NO food floating in the room!)
    if (activeTask.type === 'cook' && activeTask.phase === 'fridge') {
      const pulse = 1 + Math.sin(animFrame * 0.14) * 0.12;
      ctx.save();
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(118, floorY - 182, 92 * pulse, 184, [18]);
      ctx.stroke();
      ctx.restore();
      return;
    }

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
      return;
    }

    if (!activeTask.targets) return;

    activeTask.targets.forEach((t, idx) => {
      if (t.collected) return;
      const bob = Math.sin(animFrame * 0.1 + idx) * 5;
      const ty = floorY - 26 + bob;

      const halo = ctx.createRadialGradient(t.x, ty, 3, t.x, ty, 28);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.88)');
      halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(t.x, ty, 28, 0, Math.PI * 2);
      ctx.fill();

      if (activeTask.type === 'clean') {
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
  }

  function drawRoomPets(ctx, floorY, state, playerDrawY) {
    petHotspots = [];
    const hasPetRoom = HomeManager.hasPetRoom();
    const companionIds = HomeManager.getCompanionPets();
    const roamingPets = state.owned.pets.filter((id) => !companionIds.includes(id));

    // 1. Companion pets walk right beside you (with leashes / follow badge)
    petFollowers.update(player.x, playerDrawY, player.facing, {
      minX: 38,
      maxX: canvas.width - 38,
      minY: floorY - 4,
      maxY: floorY + 38
    });
    petFollowers.followers.forEach((f, idx) => {
      const meta = getPetMeta(f.petRef || f.id);
      ctx.save();
      ctx.strokeStyle = meta.collar;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(player.x + player.facing * 10, playerDrawY - 38);
      ctx.quadraticCurveTo((player.x + f.x) / 2, Math.max(playerDrawY, f.y) - 8, f.x + f.facing * 8, f.y - 12);
      ctx.stroke();
      ctx.restore();

      drawVectorPet(ctx, f.petRef || f.id, f.x, f.y, {
        frame: animFrame + idx * 17,
        facing: f.facing,
        scale: 0.96,
        isWalking: f.isWalking,
        tapBounce: f.tapBounce,
        badgeText: f.isSitting
          ? `🐾 ${meta.name} (Sitten)`
          : activeRoom === 'pet_room'
            ? '🎒 Kommt mit · Hier lassen'
            : '🎒 Kommt mit',
        badgeColor: f.isSitting ? '#0284c7' : '#059669'
      });
      petHotspots.push({ petId: f.id, petRef: f.petRef, isSitting: f.isSitting, x: f.x, y: f.y - 14, r: 36 });
    });

    // 2. If Tierzimmer is owned, non-companion pets ALWAYS stay inside pet_room so you can pick them up there!
    const shouldShowStayingPets = hasPetRoom ? activeRoom === 'pet_room' : true;
    if (shouldShowStayingPets) {
      roamingPets.forEach((petId, idx) => {
        const spots = [190, 305, 390, 495, 595, 655];
        const basePos = activeRoom === 'pet_room'
          ? spots[idx % spots.length]
          : 180 + ((idx * 145) % 460);
        const walkX = basePos + Math.sin(animFrame * 0.024 + idx * 2.1) * 32;
        const walkY = floorY + 14 + (idx % 2 === 0 ? -4 : 6);
        const dir = Math.cos(animFrame * 0.024 + idx * 2.1) >= 0 ? 1 : -1;

        drawVectorPet(ctx, petId, walkX, walkY, {
          frame: animFrame + idx * 23,
          facing: dir,
          scale: 1,
          isWalking: true,
          badgeText: hasPetRoom ? '👆 Abholen' : '👆 Mitnehmen',
          badgeColor: '#db2777'
        });
        petHotspots.push({ petId, x: walkX, y: walkY - 14, r: 38 });
      });
    }
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
    }
  });

  window.addEventListener('runner:level-up', (e) => {
    const lv = e.detail?.level;
    const newHome = lv ? HomeManager.getItemsForLevel(lv) : [];
    const listText = newHome.length > 0 ? ` Neu in den Stadt-Geschäften: ${newHome.map((i) => `${i.icon} ${i.name}`).join(', ')}` : '';
    if (stateManager.getState() === 'HOME' && lv) {
      updateUI();
      showToast(`🎉 Level ${lv} erreicht! (+${e.detail.bonusCoins} 🪙)${listText}`, 'success');
    }
  });

  stateManager.onStateChange((newState, payload) => {
    if (newState === 'HOME') {
      const dailyBonus = HomeManager.claimDailyVisitBonus();
      const mailRes = MailboxManager.ensureDailyMail();
      if (payload && payload.room) {
        switchRoom(payload.room, payload.room === 'garden' ? 285 : 240);
      } else {
        fridgeOpen = false;
        petFollowers.reset(player.x, canvas ? canvas.height - 54 : 336);
        if (petRoomBar) petRoomBar.classList.toggle('hidden', activeRoom !== 'pet_room');
        updateFridgeUI();
      }
      updateUI();
      renderRoomTabs();
      startLoop();
      if (dailyBonus > 0) {
        spawnFX('coin', 380, 180, 10);
        showToast(`🌟 Tages-Willkommensbonus im Haus: +${dailyBonus} 🪙!`, 'success');
      } else if (mailRes.delivered && mailRes.delivered.length > 0) {
        showToast(`📬 ${mailRes.delivered.length} neue Briefe im Briefkasten!`, 'info');
      }
    } else {
      stopLoop();
    }
  });
}
