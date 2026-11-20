import { HomeManager } from '../home/homeData.js';
import { ShopManager } from '../editor/shopData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';

const SOCIAL_KEY = 'runner_social_state';

export const NEW_ACQUAINTANCES = [
  {
    id: 'mila',
    name: 'Mila',
    icon: '📸',
    role: 'Tierfotografin',
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
    hobby: 'Aquarell-Bilder malen & gemütlich im Café lesen',
    favoriteFood: 'Erdbeer-Shake & Kakao ☕',
    townX: 2795,
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

function getDefaultSocialState() {
  return {
    acquaintances: {}, // { [id]: { stage: 0..3, points: 0, talks: 0, invitedWelcome: false } }
    personAffinity: {} // { [id]: number }
  };
}

export const SocialManager = {
  getState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SOCIAL_KEY));
      if (saved && typeof saved === 'object') {
        return {
          acquaintances: saved.acquaintances || {},
          personAffinity: saved.personAffinity || {}
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
      coinsEarned += 10;
      unlockedMail = true;
    }
    if (prevStage < 3 && cur.stage === 3) {
      coinsEarned += 20;
    }

    if (coinsEarned > 0) {
      ShopManager.addCoins(coinsEarned);
      ShopManager.recordProgress(0, 1);
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
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
        rewardCoins: 15
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

export function generatePersonReply(target, playerText = '', sceneContext = {}) {
  const text = (playerText || '').trim();
  const q = text.toLowerCase();
  const id = target?.id || 'person';
  const name = target?.name || 'Nachbar';

  // Advance acquaintance/talk counter
  const progress = SocialManager.recordTalk(id);

  // 1. New Acquaintances (Mila, Tom, Lina) have rich Kennenlernen replies!
  const newPerson = NEW_ACQUAINTANCES.find((p) => p.id === id);
  if (newPerson) {
    let reply = '';
    if (progress && progress.prevStage === 0) {
      reply = newPerson.introLine;
    } else if (/\b(hobby|machst|beruf|arbeit|foto|mal|skaten|garten)\b/.test(q)) {
      reply = `Mein Hobby ist: ${newPerson.hobby}! Und was machst du am liebsten? 😊`;
    } else if (/\b(essen|eis|liebling|trinken|snack)\b/.test(q)) {
      reply = `Ich liebe ${newPerson.favoriteFood}! Gehen wir da bald zusammen hin?`;
    } else if (/\b(freund|einlad|treffen|brief)\b/.test(q)) {
      reply = `Ja total gerne! Du findest mich ab jetzt auch in deinem Briefkasten zum Schreiben & Einladen! 💌`;
    } else if (/\b(hallo|hi|hey|guten|servus|moin|name|heißt|vorstellen)\b/.test(q)) {
      reply = `Hallo! Freut mich riesig, dich kennenzulernen! Ich bin ${newPerson.name} (${newPerson.role}).`;
    } else if (/\b(toll|cool|schön|super|nett|lieb|danke)\b/.test(q)) {
      reply = `Aww, danke! Du bist echt super sympathisch! ✨`;
    } else {
      const idx = (SocialManager.getAcquaintanceProgress(id).talks || 0) % newPerson.facts.length;
      reply = newPerson.facts[idx];
    }

    if (progress && progress.prevStage < 3 && progress.stage === 3) {
      reply += ' 🎉 Wir sind jetzt echte neue Freunde! (+20 🪙)';
    } else if (progress && progress.prevStage === 0 && progress.coinsEarned > 0) {
      reply += ` (+${progress.coinsEarned} 🪙 Kennenlern-Bonus!)`;
    }
    return {
      reply,
      bubble: reply.length > 52 ? `${reply.slice(0, 49)}…` : reply,
      progress
    };
  }

  // 2. Keyword-matched replies for any neighbor, cashier, shopper, café guest, or friend
  if (/\b(hallo|hi|hey|guten|morgen|tag|abend)\b/.test(q)) {
    const greets = [
      `Hallo! Wie schön, dass du kurz vorbeischaust! 😊`,
      `Hi! Alles super bei mir – und bei dir heute?`,
      `Hallo! Schönes Wetter heute in unserer Traumstadt!`
    ];
    const r = greets[Math.floor(Math.random() * greets.length)];
    return { reply: r, bubble: r };
  }

  if (/\b(wie geht|alles gut|alles klar)\b/.test(q)) {
    const r = `Mir geht es prima, danke der Nachfrage! Und deinen Tieren hoffentlich auch! 🌞`;
    return { reply: r, bubble: r };
  }

  if (/\b(tier|hund|katze|hase|bello|fuchs|einhorn|süß)\b/.test(q)) {
    const r = `Deine Tiere sind so goldig und gut erzogen! Hörten sie gerade auf deine Anweisungen? 🐾`;
    return { reply: r, bubble: 'Deine Tiere sind so süß! 🐾' };
  }

  if (/\b(kauf|preis|kostet|kasse|regal|frisur|farbe|kleid|schuh|eis|waffel|essen|kaffee|kakao)\b/.test(q)) {
    if (sceneContext.scene === 'store') {
      const r = `Schau dich ganz in Ruhe um! Alles aus dem Regal legst du einfach in deinen Korb.`;
      return { reply: r, bubble: 'Schau dich gern um! 🛍️' };
    }
    if (sceneContext.scene === 'icecream') {
      const r = `Das sieht hier alles so lecker aus! Ein frisches Eis oder eine Waffel geht immer! 🍦`;
      return { reply: r, bubble: 'Mmmh, so lecker hier! 🍦' };
    }
    const r = `Die Einkaufsstraße hat heute wieder tolle Sachen im Angebot!`;
    return { reply: r, bubble: r };
  }

  if (/\b(danke|super|toll|schön|cool|klasse|lieb)\b/.test(q)) {
    const r = `Sehr gerne! Mit so netten Leuten wie dir macht die Traumstadt doppelt Spaß! ❤️`;
    return { reply: r, bubble: 'Danke, du bist super! ❤️' };
  }

  if (/\b(tschüss|ciao|bis bald|wiedersehen)\b/.test(q)) {
    const r = `Bis ganz bald! Pass gut auf dich und deine Tiere auf! 👋`;
    return { reply: r, bubble: 'Bis bald! 👋' };
  }

  // 3. Context-specific fallback pools
  if (NEIGHBOR_DIRECTORY[id]) {
    const pool = NEIGHBOR_DIRECTORY[id].topics;
    const r = pool[Math.floor(Math.random() * pool.length)];
    return { reply: r, bubble: r.length > 48 ? `${r.slice(0, 45)}…` : r };
  }

  if (target?.kind === 'cashier') {
    const r = `Hallo! Brauchst du Hilfe im Laden oder möchtest du gleich bezahlen? 😊`;
    return { reply: r, bubble: 'Kann ich dir helfen? 😊' };
  }

  if (target?.kind === 'shopper') {
    const r = `Ich schaue hier gerade ein bisschen durch die Regale – hier gibt es echt tolle Sachen!`;
    return { reply: r, bubble: 'Hier gibt es tolle Sachen!' };
  }

  if (target?.kind === 'guest') {
    const r = `Danke, dass du uns im Café bedienst! Es schmeckt hier immer fantastisch! 🍨`;
    return { reply: r, bubble: 'Es schmeckt fantastisch! 🍨' };
  }

  const fallback = `Das ist ja spannend! Schön, mit dir zu plaudern, ${name} hört dir gern zu! 💬`;
  return { reply: fallback, bubble: `Schön mit dir zu reden! 💬` };
}
