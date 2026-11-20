import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { PetFollowerController } from '../home/petCompanion.js';
import { MailboxManager } from './mailboxData.js';

const FRIEND_TEMPLATES = [
  {
    id: 'frieda',
    name: 'Oma Frieda',
    icon: '🏡',
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_6', hairId: 'hair_flower', hairColor: '#cbd5e1' },
      clothes: {
        top: { style: 'princess_coat', color: '#a855f7', stickers: [{ type: 'heart', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'jeans', color: '#475569' },
        shoes: { style: 'glitter_boots', color: '#be185d' }
      }
    },
    greetings: {
      party: 'Der Kuchen ist noch warm! Wie gefällt dir unsere Party?',
      trip: 'Was für ein schöner Ausflug zusammen!',
      race: 'Du läufst so schnell – ich drücke dir ganz fest die Daumen!',
      pet_show: 'Bello und deine Tierchen sind heute einfach zauberhaft!',
      garden_contest: 'Deine Blumen duften bis zu meinem Haus herüber!',
      cafe_contest: 'Mmmh, diese Eis-Kreationen sehen zum Anbeißen aus!',
      treasure_hunt: 'Schau gut auf dein Schatz-Radar — ich glaube rechts liegt Gold!',
      band_jam: 'Was für ein tolles Konzert! Spiel uns einen fetzigen Rhythmus!',
      hide_and_seek: 'Pssst! Hast du mich echt schon in meinem Versteck entdeckt?!',
      baking_fest: 'Mmmh, der frische Teig riecht wie in meiner Backstube!',
      stargazing: 'Wie wunderschön die leuchtenden Laternen in den Nachthimmel steigen!'
    },
    replies: [
      'Oh, das hast du so lieb gesagt! ❤️',
      'Ich bin so froh, dass wir zusammen hier sind!',
      'Nimm dir gerne noch ein Stückchen Kuchen dazu! 🍰'
    ]
  },
  {
    id: 'weber',
    name: 'Herr Weber',
    icon: '🐕',
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_1', hairId: 'hair_1', hairColor: '#78350f' },
      clothes: {
        top: { style: 'jacket', color: '#0284c7', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'cargo', color: '#334155' },
        shoes: { style: 'sneakers', color: '#f8fafc' }
      }
    },
    greetings: {
      party: 'Super Stimmung heute! Bello wollte auch unbedingt mitfeiern!',
      trip: 'Schau mal, was für tolle Wege wir hier entdecken können!',
      race: 'Weiter so! Gleich bist du vorne an der Spitze!',
      pet_show: 'Bello hat fleißig geübt – zeig uns euren besten Trick!',
      garden_contest: 'Hier fühlen sich sogar meine Hunde pudelwohl!',
      cafe_contest: 'Nachher nehme ich auch eine große Portion Waffeln!',
      treasure_hunt: 'Bello wittert schon die vergrabenen Goldtruhen im Sand!',
      band_jam: 'Ich klatsch schon im Takt mit! Gib Vollgas an den Instrumenten!',
      hide_and_seek: 'Hihi, im Busch hättest du mich fast übersehen!',
      baking_fest: 'Auf die heiße Steinofen-Pizza freu ich mich ganz besonders!',
      stargazing: 'Schau durchs Teleskop — gleich fliegt noch eine Sternschnuppe!'
    },
    replies: [
      'Haha, genau das hab ich auch gedacht! 😄',
      'Wuff! Bello stimmt dir fröhlich zu! 🐾',
      'Mit dir als Nachbar wird es nie langweilig!'
    ]
  },
  {
    id: 'kaya',
    name: 'Frau Kaya',
    icon: '🐱',
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_8', hairId: 'hair_crown', hairColor: '#1e1b4b' },
      clothes: {
        top: { style: 'sparkle_top', color: '#10b981', stickers: [{ type: 'rainbow', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#1e3a8a' },
        shoes: { style: 'wings', color: '#fef08a' }
      }
    },
    greetings: {
      party: 'Diese Musik macht richtig gute Laune, findest du nicht?',
      trip: 'Ich liebe es, gemeinsam Schätze in der Natur zu suchen!',
      race: 'Hoppla, hol dir unbedingt die goldenen Boost-Sterne!',
      pet_show: 'Von mir bekommt ihr jetzt schon 10 von 10 Sternen!',
      garden_contest: 'Jedes gegossene Beet bringt noch mehr Schmetterlinge her!',
      cafe_contest: 'Du kombinierst die Zutaten wie ein echter Profi!',
      treasure_hunt: 'Wenn der Kreis um dich herum rot glüht, bist du ganz heiß dran!',
      band_jam: 'Unsere Traumstadt-Band klingt heute wie echte Superstars!',
      hide_and_seek: 'Du hast wirklich Adleraugen beim Suchen im Zauberwald!',
      baking_fest: 'Beim Backen genau auf den grünen Ofen-Bereich achten!',
      stargazing: 'Fang die fallenden Sternschnuppen und wünsch dir etwas Schönes!'
    },
    replies: [
      'Wie schön! Das macht mich richtig glücklich! ✨',
      'Schau mal, die Schmetterlinge tanzen schon mit! 🦋',
      'Du bist wirklich ein echtes Traumstadt-Talent!'
    ]
  },
  {
    id: 'mia',
    name: 'Mia',
    icon: '🍦',
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_4', hairId: 'hair_3', hairColor: '#92400e' },
      clothes: {
        top: { style: 'hoodie', color: '#ec4899', stickers: [{ type: 'crown', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#38bdf8' },
        shoes: { style: 'glitter_boots', color: '#ffffff' }
      }
    },
    greetings: {
      party: 'Hey! Ich habe extra Erdbeer-Eis und frische Limo mitgebracht!',
      trip: 'Sollen wir nachher noch zusammen ein Eis essen gehen?',
      race: 'Ich geb alles auf meiner Bahn – viel Glück dir!',
      pet_show: 'Eure Show-Tricks sind der absolute Hammer!',
      garden_contest: 'So viele bunte Blumen – perfekt fürs Café-Schaufenster!',
      cafe_contest: 'Zeig der Jury, wie schnell du die Desserts zauberst!',
      treasure_hunt: 'Jeder gefundene Schatz bringt uns näher an die Piraten-Krone!',
      band_jam: 'Drück genau auf das Instrument, wenn der Stern in den Kreis fällt!',
      hide_and_seek: 'Kicher! Mal sehen, ob du uns alle im Wald findest!',
      baking_fest: 'Erst rühren, dann goldbraun backen und süß verzieren!',
      stargazing: 'Jede leuchtende Lampion-Laterne macht die Nacht noch magischer!'
    },
    replies: [
      'Mega cool! Lass uns gleich weiterfeiern! 🎉',
      'Haha, du bist echt meine beste Freundin in der Stadt! 💕',
      'Eine extra Kugel Eis geht heute auf mich! 🍦'
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    icon: '🏃',
    config: {
      body: { height: 1.0, width: 1.0, faceId: 'face_2', hairId: 'hair_2', hairColor: '#1e1b4b' },
      clothes: {
        top: { style: 'cape', color: '#0ea5e9', stickers: [{ type: 'lightning', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'sweatpants', color: '#0f172a' },
        shoes: { style: 'rocket', color: '#fde047' }
      }
    },
    greetings: {
      party: 'Coole Party! Hast du schon ein paar Ballons platzen lassen?',
      trip: 'Los geht’s – mal sehen, wer die nächsten Schätze findet!',
      race: 'Auf die Plätze, fertig – gib ordentlich Gas!',
      pet_show: 'Wow, was für ein Sprung! Das gibt Bestnoten!',
      garden_contest: 'Sogar ich als Läufer bleibe hier zum Staunen stehen!',
      cafe_contest: 'Ich bestelle nachher gleich zweimal Waffeln!',
      treasure_hunt: 'Ahoi! Die X-Markierungen im Sand verraten geheime Kisten!',
      band_jam: 'Yeah! Treff die Noten auf unserer Konzertbühne!',
      hide_and_seek: 'Nächstes Mal verstecke ich mich noch schlauer, versprochen!',
      baking_fest: 'Mit Extra-Belag schmeckt unser Steinofen-Gebäck doppelt gut!',
      stargazing: 'Schnell, da hinten saust eine Sternschnuppe vorbei!'
    },
    replies: [
      'Stark! Mit dir im Team macht alles doppelt Spaß! ⚡',
      'High Five! ✋ Das war spitze!',
      'Bis zum nächsten großen Abenteuer!'
    ]
  }
];

const QUICK_CHAT_LINES = [
  'Hallo! Wie geht’s dir? 😊',
  'Das macht mega Spaß heute! 🎉',
  'Wollen wir zusammen feiern? 🥳',
  'Du bist echt toll! ❤️'
];

const PARTY_TREATS = [
  { id: 'cake', icon: '🍰', label: 'Erdbeerkuchen' },
  { id: 'ice', icon: '🍦', label: 'Eisbecher' },
  { id: 'limo', icon: '🥤', label: 'Frucht-Limo' }
];

const PET_TRICKS = [
  { id: 'hoop', icon: '🦘', label: 'Reifen-Sprung', color: '#f43f5e', light: '#ffe4e6' },
  { id: 'spin', icon: '🔄', label: 'Wirbel-Drehung', color: '#f59e0b', light: '#fef3c7' },
  { id: 'paw', icon: '🐾', label: 'Pfötchen-High-Five', color: '#10b981', light: '#d1fae5' },
  { id: 'dance', icon: '🎵', label: 'Musik-Tanz', color: '#8b5cf6', light: '#ede9fe' },
  { id: 'star', icon: '🌟', label: 'Glitzer-Finale', color: '#0ea5e9', light: '#e0f2fe' }
];

const CAFE_INGREDIENTS = [
  { id: 'waffle', icon: '🧇', label: 'Herzwaffel', color: '#f59e0b', light: '#fef3c7' },
  { id: 'berry', icon: '🍓', label: 'Erdbeer-Eis', color: '#f43f5e', light: '#ffe4e6' },
  { id: 'choco', icon: '🍫', label: 'Schoko-Eis', color: '#78350f', light: '#fde68a' },
  { id: 'vanilla', icon: '🍦', label: 'Vanille-Eis', color: '#eab308', light: '#fef9c3' },
  { id: 'cherry', icon: '🍒', label: 'Kirsch-Topping', color: '#db2777', light: '#fce7f3' },
  { id: 'limo', icon: '🍋', label: 'Zitronen-Limo', color: '#0ea5e9', light: '#e0f2fe' }
];

const BAND_INSTRUMENTS = [
  { id: 'guitar', icon: '🎸', label: 'Gitarre', color: '#ec4899', light: '#fce7f3', laneX: 195 },
  { id: 'piano', icon: '🎹', label: 'Klavier', color: '#8b5cf6', light: '#ede9fe', laneX: 350 },
  { id: 'drums', icon: '🥁', label: 'Schlagzeug', color: '#f59e0b', light: '#fef3c7', laneX: 510 },
  { id: 'mic', icon: '🎤', label: 'Gesang', color: '#0ea5e9', light: '#e0f2fe', laneX: 665 }
];

const BAKE_RECIPES = [
  { id: 'cake', icon: '🍓', resultIcon: '🎂', label: 'Erdbeer-Torte', color: '#f43f5e', light: '#ffe4e6' },
  { id: 'pizza', icon: '🍅', resultIcon: '🍕', label: 'Traum-Pizza', color: '#f59e0b', light: '#fef3c7' },
  { id: 'croissant', icon: '🍫', resultIcon: '🥐', label: 'Schoko-Croissants', color: '#8b5cf6', light: '#ede9fe' }
];

export function setupEventScreen(stateManager) {
  const canvas = document.getElementById('eventCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const titleEl = document.getElementById('eventTitleEl');
  const subtitleEl = document.getElementById('eventSubtitleEl');
  const coinsValEl = document.getElementById('eventCoinsVal');
  const levelValEl = document.getElementById('eventLevelVal');
  const progressTextEl = document.getElementById('eventProgressText');
  const statusTextEl = document.getElementById('eventStatusText');
  const goalChipsEl = document.getElementById('eventGoalChips');
  const actionBarEl = document.getElementById('eventActionBar');
  const toastEl = document.getElementById('eventToast');

  const friendPillsEl = document.getElementById('eventFriendPills');
  const chatReplyLineEl = document.getElementById('eventChatReplyLine');
  const quickChatRowEl = document.getElementById('eventQuickChatRow');
  const chatInputEl = document.getElementById('eventChatInput');
  const chatSendBtn = document.getElementById('eventChatSendBtn');

  const backToMailBtn = document.getElementById('eventBackToMailBtn');
  const toHomeBtn = document.getElementById('eventToHomeBtn');
  const toTownBtn = document.getElementById('eventToTownBtn');

  const walkLeftBtn = document.getElementById('eventWalkLeftBtn');
  const walkRightBtn = document.getElementById('eventWalkRightBtn');
  const walkUpBtn = document.getElementById('eventWalkUpBtn');
  const walkDownBtn = document.getElementById('eventWalkDownBtn');
  const mainActionBtn = document.getElementById('eventMainActionBtn');

  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;

  let currentEvent = null;
  let eventCompleted = false;
  let score = 0;
  let goal = 6;
  let celebrationTimer = 0;
  let rewardSummaryText = '';

  const player = {
    x: 430,
    y: 356,
    facing: 1,
    waypoints: [],
    pendingCallback: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  let eventFriends = [];
  let activeChatFriendId = 'frieda';
  const chattedFriendIds = new Set();

  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  const petFollowers = new PetFollowerController();
  const particles = [];
  const waterDrops = [];

  let partyState = null;
  let tripState = null;
  let raceState = null;
  let petShowState = null;
  let gardenState = null;
  let cafeState = null;
  let treasureState = null;
  let bandState = null;
  let hideState = null;
  let bakeState = null;
  let starState = null;

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3400);
  }

  function setStatus(msg) {
    if (statusTextEl) statusTextEl.textContent = msg;
  }

  function spawnFX(kind, x, y, count = 10) {
    const colors = kind === 'heart'
      ? ['#f43f5e', '#fb7185', '#fbcfe8']
      : kind === 'water'
        ? ['#38bdf8', '#7dd3fc', '#e0f2fe']
        : ['#fde047', '#f472b6', '#34d399', '#38bdf8', '#a855f7'];
    for (let i = 0; i < count; i++) {
      particles.push({
        kind,
        color: colors[i % colors.length],
        x: x + (Math.random() - 0.5) * 44,
        y: y + (Math.random() - 0.5) * 26,
        vx: (Math.random() - 0.5) * 3.2,
        vy: -1.4 - Math.random() * 2.4,
        size: 5 + Math.random() * 5,
        life: 58
      });
    }
  }

  function refreshHeaderStats() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (levelValEl) levelValEl.textContent = ShopManager.getStats().level;
    if (progressTextEl) {
      progressTextEl.textContent = eventCompleted ? '🏆 Geschafft!' : `${score} / ${goal}`;
    }
  }

  function createEventFriends(kind) {
    const startSlots = kind === 'race'
      ? [
          { x: 180, y: 215, minX: 80, maxX: 740, minY: 205, maxY: 222, lane: false },
          { x: 350, y: 215, minX: 80, maxX: 740, minY: 205, maxY: 222, lane: false },
          { x: 560, y: 215, minX: 80, maxX: 740, minY: 205, maxY: 222, lane: false },
          { x: 120, y: 424, minX: 120, maxX: 760, minY: 424, maxY: 424, lane: 'mia' },
          { x: 120, y: 354, minX: 120, maxX: 760, minY: 354, maxY: 354, lane: 'leo' }
        ]
      : kind === 'cafe_contest'
        ? [
            { x: 190, y: 375, minX: 110, maxX: 280, minY: 330, maxY: 430 },
            { x: 330, y: 392, minX: 250, maxX: 420, minY: 330, maxY: 435 },
            { x: 520, y: 386, minX: 440, maxX: 610, minY: 330, maxY: 435 },
            { x: 675, y: 375, minX: 590, maxX: 760, minY: 330, maxY: 430 },
            { x: 430, y: 352, minX: 340, maxX: 520, minY: 325, maxY: 420 }
          ]
        : kind === 'band_jam'
          ? [
              { x: 135, y: 248, minX: 90, maxX: 210, minY: 225, maxY: 270 },
              { x: 285, y: 242, minX: 230, maxX: 360, minY: 225, maxY: 268 },
              { x: 430, y: 238, minX: 375, maxX: 490, minY: 220, maxY: 265 },
              { x: 575, y: 242, minX: 505, maxX: 645, minY: 225, maxY: 268 },
              { x: 725, y: 248, minX: 655, maxX: 785, minY: 225, maxY: 270 }
            ]
          : [
              { x: 150, y: 292, minX: 65, maxX: 260, minY: 235, maxY: 425 },
              { x: 300, y: 274, minX: 210, maxX: 410, minY: 230, maxY: 420 },
              { x: 555, y: 276, minX: 450, maxX: 650, minY: 230, maxY: 420 },
              { x: 710, y: 295, minX: 610, maxX: 800, minY: 235, maxY: 425 },
              { x: 430, y: 255, minX: 310, maxX: 550, minY: 225, maxY: 395 }
            ];

    return FRIEND_TEMPLATES.map((tpl, idx) => {
      const slot = startSlots[idx];
      const matchedConfig = {
        ...tpl.config,
        body: {
          ...tpl.config.body,
          height: PlayerConfig.body.height || 1.0,
          width: PlayerConfig.body.width || 1.0
        }
      };
      return {
        ...tpl,
        config: matchedConfig,
        x: slot.x,
        y: slot.y,
        tx: slot.x,
        ty: slot.y,
        bounds: slot,
        lane: slot.lane || false,
        facing: idx % 2 === 0 ? 1 : -1,
        pose: 'idle',
        waitTimer: 20 + idx * 18,
        speechText: '',
        speechTimer: 0,
        want: PARTY_TREATS[idx % PARTY_TREATS.length],
        served: false,
        hiddenInSpot: kind === 'hide_and_seek',
        bounce: 0
      };
    });
  }

  function renderFriendChatBar() {
    if (friendPillsEl) {
      friendPillsEl.innerHTML = '';
      eventFriends.forEach((f) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `event-friend-pill${activeChatFriendId === f.id ? ' active' : ''}`;
        btn.textContent = `${f.icon} ${f.name}`;
        btn.addEventListener('click', () => selectFriendToTalk(f.id, true));
        friendPillsEl.appendChild(btn);
      });
    }

    if (quickChatRowEl) {
      quickChatRowEl.innerHTML = '';
      QUICK_CHAT_LINES.forEach((line) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mail-phrase-btn';
        btn.textContent = line;
        btn.addEventListener('click', () => sayToFriend(line));
        quickChatRowEl.appendChild(btn);
      });
    }
  }

  function selectFriendToTalk(friendId, walkOver = false) {
    const f = eventFriends.find((fr) => fr.id === friendId) || eventFriends[0];
    if (!f) return;
    activeChatFriendId = f.id;
    renderFriendChatBar();

    const kind = currentEvent?.kind || 'party';
    const greeting = f.greetings[kind] || f.greetings.party;

    const triggerGreeting = () => {
      f.facing = player.x < f.x ? -1 : 1;
      player.facing = f.x >= player.x ? 1 : -1;
      f.speechText = greeting;
      f.speechTimer = 210;
      f.waitTimer = 140;
      f.pose = 'idle';
      if (chatReplyLineEl) {
        chatReplyLineEl.textContent = `${f.icon} ${f.name}: „${greeting}“`;
      }
    };

    if (walkOver && currentEvent?.kind !== 'race') {
      const standX = Math.max(40, Math.min(820, f.x + (player.x < f.x ? -52 : 52)));
      const standY = Math.max(210, Math.min(440, f.y + 4));
      navigateToPoint(standX, standY, triggerGreeting);
    } else {
      triggerGreeting();
    }
  }

  function sayToFriend(rawText) {
    const text = (rawText || '').trim();
    if (!text) return;
    const f = eventFriends.find((fr) => fr.id === activeChatFriendId) || eventFriends[0];
    if (!f) return;

    player.speechText = text.length > 42 ? `${text.slice(0, 39)}…` : text;
    player.speechTimer = 175;
    player.facing = f.x >= player.x ? 1 : -1;
    player.pose = 'pet';
    player.poseTimer = 24;

    const reply = f.replies[Math.floor(Math.random() * f.replies.length)];
    f.facing = player.x < f.x ? -1 : 1;
    f.speechText = reply;
    f.speechTimer = 210;
    f.waitTimer = 130;
    f.bounce = 20;

    spawnFX('heart', f.x, f.y - 95, 8);
    if (chatReplyLineEl) {
      chatReplyLineEl.textContent = `💬 Du: „${text}“  →  ${f.icon} ${f.name}: „${reply}“`;
    }

    if (!chattedFriendIds.has(f.id)) {
      chattedFriendIds.add(f.id);
      ShopManager.addCoins(2);
      refreshHeaderStats();
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
      showToast(`💬 Schönes Gespräch mit ${f.name}! +2 🪙`, 'success');
    }
  }

  function completeCurrentEvent() {
    if (eventCompleted || !currentEvent) return;
    eventCompleted = true;
    celebrationTimer = 260;

    eventFriends.forEach((f) => {
      f.pose = 'jump';
      f.speechText = '🎉 Hurra!';
      f.speechTimer = 220;
    });

    const res = MailboxManager.completeEvent(currentEvent.eventId, currentEvent.reward || 28);
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));

    const lvlNote = res.levelUpBonus > 0 ? ` + ${res.levelUpBonus} 🪙 Level-Up!` : '';
    rewardSummaryText = `+${res.coinsEarned} 🪙 erhalten${lvlNote}`;

    for (let i = 0; i < 5; i++) {
      spawnFX('confetti', 150 + i * 140, 140, 14);
    }

    refreshHeaderStats();
    renderGoalChips();
    renderActionButtons();
    setStatus(`🎉 Fantastisch! „${currentEvent.title}“ zusammen geschafft (${rewardSummaryText})!`);
    showToast(`🏆 Event geschafft! ${rewardSummaryText}`, 'success');
  }

  function initActivity(payload = {}) {
    const act = payload.activity || { kind: 'party', theme: 'garden_party', title: 'Freunde-Party', reward: 26 };
    currentEvent = {
      eventId: payload.eventId || `evt_${act.kind}_${act.theme}`,
      title: payload.title || act.title || 'Gemeinsames Event',
      kind: act.kind || 'party',
      theme: act.theme || 'garden_party',
      reward: act.reward || 26,
      senderName: payload.senderName || 'Freunde'
    };

    eventCompleted = false;
    celebrationTimer = 0;
    rewardSummaryText = '';
    score = 0;
    particles.length = 0;
    waterDrops.length = 0;
    chattedFriendIds.clear();

    player.x = 430;
    player.y = 356;
    player.facing = 1;
    player.waypoints = [];
    player.pendingCallback = null;
    player.pose = 'idle';
    player.poseTimer = 0;
    player.speechText = '';
    player.speechTimer = 0;
    petFollowers.reset(player.x, player.y + 4);

    eventFriends = createEventFriends(currentEvent.kind);
    activeChatFriendId = eventFriends[0].id;

    if (titleEl) titleEl.textContent = `🎉 ${currentEvent.title}`;

    partyState = null;
    tripState = null;
    raceState = null;
    petShowState = null;
    gardenState = null;
    cafeState = null;
    treasureState = null;
    bandState = null;
    hideState = null;
    bakeState = null;
    starState = null;

    if (currentEvent.kind === 'party') {
      goal = 8;
      if (subtitleEl) subtitleEl.textContent = 'Lass Ballons platzen, bediene Freunde, tanzt zusammen & unterhalte dich mit allen!';
      partyState = {
        danceTimer: 0,
        balloons: [
          { x: 140, y: 155, color: '#f43f5e', vy: -0.35, popTimer: 0 },
          { x: 310, y: 132, color: '#38bdf8', vy: -0.45, popTimer: 0 },
          { x: 520, y: 150, color: '#fbbf24', vy: -0.32, popTimer: 0 },
          { x: 700, y: 138, color: '#a855f7', vy: -0.4, popTimer: 0 }
        ]
      };
      setStatus('🥳 Tippe auf Ballons, bring Freunden Kuchen/Eis/Limo oder tippe einen Freund an zum Sprechen!');
    } else if (currentEvent.kind === 'trip') {
      goal = 6;
      const isBeach = currentEvent.theme === 'beach';
      const isIce = currentEvent.theme === 'ice';
      const isGarden = currentEvent.theme === 'garden';
      if (subtitleEl) {
        subtitleEl.textContent = isBeach
          ? 'Sammle am Strand Muscheln & Seesterne, sprich mit deinen Freunden und macht ein Picknick!'
          : isIce
            ? 'Sammle Eiskristalle, plaudert zusammen und baut einen großen Schneemann!'
            : 'Sammle Schätze in der Natur, redet miteinander und deckt die Picknick-Decke!';
      }
      const itemIcon = isBeach ? '🐚' : isIce ? '❄️' : isGarden ? '🌸' : '🍓';
      const itemLabel = isBeach ? 'Muschel' : isIce ? 'Kristall' : isGarden ? 'Blüte' : 'Waldbeere';
      tripState = {
        itemIcon,
        itemLabel,
        picnicReady: false,
        picnicSpot: { x: 430, y: 326 },
        items: [
          { x: 110, y: 318, collected: false, icon: isBeach ? '🐚' : isIce ? '💎' : '🍓' },
          { x: 245, y: 410, collected: false, icon: isBeach ? '⭐' : isIce ? '❄️' : '🍄' },
          { x: 615, y: 406, collected: false, icon: isBeach ? '🐚' : isIce ? '💎' : '🌸' },
          { x: 755, y: 316, collected: false, icon: isBeach ? '🦀' : isIce ? '⛄' : '🦋' },
          { x: 430, y: 238, collected: false, icon: itemIcon }
        ]
      };
      setStatus(`🚌 Sammle alle 5 ${itemLabel}-Schätze ein und sprich gerne mit deinen Freunden!`);
    } else if (currentEvent.kind === 'race') {
      goal = 100;
      player.x = 120;
      player.y = 285;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Tippe schnell auf „⚡ Sprinten!“ und schnapp dir goldene Boost-Sterne auf deiner Bahn!';
      raceState = {
        myDist: 0,
        leoDist: 0,
        miaDist: 0,
        boostStars: [
          { x: 300, y: 266, active: true },
          { x: 520, y: 266, active: true },
          { x: 710, y: 266, active: true }
        ],
        turboTimer: 0
      };
      setStatus('🏃 Auf die Plätze, fertig, LOS! Tippe schnell auf „⚡ Sprinten!“ oder auf Sterne!');
    } else if (currentEvent.kind === 'pet_show') {
      goal = 5;
      player.x = 390;
      player.y = 358;
      if (subtitleEl) subtitleEl.textContent = 'Führe zusammen mit Bello & deinen Tieren 5 Show-Tricks für deine Freunde vor!';
      petShowState = {
        currentTrickIdx: 0,
        belloX: 468,
        belloY: 360,
        trickAnim: 0,
        trickId: '',
        juryScoreTimer: 0
      };
      setStatus(`🐕 Nächster Show-Trick: ${PET_TRICKS[0].icon} ${PET_TRICKS[0].label}!`);
    } else if (currentEvent.kind === 'garden_contest') {
      goal = 6;
      if (subtitleEl) subtitleEl.textContent = 'Pflege und gieße alle 6 Blumenbeete, während deine Freunde vorbeispazieren!';
      gardenState = {
        beds: [
          { x: 155, y: 266, stage: 0, flower: '🌹' },
          { x: 430, y: 248, stage: 0, flower: '🌻' },
          { x: 705, y: 266, stage: 0, flower: '🌷' },
          { x: 185, y: 396, stage: 0, flower: '🌺' },
          { x: 430, y: 412, stage: 0, flower: '🌼' },
          { x: 685, y: 396, stage: 0, flower: '🌸' }
        ]
      };
      setStatus('🌱 Tippe auf die 6 Blumenbeete (oder auf einen Freund, um mit ihm zu sprechen)!');
    } else if (currentEvent.kind === 'cafe_contest') {
      goal = 4;
      player.x = 430;
      player.y = 212;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Stelle 4 Meisterschafts-Eis & Waffel-Kreationen für deine Freunde zusammen!';
      cafeState = {
        order: pickCafeOrder(),
        tray: [],
        roundsDone: 0
      };
      setStatus('🍦 Tippe auf die Zutaten passend zur Jury-Bestellung!');
    } else if (currentEvent.kind === 'treasure_hunt') {
      goal = 4;
      if (subtitleEl) subtitleEl.textContent = 'Folge deinem Schatz-Radar (🔥 Heiß / ❄️ Kalt) & grab die 4 echten Piraten-Schätze aus!';
      const spots = [
        { x: 130, y: 295, dug: false, reward: '💎', name: 'Funkel-Diamant', isReal: true },
        { x: 265, y: 402, dug: false, reward: '🥾', name: 'Alter Piraten-Stiefel', isReal: false },
        { x: 380, y: 262, dug: false, reward: '👑', name: 'Goldene Insel-Krone', isReal: true },
        { x: 495, y: 408, dug: false, reward: '🦀', name: 'Zwicker-Krabbe', isReal: false },
        { x: 615, y: 278, dug: false, reward: '🪙', name: 'Goldmünzen-Truhe', isReal: true },
        { x: 755, y: 392, dug: false, reward: '🧭', name: 'Zauber-Kompass', isReal: true },
        { x: 735, y: 258, dug: false, reward: '🐚', name: 'Singende Muschel', isReal: false }
      ];
      // Shuffle positions slightly by swapping rewards randomly so every hunt feels fresh!
      for (let i = spots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmpR = spots[i].reward;
        const tmpN = spots[i].name;
        const tmpReal = spots[i].isReal;
        spots[i].reward = spots[j].reward;
        spots[i].name = spots[j].name;
        spots[i].isReal = spots[j].isReal;
        spots[j].reward = tmpR;
        spots[j].name = tmpN;
        spots[j].isReal = tmpReal;
      }
      treasureState = {
        spots,
        lastFoundMsg: ''
      };
      setStatus('🗺️ Lauf über den Strand! Je näher ein echter Schatz ist, desto heißer leuchtet dein Radar!');
    } else if (currentEvent.kind === 'band_jam') {
      goal = 8;
      player.x = 430;
      player.y = 335;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Triff die bunten Musik-Noten, wenn sie auf deine 4 Bühnen-Instrumente fallen!';
      bandState = {
        notes: [
          { laneIdx: 0, y: 120, speed: 1.55, icon: '🎵' },
          { laneIdx: 2, y: 45, speed: 1.55, icon: '🎶' }
        ],
        spawnTick: 0,
        combo: 0,
        stageFlashTimer: 0,
        activeLane: -1
      };
      setStatus('🎶 Tippe auf 🎸 🎹 🥁 🎤 im Takt der fallenden Noten!');
    } else if (currentEvent.kind === 'hide_and_seek') {
      goal = 5;
      player.x = 430;
      player.y = 385;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Finde alle 5 versteckten Freunde im Zauberwald! Achte auf wackelnde Verstecke & „Kicher!“-Rufe!';
      const spots = [
        { id: 'bush_l', x: 135, y: 270, icon: '🌿', label: 'Blütenbusch', checked: false, friendId: null },
        { id: 'tree_l', x: 280, y: 246, icon: '🌳', label: 'Hohle Eiche', checked: false, friendId: null },
        { id: 'tent', x: 445, y: 252, icon: '⛺', label: 'Wald-Zelt', checked: false, friendId: null },
        { id: 'hay', x: 610, y: 258, icon: '🍄', label: 'Pilzhütte', checked: false, friendId: null },
        { id: 'barrel', x: 745, y: 292, icon: '🪵', label: 'Baumstamm', checked: false, friendId: null },
        { id: 'bush_r', x: 185, y: 400, icon: '🌺', label: 'Rosenhecke', checked: false, friendId: null },
        { id: 'rock', x: 690, y: 404, icon: '🪨', label: 'Moosstein', checked: false, friendId: null }
      ];
      const shuffledSpots = [...spots].sort(() => Math.random() - 0.5);
      eventFriends.forEach((f, idx) => {
        const sp = shuffledSpots[idx];
        sp.friendId = f.id;
        f.x = sp.x;
        f.y = sp.y + 8;
        f.tx = sp.x;
        f.ty = sp.y + 8;
        f.hiddenInSpot = true;
      });
      hideState = { spots };
      setStatus('🙈 Wer kichert da hinter den Büschen? Tippe auf ein Versteck oder lauf hin!');
    } else if (currentEvent.kind === 'baking_fest') {
      goal = 3;
      player.x = 430;
      player.y = 338;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Rühre den Teig, backe genau in der grünen Ofen-Zone & serviere 3 Leckereien!';
      bakeState = {
        recipeIdx: 0,
        step: 0, // 0: stir (0..3), 1: oven gauge, 2: decorate
        stirCount: 0,
        ovenCursor: 15,
        ovenDir: 1,
        bakedGood: false
      };
      setStatus('🥣 Schritt 1: Tippe 3x auf „Teig rühren!“ für die Erdbeer-Torte!');
    } else if (currentEvent.kind === 'stargazing') {
      goal = 6;
      player.x = 430;
      player.y = 345;
      petFollowers.reset(player.x, player.y + 4);
      if (subtitleEl) subtitleEl.textContent = 'Zünde schwebende Himmels-Laternen an & fang funkelnde Sternschnuppen für deine Wünsche!';
      starState = {
        lanterns: [],
        shootingStars: [
          { x: 140, y: 78, vx: 3.1, vy: 1.0, active: true },
          { x: 520, y: 58, vx: 2.8, vy: 1.15, active: true }
        ],
        lanternSpots: [
          { x: 170, y: 315, lit: false },
          { x: 430, y: 295, lit: false },
          { x: 695, y: 315, lit: false }
        ],
        starsCaught: 0,
        lanternsLit: 0,
        spawnTick: 0
      };
      setStatus('🌠 Tippe auf eine fallende Sternschnuppe am Himmel oder zünde eine Laterne am Boden an!');
    }

    refreshHeaderStats();
    renderGoalChips();
    renderActionButtons();
    renderFriendChatBar();
    if (chatReplyLineEl) {
      chatReplyLineEl.textContent = '💬 Tippe auf einen Freund im Bild oder wähle oben jemanden zum Sprechen!';
    }
  }

  function pickCafeOrder() {
    const pool = [...CAFE_INGREDIENTS];
    const picked = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx].id);
    }
    return picked;
  }

  function renderGoalChips() {
    if (!goalChipsEl || !currentEvent) return;
    if (eventCompleted) {
      goalChipsEl.innerHTML = `<span class="cone-scoop-chip" style="--scoop:#10b981;--scoop-light:#d1fae5;">🏆 Event abgeschlossen! ${rewardSummaryText}</span>`;
      return;
    }

    if (currentEvent.kind === 'cafe_contest' && cafeState) {
      const wanted = cafeState.order.map((id) => CAFE_INGREDIENTS.find((c) => c.id === id));
      const built = cafeState.tray.map((id) => CAFE_INGREDIENTS.find((c) => c.id === id));
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#ec4899;--scoop-light:#fce7f3;">
          🏆 Jury-Wunsch (${cafeState.roundsDone + 1}/4): ${wanted.map((w) => w.icon).join(' + ')}
        </span>
        <span class="cone-scoop-chip" style="--scoop:#0ea5e9;--scoop-light:#e0f2fe;">
          🍽️ Dein Teller: ${built.length > 0 ? built.map((b) => b.icon).join(' ') : 'leer'}
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'pet_show' && petShowState) {
      const trick = PET_TRICKS[Math.min(PET_TRICKS.length - 1, petShowState.currentTrickIdx)];
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:${trick.color};--scoop-light:${trick.light};">
          🎯 Trick ${petShowState.currentTrickIdx + 1}/5: ${trick.icon} ${trick.label}
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'race' && raceState) {
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#10b981;--scoop-light:#d1fae5;">
          🏃 Dein Fortschritt: ${Math.min(100, Math.round(raceState.myDist))}% · Leo: ${Math.min(100, Math.round(raceState.leoDist))}%
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'treasure_hunt' && treasureState) {
      const nearest = getNearestUndugRealTreasureDist();
      const radarText = nearest === null
        ? 'Alle Schätze gefunden!'
        : nearest < 95
          ? '🔥 GANZ HEISS!'
          : nearest < 210
            ? '☀️ Warm!'
            : '❄️ Noch kalt';
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#f59e0b;--scoop-light:#fef3c7;">
          🗺️ Schätze: ${score} / ${goal}
        </span>
        <span class="cone-scoop-chip" style="--scoop:#ef4444;--scoop-light:#ffe4e6;">
          📡 Schatz-Radar: ${radarText}
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'band_jam' && bandState) {
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#8b5cf6;--scoop-light:#ede9fe;">
          🎶 Noten getroffen: ${score} / ${goal} · Combo: ${bandState.combo}x
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'hide_and_seek' && hideState) {
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#10b981;--scoop-light:#d1fae5;">
          🙈 Freunde gefunden: ${score} / ${goal}
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'baking_fest' && bakeState) {
      const rec = BAKE_RECIPES[Math.min(BAKE_RECIPES.length - 1, bakeState.recipeIdx)];
      const stepLabels = [
        `🥣 Rühren (${bakeState.stirCount}/3)`,
        '🔥 Backen (Grüne Zone treffen!)',
        '🎂 Verzieren & Servieren!'
      ];
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:${rec.color};--scoop-light:${rec.light};">
          ${rec.resultIcon} ${rec.label} (${score + 1}/3) · ${stepLabels[bakeState.step]}
        </span>
      `;
      return;
    }

    if (currentEvent.kind === 'stargazing' && starState) {
      goalChipsEl.innerHTML = `
        <span class="cone-scoop-chip" style="--scoop:#38bdf8;--scoop-light:#e0f2fe;">
          🌠 Wünsche &amp; Laternen: ${score} / ${goal} (🏮 ${starState.lanternsLit} · 🌠 ${starState.starsCaught})
        </span>
      `;
      return;
    }

    goalChipsEl.innerHTML = `
      <span class="cone-scoop-chip" style="--scoop:#a855f7;--scoop-light:#f3e8ff;">
        ✨ Fortschritt: ${score} / ${goal} Aufgaben geschafft
      </span>
    `;
  }

  function renderActionButtons() {
    if (!actionBarEl || !currentEvent) return;
    actionBarEl.innerHTML = '';

    if (eventCompleted) {
      const replayBtn = document.createElement('button');
      replayBtn.type = 'button';
      replayBtn.className = 'ice-flavor-btn ice-accept-btn';
      replayBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef08a, #f59e0b);">🔄</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Nochmal zusammen spielen!</span>
          <span class="ice-item-price">+10 🪙 Bonus</span>
        </span>
      `;
      replayBtn.addEventListener('click', () => initActivity({
        eventId: currentEvent.eventId,
        title: currentEvent.title,
        senderName: currentEvent.senderName,
        activity: {
          kind: currentEvent.kind,
          theme: currentEvent.theme,
          title: currentEvent.title,
          reward: currentEvent.reward
        }
      }));
      actionBarEl.appendChild(replayBtn);

      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'ice-flavor-btn';
      backBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #d1fae5, #10b981);">📬</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Zurück zum Briefkasten</span>
          <span class="ice-item-price">Weitere Einladungen ansehen</span>
        </span>
      `;
      backBtn.addEventListener('click', () => {
        stateManager.setState('HOME');
        window.dispatchEvent(new CustomEvent('runner:open-mailbox', { detail: { tab: 'inbox' } }));
      });
      actionBarEl.appendChild(backBtn);
      return;
    }

    if (currentEvent.kind === 'party') {
      PARTY_TREATS.forEach((tr) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ice-flavor-btn';
        btn.innerHTML = `
          <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fce7f3, #ec4899);">${tr.icon}</span>
          <span class="ice-item-meta">
            <span class="ice-item-name">${tr.label} geben</span>
            <span class="ice-item-price">Freund bedienen</span>
          </span>
        `;
        btn.addEventListener('click', () => servePartyTreat(tr.id));
        actionBarEl.appendChild(btn);
      });

      const danceBtn = document.createElement('button');
      danceBtn.type = 'button';
      danceBtn.className = 'ice-flavor-btn ice-accept-btn';
      danceBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #ede9fe, #8b5cf6);">💃</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Tanzen &amp; Konfetti!</span>
          <span class="ice-item-price">Alle tanzen mit</span>
        </span>
      `;
      danceBtn.addEventListener('click', triggerPartyDance);
      actionBarEl.appendChild(danceBtn);
    } else if (currentEvent.kind === 'trip') {
      const findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.className = 'ice-flavor-btn';
      findBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef3c7, #f59e0b);">${tripState.itemIcon}</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Nächsten Schatz suchen</span>
          <span class="ice-item-price">${tripState.itemLabel} sammeln</span>
        </span>
      `;
      findBtn.addEventListener('click', walkToNextTripItem);
      actionBarEl.appendChild(findBtn);

      const picnicBtn = document.createElement('button');
      picnicBtn.type = 'button';
      picnicBtn.className = 'ice-flavor-btn ice-accept-btn';
      const spotLabel = currentEvent.theme === 'ice' ? '⛄ Schneemann bauen' : '🧺 Picknick starten';
      picnicBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #d1fae5, #10b981);">${currentEvent.theme === 'ice' ? '⛄' : '🧺'}</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">${spotLabel}</span>
          <span class="ice-item-price">Gemeinsam feiern</span>
        </span>
      `;
      picnicBtn.addEventListener('click', triggerTripPicnic);
      actionBarEl.appendChild(picnicBtn);
    } else if (currentEvent.kind === 'race') {
      const sprintBtn = document.createElement('button');
      sprintBtn.type = 'button';
      sprintBtn.className = 'ice-flavor-btn ice-accept-btn';
      sprintBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef08a, #f59e0b);">⚡</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">SPRINTEN! (Tippen!)</span>
          <span class="ice-item-price">Schnell ins Ziel laufen</span>
        </span>
      `;
      sprintBtn.addEventListener('click', boostRaceStep);
      actionBarEl.appendChild(sprintBtn);
    } else if (currentEvent.kind === 'pet_show') {
      PET_TRICKS.forEach((tr) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ice-flavor-btn';
        btn.innerHTML = `
          <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${tr.light}, ${tr.color});">${tr.icon}</span>
          <span class="ice-item-meta">
            <span class="ice-item-name">${tr.label}</span>
            <span class="ice-item-price">Show-Trick zeigen</span>
          </span>
        `;
        btn.addEventListener('click', () => performPetTrick(tr.id));
        actionBarEl.appendChild(btn);
      });
    } else if (currentEvent.kind === 'garden_contest') {
      const waterBtn = document.createElement('button');
      waterBtn.type = 'button';
      waterBtn.className = 'ice-flavor-btn ice-accept-btn';
      waterBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #e0f2fe, #0ea5e9);">🚿</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Nächstes Beet gießen</span>
          <span class="ice-item-price">Oder direkt auf ein Beet tippen!</span>
        </span>
      `;
      waterBtn.addEventListener('click', waterNextGardenBed);
      actionBarEl.appendChild(waterBtn);
    } else if (currentEvent.kind === 'cafe_contest') {
      CAFE_INGREDIENTS.forEach((ing) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ice-flavor-btn';
        btn.innerHTML = `
          <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${ing.light}, ${ing.color});">${ing.icon}</span>
          <span class="ice-item-meta">
            <span class="ice-item-name">${ing.label}</span>
            <span class="ice-item-price">Auf den Teller legen</span>
          </span>
        `;
        btn.addEventListener('click', () => addCafeIngredient(ing.id));
        actionBarEl.appendChild(btn);
      });

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'ice-flavor-btn';
      clearBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #f1f5f9, #94a3b8);">🗑️</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Teller leeren</span>
          <span class="ice-item-price">Neu belegen</span>
        </span>
      `;
      clearBtn.addEventListener('click', () => {
        if (!cafeState) return;
        cafeState.tray = [];
        renderGoalChips();
      });
      actionBarEl.appendChild(clearBtn);
    } else if (currentEvent.kind === 'treasure_hunt') {
      const digBtn = document.createElement('button');
      digBtn.type = 'button';
      digBtn.className = 'ice-flavor-btn ice-accept-btn';
      digBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef08a, #f59e0b);">⛏️</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Nächstes X ausgraben!</span>
          <span class="ice-item-price">Oder tippe auf eine Markierung</span>
        </span>
      `;
      digBtn.addEventListener('click', digNearestTreasureSpot);
      actionBarEl.appendChild(digBtn);
    } else if (currentEvent.kind === 'band_jam') {
      BAND_INSTRUMENTS.forEach((inst, laneIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ice-flavor-btn';
        btn.innerHTML = `
          <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${inst.light}, ${inst.color});">${inst.icon}</span>
          <span class="ice-item-meta">
            <span class="ice-item-name">${inst.label} spielen!</span>
            <span class="ice-item-price">Taste ${laneIdx + 1} oder tippen</span>
          </span>
        `;
        btn.addEventListener('click', () => playBandInstrument(laneIdx));
        actionBarEl.appendChild(btn);
      });
    } else if (currentEvent.kind === 'hide_and_seek') {
      const peekBtn = document.createElement('button');
      peekBtn.type = 'button';
      peekBtn.className = 'ice-flavor-btn ice-accept-btn';
      peekBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #d1fae5, #10b981);">🔍</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Nächstes Versteck absuchen!</span>
          <span class="ice-item-price">Oder direkt auf einen Busch tippen</span>
        </span>
      `;
      peekBtn.addEventListener('click', searchNearestHideSpot);
      actionBarEl.appendChild(peekBtn);
    } else if (currentEvent.kind === 'baking_fest') {
      const rec = BAKE_RECIPES[Math.min(BAKE_RECIPES.length - 1, bakeState.recipeIdx)];
      const stepBtns = [
        { step: 0, icon: '🥣', title: 'Teig rühren!', sub: `${bakeState.stirCount}/3 gerührt` },
        { step: 1, icon: '🔥', title: 'Aus dem Ofen holen!', sub: 'Im grünen Bereich tippen!' },
        { step: 2, icon: rec.resultIcon, title: `${rec.label} servieren!`, sub: 'Verzieren & teilen' }
      ];
      stepBtns.forEach((sb) => {
        const isCurrent = bakeState.step === sb.step;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ice-flavor-btn${isCurrent ? ' ice-accept-btn' : ''}`;
        btn.innerHTML = `
          <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, ${rec.light}, ${rec.color});">${sb.icon}</span>
          <span class="ice-item-meta">
            <span class="ice-item-name">${sb.title}</span>
            <span class="ice-item-price">${sb.sub}</span>
          </span>
        `;
        btn.addEventListener('click', () => doBakeStep(sb.step));
        actionBarEl.appendChild(btn);
      });
    } else if (currentEvent.kind === 'stargazing') {
      const lanternBtn = document.createElement('button');
      lanternBtn.type = 'button';
      lanternBtn.className = 'ice-flavor-btn';
      lanternBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #fef3c7, #f59e0b);">🏮</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Himmels-Laterne anzünden</span>
          <span class="ice-item-price">Schwebt in den Nachthimmel</span>
        </span>
      `;
      lanternBtn.addEventListener('click', lightNextLantern);
      actionBarEl.appendChild(lanternBtn);

      const wishBtn = document.createElement('button');
      wishBtn.type = 'button';
      wishBtn.className = 'ice-flavor-btn ice-accept-btn';
      wishBtn.innerHTML = `
        <span class="ice-item-icon" style="background:radial-gradient(circle at 30% 30%, #e0f2fe, #38bdf8);">🌠</span>
        <span class="ice-item-meta">
          <span class="ice-item-name">Sternschnuppe fangen!</span>
          <span class="ice-item-price">Einen Wunsch machen</span>
        </span>
      `;
      wishBtn.addEventListener('click', catchAnyShootingStar);
      actionBarEl.appendChild(wishBtn);
    }
  }

  function spawnGardenWaterDrops(fromX, fromY, targetX, targetY) {
    for (let i = 0; i < 12; i++) {
      waterDrops.push({
        x: fromX + (Math.random() - 0.5) * 4,
        y: fromY - i * 1.4,
        vx: (targetX - fromX) * 0.055 + (Math.random() - 0.5) * 0.4,
        vy: 1.4 + Math.random() * 1.1,
        targetY,
        life: 34
      });
    }
  }

  function hitsEventProp(x, y) {
    if (partyState && x >= 340 && x <= 520 && y >= 190 && y <= 228) return true;
    if (bakeState) {
      if (x >= 210 && x <= 400 && y >= 250 && y <= 324) return true;
      if (x >= 468 && x <= 612 && y >= 198 && y <= 318) return true;
    }
    if (cafeState && x >= 115 && x <= 745 && y >= 220 && y <= 284) return true;
    return false;
  }

  function hitsEventFriend(x, y) {
    if (currentEvent?.kind === 'race') return false;
    for (let i = 0; i < eventFriends.length; i++) {
      const f = eventFriends[i];
      if (!f.hiddenInSpot && Math.hypot(x - f.x, y - f.y) < 32) return true;
    }
    return false;
  }

  function navigateToPoint(tx, ty, cb = null) {
    let gx = Math.max(40, Math.min(820, tx));
    let gy = Math.max(200, Math.min(445, ty));
    if (hitsEventProp(gx, gy)) {
      gy = bakeState ? 342 : cafeState ? 302 : 242;
    }
    player.waypoints = [{ x: gx, y: gy }];
    player.pendingCallback = cb;
  }

  function servePartyTreat(treatId) {
    if (!partyState || eventCompleted) return;
    const guest = eventFriends.find((g) => !g.served && g.want.id === treatId)
      || eventFriends.find((g) => !g.served);
    if (!guest) {
      triggerPartyDance();
      return;
    }
    navigateToPoint(guest.x + (player.x < guest.x ? -48 : 48), guest.y + 6, () => {
      guest.served = true;
      guest.bounce = 24;
      guest.speechText = `Mmmh, danke für ${guest.want.label}! ❤️`;
      guest.speechTimer = 170;
      player.facing = guest.x >= player.x ? 1 : -1;
      player.pose = 'pet';
      player.poseTimer = 24;
      score = Math.min(goal, score + 1);
      spawnFX('heart', guest.x, guest.y - 75, 10);
      showToast(`🍰 ${guest.name}: „Danke für ${guest.want.label}!“`, 'success');
      refreshHeaderStats();
      renderGoalChips();
      if (score >= goal) completeCurrentEvent();
    });
  }

  function triggerPartyDance() {
    if (!partyState || eventCompleted) return;
    partyState.danceTimer = 46;
    eventFriends.forEach((g) => {
      g.bounce = 26;
      g.pose = 'jump';
    });
    player.pose = 'jump';
    player.poseTimer = 32;
    score = Math.min(goal, score + 1);
    spawnFX('confetti', player.x, player.y - 60, 14);
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) completeCurrentEvent();
  }

  function walkToNextTripItem() {
    if (!tripState || eventCompleted) return;
    const item = tripState.items.find((it) => !it.collected);
    if (!item) {
      triggerTripPicnic();
      return;
    }
    navigateToPoint(item.x, item.y, () => collectTripItem(item));
  }

  function collectTripItem(item) {
    if (!tripState || item.collected || eventCompleted) return;
    item.collected = true;
    score = Math.min(goal, score + 1);
    player.pose = 'pet';
    player.poseTimer = 22;
    spawnFX('confetti', item.x, item.y - 14, 10);
    eventFriends.forEach((f, idx) => { if (idx % 2 === score % 2) f.bounce = 14; });
    showToast(`✨ ${item.icon} gefunden! (${score}/${goal})`, 'success');
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) completeCurrentEvent();
  }

  function triggerTripPicnic() {
    if (!tripState || eventCompleted) return;
    const remaining = tripState.items.filter((it) => !it.collected).length;
    if (remaining > 0) {
      showToast(`✨ Such erst noch die restlichen ${remaining} Schätze!`, 'info');
      walkToNextTripItem();
      return;
    }
    navigateToPoint(tripState.picnicSpot.x, tripState.picnicSpot.y + 34, () => {
      tripState.picnicReady = true;
      score = goal;
      spawnFX('heart', tripState.picnicSpot.x, tripState.picnicSpot.y - 20, 14);
      refreshHeaderStats();
      renderGoalChips();
      completeCurrentEvent();
    });
  }

  function boostRaceStep() {
    if (!raceState || eventCompleted) return;
    raceState.myDist = Math.min(100, raceState.myDist + (raceState.turboTimer > 0 ? 11 : 7));
    player.pose = 'run';
    player.poseTimer = 18;
    spawnFX('confetti', player.x + 10, player.y - 30, 5);
    score = Math.round(raceState.myDist);
    refreshHeaderStats();
    renderGoalChips();
    if (raceState.myDist >= 100) {
      completeCurrentEvent();
    }
  }

  function performPetTrick(trickId) {
    if (!petShowState || eventCompleted) return;
    const expected = PET_TRICKS[petShowState.currentTrickIdx];
    if (!expected) return;
    if (trickId !== expected.id) {
      showToast(`🐕 Die Jury wünscht sich gerade: ${expected.icon} ${expected.label}!`, 'warn');
      return;
    }
    petShowState.trickAnim = 40;
    petShowState.trickId = trickId;
    petShowState.juryScoreTimer = 55;
    player.pose = 'jump';
    player.poseTimer = 28;
    score += 1;
    petShowState.currentTrickIdx += 1;
    spawnFX('heart', petShowState.belloX, petShowState.belloY - 30, 12);
    showToast(`⭐ Freunde rufen: „10/10 für ${expected.label}!“`, 'success');
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) {
      completeCurrentEvent();
    } else {
      const next = PET_TRICKS[petShowState.currentTrickIdx];
      setStatus(`🐕 Nächster Show-Trick: ${next.icon} ${next.label}!`);
    }
  }

  function waterNextGardenBed() {
    if (!gardenState || eventCompleted) return;
    const bed = gardenState.beds.find((b) => b.stage === 0);
    if (!bed) return;
    navigateToPoint(bed.x, bed.y + 30, () => bloomGardenBed(bed));
  }

  function bloomGardenBed(bed) {
    if (!gardenState || bed.stage >= 1 || eventCompleted) return;
    bed.stage = 1;
    score += 1;
    player.facing = bed.x >= player.x ? 1 : -1;
    player.pose = 'water';
    player.poseTimer = 28;
    spawnGardenWaterDrops(player.x + player.facing * 20, player.y - 36, bed.x, bed.y + 4);
    eventFriends.forEach((f, idx) => { if (idx % 2 === score % 2) f.bounce = 14; });
    showToast(`${bed.flower} Wundervoll! Das Blumenbeet blüht! (${score}/${goal})`, 'success');
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) completeCurrentEvent();
  }

  function addCafeIngredient(ingId) {
    if (!cafeState || eventCompleted) return;
    if (cafeState.tray.length >= cafeState.order.length) {
      cafeState.tray = [];
    }
    cafeState.tray.push(ingId);
    player.pose = 'cook';
    player.poseTimer = 18;
    spawnFX('confetti', player.x, player.y - 40, 6);

    const a = [...cafeState.tray].sort();
    const b = [...cafeState.order].sort();
    if (cafeState.tray.length === cafeState.order.length) {
      if (a.every((val, i) => val === b[i])) {
        cafeState.roundsDone += 1;
        score = cafeState.roundsDone;
        cafeState.tray = [];
        spawnFX('heart', 430, 180, 12);
        if (score >= goal) {
          refreshHeaderStats();
          renderGoalChips();
          completeCurrentEvent();
          return;
        }
        cafeState.order = pickCafeOrder();
        showToast(`🏆 Jury begeistert! Runde ${score}/${goal} geschafft!`, 'success');
      } else {
        cafeState.tray = [];
        showToast('🍨 Fast! Schau nochmal genau auf die gewünschten Symbole.', 'warn');
      }
    }
    refreshHeaderStats();
    renderGoalChips();
  }

  function getNearestUndugRealTreasureDist() {
    if (!treasureState) return null;
    let best = Infinity;
    treasureState.spots.forEach((sp) => {
      if (!sp.dug && sp.isReal) {
        const d = Math.hypot(player.x - sp.x, player.y - sp.y);
        if (d < best) best = d;
      }
    });
    return best === Infinity ? null : best;
  }

  function digSpot(sp) {
    if (!treasureState || sp.dug || eventCompleted) return;
    sp.dug = true;
    player.pose = 'pet';
    player.poseTimer = 24;
    if (sp.isReal) {
      score += 1;
      spawnFX('confetti', sp.x, sp.y - 16, 14);
      eventFriends.forEach((f) => { f.bounce = 20; });
      showToast(`💎 Schatz gefunden: ${sp.reward} ${sp.name}! (${score}/${goal})`, 'success');
      if (score >= goal) completeCurrentEvent();
    } else {
      spawnFX('water', sp.x, sp.y - 10, 8);
      showToast(`😅 Hier war nur: ${sp.reward} ${sp.name}! Such weiter mit dem Radar!`, 'info');
    }
    refreshHeaderStats();
    renderGoalChips();
  }

  function digNearestTreasureSpot() {
    if (!treasureState || eventCompleted) return;
    let best = null;
    let bestD = Infinity;
    treasureState.spots.forEach((sp) => {
      if (!sp.dug) {
        const d = Math.hypot(player.x - sp.x, player.y - sp.y);
        if (d < bestD) { bestD = d; best = sp; }
      }
    });
    if (best) {
      navigateToPoint(best.x, best.y + 18, () => digSpot(best));
    }
  }

  function playBandInstrument(laneIdx) {
    if (!bandState || eventCompleted) return;
    const inst = BAND_INSTRUMENTS[laneIdx];
    if (!inst) return;

    bandState.activeLane = laneIdx;
    bandState.stageFlashTimer = 14;
    player.pose = 'jump';
    player.poseTimer = 18;

    // Look for a note close to the hit line (y between 255 and 385)
    let hitNoteIdx = -1;
    let bestDist = Infinity;
    bandState.notes.forEach((n, idx) => {
      if (n.laneIdx === laneIdx && n.y >= 245 && n.y <= 395) {
        const d = Math.abs(n.y - 325);
        if (d < bestDist) { bestDist = d; hitNoteIdx = idx; }
      }
    });

    if (hitNoteIdx >= 0) {
      bandState.notes.splice(hitNoteIdx, 1);
      score += 1;
      bandState.combo += 1;
      eventFriends.forEach((f) => { f.bounce = 22; f.pose = 'jump'; });
      spawnFX('confetti', inst.laneX, 325, 14);
      showToast(`${inst.icon} Perfekter Treffer! (${score}/${goal})`, 'success');
      refreshHeaderStats();
      renderGoalChips();
      if (score >= goal) completeCurrentEvent();
    } else {
      // Friendly hit-assist if note is close on another lane or missed timing
      bandState.combo = 0;
      spawnFX('water', inst.laneX, 325, 5);
      showToast(`${inst.icon} Klingt super! Achte genau auf die Note im Leucht-Kreis!`, 'info');
      renderGoalChips();
    }
  }

  function checkHideSpot(sp) {
    if (!hideState || sp.checked || eventCompleted) return;
    sp.checked = true;
    player.pose = 'pet';
    player.poseTimer = 22;
    if (sp.friendId) {
      const f = eventFriends.find((fr) => fr.id === sp.friendId);
      if (f) {
        f.hiddenInSpot = false;
        f.bounce = 28;
        f.speechText = 'Erwischt! 😄';
        f.speechTimer = 180;
        f.tx = Math.max(70, Math.min(790, f.x + (Math.random() - 0.5) * 80));
        f.ty = 340 + Math.random() * 50;
      }
      score += 1;
      spawnFX('heart', sp.x, sp.y - 24, 12);
      showToast(`🎉 ${f ? f.name : 'Freund'} hinter ${sp.label} gefunden! (${score}/${goal})`, 'success');
      refreshHeaderStats();
      renderGoalChips();
      if (score >= goal) completeCurrentEvent();
    } else {
      spawnFX('water', sp.x, sp.y - 14, 6);
      showToast(`🌿 Hinter ${sp.label} war niemand — such weiter!`, 'info');
    }
  }

  function searchNearestHideSpot() {
    if (!hideState || eventCompleted) return;
    const unvisited = hideState.spots.filter((s) => !s.checked);
    const preferred = unvisited.find((s) => s.friendId) || unvisited[0];
    if (preferred) {
      navigateToPoint(preferred.x, preferred.y + 32, () => checkHideSpot(preferred));
    }
  }

  function doBakeStep(clickedStep = null) {
    if (!bakeState || eventCompleted) return;
    const rec = BAKE_RECIPES[Math.min(BAKE_RECIPES.length - 1, bakeState.recipeIdx)];
    if (clickedStep !== null && clickedStep !== bakeState.step) {
      showToast('👩‍🍳 Bitte mache zuerst den hervorgehobenen Schritt!', 'warn');
      return;
    }

    if (bakeState.step === 0) {
      bakeState.stirCount += 1;
      player.pose = 'cook';
      player.poseTimer = 20;
      spawnFX('confetti', 310, 315, 7);
      if (bakeState.stirCount >= 3) {
        bakeState.step = 1;
        setStatus('🔥 Schritt 2: Stoppe das Ofen-Thermometer genau in der GRÜNEN Zone!');
        showToast('🥣 Super gerührt! Jetzt ab in den Steinofen!', 'success');
      }
    } else if (bakeState.step === 1) {
      if (bakeState.ovenCursor >= 35 && bakeState.ovenCursor <= 68) {
        bakeState.step = 2;
        player.pose = 'jump';
        player.poseTimer = 22;
        spawnFX('confetti', 540, 265, 14);
        setStatus(`🎂 Schritt 3: Verziere ${rec.label} & serviere es deinen Freunden!`);
        showToast('🔥 Goldbraun gebacken! Perfekte Temperatur!', 'success');
      } else {
        spawnFX('water', 540, 265, 6);
        showToast('⏱️ Fast! Warte kurz, bis der Zeiger im grünen Bereich steht!', 'warn');
      }
    } else if (bakeState.step === 2) {
      score += 1;
      player.pose = 'pet';
      player.poseTimer = 24;
      eventFriends.forEach((f) => {
        f.bounce = 24;
        f.speechText = `Mmmh, ${rec.resultIcon}!`;
        f.speechTimer = 140;
      });
      spawnFX('heart', 430, 250, 14);
      showToast(`${rec.resultIcon} ${rec.label} serviert! Deine Freunde jubeln! (${score}/${goal})`, 'success');
      if (score >= goal) {
        refreshHeaderStats();
        renderGoalChips();
        completeCurrentEvent();
        return;
      }
      bakeState.recipeIdx += 1;
      bakeState.step = 0;
      bakeState.stirCount = 0;
      const nextRec = BAKE_RECIPES[bakeState.recipeIdx];
      setStatus(`🥣 Nächstes Rezept: ${nextRec.label}! Tippe 3x auf „Teig rühren!“`);
    }

    refreshHeaderStats();
    renderGoalChips();
    renderActionButtons();
  }

  function lightLanternSpot(spot) {
    if (!starState || spot.lit || eventCompleted) return;
    spot.lit = true;
    starState.lanternsLit += 1;
    starState.lanterns.push({
      x: spot.x,
      y: spot.y - 12,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.75 - Math.random() * 0.3,
      color: ['#fbbf24', '#fb7185', '#a855f7'][starState.lanternsLit % 3]
    });
    score += 1;
    player.pose = 'jump';
    player.poseTimer = 22;
    spawnFX('confetti', spot.x, spot.y - 24, 12);
    showToast(`🏮 Himmels-Laterne steigt in die Nacht! (${score}/${goal})`, 'success');
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) completeCurrentEvent();
  }

  function lightNextLantern() {
    if (!starState || eventCompleted) return;
    const spot = starState.lanternSpots.find((s) => !s.lit);
    if (!spot) {
      // Allow releasing extra lanterns freely from player spot!
      starState.lanternsLit += 1;
      starState.lanterns.push({
        x: player.x,
        y: player.y - 25,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.8,
        color: '#fbbf24'
      });
      score += 1;
      spawnFX('confetti', player.x, player.y - 40, 12);
      showToast(`🏮 Noch eine Glückslaterne steigt auf! (${score}/${goal})`, 'success');
      refreshHeaderStats();
      renderGoalChips();
      if (score >= goal) completeCurrentEvent();
      return;
    }
    navigateToPoint(spot.x, spot.y + 24, () => lightLanternSpot(spot));
  }

  function catchShootingStar(st) {
    if (!starState || !st.active || eventCompleted) return;
    st.active = false;
    starState.starsCaught += 1;
    score += 1;
    player.pose = 'jump';
    player.poseTimer = 24;
    eventFriends.forEach((f) => { f.bounce = 18; });
    spawnFX('confetti', st.x, st.y, 16);
    showToast(`🌠 Sternschnuppe gefangen — mach dir einen Wunsch! (${score}/${goal})`, 'success');
    refreshHeaderStats();
    renderGoalChips();
    if (score >= goal) completeCurrentEvent();
  }

  function catchAnyShootingStar() {
    if (!starState || eventCompleted) return;
    const st = starState.shootingStars.find((s) => s.active);
    if (st) {
      catchShootingStar(st);
    } else {
      showToast('✨ Schau in den Sternenhimmel — gleich erscheint eine neue Sternschnuppe!', 'info');
    }
  }

  function handleCanvasClick(clientX, clientY) {
    if (!canvas || !currentEvent) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    // 1. Companion pets can always be tapped & cuddled!
    const tappedPet = petFollowers.handleTap(cx, cy);
    if (tappedPet.hit) {
      player.pose = 'pet';
      player.poseTimer = 20;
      showToast(`❤️ ${tappedPet.meta.name} feiert fröhlich mit dir!`, 'success');
      return;
    }

    // 2. Party balloons take priority when floating above
    if (!eventCompleted && currentEvent.kind === 'party' && partyState) {
      for (const b of partyState.balloons) {
        if (b.popTimer === 0 && Math.hypot(cx - b.x, cy - b.y) <= 34) {
          b.popTimer = 90;
          score = Math.min(goal, score + 1);
          spawnFX('confetti', b.x, b.y, 12);
          showToast('🎈 Plopp! Party-Ballon geplatzt!', 'success');
          refreshHeaderStats();
          renderGoalChips();
          if (score >= goal) completeCurrentEvent();
          return;
        }
      }
    }

    // 3. Tapped directly on a Friend -> walk up and talk with them!
    for (let i = eventFriends.length - 1; i >= 0; i--) {
      const f = eventFriends[i];
      if (Math.abs(cx - f.x) <= 34 && cy >= f.y - 122 && cy <= f.y + 14) {
        selectFriendToTalk(f.id, true);
        return;
      }
    }

    if (eventCompleted) {
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'trip' && tripState) {
      for (const it of tripState.items) {
        if (!it.collected && Math.hypot(cx - it.x, cy - it.y) <= 44) {
          navigateToPoint(it.x, it.y, () => collectTripItem(it));
          return;
        }
      }
      if (Math.hypot(cx - tripState.picnicSpot.x, cy - tripState.picnicSpot.y) <= 56) {
        triggerTripPicnic();
        return;
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'race' && raceState) {
      for (const st of raceState.boostStars) {
        if (st.active && Math.hypot(cx - st.x, cy - st.y) <= 42) {
          st.active = false;
          raceState.turboTimer = 55;
          raceState.myDist = Math.min(100, raceState.myDist + 16);
          spawnFX('confetti', st.x, st.y, 12);
          showToast('⚡ TURBO-STERN!', 'success');
          score = Math.round(raceState.myDist);
          refreshHeaderStats();
          renderGoalChips();
          if (raceState.myDist >= 100) completeCurrentEvent();
          return;
        }
      }
      boostRaceStep();
      return;
    }

    if (currentEvent.kind === 'pet_show' && petShowState) {
      const expected = PET_TRICKS[petShowState.currentTrickIdx];
      if (expected) performPetTrick(expected.id);
      return;
    }

    if (currentEvent.kind === 'garden_contest' && gardenState) {
      for (const bed of gardenState.beds) {
        if (bed.stage === 0 && Math.hypot(cx - bed.x, cy - bed.y) <= 52) {
          navigateToPoint(bed.x, bed.y + 30, () => bloomGardenBed(bed));
          return;
        }
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'treasure_hunt' && treasureState) {
      for (const sp of treasureState.spots) {
        if (!sp.dug && Math.hypot(cx - sp.x, cy - sp.y) <= 44) {
          navigateToPoint(sp.x, sp.y + 18, () => digSpot(sp));
          return;
        }
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'band_jam' && bandState) {
      for (let idx = 0; idx < BAND_INSTRUMENTS.length; idx++) {
        const inst = BAND_INSTRUMENTS[idx];
        if (Math.abs(cx - inst.laneX) <= 58 && cy >= 245 && cy <= 395) {
          playBandInstrument(idx);
          return;
        }
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'hide_and_seek' && hideState) {
      for (const sp of hideState.spots) {
        if (!sp.checked && Math.hypot(cx - sp.x, cy - sp.y) <= 52) {
          navigateToPoint(sp.x, sp.y + 32, () => checkHideSpot(sp));
          return;
        }
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'baking_fest' && bakeState) {
      if (cy >= 200 && cy <= 355 && cx >= 240 && cx <= 630) {
        doBakeStep(null);
        return;
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    if (currentEvent.kind === 'stargazing' && starState) {
      for (const st of starState.shootingStars) {
        if (st.active && Math.hypot(cx - st.x, cy - st.y) <= 48) {
          catchShootingStar(st);
          return;
        }
      }
      for (const sp of starState.lanternSpots) {
        if (!sp.lit && Math.hypot(cx - sp.x, cy - sp.y) <= 46) {
          navigateToPoint(sp.x, sp.y + 24, () => lightLanternSpot(sp));
          return;
        }
      }
      navigateToPoint(cx, cy, null);
      return;
    }

    navigateToPoint(cx, cy, null);
  }

  function triggerMainAction() {
    if (!currentEvent || eventCompleted) return;
    if (currentEvent.kind === 'party') triggerPartyDance();
    else if (currentEvent.kind === 'trip') walkToNextTripItem();
    else if (currentEvent.kind === 'race') boostRaceStep();
    else if (currentEvent.kind === 'pet_show' && petShowState) {
      const expected = PET_TRICKS[petShowState.currentTrickIdx];
      if (expected) performPetTrick(expected.id);
    } else if (currentEvent.kind === 'garden_contest') waterNextGardenBed();
    else if (currentEvent.kind === 'cafe_contest' && cafeState) {
      const nextNeeded = cafeState.order[cafeState.tray.length];
      if (nextNeeded) addCafeIngredient(nextNeeded);
    } else if (currentEvent.kind === 'treasure_hunt') digNearestTreasureSpot();
    else if (currentEvent.kind === 'band_jam' && bandState) {
      // Auto-hit closest note in hit zone or play lane 0
      const targetNote = bandState.notes.find((n) => n.y >= 245 && n.y <= 395);
      playBandInstrument(targetNote ? targetNote.laneIdx : 0);
    } else if (currentEvent.kind === 'hide_and_seek') searchNearestHideSpot();
    else if (currentEvent.kind === 'baking_fest') doBakeStep(null);
    else if (currentEvent.kind === 'stargazing') {
      if (starState && starState.shootingStars.some((s) => s.active)) catchAnyShootingStar();
      else lightNextLantern();
    }
  }

  if (canvas) canvas.addEventListener('click', (e) => handleCanvasClick(e.clientX, e.clientY));
  if (mainActionBtn) mainActionBtn.addEventListener('click', triggerMainAction);
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      if (!chatInputEl) return;
      sayToFriend(chatInputEl.value);
      chatInputEl.value = '';
    });
  }
  if (chatInputEl) {
    chatInputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sayToFriend(chatInputEl.value);
        chatInputEl.value = '';
      }
    });
  }

  if (backToMailBtn) {
    backToMailBtn.addEventListener('click', () => {
      stateManager.setState('HOME');
      window.dispatchEvent(new CustomEvent('runner:open-mailbox', { detail: { tab: 'inbox' } }));
    });
  }
  if (toHomeBtn) toHomeBtn.addEventListener('click', () => stateManager.setState('HOME'));
  if (toTownBtn) toTownBtn.addEventListener('click', () => stateManager.setState('TOWN'));

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.waypoints = [];
      player.pendingCallback = null;
    };
    const off = () => { holdPad[dir] = false; };
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
    if (stateManager.getState() !== 'EVENT') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (document.querySelector('.modal:not(.hidden)')) return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') { keys.left = true; player.waypoints = []; }
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.waypoints = [];
      if (currentEvent?.kind === 'race' && !e.repeat) boostRaceStep();
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') { keys.up = true; player.waypoints = []; }
    else if (e.code === 'ArrowDown' || e.code === 'KeyS') { keys.down = true; player.waypoints = []; }
    else if (currentEvent?.kind === 'band_jam' && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
      playBandInstrument(parseInt(e.code.replace('Digit', ''), 10) - 1);
    } else if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      triggerMainAction();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  function drawSpeechBubble(x, y, text, borderColor = '#ec4899', textColor = '#be185d') {
    if (!text) return;
    ctx.save();
    ctx.font = '800 11.5px "Plus Jakarta Sans", sans-serif';
    const maxW = 210;
    const clipped = ctx.measureText(text).width > maxW - 18 ? `${text.slice(0, 30)}…` : text;
    const sw = Math.max(66, Math.min(maxW, ctx.measureText(clipped).width + 20));
    const bx = Math.max(10, Math.min(860 - sw - 10, x - sw / 2));
    const by = Math.max(12, y);

    ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, sw, 26, [13]);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer triangle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 5, by + 25);
    ctx.lineTo(x, by + 33);
    ctx.lineTo(x + 5, by + 25);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(clipped, bx + sw / 2, by + 13);
    ctx.restore();
  }

  function updateFriendsMovement() {
    eventFriends.forEach((f, idx) => {
      if (f.speechTimer > 0) f.speechTimer--;
      if (f.bounce > 0) f.bounce--;

      if (f.hiddenInSpot) return;

      // In race mode, Mia & Leo run in their lanes; spectators walk near the rail
      if (currentEvent?.kind === 'race' && f.lane) {
        const dist = f.lane === 'leo' ? raceState.leoDist : raceState.miaDist;
        f.x = 120 + (dist / 100) * 630;
        f.facing = 1;
        f.pose = eventCompleted ? 'jump' : 'run';
        return;
      }

      if (partyState && partyState.danceTimer > 0) {
        f.pose = 'jump';
        return;
      }

      // During a trip, friends loosely follow around the player & explore!
      if (currentEvent?.kind === 'trip' && f.waitTimer <= 0) {
        const angle = (idx * 1.4) + animFrame * 0.008;
        f.tx = Math.max(55, Math.min(805, player.x + Math.cos(angle) * (95 + idx * 24)));
        f.ty = Math.max(225, Math.min(435, player.y + Math.sin(angle) * 58));
        f.waitTimer = 65 + Math.floor(Math.random() * 75);
      }

      const dx = f.tx - f.x;
      const dy = f.ty - f.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3.5) {
        const moveSpeed = 1.65;
        const nfx = f.x + (dx / dist) * moveSpeed;
        const nfy = f.y + (dy / dist) * moveSpeed;
        if (!hitsEventProp(nfx, nfy) && Math.hypot(nfx - player.x, nfy - player.y) >= 32) {
          f.x = nfx;
          f.y = nfy;
          if (Math.abs(dx) > 1) f.facing = dx > 0 ? 1 : -1;
          f.pose = 'walk';
        } else {
          f.pose = 'idle';
          f.waitTimer = Math.min(f.waitTimer, 20);
        }
      } else {
        f.pose = eventCompleted ? 'jump' : 'idle';
        f.waitTimer--;
        if (f.waitTimer <= 0) {
          const b = f.bounds;
          f.tx = b.minX + Math.random() * Math.max(10, b.maxX - b.minX);
          f.ty = b.minY + Math.random() * Math.max(10, b.maxY - b.minY);
          f.waitTimer = 60 + Math.floor(Math.random() * 90);
        }
      }
    });
  }

  function updateSimulation() {
    if (!currentEvent) return;

    if (celebrationTimer > 0) celebrationTimer--;
    if (player.speechTimer > 0) player.speechTimer--;

    if (currentEvent.kind === 'race') {
      if (!eventCompleted && raceState) {
        if (keys.right || holdPad.right) {
          const step = raceState.turboTimer > 0 ? 0.58 : 0.36;
          raceState.myDist = Math.min(100, raceState.myDist + step);
          player.pose = 'run';
          player.facing = 1;
          score = Math.round(raceState.myDist);
          if (animFrame % 6 === 0) {
            refreshHeaderStats();
            renderGoalChips();
          }
          if (raceState.myDist >= 100) completeCurrentEvent();
        } else if (player.poseTimer > 0) {
          player.poseTimer--;
          if (player.poseTimer <= 0) player.pose = 'idle';
        } else {
          player.pose = eventCompleted ? 'jump' : 'idle';
        }
      }
    } else {
      let mx = 0;
      let my = 0;
      if (keys.left || holdPad.left) mx -= 1;
      if (keys.right || holdPad.right) mx += 1;
      if (keys.up || holdPad.up) my -= 1;
      if (keys.down || holdPad.down) my += 1;
      const speed = 4.6;
      const stepEventWithCollision = (nxRaw, nyRaw) => {
        const nx = Math.max(40, Math.min(820, nxRaw));
        const ny = Math.max(200, Math.min(445, nyRaw));
        const blocked = (cx, cy) => hitsEventProp(cx, cy) || hitsEventFriend(cx, cy);
        if (!blocked(nx, ny)) {
          player.x = nx;
          player.y = ny;
        } else if (!blocked(nx, player.y)) {
          player.x = nx;
        } else if (!blocked(player.x, ny)) {
          player.y = ny;
        }
      };

      if (mx !== 0 || my !== 0) {
        const len = Math.hypot(mx, my) || 1;
        stepEventWithCollision(player.x + (mx / len) * speed, player.y + (my / len) * speed);
        if (mx !== 0) player.facing = Math.sign(mx);
        player.pose = 'walk';
      } else if (player.waypoints.length > 0) {
        const wp = player.waypoints[0];
        const dx = wp.x - player.x;
        const dy = wp.y - player.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= speed + 1) {
          if (!hitsEventProp(wp.x, wp.y)) {
            player.x = wp.x;
            player.y = wp.y;
          }
          player.waypoints.shift();
          if (player.waypoints.length === 0 && player.pendingCallback) {
            const cb = player.pendingCallback;
            player.pendingCallback = null;
            cb();
          }
        } else {
          if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
          stepEventWithCollision(player.x + (dx / dist) * speed, player.y + (dy / dist) * speed);
          player.pose = 'walk';
        }
      } else if (player.poseTimer > 0) {
        player.poseTimer--;
        if (player.poseTimer <= 0) player.pose = 'idle';
      } else {
        player.pose = 'idle';
      }
    }

    for (let i = waterDrops.length - 1; i >= 0; i--) {
      const d = waterDrops[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.24;
      d.life--;
      if (d.y >= d.targetY || d.life <= 0) waterDrops.splice(i, 1);
    }

    updateFriendsMovement();

    petFollowers.update(player.x, player.y + 6, player.facing, {
      minX: 28,
      maxX: 832,
      minY: 195,
      maxY: 452
    });

    if (partyState) {
      if (partyState.danceTimer > 0) partyState.danceTimer--;
      partyState.balloons.forEach((b) => {
        if (b.popTimer > 0) {
          b.popTimer--;
          if (b.popTimer === 0) b.y = 220;
        } else {
          b.y += b.vy;
          if (b.y < 76) b.y = 215;
        }
      });
    }

    if (tripState) {
      tripState.items.forEach((it) => {
        if (!it.collected && Math.hypot(player.x - it.x, player.y - it.y) <= 34) {
          collectTripItem(it);
        }
      });
    }

    if (raceState && !eventCompleted) {
      if (raceState.turboTimer > 0) raceState.turboTimer--;
      raceState.leoDist = Math.min(96, raceState.leoDist + 0.17);
      raceState.miaDist = Math.min(94, raceState.miaDist + 0.14);
      player.x = 120 + (raceState.myDist / 100) * 630;
      if (animFrame % 10 === 0) renderGoalChips();
    }

    if (petShowState) {
      if (petShowState.trickAnim > 0) petShowState.trickAnim--;
      if (petShowState.juryScoreTimer > 0) petShowState.juryScoreTimer--;
    }

    if (treasureState && animFrame % 10 === 0) {
      renderGoalChips();
    }

    if (bandState && !eventCompleted) {
      if (bandState.stageFlashTimer > 0) bandState.stageFlashTimer--;
      bandState.spawnTick++;
      if (bandState.spawnTick >= 55) {
        bandState.spawnTick = 0;
        bandState.notes.push({
          laneIdx: Math.floor(Math.random() * BAND_INSTRUMENTS.length),
          y: 52,
          speed: 1.55,
          icon: Math.random() < 0.5 ? '🎵' : '🎶'
        });
      }
      for (let i = bandState.notes.length - 1; i >= 0; i--) {
        bandState.notes[i].y += bandState.notes[i].speed;
        if (bandState.notes[i].y > 410) {
          bandState.notes.splice(i, 1);
        }
      }
    }

    if (bakeState && bakeState.step === 1 && !eventCompleted) {
      bakeState.ovenCursor += 1.65 * bakeState.ovenDir;
      if (bakeState.ovenCursor >= 96) { bakeState.ovenCursor = 96; bakeState.ovenDir = -1; }
      if (bakeState.ovenCursor <= 4) { bakeState.ovenCursor = 4; bakeState.ovenDir = 1; }
    }

    if (starState) {
      starState.lanterns.forEach((ln) => {
        ln.x += ln.vx + Math.sin(animFrame * 0.04 + ln.y * 0.05) * 0.25;
        ln.y += ln.vy;
        if (ln.y < -30) ln.y = 260;
      });
      starState.spawnTick++;
      if (!eventCompleted && starState.spawnTick >= 95) {
        starState.spawnTick = 0;
        starState.shootingStars.push({
          x: 40 + Math.random() * 260,
          y: 35 + Math.random() * 90,
          vx: 2.9 + Math.random() * 1.1,
          vy: 0.75 + Math.random() * 0.55,
          active: true
        });
      }
      for (let i = starState.shootingStars.length - 1; i >= 0; i--) {
        const s = starState.shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (!s.active || s.x > 890 || s.y > 240) {
          starState.shootingStars.splice(i, 1);
        }
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawScene() {
    if (!ctx || !canvas || !currentEvent) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const theme = currentEvent.theme;
    if (theme === 'beach' || theme === 'treasure_island') {
      const sky = ctx.createLinearGradient(0, 0, 0, 220);
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(1, '#bae6fd');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 220);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, 168, w, 52);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(0, 215, w, h - 215);
    } else if (theme === 'stage') {
      const stg = ctx.createLinearGradient(0, 0, 0, h);
      stg.addColorStop(0, '#1e1b4b');
      stg.addColorStop(0.55, '#4c1d95');
      stg.addColorStop(1, '#312e81');
      ctx.fillStyle = stg;
      ctx.fillRect(0, 0, w, h);
      // Stage floor & spotlights
      ctx.fillStyle = '#581c87';
      ctx.fillRect(0, 215, w, h - 215);
      for (let sx = 150; sx <= 720; sx += 190) {
        const beam = ctx.createRadialGradient(sx, 0, 10, sx, 220, 220);
        beam.addColorStop(0, 'rgba(244, 114, 182, 0.36)');
        beam.addColorStop(1, 'rgba(244, 114, 182, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.arc(sx, 140, 200, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'night_sky') {
      const nsky = ctx.createLinearGradient(0, 0, 0, 250);
      nsky.addColorStop(0, '#0f172a');
      nsky.addColorStop(0.7, '#1e1b4b');
      nsky.addColorStop(1, '#312e81');
      ctx.fillStyle = nsky;
      ctx.fillRect(0, 0, w, 250);
      // Twinkling stars + Crescent Moon
      for (let si = 0; si < 32; si++) {
        const sx = (si * 97 + 23) % w;
        const sy = (si * 53 + 18) % 210;
        const alpha = 0.4 + 0.5 * Math.sin(animFrame * 0.08 + si);
        ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5 + (si % 2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(760, 68, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(770, 62, 20, 0, Math.PI * 2);
      ctx.fill();

      const meadow = ctx.createLinearGradient(0, 240, 0, h);
      meadow.addColorStop(0, '#14532d');
      meadow.addColorStop(1, '#064e3b');
      ctx.fillStyle = meadow;
      ctx.fillRect(0, 240, w, h - 240);
    } else if (theme === 'bakery') {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#fffbeb');
      bg.addColorStop(0.55, '#fef3c7');
      bg.addColorStop(1, '#fde68a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    } else if (theme === 'ice') {
      const sky = ctx.createLinearGradient(0, 0, 0, 210);
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 210);
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 195, w, h - 195);
    } else if (theme === 'stadium') {
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, w, 220);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 185, w, 40);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(0, 225, w, 220);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 3;
      [298, 372].forEach((ly) => {
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(w, ly);
        ctx.stroke();
      });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(760, 225, 16, 220);
      ctx.fillStyle = '#10b981';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🏁 ZIEL', 754, 210);
    } else if (theme === 'cafe' || theme === 'ice_party' || theme === 'boutique_party' || theme === 'home_party') {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#fdf2f8');
      bg.addColorStop(0.55, '#fce7f3');
      bg.addColorStop(1, '#fef3c7');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, 195);
      sky.addColorStop(0, '#38bdf8');
      sky.addColorStop(1, '#bae6fd');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 195);
      const grass = ctx.createLinearGradient(0, 195, 0, h);
      grass.addColorStop(0, '#86efac');
      grass.addColorStop(1, '#10b981');
      ctx.fillStyle = grass;
      ctx.fillRect(0, 195, w, h - 195);
    }

    // Festive bunting banner
    const flagColors = ['#ec4899', '#fbbf24', '#38bdf8', '#a855f7', '#10b981'];
    for (let fx = 30; fx < w - 30; fx += 44) {
      ctx.fillStyle = flagColors[(fx / 44) % flagColors.length];
      ctx.beginPath();
      ctx.moveTo(fx, 14);
      ctx.lineTo(fx + 32, 14);
      ctx.lineTo(fx + 16, 38);
      ctx.closePath();
      ctx.fill();
    }

    // Scene props (tables, picnic blanket, beds, counter)
    if (partyState) {
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.roundRect(350, 155, 160, 44, [12]);
      ctx.fill();
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(356, 160, 148, 12);
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍰 🎂 🥤', 430, 150);
    } else if (tripState) {
      const ps = tripState.picnicSpot;
      ctx.save();
      ctx.fillStyle = currentEvent.theme === 'ice' ? '#e0f2fe' : '#fda4af';
      ctx.beginPath();
      ctx.roundRect(ps.x - 56, ps.y - 30, 112, 60, [14]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentEvent.theme === 'ice' ? '⛄' : '🧺', ps.x, ps.y);
      ctx.restore();

      tripState.items.forEach((it) => {
        if (it.collected) return;
        const hover = Math.sin(animFrame * 0.1 + it.x) * 5;
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(it.x, it.y + hover, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.icon, it.x, it.y + hover + 1);
        ctx.restore();
      });
    } else if (raceState) {
      raceState.boostStars.forEach((st) => {
        if (!st.active) return;
        const hover = Math.sin(animFrame * 0.14) * 4;
        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(st.x, st.y + hover, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', st.x, st.y + hover);
        ctx.restore();
      });
    } else if (petShowState) {
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(240, 315, 380, 90, [24]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      const trickJump = petShowState.trickAnim > 0 ? Math.abs(Math.sin(petShowState.trickAnim * 0.3)) * 28 : 0;
      ctx.save();
      ctx.translate(petShowState.belloX, petShowState.belloY - trickJump);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(0, -14, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(14, -24, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-24, 10, 54, 17, [8]);
      ctx.fill();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.fillText('Bello', 3, 19);
      ctx.restore();
    } else if (gardenState) {
      gardenState.beds.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.stage === 1 ? '#854d0e' : '#a16207';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 44, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = b.stage === 1 ? '#10b981' : '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = b.stage === 1 ? '32px sans-serif' : '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.stage === 1 ? `${b.flower}🦋` : '🌱', b.x, b.y - 10);
        ctx.restore();
      });
    } else if (cafeState) {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(120, 232, 620, 42, [14]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 MEISTERSCHAFTS-THEKE 🍦🧇', 430, 258);
    } else if (treasureState) {
      // Palm tree & Radar ring around player
      ctx.font = '44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌴', 92, 200);
      ctx.fillText('🌴', 785, 205);

      const nearest = getNearestUndugRealTreasureDist();
      if (nearest !== null && !eventCompleted) {
        const ringColor = nearest < 95 ? '#ef4444' : nearest < 210 ? '#f59e0b' : '#38bdf8';
        ctx.save();
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.ellipse(player.x, player.y + 8, 42 + Math.sin(animFrame * 0.18) * 6, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      treasureState.spots.forEach((sp) => {
        ctx.save();
        ctx.fillStyle = sp.dug ? '#d97706' : '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, 28, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = sp.dug ? '#92400e' : '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sp.dug ? sp.reward : '❌', sp.x, sp.y - 6);
        ctx.restore();
      });
    } else if (bandState) {
      BAND_INSTRUMENTS.forEach((inst, laneIdx) => {
        ctx.save();
        // Vertical track rail
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(inst.laneX, 46);
        ctx.lineTo(inst.laneX, 345);
        ctx.stroke();

        // Hit Ring Pad
        const isFlashing = bandState.activeLane === laneIdx && bandState.stageFlashTimer > 0;
        ctx.fillStyle = isFlashing ? inst.color : 'rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.arc(inst.laneX, 325, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = inst.color;
        ctx.lineWidth = isFlashing ? 5 : 3;
        ctx.stroke();

        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(inst.icon, inst.laneX, 325);
        ctx.restore();
      });

      // Falling Notes
      bandState.notes.forEach((n) => {
        const inst = BAND_INSTRUMENTS[n.laneIdx];
        ctx.save();
        ctx.fillStyle = inst.color;
        ctx.beginPath();
        ctx.arc(inst.laneX, n.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.icon, inst.laneX, n.y);
        ctx.restore();
      });
    } else if (hideState) {
      hideState.spots.forEach((sp, idx) => {
        const hasHiddenFriend = !!sp.friendId && !sp.checked;
        const wiggle = hasHiddenFriend && ((animFrame + idx * 17) % 90 < 16)
          ? Math.sin(animFrame * 0.6) * 4
          : 0;
        ctx.save();
        ctx.fillStyle = sp.checked ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.ellipse(sp.x + wiggle, sp.y + 8, 38, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sp.icon, sp.x + wiggle, sp.y - 10);
        if (hasHiddenFriend && ((animFrame + idx * 23) % 130 < 35)) {
          drawSpeechBubble(sp.x, sp.y - 56, 'Kicher! 🤫', '#10b981', '#047857');
        }
        ctx.restore();
      });
    } else if (bakeState) {
      // Mixing Table + Stone Brick Oven!
      ctx.save();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.roundRect(220, 260, 170, 56, [12]);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bakeState.step === 0 ? '🥣' : '🧁', 305, 254);

      // Brick Oven
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(475, 195, 130, 118, [26, 26, 8, 8]);
      ctx.fill();
      ctx.fillStyle = bakeState.step === 1 ? '#f97316' : '#1e293b';
      ctx.beginPath();
      ctx.arc(540, 265, 34, Math.PI, 0);
      ctx.fill();

      // Temperature Gauge Bar when baking!
      if (bakeState.step === 1) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(435, 148, 210, 28, [14]);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Green target zone (35..68%)
        ctx.fillStyle = '#10b981';
        ctx.fillRect(435 + 2.1 * 35, 152, 2.1 * 33, 20);
        // Moving needle
        const nx = 435 + (bakeState.ovenCursor / 100) * 210;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(nx - 3, 145, 6, 34);
      }
      ctx.restore();
    } else if (starState) {
      // Drifting glowing sky lanterns
      starState.lanterns.forEach((ln) => {
        ctx.save();
        const glow = ctx.createRadialGradient(ln.x, ln.y, 4, ln.x, ln.y, 28);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ln.x, ln.y, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = ln.color;
        ctx.beginPath();
        ctx.roundRect(ln.x - 10, ln.y - 14, 20, 26, [6]);
        ctx.fill();
        ctx.restore();
      });

      // Streaking shooting stars
      starState.shootingStars.forEach((s) => {
        if (!s.active) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(s.x - 28, s.y - 10);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌠', s.x, s.y);
        ctx.restore();
      });

      // Unlit lantern spots on meadow + brass telescope
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔭', 96, 262);
      starState.lanternSpots.forEach((sp) => {
        ctx.save();
        ctx.fillStyle = sp.lit ? '#fef08a' : '#ffffff';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sp.lit ? '✨' : '🏮', sp.x, sp.y);
        ctx.restore();
      });
    }

    // Companion pets
    petFollowers.draw(ctx, animFrame, {
      scale: 0.92,
      showLeashes: true,
      anchorX: player.x,
      anchorY: player.y,
      facing: player.facing
    });

    // Depth-sorted Characters (Player + All Friends at EXACT SAME 0.86 scale!)
    const actors = [
      { kind: 'player', y: player.y },
      ...eventFriends.filter((f) => !f.hiddenInSpot).map((f) => ({ kind: 'friend', f, y: f.y }))
    ];
    actors.sort((a, b) => a.y - b.y);

    actors.forEach((a) => {
      if (a.kind === 'player') {
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
          drawSpeechBubble(player.x, player.y - 154, player.speechText, '#0ea5e9', '#0369a1');
        }
      } else {
        const f = a.f;
        const danceBob = partyState && partyState.danceTimer > 0
          ? Math.abs(Math.sin(animFrame * 0.25 + f.x)) * 10
          : f.bounce * 0.4;
        ctx.save();
        ctx.translate(f.x, f.y - danceBob);
        ctx.scale(0.86, 0.86);
        renderCharacter(ctx, 0, 0, f.config, {
          frame: animFrame + f.name.length * 7,
          pose: f.pose,
          facing: f.facing
        });
        ctx.restore();

        // Name pill under feet
        ctx.save();
        ctx.fillStyle = activeChatFriendId === f.id ? '#ec4899' : 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.roundRect(f.x - 36, f.y + 6, 72, 18, [9]);
        ctx.fill();
        ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = activeChatFriendId === f.id ? '#ffffff' : '#334155';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.name, f.x, f.y + 15);
        ctx.restore();

        // Friend speech bubble (active chat takes priority, else contextual cue)
        let bubbleText = '';
        if (f.speechTimer > 0 && f.speechText) {
          bubbleText = f.speechText;
        } else if (petShowState && petShowState.juryScoreTimer > 0) {
          bubbleText = '10 ⭐!';
        } else if (partyState && !f.served) {
          bubbleText = `💬 / ${f.want.icon}?`;
        }
        if (bubbleText) {
          drawSpeechBubble(f.x, f.y - 152 - danceBob, bubbleText, '#ec4899', '#be185d');
        }
      }
    });

    // Floating Balloons on top so easy to tap!
    if (partyState) {
      partyState.balloons.forEach((b) => {
        if (b.popTimer > 0) return;
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + 18);
        ctx.lineTo(b.x, b.y + 42);
        ctx.stroke();

        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.arc(b.x - 6, b.y - 7, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Realistic downward water stream droplets onto flowerbeds
    waterDrops.forEach((d) => {
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, 2.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Particles
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 58);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    if (eventCompleted) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 210, 56, 420, 62, [20]);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 17px "Outfit", sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText(`🏆 ${currentEvent.title} geschafft!`, w / 2, 77);
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#be185d';
      ctx.fillText(`🎉 ${rewardSummaryText}`, w / 2, 100);
      ctx.restore();
    }

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

  stateManager.onStateChange((newState, payload) => {
    if (newState === 'EVENT') {
      initActivity(payload);
      startLoop();
    } else {
      stopLoop();
    }
  });
}
