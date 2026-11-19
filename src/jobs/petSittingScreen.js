import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';
import { PetFollowerController } from '../home/petCompanion.js';

export const CARE_ACTIONS = [
  { id: 'feed', icon: '🦴', label: 'Füttern', short: 'Futter 🦴', color: '#f59e0b', light: '#fef3c7', reward: 7 },
  { id: 'water', icon: '💧', label: 'Wasser geben', short: 'Wasser 💧', color: '#0ea5e9', light: '#e0f2fe', reward: 6 },
  { id: 'play', icon: '🎾', label: 'Ball spielen', short: 'Spielen 🎾', color: '#10b981', light: '#d1fae5', reward: 8 },
  { id: 'brush', icon: '🤗', label: 'Streicheln & Bürsten', short: 'Kuscheln ❤️', color: '#ec4899', light: '#fce7f3', reward: 7 },
  { id: 'walk', icon: '🐕', label: 'An die Leine & Gassi', short: 'Leine & Gassi 🐾', color: '#8b5cf6', light: '#ede9fe', reward: 12 }
];

const CARE_BY_ID = Object.fromEntries(CARE_ACTIONS.map((a) => [a.id, a]));

const MY_HOME_PORTAL = {
  x: 82,
  y: 196,
  standX: 82,
  standY: 256
};

export const NEIGHBOR_HOUSES = [
  {
    id: 0,
    label: '🏠 Haus 1 · Herr Weber',
    shortLabel: '🏠 Herr Weber',
    neighborName: 'Herr Weber',
    x: 278,
    neighborX: 244,
    wall: '#ffe4e6',
    roof: '#f43f8e',
    trim: '#be185d',
    door: '#fb7185',
    yardX: 300,
    yardY: 365,
    appearance: { skin: '#f5c6a5', hair: '#78350f', shirt: '#0284c7', hairStyle: 'short' },
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_1', hairId: 'hair_1', hairColor: '#78350f' },
      clothes: {
        top: { style: 'jacket', color: '#0284c7', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'cargo', color: '#334155' },
        shoes: { style: 'sneakers', color: '#f8fafc' }
      }
    }
  },
  {
    id: 1,
    label: '🏡 Haus 2 · Oma Frieda',
    shortLabel: '🏡 Oma Frieda',
    neighborName: 'Oma Frieda',
    x: 508,
    neighborX: 474,
    wall: '#fef3c7',
    roof: '#f59e0b',
    trim: '#b45309',
    door: '#34d399',
    yardX: 530,
    yardY: 365,
    appearance: { skin: '#ffdecb', hair: '#cbd5e1', shirt: '#a855f7', hairStyle: 'bun' },
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_6', hairId: 'hair_flower', hairColor: '#cbd5e1' },
      clothes: {
        top: { style: 'princess_coat', color: '#a855f7', stickers: [{ type: 'heart', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'jeans', color: '#475569' },
        shoes: { style: 'glitter_boots', color: '#be185d' }
      }
    }
  },
  {
    id: 2,
    label: '🏘️ Haus 3 · Frau Kaya',
    shortLabel: '🏘️ Frau Kaya',
    neighborName: 'Frau Kaya',
    x: 738,
    neighborX: 704,
    wall: '#e0f2fe',
    roof: '#0284c7',
    trim: '#1e3a8a',
    door: '#a855f7',
    yardX: 752,
    yardY: 365,
    appearance: { skin: '#d99b72', hair: '#1e1b4b', shirt: '#10b981', hairStyle: 'ponytail' },
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_8', hairId: 'hair_crown', hairColor: '#1e1b4b' },
      clothes: {
        top: { style: 'sparkle_top', color: '#10b981', stickers: [{ type: 'rainbow', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#1e3a8a' },
        shoes: { style: 'wings', color: '#fef08a' }
      }
    }
  }
];

const PET_CATALOG = [
  { species: 'dog', name: 'Bello', badge: '🐕 Hund', body: '#d97706', accent: '#fde68a', ear: '#92400e', collar: '#ec4899', upfrontPay: 18 },
  { species: 'dog', name: 'Flocke', badge: '🐩 Pudel', body: '#f8fafc', accent: '#ffffff', ear: '#cbd5e1', collar: '#8b5cf6', upfrontPay: 20 },
  { species: 'dog', name: 'Keks', badge: '🐶 Dackel', body: '#9a3412', accent: '#fdba74', ear: '#451a03', collar: '#0ea5e9', upfrontPay: 18 },
  { species: 'cat', name: 'Minka', badge: '🐱 Katze', body: '#f472b6', accent: '#fdf2f8', ear: '#be185d', collar: '#fde047', upfrontPay: 16 },
  { species: 'bunny', name: 'Mümmel', badge: '🐰 Hase', body: '#e2e8f0', accent: '#ffffff', ear: '#f472b6', collar: '#10b981', upfrontPay: 15 },
  { species: 'parrot', name: 'Sunny', badge: '🦜 Papagei', body: '#10b981', accent: '#fde047', ear: '#0284c7', collar: '#f43f5e', upfrontPay: 17 },
  { species: 'turtle', name: 'Otto', badge: '🐢 Schildkröte', body: '#34d399', accent: '#a7f3d0', ear: '#047857', collar: '#f59e0b', upfrontPay: 15 }
];

const WALK_GOAL_DISTANCE = 220;

export function setupPetSittingScreen(stateManager) {
  const canvas = document.getElementById('petSittingCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const coinsValEl = document.getElementById('petCoinsVal');
  const levelValEl = document.getElementById('petLevelVal');
  const caredValEl = document.getElementById('petCaredVal');
  const shiftEarningsEl = document.getElementById('petShiftEarningsVal');
  const toastEl = document.getElementById('petToast');
  const statusTextEl = document.getElementById('petStatusText');
  const activePetSlotsEl = document.getElementById('petActiveTargetBar');
  const houseTabsEl = document.getElementById('petHouseTabs');
  const careBarEl = document.getElementById('petCareBar');
  const leashAllBtn = document.getElementById('petLeashAllBtn');
  const callNeighborBtn = document.getElementById('petCallNeighborBtn');

  const walkLeftBtn = document.getElementById('petWalkLeftBtn');
  const walkRightBtn = document.getElementById('petWalkRightBtn');
  const walkUpBtn = document.getElementById('petWalkUpBtn');
  const walkDownBtn = document.getElementById('petWalkDownBtn');
  const actionBtn = document.getElementById('petActionBtn');

  const toHomeBtn = document.getElementById('petToHomeBtn');
  const toEditorBtn = document.getElementById('petToEditorBtn');

  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;
  let selectedHouseFilter = 'all';
  let selectedHouseIdx = 0;

  let petsHelpedCount = parseInt(localStorage.getItem('runner_petsit_count') || '0', 10) || 0;
  let shiftCoins = 0;

  // Player starts right outside "Mein Haus" on the left and can roam EVERYWHERE across the neighborhood & park!
  const player = {
    x: MY_HOME_PORTAL.standX,
    y: MY_HOME_PORTAL.standY,
    facing: 1,
    waypoints: [],
    pendingAction: null,
    pose: 'idle',
    poseTimer: 0
  };

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  const houseSlots = [null, null, null];
  const houseCooldowns = [0, 240, 420];
  let quietPauseTimer = 0;
  let visitsSinceBreak = 0;
  const fxParticles = [];
  let ballFx = null;
  const petFollowers = new PetFollowerController();

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3200);
  }

  function setStatus(msg) {
    if (statusTextEl) statusTextEl.textContent = msg;
  }

  function spawnFX(kind, x, y, count = 8) {
    const colors = kind === 'heart'
      ? ['#f43f5e', '#fb7185', '#fbcfe8']
      : kind === 'water'
        ? ['#38bdf8', '#7dd3fc', '#e0f2fe']
        : kind === 'coin'
          ? ['#fde047', '#fbbf24', '#f59e0b']
          : ['#a78bfa', '#f472b6', '#fde047', '#ffffff'];

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

  function pickNextNeed(petInfo, previousNeed = null) {
    const pool = CARE_ACTIONS.filter((a) => a.id !== previousNeed);
    return pool[Math.floor(Math.random() * pool.length)].id;
  }

  function createNeighborVisit(houseIdx, forceDog = false) {
    const pool = forceDog
      ? PET_CATALOG.filter((p) => p.species === 'dog')
      : PET_CATALOG;
    const base = pool[Math.floor(Math.random() * pool.length)];
    const house = NEIGHBOR_HOUSES[houseIdx];
    const firstNeed = pickNextNeed(base);
    return {
      houseIdx,
      info: base,
      x: house.x + 22,
      y: 234,
      need: firstNeed,
      happiness: 0,
      tasksGoal: 2,
      state: 'offering', // 'offering' -> 'caring' -> 'happy_leaving'
      onLeash: false,
      leashDistance: 0,
      walkReady: false,
      happyTimer: 0,
      patience: 100
    };
  }

  function getLeashedVisits() {
    return houseSlots.filter((v) => v && v.state === 'caring' && v.onLeash);
  }

  function getNearestHouseIdx(px, py) {
    let best = -1;
    let bestDist = 118;
    NEIGHBOR_HOUSES.forEach((h, idx) => {
      const d = Math.hypot(px - h.x, py - 295);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    return best;
  }

  function initShift() {
    shiftCoins = 0;
    ballFx = null;
    quietPauseTimer = 0;
    visitsSinceBreak = 0;
    player.x = MY_HOME_PORTAL.standX;
    player.y = MY_HOME_PORTAL.standY;
    player.facing = 1;
    player.waypoints = [];
    player.pendingAction = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    petFollowers.reset(player.x, player.y + 4);

    // Calm start: 2 neighbors outside, 1 arrives later so not everyone is always waiting!
    houseSlots[0] = createNeighborVisit(0, true);
    houseSlots[1] = null;
    houseSlots[2] = createNeighborVisit(2, false);
    houseCooldowns[0] = 0;
    houseCooldowns[1] = 280;
    houseCooldowns[2] = 0;
    selectedHouseIdx = 0;

    updateHUD();
    renderHouseTabs();
    renderCareButtons();
    setStatus('Lauf überall durch die Nachbarschaft & den Park! Hol Aufträge ab – du kannst auch alle Tiere zusammen an die Leine nehmen.');
  }

  function updateHUD() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (caredValEl) caredValEl.textContent = petsHelpedCount;
    if (shiftEarningsEl) shiftEarningsEl.textContent = shiftCoins;

    const leashed = getLeashedVisits();
    const anyReady = leashed.some((v) => v.walkReady);

    if (leashAllBtn) {
      if (leashed.length > 0 && anyReady) {
        leashAllBtn.textContent = `✅ Gassi fertig! Leinen ab (${leashed.length})`;
      } else if (leashed.length > 0) {
        const minPct = Math.min(100, Math.round((Math.min(...leashed.map((v) => v.leashDistance)) / WALK_GOAL_DISTANCE) * 100));
        leashAllBtn.textContent = `🐾 Alle an Leine (${leashed.length}) · ${minPct}%`;
      } else {
        leashAllBtn.textContent = '🐕 Alle an die Leine';
      }
    }

    if (activePetSlotsEl) {
      if (leashed.length > 0) {
        const names = leashed.map((v) => v.info.name).join(', ');
        const avgPct = Math.min(100, Math.round((leashed.reduce((s, v) => s + Math.min(WALK_GOAL_DISTANCE, v.leashDistance), 0) / (leashed.length * WALK_GOAL_DISTANCE)) * 100));
        activePetSlotsEl.innerHTML = anyReady
          ? `<span class="cone-scoop-chip" style="--scoop:#10b981;--scoop-light:#d1fae5;">✨ Gassi fertig mit ${names}! Tippe auf „Gassi fertig!“ oder geh zu einem Haus!</span>`
          : `<span class="cone-scoop-chip" style="--scoop:#8b5cf6;--scoop-light:#ede9fe;">🐕 An der Leine (${leashed.length}): ${names} · ${avgPct}% – Lauf frei überall herum!</span>`;
        return;
      }

      const visit = houseSlots[selectedHouseIdx];
      const house = NEIGHBOR_HOUSES[selectedHouseIdx];
      if (!visit || visit.state === 'happy_leaving') {
        const activeAny = houseSlots.some((v) => v && v.state !== 'happy_leaving');
        activePetSlotsEl.innerHTML = activeAny
          ? '<span class="cone-empty-hint">Lauf frei herum oder geh zu einem Nachbarhaus mit Tier!</span>'
          : '<span class="cone-empty-hint">☕ Gerade ruhige Pause – lauf über die Wiese oder tippe „🔔 Nachbar rufen“!</span>';
      } else if (visit.state === 'offering') {
        activePetSlotsEl.innerHTML = `
          <span class="cone-scoop-chip" style="--scoop:#f59e0b;--scoop-light:#fef3c7;">
            👋 ${house.neighborName} wartet mit ${visit.info.badge} ${visit.info.name} (+${visit.info.upfrontPay} 🪙 holen!)
          </span>
        `;
      } else {
        const need = CARE_BY_ID[visit.need];
        activePetSlotsEl.innerHTML = `
          <span class="cone-scoop-chip" style="--scoop:${need.color};--scoop-light:${need.light};">
            ${visit.info.badge} ${visit.info.name} braucht: ${need.icon} ${need.label} (${visit.happiness}/${visit.tasksGoal})
          </span>
        `;
      }
    }
  }

  function renderHouseTabs() {
    if (!houseTabsEl) return;
    const tabs = [
      { id: 'all', label: '🐾 Alle Nachbarn' },
      ...NEIGHBOR_HOUSES.map((h) => ({ id: String(h.id), label: h.shortLabel }))
    ];
    houseTabsEl.innerHTML = '';
    tabs.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-tab-btn${selectedHouseFilter === t.id ? ' active' : ''}`;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        selectedHouseFilter = t.id;
        if (t.id !== 'all') {
          const idx = Number(t.id);
          selectedHouseIdx = idx;
          const house = NEIGHBOR_HOUSES[idx];
          const visit = houseSlots[idx];
          if (visit && visit.state === 'offering') {
            navigateToPoint(house.neighborX, 256, { type: 'accept', houseIdx: idx });
          } else {
            navigateToPoint(house.yardX + 24, house.yardY - 8, null);
          }
        }
        renderHouseTabs();
        renderCareButtons();
        updateHUD();
      });
      houseTabsEl.appendChild(btn);
    });
  }

  function getTargetHouseForMenu() {
    if (selectedHouseFilter !== 'all') {
      return Number(selectedHouseFilter);
    }
    const near = getNearestHouseIdx(player.x, player.y);
    if (near !== -1 && houseSlots[near] && houseSlots[near].state !== 'happy_leaving') {
      return near;
    }
    const caringIdx = houseSlots.findIndex((v) => v && v.state === 'caring');
    if (caringIdx !== -1) return caringIdx;
    const offerIdx = houseSlots.findIndex((v) => v && v.state === 'offering');
    return offerIdx !== -1 ? offerIdx : selectedHouseIdx;
  }

  function summonNextNeighbor() {
    quietPauseTimer = 0;
    const emptyIdx = houseSlots.findIndex((v) => !v);
    if (emptyIdx === -1) {
      showToast('Bei allen drei Nachbarn ist schon ein Tier draußen!', 'info');
      return;
    }
    houseSlots[emptyIdx] = createNeighborVisit(emptyIdx, emptyIdx === 0 || Math.random() < 0.55);
    houseCooldowns[emptyIdx] = 0;
    selectedHouseIdx = emptyIdx;
    const h = NEIGHBOR_HOUSES[emptyIdx];
    spawnFX('sparkle', h.neighborX, 210, 8);
    updateHUD();
    showToast(`👋 ${h.neighborName} kommt mit ${houseSlots[emptyIdx].info.name} vor die Tür!`, 'success');
    setStatus(`${h.neighborName} wartet jetzt vor dem Haus mit ${houseSlots[emptyIdx].info.name}!`);
  }

  function finishLeashWalk(onlyHouseIdx = null) {
    const targets = houseSlots.filter((v) => v && v.state === 'caring' && v.onLeash && (onlyHouseIdx === null || v.houseIdx === onlyHouseIdx));
    if (targets.length === 0) return false;

    const readyCount = targets.filter((v) => v.walkReady).length;
    if (readyCount === 0 && onlyHouseIdx === null) {
      // Allow unleashing early without failing, or prompt gently if they haven't walked far
      targets.forEach((v) => {
        const house = NEIGHBOR_HOUSES[v.houseIdx];
        v.onLeash = false;
        v.leashDistance = 0;
        v.walkReady = false;
        v.x = house.yardX - 34;
        v.y = house.yardY + 8;
      });
      updateHUD();
      showToast('🐾 Leinen abgenommen! Lauf weiter durch die Nachbarschaft!', 'info');
      return true;
    }

    const packBonus = Math.max(0, (readyCount - 1) * 6);
    let totalBonusCoins = 0;

    targets.forEach((v) => {
      const house = NEIGHBOR_HOUSES[v.houseIdx];
      const wasWalkReady = v.walkReady;
      v.onLeash = false;
      v.leashDistance = 0;
      v.walkReady = false;
      v.x = house.yardX - 34;
      v.y = house.yardY + 8;

      if (wasWalkReady) {
        if (v.need === 'walk') {
          awardCareSuccess(v.houseIdx, 'walk');
        } else {
          // Even if their top wish wasn't walk, walking them awards a happy walk bonus!
          const bonus = 8;
          totalBonusCoins += bonus;
          shiftCoins += bonus;
          ShopManager.addCoins(bonus);
          ShopManager.recordProgress(0, bonus);
          EarnMoneyManager.recordEvent({ care: 1 });
          spawnFX('heart', v.x, v.y - 24, 6);
        }
      }
    });

    if (packBonus > 0) {
      totalBonusCoins += packBonus;
      shiftCoins += packBonus;
      ShopManager.addCoins(packBonus);
      ShopManager.recordProgress(0, packBonus);
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    }

    player.pose = 'pet';
    player.poseTimer = 28;
    updateHUD();
    if (packBonus > 0 || totalBonusCoins > 0) {
      showToast(`🐕 Rudel-Gassi geschafft! +${totalBonusCoins + packBonus} 🪙 extra Rudel-Bonus!`, 'success');
    }
    return true;
  }

  function putAllCaringOnLeash() {
    const caring = houseSlots.filter((v) => v && v.state === 'caring');
    if (caring.length === 0) {
      const offerIdx = houseSlots.findIndex((v) => v && v.state === 'offering');
      if (offerIdx !== -1) {
        const h = NEIGHBOR_HOUSES[offerIdx];
        navigateToPoint(h.neighborX + 8, 258, { type: 'accept_and_leash', houseIdx: offerIdx });
        showToast(`🚶 Du holst erst ${houseSlots[offerIdx].info.name} & Geld bei ${h.neighborName} ab!`, 'info');
      } else {
        showToast('Gerade warten keine Tiere – tippe auf „🔔 Nachbar rufen“!', 'info');
      }
      return;
    }

    let newlyLeashed = 0;
    caring.forEach((v) => {
      if (!v.onLeash) {
        v.onLeash = true;
        v.leashDistance = 0;
        v.walkReady = false;
        newlyLeashed++;
        spawnFX('heart', v.x, v.y - 20, 5);
      }
    });
    updateHUD();
    if (newlyLeashed > 0) {
      const total = getLeashedVisits().length;
      showToast(`🐕 ${total} ${total === 1 ? 'Tier' : 'Tiere'} gleichzeitig an der Leine! Lauf überall herum!`, 'success');
      setStatus(`🐾 ${total} Tiere zusammen an der Leine! Lauf überall hin – auch weitere Nachbarn kannst du dabei noch abholen!`);
    } else {
      finishLeashWalk();
    }
  }

  function renderCareButtons() {
    if (!careBarEl) return;
    careBarEl.innerHTML = '';

    // Dedicated big button to walk up to Neighbor & collect upfront sitting money + pet!
    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.className = 'ice-flavor-btn ice-accept-btn';
    acceptBtn.innerHTML = `
      <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef08a, #f59e0b);">🤝</span>
      <span class="ice-item-meta">
        <span class="ice-item-name">Auftrag &amp; Geld holen</span>
        <span class="ice-item-price">Beim Nachbarn abholen (+🪙)</span>
      </span>
    `;
    acceptBtn.addEventListener('click', () => {
      let targetIdx = selectedHouseFilter !== 'all'
        ? Number(selectedHouseFilter)
        : houseSlots.findIndex((v) => v && v.state === 'offering');
      if (targetIdx === -1) targetIdx = getTargetHouseForMenu();
      const visit = houseSlots[targetIdx];
      const house = NEIGHBOR_HOUSES[targetIdx];
      selectedHouseIdx = targetIdx;
      updateHUD();
      if (visit && visit.state === 'offering') {
        navigateToPoint(house.neighborX + 8, 258, { type: 'accept', houseIdx: targetIdx });
      } else {
        showToast(`Du passt schon auf ${visit ? visit.info.name : 'das Tier'} auf – erfülle jetzt seine Wünsche!`, 'info');
      }
    });
    careBarEl.appendChild(acceptBtn);

    // Quick button: Put ALL animals on leash at the same time!
    const leashAllMenuBtn = document.createElement('button');
    leashAllMenuBtn.type = 'button';
    leashAllMenuBtn.className = 'ice-flavor-btn';
    leashAllMenuBtn.innerHTML = `
      <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #ede9fe, #8b5cf6);">🐕</span>
      <span class="ice-item-meta">
        <span class="ice-item-name">Alle an die Leine!</span>
        <span class="ice-item-price">Zusammen Gassi (+Rudel-Bonus)</span>
      </span>
    `;
    leashAllMenuBtn.addEventListener('click', () => {
      putAllCaringOnLeash();
    });
    careBarEl.appendChild(leashAllMenuBtn);

    CARE_ACTIONS.forEach((act) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ice-flavor-btn';
      btn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${act.light}, ${act.color});">${act.icon}</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">${act.label}</span>
          <span class="ice-item-price">+${act.reward} 🪙</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        if (act.id === 'walk') {
          let targetIdx = selectedHouseFilter !== 'all'
            ? Number(selectedHouseFilter)
            : houseSlots.findIndex((v) => v && v.state === 'caring' && !v.onLeash);
          if (targetIdx === -1) targetIdx = getTargetHouseForMenu();
          const visit = houseSlots[targetIdx];
          const house = NEIGHBOR_HOUSES[targetIdx];
          if (visit && visit.state === 'offering') {
            navigateToPoint(house.neighborX + 8, 258, { type: 'accept_and_leash', houseIdx: targetIdx });
            return;
          }
          if (visit && visit.state === 'caring') {
            if (!visit.onLeash) {
              visit.onLeash = true;
              visit.leashDistance = 0;
              visit.walkReady = false;
              spawnFX('heart', visit.x, visit.y - 20, 6);
              updateHUD();
              showToast(`🐕 ${visit.info.name} ist an der Leine! Nimm gerne noch mehr Tiere dazu & lauf überall herum!`, 'success');
            } else {
              finishLeashWalk(targetIdx);
            }
            return;
          }
        }

        // Prefer an active caring pet needing this exact action!
        let targetIdx = houseSlots.findIndex((v) => v && v.state === 'caring' && v.need === act.id);
        if (selectedHouseFilter !== 'all') {
          targetIdx = Number(selectedHouseFilter);
        } else if (targetIdx === -1) {
          targetIdx = getTargetHouseForMenu();
        }

        const visit = houseSlots[targetIdx];
        const house = NEIGHBOR_HOUSES[targetIdx];
        selectedHouseIdx = targetIdx;
        updateHUD();

        if (!visit || visit.state === 'happy_leaving') {
          showToast('Bei diesem Nachbarn wartet gerade kein Tier!', 'info');
          return;
        }
        if (visit.state === 'offering') {
          navigateToPoint(house.neighborX + 8, 258, { type: 'accept', houseIdx: targetIdx });
          return;
        }
        navigateToPoint(house.yardX + 16, house.yardY - 6, { type: 'care', houseIdx: targetIdx, actionId: act.id });
      });
      careBarEl.appendChild(btn);
    });
  }

  function navigateToPoint(tx, ty, pendingAction = null) {
    const clampedX = Math.max(28, Math.min(832, tx));
    const clampedY = Math.max(145, Math.min(454, ty));
    player.waypoints = [{ x: clampedX, y: clampedY }];
    player.pendingAction = pendingAction;
  }

  function acceptNeighborJob(houseIdx, autoLeash = false) {
    const visit = houseSlots[houseIdx];
    const house = NEIGHBOR_HOUSES[houseIdx];
    if (!visit || visit.state !== 'offering') return;

    const upfront = visit.info.upfrontPay;
    visit.state = 'caring';
    visit.onLeash = autoLeash;
    visit.leashDistance = 0;
    visit.walkReady = false;
    visit.x = house.yardX - 34;
    visit.y = house.yardY + 8;

    shiftCoins += upfront;
    ShopManager.addCoins(upfront);
    ShopManager.recordProgress(0, upfront);
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    player.pose = 'pet';
    player.poseTimer = 24;
    spawnFX('coin', house.neighborX, 200, 10);
    spawnFX('heart', visit.x, visit.y - 24, 6);
    updateHUD();

    const firstNeed = CARE_BY_ID[visit.need];
    if (autoLeash) {
      showToast(`💰 +${upfront} 🪙 von ${house.neighborName}! ${visit.info.name} kommt direkt an die Leine!`, 'success');
      setStatus(`🐕 ${visit.info.name} ist an der Leine! Hol ruhig auch noch die anderen Tiere ab!`);
    } else {
      showToast(`💰 ${house.neighborName} gibt dir +${upfront} 🪙! Pass jetzt gut auf ${visit.info.name} auf!`, 'success');
      setStatus(`💰 +${upfront} 🪙 von ${house.neighborName} erhalten! ${visit.info.name} braucht: ${firstNeed.icon} ${firstNeed.label}.`);
    }
  }

  function awardCareSuccess(houseIdx, actionId) {
    const visit = houseSlots[houseIdx];
    const house = NEIGHBOR_HOUSES[houseIdx];
    if (!visit) return;
    const act = CARE_BY_ID[actionId];
    const baseReward = act ? act.reward : 7;

    visit.happiness += 1;
    let totalEarned = baseReward;
    let finishedVisit = false;

    if (visit.happiness >= visit.tasksGoal) {
      finishedVisit = true;
      totalEarned += 10;
      visit.state = 'happy_leaving';
      visit.onLeash = false;
      visit.happyTimer = 105;
      petsHelpedCount += 1;
      visitsSinceBreak += 1;
      localStorage.setItem('runner_petsit_count', String(petsHelpedCount));
      EarnMoneyManager.recordEvent({ petsit: 1, care: 1 });
    } else {
      visit.need = pickNextNeed(visit.info, visit.need);
      visit.patience = Math.min(100, visit.patience + 28);
      EarnMoneyManager.recordEvent({ care: 1 });
    }

    shiftCoins += totalEarned;
    ShopManager.addCoins(totalEarned);
    ShopManager.recordProgress(0, totalEarned);
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    spawnFX(actionId === 'water' ? 'water' : 'heart', visit.x, visit.y - 26, 9);
    spawnFX('coin', house.neighborX, 204, 7);
    if (actionId === 'play') {
      ballFx = { x: player.x, y: player.y - 30, vx: -player.facing * 4.5, vy: -5.2, life: 44 };
    }

    updateHUD();
    if (finishedVisit) {
      showToast(`🎉 ${house.neighborName} sagt Danke für ${visit.info.name}! +${totalEarned} 🪙 Trinkgeld!`, 'success');
      setStatus(`Super gemacht! Lauf frei weiter oder schau bei den anderen Häusern vorbei.`);
    } else {
      const nextNeed = CARE_BY_ID[visit.need];
      showToast(`${act.icon} ${visit.info.name} freut sich! +${totalEarned} 🪙`, 'success');
      setStatus(`${visit.info.name} möchte als Nächstes: ${nextNeed.icon} ${nextNeed.label}!`);
    }
  }

  function performCareAtHouse(houseIdx, requestedActionId = null) {
    const visit = houseSlots[houseIdx];
    const house = NEIGHBOR_HOUSES[houseIdx];
    if (!visit || visit.state === 'happy_leaving') {
      showToast('Hier wartet gerade kein Tier auf Betreuung!', 'info');
      return;
    }

    if (visit.state === 'offering') {
      acceptNeighborJob(houseIdx, false);
      return;
    }

    if (visit.onLeash && visit.walkReady) {
      finishLeashWalk(houseIdx);
      return;
    }

    const actionId = requestedActionId || visit.need;
    if (actionId === 'walk') {
      if (!visit.onLeash) {
        visit.onLeash = true;
        visit.leashDistance = 0;
        visit.walkReady = false;
        spawnFX('heart', visit.x, visit.y - 20, 6);
        updateHUD();
        showToast(`🐕 ${visit.info.name} ist an der Leine! Lauf frei herum – du kannst auch alle anderen dazu nehmen!`, 'success');
        setStatus(`🐕 ${visit.info.name} an der Leine! Lauf überall herum oder nimm noch mehr Tiere mit.`);
      } else {
        finishLeashWalk(houseIdx);
      }
      return;
    }

    if (actionId !== visit.need) {
      const wanted = CARE_BY_ID[visit.need];
      showToast(`💬 ${visit.info.name} möchte gerade lieber: ${wanted.icon} ${wanted.label}!`, 'warn');
      return;
    }

    player.facing = visit.x < player.x ? -1 : 1;
    player.pose = actionId === 'brush' ? 'pet' : actionId === 'play' ? 'jump' : 'cook';
    player.poseTimer = 28;
    awardCareSuccess(houseIdx, actionId);
  }

  function handleCanvasClick(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    // 0. Tapping one of your own companion pets cuddles them right here!
    const tappedPet = petFollowers.handleTap(cx, cy);
    if (tappedPet.hit) {
      spawnFX('heart', tappedPet.x, tappedPet.y - 20, 8);
      showToast(`❤️ ${tappedPet.meta.name} wedelt fröhlich und freut sich!`, 'success');
      return;
    }

    // 1. Clicked on "🏡 Dein Haus" door on the far left?
    if (cx >= 52 && cx <= 114 && cy >= 136 && cy <= 212) {
      navigateToPoint(MY_HOME_PORTAL.standX, MY_HOME_PORTAL.standY, { type: 'go_home' });
      return;
    }

    // 2. Clicked directly on a Neighbor or a Neighbor's Pet/Speech Bubble (within yard/porch area)?
    for (let i = 0; i < NEIGHBOR_HOUSES.length; i++) {
      const h = NEIGHBOR_HOUSES[i];
      const visit = houseSlots[i];
      if (!visit || visit.state === 'happy_leaving') continue;

      const hitNeighbor = Math.hypot(cx - h.neighborX, cy - 205) <= 44;
      const hitPet = Math.hypot(cx - visit.x, cy - (visit.y - 16)) <= 46;
      const hitBubble = visit.state === 'offering'
        ? (Math.abs(cx - (h.neighborX + 12)) <= 80 && cy >= 92 && cy <= 165)
        : (visit.state === 'caring' && Math.abs(cx - (visit.x + 8)) <= 84 && cy >= visit.y - 122 && cy <= visit.y - 45);

      if (hitNeighbor || hitPet || hitBubble) {
        selectedHouseIdx = i;
        updateHUD();
        if (visit.state === 'offering') {
          navigateToPoint(h.neighborX + 8, 258, { type: 'accept', houseIdx: i });
          return;
        }
        if (visit.state === 'caring') {
          if (visit.onLeash && visit.walkReady) {
            finishLeashWalk(i);
            return;
          }
          if (hitPet && !visit.onLeash && visit.need === 'walk') {
            performCareAtHouse(i, 'walk');
            return;
          }
          navigateToPoint(Math.min(832, Math.max(28, visit.x + 18)), Math.min(454, Math.max(145, visit.y + 4)), { type: 'smart_care', houseIdx: i });
          return;
        }
      }
    }

    // 3. Otherwise walk freely ANYWHERE on the entire neighborhood & park canvas!
    navigateToPoint(cx, cy, null);
  }

  function triggerNearbyAction() {
    if (Math.hypot(player.x - MY_HOME_PORTAL.standX, player.y - MY_HOME_PORTAL.standY) < 46) {
      stateManager.setState('HOME');
      return;
    }
    const nearIdx = getNearestHouseIdx(player.x, player.y);
    if (nearIdx !== -1 && houseSlots[nearIdx] && houseSlots[nearIdx].state !== 'happy_leaving') {
      selectedHouseIdx = nearIdx;
      performCareAtHouse(nearIdx, null);
    } else if (getLeashedVisits().some((v) => v.walkReady)) {
      finishLeashWalk();
    } else {
      showToast('Lauf frei überall herum – oder geh zu einem Nachbarn vor seinem Haus!', 'info');
    }
  }

  if (leashAllBtn) leashAllBtn.addEventListener('click', putAllCaringOnLeash);
  if (callNeighborBtn) callNeighborBtn.addEventListener('click', summonNextNeighbor);

  if (canvas) {
    canvas.addEventListener('click', (e) => handleCanvasClick(e.clientX, e.clientY));
  }

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.waypoints = [];
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
  bindHold(walkUpBtn, 'up');
  bindHold(walkDownBtn, 'down');

  if (actionBtn) {
    actionBtn.addEventListener('click', triggerNearbyAction);
  }

  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'PETSITTING') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (document.querySelector('.modal:not(.hidden)')) return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.waypoints = [];
      player.pendingAction = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.waypoints = [];
      player.pendingAction = null;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = true;
      player.waypoints = [];
      player.pendingAction = null;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      keys.down = true;
      player.waypoints = [];
      player.pendingAction = null;
    } else if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
      e.preventDefault();
      triggerNearbyAction();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  if (toHomeBtn) toHomeBtn.addEventListener('click', () => stateManager.setState('HOME'));
  if (toEditorBtn) toEditorBtn.addEventListener('click', () => stateManager.setState('EDITOR'));
  const toTownBtn = document.getElementById('petToTownBtn');
  if (toTownBtn) toTownBtn.addEventListener('click', () => stateManager.setState('TOWN', { from: 'PETSITTING' }));

  function updateSimulation() {
    const prevX = player.x;
    const prevY = player.y;

    let moveX = 0;
    let moveY = 0;
    if (keys.left || holdPad.left) moveX -= 1;
    if (keys.right || holdPad.right) moveX += 1;
    if (keys.up || holdPad.up) moveY -= 1;
    if (keys.down || holdPad.down) moveY += 1;

    const speed = 4.6;
    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY) || 1;
      player.x = Math.max(28, Math.min(832, player.x + (moveX / len) * speed));
      player.y = Math.max(145, Math.min(454, player.y + (moveY / len) * speed));
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
        if (player.waypoints.length === 0 && player.pendingAction) {
          const act = player.pendingAction;
          player.pendingAction = null;
          if (act.type === 'go_home') stateManager.setState('HOME');
          else if (act.type === 'accept') acceptNeighborJob(act.houseIdx, false);
          else if (act.type === 'accept_and_leash') acceptNeighborJob(act.houseIdx, true);
          else if (act.type === 'care') performCareAtHouse(act.houseIdx, act.actionId);
          else if (act.type === 'smart_care') performCareAtHouse(act.houseIdx, null);
        }
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        player.x += (dx / dist) * speed;
        player.y += (dy / dist) * speed;
        player.pose = 'walk';
      }
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
      if (player.poseTimer <= 0) player.pose = 'idle';
    } else {
      player.pose = 'idle';
    }

    const movedStep = Math.hypot(player.x - prevX, player.y - prevY);

    petFollowers.update(player.x, player.y + 6, player.facing, {
      minX: 24,
      maxX: 836,
      minY: 145,
      maxY: 458
    });

    const nearIdx = getNearestHouseIdx(player.x, player.y);
    if (nearIdx !== -1 && nearIdx !== selectedHouseIdx) {
      selectedHouseIdx = nearIdx;
      updateHUD();
    }

    // Update ALL leashed neighbor animals together in staggered pack formation!
    const leashed = getLeashedVisits();
    let hudDirty = false;
    leashed.forEach((p, idx) => {
      const slotDist = 36 + idx * 32;
      const sideOffset = idx % 2 === 0 ? 10 : -10;
      const targetPetX = Math.max(24, Math.min(836, player.x - player.facing * slotDist));
      const targetPetY = Math.max(145, Math.min(454, player.y + sideOffset));
      p.x += (targetPetX - p.x) * 0.16;
      p.y += (targetPetY - p.y) * 0.16;

      if (movedStep > 0.4) {
        const beforeReady = p.walkReady;
        p.leashDistance += movedStep;
        if (p.leashDistance >= WALK_GOAL_DISTANCE) {
          p.walkReady = true;
          if (!beforeReady) {
            spawnFX('sparkle', p.x, p.y - 24, 7);
            showToast(`✨ ${p.info.name} hat genug Auslauf gehabt! Tippe auf „✅ Gassi fertig!“ wann immer du magst.`, 'success');
            hudDirty = true;
          }
        }
        if (animFrame % 12 === 0) hudDirty = true;
      }
    });
    if (hudDirty) updateHUD();

    // Calm neighbor pacing & occasional quiet break so neighbors aren't nonstop waiting
    const activeCount = houseSlots.filter((v) => v !== null).length;
    if (activeCount === 0 && visitsSinceBreak >= 3 && quietPauseTimer === 0) {
      quietPauseTimer = 250 + Math.floor(Math.random() * 170);
      visitsSinceBreak = 0;
      setStatus('🌿 Kurze ruhige Pause in der Nachbarschaft – lauf überall herum oder tippe „🔔 Nachbar rufen“!');
      updateHUD();
    }

    if (quietPauseTimer > 0) {
      quietPauseTimer--;
    } else {
      for (let i = 0; i < 3; i++) {
        const visit = houseSlots[i];
        if (!visit) {
          houseCooldowns[i]--;
          const currentActive = houseSlots.filter((v) => v !== null).length;
          if (houseCooldowns[i] <= 0 && currentActive < 2) {
            houseSlots[i] = createNeighborVisit(i, i === 0 || Math.random() < 0.55);
            updateHUD();
          } else if (houseCooldowns[i] <= 0) {
            houseCooldowns[i] = 150;
          }
          continue;
        }
        if (visit.state === 'caring') {
          visit.patience = Math.max(15, visit.patience - 0.012);
        } else if (visit.state === 'happy_leaving') {
          visit.happyTimer--;
          if (visit.happyTimer <= 0) {
            houseSlots[i] = null;
            houseCooldowns[i] = 240 + Math.floor(Math.random() * 200);
            updateHUD();
          }
        }
      }
    }

    if (ballFx) {
      ballFx.x += ballFx.vx;
      ballFx.y += ballFx.vy;
      ballFx.vy += 0.35;
      if (ballFx.y > player.y - 8) {
        ballFx.y = player.y - 8;
        ballFx.vy = -Math.abs(ballFx.vy) * 0.65;
      }
      ballFx.life--;
      if (ballFx.life <= 0) ballFx = null;
    }

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) fxParticles.splice(i, 1);
    }
  }

  function drawOwnHomeOnStreet() {
    ctx.save();
    const hx = 16;
    const hy = 74;
    const hw = 132;
    const hh = 124;

    // Pastel Rose-Cream Home
    ctx.fillStyle = '#fff1f2';
    ctx.beginPath();
    ctx.roundRect(hx, hy + 42, hw, hh - 42, [8]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pitched Roof
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(hx - 10, hy + 48);
    ctx.lineTo(hx + hw / 2, hy);
    ctx.lineTo(hx + hw + 10, hy + 48);
    ctx.closePath();
    ctx.fill();

    // Front Door (clickable to go inside!)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(hx + hw / 2 - 18, hy + 72, 36, 52, [10, 10, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(hx + hw / 2 + 10, hy + 100, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Sign
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(hx + 6, hy + 128, hw - 12, 24, [12]);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏡 Dein Haus (◀ Rein)', hx + hw / 2, hy + 140);
    ctx.restore();
  }

  function drawNeighborHouse(h) {
    ctx.save();
    const hx = h.x - 86;
    const hy = 66;
    const hw = 172;
    const hh = 132;

    // House body
    ctx.fillStyle = h.wall;
    ctx.beginPath();
    ctx.roundRect(hx, hy + 46, hw, hh - 46, [8]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Roof
    ctx.fillStyle = h.roof;
    ctx.beginPath();
    ctx.moveTo(hx - 12, hy + 52);
    ctx.lineTo(h.x, hy);
    ctx.lineTo(hx + hw + 12, hy + 52);
    ctx.closePath();
    ctx.fill();

    // Front Door
    ctx.fillStyle = h.door;
    ctx.beginPath();
    ctx.roundRect(h.x - 18, hy + 76, 36, 56, [10, 10, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(h.x + 10, hy + 106, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Windows
    [h.x - 58, h.x + 30].forEach((wx) => {
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(wx, hy + 72, 28, 28, [6]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // House Label
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(h.x - 76, hy + 136, 152, 22, [11]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = h.trim;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.shortLabel, h.x, hy + 147);
    ctx.restore();
  }

  function drawNeighborPerson(h, visit) {
    const isOffering = visit && visit.state === 'offering';
    const isHappy = visit && visit.state === 'happy_leaving';
    const nx = h.neighborX;
    const ny = 244;
    const bob = isOffering || isHappy ? Math.abs(Math.sin(animFrame * 0.12 + h.id)) * 5 : 0;

    const matchedCfg = {
      ...h.charConfig,
      body: {
        ...h.charConfig.body,
        height: PlayerConfig.body.height || 1.0,
        width: PlayerConfig.body.width || 1.0
      }
    };

    ctx.save();
    ctx.translate(nx, ny - bob);

    ctx.save();
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, matchedCfg, {
      frame: animFrame + h.id * 15,
      pose: isHappy ? 'jump' : isOffering ? 'pet' : 'idle',
      facing: player.x < nx ? -1 : 1
    });
    ctx.restore();

    if (isOffering) {
      const waveCoin = Math.sin(animFrame * 0.16 + h.id) * 4;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-28, -62 + waveCoin, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const bw = 156;
      const bh = 52;
      const bx = -bw / 2 + 10;
      const by = -182;

      ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, [14]);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Pointer
      ctx.beginPath();
      ctx.moveTo(-4, by + bh - 1);
      ctx.lineTo(0, by + bh + 10);
      ctx.lineTo(8, by + bh - 1);
      ctx.closePath();
      ctx.fill();

      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Pass auf ${visit.info.name} auf!`, bx + bw / 2, by + 16);

      ctx.fillStyle = '#059669';
      ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`💰 +${visit.info.upfrontPay} 🪙 holen!`, bx + bw / 2, by + 35);
    } else if (isHappy) {
      ctx.fillStyle = '#ecfdf5';
      ctx.beginPath();
      ctx.roundRect(-55, -156, 110, 26, [12]);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#047857';
      ctx.textAlign = 'center';
      ctx.fillText('❤️ Danke dir!', 0, -143);
    }

    ctx.restore();
  }

  function drawNeighborPet(p) {
    const bob = p.onLeash
      ? Math.abs(Math.sin(animFrame * 0.28 + p.houseIdx)) * 5
      : Math.sin(animFrame * 0.1 + p.houseIdx) * 2.5;
    const px = p.x;
    const py = p.y - bob;
    const info = p.info;

    ctx.save();
    ctx.translate(px, py);

    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.beginPath();
    ctx.ellipse(0, 4 + bob, 19, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = info.body;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-16, -12);
    ctx.quadraticCurveTo(-24, -22 + Math.sin(animFrame * 0.25) * 6, -20, -28);
    ctx.stroke();

    // Body
    const bGrad = ctx.createRadialGradient(-4, -18, 3, 0, -14, 22);
    bGrad.addColorStop(0, info.accent);
    bGrad.addColorStop(0.6, info.body);
    bGrad.addColorStop(1, info.ear);
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.ellipse(0, -14, 17, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = info.body;
    ctx.beginPath();
    ctx.roundRect(-11, -6, 6, 10, [3]);
    ctx.roundRect(6, -6, 6, 10, [3]);
    ctx.fill();

    // Collar
    ctx.strokeStyle = info.collar;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, -21);
    ctx.lineTo(16, -13);
    ctx.stroke();

    // Head
    ctx.fillStyle = info.body;
    ctx.beginPath();
    ctx.arc(14, -24, 12, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = info.ear;
    if (info.species === 'bunny') {
      ctx.beginPath();
      ctx.ellipse(10, -43, 4, 12, -0.18, 0, Math.PI * 2);
      ctx.ellipse(17, -42, 4, 11, 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (info.species === 'dog') {
      ctx.beginPath();
      ctx.ellipse(6, -23, 5, 10, 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(7, -33);
      ctx.lineTo(11, -42);
      ctx.lineTo(16, -33);
      ctx.closePath();
      ctx.fill();
    }

    // Eye & Nose
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(19, -26, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(19.6, -26.8, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(25, -22, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Name tag
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.roundRect(-26, 11, 62, 18, [9]);
    ctx.fill();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#271333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(info.name, 5, 20);

    ctx.restore();
  }

  function drawPetSpeechBubble(p) {
    if (!p || p.state !== 'caring') return;
    const need = CARE_BY_ID[p.need];
    const bw = 158;
    const bh = 66;
    const bx = Math.max(12, Math.min(860 - bw - 12, p.x - bw / 2 + 8));
    const by = p.y - 118;

    ctx.save();
    ctx.shadowColor = 'rgba(88, 28, 135, 0.18)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [16]);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p.x + 2, by + bh - 2);
    ctx.lineTo(p.x + 8, by + bh + 12);
    ctx.lineTo(p.x + 16, by + bh - 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = need.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [16]);
    ctx.stroke();

    ctx.fillStyle = need.light;
    ctx.beginPath();
    ctx.arc(bx + 26, by + 27, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '700 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(need.icon, bx + 26, by + 28);

    ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#271333';
    ctx.textAlign = 'left';
    ctx.fillText(need.short, bx + 48, by + 22);

    ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText(`+${need.reward} 🪙 · ${p.happiness}/${p.tasksGoal}`, bx + 48, by + 39);

    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 11, bw - 20, 5, [3]);
    ctx.fill();
    ctx.fillStyle = p.patience >= 55 ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 11, Math.max(4, ((bw - 20) * p.patience) / 100), 5, [3]);
    ctx.fill();
    ctx.restore();
  }

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Sunny Sky
    const sky = ctx.createLinearGradient(0, 0, 0, 225);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(0.65, '#bae6fd');
    sky.addColorStop(1, '#fef9c3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, 225);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    [[180, 42], [460, 34], [740, 48]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.arc(cx + 20, cy - 4, 22, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy + 2, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 170, 8, 340, 26, [13]);
    ctx.fill();
    ctx.font = '800 12.5px "Outfit", sans-serif';
    ctx.fillStyle = '#0f766e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DEIN HAUS ➔ NACHBARSCHAFT · HUNDESITTING', w / 2, 21);

    // 2. Lawns, Garden Paths Between Houses, Street & Lower Park Meadow (walkable EVERYWHERE!)
    const lawn = ctx.createLinearGradient(0, 140, 0, h);
    lawn.addColorStop(0, '#86efac');
    lawn.addColorStop(0.35, '#4ade80');
    lawn.addColorStop(1, '#10b981');
    ctx.fillStyle = lawn;
    ctx.fillRect(0, 140, w, h - 140);

    // Stepping stone paths behind/between houses
    ctx.fillStyle = 'rgba(254, 243, 199, 0.72)';
    [164, 392, 622].forEach((gx) => {
      ctx.beginPath();
      ctx.roundRect(gx - 18, 146, 36, 94, [14]);
      ctx.fill();
    });

    const pathGrad = ctx.createLinearGradient(0, 232, 0, 286);
    pathGrad.addColorStop(0, '#fef3c7');
    pathGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = pathGrad;
    ctx.fillRect(0, 234, w, 52);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.16)';
    ctx.fillRect(0, 234, w, 4);
    ctx.fillRect(0, 282, w, 4);

    // Scenic park meadow path & wildflowers in lower area
    ctx.fillStyle = 'rgba(254, 249, 195, 0.52)';
    ctx.beginPath();
    ctx.roundRect(40, 396, w - 80, 38, [19]);
    ctx.fill();
    ['#f472b6', '#fde047', '#ffffff', '#c084fc'].forEach((col, i) => {
      ctx.fillStyle = col;
      [90, 230, 420, 610, 770].forEach((fx, j) => {
        ctx.beginPath();
        ctx.arc(fx + (i % 2) * 18, 330 + ((i + j) % 3) * 38, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 3. Draw Your House + 3 Neighbor Houses + Neighbors Standing at Their Porches!
    drawOwnHomeOnStreet();
    NEIGHBOR_HOUSES.forEach((h, idx) => {
      drawNeighborHouse(h);
      drawNeighborPerson(h, houseSlots[idx]);
    });

    // 4. Draw Neighbor Pets + Speech Bubbles / Leash Progress
    houseSlots.forEach((p) => {
      if (!p) return;
      drawNeighborPet(p);
      if (p.onLeash) {
        const pct = Math.min(100, Math.round((p.leashDistance / WALK_GOAL_DISTANCE) * 100));
        ctx.save();
        ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
        const label = p.walkReady ? `✨ ${p.info.name} fertig!` : `🐕 Leine ${pct}%`;
        const lw = ctx.measureText(label).width + 16;
        ctx.fillStyle = p.walkReady ? '#ecfdf5' : '#f5f3ff';
        ctx.strokeStyle = p.walkReady ? '#10b981' : '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(p.x - lw / 2, p.y - 68, lw, 20, [10]);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = p.walkReady ? '#047857' : '#6d28d9';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, p.x, p.y - 58);
        ctx.restore();
      } else {
        drawPetSpeechBubble(p);
      }
    });

    // Draw colorful leashes for ALL leashed neighbor animals
    const leashedNow = getLeashedVisits();
    leashedNow.forEach((p) => {
      ctx.save();
      ctx.strokeStyle = p.info.collar || '#ec4899';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(player.x + player.facing * 12, player.y - 42);
      ctx.quadraticCurveTo(
        (player.x + p.x) / 2,
        Math.max(player.y, p.y) - 12,
        p.x + 12,
        p.y - 18
      );
      ctx.stroke();
      ctx.restore();
    });

    // 5. Own Companion Pets following player + tappable to cuddle!
    petFollowers.draw(ctx, animFrame, {
      scale: 0.92,
      showLeashes: true,
      anchorX: player.x,
      anchorY: player.y,
      facing: player.facing
    });

    // 6. Player Character always drawn ON TOP!
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    if (ballFx) {
      ctx.save();
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(ballFx.x, ballFx.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

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
    if (stateManager.getState() === 'PETSITTING') {
      updateHUD();
    }
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'PETSITTING') {
      initShift();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
