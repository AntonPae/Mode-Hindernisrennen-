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

export function setupHomeScreen(stateManager) {
  const canvas = document.getElementById('homeCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsVal = document.getElementById('homeCoinsVal');
  const levelVal = document.getElementById('homeLevelVal');
  const homeMysteryBtn = document.getElementById('homeMysteryBtn');
  const toastEl = document.getElementById('homeToast');
  const tabsEl = document.getElementById('homeShopTabs');
  const itemsGridEl = document.getElementById('homeShopGrid');

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
  let animFrame = 0;
  let rafId = null;
  let decayInterval = null;
  let toastTimer = null;
  const fxParticles = [];
  let activeFind = null;
  let nextFindTimer = 180; // ~3 seconds after entering Home

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2800);
  }

  function spawnFX(emoji, x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      fxParticles.push({
        emoji,
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 40,
        vy: -1.1 - Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 1.4,
        life: 55
      });
    }
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
            ? 'linear-gradient(90deg, #22c55e, #4ade80)'
            : clamped >= 35
              ? 'linear-gradient(90deg, #eab308, #facc15)'
              : 'linear-gradient(90deg, #ef4444, #f87171)';
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
        gardenBtn.textContent = '🍎 Ernten (+🪙)';
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
            renderShopGrid();
            spawnFX('✨', 320, 220, 8);
            showToast(`🎉 "${item.name}" gekauft!`, 'success');
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${item.name}"!`, 'warn');
          }
        });
      }

      itemsGridEl.appendChild(card);
    });
  }

  if (homeMysteryBtn) {
    homeMysteryBtn.addEventListener('click', () => {
      const res = HomeManager.buyHomeMysteryBox();
      if (res.ok) {
        updateUI();
        renderShopGrid();
        spawnFX('🎁', 320, 220, 8);
        spawnFX('✨', 360, 200, 6);
        showToast(`🎁 Haus-Überraschung! Freigeschaltet: ${res.item.icon} ${res.item.name}!`, 'success');
      } else if (res.reason === 'all_unlocked') {
        showToast('🏆 Alle aktuell freigeschalteten Haus-Sachen gehören dir schon!', 'info');
      } else if (res.reason === 'insufficient_funds') {
        showToast(`🔒 Noch ${res.missing} 🪙 nötig für die Haus-Überraschung!`, 'warn');
      }
    });
  }

  // Care Actions
  if (cookBtn) {
    cookBtn.addEventListener('click', () => {
      const res = HomeManager.cookMeal();
      if (res.ok) {
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        spawnFX('🍳', 250, 240, 5);
        spawnFX('🪙', 270, 210, 3);
        showToast(`🍽️ Lecker gekocht! +${res.bonusCoins} 🪙 Wohlfühl-Bonus!`, 'success');
      } else if (res.reason === 'no_food') {
        showToast('🥘 Keine Koch-Zutaten mehr! Kauf welche unter "🛒 Vorräte".', 'warn');
      }
    });
  }

  if (cleanBtn) {
    cleanBtn.addEventListener('click', () => {
      const res = HomeManager.cleanHouse();
      if (res.ok) {
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        spawnFX('✨', 200, 260, 8);
        showToast(`🧹 Blitzsauber geputzt! +${res.bonusCoins} 🪙 Fleiß-Bonus!`, 'success');
      } else if (res.reason === 'already_clean') {
        showToast('✨ Deine Wohnung glänzt schon perfekt!', 'info');
      }
    });
  }

  if (feedPetsBtn) {
    feedPetsBtn.addEventListener('click', () => {
      const res = HomeManager.feedPets();
      if (res.ok) {
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        spawnFX('❤️', 360, 260, 6);
        showToast(`🦴 Alle Tiere gefüttert! +${res.bonusCoins} 🪙 Tierfreund-Bonus!`, 'success');
      } else if (res.reason === 'no_pets') {
        showToast('🐾 Du hast noch kein Tier! Hol dir eins unter "🐾 Tiere".', 'warn');
      } else if (res.reason === 'no_pet_food') {
        showToast('🦴 Kein Tierfutter mehr! Kauf Nachschub unter "🛒 Vorräte".', 'warn');
      }
    });
  }

  if (petAnimalsBtn) {
    petAnimalsBtn.addEventListener('click', () => {
      const res = HomeManager.petAnimals();
      if (res.ok) {
        updateUI();
        notifyMoneyOrMissionChange();
        spawnFX('💕', 380, 250, 6);
        showToast('🤗 Deine Tiere schnurren & wedeln vor Freude!', 'success');
      } else {
        showToast('🐾 Hol dir erst ein süßes Tier unter "🐾 Tiere"!', 'warn');
      }
    });
  }

  if (gardenBtn) {
    gardenBtn.addEventListener('click', () => {
      const res = HomeManager.waterOrHarvestGarden();
      if (res.ok) {
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        if (res.action === 'harvest') {
          spawnFX('🍎', 580, 250, 6);
          spawnFX('🪙', 590, 210, 5);
          showToast(`🌾 Reiche Garten-Ernte! +${res.bonusCoins} 🪙 verdient!`, 'success');
        } else {
          spawnFX('💧', 580, 260, 7);
          showToast('🚿 Garten gegossen! Die Pflanzen wachsen!', 'info');
        }
      }
    });
  }

  // Clickable sparkling treasure finds on Home Canvas
  if (canvas) {
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', (e) => {
      if (!activeFind) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;
      if (Math.hypot(clickX - activeFind.x, clickY - activeFind.y) <= 38) {
        const reward = activeFind.coins;
        const icon = activeFind.icon;
        ShopManager.addCoins(reward);
        spawnFX('🪙', activeFind.x, activeFind.y, 7);
        spawnFX('✨', activeFind.x, activeFind.y - 10, 6);
        activeFind = null;
        nextFindTimer = 540 + Math.floor(Math.random() * 300); // ~9-14s
        updateUI();
        renderShopGrid();
        notifyMoneyOrMissionChange();
        showToast(`${icon} Glücksfund im Garten! +${reward} 🪙 eingesammelt!`, 'success');
      }
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

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    const w = canvas.width;
    const h = canvas.height;
    const groundY = h - 55;
    const state = HomeManager.getState();

    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#0ea5e9');
    sky.addColorStop(0.65, '#38bdf8');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, groundY);

    // Smiling Cartoon Sun with Gentle Rays
    ctx.save();
    ctx.translate(w - 72, 54);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 3.5;
    for (let r = 0; r < 8; r++) {
      const a = animFrame * 0.01 + (r * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 32, Math.sin(a) * 32);
      ctx.lineTo(Math.cos(a) * 41, Math.sin(a) * 41);
      ctx.stroke();
    }
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 27, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-7, -3, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 2, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Outlined Drifting Cartoon Clouds
    [
      { x: 115 + Math.sin(animFrame * 0.008) * 14, y: 52, r: 28 },
      { x: 420 + Math.cos(animFrame * 0.007) * 18, y: 46, r: 24 }
    ].forEach((c) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 0.65, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(c.x + c.r * 0.75, c.y - c.r * 0.4, c.r * 0.6, Math.PI * 1.05, Math.PI * 1.9);
      ctx.arc(c.x + c.r * 1.55, c.y, c.r * 0.65, Math.PI * 1.4, Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Soft Distant Cartoon Hills
    ctx.fillStyle = '#86efac';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(380, groundY + 45, 130, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(630, groundY + 55, 155, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Grass Lawn with Outlined Edge
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, groundY, w, 11);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // --- HOUSE STRUCTURE (Left Side) ---
    const hasKitchen = HomeManager.hasItem('expansions', 'kitchen');
    const hasBedroom = HomeManager.hasItem('expansions', 'bedroom');
    const hasConservatory = HomeManager.hasItem('expansions', 'conservatory');

    const houseX = 30;
    const houseW = hasKitchen ? 340 : 250;
    const floorH = 145;
    const houseY = groundY - floorH;

    // Chimney + Animated Smoke Puffs
    const chimX = houseX + 44;
    const chimTopY = hasBedroom ? houseY - 155 : houseY - 52;
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.fillRect(chimX, chimTopY, 24, 34);
    ctx.strokeRect(chimX, chimTopY, 24, 34);
    for (let s = 0; s < 3; s++) {
      const cycle = ((animFrame * 0.55 + s * 22) % 66) / 66;
      ctx.fillStyle = `rgba(255, 255, 255, ${(1 - cycle) * 0.8})`;
      ctx.beginPath();
      ctx.arc(chimX + 12 + Math.sin(cycle * 5) * 6, chimTopY - 8 - cycle * 32, 6 + cycle * 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Upper floor (Anbau: Obergeschoss)
    if (hasBedroom) {
      const upperY = houseY - 115;
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;
      ctx.fillRect(houseX + 10, upperY, 230, 115);
      ctx.strokeRect(houseX + 10, upperY, 230, 115);

      // Pitched Roof on 2nd floor with Cel Highlight
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(houseX - 5, upperY);
      ctx.lineTo(houseX + 125, upperY - 58);
      ctx.lineTo(houseX + 255, upperY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Upper Window with Glass Shine
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(houseX + 190, upperY + 25, 36, 40);
      ctx.strokeRect(houseX + 190, upperY + 25, 36, 40);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(houseX + 196, upperY + 34);
      ctx.lineTo(houseX + 210, upperY + 52);
      ctx.stroke();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;

      // Bed upstairs if owned
      if (HomeManager.hasItem('furniture', 'bed')) {
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(houseX + 35, upperY + 80, 82, 22);
        ctx.strokeRect(houseX + 35, upperY + 80, 82, 22);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(houseX + 40, upperY + 72, 22, 10);
      }
    } else {
      // Main floor roof
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(houseX - 15, houseY);
      ctx.lineTo(houseX + houseW / 2, houseY - 65);
      ctx.lineTo(houseX + houseW + 15, houseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Main Floor Room Walls with Subtle Wall Highlight
    ctx.fillStyle = '#fde68a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.fillRect(houseX, houseY, houseW, floorH);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(houseX + 4, houseY + 4, 18, floorH - 18);
    ctx.strokeRect(houseX, houseY, houseW, floorH);

    // Wooden Floor inside house
    ctx.fillStyle = '#b45309';
    ctx.fillRect(houseX + 2, groundY - 14, houseW - 4, 14);

    // Conservatory Anbau (glass sunroom)
    if (hasConservatory) {
      const conX = houseX + houseW;
      ctx.fillStyle = 'rgba(186, 230, 253, 0.72)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.fillRect(conX, houseY + 25, 76, floorH - 25);
      ctx.strokeRect(conX, houseY + 25, 76, floorH - 25);
      ctx.font = '24px sans-serif';
      ctx.fillText('🪴', conX + 24, groundY - 22);
    }

    // Balcony Anbau
    if (HomeManager.hasItem('expansions', 'balcony')) {
      const bY = hasBedroom ? houseY - 35 : houseY + 15;
      ctx.fillStyle = '#92400e';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(houseX - 24, bY, 34, 8);
      ctx.strokeRect(houseX - 24, bY, 34, 8);
      ctx.strokeRect(houseX - 22, bY - 20, 30, 20);
    }

    // Pool Deck Anbau
    if (HomeManager.hasItem('expansions', 'pool_deck')) {
      ctx.fillStyle = '#0ea5e9';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(395, groundY + 25, 48, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Kitchen counter if Kitchen expansion bought
    if (hasKitchen) {
      const kX = houseX + 245;
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(kX, groundY - 56, 86, 42);
      ctx.strokeRect(kX, groundY - 56, 86, 42);
      ctx.font = '22px sans-serif';
      ctx.fillText('🍳', kX + 10, groundY - 62);
      ctx.fillText('🧊', kX + 50, groundY - 62);
    }

    // --- DECOR & FURNITURE ---
    if (HomeManager.hasItem('decor', 'lights')) {
      for (let lx = houseX + 18; lx < houseX + houseW - 15; lx += 28) {
        ctx.fillStyle = (animFrame + lx) % 40 < 20 ? '#fef08a' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(lx, houseY + 12 + Math.sin(lx) * 4, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (HomeManager.hasItem('decor', 'painting')) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(houseX + 28, houseY + 28, 38, 30);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(houseX + 33, houseY + 33, 28, 20);
    }

    if (HomeManager.hasItem('decor', 'trophy_shelf')) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(houseX + 22, houseY + 66, 46, 6);
      ctx.font = '16px sans-serif';
      ctx.fillText('🏆', houseX + 32, houseY + 63);
    }

    if (HomeManager.hasItem('furniture', 'tv')) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(houseX + 90, houseY + 26, 56, 36);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(houseX + 94, houseY + 30, 48, 28);
    }

    if (HomeManager.hasItem('furniture', 'gaming_setup')) {
      ctx.fillStyle = '#312e81';
      ctx.fillRect(houseX + 195, groundY - 58, 42, 44);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(houseX + 202, groundY - 52, 28, 20);
    }

    if (HomeManager.hasItem('furniture', 'piano')) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(houseX + 90, groundY - 52, 46, 38);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(houseX + 94, groundY - 36, 38, 6);
    }

    if (HomeManager.hasItem('decor', 'lava_lamp')) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🪩', houseX + 150, houseY + 38);
    }

    if (HomeManager.hasItem('decor', 'bookshelf')) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(houseX + 190, houseY + 42, 40, 88);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(houseX + 195, houseY + 50, 10, 18);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(houseX + 207, houseY + 50, 10, 18);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(houseX + 195, houseY + 80, 14, 18);
    }

    if (HomeManager.hasItem('decor', 'rug')) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(houseX + 115, groundY - 7, 56, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (HomeManager.hasItem('furniture', 'sofa')) {
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(houseX + 20, groundY - 52, 72, 38, [8]);
      ctx.fill();
      ctx.stroke();
    }

    if (HomeManager.hasItem('furniture', 'table')) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(houseX + 145, groundY - 42, 42, 8);
      ctx.fillRect(houseX + 150, groundY - 34, 6, 20);
      ctx.fillRect(houseX + 176, groundY - 34, 6, 20);
    }

    if (HomeManager.hasItem('furniture', 'aquarium')) {
      ctx.fillStyle = '#0ea5e9';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(houseX + 152, houseY + 62, 34, 24);
      ctx.strokeRect(houseX + 152, houseY + 62, 34, 24);
      ctx.font = '14px sans-serif';
      ctx.fillText('🐠', houseX + 160 + Math.sin(animFrame * 0.08) * 6, houseY + 79);
    }

    if (HomeManager.hasItem('decor', 'plant')) {
      ctx.font = '24px sans-serif';
      ctx.fillText('🪴', houseX + 216, groundY - 16);
    }

    if (HomeManager.hasItem('furniture', 'bed') && !hasBedroom) {
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(houseX + 100, groundY - 34, 48, 20);
    }

    // Pet Items & Robot Helper
    if (HomeManager.hasItem('petItems', 'bowl')) {
      ctx.font = '18px sans-serif';
      ctx.fillText('🥣', houseX + 75, groundY - 14);
    }
    if (HomeManager.hasItem('petItems', 'ball')) {
      ctx.font = '18px sans-serif';
      ctx.fillText('⚽', houseX + 132, groundY - 14);
    }
    if (HomeManager.hasItem('petItems', 'pet_bed')) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🧺', houseX + 42, groundY - 14);
    }
    if (HomeManager.hasItem('petItems', 'cat_tree')) {
      ctx.font = '26px sans-serif';
      ctx.fillText('🪵', houseX + 180, groundY - 18);
    }
    if (HomeManager.hasItem('petItems', 'hamster_wheel')) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🎡', houseX + 156, groundY - 16);
    }
    if (HomeManager.hasItem('supplies', 'robot_helper')) {
      const rx = houseX + 55 + Math.sin(animFrame * 0.04) * 35;
      ctx.font = '22px sans-serif';
      ctx.fillText('🤖', rx, groundY - 16);
    }

    // Dirt / Dust specks if cleanliness is low
    if (state.needs.cleanliness < 60) {
      const specks = state.needs.cleanliness < 30 ? 8 : 4;
      ctx.fillStyle = '#78350f';
      for (let s = 0; s < specks; s++) {
        ctx.beginPath();
        ctx.arc(houseX + 35 + s * 28, groundY - 6 - (s % 2) * 5, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- GARDEN (Right Side) ---
    const gardenX = 465;

    // Cute white picket fence
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    for (let fx = gardenX - 15; fx < w - 15; fx += 24) {
      ctx.fillRect(fx, groundY - 32, 8, 32);
      ctx.strokeRect(fx, groundY - 32, 8, 32);
    }

    const growth = state.needs.gardenGrowth;
    // Flowerbed
    if (HomeManager.hasItem('garden', 'flowerbed')) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(gardenX + 10, groundY - 10, 75, 10);
      ctx.font = growth >= 80 ? '24px sans-serif' : growth >= 40 ? '18px sans-serif' : '14px sans-serif';
      const flowerEmoji = growth >= 80 ? '🌸' : growth >= 40 ? '🌷' : '🌱';
      ctx.fillText(flowerEmoji, gardenX + 16, groundY - 12);
      ctx.fillText(flowerEmoji, gardenX + 46, groundY - 12);
    }

    // Veggies
    if (HomeManager.hasItem('garden', 'veggies')) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(gardenX + 95, groundY - 10, 75, 10);
      ctx.font = '22px sans-serif';
      const veg = growth >= 80 ? '🥕' : '🥬';
      ctx.fillText(veg, gardenX + 104, groundY - 12);
      ctx.fillText(veg, gardenX + 136, groundY - 12);
    }

    // Pond
    if (HomeManager.hasItem('garden', 'pond')) {
      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(gardenX + 215, groundY + 14, 42, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = '18px sans-serif';
      ctx.fillText('🪷', gardenX + 204, groundY + 14);
    }

    // Apple Tree
    if (HomeManager.hasItem('garden', 'apple_tree')) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(gardenX + 165, groundY - 85, 16, 85);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(gardenX + 173, groundY - 100, 36, 0, Math.PI * 2);
      ctx.fill();
      if (growth >= 65) {
        ctx.font = '16px sans-serif';
        ctx.fillText('🍎', gardenX + 150, groundY - 96);
        ctx.fillText('🍎', gardenX + 180, groundY - 110);
        ctx.fillText('🍎', gardenX + 175, groundY - 82);
      }
    }

    // Treehouse
    if (HomeManager.hasItem('garden', 'treehouse')) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(gardenX + 245, groundY - 115, 18, 115);
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(gardenX + 220, groundY - 145, 68, 46);
      ctx.strokeRect(gardenX + 220, groundY - 145, 68, 46);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(gardenX + 214, groundY - 145);
      ctx.lineTo(gardenX + 254, groundY - 175);
      ctx.lineTo(gardenX + 294, groundY - 145);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    if (HomeManager.hasItem('garden', 'swing')) {
      ctx.font = '26px sans-serif';
      ctx.fillText('🎠', gardenX + 115, groundY - 16);
    }
    if (HomeManager.hasItem('garden', 'bbq')) {
      ctx.font = '24px sans-serif';
      ctx.fillText('🍔', gardenX + 70, groundY - 16);
    }
    if (HomeManager.hasItem('garden', 'greenhouse')) {
      ctx.fillStyle = 'rgba(134, 239, 172, 0.55)';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5;
      ctx.fillRect(gardenX + 16, groundY - 62, 54, 48);
      ctx.strokeRect(gardenX + 16, groundY - 62, 54, 48);
      ctx.font = '20px sans-serif';
      ctx.fillText('🌿', gardenX + 30, groundY - 26);
    }
    if (HomeManager.hasItem('petItems', 'pet_house')) {
      ctx.font = '26px sans-serif';
      ctx.fillText('🛖', gardenX + 25, groundY - 14);
    }

    // --- YOUR CUSTOMIZED CHARACTER INSIDE HOME ---
    ctx.save();
    const charX = houseX + 115;
    const charY = groundY - 12;
    ctx.translate(charX, charY);
    ctx.scale(0.68, 0.68);
    renderCharacter(ctx, 0, 0, PlayerConfig, { frame: animFrame, pose: 'idle' });
    ctx.restore();

    // Character status bubble if hungry
    if (state.needs.hunger < 40) {
      ctx.font = '18px sans-serif';
      ctx.fillText('🍽️?', houseX + 102, groundY - 132);
    }

    // --- PETS ---
    const petIcons = {
      dog: '🐶',
      cat: '🐱',
      bunny: '🐰',
      parrot: '🦜',
      turtle: '🐢',
      hamster: '🐹',
      fox: '🦊',
      unicorn: '🦄'
    };

    state.owned.pets.forEach((petId, idx) => {
      const icon = petIcons[petId] || '🐾';
      const basePos = idx % 2 === 0 ? houseX + 60 + idx * 35 : gardenX + 40 + idx * 38;
      const walkX = basePos + Math.sin(animFrame * 0.03 + idx * 2) * 22;
      const hopY = groundY - 14 - Math.abs(Math.sin(animFrame * 0.08 + idx)) * (petId === 'bunny' || petId === 'parrot' ? 14 : 5);

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(icon, walkX, hopY);

      if (state.needs.petCare < 45) {
        ctx.font = '14px sans-serif';
        ctx.fillText('🍖', walkX, hopY - 24);
      } else if (animFrame % 120 < 40) {
        ctx.font = '13px sans-serif';
        ctx.fillText('❤️', walkX, hopY - 24);
      }
    });

    // --- CLICKABLE TREASURE FIND IN HOUSE / GARDEN ---
    if (!activeFind) {
      nextFindTimer--;
      if (nextFindTimer <= 0) {
        const finds = [
          { icon: '💰', coins: 12 },
          { icon: '🦋', coins: 8 },
          { icon: '🍀', coins: 6 },
          { icon: '📦', coins: 14 }
        ];
        const chosen = finds[Math.floor(Math.random() * finds.length)];
        activeFind = {
          ...chosen,
          x: 410 + Math.random() * 300,
          y: groundY - 22 - Math.random() * 75
        };
      }
    } else {
      const bob = Math.sin(animFrame * 0.1) * 5;
      ctx.save();
      ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
      ctx.beginPath();
      ctx.arc(activeFind.x, activeFind.y + bob, 22 + Math.sin(animFrame * 0.14) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeFind.icon, activeFind.x, activeFind.y + bob);
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('Klick!', activeFind.x, activeFind.y + bob - 22);
      ctx.restore();
    }

    // --- FLOATING FX PARTICLES ---
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 55);
      ctx.font = '22px sans-serif';
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    rafId = requestAnimationFrame(drawScene);
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
      renderShopGrid();
    }
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'HOME') {
      const dailyBonus = HomeManager.claimDailyVisitBonus();
      updateUI();
      renderTabs();
      renderShopGrid();
      startLoop();
      if (dailyBonus > 0) {
        spawnFX('🪙', 380, 180, 8);
        showToast(`🌟 Tages-Willkommensbonus im Haus: +${dailyBonus} 🪙!`, 'success');
      }
    } else {
      stopLoop();
    }
  });
}
