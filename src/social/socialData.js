import { HomeManager } from '../home/homeData.js';
import { ShopManager } from '../editor/shopData.js';
import { BankManager } from '../economy/bankData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';

const SOCIAL_KEY = 'runner_social_state';

export const NEW_ACQUAINTANCES = [
  {
    id: 'mila',
    name: 'Mila',
    icon: '📸',
    role: 'Tierfotografin',
    jobTitle: 'Tierfotografin',
    jobPlace: 'Promenade & Tierhandlung',
    jobCoins: 7,
    hobby: 'Fotos von Hunden, Katzen & Sonnenuntergängen machen',
    favoriteFood: 'Pistazien-Eis 🍨',
    townX: 2475,
    townY: 416,
    spotLabel: 'Promenade bei der Tierhandlung',
    introLine: 'Hallo! Ich bin Mila und fotografiere heute die süßen Tiere in der Traumstadt! Wollen wir uns kennenlernen?',
    facts: [
      'Ich reise mit meiner Sofortbildkamera durch die ganze Traumstadt.',
      'Mein größter Traum ist ein Foto-Album mit allen Nachbar-Hunden!',
      'Ich liebe Pistazien-Eis und gehe abends gern durchs Wohnviertel spazieren.'
    ],
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_4', hairId: 'hair_flower', hairColor: '#b45309' },
      clothes: {
        top: { style: 'jacket', color: '#0ea5e9', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'jeans', color: '#1e293b' },
        shoes: { style: 'sneakers', color: '#fde047' }
      }
    }
  },
  {
    id: 'tom',
    name: 'Tom',
    icon: '🛹',
    role: 'Gärtner & Skater',
    jobTitle: 'Gärtner & Skater-Coach',
    jobPlace: 'Park & Supermarkt',
    jobCoins: 7,
    hobby: 'Obstbäume pflegen & auf dem Board durch den Park rollen',
    favoriteFood: 'Frische Äpfel & Herzwaffeln 🧇',
    townX: 1515,
    townY: 416,
    spotLabel: 'Promenade am Supermarkt',
    introLine: 'Hey! Ich bin Tom – neu hier im Viertel! Kennst du schon den besten Platz zum Skaten und Gärtnern?',
    facts: [
      'Ich bin letzte Woche in die Straße hinter dem Supermarkt gezogen.',
      'Ich züchte rote Äpfel und repariere alte Skateboards.',
      'Wenn du mal Lust auf ein Wettrennen hast, schreib mir einfach im Briefkasten!'
    ],
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_2', hairId: 'hair_2', hairColor: '#0f172a' },
      clothes: {
        top: { style: 'hoodie', color: '#10b981', stickers: [{ type: 'lightning', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'cargo', color: '#334155' },
        shoes: { style: 'sneakers', color: '#ffffff' }
      }
    }
  },
  {
    id: 'lina',
    name: 'Lina',
    icon: '🎨',
    role: 'Malerin & Buchfreundin',
    jobTitle: 'Malerin im Traum-Café',
    jobPlace: 'Traum-Café & Atelier',
    jobCoins: 8,
    hobby: 'Aquarell-Bilder malen & gemütlich im Café lesen',
    favoriteFood: 'Erdbeer-Shake & Kakao ☕',
    townX: 3410,
    townY: 266,
    spotLabel: 'Vor dem Traum-Café',
    introLine: 'Hallo du! Ich bin Lina und suche schöne Motive für mein neues Skizzenbuch. Wie heißt du denn?',
    facts: [
      'Am liebsten male ich bunte Häuser und glückliche Tiere.',
      'Im Traum-Café trinke ich immer einen warmen Kakao zum Malen.',
      'Ich würde mich riesig freuen, wenn wir richtige Freunde werden!'
    ],
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_8', hairId: 'hair_3', hairColor: '#7c2d12' },
      clothes: {
        top: { style: 'sparkle_top', color: '#f43f5e', stickers: [{ type: 'heart', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'star_jeans', color: '#312e81' },
        shoes: { style: 'glitter_boots', color: '#fbcfe8' }
      }
    }
  },
  {
    id: 'jonas',
    name: 'Jonas',
    icon: '🎸',
    role: 'Musiker & Hobbykoch',
    jobTitle: 'Musiker & Café-Koch',
    jobPlace: 'Traum-Café',
    jobCoins: 8,
    hobby: 'Gitarre spielen & leckere Pfannkuchen backen',
    favoriteFood: 'Schoko-Waffeln & Kakao 🍫',
    townX: 2135,
    townY: 416,
    spotLabel: 'Promenade zwischen Boutique & Möbelhaus',
    introLine: 'Hey! Ich bin Jonas und übe gerade neue Lieder für die Traumstadt! Schön, dich kennenzulernen!',
    facts: [
      'Abends spiele ich am liebsten Akustik-Gitarre im Wohnzimmer.',
      'Ich backe super gern Pfannkuchen und liebe es, gemütlich am Küchentisch zu sitzen.',
      'Wenn wir uns gut verstehen, würde ich total gern eine WG mit dir gründen!'
    ],
    charConfig: {
      body: { height: 1.0, width: 1.0, faceId: 'face_1', hairId: 'hair_1', hairColor: '#92400e' },
      clothes: {
        top: { style: 'jacket', color: '#8b5cf6', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
        pants: { style: 'jeans', color: '#1e293b' },
        shoes: { style: 'sneakers', color: '#fbbf24' }
      }
    }
  }
];

export const NEIGHBOR_DIRECTORY = {
  weber: {
    id: 'weber',
    name: 'Herr Weber',
    icon: '🐕',
    role: 'Nachbar & Hundefreund',
    topics: [
      'Bello ist heute wieder voller Energie! Haben deine Tiere auch schon Kunststücke gelernt?',
      'Guten Tag, Nachbar! Vergiss nicht, die Hunde freuen sich immer über ein liebes Wort.',
      'Bei uns in der Straße ist heute herrliches Wetter zum Gassi gehen!'
    ]
  },
  frieda: {
    id: 'frieda',
    name: 'Oma Frieda',
    icon: '🏡',
    role: 'Nachbarin & Bäckerin',
    topics: [
      'Ach wie schön, dich zu sehen! In meiner Küche duftet es heute nach frischem Apfelkuchen.',
      'Schau gerne öfter in deinen Briefkasten – ich schicke dir bald wieder eine Einladung!',
      'Deine Tierchen sehen heute ja besonders gepflegt und fröhlich aus!'
    ]
  },
  kaya: {
    id: 'kaya',
    name: 'Frau Kaya',
    icon: '🐱',
    role: 'Tierliebhaberin & Gärtnerin',
    topics: [
      'Meine Mieze schnurrt schon, wenn sie dich sieht!',
      'Hast du schon deine Beete gegossen? Im Garten blüht heute alles wunderschön.',
      'Ich finde es toll, wie lieb du zu allen Tieren in der Stadt bist!'
    ]
  }
};

export const PET_COMMANDS = [
  { id: 'sit', icon: '🪑', label: 'Sitz!', cmdLabel: 'Sitz machen' },
  { id: 'stay', icon: '🐾', label: 'Bleib!', cmdLabel: 'Hier bleiben' },
  { id: 'follow', icon: '🏃', label: 'Komm her!', cmdLabel: 'Folge mir' },
  { id: 'spin', icon: '🔄', label: 'Dreh dich!', cmdLabel: 'Kunststück' },
  { id: 'fetch', icon: '🦴', label: 'Such!', cmdLabel: 'Voraus laufen' },
  { id: 'rest', icon: '😴', label: 'Schlaf!', cmdLabel: 'Ausruhen' }
];

// In-session active command states per petId (survives screen switches nicely)
const runtimePetCommands = new Map();

export const PetCommandStore = {
  getCommand(petId) {
    return runtimePetCommands.get(petId) || { command: 'follow', stayX: null, stayY: null };
  },
  setCommand(petId, command, stayX = null, stayY = null) {
    const prev = runtimePetCommands.get(petId) || {};
    runtimePetCommands.set(petId, {
      command,
      stayX: command === 'stay' ? (stayX ?? prev.stayX ?? null) : null,
      stayY: command === 'stay' ? (stayY ?? prev.stayY ?? null) : null
    });
  },
  clearStayPositions() {
    runtimePetCommands.forEach((val, key) => {
      if (val.command === 'stay') {
        runtimePetCommands.set(key, { command: 'sit', stayX: null, stayY: null });
      }
    });
  }
};

export function parsePetCommand(inputText, petMeta) {
  const raw = (inputText || '').trim();
  const q = raw.toLowerCase();
  const name = petMeta ? petMeta.name : 'Dein Tier';
  const species = petMeta ? petMeta.species : 'dog';

  const sound = species === 'cat'
    ? 'Miau!'
    : species === 'bunny'
      ? 'Hoppel!'
      : species === 'parrot'
        ? 'Piep!'
        : species === 'fox'
          ? 'Jip!'
          : 'Wuff!';

  if (/\b(sitz|sitzen|hinsetzen|setz)\b/.test(q)) {
    return { command: 'sit', speech: `${sound} *sitzt brav* 🪑`, reply: `🐾 ${name} setzt sich gehorsam auf den Boden!` };
  }
  if (/\b(bleib|warte|stopp|halt|steh)\b/.test(q)) {
    return { command: 'stay', speech: `${sound} *bleibt hier* 🐾`, reply: `🐾 ${name} bleibt genau an dieser Stelle warten, bis du „Komm her“ sagst!` };
  }
  if (/\b(komm|hier|folge|mitkommen|bei fuß|fuß|weiter)\b/.test(q)) {
    return { command: 'follow', speech: `${sound} Bin schon da! 🏃`, reply: `🏃 ${name} läuft sofort wieder fröhlich neben dir mit!` };
  }
  if (/\b(dreh|rolle|kunststück|trick|tanz|spring|hopp|salto)\b/.test(q)) {
    return { command: 'spin', speech: `Huiii! ${sound} ✨`, reply: `🔄 ${name} macht eine flotte Wirbel-Drehung vor Begeisterung!` };
  }
  if (/\b(such|hol|apport|lauf|schnüffel|spiel|ball)\b/.test(q)) {
    return { command: 'fetch', speech: `Schnüffel! ${sound} 🦴`, reply: `🦴 ${name} flitzt neugierig voraus, schnüffelt und kommt stolz zurück!` };
  }
  if (/\b(schlaf|platz|ruh|ausruh|hinlegen|müde)\b/.test(q)) {
    return { command: 'rest', speech: `Chrrr... 💤`, reply: `😴 ${name} rollt sich gemütlich zusammen und ruht sich kurz aus.` };
  }
  if (/\b(brav|fein|lieb|gut|süß|super|toller|tolle|knuddel|streichel)\b/.test(q)) {
    return { command: 'praise', speech: `❤️ ${sound} ❤️`, reply: `❤️ ${name} wedelt überglücklich und schmiegt sich an dich!` };
  }
  if (/\b(essen|futter|hunger|leckerli|knochen|trinken|wasser)\b/.test(q)) {
    return { command: 'spin', speech: `Mmmh? Leckerli! 🦴`, reply: `🦴 ${name} spitzt sofort die Ohren – vielleicht gibt's gleich ein Leckerli!` };
  }

  return {
    command: 'praise',
    speech: `${sound} 💕`,
    reply: `💬 ${name} legt fröhlich den Kopf schief: „${sound}“ (Tipp: Sag „Sitz“, „Bleib“, „Komm“, „Dreh dich“, „Such“ oder „Schlaf“!)`
  };
}

function getDefaultRoommateLife() {
  return {
    hunger: 78,
    thirst: 76,
    energy: 86,
    sick: null, // null | { kind, label, since }
    activity: 'idle', // 'idle' | 'eating' | 'drinking' | 'sleeping' | 'working'
    activityStartedAt: 0,
    activityEndsAt: 0,
    workShiftCount: 0,
    ticksSinceSickCheck: 0,
    lastSickAt: 0,
    lastTick: Date.now()
  };
}

function getDefaultSocialState() {
  return {
    acquaintances: {}, // { [id]: { stage: 0..3, points: 0, talks: 0, invitedWelcome: false } }
    personAffinity: {}, // { [id]: number }
    roommateId: null, // id of NEW_ACQUAINTANCES currently living with the player
    movedInRewarded: {}, // { [id]: true }
    roommateLife: getDefaultRoommateLife()
  };
}

export const SocialManager = {
  getState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SOCIAL_KEY));
      if (saved && typeof saved === 'object') {
        return {
          acquaintances: saved.acquaintances || {},
          personAffinity: saved.personAffinity || {},
          roommateId: saved.roommateId || null,
          movedInRewarded: saved.movedInRewarded || {},
          roommateLife: {
            ...getDefaultRoommateLife(),
            ...(saved.roommateLife || {})
          }
        };
      }
    } catch {
      // ignore storage errors
    }
    return getDefaultSocialState();
  },

  saveState(state) {
    try {
      localStorage.setItem(SOCIAL_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  },

  getRoommate() {
    const state = this.getState();
    if (!state.roommateId) return null;
    const person = NEW_ACQUAINTANCES.find((p) => p.id === state.roommateId);
    if (!person) return null;
    return {
      ...person,
      progress: state.acquaintances[person.id] || { stage: 3, points: 4, talks: 2, invitedWelcome: true }
    };
  },

  canMoveIn(personId) {
    const person = NEW_ACQUAINTANCES.find((p) => p.id === personId);
    if (!person) return { ok: false, reason: 'not_found', neededTalks: 0 };
    const state = this.getState();
    if (state.roommateId === personId) {
      return { ok: false, reason: 'already_roommate', neededTalks: 0 };
    }
    return { ok: true, reason: 'ready', neededTalks: 0 };
  },

  moveInWith(personId) {
    const person = NEW_ACQUAINTANCES.find((p) => p.id === personId);
    if (!person) return { ok: false, reason: 'not_found' };

    const state = this.getState();
    const prevRoommateId = state.roommateId;
    if (prevRoommateId === personId) {
      return { ok: false, reason: 'already_roommate', person };
    }

    const cur = state.acquaintances[personId] || { stage: 0, points: 0, talks: 0, invitedWelcome: false };
    cur.stage = 3;
    cur.points = Math.max(cur.points || 0, 4);
    cur.invitedWelcome = true;
    state.acquaintances[personId] = cur;
    state.roommateId = personId;
    state.roommateLife = getDefaultRoommateLife();

    // Clear pre-move-in chat history so the roommate never repeats "Hallo, ich bin Lina!"
    npcChatHistories.delete(personId);

    let bonusCoins = 0;
    if (!state.movedInRewarded[personId]) {
      state.movedInRewarded[personId] = true;
      bonusCoins = 12;
      BankManager.depositEarned(bonusCoins, `🏡 Einzugs-Bonus (${person.name})`);
      ShopManager.recordProgress(0, 1);
    }

    MailboxManager.deliverCustomMail({
      id: `mail_movein_${person.id}`,
      category: 'friend',
      categoryLabel: '🏡 Einzug ins Traumhaus',
      senderId: person.id,
      senderName: person.name,
      senderIcon: person.icon,
      title: `Ich bin bei dir eingezogen! 🏡 – ${person.name}`,
      body: `Hurra! Hier ist ${person.name}! Ich habe meine Koffer gepackt und wohne jetzt mit dir zusammen in deinem Haus & Garten. Wir können zusammen am Tisch sitzen, plaudern, essen, trinken, schlafen und sogar ein eigenes WG-Zimmer einrichten!`,
      isInvitation: false,
      rewardCoins: 8
    });
    window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));

    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:social-updated'));
    window.dispatchEvent(new CustomEvent('runner:roommate-updated', { detail: { roommateId: personId, prevRoommateId } }));

    return { ok: true, person, bonusCoins, prevRoommateId };
  },

  moveOutRoommate() {
    const state = this.getState();
    if (!state.roommateId) return { ok: false };
    const prev = NEW_ACQUAINTANCES.find((p) => p.id === state.roommateId) || null;
    state.roommateId = null;
    state.roommateLife = getDefaultRoommateLife();
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:social-updated'));
    window.dispatchEvent(new CustomEvent('runner:roommate-updated', { detail: { roommateId: null, prevRoommateId: prev?.id || null } }));
    return { ok: true, prev };
  },

  getRoommateLife() {
    const state = this.getState();
    if (!state.roommateId) return null;
    const person = NEW_ACQUAINTANCES.find((p) => p.id === state.roommateId);
    if (!person) return null;

    const life = state.roommateLife || getDefaultRoommateLife();
    const now = Date.now();
    let changed = false;

    if (life.activity === 'working' && life.activityEndsAt > 0 && now >= life.activityEndsAt) {
      const earned = person.jobCoins || 8;
      life.activity = 'idle';
      life.activityStartedAt = 0;
      life.activityEndsAt = 0;
      life.energy = Math.max(12, Math.round((life.energy ?? 80) - 18));
      life.hunger = Math.max(12, Math.round((life.hunger ?? 75) - 14));
      life.thirst = Math.max(12, Math.round((life.thirst ?? 75) - 18));
      life.workShiftCount = (life.workShiftCount || 0) + 1;
      changed = true;
      state.roommateLife = life;
      this.saveState(state);
      BankManager.depositEarned(earned, `💼 WG-Gehalt (${person.name})`);
      window.dispatchEvent(new CustomEvent('runner:roommate-event', {
        detail: { type: 'work_done', person, coins: earned }
      }));
    } else if ((life.activity === 'eating' || life.activity === 'drinking') && life.activityEndsAt > 0 && now >= life.activityEndsAt) {
      life.activity = 'idle';
      life.activityStartedAt = 0;
      life.activityEndsAt = 0;
      changed = true;
      state.roommateLife = life;
      this.saveState(state);
    }

    if (changed) {
      window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    }
    return life;
  },

  _maybeTriggerRoommateSickness(life, source = 'tick') {
    const now = Date.now();
    if (life.sick) return null;
    if (now - (life.lastSickAt || 0) < 180000) return null;
    life.ticksSinceSickCheck = (life.ticksSinceSickCheck || 0) + 1;
    if (source === 'tick' && life.ticksSinceSickCheck < 5) return null;

    const low = (life.energy ?? 85) < 28 || (life.hunger ?? 75) < 25 || (life.thirst ?? 75) < 25;
    let chance = 0.015;
    if (low) chance *= 2.2;
    if (Math.random() >= chance) return null;

    const kinds = [
      { kind: 'cold', label: 'Leichte Erkältung' },
      { kind: 'tummy', label: 'Kleines Bauchweh' }
    ];
    const pick = kinds[Math.floor(Math.random() * kinds.length)];
    life.sick = { ...pick, since: now };
    life.lastSickAt = now;
    life.ticksSinceSickCheck = 0;
    return life.sick;
  },

  tickRoommateLife(options = {}) {
    const { isPlayerSleeping = false } = options;
    const state = this.getState();
    if (!state.roommateId) return null;
    const person = NEW_ACQUAINTANCES.find((p) => p.id === state.roommateId);
    if (!person) return null;

    // Resolve any finished timed activity first
    const resolved = this.getRoommateLife();
    const freshState = this.getState();
    const life = resolved || freshState.roommateLife || getDefaultRoommateLife();
    const now = Date.now();
    const hasOwnRoom = HomeManager.hasRoommateRoom();
    const sleepBonus = hasOwnRoom ? 12 : 8;

    let eventPayload = null;

    if (life.activity === 'working') {
      life.lastTick = now;
      freshState.roommateLife = life;
      this.saveState(freshState);
      return { life, event: null };
    }

    if (life.activity === 'sleeping' || isPlayerSleeping) {
      life.energy = Math.min(100, (life.energy ?? 80) + sleepBonus);
      if (life.energy >= 94 && life.sick) {
        life.sick = null;
        eventPayload = { type: 'recovered', person };
      }
      if (!isPlayerSleeping && life.activity === 'sleeping' && life.energy >= 95) {
        life.activity = 'idle';
        eventPayload = eventPayload || { type: 'woke_up', person };
      }
    } else {
      life.hunger = Math.max(8, (life.hunger ?? 78) - 2);
      life.thirst = Math.max(8, (life.thirst ?? 76) - 2);
      life.energy = Math.max(8, (life.energy ?? 86) - 2);

      const newSick = this._maybeTriggerRoommateSickness(life, 'tick');
      if (newSick) {
        eventPayload = { type: 'got_sick', person, sick: newSick };
      } else if (life.activity === 'idle') {
        if (life.energy <= 24) {
          life.activity = 'sleeping';
          eventPayload = { type: 'went_sleep', person };
        } else if (life.hunger <= 32) {
          const homeState = HomeManager.getState();
          if ((homeState.inventory.fridgeSnacks || 0) > 0) {
            homeState.inventory.fridgeSnacks -= 1;
            HomeManager.saveState(homeState);
            life.hunger = Math.min(100, life.hunger + 36);
          } else {
            life.hunger = Math.min(100, life.hunger + 26);
          }
          life.activity = 'eating';
          life.activityStartedAt = now;
          life.activityEndsAt = now + 6500;
          eventPayload = { type: 'auto_eat', person };
        } else if (life.thirst <= 32) {
          const homeState = HomeManager.getState();
          if ((homeState.inventory.drinks || 0) > 0) {
            homeState.inventory.drinks -= 1;
            HomeManager.saveState(homeState);
            life.thirst = Math.min(100, life.thirst + 38);
          } else {
            life.thirst = Math.min(100, life.thirst + 24);
          }
          life.activity = 'drinking';
          life.activityStartedAt = now;
          life.activityEndsAt = now + 6000;
          eventPayload = { type: 'auto_drink', person };
        } else if (!life.sick && life.energy >= 58 && Math.random() < 0.08) {
          life.activity = 'working';
          life.activityStartedAt = now;
          life.activityEndsAt = now + 20000;
          eventPayload = { type: 'went_work', person };
        }
      }
    }

    life.lastTick = now;
    freshState.roommateLife = life;
    this.saveState(freshState);
    if (eventPayload) {
      window.dispatchEvent(new CustomEvent('runner:roommate-event', { detail: eventPayload }));
    }
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { life, event: eventPayload };
  },

  feedRoommate() {
    const state = this.getState();
    const person = this.getRoommate();
    if (!person) return { ok: false, reason: 'no_roommate' };
    const life = this.getRoommateLife() || getDefaultRoommateLife();
    const homeState = HomeManager.getState();
    let source = 'snack';
    if ((homeState.inventory.fridgeSnacks || 0) > 0) {
      homeState.inventory.fridgeSnacks -= 1;
      HomeManager.saveState(homeState);
      life.hunger = Math.min(100, (life.hunger ?? 70) + 40);
      source = 'fridge_snack';
    } else if ((homeState.inventory.food || 0) > 0) {
      homeState.inventory.food -= 1;
      HomeManager.saveState(homeState);
      life.hunger = Math.min(100, (life.hunger ?? 70) + 45);
      source = 'meal';
    } else {
      life.hunger = Math.min(100, (life.hunger ?? 70) + 26);
    }
    life.activity = 'eating';
    life.activityStartedAt = Date.now();
    life.activityEndsAt = Date.now() + 6500;

    const latest = this.getState();
    latest.roommateLife = life;
    this.saveState(latest);
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { ok: true, person, source, life };
  },

  giveRoommateDrink() {
    const state = this.getState();
    const person = this.getRoommate();
    if (!person) return { ok: false, reason: 'no_roommate' };
    const life = this.getRoommateLife() || getDefaultRoommateLife();
    const homeState = HomeManager.getState();
    let usedStock = false;
    if ((homeState.inventory.drinks || 0) > 0) {
      homeState.inventory.drinks -= 1;
      HomeManager.saveState(homeState);
      life.thirst = Math.min(100, (life.thirst ?? 70) + 42);
      life.energy = Math.min(100, (life.energy ?? 80) + 4);
      usedStock = true;
    } else {
      life.thirst = Math.min(100, (life.thirst ?? 70) + 25);
    }
    life.activity = 'drinking';
    life.activityStartedAt = Date.now();
    life.activityEndsAt = Date.now() + 6000;

    const latest = this.getState();
    latest.roommateLife = life;
    this.saveState(latest);
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { ok: true, person, usedStock, life };
  },

  sendRoommateToWork() {
    const person = this.getRoommate();
    if (!person) return { ok: false, reason: 'no_roommate' };
    const life = this.getRoommateLife() || getDefaultRoommateLife();
    if (life.activity === 'working') {
      return { ok: false, reason: 'already_working', person, life };
    }
    if (life.sick) {
      return { ok: false, reason: 'sick', person, life };
    }
    if ((life.energy ?? 80) < 22) {
      return { ok: false, reason: 'tired', person, life };
    }
    life.activity = 'working';
    life.activityStartedAt = Date.now();
    life.activityEndsAt = Date.now() + 18000;
    const latest = this.getState();
    latest.roommateLife = life;
    this.saveState(latest);
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { ok: true, person, life };
  },

  toggleRoommateSleep() {
    const person = this.getRoommate();
    if (!person) return { ok: false, reason: 'no_roommate' };
    const life = this.getRoommateLife() || getDefaultRoommateLife();
    if (life.activity === 'working') {
      return { ok: false, reason: 'working', person, life };
    }
    const sleeping = life.activity === 'sleeping';
    life.activity = sleeping ? 'idle' : 'sleeping';
    life.activityStartedAt = Date.now();
    life.activityEndsAt = 0;
    const latest = this.getState();
    latest.roommateLife = life;
    this.saveState(latest);
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { ok: true, sleeping: !sleeping, person, life };
  },

  healRoommate() {
    const person = this.getRoommate();
    if (!person) return { ok: false, reason: 'no_roommate' };
    const life = this.getRoommateLife() || getDefaultRoommateLife();
    if (!life.sick) {
      return { ok: false, reason: 'healthy', person, life };
    }
    const homeState = HomeManager.getState();
    const meds = homeState.inventory.medicine || 0;
    if (meds <= 0) {
      return { ok: false, reason: 'no_medicine', person, life };
    }
    homeState.inventory.medicine = meds - 1;
    HomeManager.saveState(homeState);
    life.sick = null;
    life.energy = Math.min(100, (life.energy ?? 75) + 22);
    life.thirst = Math.min(100, (life.thirst ?? 70) + 14);
    if (life.activity === 'sleeping') life.activity = 'idle';

    const latest = this.getState();
    latest.roommateLife = life;
    this.saveState(latest);
    const bonusCoins = 3;
    BankManager.depositEarned(bonusCoins, `🍵 Pflege-Dankeschön (${person.name})`);
    window.dispatchEvent(new CustomEvent('runner:roommate-life-updated', { detail: { life } }));
    return { ok: true, person, bonusCoins, remaining: homeState.inventory.medicine, life };
  },

  getAcquaintanceProgress(personId) {
    const state = this.getState();
    const rec = state.acquaintances[personId];
    return rec || { stage: 0, points: 0, talks: 0, invitedWelcome: false };
  },

  getStageLabel(stage) {
    if (stage >= 3) return '💛 Neue Freundschaft!';
    if (stage === 2) return '🌟 Gute Bekanntschaft';
    if (stage === 1) return '👋 Kennengelernt';
    return '🆕 Neu (Kennenlernen!)';
  },

  getPersonAffinity(personId) {
    const state = this.getState();
    return state.personAffinity[personId] || 0;
  },

  advanceAcquaintance(personId, stepBonus = 1) {
    const person = NEW_ACQUAINTANCES.find((p) => p.id === personId);
    if (!person) return null;

    const state = this.getState();
    const cur = state.acquaintances[personId] || { stage: 0, points: 0, talks: 0, invitedWelcome: false };
    const prevStage = cur.stage;

    cur.talks += 1;
    cur.points += stepBonus;
    if (cur.stage === 0) {
      cur.stage = 1;
    } else if (cur.points >= 4) {
      cur.stage = 3;
    } else if (cur.points >= 2) {
      cur.stage = Math.max(cur.stage, 2);
    }

    let coinsEarned = 0;
    let unlockedMail = false;

    if (prevStage === 0 && cur.stage >= 1) {
      coinsEarned += 5;
      unlockedMail = true;
    }
    if (prevStage < 3 && cur.stage === 3) {
      coinsEarned += 10;
    }

    if (coinsEarned > 0) {
      BankManager.depositEarned(coinsEarned, `🌟 Freundschaft mit ${person.name}`);
      ShopManager.recordProgress(0, 1);
    }

    // Deliver a friendly greeting letter into the Briefkasten once befriended (stage >= 2) if not sent yet
    if (cur.stage >= 2 && !cur.invitedWelcome) {
      cur.invitedWelcome = true;
      MailboxManager.deliverCustomMail({
        id: `mail_newfriend_${person.id}`,
        category: 'friend',
        categoryLabel: '🌟 Neue Bekanntschaft',
        senderId: person.id,
        senderName: person.name,
        senderIcon: person.icon,
        title: `Schön, dich kennengelernt zu haben! – ${person.name}`,
        body: `Hallo! Hier ist ${person.name} (${person.role}). Es war so schön, mit dir zu plaudern! Schreib mir gern jederzeit oder lad mich zu einem Ausflug ein!`,
        isInvitation: false,
        rewardCoins: 6
      });
      window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
    }

    state.acquaintances[personId] = cur;
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:social-updated'));

    return {
      person,
      prevStage,
      stage: cur.stage,
      stageLabel: this.getStageLabel(cur.stage),
      coinsEarned,
      unlockedMail
    };
  },

  getBefriendedContacts() {
    const state = this.getState();
    return NEW_ACQUAINTANCES
      .filter((p) => (state.acquaintances[p.id]?.stage || 0) >= 1)
      .map((p) => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        role: p.role,
        isNewFriend: true,
        stage: state.acquaintances[p.id]?.stage || 1
      }));
  },

  recordTalk(personId) {
    const state = this.getState();
    state.personAffinity[personId] = (state.personAffinity[personId] || 0) + 1;
    this.saveState(state);
    if (NEW_ACQUAINTANCES.some((p) => p.id === personId)) {
      return this.advanceAcquaintance(personId, 1);
    }
    return null;
  }
};

const npcChatHistories = new Map();

export async function askPersonAI(target, playerText = '', sceneContext = {}) {
  const text = (playerText || '').trim() || `Hallo ${target?.name || ''}!`;
  const id = target?.id || 'person';
  const name = target?.name || 'Nachbar';

  const newPerson = NEW_ACQUAINTANCES.find((p) => p.id === id) || null;
  const currentRoommate = SocialManager.getRoommate();
  const isRoommateNow = Boolean(currentRoommate && currentRoommate.id === id);
  const homeState = HomeManager.getState();
  const petNames = (homeState.owned?.pets || []).slice(0, 6);
  const roommateLife = isRoommateNow ? SocialManager.getRoommateLife() : null;

  const rawHistory = npcChatHistories.get(id) || [];
  const prevHistory = isRoommateNow
    ? rawHistory.filter((entry) => !/\b(ich bin|mein name ist|kennenlernen|wie heißt du)\b/i.test(entry.text || ''))
    : rawHistory;

  try {
    const resp = await fetch('/api/npc-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: {
          id,
          name,
          icon: target?.icon || newPerson?.icon || '💬',
          role: target?.role || newPerson?.role || 'Bewohner/in der Traumstadt',
          kind: target?.kind || (newPerson ? 'acquaintance' : 'neighbor'),
          hobby: newPerson?.hobby || '',
          favoriteFood: newPerson?.favoriteFood || '',
          spotLabel: newPerson?.spotLabel || '',
          facts: isRoommateNow ? (newPerson?.facts || []).slice(0, 2) : (newPerson?.facts || []),
          jobTitle: newPerson?.jobTitle || '',
          isNewPerson: Boolean(newPerson) && !isRoommateNow
        },
        message: text,
        history: prevHistory.slice(-8),
        context: {
          scene: sceneContext.scene || 'town',
          shopId: sceneContext.shopId || null,
          isRoommate: isRoommateNow,
          hasOwnRoom: HomeManager.hasRoommateRoom(),
          roommateLife,
          playerNeeds: {
            hunger: homeState.needs?.hunger,
            thirst: homeState.needs?.thirst,
            energy: homeState.needs?.energy
          },
          playerSick: homeState.health?.playerSick || null,
          pets: petNames
        }
      })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data?.reply) {
      const errMsg = data?.error || `Antwort fehlgeschlagen (Status ${resp.status})`;
      return {
        ok: false,
        error: errMsg,
        code: data?.code || 'API_ERROR'
      };
    }

    let reply = String(data.reply).trim();
    if (isRoommateNow) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const introRe = new RegExp(`^(?:(?:hallo|hey|hi|huhu|oh)[\\s,!.]*)*(?:ich\\s+bin|mein\\s+name\\s+ist)\\s+${escapedName}\\b[^.!?]*[.!?]?\\s*`, 'i');
      const cleaned = reply.replace(introRe, '').trim();
      if (cleaned) reply = cleaned;
    }
    const updatedHistory = [
      ...prevHistory,
      { role: 'user', text },
      { role: 'model', text: reply }
    ].slice(-10);
    npcChatHistories.set(id, updatedHistory);

    const progress = SocialManager.recordTalk(id);

    const explicitMoveIn = /(zusammen\s*zieh|zusammen\s*wohn|einzieh|bei mir (wohn|leb)|mit mir (wohn|leb)|ziehst du (zu|mit)|mitbewohner|in mein haus|wg gründen|wg mit mir)/i.test(text);
    let movedInResult = null;
    if (newPerson && !isRoommateNow && (data.agreesToMoveIn || explicitMoveIn)) {
      movedInResult = SocialManager.moveInWith(id);
      if (movedInResult?.ok && movedInResult.bonusCoins > 0) {
        reply += ` (+${movedInResult.bonusCoins} 🪙 auf dein 🏦 Bankkonto!)`;
      }
    } else if (progress && progress.prevStage < 3 && progress.stage === 3) {
      reply += ' 🎉 Wir sind jetzt echte neue Freunde! (+10 🪙 auf die 🏦 Bank)';
    } else if (progress && progress.prevStage === 0 && progress.coinsEarned > 0) {
      reply += ` (+${progress.coinsEarned} 🪙 auf die 🏦 Bank!)`;
    }

    return {
      ok: true,
      reply,
      bubble: reply.length > 52 ? `${reply.slice(0, 49)}…` : reply,
      progress,
      movedIn: Boolean(movedInResult?.ok),
      moveInData: movedInResult
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || 'Netzwerkfehler bei der Gesprächsanfrage.',
      code: 'NETWORK_ERROR'
    };
  }
}
