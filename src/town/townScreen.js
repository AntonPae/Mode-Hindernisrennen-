import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';
import { PetFollowerController, getPetMeta } from '../home/petCompanion.js';
import {
  NEW_ACQUAINTANCES,
  SocialManager,
  askPersonAI,
  parsePetCommand
} from '../social/socialData.js';
import { drawCanvasSpeechBubble } from '../social/canvasSpeech.js';
import { mountTalkPanel } from '../social/talkPanel.js';

const WORLD_WIDTH = 3420;
const GARDEN_LEFT_X = 280;
const GARDEN_RIGHT_X = 560;
const LEFT_GATE_X = 280;
const RIGHT_GATE_X = 560;
const STREET_START_X = 1170;

const SIDEWALK_MIN_Y = 256;
const SIDEWALK_MAX_Y = 286;
const LOWER_WALK_MIN_Y = 400;
const LOWER_WALK_MAX_Y = 434;
const GARDEN_PATH_MIN_Y = 286;
const GARDEN_PATH_MAX_Y = 376;
const CROSSWALK_XS = [1350, 1665, 1980, 2295, 2610, 2925];
const CROSSWALK_HALF_W = 26;
const RESIDENTIAL_NEIGHBORS = [
  {
    id: 'weber',
    name: 'Herr Weber',
    icon: '🐕',
    role: 'Nachbar & Hundefreund',
    x: 660,
    y: 238,
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
    id: 'frieda',
    name: 'Oma Frieda',
    icon: '🏡',
    role: 'Nachbarin & Bäckerin',
    x: 845,
    y: 238,
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
    id: 'kaya',
    name: 'Frau Kaya',
    icon: '🐱',
    role: 'Tierliebhaberin & Gärtnerin',
    x: 1030,
    y: 238,
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
    pendingCallback: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  const npcSpeeches = new Map();
  const petFollowers = new PetFollowerController();

  const townPeople = [
    ...RESIDENTIAL_NEIGHBORS.map((n) => ({
      ...n,
      type: 'person',
      kind: 'neighbor',
      isNewPerson: false
    })),
    ...NEW_ACQUAINTANCES.map((a) => ({
      ...a,
      x: a.townX,
      y: a.townY,
      type: 'person',
      kind: 'acquaintance',
      isNewPerson: true
    }))
  ];

  const setNpcSpeech = (id, text, duration = 150) => {
    npcSpeeches.set(id, { text, timer: duration });
  };

  const getTownTalkTargets = () => {
    // Sort people by proximity to player so nearby people appear first!
    const sortedPeople = [...townPeople].sort(
      (a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y)
    );
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
    return [...sortedPeople, ...petTargets];
  };

  const talkPanel = mountTalkPanel({
    mountEl: document.getElementById('townTalkMount'),
    getTargets: getTownTalkTargets,
    onFocusTarget: (target) => {
      if (target.type === 'person') {
        const standX = target.x + (player.x < target.x ? -44 : 44);
        const standY = target.y >= LOWER_WALK_MIN_Y ? target.y : 268;
        navigateInTown(standX, standY, null, () => {
          player.facing = target.x >= player.x ? 1 : -1;
        });
      }
    },
    onTalkPerson: async (target, phrase) => {
      const standX = target.x + (player.x < target.x ? -44 : 44);
      const standY = target.y >= LOWER_WALK_MIN_Y ? target.y : 268;
      player.facing = target.x >= player.x ? 1 : -1;
      player.speechText = phrase;
      player.speechTimer = 135;
      player.pose = 'pet';
      player.poseTimer = 20;
      setNpcSpeech(target.id, '💭 …', 90);
      if (Math.hypot(player.x - target.x, player.y - target.y) > 130) {
        navigateInTown(standX, standY, null, () => {
          player.facing = target.x >= player.x ? 1 : -1;
        });
      }
      const res = await askPersonAI(target, phrase, { scene: 'town' });
      if (!res.ok) {
        const errMsg = `⚠️ ${target.name} konnte gerade nicht antworten (${res.error})`;
        setNpcSpeech(target.id, '⚠️ …', 90);
        talkPanel.refresh(errMsg);
        if (statusEl) statusEl.textContent = errMsg;
        return;
      }
      setNpcSpeech(target.id, res.bubble, 200);
      talkPanel.refresh(`${target.icon} ${target.name}: „${res.reply}“`);
      if (res.movedIn) {
        if (statusEl) {
          statusEl.textContent = `🏡 Hurra! ${target.name} wohnt jetzt mit dir zusammen! Klick auf „🏡 Ins Haus“!`;
        }
      } else if (statusEl) {
        statusEl.textContent = `💬 ${target.name}: „${res.reply}“`;
      }
    },
    onMoveInRequest: async (target) => {
      const standX = target.x + (player.x < target.x ? -44 : 44);
      const standY = target.y >= LOWER_WALK_MIN_Y ? target.y : 268;
      player.facing = target.x >= player.x ? 1 : -1;
      player.speechText = 'Wollen wir zusammenziehen? 🏡';
      player.speechTimer = 140;
      player.pose = 'pet';
      player.poseTimer = 24;
      setNpcSpeech(target.id, '💭 …', 90);
      talkPanel.setStatusLine(`💭 ${target.name} überlegt...`);
      if (Math.hypot(player.x - target.x, player.y - target.y) > 130) {
        navigateInTown(standX, standY, null, () => {
          player.facing = target.x >= player.x ? 1 : -1;
        });
      }
      const res = await askPersonAI(target, 'Wollen wir zusammenziehen?', { scene: 'town' });
      if (!res.ok) {
        const errMsg = `⚠️ ${target.name} konnte gerade nicht antworten (${res.error})`;
        talkPanel.refresh(errMsg);
        if (statusEl) statusEl.textContent = errMsg;
        return;
      }
      setNpcSpeech(target.id, res.bubble, 210);
      talkPanel.refresh(`${target.icon} ${target.name}: „${res.reply}“`);
      if (statusEl) {
        statusEl.textContent = res.movedIn
          ? `🏡 Hurra! ${target.name} ist bei dir eingezogen! Geh ins Haus („🏡 Ins Haus“), um zusammen zu wohnen!`
          : `💬 ${target.name}: „${res.reply}“`;
      }
    },
    onMoveOutRequest: (target) => {
      SocialManager.moveOutRoommate();
      setNpcSpeech(target.id, 'Bis bald in der Stadt! 👋', 150);
      talkPanel.refresh(`👋 ${target.name} ist ausgezogen – ihr bleibt natürlich gute Freunde!`);
      if (statusEl) statusEl.textContent = `👋 ${target.name} wohnt jetzt wieder in der Traumstadt – ihr bleibt Freunde!`;
    },
    onGoHome: () => stateManager.setState('HOME', { room: 'living_room' }),
    onCommandPet: (target, payload) => {
      const firstPet = petFollowers.followers[0];
      const meta = getPetMeta(target.id === 'all' ? (firstPet?.petRef || 'dog') : (firstPet?.petRef || target.id));
      const parsed = payload.commandId
        ? {
            command: payload.commandId,
            speech: payload.commandId === 'praise'
              ? `❤️ ${meta.say}`
              : `${payload.text} 🐾`,
            reply: `${target.name} führt „${payload.text}“ sofort aus!`
          }
        : parsePetCommand(payload.text, meta);

      player.speechText = `${target.id === 'all' ? 'Alle' : target.name}: ${payload.text}`;
      player.speechTimer = 115;
      player.pose = 'pet';
      player.poseTimer = 22;

      petFollowers.issueCommand(target.id, parsed.command, parsed.speech, { x: player.x, y: player.y });
      talkPanel.refresh(`🐾 ${parsed.reply}`);
      if (statusEl) statusEl.textContent = parsed.reply;
    }
  });

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

  function getNearestCrosswalkX(x) {
    let best = CROSSWALK_XS[0];
    let bestD = Infinity;
    for (const cx of CROSSWALK_XS) {
      const d = Math.abs(x - cx);
      if (d < bestD) {
        bestD = d;
        best = cx;
      }
    }
    return best;
  }

  function isPointOnCrosswalk(x) {
    return CROSSWALK_XS.some((cx) => Math.abs(x - cx) <= CROSSWALK_HALF_W);
  }

  function snapToTownPath(tx, ty) {
    let x = Math.max(48, Math.min(WORLD_WIDTH - 48, tx));
    let y = Math.max(SIDEWALK_MIN_Y, Math.min(LOWER_WALK_MAX_Y, ty));

    if (x > GARDEN_LEFT_X + 8 && x < GARDEN_RIGHT_X - 8) {
      // Garden area: allow upper sidewalk OR garden stone path
      if (ty <= SIDEWALK_MAX_Y + 6) {
        y = Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, ty));
      } else {
        y = Math.max(GARDEN_PATH_MIN_Y, Math.min(GARDEN_PATH_MAX_Y, ty));
        // Avoid stepping inside garden flowerbed (x: 318..402, y: 328..366) or apple tree (x: 454..494, y: 300..366)
        if (x >= 316 && x <= 404 && y >= 326 && y <= 368) {
          y = 314;
        }
        if (HomeManager.hasItem('garden', 'apple_tree') && x >= 452 && x <= 496 && y >= 300 && y <= 368) {
          y = 296;
        }
      }
      return { x, y };
    }

    if (x >= STREET_START_X) {
      // Shopping street: upper sidewalk, crosswalks, or lower promenade
      if (y > SIDEWALK_MAX_Y && y < LOWER_WALK_MIN_Y) {
        if (isPointOnCrosswalk(x)) {
          return { x, y };
        }
        // Snap onto upper sidewalk or lower promenade depending on which is closer
        y = y < 342 ? SIDEWALK_MAX_Y - 10 : LOWER_WALK_MIN_Y + 12;
      } else if (y >= LOWER_WALK_MIN_Y) {
        y = Math.max(LOWER_WALK_MIN_Y, Math.min(LOWER_WALK_MAX_Y, y));
      } else {
        y = Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, y));
      }
      return { x, y };
    }

    // Residential sidewalk outside garden: strictly keep on the sidewalk
    y = Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, y));
    return { x, y };
  }

  function navigateInTown(tx, ty, pendingPlace = null, pendingCallback = null) {
    const dest = snapToTownPath(tx, ty);
    const clampedX = dest.x;
    const clampedY = dest.y;
    const startInGarden = player.x > GARDEN_LEFT_X + 6 && player.x < GARDEN_RIGHT_X - 6 && player.y > SIDEWALK_MAX_Y;
    const endInGarden = clampedX > GARDEN_LEFT_X + 6 && clampedX < GARDEN_RIGHT_X - 6 && clampedY > SIDEWALK_MAX_Y;
    const waypoints = [];

    const gateY = 304;
    // Handle lower promenade <-> upper sidewalk via nearest Zebrastreifen!
    const startOnLower = player.x >= STREET_START_X && player.y >= LOWER_WALK_MIN_Y - 4;
    const endOnLower = clampedX >= STREET_START_X && clampedY >= LOWER_WALK_MIN_Y - 4;
    const startOnCross = player.x >= STREET_START_X && player.y > SIDEWALK_MAX_Y && player.y < LOWER_WALK_MIN_Y;

    if (startOnLower && !endOnLower) {
      const cwX = getNearestCrosswalkX(player.x);
      waypoints.push({ x: cwX, y: LOWER_WALK_MIN_Y + 10 });
      waypoints.push({ x: cwX, y: 270 });
    } else if (!startOnLower && endOnLower) {
      if (startInGarden) {
        const gateX = RIGHT_GATE_X;
        waypoints.push({ x: gateX - 24, y: gateY });
        waypoints.push({ x: gateX + 28, y: 270 });
      }
      const cwX = getNearestCrosswalkX(clampedX);
      waypoints.push({ x: cwX, y: 270 });
      waypoints.push({ x: cwX, y: LOWER_WALK_MIN_Y + 10 });
    } else if (startOnCross) {
      const cwX = getNearestCrosswalkX(player.x);
      waypoints.push({ x: cwX, y: clampedY >= 342 ? LOWER_WALK_MIN_Y + 10 : 270 });
    } else if (!startInGarden && endInGarden) {
      const gateX = player.x <= LEFT_GATE_X + 120 ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -24 : 24), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 28 : -28), y: gateY });
    } else if (startInGarden && !endInGarden) {
      const gateX = clampedX <= LEFT_GATE_X ? LEFT_GATE_X : RIGHT_GATE_X;
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? 26 : -26), y: gateY });
      waypoints.push({ x: gateX + (gateX === LEFT_GATE_X ? -28 : 28), y: 270 });
    } else if (player.x <= LEFT_GATE_X && clampedX >= RIGHT_GATE_X) {
      waypoints.push({ x: clampedX, y: Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, clampedY)) });
    } else if (player.x >= RIGHT_GATE_X && clampedX <= LEFT_GATE_X) {
      waypoints.push({ x: clampedX, y: Math.max(SIDEWALK_MIN_Y, Math.min(SIDEWALK_MAX_Y, clampedY)) });
    }

    waypoints.push({ x: clampedX, y: clampedY });
    player.waypoints = waypoints;
    player.pendingPlace = pendingPlace;
    player.pendingCallback = pendingCallback;
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
        player.pose = 'pet';
        player.poseTimer = 22;
        talkPanel.selectTarget(petTap.petId, `🐾 ${petTap.meta.name} ausgewählt – gib eine Anweisung oder streichle es!`);
        if (statusEl) statusEl.textContent = `❤️ ${petTap.meta.name} wedelt fröhlich neben dir auf dem Weg!`;
        return;
      }

      // Click on any Neighbor or New Meetable Person on the street!
      for (const person of townPeople) {
        if (Math.abs(worldX - person.x) <= 44 && worldY >= person.y - 98 && worldY <= person.y + 30) {
          const standX = person.x + (player.x < person.x ? -44 : 44);
          const standY = person.y >= LOWER_WALK_MIN_Y ? person.y : 268;
          const greetText = person.isNewPerson && SocialManager.getAcquaintanceProgress(person.id).stage === 0
            ? 'Hallo! Wollen wir uns kennenlernen?'
            : `Hallo ${person.name}!`;
          player.facing = person.x >= player.x ? 1 : -1;
          player.speechText = greetText;
          player.speechTimer = 125;
          setNpcSpeech(person.id, '💭 …', 90);
          talkPanel.selectTarget(person.id, `💭 ${person.name} überlegt...`);
          if (Math.hypot(player.x - person.x, player.y - person.y) > 110) {
            navigateInTown(standX, standY, null, () => {
              player.facing = person.x >= player.x ? 1 : -1;
            });
          }
          askPersonAI(person, greetText, { scene: 'town' }).then((res) => {
            if (!res.ok) {
              talkPanel.selectTarget(person.id, `⚠️ ${person.name} konnte nicht antworten (${res.error})`);
              if (statusEl) statusEl.textContent = `⚠️ ${person.name}: ${res.error}`;
              return;
            }
            setNpcSpeech(person.id, res.bubble, 190);
            talkPanel.selectTarget(person.id, `${person.icon} ${person.name}: „${res.reply}“`);
            if (statusEl) statusEl.textContent = `💬 ${person.name}: „${res.reply}“`;
          });
          return;
        }
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

  function isTownWalkable(x, y) {
    if (x < 42 || x > WORLD_WIDTH - 42) return false;
    // Upper sidewalk everywhere along residential & shopping street
    if (y >= SIDEWALK_MIN_Y && y <= SIDEWALK_MAX_Y) {
      return true;
    }
    // Inside fenced garden stone path (between fences 280..560)
    if (x > GARDEN_LEFT_X + 2 && x < GARDEN_RIGHT_X - 2 && y >= GARDEN_PATH_MIN_Y && y <= GARDEN_PATH_MAX_Y) {
      // Avoid flowerbed & apple tree trunk
      if (x >= 318 && x <= 402 && y >= 328 && y <= 366) return false;
      if (HomeManager.hasItem('garden', 'apple_tree') && x >= 454 && x <= 494 && y >= 302 && y <= 364) return false;
      return true;
    }
    // Outside garden on left residential side: allow stepping smoothly into gate entrance y: 286..330 near gates
    if ((Math.abs(x - LEFT_GATE_X) < 34 || Math.abs(x - RIGHT_GATE_X) < 34) && y >= SIDEWALK_MIN_Y && y <= 332) {
      return true;
    }
    // Shopping street lower promenade & crosswalks ONLY
    if (x >= STREET_START_X) {
      if (y >= LOWER_WALK_MIN_Y && y <= LOWER_WALK_MAX_Y) return true;
      if (y > SIDEWALK_MAX_Y && y < LOWER_WALK_MIN_Y && isPointOnCrosswalk(x)) return true;
    }
    return false;
  }

  function hitsTownPerson(x, y) {
    return townPeople.some((n) => Math.hypot(x - n.x, y - n.y) < 34);
  }

  function moveWithGardenFence(dx, dy) {
    const rawNextX = Math.max(42, Math.min(WORLD_WIDTH - 42, player.x + dx));
    const rawNextY = Math.max(SIDEWALK_MIN_Y, Math.min(LOWER_WALK_MAX_Y, player.y + dy));

    const atGatePassage = (y) => y >= 286 && y <= 336;
    const isFenceBlocked = (oldX, newX, y) => {
      if (y <= SIDEWALK_MAX_Y) return false;
      if ((oldX <= LEFT_GATE_X && newX > LEFT_GATE_X) || (oldX >= LEFT_GATE_X && newX < LEFT_GATE_X)) {
        if (!atGatePassage(y)) return true;
      }
      if ((oldX <= RIGHT_GATE_X && newX > RIGHT_GATE_X) || (oldX >= RIGHT_GATE_X && newX < RIGHT_GATE_X)) {
        if (!atGatePassage(y)) return true;
      }
      return false;
    };

    if (!isFenceBlocked(player.x, rawNextX, player.y) && isTownWalkable(rawNextX, player.y) && !hitsTownPerson(rawNextX, player.y)) {
      player.x = rawNextX;
    }
    if (isTownWalkable(player.x, rawNextY) && !hitsTownPerson(player.x, rawNextY)) {
      player.y = rawNextY;
    }
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
      player.poseTimer = 0;
    } else if (player.waypoints.length > 0) {
      const wp = player.waypoints[0];
      const dx = wp.x - player.x;
      const dy = wp.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        player.x = wp.x;
        player.y = wp.y;
        player.waypoints.shift();
        if (player.waypoints.length === 0) {
          if (player.pendingPlace) {
            const dest = player.pendingPlace;
            player.pendingPlace = null;
            enterPlace(dest);
          } else if (player.pendingCallback) {
            const cb = player.pendingCallback;
            player.pendingCallback = null;
            cb();
          }
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

    if (player.speechTimer > 0) player.speechTimer--;
    npcSpeeches.forEach((sp, id) => {
      sp.timer--;
      if (sp.timer <= 0) npcSpeeches.delete(id);
    });

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

    // Warm Streetlamps & Green Flower Planters neatly beside store edges (clear of walking sidewalk!)
    for (let lx = STREET_START_X + 35; lx < WORLD_WIDTH - 40; lx += 155) {
      // Planter box along building curb (y: 222..238)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(lx - 18, 224, 36, 14, [5]);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(lx, 220, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(lx - 5, 217, 4, 0, Math.PI * 2);
      ctx.arc(lx + 5, 219, 4, 0, Math.PI * 2);
      ctx.fill();

      // Streetlamp pole & warm lantern
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lx + 42, 128, 5, 114);
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

    // Residential Promenade Sidewalk leading into the Shopping Street + Door Stepping Paths
    const walkGrad = ctx.createLinearGradient(0, 232, 0, 290);
    walkGrad.addColorStop(0, '#fef3c7');
    walkGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = walkGrad;
    ctx.fillRect(0, 238, STREET_START_X, 50);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.16)';
    ctx.fillRect(0, 238, STREET_START_X, 4);
    ctx.fillRect(0, 284, STREET_START_X, 4);
    [155, 700, 885, 1070].forEach((hx) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(hx - 22, 222, 44, 20);
    });

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

    // --- ZONE 2: EINGEZÄUNTER GARTEN MIT GARTENTOR & STEINWEG ---
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(GARDEN_LEFT_X, 272, GARDEN_RIGHT_X - GARDEN_LEFT_X, 148, [12]);
    ctx.fill();

    // Stone walkway path inside garden connecting Left & Right Gartentor
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(GARDEN_LEFT_X + 4, 288, GARDEN_RIGHT_X - GARDEN_LEFT_X - 8, 36, [8]);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(GARDEN_LEFT_X + 18, 320, 32, 58, [8]);
    ctx.roundRect(GARDEN_RIGHT_X - 50, 320, 32, 58, [8]);
    ctx.roundRect(GARDEN_LEFT_X + 18, 358, GARDEN_RIGHT_X - GARDEN_LEFT_X - 36, 22, [8]);
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

    RESIDENTIAL_NEIGHBORS.forEach((n, i) => {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(0.84, 0.84);
      renderCharacter(ctx, 0, 0, n.charConfig, {
        frame: animFrame + i * 19,
        pose: npcSpeeches.has(n.id) ? 'pet' : 'idle',
        facing: player.x >= n.x ? 1 : -1
      });
      ctx.restore();

      // Subtle name pill at feet
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(n.x - 42, n.y + 8, 84, 17, [8]);
      ctx.fill();
      ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${n.icon} ${n.name}`, n.x, n.y + 16.5);
      ctx.restore();
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

    // New People to Meet along the Shopping Street & Promenade!
    const currentRoommateId = SocialManager.getRoommate()?.id;
    const roommateLifeNow = currentRoommateId ? SocialManager.getRoommateLife() : null;
    NEW_ACQUAINTANCES.forEach((p, idx) => {
      const prog = SocialManager.getAcquaintanceProgress(p.id);
      const isRoommate = p.id === currentRoommateId;
      const isRmWorking = isRoommate && roommateLifeNow?.activity === 'working';
      ctx.save();
      ctx.translate(p.townX, p.townY);
      ctx.scale(0.84, 0.84);
      renderCharacter(ctx, 0, 0, p.charConfig, {
        frame: animFrame + idx * 23,
        pose: npcSpeeches.has(p.id) ? 'pet' : 'idle',
        facing: player.x >= p.townX ? 1 : -1
      });
      ctx.restore();

      const badge = isRmWorking
        ? `💼 ${p.name} arbeitet!`
        : isRoommate
          ? `🏡 ${p.name} (Wohnt bei dir)`
          : prog.stage === 0
            ? `🆕 ${p.name} kennenlernen!`
            : prog.stage >= 3
              ? `💛 ${p.name}`
              : `${p.icon} ${p.name}`;
      ctx.save();
      ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
      const bw = ctx.measureText(badge).width + 14;
      ctx.fillStyle = isRoommate ? '#dcfce7' : (prog.stage === 0 ? '#fffbeb' : '#ffffff');
      ctx.strokeStyle = isRoommate ? '#10b981' : (prog.stage === 0 ? '#f59e0b' : '#ec4899');
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(p.townX - bw / 2, p.townY + 8, bw, 18, [9]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isRoommate ? '#166534' : (prog.stage === 0 ? '#92400e' : '#831843');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge, p.townX, p.townY + 17);
      ctx.restore();
    });

    // Companion Pets following player along the walkable paths!
    const petMinY = player.y >= LOWER_WALK_MIN_Y ? LOWER_WALK_MIN_Y : SIDEWALK_MIN_Y;
    const petMaxY = player.y >= LOWER_WALK_MIN_Y
      ? LOWER_WALK_MAX_Y
      : (player.x > GARDEN_LEFT_X && player.x < GARDEN_RIGHT_X && player.y > SIDEWALK_MAX_Y)
        ? GARDEN_PATH_MAX_Y
        : (isPointOnCrosswalk(player.x) && player.y > SIDEWALK_MAX_Y ? LOWER_WALK_MAX_Y : SIDEWALK_MAX_Y);
    petFollowers.update(player.x, player.y + 4, player.facing, {
      minX: 44,
      maxX: WORLD_WIDTH - 44,
      minY: petMinY,
      maxY: petMaxY
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

    // Comic speech bubbles for NPCs & Player!
    townPeople.forEach((p) => {
      const sp = npcSpeeches.get(p.id);
      if (sp && sp.timer > 0) {
        drawCanvasSpeechBubble(ctx, p.x, p.y - 102, sp.text, {
          accent: p.isNewPerson ? '#f59e0b' : '#0ea5e9',
          minX: 10,
          maxX: WORLD_WIDTH - 10
        });
      }
    });
    if (player.speechTimer > 0 && player.speechText) {
      drawCanvasSpeechBubble(ctx, player.x, player.y - 104, player.speechText, {
        accent: '#ec4899',
        minX: 10,
        maxX: WORLD_WIDTH - 10
      });
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

  window.addEventListener('runner:roommate-updated', () => {
    if (stateManager.getState() === 'TOWN') {
      talkPanel.refresh();
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
      player.pendingCallback = null;
      player.speechTimer = 0;
      petFollowers.reset(player.x, player.y + 4);
      MailboxManager.ensureDailyMail();
      updateCoinsUI();
      renderDistrictBar();
      talkPanel.refresh();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
