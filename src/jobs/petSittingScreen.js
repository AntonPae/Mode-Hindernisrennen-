import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';
import { HomeManager } from '../home/homeData.js';
import { PetFollowerController, getPetMeta } from '../home/petCompanion.js';
import { askPersonAI, parsePetCommand } from '../social/socialData.js';
import { drawCanvasSpeechBubble } from '../social/canvasSpeech.js';
import { mountTalkPanel } from '../social/talkPanel.js';

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
  standY: 266
};

const SIDEWALK_MIN_Y = 256;
const SIDEWALK_MAX_Y = 288;
const LOWER_PARK_MIN_Y = 394;
const LOWER_PARK_MAX_Y = 430;
const CONNECTOR_XS = [82, 300, 530, 752];
const CONNECTOR_HALF_W = 24;
const NEIGHBOR_STAND_Y = 224;

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
  const unleashAllBtn = document.getElementById('petUnleashAllBtn');
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
    pendingCallback: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  const houseSlots = [null, null, null];
  const houseCooldowns = [0, 240, 420];
  let quietPauseTimer = 0;
  let visitsSinceBreak = 0;
  const fxParticles = [];
  const waterDrops = [];
  let ballFx = null;
  const petFollowers = new PetFollowerController({ includeSitting: false });
  const neighborSpeeches = new Map();

  const NEIGHBOR_IDS = ['weber', 'frieda', 'kaya'];
  const NEIGHBOR_ROLES = [
    'Nachbar & Hundefreund',
    'Nachbarin & Bäckerin',
    'Tierliebhaberin & Gärtnerin'
  ];
  const NEIGHBOR_ICONS = ['🐕', '🏡', '🐱'];

  function setNeighborSpeech(houseIdx, text, duration = 165) {
    neighborSpeeches.set(NEIGHBOR_IDS[houseIdx], { text, timer: duration });
  }

  function applyCommandToNeighborPet(visit, parsed, cmdText) {
    if (!visit) return;
    if (parsed.command === 'spin') {
      visit.trickTimer = 28;
      visit.cuddleTimer = 26;
    } else if (parsed.command === 'fetch') {
      visit.fetchTimer = 64;
      visit.command = 'follow';
    } else if (parsed.command === 'praise') {
      visit.cuddleTimer = 30;
    } else {
      visit.command = parsed.command;
      if (parsed.command === 'stay') {
        visit.stayX = visit.x;
        visit.stayY = visit.y;
      } else {
        visit.stayX = null;
        visit.stayY = null;
      }
    }
    visit.speechText = parsed.speech || `${cmdText} 🐾`;
    visit.speechTimer = 120;
  }

  function getPetSittingTalkTargets() {
    const people = NEIGHBOR_HOUSES.map((h, idx) => ({
      id: NEIGHBOR_IDS[idx],
      type: 'person',
      kind: 'neighbor',
      houseIdx: idx,
      name: h.neighborName,
      icon: NEIGHBOR_ICONS[idx],
      role: NEIGHBOR_ROLES[idx],
      x: h.neighborX,
      y: NEIGHBOR_STAND_Y
    })).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));

    const neighborPets = [];
    houseSlots.forEach((v, idx) => {
      if (v && v.state !== 'happy_leaving') {
        const sp = v.info.species;
        neighborPets.push({
          id: `neighbor_pet_${idx}`,
          type: 'pet',
          isNeighborPet: true,
          houseIdx: idx,
          name: `${v.info.name} (Pflege)`,
          rawName: v.info.name,
          species: sp,
          icon: sp === 'cat' ? '🐱' : sp === 'bunny' ? '🐰' : sp === 'parrot' ? '🦜' : sp === 'turtle' ? '🐢' : '🐕'
        });
      }
    });

    const ownIds = HomeManager.getCompanionPets();
    const ownPets = ownIds.map((id) => {
      const meta = getPetMeta(id);
      return {
        id,
        type: 'pet',
        name: meta.name,
        rawName: meta.name,
        species: meta.species,
        icon: meta.icon
      };
    });

    const allPets = [...neighborPets, ...ownPets];
    const petTargets = allPets.length > 0
      ? [{ id: 'all', type: 'pet', name: 'Alle Tiere', icon: '🐾' }, ...allPets]
      : [];

    return [...people, ...petTargets];
  }

  const talkPanel = mountTalkPanel({
    mountEl: document.getElementById('petTalkMount'),
    getTargets: getPetSittingTalkTargets,
    onFocusTarget: (target) => {
      if (target.type === 'person') {
        const h = NEIGHBOR_HOUSES[target.houseIdx];
        if (h) {
          navigateToPoint(h.neighborX + 14, 266, null, () => {
            player.facing = h.neighborX >= player.x ? 1 : -1;
          });
        }
      }
    },
    onTalkPerson: async (target, phrase) => {
      const h = NEIGHBOR_HOUSES[target.houseIdx];
      if (!h) return;
      player.facing = h.neighborX >= player.x ? 1 : -1;
      player.speechText = phrase;
      player.speechTimer = 135;
      player.pose = 'pet';
      player.poseTimer = 20;
      setNeighborSpeech(target.houseIdx, '💭 …', 90);
      if (Math.hypot(player.x - h.neighborX, player.y - NEIGHBOR_STAND_Y) > 130) {
        navigateToPoint(h.neighborX + 14, 266, null, () => {
          player.facing = h.neighborX >= player.x ? 1 : -1;
        });
      }
      const res = await askPersonAI(target, phrase, { scene: 'petsitting' });
      if (!res.ok) {
        const errMsg = `⚠️ ${target.name} konnte nicht antworten (${res.error})`;
        talkPanel.refresh(errMsg);
        setStatus(errMsg);
        return;
      }
      setNeighborSpeech(target.houseIdx, res.bubble, 175);
      talkPanel.refresh(`${target.icon} ${target.name}: „${res.reply}“`);
      setStatus(`💬 ${target.name}: „${res.reply}“`);
    },
    onCommandPet: (target, payload) => {
      const firstFollower = petFollowers.followers[0];
      const fallbackSpecies = target.species || (firstFollower ? getPetMeta(firstFollower.petRef).species : 'dog');
      const meta = {
        name: target.rawName || target.name,
        species: fallbackSpecies,
        say: getPetMeta(fallbackSpecies).say
      };
      const parsed = payload.commandId
        ? {
            command: payload.commandId,
            speech: payload.commandId === 'praise' ? `❤️ ${meta.say}` : `${payload.text} 🐾`,
            reply: `${target.name} führt „${payload.text}“ sofort aus!`
          }
        : parsePetCommand(payload.text, meta);

      player.speechText = `${target.id === 'all' ? 'Alle' : meta.name}: ${payload.text}`;
      player.speechTimer = 115;
      player.pose = 'pet';
      player.poseTimer = 22;

      if (target.id === 'all') {
        petFollowers.issueCommand('all', parsed.command, parsed.speech, { x: player.x, y: player.y });
        houseSlots.forEach((v) => {
          if (v && v.state !== 'happy_leaving') {
            applyCommandToNeighborPet(v, parsed, payload.text);
          }
        });
      } else if (target.isNeighborPet) {
        const visit = houseSlots[target.houseIdx];
        applyCommandToNeighborPet(visit, parsed, payload.text);
      } else {
        petFollowers.issueCommand(target.id, parsed.command, parsed.speech, { x: player.x, y: player.y });
      }

      talkPanel.refresh(`🐾 ${parsed.reply}`);
      setStatus(parsed.reply);
    }
  });

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

  function spawnRealisticWaterStream(fromX, fromY, toX, toY) {
    for (let i = 0; i < 12; i++) {
      waterDrops.push({
        x: fromX + (Math.random() - 0.5) * 4,
        y: fromY - i * 1.5,
        vx: (toX - fromX) * 0.055 + (Math.random() - 0.5) * 0.4,
        vy: 1.5 + Math.random() * 1.1,
        targetY: toY,
        life: 32
      });
    }
  }

  function isOnNeighborhoodPath(x, y) {
    if (x >= 28 && x <= 832 && y >= SIDEWALK_MIN_Y && y <= SIDEWALK_MAX_Y) return true;
    if (x >= 40 && x <= 820 && y >= LOWER_PARK_MIN_Y && y <= LOWER_PARK_MAX_Y) return true;
    if (Math.abs(x - MY_HOME_PORTAL.x) <= 20 && y >= 204 && y <= SIDEWALK_MAX_Y) return true;
    for (let i = 0; i < CONNECTOR_XS.length; i++) {
      if (Math.abs(x - CONNECTOR_XS[i]) <= CONNECTOR_HALF_W && y >= SIDEWALK_MIN_Y && y <= LOWER_PARK_MAX_Y) {
        return true;
      }
    }
    return false;
  }

  function hitsNeighborhoodObstacle(x, y) {
    for (let i = 0; i < NEIGHBOR_HOUSES.length; i++) {
      const h = NEIGHBOR_HOUSES[i];
      if (Math.hypot(x - h.neighborX, y - NEIGHBOR_STAND_Y) < 33) return true;
      const v = houseSlots[i];
      if (v && v.state !== 'happy_leaving' && !v.onLeash) {
        if (Math.hypot(x - v.x, y - v.y) < 23) return true;
      }
    }
    return false;
  }

  function snapToNeighborhoodPath(tx, ty) {
    const x = Math.max(28, Math.min(832, tx));
    const y = Math.max(204, Math.min(LOWER_PARK_MAX_Y, ty));

    const candidates = [
      { x, y: Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, y)) },
      { x: Math.max(40, Math.min(820, x)), y: Math.max(LOWER_PARK_MIN_Y, Math.min(LOWER_PARK_MAX_Y, y)) }
    ];
    if (y < SIDEWALK_MIN_Y && Math.abs(x - MY_HOME_PORTAL.x) < 90) {
      candidates.push({
        x: Math.max(MY_HOME_PORTAL.x - 16, Math.min(MY_HOME_PORTAL.x + 16, x)),
        y: Math.max(204, Math.min(SIDEWALK_MAX_Y, y))
      });
    }
    CONNECTOR_XS.forEach((cx) => {
      candidates.push({
        x: Math.max(cx - (CONNECTOR_HALF_W - 2), Math.min(cx + (CONNECTOR_HALF_W - 2), x)),
        y: Math.max(SIDEWALK_MIN_Y, Math.min(LOWER_PARK_MAX_Y, y))
      });
    });

    let best = candidates[0];
    let bestD = Infinity;
    candidates.forEach((c) => {
      if (hitsNeighborhoodObstacle(c.x, c.y)) return;
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    });

    if (hitsNeighborhoodObstacle(best.x, best.y)) {
      best.y = Math.max(SIDEWALK_MIN_Y + 6, Math.min(SIDEWALK_MAX_Y, best.y));
    }
    return best;
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
      x: house.x - 14,
      y: 232,
      need: firstNeed,
      happiness: 0,
      tasksGoal: 2,
      state: 'offering', // 'offering' -> 'caring' -> 'happy_leaving'
      onLeash: false,
      leashDistance: 0,
      walkReady: false,
      happyTimer: 0,
      patience: 100,
      bowlTimer: 0,
      bowlType: null,
      cuddleTimer: 0,
      command: 'follow',
      stayX: null,
      stayY: null,
      trickTimer: 0,
      fetchTimer: 0,
      speechText: '',
      speechTimer: 0
    };
  }

  function getLeashedVisits() {
    return houseSlots.filter((v) => v && v.state === 'caring' && v.onLeash);
  }

  function syncSittingSlots() {
    HomeManager.savePetSittingSlots(houseSlots);
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
    ballFx = null;
    quietPauseTimer = 0;
    visitsSinceBreak = 0;
    player.x = MY_HOME_PORTAL.standX;
    player.y = MY_HOME_PORTAL.standY;
    player.facing = 1;
    player.waypoints = [];
    player.pendingAction = null;
    player.pendingCallback = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    player.speechText = '';
    player.speechTimer = 0;
    neighborSpeeches.clear();
    petFollowers.reset(player.x, player.y + 4);

    const saved = HomeManager.getPetSittingSlots();
    if (saved && saved.some((v) => v && (v.state === 'caring' || v.state === 'offering'))) {
      for (let i = 0; i < 3; i++) {
        const s = saved[i];
        houseSlots[i] = s ? { command: 'follow', stayX: null, stayY: null, trickTimer: 0, fetchTimer: 0, speechText: '', speechTimer: 0, ...s } : null;
        houseCooldowns[i] = s ? 0 : 220 + i * 110;
        if (houseSlots[i] && houseSlots[i].state === 'caring' && houseSlots[i].onLeash) {
          houseSlots[i].x = player.x - 32 - i * 24;
          houseSlots[i].y = player.y + 6;
        }
      }
      selectedHouseIdx = Math.max(0, houseSlots.findIndex((v) => v && v.state !== 'happy_leaving'));
    } else {
      shiftCoins = 0;
      // Calm start: 2 neighbors outside, 1 arrives later so not everyone is always waiting!
      houseSlots[0] = createNeighborVisit(0, true);
      houseSlots[1] = null;
      houseSlots[2] = createNeighborVisit(2, false);
      houseCooldowns[0] = 0;
      houseCooldowns[1] = 280;
      houseCooldowns[2] = 0;
      selectedHouseIdx = 0;
    }

    syncSittingSlots();
    updateHUD();
    renderHouseTabs();
    renderCareButtons();
    talkPanel.refresh();
    setStatus('Hol Pflegehunde bei den Nachbarn ab, redet mit allen Nachbarn oder gebt den Tieren Anweisungen!');
  }

  function updateHUD() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (caredValEl) caredValEl.textContent = petsHelpedCount;
    if (shiftEarningsEl) shiftEarningsEl.textContent = shiftCoins;

    const leashed = getLeashedVisits();
    const anyReady = leashed.some((v) => v.walkReady);
    const ownLeashedCount = HomeManager.getCompanionPets().length;
    const ownOwnedCount = (HomeManager.getState().owned.pets || []).length;
    const waitingOrUnleashedNeighbors = houseSlots.filter((v) => v && (v.state === 'offering' || (v.state === 'caring' && !v.onLeash))).length;
    const totalAllLeashed = leashed.length + ownLeashedCount;

    if (leashAllBtn) {
      if (waitingOrUnleashedNeighbors === 0 && ownLeashedCount >= ownOwnedCount && totalAllLeashed > 0) {
        leashAllBtn.textContent = `🐾 Alle ${totalAllLeashed} an Leine!`;
      } else if (totalAllLeashed > 0) {
        leashAllBtn.textContent = `🐕 Alle an Leine (${totalAllLeashed})`;
      } else {
        leashAllBtn.textContent = '🐕 Alle an die Leine!';
      }
    }

    if (unleashAllBtn) {
      if (leashed.length > 0) {
        unleashAllBtn.classList.remove('hidden');
        unleashAllBtn.textContent = anyReady
          ? `✅ Gassi fertig! Leinen ab (${leashed.length})`
          : `🔓 Leinen ab (${leashed.length})`;
      } else {
        unleashAllBtn.classList.add('hidden');
      }
    }

    if (activePetSlotsEl) {
      if (leashed.length > 0) {
        const names = leashed.map((v) => v.info.name).join(', ');
        const avgPct = Math.min(100, Math.round((leashed.reduce((s, v) => s + Math.min(WALK_GOAL_DISTANCE, v.leashDistance), 0) / (leashed.length * WALK_GOAL_DISTANCE)) * 100));
        activePetSlotsEl.innerHTML = anyReady
          ? `<span class="cone-scoop-chip" style="--scoop:#10b981;--scoop-light:#d1fae5;">✨ ${names} (Gassi fertig!): Kommen überall mit dir mit – oder tippe „Gassi fertig!“!</span>`
          : `<span class="cone-scoop-chip" style="--scoop:#8b5cf6;--scoop-light:#ede9fe;">🐕 Kommen überall mit (${leashed.length}): ${names} · ${avgPct}% – Lauf auch ins Haus, in die Stadt oder ins Café!</span>`;
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
            navigateToPoint(house.neighborX + 14, 266, { type: 'accept', houseIdx: idx });
          } else {
            navigateToPoint(house.yardX + 8, house.yardY - 8, null);
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
    syncSittingSlots();
    updateHUD();
    talkPanel.refresh();
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
        v.x = house.yardX - 30;
        v.y = house.yardY - 8;
      });
      syncSittingSlots();
      updateHUD();
      showToast('🐾 Leinen abgenommen! Die Tiere warten jetzt bei den Häusern.', 'info');
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
      v.x = house.yardX - 30;
      v.y = house.yardY - 8;

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
          v.cuddleTimer = 45;
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
    syncSittingSlots();
    updateHUD();
    if (packBonus > 0 || totalBonusCoins > 0) {
      showToast(`🐕 Rudel-Gassi geschafft! +${totalBonusCoins + packBonus} 🪙 extra Rudel-Bonus!`, 'success');
    }
    return true;
  }

  function putAllCaringOnLeash() {
    let newlyAccepted = 0;
    let newlyLeashed = 0;
    let upfrontCoins = 0;

    // 1. Accept ALL waiting offering neighbors & put their animals straight onto leashes!
    houseSlots.forEach((v, idx) => {
      if (v && v.state === 'offering') {
        const house = NEIGHBOR_HOUSES[idx];
        const upfront = v.info.upfrontPay;
        v.state = 'caring';
        v.onLeash = true;
        v.leashDistance = 0;
        v.walkReady = false;
        v.x = house.yardX - 30;
        v.y = house.yardY - 8;

        upfrontCoins += upfront;
        newlyAccepted++;
        newlyLeashed++;
        v.cuddleTimer = 35;
      } else if (v && v.state === 'caring' && !v.onLeash) {
        v.onLeash = true;
        v.leashDistance = 0;
        v.walkReady = false;
        newlyLeashed++;
        v.cuddleTimer = 35;
      }
    });

    if (upfrontCoins > 0) {
      shiftCoins += upfrontCoins;
      ShopManager.addCoins(upfrontCoins);
      ShopManager.recordProgress(0, upfrontCoins);
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
      player.pose = 'pet';
      player.poseTimer = 24;
    }

    // 2. Also put ALL owned pets onto leashes at the exact same time!
    const ownedPetsCount = (HomeManager.getState().owned.pets || []).length;
    const prevOwnCompanions = HomeManager.getCompanionPets().length;
    let ownNowCount = prevOwnCompanions;
    if (ownedPetsCount > 0) {
      ownNowCount = HomeManager.setAllCompanions(true).length;
    }

    const newlyOwnLeashed = Math.max(0, ownNowCount - prevOwnCompanions);
    const totalNeighborsLeashed = getLeashedVisits().length;
    const grandTotal = totalNeighborsLeashed + ownNowCount;

    syncSittingSlots();
    updateHUD();
    talkPanel.refresh();

    if (grandTotal === 0) {
      showToast('Gerade warten keine Tiere – tippe auf „🔔 Nachbar rufen“!', 'info');
      return;
    }

    if (newlyAccepted > 0 || newlyLeashed > 0 || newlyOwnLeashed > 0) {
      const coinTxt = upfrontCoins > 0 ? ` (+${upfrontCoins} 🪙)` : '';
      showToast(`🐕 Alle ${grandTotal} Tiere gleichzeitig an der Leine!${coinTxt}`, 'success');
      setStatus(`🐾 Alle ${grandTotal} Tiere (eigene + Pflege-Tiere) laufen jetzt überall mit dir mit!`);
    } else {
      showToast(`🐾 Alle ${grandTotal} Tiere sind schon gleichzeitig an der Leine!`, 'success');
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
        navigateToPoint(house.neighborX + 14, 266, { type: 'accept', houseIdx: targetIdx });
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
            navigateToPoint(house.neighborX + 14, 266, { type: 'accept_and_leash', houseIdx: targetIdx });
            return;
          }
          if (visit && visit.state === 'caring') {
            if (!visit.onLeash) {
              visit.onLeash = true;
              visit.leashDistance = 0;
              visit.walkReady = false;
              visit.cuddleTimer = 35;
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
          navigateToPoint(house.neighborX + 14, 266, { type: 'accept', houseIdx: targetIdx });
          return;
        }
        const standTarget = visit.onLeash ? { x: player.x, y: player.y } : { x: house.yardX + 8, y: house.yardY - 8 };
        navigateToPoint(standTarget.x, standTarget.y, { type: 'care', houseIdx: targetIdx, actionId: act.id });
      });
      careBarEl.appendChild(btn);
    });
  }

  function navigateToPoint(tx, ty, pendingAction = null, pendingCallback = null) {
    const dest = snapToNeighborhoodPath(tx, ty);
    const wps = [];
    const curX = player.x;
    const curY = player.y;

    const addWp = (x, y) => {
      const last = wps.length > 0 ? wps[wps.length - 1] : { x: curX, y: curY };
      if (Math.hypot(last.x - x, last.y - y) > 6) {
        wps.push({ x, y });
      }
    };

    const getConnX = (px) => {
      let best = CONNECTOR_XS[0];
      let bd = Infinity;
      CONNECTOR_XS.forEach((cx) => {
        const d = Math.abs(cx - px);
        if (d < bd) { bd = d; best = cx; }
      });
      return best;
    };

    const inDoorPath = curY < SIDEWALK_MIN_Y;
    const destInDoorPath = dest.y < SIDEWALK_MIN_Y;

    let effY = curY;
    let effX = curX;
    if (inDoorPath && !destInDoorPath) {
      addWp(MY_HOME_PORTAL.x, 270);
      effX = MY_HOME_PORTAL.x;
      effY = 270;
    }

    const curOnSidewalk = effY >= SIDEWALK_MIN_Y && effY <= SIDEWALK_MAX_Y;
    const curOnLower = effY >= LOWER_PARK_MIN_Y && effY <= LOWER_PARK_MAX_Y;
    const destOnSidewalk = dest.y >= SIDEWALK_MIN_Y && dest.y <= SIDEWALK_MAX_Y;
    const destOnLower = dest.y >= LOWER_PARK_MIN_Y && dest.y <= LOWER_PARK_MAX_Y;

    if ((curOnSidewalk && destOnSidewalk) || (curOnLower && destOnLower)) {
      addWp(dest.x, dest.y);
    } else if (curOnSidewalk && destInDoorPath) {
      addWp(MY_HOME_PORTAL.x, 270);
      addWp(dest.x, dest.y);
    } else {
      // Vertical transition or switching connectors: stay strictly on paved stones
      let exitConn = getConnX(effX);
      if (!curOnSidewalk && !curOnLower) {
        // Inside a vertical connector
        if (Math.abs(exitConn - dest.x) <= CONNECTOR_HALF_W && dest.y >= SIDEWALK_MIN_Y && dest.y <= LOWER_PARK_MAX_Y) {
          addWp(dest.x, dest.y);
          player.waypoints = wps;
          player.pendingAction = pendingAction;
          player.pendingCallback = pendingCallback;
          return;
        }
        const hubY = destOnLower ? 412 : 270;
        addWp(exitConn, hubY);
        effX = exitConn;
        effY = hubY;
      }

      if (destOnSidewalk && Math.abs(effY - 270) <= 22) {
        addWp(dest.x, dest.y);
      } else if (destOnLower && Math.abs(effY - 412) <= 22) {
        addWp(dest.x, dest.y);
      } else {
        const entryConn = getConnX(dest.x);
        const curHubY = effY <= SIDEWALK_MAX_Y ? 270 : 412;
        addWp(entryConn, curHubY);
        if (destInDoorPath) {
          addWp(MY_HOME_PORTAL.x, 270);
        } else if (dest.y > SIDEWALK_MAX_Y && dest.y < LOWER_PARK_MIN_Y) {
          addWp(entryConn, dest.y);
        } else {
          const destHubY = dest.y <= SIDEWALK_MAX_Y ? 270 : 412;
          addWp(entryConn, destHubY);
        }
        addWp(dest.x, dest.y);
      }
    }

    if (wps.length === 0) addWp(dest.x, dest.y);
    player.waypoints = wps;
    player.pendingAction = pendingAction;
    player.pendingCallback = pendingCallback;
  }

  function acceptNeighborJob(houseIdx, autoLeash = true) {
    const visit = houseSlots[houseIdx];
    const house = NEIGHBOR_HOUSES[houseIdx];
    if (!visit || visit.state !== 'offering') return;

    const upfront = visit.info.upfrontPay;
    visit.state = 'caring';
    visit.onLeash = autoLeash;
    visit.leashDistance = 0;
    visit.walkReady = false;
    visit.x = house.yardX - 30;
    visit.y = house.yardY - 8;

    shiftCoins += upfront;
    ShopManager.addCoins(upfront);
    ShopManager.recordProgress(0, upfront);
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    player.pose = 'pet';
    player.poseTimer = 24;
    visit.cuddleTimer = 45;
    syncSittingSlots();
    updateHUD();
    talkPanel.refresh();

    const firstNeed = CARE_BY_ID[visit.need];
    if (autoLeash) {
      showToast(`💰 +${upfront} 🪙 von ${house.neighborName}! ${visit.info.name} läuft jetzt überall mit dir mit!`, 'success');
      setStatus(`🐕 ${visit.info.name} kommt an der Leine überall mit (auch ins Haus, Café, Stadt & Rennen)! Wunsch: ${firstNeed.icon} ${firstNeed.label}.`);
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

    if (actionId === 'feed') {
      visit.bowlType = 'food';
      visit.bowlTimer = 160;
    } else if (actionId === 'water') {
      visit.bowlType = 'water';
      visit.bowlTimer = 160;
      const facingDir = visit.x < player.x ? -1 : 1;
      spawnRealisticWaterStream(player.x + facingDir * 22, player.y - 38, visit.x + 24, visit.y + 4);
    } else if (actionId === 'brush') {
      visit.cuddleTimer = 55;
    } else if (actionId === 'play') {
      ballFx = { x: player.x, y: player.y - 30, vx: -player.facing * 4.5, vy: -5.2, life: 44 };
    }

    syncSittingSlots();
    updateHUD();
    talkPanel.refresh();
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
    if (!visit || visit.state === 'happy_leaving') {
      showToast('Hier wartet gerade kein Tier auf Betreuung!', 'info');
      return;
    }

    if (visit.state === 'offering') {
      acceptNeighborJob(houseIdx, true);
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
        visit.cuddleTimer = 35;
        syncSittingSlots();
        updateHUD();
        showToast(`🐕 ${visit.info.name} ist an der Leine & kommt überall mit!`, 'success');
        setStatus(`🐕 ${visit.info.name} kommt überall mit! Du kannst noch mehr Tiere dazu nehmen.`);
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
    player.pose = actionId === 'water' ? 'water' : actionId === 'play' ? 'jump' : 'pet';
    player.poseTimer = actionId === 'water' ? 34 : 28;
    awardCareSuccess(houseIdx, actionId);
  }

  function handleCanvasClick(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    // 0. Tapping one of your own companion pets cuddles them & selects them for commands!
    const tappedPet = petFollowers.handleTap(cx, cy);
    if (tappedPet.hit) {
      player.pose = 'pet';
      player.poseTimer = 22;
      talkPanel.selectTarget(tappedPet.petId, `🐾 ${tappedPet.meta.name} wedelt fröhlich – gib gern eine Anweisung!`);
      showToast(`❤️ ${tappedPet.meta.name} wedelt fröhlich und freut sich!`, 'success');
      return;
    }

    // 1. Clicked on "🏡 Dein Haus" door on the far left?
    if (cx >= 52 && cx <= 114 && cy >= 136 && cy <= 212) {
      navigateToPoint(MY_HOME_PORTAL.x, 212, { type: 'go_home' });
      return;
    }

    // 2. Clicked directly on a Neighbor or a Neighbor's Pet/Speech Bubble (within yard/porch area)?
    for (let i = 0; i < NEIGHBOR_HOUSES.length; i++) {
      const h = NEIGHBOR_HOUSES[i];
      const visit = houseSlots[i];
      const hitNeighbor = Math.hypot(cx - h.neighborX, cy - (NEIGHBOR_STAND_Y - 36)) <= 44;
      const hitPet = visit && visit.state !== 'happy_leaving' && Math.hypot(cx - visit.x, cy - (visit.y - 16)) <= 46;
      const hitBubble = visit && visit.state === 'offering'
        ? (Math.abs(cx - (h.neighborX + 12)) <= 80 && cy >= 80 && cy <= 165)
        : (visit && visit.state === 'caring' && Math.abs(cx - (visit.x + 8)) <= 84 && cy >= visit.y - 122 && cy <= visit.y - 45);

      if (hitNeighbor || hitPet || hitBubble) {
        selectedHouseIdx = i;
        updateHUD();
        if (visit && visit.state === 'offering') {
          talkPanel.selectTarget(NEIGHBOR_IDS[i]);
          navigateToPoint(h.neighborX + 14, 266, { type: 'accept', houseIdx: i });
          return;
        }
        if (hitNeighbor) {
          const targetObj = {
            id: NEIGHBOR_IDS[i],
            type: 'person',
            kind: 'neighbor',
            houseIdx: i,
            name: h.neighborName,
            icon: NEIGHBOR_ICONS[i],
            role: NEIGHBOR_ROLES[i]
          };
          navigateToPoint(h.neighborX + 14, 266, null, async () => {
            player.facing = h.neighborX >= player.x ? 1 : -1;
            player.speechText = 'Hallo! 😊';
            player.speechTimer = 110;
            setNeighborSpeech(i, '💭 …', 90);
            talkPanel.selectTarget(NEIGHBOR_IDS[i], `💭 ${h.neighborName} überlegt...`);
            const res = await askPersonAI(targetObj, 'Hallo!', { scene: 'petsitting' });
            if (!res.ok) {
              talkPanel.selectTarget(NEIGHBOR_IDS[i], `⚠️ ${h.neighborName} konnte nicht antworten (${res.error})`);
              return;
            }
            setNeighborSpeech(i, res.bubble, 175);
            talkPanel.selectTarget(NEIGHBOR_IDS[i], `${NEIGHBOR_ICONS[i]} ${h.neighborName}: „${res.reply}“`);
            setStatus(`💬 ${h.neighborName}: „${res.reply}“`);
          });
          return;
        }
        if (visit && visit.state === 'caring') {
          talkPanel.selectTarget(`neighbor_pet_${i}`);
          if (visit.onLeash && visit.walkReady) {
            finishLeashWalk(i);
            return;
          }
          if (hitPet && !visit.onLeash && visit.need === 'walk') {
            performCareAtHouse(i, 'walk');
            return;
          }
          const targetX = visit.onLeash ? player.x : h.yardX + 8;
          const targetY = visit.onLeash ? player.y : h.yardY - 8;
          navigateToPoint(targetX, targetY, { type: 'smart_care', houseIdx: i });
          return;
        }
      }
    }

    // 3. Otherwise walk strictly along paved neighborhood & park paths!
    navigateToPoint(cx, cy, null);
  }

  function triggerNearbyAction() {
    if (Math.hypot(player.x - MY_HOME_PORTAL.x, player.y - 216) < 42) {
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
  if (unleashAllBtn) unleashAllBtn.addEventListener('click', () => finishLeashWalk());
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
      player.pendingCallback = null;
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
    if (player.speechTimer > 0) player.speechTimer--;
    neighborSpeeches.forEach((sp, key) => {
      sp.timer--;
      if (sp.timer <= 0) neighborSpeeches.delete(key);
    });

    let moveX = 0;
    let moveY = 0;
    if (keys.left || holdPad.left) moveX -= 1;
    if (keys.right || holdPad.right) moveX += 1;
    if (keys.up || holdPad.up) moveY -= 1;
    if (keys.down || holdPad.down) moveY += 1;

    const speed = 4.6;
    const canStepTo = (tx, ty) => isOnNeighborhoodPath(tx, ty) && !hitsNeighborhoodObstacle(tx, ty);

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY) || 1;
      const stepX = (moveX / len) * speed;
      const stepY = (moveY / len) * speed;
      const nx = Math.max(28, Math.min(832, player.x + stepX));
      const ny = Math.max(204, Math.min(LOWER_PARK_MAX_Y, player.y + stepY));

      if (canStepTo(nx, ny)) {
        player.x = nx;
        player.y = ny;
      } else if (moveX !== 0 && canStepTo(nx, player.y)) {
        player.x = nx;
      } else if (moveY !== 0 && canStepTo(player.x, ny)) {
        player.y = ny;
      } else if (moveY !== 0 && isOnNeighborhoodPath(player.x, player.y)) {
        // Gentle pull onto nearest connector center if arrowing down/up near path edge
        const nearestConn = CONNECTOR_XS.reduce((a, b) => (Math.abs(b - player.x) < Math.abs(a - player.x) ? b : a), CONNECTOR_XS[0]);
        if (Math.abs(nearestConn - player.x) <= 46) {
          const nudge = player.x + Math.sign(nearestConn - player.x) * Math.min(speed, Math.abs(nearestConn - player.x));
          if (canStepTo(nudge, player.y)) player.x = nudge;
        }
      }
      if (moveX !== 0) player.facing = Math.sign(moveX);
      player.pose = 'walk';
    } else if (player.waypoints.length > 0) {
      const wp = player.waypoints[0];
      const dx = wp.x - player.x;
      const dy = wp.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        if (canStepTo(wp.x, wp.y)) {
          player.x = wp.x;
          player.y = wp.y;
        }
        player.waypoints.shift();
        if (player.waypoints.length === 0) {
          if (player.pendingAction) {
            const act = player.pendingAction;
            player.pendingAction = null;
            if (act.type === 'go_home') stateManager.setState('HOME');
            else if (act.type === 'accept') acceptNeighborJob(act.houseIdx, false);
            else if (act.type === 'accept_and_leash') acceptNeighborJob(act.houseIdx, true);
            else if (act.type === 'care') performCareAtHouse(act.houseIdx, act.actionId);
            else if (act.type === 'smart_care') performCareAtHouse(act.houseIdx, null);
          }
          if (player.pendingCallback) {
            const cb = player.pendingCallback;
            player.pendingCallback = null;
            cb();
          }
        }
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        const nx = player.x + (dx / dist) * speed;
        const ny = player.y + (dy / dist) * speed;
        if (canStepTo(nx, ny)) {
          player.x = nx;
          player.y = ny;
        } else {
          const snapped = snapToNeighborhoodPath(nx, ny);
          player.x = snapped.x;
          player.y = snapped.y;
        }
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
      minX: 28,
      maxX: 832,
      minY: SIDEWALK_MIN_Y,
      maxY: LOWER_PARK_MAX_Y
    });

    const nearIdx = getNearestHouseIdx(player.x, player.y);
    if (nearIdx !== -1 && nearIdx !== selectedHouseIdx) {
      selectedHouseIdx = nearIdx;
      updateHUD();
    }

    // Update ALL leashed neighbor animals together in a neat 2-column staggered pack (respecting pet commands!)
    const leashed = getLeashedVisits();
    let hudDirty = false;
    leashed.forEach((p, idx) => {
      if (p.trickTimer > 0) p.trickTimer--;
      if (p.speechTimer > 0) p.speechTimer--;
      if (p.fetchTimer > 0) {
        p.fetchTimer--;
        const fx = p.fetchTimer > 28 ? player.x + player.facing * 72 : player.x - player.facing * 32;
        const fy = Math.max(SIDEWALK_MIN_Y, Math.min(LOWER_PARK_MAX_Y, player.y + 4));
        p.x += (fx - p.x) * 0.22;
        p.y += (fy - p.y) * 0.22;
      } else if (p.command === 'stay') {
        if (p.stayX == null || p.stayY == null) {
          p.stayX = p.x;
          p.stayY = p.y;
        }
        p.x += (p.stayX - p.x) * 0.16;
        p.y += (p.stayY - p.y) * 0.16;
      } else if (p.command === 'sit' || p.command === 'rest') {
        // Sit or rest calmly in place unless too far away
        const distToPlayer = Math.hypot(player.x - p.x, player.y - p.y);
        if (distToPlayer > 72) {
          p.x += (player.x - player.facing * 38 - p.x) * 0.14;
          p.y += (player.y + 6 - p.y) * 0.14;
        }
      } else {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const slotDist = 36 + row * 28;
        const sideOffset = (col === 0 ? 1 : -1) * (10 + (row % 2) * 6);
        const rawX = Math.max(28, Math.min(832, player.x - player.facing * slotDist));
        const rawY = Math.max(SIDEWALK_MIN_Y, Math.min(LOWER_PARK_MAX_Y, player.y + sideOffset));
        const snappedPet = isOnNeighborhoodPath(rawX, rawY) ? { x: rawX, y: rawY } : { x: player.x - player.facing * 24, y: player.y + 4 };
        p.x += (snappedPet.x - p.x) * 0.16;
        p.y += (snappedPet.y - p.y) * 0.16;
      }

      if (movedStep > 0.4 && p.command !== 'stay' && p.command !== 'sit' && p.command !== 'rest') {
        const beforeReady = p.walkReady;
        p.leashDistance += movedStep;
        if (p.leashDistance >= WALK_GOAL_DISTANCE) {
          p.walkReady = true;
          if (!beforeReady) {
            showToast(`✨ ${p.info.name} hat genug Auslauf gehabt! Tippe auf „✅ Gassi fertig!“ wann immer du magst.`, 'success');
            syncSittingSlots();
            hudDirty = true;
          }
        }
        if (animFrame % 12 === 0) hudDirty = true;
      }
    });
    if (hudDirty) updateHUD();

    // Update bowl, cuddle, command & speech timers cleanly on ground
    houseSlots.forEach((v) => {
      if (!v) return;
      if (v.bowlTimer > 0) v.bowlTimer--;
      if (v.cuddleTimer > 0) v.cuddleTimer--;
      if (!v.onLeash) {
        if (v.trickTimer > 0) v.trickTimer--;
        if (v.speechTimer > 0) v.speechTimer--;
        if (v.fetchTimer > 0) v.fetchTimer--;
      }
    });

    // Calm neighbor pacing & occasional quiet break so neighbors aren't nonstop waiting
    const activeCount = houseSlots.filter((v) => v !== null).length;
    if (activeCount === 0 && visitsSinceBreak >= 3 && quietPauseTimer === 0) {
      quietPauseTimer = 250 + Math.floor(Math.random() * 170);
      visitsSinceBreak = 0;
      setStatus('🌿 Kurze ruhige Pause in der Nachbarschaft – lauf auf den Wegen herum oder tippe „🔔 Nachbar rufen“!');
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
          if (houseCooldowns[i] <= 0 && currentActive < 3) {
            houseSlots[i] = createNeighborVisit(i, i === 0 || Math.random() < 0.55);
            syncSittingSlots();
            updateHUD();
            talkPanel.refresh();
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
            syncSittingSlots();
            updateHUD();
            talkPanel.refresh();
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

    for (let i = waterDrops.length - 1; i >= 0; i--) {
      const d = waterDrops[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.24;
      d.life--;
      if (d.y >= d.targetY || d.life <= 0) {
        waterDrops.splice(i, 1);
      }
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
    const ny = NEIGHBOR_STAND_Y;
    const bob = isOffering || isHappy ? Math.abs(Math.sin(animFrame * 0.12 + h.id)) * 3 : 0;

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

    const activeTalk = neighborSpeeches.get(NEIGHBOR_IDS[h.id]);
    if (activeTalk) {
      drawCanvasSpeechBubble(ctx, nx, ny - (isOffering ? 198 : 132), activeTalk.text, {
        borderColor: '#0ea5e9',
        textColor: '#0f172a',
        maxWidth: 185,
        canvasWidth: 860
      });
    } else if (isOffering) {
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
    const isSitPose = p.command === 'sit' || p.command === 'stay';
    const isRestPose = p.command === 'rest';
    const spinHop = p.trickTimer > 0 ? Math.abs(Math.sin(p.trickTimer * 0.28)) * 12 : 0;
    const bob = p.onLeash && !isSitPose && !isRestPose
      ? Math.abs(Math.sin(animFrame * 0.28 + p.houseIdx)) * 4
      : p.cuddleTimer > 0
        ? Math.abs(Math.sin(animFrame * 0.35 + p.houseIdx)) * 5
        : isRestPose
          ? Math.sin(animFrame * 0.05 + p.houseIdx) * 0.5
          : Math.sin(animFrame * 0.1 + p.houseIdx) * 1.5;
    const px = p.x;
    const py = p.y - bob - spinHop + (isRestPose ? 4 : isSitPose ? 1.5 : 0);
    const info = p.info;

    // Grounded realistic food or water bowl right beside pet!
    if (p.bowlTimer > 0 && p.bowlType) {
      const bx = p.x + 24;
      const by = p.y + 4;
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
      ctx.beginPath();
      ctx.ellipse(bx, by + 3, 14, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.bowlType === 'water' ? '#0284c7' : '#d97706';
      ctx.beginPath();
      ctx.ellipse(bx, by, 13, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.bowlType === 'water' ? '#7dd3fc' : '#78350f';
      ctx.beginPath();
      ctx.ellipse(bx, by - 1.5, 10, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      if (p.bowlType === 'food') {
        ctx.fillStyle = '#b45309';
        [-4, 0, 4, -2, 3].forEach((kx, idx) => {
          ctx.beginPath();
          ctx.arc(bx + kx, by - 2 + (idx % 2), 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(px, py);
    if (p.trickTimer > 0) {
      ctx.rotate((1 - p.trickTimer / 28) * Math.PI * 2);
    } else if (isSitPose) {
      ctx.rotate(-0.14);
    } else if (isRestPose) {
      ctx.scale(1.06, 0.78);
    }

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
    if (!isRestPose) {
      ctx.fillStyle = info.body;
      ctx.beginPath();
      ctx.roundRect(-11, -6, 6, isSitPose ? 7 : 10, [3]);
      ctx.roundRect(6, -6, 6, 10, [3]);
      ctx.fill();
    }

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
    if (isRestPose) {
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(19, -26, 2.4, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(19, -26, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(19.6, -26.8, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

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

    // 2. Lawns + Paved Neighborhood Sidewalk, Door Paths, Yard Connectors & Lower Park Walk
    const lawn = ctx.createLinearGradient(0, 140, 0, h);
    lawn.addColorStop(0, '#86efac');
    lawn.addColorStop(0.35, '#4ade80');
    lawn.addColorStop(1, '#10b981');
    ctx.fillStyle = lawn;
    ctx.fillRect(0, 140, w, h - 140);

    // Door walkway from "Dein Haus" to sidewalk + Neighbor porches
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.roundRect(MY_HOME_PORTAL.x - 18, 200, 36, 58, [8]);
    ctx.fill();
    NEIGHBOR_HOUSES.forEach((nh) => {
      ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
      ctx.beginPath();
      ctx.roundRect(nh.neighborX - 24, 200, 48, 56, [10]);
      ctx.fill();
    });

    // Paved stone connector paths down to the lower park loop
    CONNECTOR_XS.forEach((cx) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(cx - CONNECTOR_HALF_W, SIDEWALK_MIN_Y + 4, CONNECTOR_HALF_W * 2, LOWER_PARK_MAX_Y - SIDEWALK_MIN_Y - 12);
      ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
      for (let sy = SIDEWALK_MAX_Y + 10; sy < LOWER_PARK_MIN_Y; sy += 24) {
        ctx.fillRect(cx - CONNECTOR_HALF_W + 4, sy, CONNECTOR_HALF_W * 2 - 8, 2);
      }
    });

    // Main horizontal sidewalk along all houses
    const pathGrad = ctx.createLinearGradient(0, SIDEWALK_MIN_Y - 4, 0, SIDEWALK_MAX_Y + 2);
    pathGrad.addColorStop(0, '#fef3c7');
    pathGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = pathGrad;
    ctx.fillRect(0, SIDEWALK_MIN_Y - 2, w, SIDEWALK_MAX_Y - SIDEWALK_MIN_Y + 4);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.22)';
    ctx.fillRect(0, SIDEWALK_MIN_Y - 2, w, 3);
    ctx.fillRect(0, SIDEWALK_MAX_Y - 1, w, 3);

    // Crisp lower park promenade path
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(36, LOWER_PARK_MIN_Y - 2, w - 72, LOWER_PARK_MAX_Y - LOWER_PARK_MIN_Y + 4, [18]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ['#f472b6', '#fde047', '#ffffff', '#c084fc'].forEach((col, i) => {
      ctx.fillStyle = col;
      [145, 220, 415, 625, 795].forEach((fx, j) => {
        ctx.beginPath();
        ctx.arc(fx + (i % 2) * 18, 326 + ((i + j) % 2) * 32, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 3. Draw Your House + 3 Neighbor Houses + Neighbors Standing at Their Porches!
    drawOwnHomeOnStreet();
    NEIGHBOR_HOUSES.forEach((h, idx) => {
      drawNeighborHouse(h);
      drawNeighborPerson(h, houseSlots[idx]);
    });

    // 4. Draw Neighbor Pets + Command/Speech Bubbles / Leash Progress
    houseSlots.forEach((p) => {
      if (!p) return;
      drawNeighborPet(p);
      if (p.speechTimer > 0 && p.speechText) {
        drawCanvasSpeechBubble(ctx, p.x, p.y - 54, p.speechText, {
          borderColor: '#ec4899',
          textColor: '#be185d',
          maxWidth: 165,
          canvasWidth: w
        });
      } else if (p.onLeash) {
        const pct = Math.min(100, Math.round((p.leashDistance / WALK_GOAL_DISTANCE) * 100));
        ctx.save();
        ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
        const cmdSuffix = p.command === 'sit' ? ' · 🪑 Sitz' : p.command === 'stay' ? ' · 🐾 Bleibt' : p.command === 'rest' ? ' · 💤 Schlaf' : '';
        const label = p.walkReady ? `✨ ${p.info.name} fertig!${cmdSuffix}` : `🐕 Leine ${pct}%${cmdSuffix}`;
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

    if (player.speechTimer > 0 && player.speechText) {
      drawCanvasSpeechBubble(ctx, player.x, player.y - 122, player.speechText, {
        borderColor: '#0ea5e9',
        textColor: '#0369a1',
        maxWidth: 185,
        canvasWidth: w
      });
    }

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

    // Realistic downward water stream droplets into ground bowl
    waterDrops.forEach((d) => {
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, 2.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
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
      syncSittingSlots();
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
