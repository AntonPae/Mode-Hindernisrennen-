import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';
import { HomeManager } from '../home/homeData.js';
import { PetFollowerController, getPetMeta } from '../home/petCompanion.js';
import { generatePersonReply, parsePetCommand } from '../social/socialData.js';
import { drawCanvasSpeechBubble } from '../social/canvasSpeech.js';
import { mountTalkPanel } from '../social/talkPanel.js';

export const CAFE_STATIONS = [
  { id: 'ice', label: '🍦 Eis-Truhe', x: 112, color: '#f43f5e', light: '#ffe4e6' },
  { id: 'waffle', label: '🧇 Waffel-Eisen', x: 294, color: '#f59e0b', light: '#fef3c7' },
  { id: 'food', label: '🥘 Warme Küche', x: 476, color: '#ea580c', light: '#ffedd5' },
  { id: 'drink', label: '🥤 Getränke-Bar', x: 658, color: '#0ea5e9', light: '#e0f2fe' }
];

export const CAFE_MENU = [
  // Eis (hinter der Eistruhe)
  { id: 'ice_erdbeere', icon: '🍓', name: 'Erdbeer-Eis', short: 'Erdbeere', station: 'ice', kind: 'ice', color: '#f43f5e', light: '#fda4af', dark: '#be123c', price: 7 },
  { id: 'ice_schoko', icon: '🍫', name: 'Schoko-Eis', short: 'Schoko', station: 'ice', kind: 'ice', color: '#78350f', light: '#b45309', dark: '#451a03', price: 7 },
  { id: 'ice_vanille', icon: '🍦', name: 'Vanille-Eis', short: 'Vanille', station: 'ice', kind: 'ice', color: '#fde047', light: '#fef9c3', dark: '#ca8a04', price: 7 },
  { id: 'ice_pistazie', icon: '🍨', name: 'Pistazien-Eis', short: 'Pistazie', station: 'ice', kind: 'ice', color: '#34d399', light: '#a7f3d0', dark: '#047857', price: 8 },
  // Waffeln
  { id: 'waffle_classic', icon: '🧇', name: 'Herzwaffel', short: 'Waffel', station: 'waffle', kind: 'waffle', color: '#f59e0b', light: '#fde68a', dark: '#b45309', topping: '#fffbeb', price: 9 },
  { id: 'waffle_berry', icon: '🫐', name: 'Beeren-Waffel', short: 'Beeren-Waffel', station: 'waffle', kind: 'waffle', color: '#d97706', light: '#fcd34d', dark: '#92400e', topping: '#f43f5e', price: 11 },
  // Essen / Warme Gerichte
  { id: 'food_pan', icon: '🥘', name: 'Gemüse-Pfanne', short: 'Pfanne 🥘', station: 'food', kind: 'pan', color: '#ea580c', light: '#fdba74', dark: '#9a3412', price: 12 },
  { id: 'food_pasta', icon: '🍝', name: 'Pasta', short: 'Pasta 🍝', station: 'food', kind: 'pasta', color: '#ef4444', light: '#fde047', dark: '#b91c1c', price: 12 },
  { id: 'food_pizza', icon: '🍕', name: 'Mini-Pizza', short: 'Pizza 🍕', station: 'food', kind: 'pizza', color: '#f97316', light: '#fef08a', dark: '#c2410c', price: 11 },
  // Trinken
  { id: 'drink_limo', icon: '🍋', name: 'Zitronen-Limo', short: 'Limo 🍋', station: 'drink', kind: 'drink', color: '#fde047', light: '#fef9c3', dark: '#eab308', price: 6 },
  { id: 'drink_shake', icon: '🥤', name: 'Erdbeer-Shake', short: 'Shake 🍓', station: 'drink', kind: 'shake', color: '#f472b6', light: '#fbcfe8', dark: '#db2777', price: 8 },
  { id: 'drink_kakao', icon: '☕', name: 'Warmer Kakao', short: 'Kakao ☕', station: 'drink', kind: 'mug', color: '#92400e', light: '#d97706', dark: '#451a03', price: 7 }
];

const MENU_BY_ID = Object.fromEntries(CAFE_MENU.map((m) => [m.id, m]));

// 4 Bistro Tables in front of the counter
const TABLE_POS = [
  { x: 126, y: 404, guestX: 82, standX: 162, standY: 416 },
  { x: 332, y: 404, guestX: 288, standX: 368, standY: 416 },
  { x: 538, y: 404, guestX: 494, standX: 574, standY: 416 },
  { x: 744, y: 404, guestX: 700, standX: 780, standY: 416 }
];

const COUNTER_LEFT = 98;
const COUNTER_RIGHT = 762;
const COUNTER_TOP_Y = 178;
const COUNTER_BOTTOM_Y = 224;
const AISLE_Y = 172;
const TRASH_X = 805;

function getStationItemSlots(st) {
  const items = CAFE_MENU.filter((m) => m.station === st.id);
  const gap = items.length >= 4 ? 38 : items.length === 3 ? 50 : 62;
  return items.map((item, idx) => ({
    item,
    x: st.x + (idx - (items.length - 1) / 2) * gap,
    y: 102
  }));
}

const CUSTOMER_PRESETS = [
  { skin: '#ffdecb', hair: '#78350f', shirt: '#ec4899', hairStyle: 'bob', name: 'Mia' },
  { skin: '#f5c6a5', hair: '#1e1b4b', shirt: '#0ea5e9', hairStyle: 'short', name: 'Leo' },
  { skin: '#d99b72', hair: '#3b1c0a', shirt: '#a855f7', hairStyle: 'ponytail', name: 'Lina' },
  { skin: '#ffe4d6', hair: '#d97706', shirt: '#10b981', hairStyle: 'curly', name: 'Finn' },
  { skin: '#c6865c', hair: '#1f2937', shirt: '#f43f5e', hairStyle: 'bob', name: 'Amira' },
  { skin: '#ffdecb', hair: '#db2777', shirt: '#6366f1', hairStyle: 'ponytail', name: 'Sofie' }
];

function ordersMatch(trayIds, orderIds) {
  if (trayIds.length !== orderIds.length || trayIds.length === 0) return false;
  const a = [...trayIds].sort();
  const b = [...orderIds].sort();
  return a.every((val, i) => val === b[i]);
}

function getNearbyStation(px, py) {
  if (py > 215) return null;
  let best = null;
  let bestDist = 66;
  CAFE_STATIONS.forEach((st) => {
    const d = Math.abs(px - st.x);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
  });
  return best;
}

function getNearbyTableIdx(px, py) {
  if (py < 245) return -1;
  let best = -1;
  let bestDist = 78;
  TABLE_POS.forEach((tb, idx) => {
    const d = Math.hypot(px - tb.x, py - tb.y);
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
  const traySlotsEl = document.getElementById('iceConeSlots');
  const statusTextEl = document.getElementById('iceStatusText');
  const stationTabsEl = document.getElementById('iceStationTabs');
  const flavorBarEl = document.getElementById('iceFlavorBar');
  const clearTrayBtn = document.getElementById('iceClearConeBtn');

  const walkLeftBtn = document.getElementById('iceWalkLeftBtn');
  const walkRightBtn = document.getElementById('iceWalkRightBtn');
  const walkUpBtn = document.getElementById('iceWalkUpBtn');
  const walkDownBtn = document.getElementById('iceWalkDownBtn');
  const actionBtn = document.getElementById('iceActionBtn');

  const toEditorBtn = document.getElementById('iceToEditorBtn');
  const toHomeBtn = document.getElementById('iceToHomeBtn');

  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;
  let activeStationTab = 'all';
  let servedCount = parseInt(localStorage.getItem('runner_ice_served') || '0', 10) || 0;
  let shiftCoins = 0;
  let streak = 0;

  // Player moves freely BOTH behind the counter (y ~ 172) and around the counter to the 4 tables (y ~ 260..450)!
  const player = {
    x: 360,
    y: AISLE_Y,
    facing: 1,
    waypoints: [],
    pendingAction: null, // { type: 'pickup', itemId } | { type: 'pickup_station', stationId } | { type: 'serve', tableIdx } | { type: 'sit', tableIdx } | { type: 'trash' }
    pendingCallback: null,
    sittingTableIdx: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  let trayItems = []; // up to 3 items carried on tray
  const tables = [null, null, null, null];
  const tableTimers = [0, 240, 420, 620];
  let quietPauseTimer = 0;
  let guestsSinceBreak = 0;
  const fxParticles = [];
  const petFollowers = new PetFollowerController();

  function getCafeTalkTargets() {
    const guests = [];
    tables.forEach((c, idx) => {
      if (!c) return;
      guests.push({
        id: `guest_${idx}_${c.preset.name}`,
        type: 'person',
        kind: 'guest',
        tableIdx: idx,
        name: `${c.preset.name} (Tisch ${idx + 1})`,
        rawName: c.preset.name,
        icon: '🍨',
        role: `Café-Gast an Tisch ${idx + 1}`
      });
    });

    const companionIds = HomeManager.getCompanionPets();
    const sitPets = HomeManager.getSittingCompanions();
    const petTargets = [];
    if (companionIds.length + sitPets.length > 0) {
      petTargets.push({ id: 'all', type: 'pet', name: 'Alle Tiere', icon: '🐾' });
      companionIds.forEach((id) => {
        const meta = getPetMeta(id);
        petTargets.push({ id, type: 'pet', name: meta.name, icon: meta.icon });
      });
      sitPets.forEach((sit) => {
        const meta = getPetMeta(sit);
        petTargets.push({ id: sit.id, type: 'pet', name: meta.name, icon: meta.icon });
      });
    }
    return [...guests, ...petTargets];
  }

  const talkPanel = mountTalkPanel({
    mountEl: document.getElementById('iceTalkMount'),
    getTargets: getCafeTalkTargets,
    onFocusTarget: (target) => {
      if (target.type === 'person' && typeof target.tableIdx === 'number') {
        const tb = TABLE_POS[target.tableIdx];
        if (tb) {
          navigateToPoint(tb.standX, tb.standY, null, () => {
            player.facing = tb.guestX >= player.x ? 1 : -1;
          });
        }
      }
    },
    onTalkPerson: (target, phrase) => {
      const idx = target.tableIdx;
      const c = tables[idx];
      const tb = TABLE_POS[idx];
      if (!c || !tb) {
        talkPanel.refresh('💬 Dieser Gast ist gerade gegangen – lade gern einen neuen Gast ein!');
        return;
      }
      const runChat = () => {
        player.facing = tb.guestX >= player.x ? 1 : -1;
        player.speechText = phrase;
        player.speechTimer = 135;
        player.pose = 'pet';
        player.poseTimer = 20;
        const res = generatePersonReply({ id: target.rawName, name: target.rawName, kind: 'guest' }, phrase, { scene: 'icecream' });
        c.chatText = res.bubble;
        c.chatTimer = 185;
        talkPanel.refresh(`🍨 ${target.rawName}: „${res.reply}“`);
        setStatus(`💬 ${target.rawName}: „${res.reply}“`);
      };
      if (player.y < 205 || Math.hypot(player.x - tb.guestX, player.y - tb.y) > 140) {
        navigateToPoint(tb.standX, tb.standY, null, runChat);
      } else {
        runChat();
      }
    },
    onCommandPet: (target, payload) => {
      const firstPet = petFollowers.followers[0];
      const meta = getPetMeta(target.id === 'all' ? (firstPet?.petRef || 'dog') : (firstPet?.petRef || target.id));
      const parsed = payload.commandId
        ? {
            command: payload.commandId,
            speech: payload.commandId === 'praise' ? `❤️ ${meta.say}` : `${payload.text} 🐾`,
            reply: `${target.name} führt „${payload.text}“ sofort aus!`
          }
        : parsePetCommand(payload.text, meta);

      player.speechText = `${target.id === 'all' ? 'Alle' : target.name}: ${payload.text}`;
      player.speechTimer = 115;
      player.pose = 'pet';
      player.poseTimer = 22;

      petFollowers.issueCommand(target.id, parsed.command, parsed.speech, { x: player.x, y: player.y });
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
    }, 3000);
  }

  function setStatus(msg) {
    if (statusTextEl) statusTextEl.textContent = msg;
  }

  function spawnFX(kind, x, y, count = 9) {
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

  function createGuestOrder() {
    // Rich mix of ice cream, waffles, dishes, and drinks!
    const ices = CAFE_MENU.filter((m) => m.station === 'ice');
    const waffles = CAFE_MENU.filter((m) => m.station === 'waffle');
    const foods = CAFE_MENU.filter((m) => m.station === 'food');
    const drinks = CAFE_MENU.filter((m) => m.station === 'drink');

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)].id;
    const roll = Math.random();

    if (roll < 0.24) {
      // Eis + Waffel combo
      return [pick(ices), pick(waffles)];
    }
    if (roll < 0.50) {
      // Essen + Trinken combo
      return [pick(foods), pick(drinks)];
    }
    if (roll < 0.72) {
      // Waffel + Trinken combo
      return [pick(waffles), pick(drinks)];
    }
    if (roll < 0.88) {
      // Full Café Feast: Essen + Waffel/Eis + Trinken
      return [pick(foods), Math.random() < 0.5 ? pick(waffles) : pick(ices), pick(drinks)];
    }
    // Ice cream duo or single snack + drink
    return [pick(ices), pick(drinks)];
  }

  function createCustomer(tableIdx) {
    const preset = CUSTOMER_PRESETS[Math.floor(Math.random() * CUSTOMER_PRESETS.length)];
    const order = createGuestOrder();
    return {
      tableIdx,
      preset,
      order,
      patience: 100,
      state: 'entering', // 'entering' | 'waiting' | 'eating_leaving'
      yOffset: 55,
      happyTimer: 0,
      servedItems: null,
      chatText: '',
      chatTimer: 0
    };
  }

  function initShift() {
    trayItems = [];
    shiftCoins = 0;
    streak = 0;
    quietPauseTimer = 0;
    guestsSinceBreak = 0;
    player.x = 360;
    player.y = AISLE_Y;
    player.waypoints = [];
    player.pendingAction = null;
    player.pendingCallback = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    player.speechText = '';
    player.speechTimer = 0;
    petFollowers.reset(player.x, player.y + 4);

    // Start calmly with 1 guest instead of a packed restaurant; more arrive gradually!
    for (let i = 0; i < 4; i++) {
      tables[i] = i === 0 ? createCustomer(0) : null;
      if (tables[i]) {
        tables[i].state = 'waiting';
        tables[i].yOffset = 0;
      }
      tableTimers[i] = i === 0 ? 0 : 220 + i * 170;
    }

    updateHUD();
    renderStationTabs();
    renderMenuButtons();
    talkPanel.refresh();
    setStatus('Gemütlicher Start im Café! Redet mit den Gästen an den Tischen oder gebt euren Tieren Anweisungen!');
  }

  function updateHUD() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (servedValEl) servedValEl.textContent = servedCount;
    if (shiftEarningsEl) shiftEarningsEl.textContent = shiftCoins;

    if (traySlotsEl) {
      if (trayItems.length === 0) {
        traySlotsEl.innerHTML = '<span class="cone-empty-hint">Tablett leer – wähle Eis, Waffeln, Essen oder Trinken!</span>';
      } else {
        traySlotsEl.innerHTML = trayItems.map((id) => {
          const item = MENU_BY_ID[id];
          return `<span class="cone-scoop-chip" style="--scoop:${item.color};--scoop-light:${item.light};">${item.short}</span>`;
        }).join('');
      }
    }
  }

  function renderStationTabs() {
    if (!stationTabsEl) return;
    const tabs = [
      { id: 'all', label: '🍽️ Alles' },
      { id: 'ice', label: '🍦 Eis' },
      { id: 'waffle', label: '🧇 Waffeln' },
      { id: 'food', label: '🥘 Essen' },
      { id: 'drink', label: '🥤 Trinken' }
    ];
    stationTabsEl.innerHTML = '';
    tabs.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-tab-btn${activeStationTab === t.id ? ' active' : ''}`;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        activeStationTab = t.id;
        renderStationTabs();
        renderMenuButtons();
      });
      stationTabsEl.appendChild(btn);
    });
  }

  function renderMenuButtons() {
    if (!flavorBarEl) return;
    flavorBarEl.innerHTML = '';
    const list = activeStationTab === 'all'
      ? CAFE_MENU
      : CAFE_MENU.filter((m) => m.station === activeStationTab);

    list.forEach((item) => {
      const st = CAFE_STATIONS.find((s) => s.id === item.station);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ice-flavor-btn';
      btn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${item.light}, ${item.color});">${item.icon}</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">${item.name}</span>
          <span class="ice-item-price">+${item.price} 🪙</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        navigateToPoint(st.x, AISLE_Y, { type: 'pickup', itemId: item.id });
      });
      flavorBarEl.appendChild(btn);
    });
  }

  function insideIceObstacle(x, y) {
    if (x > COUNTER_LEFT - 18 && x < COUNTER_RIGHT + 18 && y > COUNTER_TOP_Y + 8 && y < COUNTER_BOTTOM_Y + 26) {
      return true;
    }
    for (let i = 0; i < TABLE_POS.length; i++) {
      const tb = TABLE_POS[i];
      if (x > tb.guestX - 24 && x < tb.x + 28 && y > tb.y - 26 && y < tb.y + 24) {
        return true;
      }
    }
    return false;
  }

  // Pathfinding around the counter (`COUNTER_LEFT..COUNTER_RIGHT`, `y: 178..224`) and dining tables
  function navigateToPoint(tx, ty, pendingAction = null, pendingCallback = null) {
    let clampedX = Math.max(46, Math.min(814, tx));
    let clampedY = Math.max(158, Math.min(445, ty));
    if (insideIceObstacle(clampedX, clampedY)) {
      if (clampedY >= 340) {
        clampedY = 348;
      } else {
        clampedY = COUNTER_BOTTOM_Y + 32;
      }
    }
    const behindY = AISLE_Y;
    const frontY = 262;
    const diningLaneY = 326;

    const startBehind = player.y < 205;
    const endBehind = clampedY < 205;
    const waypoints = [];

    if (startBehind && !endBehind) {
      const viaLeft = Math.abs(player.x - 54) + Math.abs(clampedX - 54);
      const viaRight = Math.abs(player.x - 804) + Math.abs(clampedX - 804);
      const sideX = viaLeft <= viaRight ? 54 : 804;
      waypoints.push({ x: sideX, y: behindY });
      waypoints.push({ x: sideX, y: frontY });
    } else if (!startBehind && endBehind) {
      const viaLeft = Math.abs(player.x - 54) + Math.abs(clampedX - 54);
      const viaRight = Math.abs(player.x - 804) + Math.abs(clampedX - 804);
      const sideX = viaLeft <= viaRight ? 54 : 804;
      waypoints.push({ x: sideX, y: frontY });
      waypoints.push({ x: sideX, y: behindY });
    }

    // If walking horizontally across the dining table row, step up into the dining lane first
    if (!startBehind && !endBehind && player.y >= 362 && clampedY >= 362 && Math.abs(clampedX - player.x) > 70) {
      waypoints.push({ x: player.x, y: diningLaneY });
      waypoints.push({ x: clampedX, y: diningLaneY });
    }

    waypoints.push({ x: clampedX, y: clampedY });
    player.waypoints = waypoints;
    player.pendingAction = pendingAction;
    player.pendingCallback = pendingCallback;
  }

  function addItemToTray(itemId) {
    const item = MENU_BY_ID[itemId];
    if (!item) return;
    if (trayItems.length >= 3) {
      showToast('🍽️ Auf dein Tablett passen maximal 3 Sachen! Bring es an einen Tisch oder leere es.', 'warn');
      return;
    }
    trayItems.push(item.id);
    player.pose = 'cook';
    player.poseTimer = 22;
    spawnFX('sparkle', player.x + player.facing * 18, player.y - 46, 6);
    updateHUD();

    const readyTable = tables.findIndex((c) => c && c.state === 'waiting' && ordersMatch(trayItems, c.order));
    if (readyTable !== -1) {
      setStatus(`✨ Fertig für Tisch ${readyTable + 1}! Lauf um die Theke zu Tisch ${readyTable + 1} (oder klicke auf den Tisch)!`);
    } else {
      setStatus(`🍽️ ${item.name} auf dem Tablett (${trayItems.length}/3). Hol das nächste Teil oder geh an einen Tisch!`);
    }
  }

  function smartPickupAtStation(stationId) {
    const stationItems = CAFE_MENU.filter((m) => m.station === stationId);
    // Prefer an item currently requested by a waiting customer (and not yet on our tray)
    for (const tb of tables) {
      if (!tb || tb.state !== 'waiting') continue;
      for (const reqId of tb.order) {
        const found = stationItems.find((m) => m.id === reqId);
        if (found) {
          const neededCount = tb.order.filter((id) => id === reqId).length;
          const haveCount = trayItems.filter((id) => id === reqId).length;
          if (haveCount < neededCount) {
            addItemToTray(found.id);
            return;
          }
        }
      }
    }
    // Fallback: pick first item of that station
    addItemToTray(stationItems[0].id);
  }

  function serveTable(tableIdx) {
    const customer = tables[tableIdx];
    if (!customer || customer.state !== 'waiting') {
      showToast('An diesem Tisch wartet gerade kein Gast!', 'info');
      return;
    }
    if (trayItems.length === 0) {
      showToast('🍽️ Dein Tablett ist leer! Hol zuerst Eis, Waffeln, Essen oder Trinken hinter der Theke.', 'warn');
      return;
    }

    if (!ordersMatch(trayItems, customer.order)) {
      const wantedNames = customer.order.map((id) => MENU_BY_ID[id].short).join(' + ');
      showToast(`❌ Tisch ${tableIdx + 1} (${customer.preset.name}) möchte: ${wantedNames}!`, 'warn');
      return;
    }

    // Success!
    const itemsSum = customer.order.reduce((acc, id) => acc + (MENU_BY_ID[id]?.price || 8), 0);
    const tipBonus = customer.patience >= 55 ? 7 : customer.patience >= 25 ? 3 : 0;
    streak += 1;
    const streakBonus = streak >= 3 ? 5 : 0;
    const totalEarned = itemsSum + tipBonus + streakBonus;

    customer.state = 'eating_leaving';
    customer.happyTimer = 95;
    customer.servedItems = [...trayItems];
    trayItems = [];
    player.pose = 'pet';
    player.poseTimer = 28;

    servedCount += 1;
    localStorage.setItem('runner_ice_served', String(servedCount));
    shiftCoins += totalEarned;

    ShopManager.addCoins(totalEarned);
    ShopManager.recordProgress(0, totalEarned);
    EarnMoneyManager.recordEvent({ icecream: 1, care: 1 });
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    spawnFX('heart', TABLE_POS[tableIdx].x, TABLE_POS[tableIdx].y - 50, 9);
    spawnFX('coin', TABLE_POS[tableIdx].x, TABLE_POS[tableIdx].y - 70, 7);
    updateHUD();

    const tipText = tipBonus > 0 ? ` (inkl. +${tipBonus} 🪙 Trinkgeld!)` : '';
    showToast(`🍽️ Tisch ${tableIdx + 1} bedient! +${totalEarned} 🪙 verdient${tipText}`, 'success');
    setStatus('Super serviert! Geh wieder hinter die Theke und bereite die nächste Bestellung vor.');
  }

  function clearTray() {
    if (trayItems.length === 0) return;
    trayItems = [];
    player.pose = 'idle';
    updateHUD();
    setStatus('🗑️ Tablett geleert – wähle neue Speisen & Getränke!');
  }

  function inviteNextCustomerNow() {
    const emptyIdx = tables.findIndex((t) => !t);
    if (emptyIdx === -1) {
      showToast('Alle 4 Tische sind gerade besetzt!', 'info');
      return;
    }
    quietPauseTimer = 0;
    tables[emptyIdx] = createCustomer(emptyIdx);
    tableTimers[emptyIdx] = 0;
    talkPanel.refresh();
    setStatus(`🔔 Ein neuer Gast setzt sich an Tisch ${emptyIdx + 1}!`);
  }

  function handleCanvasClick(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    // 0. Tap on a companion pet walking with you!
    const petTap = petFollowers.handleTap(cx, cy);
    if (petTap.hit) {
      player.pose = 'pet';
      player.poseTimer = 20;
      talkPanel.selectTarget(petTap.petId, `🐾 ${petTap.meta.name} wedelt fröhlich – gib gern eine Anweisung!`);
      setStatus(`❤️ ${petTap.meta.name} wedelt fröhlich neben dir!`);
      showToast(`❤️ ${petTap.meta.name} gestreichelt!`, 'success');
      return;
    }

    // 1. Clicked on one of the 4 back stations (or directly on a large food item!)
    if (cy >= 38 && cy <= 165) {
      for (const st of CAFE_STATIONS) {
        if (Math.abs(cx - st.x) <= 84) {
          activeStationTab = st.id;
          renderStationTabs();
          renderMenuButtons();
          if (cy >= 66) {
            const slots = getStationItemSlots(st);
            let picked = null;
            let bestDist = 28;
            for (const slot of slots) {
              const d = Math.abs(cx - slot.x);
              if (d < bestDist) {
                bestDist = d;
                picked = slot.item;
              }
            }
            if (picked) {
              navigateToPoint(st.x, AISLE_Y, { type: 'pickup', itemId: picked.id });
              return;
            }
          }
          navigateToPoint(st.x, AISLE_Y, { type: 'pickup_station', stationId: st.id });
          return;
        }
      }
      if (Math.abs(cx - TRASH_X) <= 38) {
        navigateToPoint(TRASH_X - 24, AISLE_Y, { type: 'trash' });
        return;
      }
    }

    // 2. Clicked on a table, guest, or empty chair in the dining room?
    if (cy >= 235) {
      for (let i = 0; i < TABLE_POS.length; i++) {
        const tb = TABLE_POS[i];
        const c = tables[i];
        if (!c) {
          if (trayItems.length === 0 && Math.abs(cx - tb.x) <= 72 && cy >= 340 && cy <= 448) {
            player.sittingTableIdx = null;
            navigateToPoint(tb.standX, tb.standY, { type: 'sit', tableIdx: i });
            return;
          }
          continue;
        }
        // Clicking directly on the seated guest with an empty tray walks up & starts a friendly chat!
        if (trayItems.length === 0 && Math.hypot(cx - tb.guestX, cy - (tb.y - 34)) <= 36) {
          player.sittingTableIdx = null;
          const guestTargetId = `guest_${i}_${c.preset.name}`;
          navigateToPoint(tb.standX, tb.standY, null, () => {
            player.facing = tb.guestX >= player.x ? 1 : -1;
            player.speechText = `Hallo ${c.preset.name}! 😊`;
            player.speechTimer = 120;
            const res = generatePersonReply({ id: c.preset.name, name: c.preset.name, kind: 'guest' }, 'Hallo!', { scene: 'icecream' });
            c.chatText = res.bubble;
            c.chatTimer = 180;
            talkPanel.selectTarget(guestTargetId, `🍨 ${c.preset.name}: „${res.reply}“`);
            setStatus(`💬 ${c.preset.name}: „${res.reply}“`);
          });
          return;
        }
        if (Math.abs(cx - tb.x) <= 84 && cy >= 242 && cy <= 455) {
          if (c.state === 'waiting') {
            player.sittingTableIdx = null;
            navigateToPoint(tb.standX, tb.standY, { type: 'serve', tableIdx: i });
            return;
          }
        }
      }
    }

    // 3. Otherwise stand up (if sitting) and walk to clicked floor point (routing around counter if needed)
    player.sittingTableIdx = null;
    const targetY = cy < 200 ? AISLE_Y : Math.max(255, Math.min(442, cy));
    navigateToPoint(cx, targetY, null);
  }

  function triggerNearbyAction() {
    const nearTable = getNearbyTableIdx(player.x, player.y);
    if (nearTable !== -1 && tables[nearTable] && tables[nearTable].state === 'waiting') {
      serveTable(nearTable);
      return;
    }
    const nearStation = getNearbyStation(player.x, player.y);
    if (nearStation) {
      smartPickupAtStation(nearStation.id);
      return;
    }
    if (player.y < 205 && Math.abs(player.x - TRASH_X) < 55) {
      clearTray();
    }
  }

  if (canvas) {
    canvas.addEventListener('click', (e) => handleCanvasClick(e.clientX, e.clientY));
  }
  if (clearTrayBtn) {
    clearTrayBtn.addEventListener('click', clearTray);
  }
  const inviteGuestBtn = document.getElementById('iceInviteGuestBtn');
  if (inviteGuestBtn) {
    inviteGuestBtn.addEventListener('click', inviteNextCustomerNow);
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
    if (stateManager.getState() !== 'ICECREAM') return;
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

  if (toEditorBtn) toEditorBtn.addEventListener('click', () => stateManager.setState('EDITOR'));
  if (toHomeBtn) toHomeBtn.addEventListener('click', () => stateManager.setState('HOME'));
  const toTownBtn = document.getElementById('iceToTownBtn');
  if (toTownBtn) toTownBtn.addEventListener('click', () => stateManager.setState('TOWN', { from: 'ICECREAM' }));

  function movePlayerWithCounterCollision(dx, dy) {
    const nextX = Math.max(40, Math.min(820, player.x + dx));
    const nextY = Math.max(158, Math.min(448, player.y + dy));

    if (!insideIceObstacle(nextX, player.y)) player.x = nextX;
    if (!insideIceObstacle(player.x, nextY)) player.y = nextY;
  }

  function updateSimulation() {
    if (player.speechTimer > 0) player.speechTimer--;
    let moveX = 0;
    let moveY = 0;
    if (keys.left || holdPad.left) moveX -= 1;
    if (keys.right || holdPad.right) moveX += 1;
    if (keys.up || holdPad.up) moveY -= 1;
    if (keys.down || holdPad.down) moveY += 1;

    const speed = 4.6;
    if (moveX !== 0 || moveY !== 0) {
      if (player.sittingTableIdx !== null) {
        const prevTb = TABLE_POS[player.sittingTableIdx];
        player.sittingTableIdx = null;
        if (prevTb) {
          player.x = prevTb.standX;
          player.y = prevTb.standY;
        }
      }
      const len = Math.hypot(moveX, moveY) || 1;
      movePlayerWithCounterCollision((moveX / len) * speed, (moveY / len) * speed);
      if (moveX !== 0) player.facing = Math.sign(moveX);
      player.pose = 'walk';
    } else if (player.waypoints.length > 0) {
      player.sittingTableIdx = null;
      const wp = player.waypoints[0];
      const dx = wp.x - player.x;
      const dy = wp.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        if (!insideIceObstacle(wp.x, wp.y)) {
          player.x = wp.x;
          player.y = wp.y;
        }
        player.waypoints.shift();
        if (player.waypoints.length === 0) {
          if (player.pendingAction) {
            const act = player.pendingAction;
            player.pendingAction = null;
            if (act.type === 'pickup') addItemToTray(act.itemId);
            else if (act.type === 'pickup_station') smartPickupAtStation(act.stationId);
            else if (act.type === 'serve') serveTable(act.tableIdx);
            else if (act.type === 'sit') {
              const tb = TABLE_POS[act.tableIdx];
              if (tb && !tables[act.tableIdx]) {
                player.sittingTableIdx = act.tableIdx;
                player.x = tb.guestX + 6;
                player.y = tb.y + 8;
                player.facing = 1;
                player.pose = 'sit';
                setStatus(`🪑 Kurze Pause an Tisch ${act.tableIdx + 1}! Zum Aufstehen einfach gehen oder irgendwo hinklicken.`);
              }
            }
            else if (act.type === 'trash') clearTray();
          }
          if (player.pendingCallback) {
            const cb = player.pendingCallback;
            player.pendingCallback = null;
            cb();
          }
        }
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        movePlayerWithCounterCollision((dx / dist) * speed, (dy / dist) * speed);
        player.pose = 'walk';
      }
    } else if (player.sittingTableIdx !== null) {
      const tb = TABLE_POS[player.sittingTableIdx];
      if (!tb || tables[player.sittingTableIdx]) {
        player.sittingTableIdx = null;
        if (tb) {
          player.x = tb.standX;
          player.y = tb.standY;
        }
        player.pose = 'idle';
      } else {
        player.x = tb.guestX + 6;
        player.y = tb.y + 8;
        player.facing = 1;
        player.pose = 'sit';
      }
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
      if (player.poseTimer <= 0) player.pose = 'idle';
    } else {
      player.pose = 'idle';
    }

    // Update customers at the 4 tables (with realistic quiet pauses so customers aren't always there!)
    if (quietPauseTimer > 0) quietPauseTimer--;
    const activeCount = tables.filter(Boolean).length;
    const maxSimultaneous = quietPauseTimer > 0 ? 0 : 2;
    let talkListDirty = false;

    for (let i = 0; i < 4; i++) {
      const c = tables[i];
      if (!c) {
        if (quietPauseTimer <= 0 && activeCount < maxSimultaneous && player.sittingTableIdx !== i) {
          tableTimers[i]--;
          if (tableTimers[i] <= 0) {
            tables[i] = createCustomer(i);
            guestsSinceBreak += 1;
            talkListDirty = true;
          }
        }
        continue;
      }

      if (c.chatTimer > 0) c.chatTimer--;

      if (c.state === 'entering') {
        c.yOffset = Math.max(0, c.yOffset - 2.4);
        if (c.yOffset <= 0) c.state = 'waiting';
      } else if (c.state === 'waiting') {
        c.patience = Math.max(5, c.patience - 0.02);
      } else if (c.state === 'eating_leaving') {
        c.happyTimer--;
        if (c.happyTimer < 26) c.yOffset += 2.6;
        if (c.happyTimer <= 0) {
          tables[i] = null;
          tableTimers[i] = 240 + Math.floor(Math.random() * 260);
          talkListDirty = true;
          if (guestsSinceBreak >= 3 && tables.filter(Boolean).length === 0) {
            quietPauseTimer = 260 + Math.floor(Math.random() * 180);
            guestsSinceBreak = 0;
            setStatus('☕ Ruhige Pause im Café – gerade keine Kunden da. Du kannst dein Tier streicheln oder "🔔 Gast rufen" tippen!');
          }
        }
      }
    }
    if (talkListDirty) talkPanel.refresh();

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) fxParticles.splice(i, 1);
    }
  }

  function drawMenuItemGraphic(x, y, itemId, scale = 1) {
    const item = MENU_BY_ID[itemId];
    if (!item) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (item.kind === 'ice') {
      // Waffle cone + glossy scoop
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(-7, -1);
      ctx.lineTo(7, -1);
      ctx.lineTo(0, 15);
      ctx.closePath();
      ctx.fill();

      const g = ctx.createRadialGradient(-2, -9, 1, 0, -7, 9);
      g.addColorStop(0, item.light);
      g.addColorStop(0.6, item.color);
      g.addColorStop(1, item.dark);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, -7, 8.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === 'waffle') {
      // Golden Belgian / Heart Waffle on pastel plate
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 5, 13, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect(-10, -5, 20, 11, [4]);
      ctx.fill();

      ctx.strokeStyle = item.dark;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(-6, 5);
      ctx.moveTo(0, -4);
      ctx.lineTo(0, 5);
      ctx.moveTo(6, -4);
      ctx.lineTo(6, 5);
      ctx.stroke();

      // Cream/Berry dollop
      ctx.fillStyle = item.topping || '#fffbeb';
      ctx.beginPath();
      ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === 'pan' || item.kind === 'pasta') {
      // Plate/Skillet dish
      ctx.fillStyle = item.kind === 'pan' ? '#334155' : '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 3, 13, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      if (item.kind === 'pan') {
        ctx.fillRect(10, 1, 8, 3);
      }
      ctx.fillStyle = item.light;
      ctx.beginPath();
      ctx.ellipse(0, 1, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(-3, 0, 3, 0, Math.PI * 2);
      ctx.arc(3, 1, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === 'pizza') {
      // Pizza slice
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(0, 11);
      ctx.lineTo(-10, -8);
      ctx.lineTo(10, -8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(-10, -10, 20, 4, [2]);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(-2, -2, 2.3, 0, Math.PI * 2);
      ctx.arc(3, 1, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === 'drink' || item.kind === 'shake') {
      // Tall glass with straw
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2, -7);
      ctx.lineTo(6, -14);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.roundRect(-7, -7, 14, 19, [3, 3, 5, 5]);
      ctx.fill();

      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect(-5.5, -3, 11, 13.5, [2, 2, 4, 4]);
      ctx.fill();

      if (item.kind === 'shake') {
        ctx.fillStyle = '#fff1f2';
        ctx.beginPath();
        ctx.arc(0, -7, 6.5, Math.PI, 0);
        ctx.fill();
      }
    } else if (item.kind === 'mug') {
      // Warm cocoa cup
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(7, 2, 4, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-8, -5, 15, 15, [2, 2, 6, 6]);
      ctx.fill();
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.ellipse(-0.5, -4, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawCustomerAtTable(c, tb) {
    const bob = c.state === 'waiting' ? Math.sin(animFrame * 0.08 + c.tableIdx) * 1.4 : 0;
    const gx = tb.guestX;
    const gy = tb.y + 8 + c.yOffset + bob;

    ctx.save();
    ctx.translate(gx, gy);

    // Bistro chair back behind guest
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.roundRect(-17, -42, 34, 24, [8]);
    ctx.fill();

    // Torso
    const shirtGrad = ctx.createLinearGradient(-13, -52, 13, -15);
    shirtGrad.addColorStop(0, c.preset.shirt);
    shirtGrad.addColorStop(1, '#3b0764');
    ctx.fillStyle = shirtGrad;
    ctx.beginPath();
    ctx.roundRect(-14, -52, 28, 36, [10]);
    ctx.fill();

    // Head
    const headGrad = ctx.createRadialGradient(-3, -68, 2, 0, -66, 17);
    headGrad.addColorStop(0, '#fff4ed');
    headGrad.addColorStop(0.55, c.preset.skin);
    headGrad.addColorStop(1, '#d99b72');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -66, 13.5, 15.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & smile
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-4.5, -67, 2.1, 0, Math.PI * 2);
    ctx.arc(4.8, -67, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5, -67.7, 0.8, 0, Math.PI * 2);
    ctx.arc(4.3, -67.7, 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0.3, -61, c.state === 'eating_leaving' ? 4.8 : 3.2, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Hair
    ctx.fillStyle = c.preset.hair;
    if (c.preset.hairStyle === 'bob') {
      ctx.beginPath();
      ctx.arc(0, -72, 15, Math.PI * 0.92, Math.PI * 2.08);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-15, -72, 5, 19, [3]);
      ctx.roundRect(10, -72, 5, 19, [3]);
      ctx.fill();
    } else if (c.preset.hairStyle === 'ponytail') {
      ctx.beginPath();
      ctx.arc(-14, -71, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -72, 14.5, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
    } else if (c.preset.hairStyle === 'curly') {
      for (let k = -10; k <= 10; k += 5) {
        ctx.beginPath();
        ctx.arc(k, -79 + Math.abs(k) * 0.2, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, -72, 14, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawEmptyBistroChair(tb) {
    ctx.save();
    ctx.translate(tb.guestX, tb.y + 8);
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.roundRect(-16, -42, 32, 22, [8]);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.roundRect(-14, -18, 28, 7, [4]);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, -11, 4, 14);
    ctx.fillRect(6, -11, 4, 14);
    ctx.restore();
  }

  function drawTable(tb, idx, c) {
    ctx.save();
    ctx.translate(tb.x, tb.y);

    // Table pedestal shadow
    ctx.fillStyle = 'rgba(88, 28, 135, 0.16)';
    ctx.beginPath();
    ctx.ellipse(0, 26, 36, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pedestal leg
    ctx.fillStyle = '#475569';
    ctx.fillRect(-4, -8, 8, 32);
    ctx.beginPath();
    ctx.ellipse(0, 24, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bistro round tabletop with cream-coral cloth
    const isMatch = c && c.state === 'waiting' && ordersMatch(trayItems, c.order);
    ctx.fillStyle = isMatch ? '#d1fae5' : '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -10, 38, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isMatch ? '#10b981' : '#f472b6';
    ctx.lineWidth = isMatch ? 3 : 2;
    ctx.stroke();

    // Table number badge
    ctx.fillStyle = isMatch ? '#059669' : '#be185d';
    ctx.beginPath();
    ctx.roundRect(-24, 14, 48, 17, [8]);
    ctx.fill();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Tisch ${idx + 1}`, 0, 22.5);

    // Delivered dishes sitting directly on the table!
    if (c && c.servedItems) {
      c.servedItems.forEach((id, sIdx) => {
        const ox = (sIdx - (c.servedItems.length - 1) / 2) * 24;
        drawMenuItemGraphic(ox, -16, id, 0.94);
      });
    }

    ctx.restore();
  }

  function drawSpeechBubble(c, tb) {
    if (c.state !== 'waiting') return;
    const isMatch = ordersMatch(trayItems, c.order);
    const bw = 178;
    const bh = 92;
    const bx = Math.max(10, Math.min(860 - bw - 10, tb.x - bw / 2));
    const by = 228;

    ctx.save();
    ctx.shadowColor = isMatch ? 'rgba(16, 185, 129, 0.42)' : 'rgba(88, 28, 135, 0.16)';
    ctx.shadowBlur = isMatch ? 18 : 12;
    ctx.fillStyle = isMatch ? '#ecfdf5' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [18]);
    ctx.fill();

    // Bubble pointer tail down toward guest
    ctx.beginPath();
    ctx.moveTo(tb.guestX - 6, by + bh - 2);
    ctx.lineTo(tb.guestX, by + bh + 12);
    ctx.lineTo(tb.guestX + 8, by + bh - 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = isMatch ? '#10b981' : 'rgba(236, 72, 153, 0.34)';
    ctx.lineWidth = isMatch ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [18]);
    ctx.stroke();

    // Draw each requested item icon + short name inside speech bubble
    c.order.forEach((id, idx) => {
      const item = MENU_BY_ID[id];
      const ry = by + 21 + idx * 23;
      drawMenuItemGraphic(bx + 25, ry, id, 0.92);
      ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#271333';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.short, bx + 48, ry + 1);
    });

    // Patience / Tip bar at bottom
    const barW = bw - 20;
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 11, barW, 5, [3]);
    ctx.fill();
    ctx.fillStyle = c.patience >= 55 ? '#10b981' : c.patience >= 25 ? '#f59e0b' : '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(bx + 10, by + bh - 11, Math.max(4, (barW * c.patience) / 100), 5, [3]);
    ctx.fill();

    if (isMatch) {
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(bx + bw / 2 - 48, by - 12, 96, 20, [10]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ AN DEN TISCH!', bx + bw / 2, by - 2);
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

    // 1. Back Wall & Awning
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 185);
    wallGrad.addColorStop(0, '#fff1f2');
    wallGrad.addColorStop(0.6, '#fdf4ff');
    wallGrad.addColorStop(1, '#ecfeff');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, 185);

    ctx.fillStyle = 'rgba(251, 207, 232, 0.22)';
    for (let sx = 0; sx < w; sx += 44) {
      ctx.fillRect(sx, 34, 22, 146);
    }

    const stripeW = 46;
    for (let i = 0; i * stripeW < w + stripeW; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#f43f8e' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(i * stripeW, 0, stripeW, 32, [0, 0, 14, 14]);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 140, 5, 280, 26, [13]);
    ctx.fill();
    ctx.font = '800 13px "Outfit", sans-serif';
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TRAUM-CAFÉ & EISDIELE', w / 2, 18);

    // 2. Back Stations behind the counter (y: 44..138) with extra-large tappable items!
    const nearSt = getNearbyStation(player.x, player.y);
    CAFE_STATIONS.forEach((st) => {
      const isNear = nearSt && nearSt.id === st.id;
      ctx.save();
      if (isNear) {
        ctx.shadowColor = st.color;
        ctx.shadowBlur = 16;
      }
      ctx.fillStyle = st.light;
      ctx.beginPath();
      ctx.roundRect(st.x - 83, 56, 166, 80, [16]);
      ctx.fill();
      ctx.strokeStyle = isNear ? st.color : 'rgba(148, 163, 184, 0.38)';
      ctx.lineWidth = isNear ? 2.6 : 1.5;
      ctx.stroke();

      // Station header pill
      ctx.fillStyle = isNear ? st.color : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(st.x - 66, 42, 132, 24, [11]);
      ctx.fill();
      ctx.font = '800 11.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isNear ? '#ffffff' : '#271333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.label, st.x, 54);

      // Large clickable food/drink showcase inside box
      const slots = getStationItemSlots(st);
      const itemScale = slots.length >= 4 ? 1.28 : 1.48;
      slots.forEach(({ item, x: ix, y: iy }) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
        ctx.beginPath();
        ctx.arc(ix, iy, slots.length >= 4 ? 17 : 22, 0, Math.PI * 2);
        ctx.fill();
        drawMenuItemGraphic(ix, iy, item.id, itemScale);
      });
      ctx.restore();
    });

    // Trash / Clear Tray Bin
    ctx.save();
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(TRASH_X - 22, 86, 44, 48, [10]);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEU', TRASH_X, 112);
    ctx.restore();

    // Kitchen aisle floor + Dining room floor
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 138, w, 72);

    const guestFloor = ctx.createLinearGradient(0, 210, 0, h);
    guestFloor.addColorStop(0, '#fff5f7');
    guestFloor.addColorStop(1, '#f3e8ff');
    ctx.fillStyle = guestFloor;
    ctx.fillRect(0, 210, w, h - 210);

    ctx.fillStyle = 'rgba(236, 72, 153, 0.06)';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 11; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillRect(col * 82, 212 + row * 44, 82, 44);
        }
      }
    }

    // Helper to draw player (depth-sorted against counter & tables!)
    const drawPlayerWithTray = () => {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.scale(0.82, 0.82);
      renderCharacter(ctx, 0, 0, PlayerConfig, {
        frame: animFrame,
        pose: player.pose,
        facing: player.facing
      });
      ctx.restore();

      if (trayItems.length > 0) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(player.x + player.facing * 26 - 34, player.y - 54, 68, 12, [6]);
        ctx.fill();
        ctx.stroke();

        trayItems.forEach((id, idx) => {
          const ox = (idx - (trayItems.length - 1) / 2) * 22;
          drawMenuItemGraphic(player.x + player.facing * 26 + ox, player.y - 63, id, 0.94);
        });
        ctx.restore();
      }
    };

    const drawCounter = () => {
      const cw = COUNTER_RIGHT - COUNTER_LEFT;
      const topGrad = ctx.createLinearGradient(0, COUNTER_TOP_Y, 0, COUNTER_TOP_Y + 18);
      topGrad.addColorStop(0, '#ffffff');
      topGrad.addColorStop(1, '#fce7f3');
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.roundRect(COUNTER_LEFT, COUNTER_TOP_Y, cw, 16, [8]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const frontGrad = ctx.createLinearGradient(0, COUNTER_TOP_Y + 16, 0, COUNTER_BOTTOM_Y);
      frontGrad.addColorStop(0, '#f472b6');
      frontGrad.addColorStop(1, '#db2777');
      ctx.fillStyle = frontGrad;
      ctx.beginPath();
      ctx.roundRect(COUNTER_LEFT + 6, COUNTER_TOP_Y + 15, cw - 12, 32, [0, 0, 12, 12]);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      for (let sx = COUNTER_LEFT + 22; sx < COUNTER_RIGHT - 24; sx += 36) {
        ctx.fillRect(sx, COUNTER_TOP_Y + 16, 14, 30);
      }

      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('BESTELL- & AUSGABETHEKE', w / 2, COUNTER_TOP_Y + 32);
    };

    // Update Companion Pets
    petFollowers.update(player.x, player.y + 4, player.facing, {
      minX: 36,
      maxX: w - 36,
      minY: 152,
      maxY: 446
    });

    // Depth sort: if player is behind counter (y < 210), draw player & pets BEFORE counter; otherwise draw counter first!
    if (player.y < 210) {
      petFollowers.draw(ctx, animFrame, {
        scale: 0.88,
        showLeashes: true,
        anchorX: player.x,
        anchorY: player.y + 4,
        facing: player.facing
      });
      drawPlayerWithTray();
      drawCounter();
    } else {
      drawCounter();
    }

    // 3. Draw 4 Tables + Chairs + Customers (with proper layering if player is sitting at an empty table)
    TABLE_POS.forEach((tb, idx) => {
      const c = tables[idx];
      if (c) {
        drawCustomerAtTable(c, tb);
      } else {
        drawEmptyBistroChair(tb);
        if (player.sittingTableIdx === idx) {
          drawPlayerWithTray();
        }
      }
      drawTable(tb, idx, c);
    });

    // 4. Order bubbles & friendly chat speech bubbles above tables
    TABLE_POS.forEach((tb, idx) => {
      const c = tables[idx];
      if (!c) return;
      drawSpeechBubble(c, tb);
      if (c.chatTimer > 0 && c.chatText) {
        const bubbleY = c.state === 'waiting' ? 196 : tb.y - 102;
        drawCanvasSpeechBubble(ctx, tb.guestX + 14, bubbleY, c.chatText, {
          borderColor: '#0ea5e9',
          textColor: '#0f172a',
          maxWidth: 185,
          canvasWidth: w
        });
      }
    });

    // Peaceful empty café sign when no guests are currently seated
    if (tables.every((t) => !t)) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 175, 238, 350, 34, [17]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#9d174d';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☕ Kurze Pause – gerade keine Gäste im Café!', w / 2, 255);
      ctx.restore();
    }

    // If player walked out in front of the counter (and isn't already layered into a table chair), draw pets & player on top!
    if (player.y >= 210) {
      petFollowers.draw(ctx, animFrame, {
        scale: 0.88,
        showLeashes: true,
        anchorX: player.x,
        anchorY: player.y + 4,
        facing: player.facing
      });
      if (player.sittingTableIdx === null) {
        drawPlayerWithTray();
      }
    }

    if (player.speechTimer > 0 && player.speechText) {
      drawCanvasSpeechBubble(ctx, player.x, Math.max(46, player.y - 122), player.speechText, {
        borderColor: '#0ea5e9',
        textColor: '#0369a1',
        maxWidth: 185,
        canvasWidth: w
      });
    }

    // 5. Sparkling FX particles
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
      startLoop();
    } else {
      stopLoop();
    }
  });
}
