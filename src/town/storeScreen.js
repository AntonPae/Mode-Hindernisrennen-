import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { MYSTERY_BOX_PRICE, SHOP_CATALOG, ShopManager } from '../editor/shopData.js';
import { HOME_CATALOG, HOME_MYSTERY_BOX_PRICE, HomeManager } from '../home/homeData.js';
import { drawVectorPet, getPetMeta, PetFollowerController } from '../home/petCompanion.js';
import { MailboxManager } from '../mailbox/mailboxData.js';
import {
  askPersonAI,
  parsePetCommand
} from '../social/socialData.js';
import { drawCanvasSpeechBubble } from '../social/canvasSpeech.js';
import { mountTalkPanel } from '../social/talkPanel.js';

const STORE_CONFIG = {
  supermarket: {
    id: 'supermarket',
    title: '🛒 Stadt-Supermarkt',
    subtitle: 'Nimm frisches Essen aus den Regalen in deinen Einkaufskorb & bezahle an der Kasse!',
    floorA: '#f8fafc',
    floorB: '#e2e8f0',
    wallA: '#ecfdf5',
    wallB: '#d1fae5',
    accent: '#059669',
    cashierName: 'Kassiererin Mia',
    cashierConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_6', hairId: 'hair_3', hairColor: '#78350f' },
      clothes: {
        top: { style: 'tshirt', color: '#10b981', stickers: [] },
        pants: { style: 'jeans', color: '#1e293b' },
        shoes: { style: 'sneakers', color: '#ffffff' }
      }
    },
    freeSample: {
      x: 590,
      y: 235,
      icon: '🍓',
      label: 'Gratis-Kostprobe',
      rewardText: '🍓 Gratis Probier-Snack direkt in deinen Kühlschrank gelegt!'
    },
    aisles: [
      {
        id: 'snacks',
        label: '🍓 Obst & 🍵 Tee',
        x: 178,
        color: '#f43f5e',
        hint: 'Frisches Obst, Snacks für den Kühlschrank & wohltuender Kräutertee bei Erkältung!',
        sources: [
          { kind: 'home', category: 'supplies', tabLabel: '🍓 Obst & Snacks', filter: (i) => i.key === 'fridgeSnacks' },
          { kind: 'home', category: 'supplies', tabLabel: '🍵 Tee & Medizin', filter: (i) => i.key === 'medicine' }
        ]
      },
      {
        id: 'fridge',
        label: '🧊 Kühlregal & 🥤 Getränke',
        x: 325,
        color: '#0ea5e9',
        hint: 'Frische Koch-Zutaten, Käse-Boxen, Kakao, Saft & Wasser für deinen Kühlschrank!',
        sources: [
          { kind: 'home', category: 'supplies', tabLabel: '🥘 Koch-Zutaten', filter: (i) => i.key === 'food' },
          { kind: 'home', category: 'supplies', tabLabel: '🥤 Getränke', filter: (i) => i.key === 'drinks' }
        ]
      },
      {
        id: 'petfood',
        label: '🦴 Tierfutter-Regal',
        x: 472,
        color: '#f59e0b',
        hint: 'Leckeres Futter, Knochen & Tier-Medizin für deine Haustiere!',
        sources: [
          { kind: 'home', category: 'supplies', tabLabel: '🦴 Tierfutter', filter: (i) => i.key === 'petFood' },
          { kind: 'home', category: 'supplies', tabLabel: '💊 Tier-Medizin', filter: (i) => i.key === 'petMedicine' }
        ]
      }
    ]
  },
  salon: {
    id: 'salon',
    title: '💇 Friseurladen „Glanz & Schnitt“',
    subtitle: 'Probiere Frisuren vor dem Salon-Spiegel an, färbe deine Haare & bezahle an der Kasse!',
    floorA: '#faf5ff',
    floorB: '#f3e8ff',
    wallA: '#fdf4ff',
    wallB: '#e9d5ff',
    accent: '#9333ea',
    cashierName: 'Friseurin Bella',
    cashierConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_8', hairId: 'hair_3', hairColor: '#a855f7' },
      clothes: {
        top: { style: 'sparkle_top', color: '#9333ea', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#1e1b4b' },
        shoes: { style: 'glitter_boots', color: '#ec4899' }
      }
    },
    freeSample: {
      x: 608,
      y: 235,
      icon: '💆',
      label: 'Gratis Haar-Spa',
      rewardText: '💆 Frische Glanz-Kur im Friseurladen! Deine Haare strahlen & +8 🪙 Styling-Glück!'
    },
    aisles: [
      {
        id: 'hairstyles',
        label: '✂️ Frisuren-Stuhl',
        x: 185,
        color: '#9333ea',
        hint: 'Kurz, Lang, Irokese oder Afro — vor dem Salon-Spiegel anprobieren & in den Korb legen!',
        sources: [
          {
            kind: 'shop',
            category: 'hair',
            tabLabel: '✂️ Haarschnitte',
            filter: (i) => ['hair_1', 'hair_none', 'hair_3', 'hair_2', 'hair_afro'].includes(i.id)
          }
        ]
      },
      {
        id: 'hair_accessories',
        label: '👑 Haar-Schmuck',
        x: 345,
        color: '#ec4899',
        hint: 'Hasenohren, Katzenohren, Blumenkranz, Kronen & Zauberhut!',
        sources: [
          {
            kind: 'shop',
            category: 'hair',
            tabLabel: '👑 Reife & Hüte',
            filter: (i) => !['hair_1', 'hair_none', 'hair_3', 'hair_2', 'hair_afro'].includes(i.id)
          }
        ]
      },
      {
        id: 'haircolor',
        label: '🎨 Haarfarben-Bar',
        x: 500,
        color: '#0ea5e9',
        hint: 'Wähle eine strahlende Haarfarbe aus den Farbflaschen — kostenloses Styling im Friseursalon!',
        sources: [{ kind: 'salon_color', tabLabel: '🎨 Haarfarben' }]
      }
    ]
  },
  boutique: {
    id: 'boutique',
    title: '👗 Mode- & Style-Boutique',
    subtitle: 'Probiere neue Outfits am Spiegel an, leg sie in den Korb & bezahle an der Kasse!',
    floorA: '#fff5f7',
    floorB: '#fce7f3',
    wallA: '#fdf2f8',
    wallB: '#f5d0fe',
    accent: '#db2777',
    cashierName: 'Stylistin Nora',
    cashierConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_8', hairId: 'hair_flower', hairColor: '#db2777' },
      clothes: {
        top: { style: 'princess_coat', color: '#ec4899', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#312e81' },
        shoes: { style: 'glitter_boots', color: '#fbbf24' }
      }
    },
    mysteryStand: {
      x: 635,
      y: 235,
      price: MYSTERY_BOX_PRICE,
      label: '🎁 Style-Überraschung'
    },
    aisles: [
      {
        id: 'clothes',
        label: '👕 Kleiderständer',
        x: 172,
        color: '#ec4899',
        hint: 'Jacken, Hoodies, Capes & coole Hosen — tippe auf Anprobieren!',
        sources: [
          { kind: 'shop', category: 'top', tabLabel: '👕 Oberteile' },
          { kind: 'shop', category: 'pants', tabLabel: '👖 Hosen' }
        ]
      },
      {
        id: 'shoes',
        label: '👟 Schuh-Regal',
        x: 306,
        color: '#8b5cf6',
        hint: 'Sneakers, Skates, Flügel- & Raketen-Schuhe auf dem Podest!',
        sources: [{ kind: 'shop', category: 'shoes', tabLabel: '👟 Schuhe' }]
      },
      {
        id: 'beauty',
        label: '😀 Gesichter-Spiegel',
        x: 440,
        color: '#f43f5e',
        hint: 'Neue Gesichter, Sternen-Augen & coole Visiere vor dem Boutique-Spiegel! (Frisuren gibt es im 💇 Friseurladen!)',
        sources: [
          { kind: 'shop', category: 'face', tabLabel: '😀 Gesichter' }
        ]
      },
      {
        id: 'background',
        label: '⚡ Kräfte & 🗺️ Welten',
        x: 562,
        color: '#0ea5e9',
        hint: 'Spezial-Fähigkeiten & Reise-Tickets für neue Renn-Welten!',
        sources: [
          { kind: 'shop', category: 'background', tabLabel: '🗺️ Reise-Welten' },
          { kind: 'shop', category: 'ability', tabLabel: '⚡ Fähigkeiten' }
        ]
      }
    ]
  },
  furniture: {
    id: 'furniture',
    title: '🛋️ Möbel- & Bau-Kaufhaus',
    subtitle: 'Schau dir echte Möbel, Zimmer-Modelle & Garten-Sachen an und nimm sie mit zur Kasse!',
    floorA: '#fef3c7',
    floorB: '#fde68a',
    wallA: '#fffbeb',
    wallB: '#fef3c7',
    accent: '#d97706',
    cashierName: 'Baumeister Tom',
    cashierConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_2', hairId: 'hair_1', hairColor: '#92400e' },
      clothes: {
        top: { style: 'jacket', color: '#f59e0b', stickers: [] },
        pants: { style: 'cargo', color: '#334155' },
        shoes: { style: 'boots', color: '#78350f' }
      }
    },
    mysteryStand: {
      x: 635,
      y: 235,
      price: HOME_MYSTERY_BOX_PRICE,
      label: '🎁 Haus-Überraschung'
    },
    aisles: [
      {
        id: 'expansions',
        label: '🏗️ Bau-Tisch (Räume)',
        x: 172,
        color: '#d97706',
        hint: 'Küche, Tierzimmer, Obergeschoss, Wintergarten & Pool-Terrasse!',
        sources: [{ kind: 'home', category: 'expansions', tabLabel: '🏗️ Neue Räume' }]
      },
      {
        id: 'furniture',
        label: '🛋️ Möbel-Showroom',
        x: 306,
        color: '#ec4899',
        hint: 'Sofas, Betten, Smart-TV, Klavier, Gaming-Ecke & Heimkino!',
        sources: [{ kind: 'home', category: 'furniture', tabLabel: '🛋️ Möbel' }]
      },
      {
        id: 'decor',
        label: '🖼️ Deko & 🧹 Geräte',
        x: 440,
        color: '#8b5cf6',
        hint: 'Gemälde, Lichterketten, Bücherregal & Haushaltsgeräte!',
        sources: [
          { kind: 'home', category: 'decor', tabLabel: '🖼️ Deko' },
          { kind: 'home', category: 'supplies', tabLabel: '🧹 Geräte', filter: (i) => !i.isConsumable }
        ]
      },
      {
        id: 'garden',
        label: '🌳 Garten & 📬 Briefkasten',
        x: 562,
        color: '#10b981',
        hint: 'Briefkasten, Apfelbaum, Schaukel, Gewächshaus & Rutsche!',
        sources: [{ kind: 'home', category: 'garden', tabLabel: '🌳 Garten' }]
      }
    ]
  },
  petshop: {
    id: 'petshop',
    title: '🐾 Tierhandlung',
    subtitle: 'Besuche die süßen Tiere in ihren Gehegen, hol Tiersachen & geh zusammen zur Kasse!',
    floorA: '#f0fdf4',
    floorB: '#dcfce7',
    wallA: '#f0f9ff',
    wallB: '#ecfeff',
    accent: '#0284c7',
    cashierName: 'Tierpflegerin Lena',
    cashierConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_6', hairId: 'hair_cat', hairColor: '#451a03' },
      clothes: {
        top: { style: 'hoodie', color: '#0ea5e9', stickers: [{ type: 'heart', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'jeans', color: '#1e293b' },
        shoes: { style: 'sneakers', color: '#ffffff' }
      }
    },
    freeSample: {
      x: 595,
      y: 235,
      icon: '🦴',
      label: 'Gratis-Leckerli',
      rewardText: '🦴 +1 Gratis-Leckerli erhalten! Ab in deinen Futter-Vorrat!'
    },
    aisles: [
      {
        id: 'pets',
        label: '🐾 Tier-Gehege',
        x: 205,
        color: '#ec4899',
        hint: 'Alle niedlichen Tiere in ihren Gehegen — hol dir einen neuen Freund!',
        sources: [{ kind: 'home', category: 'pets', tabLabel: '🐾 Tiere' }]
      },
      {
        id: 'petItems',
        label: '🧸 Tiersachen-Regal',
        x: 365,
        color: '#0ea5e9',
        hint: 'Näpfe, Spielbälle, Kletterbäume, Laufrad & Hundehütte fürs Tierzimmer!',
        sources: [{ kind: 'home', category: 'petItems', tabLabel: '🧸 Tiersachen' }]
      },
      {
        id: 'petFood',
        label: '🦴 Futter & 💊 Medizin',
        x: 510,
        color: '#f59e0b',
        hint: 'Knuspriges Tierfutter, Leckerlis & Medizin für glückliche, gesunde Haustiere!',
        sources: [
          { kind: 'home', category: 'supplies', tabLabel: '🦴 Tierfutter', filter: (i) => i.key === 'petFood' },
          { kind: 'home', category: 'supplies', tabLabel: '💊 Tier-Medizin', filter: (i) => i.key === 'petMedicine' }
        ]
      }
    ]
  }
};

const STORE_SHOPPERS = [
  {
    id: 'shopper_paula',
    name: 'Paula',
    icon: '🛍️',
    role: 'Kundin im Laden',
    x: 250,
    y: 340,
    dir: 1,
    speed: 0.9,
    minX: 165,
    maxX: 540,
    speechText: '',
    speechTimer: 0,
    pauseTimer: 0,
    say: ['Die Angebote heute sind super!', 'Schau mal das Regal dort!'],
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_1', hairId: 'hair_3', hairColor: '#b45309' },
      clothes: {
        top: { style: 'oversize', color: '#a855f7', stickers: [] },
        pants: { style: 'jeans', color: '#334155' },
        shoes: { style: 'sneakers', color: '#fde047' }
      }
    }
  },
  {
    id: 'shopper_ben',
    name: 'Ben',
    icon: '🧺',
    role: 'Kunde im Laden',
    x: 490,
    y: 382,
    dir: -1,
    speed: 0.75,
    minX: 210,
    maxX: 620,
    speechText: '',
    speechTimer: 0,
    pauseTimer: 0,
    say: ['Ich lege gleich alles aufs Kassenband!', 'Hier riecht es richtig frisch!'],
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_4', hairId: 'hair_afro', hairColor: '#1e1b4b' },
      clothes: {
        top: { style: 'hoodie', color: '#0284c7', stickers: [] },
        pants: { style: 'sweatpants', color: '#1e293b' },
        shoes: { style: 'boots', color: '#d97706' }
      }
    }
  }
];

function getEquippedId(category) {
  switch (category) {
    case 'face': return PlayerConfig.body.faceId;
    case 'hair': return PlayerConfig.body.hairId;
    case 'top': return PlayerConfig.clothes.top.style;
    case 'pants': return PlayerConfig.clothes.pants.style;
    case 'shoes': return PlayerConfig.clothes.shoes.style;
    case 'ability': return PlayerConfig.ability;
    default: return null;
  }
}

function equipCharacterItem(category, id) {
  switch (category) {
    case 'face': PlayerConfig.body.faceId = id; break;
    case 'hair': PlayerConfig.body.hairId = id; break;
    case 'top': PlayerConfig.clothes.top.style = id; break;
    case 'pants': PlayerConfig.clothes.pants.style = id; break;
    case 'shoes': PlayerConfig.clothes.shoes.style = id; break;
    case 'ability': PlayerConfig.ability = id; break;
    default: break;
  }
}

export function setupStoreScreen(stateManager) {
  const canvas = document.getElementById('storeCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const titleEl = document.getElementById('storeTitleEl');
  const subtitleEl = document.getElementById('storeSubtitleEl');
  const coinsValEl = document.getElementById('storeCoinsVal');
  const levelValEl = document.getElementById('storeLevelVal');
  const basketCountEl = document.getElementById('storeBasketCountVal');
  const toastEl = document.getElementById('storeToast');
  const statusEl = document.getElementById('storeStatusText');

  const basketSlotsEl = document.getElementById('storeBasketSlots');
  const payBtn = document.getElementById('storePayBtn');
  const clearBasketBtn = document.getElementById('storeClearBasketBtn');

  const walkLeftBtn = document.getElementById('storeWalkLeftBtn');
  const walkRightBtn = document.getElementById('storeWalkRightBtn');
  const walkUpBtn = document.getElementById('storeWalkUpBtn');
  const walkDownBtn = document.getElementById('storeWalkDownBtn');
  const actionBtn = document.getElementById('storeActionBtn');

  const backStreetBtn = document.getElementById('storeBackStreetBtn');
  const toHomeBtn = document.getElementById('storeToHomeBtn');
  const toEditorBtn = document.getElementById('storeToEditorBtn');

  const shelfTitleEl = document.getElementById('storeShelfTitle');
  const shelfHintEl = document.getElementById('storeShelfHint');
  const aisleTabsEl = document.getElementById('storeAisleTabs');
  const shelfItemsEl = document.getElementById('storeShelfItems');

  let activeShopId = 'supermarket';
  let activeAisleId = null;
  let activeSourceIdx = 0;
  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;

  // Shopping Basket & In-Store Exciting Discoveries
  let basket = []; // { key, kind, category, item, price }
  let savedConfigBeforeTryOn = null;
  let tryingOnLabel = null;
  let visitSampleClaimed = false;
  let luckyCoupon = null;
  let scannerBeamTimer = 0;
  let receiptPopTimer = 0;
  let receiptText = '';
  let cashierBubble = '';
  let cashierBubbleTimer = 0;

  const player = {
    x: 110,
    y: 318,
    facing: 1,
    targetX: null,
    targetY: null,
    pendingAction: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  const petFollowers = new PetFollowerController();
  const fxParticles = [];
  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  const getStoreTalkTargets = () => {
    const store = getStore();
    const people = [
      {
        id: `cashier_${store.id}`,
        name: store.cashierName,
        icon: '💳',
        role: 'Im Geschäft an der Kasse',
        type: 'person',
        kind: 'cashier'
      },
      ...STORE_SHOPPERS.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
        role: s.role,
        type: 'person',
        kind: 'shopper'
      }))
    ];
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
    return [...people, ...petTargets];
  };

  const talkPanel = mountTalkPanel({
    mountEl: document.getElementById('storeTalkMount'),
    getTargets: getStoreTalkTargets,
    onTalkPerson: async (target, phrase) => {
      player.speechText = phrase;
      player.speechTimer = 135;
      player.pose = 'pet';
      player.poseTimer = 20;
      if (target.kind === 'cashier') {
        player.facing = 1;
        cashierBubble = '💭 …';
        cashierBubbleTimer = 90;
        if (player.x < 640) {
          navigateInStore(700, 292, () => { player.facing = 1; });
        }
      } else {
        const shopper = STORE_SHOPPERS.find((s) => s.id === target.id);
        if (shopper) {
          player.facing = shopper.x >= player.x ? 1 : -1;
          shopper.speechText = '💭 …';
          shopper.speechTimer = 90;
          shopper.pauseTimer = 160;
        }
      }
      const res = await askPersonAI(target, phrase, { scene: 'store', shopId: activeShopId });
      if (!res.ok) {
        const errMsg = `⚠️ ${target.name} konnte gerade nicht antworten (${res.error})`;
        talkPanel.refresh(errMsg);
        if (statusEl) statusEl.textContent = errMsg;
        return;
      }
      if (target.kind === 'cashier') {
        cashierBubble = res.bubble;
        cashierBubbleTimer = 175;
      } else {
        const shopper = STORE_SHOPPERS.find((s) => s.id === target.id);
        if (shopper) {
          shopper.speechText = res.bubble;
          shopper.speechTimer = 175;
          shopper.pauseTimer = 140;
        }
      }
      talkPanel.refresh(`${target.icon} ${target.name}: „${res.reply}“`);
      if (statusEl) statusEl.textContent = `💬 ${target.name}: „${res.reply}“`;
    },
    onCommandPet: (target, payload) => {
      const firstPet = petFollowers.followers[0];
      const meta = getPetMeta(target.id === 'all' ? (firstPet?.petRef || 'dog') : (firstPet?.petRef || target.id));
      const parsed = payload.commandId
        ? {
            command: payload.commandId,
            speech: payload.commandId === 'praise' ? `❤️ ${meta.say}` : `${payload.text} 🐾`,
            reply: `${target.name} führt „${payload.text}“ im Laden aus!`
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

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3200);
  }

  function spawnFX(color, x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      fxParticles.push({
        color,
        x: x + (Math.random() - 0.5) * 34,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2.4,
        vy: -1.3 - Math.random() * 1.8,
        life: 44
      });
    }
  }

  function snapshotTryOnConfig() {
    savedConfigBeforeTryOn = JSON.parse(JSON.stringify(PlayerConfig));
    tryingOnLabel = null;
  }

  function restoreTryOnConfig() {
    if (!savedConfigBeforeTryOn) return;
    PlayerConfig.body.faceId = savedConfigBeforeTryOn.body.faceId;
    PlayerConfig.body.hairId = savedConfigBeforeTryOn.body.hairId;
    PlayerConfig.body.hairColor = savedConfigBeforeTryOn.body.hairColor;
    PlayerConfig.clothes.top.style = savedConfigBeforeTryOn.clothes.top.style;
    PlayerConfig.clothes.pants.style = savedConfigBeforeTryOn.clothes.pants.style;
    PlayerConfig.clothes.shoes.style = savedConfigBeforeTryOn.clothes.shoes.style;
    PlayerConfig.ability = savedConfigBeforeTryOn.ability;
    ShopManager.savePlayerConfig(PlayerConfig);
    tryingOnLabel = null;
  }

  function leaveStoreToStreet() {
    restoreTryOnConfig();
    stateManager.setState('TOWN', { from: 'STORE', lastShopId: activeShopId });
  }

  function getStore() {
    return STORE_CONFIG[activeShopId] || STORE_CONFIG.supermarket;
  }

  function getActiveAisle() {
    const store = getStore();
    return store.aisles.find((a) => a.id === activeAisleId) || store.aisles[0];
  }

  function getBasketTotal() {
    return basket.reduce((sum, entry) => sum + entry.price, 0);
  }

  function isInBasket(kind, category, id, allowDuplicate) {
    if (allowDuplicate) return false;
    return basket.some((b) => b.kind === kind && b.category === category && b.item.id === id);
  }

  function updateHeaderStats() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (basketCountEl) basketCountEl.textContent = String(basket.length);
  }

  function renderBasketBar() {
    if (!basketSlotsEl) return;
    basketSlotsEl.innerHTML = '';
    const total = getBasketTotal();

    if (basket.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'store-basket-empty';
      empty.textContent = 'Dein Einkaufskorb ist leer — tippe rechts oder auf ein Regal!';
      basketSlotsEl.appendChild(empty);
    } else {
      basket.forEach((entry, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'store-basket-chip';
        chip.title = 'Tippen zum Herausnehmen';
        chip.textContent = `${entry.item.icon || '🛍️'} ${entry.item.name} (${entry.price} 🪙) ✕`;
        chip.addEventListener('click', () => {
          basket.splice(idx, 1);
          updateHeaderStats();
          renderBasketBar();
          renderShelfInspector();
        });
        basketSlotsEl.appendChild(chip);
      });
    }

    if (payBtn) {
      payBtn.disabled = basket.length === 0;
      payBtn.textContent = basket.length > 0
        ? `💳 An der Kasse bezahlen (${total} 🪙)`
        : '💳 Zur Kasse';
    }
    if (clearBasketBtn) {
      clearBasketBtn.disabled = basket.length === 0;
    }
  }

  function performCheckout() {
    if (basket.length === 0) {
      showToast('🛒 Dein Einkaufskorb ist noch leer! Nimm erst etwas aus den Regalen.', 'info');
      return;
    }
    const total = getBasketTotal();
    const coins = ShopManager.getCoins();
    if (coins < total) {
      showToast(`🔒 An der Kasse fehlen noch ${total - coins} 🪙! Nimm etwas raus oder sammle mehr Spielgeld.`, 'warn');
      return;
    }

    const boughtNames = [];
    const purchasedSnapshot = [...basket];
    let hasFridgeGoods = false;
    let hasPet = false;

    purchasedSnapshot.forEach((entry) => {
      if (entry.kind === 'shop') {
        const res = ShopManager.buyItem(entry.category, entry.item.id);
        if (res.ok) {
          boughtNames.push(`${entry.item.icon || ''} ${entry.item.name}`);
          if (entry.category !== 'background') {
            equipCharacterItem(entry.category, entry.item.id);
            if (savedConfigBeforeTryOn) {
              // Persist bought look into saved snapshot so leaving store won't undo purchased style!
              if (entry.category === 'face') savedConfigBeforeTryOn.body.faceId = entry.item.id;
              if (entry.category === 'hair') savedConfigBeforeTryOn.body.hairId = entry.item.id;
              if (entry.category === 'top') savedConfigBeforeTryOn.clothes.top.style = entry.item.id;
              if (entry.category === 'pants') savedConfigBeforeTryOn.clothes.pants.style = entry.item.id;
              if (entry.category === 'shoes') savedConfigBeforeTryOn.clothes.shoes.style = entry.item.id;
              if (entry.category === 'ability') savedConfigBeforeTryOn.ability = entry.item.id;
            }
          }
        }
      } else {
        const res = HomeManager.buyItem(entry.category, entry.item.id);
        if (res.ok) {
          boughtNames.push(`${entry.item.icon || ''} ${entry.item.name}`);
          if (entry.item.key === 'food' || entry.item.key === 'fridgeSnacks' || entry.item.key === 'drinks') hasFridgeGoods = true;
          if (entry.category === 'pets') hasPet = true;
          if (entry.item.id === 'mailbox' || entry.item.id === 'gold_mailbox') {
            MailboxManager.ensureDailyMail();
            window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
          }
        }
      }
    });

    ShopManager.savePlayerConfig(PlayerConfig);
    ShopManager.recordProgress(0, 1);

    // Loyalty Cashback Bonus if buying 2+ things together!
    let loyaltyBonus = 0;
    if (purchasedSnapshot.length >= 2) {
      loyaltyBonus = 5;
      ShopManager.addCoins(loyaltyBonus);
    }

    basket = [];
    tryingOnLabel = null;
    scannerBeamTimer = 46;
    receiptPopTimer = 110;
    receiptText = `BEEP! ${purchasedSnapshot.length}x bezahlt!`;
    cashierBubble = loyaltyBonus > 0 ? 'Danke! +5 🪙 Treue-Bonus!' : 'Vielen Dank & viel Freude!';
    cashierBubbleTimer = 120;

    spawnFX('#10b981', 745, 225, 14);
    spawnFX('#fbbf24', player.x, player.y - 40, 10);

    updateHeaderStats();
    renderBasketBar();
    renderShelfInspector();
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));

    let msg = `🧾 Kassenbon: ${boughtNames.join(', ')} bezahlt!`;
    if (hasFridgeGoods) msg += ' Alles direkt in deinen Kühlschrank geräumt!';
    if (hasPet) msg += ' Dein neues Haustier wartet im Tierzimmer (oder an der Leine)!';
    if (loyaltyBonus > 0) msg += ` (+${loyaltyBonus} 🪙 Einkaufs-Bonus!)`;
    showToast(msg, 'success');
    if (statusEl) statusEl.textContent = `💳 *BEEP!* Bezahlt: ${boughtNames.join(', ')} — danke für deinen Einkauf!`;
  }

  function buyMysteryAtPedestal() {
    const store = getStore();
    if (!store.mysteryStand) return;

    if (activeShopId === 'boutique') {
      const res = ShopManager.buyMysteryBox();
      if (res.ok) {
        if (res.category !== 'background') {
          equipCharacterItem(res.category, res.item.id);
          ShopManager.savePlayerConfig(PlayerConfig);
          if (savedConfigBeforeTryOn) snapshotTryOnConfig();
        }
        spawnFX('#ec4899', store.mysteryStand.x, 215, 16);
        updateHeaderStats();
        renderShelfInspector();
        window.dispatchEvent(new CustomEvent('runner:coins-updated'));
        showToast(`🎁 Style-Überraschung ausgepackt: ${res.item.icon || ''} ${res.item.name}!`, 'success');
      } else if (res.reason === 'all_unlocked') {
        showToast('🏆 Du besitzt schon alle Boutique-Styles!', 'info');
      } else if (res.reason === 'insufficient_funds') {
        showToast(`🔒 Noch ${res.missing} 🪙 nötig für die Überraschung!`, 'warn');
      }
      return;
    }

    if (activeShopId === 'furniture') {
      const res = HomeManager.buyHomeMysteryBox();
      if (res.ok) {
        if (res.item.id === 'mailbox' || res.item.id === 'gold_mailbox') {
          MailboxManager.ensureDailyMail();
          window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
        }
        spawnFX('#f59e0b', store.mysteryStand.x, 215, 16);
        updateHeaderStats();
        renderShelfInspector();
        window.dispatchEvent(new CustomEvent('runner:coins-updated'));
        showToast(`🎁 Haus-Überraschung ausgepackt: ${res.item.icon} ${res.item.name}!`, 'success');
      } else if (res.reason === 'all_unlocked') {
        showToast('🏆 Alle Haus-Sachen gehören dir schon!', 'info');
      } else if (res.reason === 'insufficient_funds') {
        showToast(`🔒 Noch ${res.missing} 🪙 nötig!`, 'warn');
      }
    }
  }

  function renderAisleTabs() {
    if (!aisleTabsEl) return;
    const store = getStore();
    aisleTabsEl.innerHTML = '';

    store.aisles.forEach((aisle) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-tab-btn${aisle.id === activeAisleId ? ' active' : ''}`;
      btn.textContent = aisle.label;
      btn.addEventListener('click', () => {
        activeAisleId = aisle.id;
        activeSourceIdx = 0;
        walkToAisle(aisle);
        renderAisleTabs();
        renderShelfInspector();
      });
      aisleTabsEl.appendChild(btn);
    });
  }

  function renderShelfInspector() {
    const aisle = getActiveAisle();
    if (!aisle || !shelfItemsEl) return;

    if (shelfTitleEl) shelfTitleEl.textContent = aisle.label;
    if (shelfHintEl) shelfHintEl.textContent = aisle.hint;

    shelfItemsEl.innerHTML = '';

    // Sub-tabs if this aisle has multiple shelves (e.g. Oberteile / Hosen)
    if (aisle.sources.length > 1) {
      const subRow = document.createElement('div');
      subRow.className = 'store-subtabs';
      aisle.sources.forEach((src, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `home-tab-btn${activeSourceIdx === idx ? ' active' : ''}`;
        b.textContent = src.tabLabel || src.category;
        b.addEventListener('click', () => {
          activeSourceIdx = idx;
          renderShelfInspector();
        });
        subRow.appendChild(b);
      });
      shelfItemsEl.appendChild(subRow);
    }

    const source = aisle.sources[activeSourceIdx] || aisle.sources[0];
    const coins = ShopManager.getCoins();

    if (source.kind === 'salon_color') {
      const salonDyes = [
        { name: 'Schoko-Braun', hex: '#4a2e00' },
        { name: 'Gold-Blond', hex: '#facc15' },
        { name: 'Kastanien-Rot', hex: '#9a3412' },
        { name: 'Mitternacht', hex: '#1e1b4b' },
        { name: 'Erdbeer-Rosa', hex: '#ec4899' },
        { name: 'Lavendel', hex: '#a855f7' },
        { name: 'Himmel-Blau', hex: '#0ea5e9' },
        { name: 'Minz-Grün', hex: '#10b981' },
        { name: 'Feuer-Rot', hex: '#ef4444' },
        { name: 'Schnee-Weiß', hex: '#f1f5f9' }
      ];

      const infoCard = document.createElement('div');
      infoCard.className = 'store-shelf-item';
      infoCard.innerHTML = `
        <div class="store-shelf-item-head">
          <span class="store-shelf-item-icon">🎨</span>
          <div class="store-shelf-item-meta">
            <strong>Friseur-Farben &amp; Eigener Ton</strong>
            <p>Tippe auf eine Farbflasche, um deine Haare sofort im Salon zu färben!</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap;">
          <label style="font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:8px;">
            Eigene Farbe:
            <input type="color" id="salonCustomHairColor" value="${PlayerConfig.body.hairColor || '#4a2e00'}" style="width:44px;height:34px;border-radius:8px;border:2px solid #9333ea;cursor:pointer;" />
          </label>
        </div>
      `;
      shelfItemsEl.appendChild(infoCard);

      const customInput = infoCard.querySelector('#salonCustomHairColor');
      if (customInput) {
        customInput.addEventListener('input', (e) => {
          PlayerConfig.body.hairColor = e.target.value;
          if (savedConfigBeforeTryOn) savedConfigBeforeTryOn.body.hairColor = e.target.value;
          ShopManager.savePlayerConfig(PlayerConfig);
          spawnFX('#9333ea', player.x, player.y - 54, 4);
        });
      }

      salonDyes.forEach((dye) => {
        const isCurrent = (PlayerConfig.body.hairColor || '').toLowerCase() === dye.hex.toLowerCase();
        const card = document.createElement('div');
        card.className = `store-shelf-item${isCurrent ? ' owned' : ''}`;
        card.innerHTML = `
          <div class="store-shelf-item-head">
            <span class="store-shelf-item-icon" style="background:${dye.hex};border:2px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.18);width:36px;height:36px;border-radius:50%;display:inline-flex;"></span>
            <div class="store-shelf-item-meta">
              <strong>${dye.name}</strong>
              <p>${isCurrent ? 'Deine aktuelle Haarfarbe' : 'Im Salon kostenlos färben'}</p>
            </div>
          </div>
          <div class="store-shelf-item-actions">
            <button type="button" class="btn btn-small ${isCurrent ? 'btn-home' : 'btn-primary'} salon-dye-btn">
              ${isCurrent ? '✓ Gefärbt' : '🎨 Färben'}
            </button>
          </div>
        `;
        card.querySelector('.salon-dye-btn').addEventListener('click', () => {
          PlayerConfig.body.hairColor = dye.hex;
          if (savedConfigBeforeTryOn) savedConfigBeforeTryOn.body.hairColor = dye.hex;
          ShopManager.savePlayerConfig(PlayerConfig);
          spawnFX(dye.hex, player.x, player.y - 60, 12);
          showToast(`💇✨ Deine Haare wurden wunderschön in „${dye.name}“ gefärbt!`, 'success');
          renderShelfInspector();
        });
        shelfItemsEl.appendChild(card);
      });
      return;
    }

    if (source.kind === 'shop') {
      const rawShopItems = SHOP_CATALOG[source.category] || [];
      const items = source.filter ? rawShopItems.filter(source.filter) : rawShopItems;
      const currentId = getEquippedId(source.category);

      items.forEach((item) => {
        const unlocked = ShopManager.isUnlocked(source.category, item.id);
        const levelOk = ShopManager.isLevelUnlocked(item);
        const selected = source.category !== 'background' && currentId === item.id;
        const price = ShopManager.getEffectivePrice(source.category, item);
        const isDeal = !unlocked && levelOk && ShopManager.isDailyDeal(source.category, item.id);
        const inBasket = isInBasket('shop', source.category, item.id, false);
        const canAfford = levelOk && coins >= price;

        const card = document.createElement('div');
        card.className = `store-shelf-item${unlocked ? ' owned' : ''}${inBasket ? ' in-basket' : ''}${!levelOk ? ' level-locked' : ''}`;

        const badgeHtml = !unlocked && isDeal
          ? '<span class="home-inline-tag deal">🔥 -30%</span>'
          : !unlocked && item.isNew
            ? '<span class="home-inline-tag new">✨ NEU</span>'
            : '';

        const mainBtnLabel = unlocked
          ? (source.category === 'background'
              ? '✓ Freigeschaltet'
              : selected
                ? '✓ Angezogen'
                : '👗 Anziehen')
          : !levelOk
            ? `🔒 Ab Level ${item.unlockLevel}`
            : inBasket
              ? '🛒 Im Einkaufskorb ✓'
              : `🛒 In den Korb (${price} 🪙)`;

        const canTryOn = !unlocked && source.category !== 'background' && source.category !== 'ability';

        card.innerHTML = `
          <div class="store-shelf-item-head">
            <span class="store-shelf-item-icon">${item.icon || '✨'}</span>
            <div class="store-shelf-item-meta">
              <strong>${item.name} ${badgeHtml}</strong>
              <p>${item.description || (unlocked ? 'Gehört dir schon' : `${price} 🪙 im Regal`)}</p>
            </div>
          </div>
          <div class="store-shelf-item-actions">
            ${canTryOn ? '<button type="button" class="btn btn-small btn-secondary store-try-btn">🪞 Anprobieren</button>' : ''}
            <button type="button" class="btn btn-small ${inBasket ? 'btn-home' : unlocked ? 'btn-secondary' : canAfford ? 'btn-primary' : 'btn-secondary'} store-pick-btn" ${(!levelOk || (unlocked && source.category === 'background')) ? 'disabled' : ''}>
              ${mainBtnLabel}
            </button>
          </div>
        `;

        const tryBtn = card.querySelector('.store-try-btn');
        if (tryBtn) {
          tryBtn.addEventListener('click', () => {
            equipCharacterItem(source.category, item.id);
            tryingOnLabel = `${item.icon || ''} ${item.name}`;
            spawnFX('#ec4899', player.x, player.y - 36, 7);
            showToast(`🪞 Du probierst "${item.name}" vor dem Boutique-Spiegel an!`, 'info');
            renderShelfInspector();
          });
        }

        const pickBtn = card.querySelector('.store-pick-btn');
        if (pickBtn && levelOk) {
          pickBtn.addEventListener('click', () => {
            if (unlocked) {
              if (source.category !== 'background') {
                equipCharacterItem(source.category, item.id);
                if (savedConfigBeforeTryOn) {
                  if (source.category === 'face') savedConfigBeforeTryOn.body.faceId = item.id;
                  if (source.category === 'hair') savedConfigBeforeTryOn.body.hairId = item.id;
                  if (source.category === 'top') savedConfigBeforeTryOn.clothes.top.style = item.id;
                  if (source.category === 'pants') savedConfigBeforeTryOn.clothes.pants.style = item.id;
                  if (source.category === 'shoes') savedConfigBeforeTryOn.clothes.shoes.style = item.id;
                  if (source.category === 'ability') savedConfigBeforeTryOn.ability = item.id;
                }
                ShopManager.savePlayerConfig(PlayerConfig);
                renderShelfInspector();
                showToast(`👗 "${item.name}" angezogen!`, 'success');
              }
              return;
            }
            if (inBasket) {
              basket = basket.filter((b) => !(b.kind === 'shop' && b.category === source.category && b.item.id === item.id));
              updateHeaderStats();
              renderBasketBar();
              renderShelfInspector();
              return;
            }
            basket.push({
              key: `shop_${source.category}_${item.id}_${Date.now()}`,
              kind: 'shop',
              category: source.category,
              item,
              price
            });
            spawnFX('#ec4899', aisle.x, 195, 6);
            updateHeaderStats();
            renderBasketBar();
            renderShelfInspector();
            showToast(`🛒 "${item.name}" in deinen Einkaufskorb gelegt! Geh zur Kasse zum Bezahlen.`, 'info');
          });
        }

        shelfItemsEl.appendChild(card);
      });
      return;
    }

    // Home catalog shelf
    const rawList = HOME_CATALOG[source.category] || [];
    const list = source.filter ? rawList.filter(source.filter) : rawList;

    list.forEach((item) => {
      const owned = !item.isConsumable && HomeManager.hasItem(source.category, item.id);
      const levelOk = HomeManager.isLevelUnlocked(item);
      const price = HomeManager.getEffectivePrice(source.category, item);
      const isDeal = !owned && !item.isConsumable && HomeManager.isDailyDeal(source.category, item.id);
      const inBasket = isInBasket('home', source.category, item.id, Boolean(item.isConsumable));
      const isPetTab = source.category === 'pets';
      const isComingAlong = owned && isPetTab && HomeManager.isCompanionPet(item.id);
      const canAfford = levelOk && coins >= price;

      const card = document.createElement('div');
      card.className = `store-shelf-item${owned ? ' owned' : ''}${inBasket ? ' in-basket' : ''}${!levelOk ? ' level-locked' : ''}`;

      const badgeHtml = !owned && isDeal
        ? '<span class="home-inline-tag deal">🔥 -30%</span>'
        : !owned && item.isNew
          ? '<span class="home-inline-tag new">✨ NEU</span>'
          : '';

      const btnLabel = owned
        ? (isPetTab
            ? (isComingAlong ? '🎒 Kommt mit' : '🐾 Mitnehmen')
            : '✓ Gehört dir')
        : !levelOk
          ? `🔒 Ab Level ${item.unlockLevel}`
          : inBasket
            ? '🛒 Im Korb ✓'
            : `🛒 In den Korb (${price} 🪙)`;

      card.innerHTML = `
        <div class="store-shelf-item-head">
          <span class="store-shelf-item-icon">${item.icon}</span>
          <div class="store-shelf-item-meta">
            <strong>${item.name} ${badgeHtml}</strong>
            <p>${item.desc}</p>
          </div>
        </div>
        <div class="store-shelf-item-actions">
          <button type="button" class="btn btn-small ${inBasket ? 'btn-home' : owned ? (isComingAlong ? 'btn-home' : 'btn-secondary') : canAfford ? 'btn-primary' : 'btn-secondary'} store-pick-btn" ${(owned && !isPetTab) || !levelOk ? 'disabled' : ''}>
            ${btnLabel}
          </button>
        </div>
      `;

      const pickBtn = card.querySelector('.store-pick-btn');
      if (pickBtn && owned && isPetTab) {
        pickBtn.addEventListener('click', () => {
          const res = HomeManager.toggleCompanionPet(item.id);
          if (res.ok) {
            petFollowers.reset(player.x, player.y + 4);
            renderShelfInspector();
            showToast(
              res.active
                ? `🐾 ${item.name} kommt jetzt an der Leine mit!`
                : `🏡 ${item.name} wartet gemütlich im Tierzimmer.`,
              res.active ? 'success' : 'info'
            );
          }
        });
      } else if (pickBtn && !owned && levelOk) {
        pickBtn.addEventListener('click', () => {
          if (!item.isConsumable && inBasket) {
            basket = basket.filter((b) => !(b.kind === 'home' && b.category === source.category && b.item.id === item.id));
            updateHeaderStats();
            renderBasketBar();
            renderShelfInspector();
            return;
          }
          basket.push({
            key: `home_${source.category}_${item.id}_${Date.now()}_${Math.random()}`,
            kind: 'home',
            category: source.category,
            item,
            price
          });
          spawnFX('#10b981', aisle.x, 195, 6);
          updateHeaderStats();
          renderBasketBar();
          renderShelfInspector();
          showToast(`🛒 "${item.name}" in den Einkaufskorb gelegt! Geh nach rechts zur Kasse.`, 'info');
        });
      }

      shelfItemsEl.appendChild(card);
    });
  }

  function hitsStoreObstacle(x, y) {
    if (x >= 686 && y <= 278) return true;
    for (let i = 0; i < STORE_SHOPPERS.length; i++) {
      const npc = STORE_SHOPPERS[i];
      if (Math.hypot(x - npc.x, y - npc.y) < 34) return true;
    }
    return false;
  }

  function walkToAisle(aisle) {
    if (!aisle) return;
    player.targetX = aisle.x;
    player.targetY = 262;
    player.pendingAction = () => {
      if (statusEl) statusEl.textContent = `👀 Du stehst am Regal: ${aisle.label} — wähle rechts aus!`;
    };
  }

  function navigateInStore(tx, ty, pendingAction = null) {
    let gx = Math.max(54, Math.min(812, tx));
    let gy = Math.max(252, Math.min(430, ty));
    if (gx >= 686 && gy <= 278) {
      gy = 288;
    }
    player.targetX = gx;
    player.targetY = gy;
    player.pendingAction = pendingAction;
  }

  function interactNearestInStore() {
    const store = getStore();
    // 1. Near exit door on left?
    if (player.x <= 88 && player.y <= 295) {
      leaveStoreToStreet();
      return;
    }
    // 2. Near Kasse on right?
    if (player.x >= 685) {
      performCheckout();
      return;
    }
    // 3. Near Mystery Stand?
    if (store.mysteryStand && Math.abs(player.x - store.mysteryStand.x) < 55) {
      buyMysteryAtPedestal();
      return;
    }
    // 4. Near Free Sample?
    if (store.freeSample && !visitSampleClaimed && Math.abs(player.x - store.freeSample.x) < 55) {
      claimFreeSample();
      return;
    }
    // 5. Select nearest shelf
    const nearAisle = getNearestAisle();
    if (nearAisle) {
      activeAisleId = nearAisle.id;
      activeSourceIdx = 0;
      renderAisleTabs();
      renderShelfInspector();
      showToast(`🛍️ Du schaust ins Regal "${nearAisle.label}"!`, 'info');
    }
  }

  function claimFreeSample() {
    const store = getStore();
    if (!store.freeSample || visitSampleClaimed) return;
    visitSampleClaimed = true;
    if (activeShopId === 'supermarket') {
      HomeManager.addSupply('fridgeSnacks', 1);
    } else if (activeShopId === 'petshop') {
      HomeManager.addSupply('petFood', 1);
    } else if (activeShopId === 'salon') {
      ShopManager.addCoins(8);
      updateHeaderStats();
    }
    spawnFX('#fbbf24', store.freeSample.x, store.freeSample.y - 20, 12);
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    showToast(store.freeSample.rewardText, 'success');
  }

  function getNearestAisle() {
    const store = getStore();
    let best = null;
    let bestD = 92;
    store.aisles.forEach((a) => {
      const d = Math.hypot(player.x - a.x, player.y - 255);
      if (d < bestD) {
        bestD = d;
        best = a;
      }
    });
    return best;
  }

  // Click inside Store Canvas
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
      const store = getStore();

      // Pet tap
      const petTap = petFollowers.handleTap(cx, cy);
      if (petTap.hit) {
        player.pose = 'pet';
        player.poseTimer = 20;
        talkPanel.selectTarget(petTap.petId, `🐾 ${petTap.meta.name} ausgewählt – sag etwas oder gib eine Anweisung!`);
        showToast(`❤️ ${petTap.meta.name} schnuppert neugierig im Laden!`, 'info');
        return;
      }

      // Tap on a Shopper NPC (Paula or Ben) to walk up & talk!
      for (const npc of STORE_SHOPPERS) {
        if (Math.hypot(cx - npc.x, cy - (npc.y - 36)) <= 38) {
          const standX = npc.x + (player.x < npc.x ? -42 : 42);
          navigateInStore(standX, npc.y, async () => {
            player.facing = npc.x >= player.x ? 1 : -1;
            const greet = `Hallo ${npc.name}!`;
            player.speechText = greet;
            player.speechTimer = 120;
            npc.speechText = '💭 …';
            npc.speechTimer = 90;
            npc.pauseTimer = 160;
            talkPanel.selectTarget(npc.id, `💭 ${npc.name} überlegt...`);
            const res = await askPersonAI({ id: npc.id, name: npc.name, icon: npc.icon, kind: 'shopper' }, greet, { scene: 'store', shopId: activeShopId });
            if (!res.ok) {
              talkPanel.selectTarget(npc.id, `⚠️ ${npc.name} konnte nicht antworten (${res.error})`);
              return;
            }
            npc.speechText = res.bubble;
            npc.speechTimer = 165;
            npc.pauseTimer = 140;
            talkPanel.selectTarget(npc.id, `${npc.icon} ${npc.name}: „${res.reply}“`);
          });
          return;
        }
      }

      // Hidden Lucky Coupon inside store!
      if (luckyCoupon && Math.hypot(cx - luckyCoupon.x, cy - luckyCoupon.y) <= 34) {
        const reward = luckyCoupon.coins;
        ShopManager.addCoins(reward);
        spawnFX('#fbbf24', luckyCoupon.x, luckyCoupon.y, 12);
        luckyCoupon = null;
        updateHeaderStats();
        window.dispatchEvent(new CustomEvent('runner:coins-updated'));
        showToast(`✨ Einkaufs-Gutschein im Laden gefunden! +${reward} 🪙 geschenkt!`, 'success');
        return;
      }

      // Exit Door (Left)
      if (cx <= 92 && cy >= 95 && cy <= 260) {
        navigateInStore(72, 265, leaveStoreToStreet);
        return;
      }

      // Checkout Counter (Right: Kasse) -> Pay if basket has items, OR talk with Cashier!
      if (cx >= 680 && cy >= 110 && cy <= 325) {
        navigateInStore(705, 290, () => {
          talkPanel.selectTarget(`cashier_${store.id}`);
          if (basket.length > 0) {
            performCheckout();
          } else {
            cashierBubble = 'Hallo! Leg erst schöne Sachen in deinen Korb!';
            cashierBubbleTimer = 135;
            showToast(`💬 ${store.cashierName}: "Hallo! Such dir gerne etwas aus den Regalen aus!"`, 'info');
            talkPanel.setStatusLine(`💳 ${store.cashierName}: „Hallo! Such dir gerne etwas aus den Regalen aus!“`);
          }
        });
        return;
      }

      // Mystery Stand
      if (store.mysteryStand && Math.abs(cx - store.mysteryStand.x) <= 44 && cy >= 150 && cy <= 265) {
        navigateInStore(store.mysteryStand.x, 265, buyMysteryAtPedestal);
        return;
      }

      // Free Sample Stand
      if (store.freeSample && Math.abs(cx - store.freeSample.x) <= 44 && cy >= 150 && cy <= 265) {
        navigateInStore(store.freeSample.x, 265, () => {
          if (!visitSampleClaimed) {
            claimFreeSample();
          } else {
            showToast('😊 Du hast dir heute schon deine Gratis-Kostprobe geholt!', 'info');
          }
        });
        return;
      }

      // Store Shelves / Aisles
      for (const aisle of store.aisles) {
        if (Math.abs(cx - aisle.x) <= 64 && cy >= 62 && cy <= 255) {
          activeAisleId = aisle.id;
          activeSourceIdx = 0;
          renderAisleTabs();
          renderShelfInspector();
          walkToAisle(aisle);
          return;
        }
      }

      // Walk freely to floor spot
      navigateInStore(cx, cy, null);
    });
  }

  // Movement Pads & Keys
  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.targetX = null;
      player.targetY = null;
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

  if (actionBtn) actionBtn.addEventListener('click', interactNearestInStore);

  if (payBtn) {
    payBtn.addEventListener('click', () => {
      navigateInStore(705, 290, performCheckout);
    });
  }
  if (clearBasketBtn) {
    clearBasketBtn.addEventListener('click', () => {
      basket = [];
      updateHeaderStats();
      renderBasketBar();
      renderShelfInspector();
      showToast('🗑️ Einkaufskorb geleert.', 'info');
    });
  }

  if (backStreetBtn) backStreetBtn.addEventListener('click', leaveStoreToStreet);
  if (toHomeBtn) {
    toHomeBtn.addEventListener('click', () => {
      restoreTryOnConfig();
      stateManager.setState('HOME', { room: 'living_room' });
    });
  }
  if (toEditorBtn) {
    toEditorBtn.addEventListener('click', () => {
      restoreTryOnConfig();
      stateManager.setState('EDITOR');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'STORE') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (document.querySelector('.modal:not(.hidden)')) return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.targetX = null;
      player.targetY = null;
      player.pendingAction = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.targetX = null;
      player.targetY = null;
      player.pendingAction = null;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = true;
      player.targetX = null;
      player.targetY = null;
      player.pendingAction = null;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      keys.down = true;
      player.targetX = null;
      player.targetY = null;
      player.pendingAction = null;
    } else if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
      e.preventDefault();
      interactNearestInStore();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  function updateSimulation() {
    const store = getStore();
    let mx = 0;
    let my = 0;
    if (keys.left || holdPad.left) mx -= 1;
    if (keys.right || holdPad.right) mx += 1;
    if (keys.up || holdPad.up) my -= 1;
    if (keys.down || holdPad.down) my += 1;

    const speed = 4.6;
    const stepStoreWithCollision = (nxRaw, nyRaw) => {
      const nx = Math.max(52, Math.min(812, nxRaw));
      const ny = Math.max(252, Math.min(430, nyRaw));
      if (!hitsStoreObstacle(nx, ny)) {
        player.x = nx;
        player.y = ny;
      } else {
        if (!hitsStoreObstacle(nx, player.y)) player.x = nx;
        if (!hitsStoreObstacle(player.x, ny)) player.y = ny;
      }
    };

    if (mx !== 0 || my !== 0) {
      const len = Math.hypot(mx, my) || 1;
      stepStoreWithCollision(player.x + (mx / len) * speed, player.y + (my / len) * speed);
      if (mx !== 0) player.facing = Math.sign(mx);
      player.pose = 'walk';
    } else if (player.targetX !== null && player.targetY !== null) {
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        stepStoreWithCollision(player.targetX, player.targetY);
        player.targetX = null;
        player.targetY = null;
        const cb = player.pendingAction;
        player.pendingAction = null;
        if (cb) cb();
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        stepStoreWithCollision(player.x + (dx / dist) * speed, player.y + (dy / dist) * speed);
        player.pose = 'walk';
      }
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
      if (player.poseTimer <= 0) player.pose = 'idle';
    } else {
      player.pose = 'idle';
    }

    // Auto-select shelf when walking past it
    const nearAisle = getNearestAisle();
    if (nearAisle && nearAisle.id !== activeAisleId && mx === 0 && my === 0 && !player.targetX) {
      activeAisleId = nearAisle.id;
      activeSourceIdx = 0;
      renderAisleTabs();
      renderShelfInspector();
    }

    // Lucky Coupon pickup by walking over it
    if (luckyCoupon && Math.hypot(player.x - luckyCoupon.x, player.y - luckyCoupon.y) < 34) {
      const reward = luckyCoupon.coins;
      ShopManager.addCoins(reward);
      spawnFX('#fbbf24', luckyCoupon.x, luckyCoupon.y, 12);
      luckyCoupon = null;
      updateHeaderStats();
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
      showToast(`✨ Einkaufs-Gutschein gefunden! +${reward} 🪙 geschenkt!`, 'success');
    }

    // Move animated NPC shoppers (pause cleanly when chatting, turn neatly instead of bumping player!)
    STORE_SHOPPERS.forEach((npc) => {
      if (npc.speechTimer > 0) npc.speechTimer--;
      if (npc.pauseTimer > 0) {
        npc.pauseTimer--;
        return;
      }
      const nextNpcX = npc.x + npc.speed * npc.dir;
      if (Math.hypot(player.x - nextNpcX, player.y - npc.y) < 34) {
        npc.dir *= -1;
      } else {
        npc.x = nextNpcX;
      }
      if (npc.x >= npc.maxX) npc.dir = -1;
      if (npc.x <= npc.minX) npc.dir = 1;
    });

    if (player.speechTimer > 0) player.speechTimer--;
    if (scannerBeamTimer > 0) scannerBeamTimer--;
    if (receiptPopTimer > 0) receiptPopTimer--;
    if (cashierBubbleTimer > 0) cashierBubbleTimer--;

    // Update contextual Action button
    if (actionBtn) {
      if (player.x <= 88 && player.y <= 295) {
        actionBtn.textContent = '🚪 Raus auf die Straße';
      } else if (player.x >= 685 && basket.length > 0) {
        actionBtn.textContent = `💳 Bezahlen (${getBasketTotal()} 🪙)`;
      } else if (store.mysteryStand && Math.abs(player.x - store.mysteryStand.x) < 55) {
        actionBtn.textContent = `🎁 Überraschung (${store.mysteryStand.price} 🪙)`;
      } else if (store.freeSample && !visitSampleClaimed && Math.abs(player.x - store.freeSample.x) < 55) {
        actionBtn.textContent = `${store.freeSample.icon} Gratis nehmen!`;
      } else if (nearAisle) {
        actionBtn.textContent = `👀 Regal: ${nearAisle.label.replace(/^[^\s]+\s/, '')}`;
      } else {
        actionBtn.textContent = '🛍️ Regal ansehen / Kasse';
      }
    }
  }

  function drawStoreBackground(w, h) {
    const store = getStore();
    const wallH = 236;

    // Wall gradient
    const wg = ctx.createLinearGradient(0, 0, 0, wallH);
    wg.addColorStop(0, store.wallA);
    wg.addColorStop(1, store.wallB);
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, w, wallH);

    // Baseboard trim
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, wallH - 12, w, 12);
    ctx.fillStyle = store.accent;
    ctx.fillRect(0, wallH - 14, w, 3);

    // Store Ceiling Lights / Spotlights
    for (let lx = 110; lx <= w - 90; lx += 165) {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, 20);
      ctx.stroke();

      ctx.fillStyle = store.accent;
      ctx.beginPath();
      ctx.roundRect(lx - 26, 18, 52, 12, [6]);
      ctx.fill();
      const glow = ctx.createRadialGradient(lx, 36, 4, lx, 80, 95);
      glow.addColorStop(0, 'rgba(254, 249, 195, 0.45)');
      glow.addColorStop(1, 'rgba(254, 249, 195, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, 80, 95, 0, Math.PI * 2);
      ctx.fill();
    }

    // Store Floor
    const fg = ctx.createLinearGradient(0, wallH, 0, h);
    fg.addColorStop(0, store.floorA);
    fg.addColorStop(1, store.floorB);
    ctx.fillStyle = fg;
    ctx.fillRect(0, wallH, w, h - wallH);

    // Subtle tile / plank lines for real interior depth
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.14)';
    ctx.lineWidth = 1.5;
    for (let fy = wallH + 34; fy < h; fy += 40) {
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(w, fy);
      ctx.stroke();
    }
    for (let fx = 0; fx <= w; fx += 90) {
      ctx.beginPath();
      ctx.moveTo(fx, wallH);
      ctx.lineTo(w / 2 + (fx - w / 2) * 1.25, h);
      ctx.stroke();
    }

    // Left Glass Entrance / Exit Door ("🚪 Ausgang auf die Straße")
    ctx.save();
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(18, 102, 66, 134, [12, 12, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();
    // Welcome mat
    ctx.fillStyle = store.accent;
    ctx.beginPath();
    ctx.roundRect(22, 238, 60, 14, [4]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(12, 74, 82, 22, [10]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = store.accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪 Ausgang', 53, 85);
    ctx.restore();
  }

  function drawSupermarketShelf(aisle, idx) {
    const x = aisle.x;
    const isActive = aisle.id === activeAisleId;
    ctx.save();

    if (idx === 1) {
      // Glass-door Cold Refrigerator Display (Kühlregal!)
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(x - 56, 80, 112, 154, [12, 12, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#0ea5e9' : '#38bdf8';
      ctx.lineWidth = isActive ? 4 : 2.5;
      ctx.stroke();
      for (let sy = 114; sy <= 198; sy += 40) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 50, sy, 100, 4);
      }
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥛  🧀  🥘', x, 106);
      ctx.fillText('🍅  🍝  🥦', x, 146);
      ctx.fillText('🧈  🥗  🍲', x, 186);
    } else {
      // Wooden/Steel Supermarket Shelf with Crates/Bags
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 54, 88, 108, 146, [10]);
      ctx.fill();
      ctx.strokeStyle = isActive ? aisle.color : '#cbd5e1';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();

      [126, 166, 206].forEach((sy) => {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x - 48, sy, 96, 5);
      });

      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      if (idx === 0) {
        ctx.fillText('🍓  🍎  🍌', x, 117);
        ctx.fillText('🍇  🥐  🍪', x, 157);
        ctx.fillText('🥨  🧃  🍊', x, 197);
      } else {
        ctx.fillText('🦴  🥣  🍖', x, 117);
        ctx.fillText('🐟  🦴  📦', x, 157);
        ctx.fillText('🐾  🦴  🥫', x, 197);
      }
    }

    drawAisleSign(aisle, x, 58, isActive);
    ctx.restore();
  }

  function drawBoutiqueShelf(aisle, idx) {
    const x = aisle.x;
    const isActive = aisle.id === activeAisleId;
    ctx.save();

    if (idx === 0) {
      // Brass Clothing Rack with Hanging Tops & Pants!
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 52, 232);
      ctx.lineTo(x - 46, 104);
      ctx.lineTo(x + 46, 104);
      ctx.lineTo(x + 52, 232);
      ctx.stroke();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👕 👗 🧥', x, 140);
      ctx.fillText('👖 🩳 🦸', x, 185);
    } else if (idx === 1) {
      // Illuminated Shoe Pedestal Wall
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 50, 96, 100, 138, [12]);
      ctx.fill();
      ctx.strokeStyle = isActive ? aisle.color : '#e9d5ff';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      [136, 178, 216].forEach((sy) => {
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(x - 42, sy, 84, 5);
      });
      ctx.font = '21px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👟  🥾  ⛸️', x, 127);
      ctx.fillText('🪽  🪩  🚀', x, 169);
      ctx.fillText('👠  👟  ✨', x, 207);
    } else if (idx === 2) {
      // Hollywood Vanity Styling Mirror!
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(x - 46, 92, 92, 104, [46, 46, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#f43f5e' : '#fbbf24';
      ctx.lineWidth = 5;
      ctx.stroke();
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(x - 32 + b * 16, 100, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(x - 50, 198, 100, 36);
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('😀 😎 🦋', x, 152);
    } else {
      // Power & World Travel Ticket Counter
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(x - 50, 96, 100, 138, [14]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#0ea5e9' : '#7dd3fc';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❄️  🏖️', x, 134);
      ctx.fillText('🚀  🍬', x, 174);
      ctx.fillText('⚡  🛡️', x, 212);
    }

    drawAisleSign(aisle, x, 58, isActive);
    ctx.restore();
  }

  function drawFurnitureShelf(aisle, idx) {
    const x = aisle.x;
    const isActive = aisle.id === activeAisleId;
    ctx.save();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 52, 92, 104, 142, [12]);
    ctx.fill();
    ctx.strokeStyle = isActive ? aisle.color : '#fde68a';
    ctx.lineWidth = isActive ? 4 : 2;
    ctx.stroke();

    ctx.font = '23px sans-serif';
    ctx.textAlign = 'center';
    if (idx === 0) {
      // Architecture table with miniature house blueprint
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(x - 42, 112, 84, 52);
      ctx.fillText('🏡  📐  🏗️', x, 146);
      ctx.fillText('🍳  🐾  🔭', x, 200);
    } else if (idx === 1) {
      ctx.fillText('🛋️  🛏️', x, 136);
      ctx.fillText('📺  🎹  🎬', x, 192);
    } else if (idx === 2) {
      ctx.fillText('🖼️  ✨  📚', x, 136);
      ctx.fillText('🧹  🚿  🤖', x, 192);
    } else {
      ctx.fillText('📬  🍎  🌳', x, 136);
      ctx.fillText('🎠  🌿  🌈', x, 192);
    }

    drawAisleSign(aisle, x, 58, isActive);
    ctx.restore();
  }

  function drawPetshopShelf(aisle, idx) {
    const x = aisle.x;
    const isActive = aisle.id === activeAisleId;
    ctx.save();

    if (idx === 0) {
      // Live Playpen Habitats with Real Animated Pets!
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.roundRect(x - 74, 92, 148, 142, [14]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#ec4899' : '#34d399';
      ctx.lineWidth = isActive ? 4 : 2.5;
      ctx.stroke();

      // Playpen glass rail
      ctx.fillStyle = 'rgba(186, 230, 253, 0.42)';
      ctx.fillRect(x - 68, 178, 136, 46);

      // Draw 3 adorable animated sample pets inside the store habitat!
      const hop = Math.abs(Math.sin(animFrame * 0.08)) * 5;
      drawVectorPet(ctx, x - 40, 214 - hop, 'dog', animFrame, 1, 0.92);
      drawVectorPet(ctx, x, 214, 'cat', animFrame + 18, -1, 0.92);
      drawVectorPet(ctx, x + 40, 214 - Math.abs(Math.cos(animFrame * 0.09)) * 6, 'bunny', animFrame + 32, -1, 0.92);

      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐢  🦜  🦊  🦄', x, 132);
    } else if (idx === 1) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 54, 92, 108, 142, [12]);
      ctx.fill();
      ctx.strokeStyle = isActive ? aisle.color : '#bae6fd';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥣  ⚽  🧺', x, 138);
      ctx.fillText('🎡  🪵  🛁', x, 194);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 50, 96, 100, 138, [12]);
      ctx.fill();
      ctx.strokeStyle = isActive ? aisle.color : '#fde68a';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦴  🐾  🦴', x, 140);
      ctx.fillText('🥫  🦴  🍖', x, 194);
    }

    drawAisleSign(aisle, x, 58, isActive);
    ctx.restore();
  }

  function drawSalonShelf(aisle, idx) {
    const x = aisle.x;
    const isActive = aisle.id === activeAisleId;
    ctx.save();

    if (idx === 0) {
      // Illuminated Round Salon Mirror + Swivel Haircut Chair!
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(x, 138, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#9333ea' : '#fbbf24';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Salon lights around mirror
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(x + Math.cos(ang) * 42, 138 + Math.sin(ang) * 42, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Swivel styling chair
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.roundRect(x - 24, 190, 48, 30, [10]);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x - 4, 220, 8, 14);
      ctx.fillRect(x - 20, 232, 40, 4);

      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💇 ✂️ 🪮', x, 144);
    } else if (idx === 1) {
      // Velvet Crown & Headwear Display Case
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 52, 94, 104, 140, [12]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#ec4899' : '#f9a8d4';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      [148, 198].forEach((sy) => {
        ctx.fillStyle = '#fce7f3';
        ctx.fillRect(x - 44, sy, 88, 6);
      });
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑  🐰  🐱', x, 136);
      ctx.fillText('🌸  🦄  🧙', x, 186);
    } else {
      // Colorful Salon Hair-Dye Bottle Bar!
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 54, 94, 108, 140, [12]);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#0ea5e9' : '#bae6fd';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.stroke();
      const bottleColors = ['#facc15', '#ec4899', '#a855f7', '#0ea5e9', '#10b981', '#ef4444'];
      bottleColors.forEach((col, bi) => {
        const bx = x - 38 + (bi % 3) * 30;
        const by = bi < 3 ? 114 : 168;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(bx, by, 16, 26, [5]);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 4, by - 6, 8, 6);
      });
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎨', x, 222);
    }

    drawAisleSign(aisle, x, 58, isActive);
    ctx.restore();
  }

  function drawAisleSign(aisle, x, y, isActive) {
    ctx.fillStyle = isActive ? aisle.color : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 56, y, 112, 24, [12]);
    ctx.fill();
    ctx.strokeStyle = aisle.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isActive ? '#ffffff' : aisle.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(aisle.label, x, y + 12);
  }

  function drawCheckoutCounter(store) {
    const kx = 752;
    const ky = 178;
    ctx.save();

    // Cashier NPC behind counter (human-sized!)
    ctx.save();
    ctx.translate(kx + 8, ky + 16);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, store.cashierConfig, {
      frame: animFrame,
      pose: scannerBeamTimer > 0 ? 'pet' : 'idle',
      facing: -1
    });
    ctx.restore();

    // Checkout Conveyor Belt & Register Desk
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(kx - 58, ky + 14, 126, 70, [10]);
    ctx.fill();
    ctx.strokeStyle = store.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Conveyor Belt
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(kx - 50, ky + 22, 68, 16, [6]);
    ctx.fill();
    // Moving belt stripes
    ctx.fillStyle = '#64748b';
    for (let bx = 0; bx < 4; bx++) {
      const offset = ((animFrame * 0.6 + bx * 16) % 60);
      ctx.fillRect(kx - 46 + offset, ky + 24, 5, 12);
    }

    // Cash Register & Scanner Laser
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(kx + 24, ky - 2, 34, 24, [5]);
    ctx.fill();
    ctx.fillStyle = scannerBeamTimer > 0 ? '#10b981' : '#38bdf8';
    ctx.fillRect(kx + 28, ky + 2, 26, 12);

    if (scannerBeamTimer > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(kx + 18, ky + 14);
      ctx.lineTo(kx - 16, ky + 28);
      ctx.stroke();
    }

    // KASSE Overhead Sign
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(kx - 42, 68, 96, 26, [13]);
    ctx.fill();
    ctx.font = '800 11.5px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💳 KASSE', kx + 6, 81);

    // Speech / Receipt Bubble
    if (receiptPopTimer > 0 || cashierBubbleTimer > 0) {
      const msg = receiptPopTimer > 0 ? receiptText : cashierBubble;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(kx - 82, 102, 160, 24, [12]);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.fillText(msg, kx - 2, 114);
    }

    ctx.restore();
  }

  function drawSpecialStands(store) {
    if (store.mysteryStand) {
      const sx = store.mysteryStand.x;
      const bob = Math.sin(animFrame * 0.1) * 4;
      ctx.save();
      ctx.fillStyle = '#f5d0fe';
      ctx.beginPath();
      ctx.roundRect(sx - 28, 200, 56, 36, [10]);
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎁', sx, 192 + bob);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(sx - 46, 152, 92, 20, [10]);
      ctx.fill();
      ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#7e22ce';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🎁 ${store.mysteryStand.price} 🪙`, sx, 162);
      ctx.restore();
    }

    if (store.freeSample) {
      const sx = store.freeSample.x;
      const bob = Math.sin(animFrame * 0.1) * 3;
      ctx.save();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(sx - 26, 204, 52, 32, [8]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(visitSampleClaimed ? '✅' : store.freeSample.icon, sx, 196 + bob);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(sx - 44, 156, 88, 20, [10]);
      ctx.fill();
      ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#b45309';
      ctx.textBaseline = 'middle';
      ctx.fillText(visitSampleClaimed ? 'Geholt ✓' : 'Gratis Probe!', sx, 166);
      ctx.restore();
    }
  }

  function drawShoppingCartBesidePlayer() {
    if (basket.length === 0) return;
    const cartX = player.x + player.facing * 26;
    const cartY = player.y + 8;
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cartX - 14, cartY - 22, 28, 18, [4]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cartX - 8, cartY - 2, 3.5, 0, Math.PI * 2);
    ctx.arc(cartX + 8, cartY - 2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Icons peeking out of basket
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    basket.slice(0, 3).forEach((b, idx) => {
      ctx.fillText(b.item.icon || '🛍️', cartX - 7 + idx * 7, cartY - 24);
    });
    ctx.restore();
  }

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    const store = getStore();
    ctx.clearRect(0, 0, w, h);

    drawStoreBackground(w, h);

    // Store Aisles / Shelves
    store.aisles.forEach((aisle, idx) => {
      if (activeShopId === 'supermarket') drawSupermarketShelf(aisle, idx);
      else if (activeShopId === 'salon') drawSalonShelf(aisle, idx);
      else if (activeShopId === 'boutique') drawBoutiqueShelf(aisle, idx);
      else if (activeShopId === 'furniture') drawFurnitureShelf(aisle, idx);
      else drawPetshopShelf(aisle, idx);
    });

    drawSpecialStands(store);
    drawCheckoutCounter(store);

    // Hidden Sparkling Lucky Coupon in store!
    if (luckyCoupon) {
      const bob = Math.sin(animFrame * 0.12) * 4;
      ctx.save();
      const g = ctx.createRadialGradient(luckyCoupon.x, luckyCoupon.y + bob, 3, luckyCoupon.x, luckyCoupon.y + bob, 24);
      g.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      g.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(luckyCoupon.x, luckyCoupon.y + bob, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎟️', luckyCoupon.x, luckyCoupon.y + bob);
      ctx.font = '800 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#92400e';
      ctx.fillText(`+${luckyCoupon.coins} 🪙`, luckyCoupon.x, luckyCoupon.y + bob - 18);
      ctx.restore();
    }

    // Other NPC Shoppers browsing the store (human-sized!)
    STORE_SHOPPERS.forEach((npc) => {
      ctx.save();
      ctx.translate(npc.x, npc.y);
      ctx.scale(0.84, 0.84);
      renderCharacter(ctx, 0, 0, npc.config, {
        frame: animFrame,
        pose: npc.pauseTimer > 0 ? 'idle' : 'walk',
        facing: npc.pauseTimer > 0 ? (player.x >= npc.x ? 1 : -1) : npc.dir
      });
      ctx.restore();

      if (npc.speechTimer > 0 && npc.speechText) {
        drawCanvasSpeechBubble(ctx, npc.x, npc.y - 102, npc.speechText, {
          accent: '#8b5cf6',
          maxX: w - 10
        });
      }
    });

    // Companion Pets following you inside the store!
    petFollowers.update(player.x, player.y + 4, player.facing, {
      minX: 40,
      maxX: 810,
      minY: 242,
      maxY: 436
    });
    petFollowers.draw(ctx, animFrame, {
      scale: 0.9,
      showLeashes: true,
      anchorX: player.x,
      anchorY: player.y + 4,
      facing: player.facing
    });

    // Player Character
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(0.86, 0.86);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    if (player.speechTimer > 0 && player.speechText) {
      drawCanvasSpeechBubble(ctx, player.x, player.y - 104, player.speechText, {
        accent: '#ec4899',
        maxX: w - 10
      });
    }

    drawShoppingCartBesidePlayer();

    if (tryingOnLabel) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.beginPath();
      ctx.roundRect(player.x - 68, player.y - 122, 136, 22, [11]);
      ctx.fill();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#be185d';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🪞 Probe: ${tryingOnLabel}`, player.x, player.y - 111);
      ctx.restore();
    }

    // Particle FX
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 44);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    rafId = requestAnimationFrame(drawScene);
  }

  function enterStore({ shopId = 'supermarket', aisle = null } = {}) {
    activeShopId = STORE_CONFIG[shopId] ? shopId : 'supermarket';
    const store = getStore();
    activeAisleId = aisle && store.aisles.some((a) => a.id === aisle)
      ? aisle
      : store.aisles[0].id;
    activeSourceIdx = 0;

    basket = [];
    visitSampleClaimed = false;
    scannerBeamTimer = 0;
    receiptPopTimer = 0;
    cashierBubble = `Willkommen im ${store.title.replace(/^[^\s]+\s/, '')}!`;
    cashierBubbleTimer = 110;
    luckyCoupon = {
      x: 220 + Math.floor(Math.random() * 320),
      y: 315 + Math.floor(Math.random() * 85),
      coins: 10
    };

    snapshotTryOnConfig();

    player.x = 128;
    player.y = 300;
    player.facing = 1;
    player.targetX = null;
    player.targetY = null;
    player.pendingAction = null;
    player.speechTimer = 0;
    petFollowers.reset(player.x, player.y + 4);

    if (titleEl) titleEl.textContent = store.title;
    if (subtitleEl) subtitleEl.textContent = store.subtitle;
    if (statusEl) statusEl.textContent = `Willkommen! Lauf zu den Regalen, leg Sachen in den Korb & bezahl rechts an der Kasse!`;
    if (toastEl) toastEl.classList.add('hidden');

    updateHeaderStats();
    renderBasketBar();
    renderAisleTabs();
    renderShelfInspector();
    talkPanel.refresh();
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
    if (stateManager.getState() === 'STORE') {
      updateHeaderStats();
      renderShelfInspector();
    }
  });

  stateManager.onStateChange((newState, payload) => {
    if (newState === 'STORE') {
      enterStore(payload || {});
      startLoop();
    } else {
      restoreTryOnConfig();
      stopLoop();
    }
  });
}
