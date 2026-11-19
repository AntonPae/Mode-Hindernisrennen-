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
      cafe_contest: 'Mmmh, diese Eis-Kreationen sehen zum Anbeißen aus!'
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
      cafe_contest: 'Nachher nehme ich auch eine große Portion Waffeln!'
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
      cafe_contest: 'Du kombinierst die Zutaten wie ein echter Profi!'
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
      cafe_contest: 'Zeig der Jury, wie schnell du die Desserts zauberst!'
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
      cafe_contest: 'Ich bestelle nachher gleich zweimal Waffeln!'
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

  let partyState = null;
  let tripState = null;
  let raceState = null;
  let petShowState = null;
  let gardenState = null;
  let cafeState = null;

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
    }
  }

  function navigateToPoint(tx, ty, cb = null) {
    player.waypoints = [{
      x: Math.max(40, Math.min(820, tx)),
      y: Math.max(200, Math.min(445, ty))
    }];
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
    player.pose = 'cook';
    player.poseTimer = 24;
    spawnFX('water', bed.x, bed.y - 16, 10);
    spawnFX('heart', bed.x, bed.y - 26, 6);
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
      spawnFX('heart', tappedPet.x, tappedPet.y - 22, 8);
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
    else if (e.code === 'Space' || e.code === 'Enter') {
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
        f.x += (dx / dist) * moveSpeed;
        f.y += (dy / dist) * moveSpeed;
        if (Math.abs(dx) > 1) f.facing = dx > 0 ? 1 : -1;
        f.pose = 'walk';
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
      if (mx !== 0 || my !== 0) {
        const len = Math.hypot(mx, my) || 1;
        player.x = Math.max(40, Math.min(820, player.x + (mx / len) * speed));
        player.y = Math.max(200, Math.min(445, player.y + (my / len) * speed));
        if (mx !== 0) player.facing = Math.sign(mx);
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
          if (player.waypoints.length === 0 && player.pendingCallback) {
            const cb = player.pendingCallback;
            player.pendingCallback = null;
            cb();
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
    if (theme === 'beach') {
      const sky = ctx.createLinearGradient(0, 0, 0, 220);
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(1, '#bae6fd');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 220);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, 168, w, 52);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(0, 215, w, h - 215);
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
      ...eventFriends.map((f) => ({ kind: 'friend', f, y: f.y }))
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
