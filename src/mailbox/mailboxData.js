import { ShopManager } from '../editor/shopData.js';
import { BankManager } from '../economy/bankData.js';
import { HomeManager } from '../home/homeData.js';

const MAILBOX_KEY = 'runner_mailbox_state';

export const MAIL_CONTACTS = [
  { id: 'frieda', name: 'Oma Frieda', icon: '🏡', role: 'Nachbarin & Bäckerin' },
  { id: 'weber', name: 'Herr Weber', icon: '🐕', role: 'Hundefreund von nebenan' },
  { id: 'kaya', name: 'Frau Kaya', icon: '🐱', role: 'Tierliebhaberin & Gärtnerin' },
  { id: 'mia', name: 'Mia', icon: '🍦', role: 'Chefin im Traum-Café' },
  { id: 'leo', name: 'Leo', icon: '🏃', role: 'Lauf-Freund im Stadion' }
];

const MET_FRIEND_PROFILES = [
  { id: 'mila', name: 'Mila', icon: '📸', role: 'Tierfotografin (Neue Bekanntschaft)' },
  { id: 'tom', name: 'Tom', icon: '🛹', role: 'Gärtner & Skater (Neue Bekanntschaft)' },
  { id: 'lina', name: 'Lina', icon: '🎨', role: 'Malerin & Buchfreundin (Neue Bekanntschaft)' }
];

export function getAllMailContacts() {
  let metMap = {};
  try {
    const saved = JSON.parse(localStorage.getItem('runner_social_state') || '{}');
    metMap = saved.acquaintances || {};
  } catch {
    metMap = {};
  }
  const unlocked = MET_FRIEND_PROFILES.filter((p) => (metMap[p.id]?.stage || 0) >= 1);
  return [...MAIL_CONTACTS, ...unlocked];
}

export const INVITE_EVENT_TYPES = [
  { id: 'treasure_hunt', icon: '🗺️', label: 'Schatzsuche am Meer', defaultMsg: 'Ich habe eine geheimnisvolle Schatzkarte gefunden! Lass uns zusammen echte Schätze ausgraben!', activity: { kind: 'treasure_hunt', theme: 'treasure_island', title: 'Schatzsuche auf der Insel', reward: 34 } },
  { id: 'band_jam', icon: '🎶', label: 'Musik- & Band-Konzert', defaultMsg: 'Wir gründen heute eine Band auf der Bühne! Schnapp dir ein Instrument und spiel mit!', activity: { kind: 'band_jam', theme: 'stage', title: 'Traumstadt-Band-Konzert', reward: 34 } },
  { id: 'hide_and_seek', icon: '🙈', label: 'Versteckspiel im Zauberwald', defaultMsg: 'Komm in den Zauberwald — wir spielen Verstecken zwischen Büschen, Zelten & Baumhäusern!', activity: { kind: 'hide_and_seek', theme: 'forest_hide', title: 'Versteckspiel im Zauberwald', reward: 32 } },
  { id: 'baking_fest', icon: '🧁', label: 'Back- & Pizza-Fest', defaultMsg: 'Heute wird der große Steinofen angeheizt! Wir kneten Teig, backen Pizza & verzieren Torten!', activity: { kind: 'baking_fest', theme: 'bakery', title: 'Großes Back- & Pizza-Fest', reward: 32 } },
  { id: 'stargazing', icon: '🌠', label: 'Sternschnuppen-Nacht', defaultMsg: 'Heute Nacht fallen Sternschnuppen und wir lassen bunte Himmels-Laternen steigen!', activity: { kind: 'stargazing', theme: 'night_sky', title: 'Sternschnuppen- & Lampion-Nacht', reward: 35 } },
  { id: 'party', icon: '🥳', label: 'Party bei mir zu Hause', defaultMsg: 'Ich feiere eine fröhliche Party bei mir im Haus! Es gibt Musik und Snacks.', activity: { kind: 'party', theme: 'home_party', title: 'Party bei mir zu Hause', reward: 26 } },
  { id: 'cafe', icon: '🍰', label: 'Eis & Waffeln im Café', defaultMsg: 'Lass uns gemeinsam leckeres Eis und warme Waffeln im Traum-Café essen!', activity: { kind: 'cafe_contest', theme: 'cafe', title: 'Eis- & Waffel-Treffen', reward: 26 } },
  { id: 'garden', icon: '🌳', label: 'Garten-Picknick', defaultMsg: 'Komm durchs Gartentor zu meinem Picknick im Garten – wir können auch spielen!', activity: { kind: 'trip', theme: 'garden', title: 'Garten-Picknick', reward: 24 } },
  { id: 'race', icon: '🏆', label: 'Freundschafts-Wettbewerb', defaultMsg: 'Hast du Lust auf einen spannenden kleinen Lauf-Wettbewerb im Stadion?', activity: { kind: 'race', theme: 'stadium', title: 'Freundschafts-Wettbewerb', reward: 30 } },
  { id: 'trip', icon: '🚌', label: 'Gemeinsamer Ausflug', defaultMsg: 'Wir machen einen schönen Ausflug durch die Traumstadt – kommst du mit?', activity: { kind: 'trip', theme: 'forest', title: 'Gemeinsamer Ausflug', reward: 26 } }
];

export const INVITE_TIMES = [
  'Heute Nachmittag',
  'Heute um 17:00 Uhr',
  'Morgen um 15:00 Uhr',
  'Am Wochenende'
];

export const QUICK_PHRASES = [
  'Hallo! Wie geht es dir heute? 😊',
  'Komm mich bald in meinem Haus besuchen! 🏡',
  'Vielen Dank für die schöne Zeit! ❤️',
  'Wollen wir zusammen ein Eis essen? 🍦',
  'Ich freu mich schon auf unser nächstes Treffen! 🎉'
];

const LETTER_TEMPLATES = [
  // Brandneue Abenteuer- & Erlebnis-Einladungen
  {
    category: 'adventure',
    categoryLabel: '🗺️ Schatzsuche',
    senderId: 'leo',
    title: 'Geheime Piraten-Schatzsuche an der Bucht!',
    body: 'Ich habe am Strand eine echte Schatzkarte gefunden! Mit dem Schatz-Radar graben wir nach Diamanten & Goldkronen. Bist du dabei?',
    eventTime: 'Heute Nachmittag an der Bucht',
    isInvitation: true,
    rewardCoins: 34,
    activity: { kind: 'treasure_hunt', theme: 'treasure_island', title: 'Geheime Piraten-Schatzsuche', reward: 34 }
  },
  {
    category: 'concert',
    categoryLabel: '🎶 Konzert',
    senderId: 'mia',
    title: 'Großes Traumstadt-Band-Konzert auf der Bühne!',
    body: 'Wir spielen heute alle zusammen Gitarre, Klavier, Schlagzeug & Mikrofon! Schnapp dir die bunten Musik-Noten im Takt!',
    eventTime: 'Heute um 18:30 Uhr',
    isInvitation: true,
    rewardCoins: 34,
    activity: { kind: 'band_jam', theme: 'stage', title: 'Traumstadt-Band-Konzert', reward: 34 }
  },
  {
    category: 'game',
    categoryLabel: '🙈 Spiel-Treffen',
    senderId: 'kaya',
    title: 'Großes Versteckspiel im Zauberwald!',
    body: 'Oma Frieda, Herr Weber, Mia, Leo und ich verstecken uns im Wald! Kannst du alle 5 Freunde in ihren Verstecken finden?',
    eventTime: 'Jetzt im Zauberwald',
    isInvitation: true,
    rewardCoins: 32,
    activity: { kind: 'hide_and_seek', theme: 'forest_hide', title: 'Versteckspiel im Zauberwald', reward: 32 }
  },
  {
    category: 'bakery',
    categoryLabel: '🧁 Back-Fest',
    senderId: 'frieda',
    title: 'Oma Friedas Back- & Pizza-Fest am Steinofen!',
    body: 'Komm zum gemeinsamen Backen! Wir rühren Teig, achten genau auf die Ofen-Temperatur und verzieren leckere Torten & Pizzen!',
    eventTime: 'Heute um 15:00 Uhr',
    isInvitation: true,
    rewardCoins: 32,
    activity: { kind: 'baking_fest', theme: 'bakery', title: 'Oma Friedas Back- & Pizza-Fest', reward: 32 }
  },
  {
    category: 'night',
    categoryLabel: '🌠 Sternennacht',
    senderId: 'weber',
    title: 'Sternschnuppen- & Lampion-Nacht auf der Wiese!',
    body: 'Heute Nacht schicken wir leuchtende Himmels-Laternen in den Nachthimmel und fangen funkelnde Sternschnuppen für geheime Wünsche!',
    eventTime: 'Heute Abend unterm Sternenhimmel',
    isInvitation: true,
    rewardCoins: 35,
    activity: { kind: 'stargazing', theme: 'night_sky', title: 'Sternschnuppen- & Lampion-Nacht', reward: 35 }
  },

  // Wettbewerbe
  {
    category: 'competition',
    categoryLabel: '🏆 Wettbewerb',
    senderId: 'leo',
    title: 'Einladung zum Großen Stadtlauf-Wettbewerb!',
    body: 'Hallo! Am Renn-Stadion findet heute unser freundlicher Traumstadt-Wettbewerb statt. Alle Nachbarn feuern dich an – machst du mit?',
    eventTime: 'Heute im Renn-Stadion',
    isInvitation: true,
    rewardCoins: 30,
    targetState: 'BACKGROUND_SELECT',
    activity: { kind: 'race', theme: 'stadium', title: 'Großer Stadtlauf-Wettbewerb', reward: 35 }
  },
  {
    category: 'competition',
    categoryLabel: '🏆 Wettbewerb',
    senderId: 'mia',
    title: 'Eis- & Waffel-Meisterschaft im Café!',
    body: 'Hey! Ich suche den besten Eis-Profi der Stadt für unseren kleinen Café-Wettbewerb. Hast du Lust mitzumachen?',
    eventTime: 'Heute um 15:30 Uhr',
    isInvitation: true,
    rewardCoins: 28,
    targetState: 'ICECREAM',
    activity: { kind: 'cafe_contest', theme: 'cafe', title: 'Eis- & Waffel-Meisterschaft', reward: 32 }
  },
  {
    category: 'competition',
    categoryLabel: '🏆 Wettbewerb',
    senderId: 'weber',
    title: 'Hunde-Trick-Wettbewerb auf der Wiese!',
    body: 'Bello hat einen neuen Trick gelernt! Wir veranstalten einen lustigen Tier-Wettbewerb in der Nachbarschaft. Bist du dabei?',
    eventTime: 'Morgen um 14:00 Uhr',
    isInvitation: true,
    rewardCoins: 28,
    targetState: 'PETSITTING',
    activity: { kind: 'pet_show', theme: 'meadow', title: 'Hunde-Trick-Wettbewerb', reward: 32 }
  },
  {
    category: 'competition',
    categoryLabel: '🏆 Wettbewerb',
    senderId: 'kaya',
    title: 'Schönster-Garten-Wettbewerb!',
    body: 'Deine Blumen sehen so toll aus! Möchtest du deinen Garten heute für unseren Nachbarschafts-Wettbewerb anmelden?',
    eventTime: 'Diese Woche',
    isInvitation: true,
    rewardCoins: 26,
    targetState: 'HOME',
    targetPayload: { room: 'garden' },
    activity: { kind: 'garden_contest', theme: 'garden', title: 'Schönster-Garten-Wettbewerb', reward: 30 }
  },

  // Partys
  {
    category: 'party',
    categoryLabel: '🥳 Party',
    senderId: 'frieda',
    title: 'Oma Friedas Erdbeerkuchen-Party!',
    body: 'Hallo Liebes! Ich habe frisch gebacken und lade alle zu einer gemütlichen Garten-Party bei mir ein. Kommst du vorbei?',
    eventTime: 'Heute um 16:00 Uhr',
    isInvitation: true,
    rewardCoins: 24,
    targetState: 'PETSITTING',
    activity: { kind: 'party', theme: 'garden_party', title: 'Oma Friedas Erdbeerkuchen-Party', reward: 28 }
  },
  {
    category: 'party',
    categoryLabel: '🥳 Party',
    senderId: 'mia',
    title: 'Bunte Sommer-Eisparty im Traum-Café!',
    body: 'Heute Abend steigt eine fröhliche Musik- & Eisparty bei mir! Es gibt Waffeln und Limo für alle Freunde.',
    eventTime: 'Heute Abend um 18:00 Uhr',
    isInvitation: true,
    rewardCoins: 25,
    targetState: 'ICECREAM',
    activity: { kind: 'party', theme: 'ice_party', title: 'Sommer-Eisparty', reward: 28 }
  },
  {
    category: 'party',
    categoryLabel: '🥳 Party',
    senderId: 'leo',
    title: 'Überraschungs-Party nach dem Training!',
    body: 'Wir feiern alle neuen Level und Outfits in der Style-Boutique! Bist du bei unserer Party dabei?',
    eventTime: 'Morgen um 17:00 Uhr',
    isInvitation: true,
    rewardCoins: 22,
    targetState: 'EDITOR',
    activity: { kind: 'party', theme: 'boutique_party', title: 'Überraschungs-Party', reward: 26 }
  },

  // Ausflüge
  {
    category: 'trip',
    categoryLabel: '🚌 Ausflug',
    senderId: 'kaya',
    title: 'Ausflug an den Tropen-Strand!',
    body: 'Wir wollen morgen zusammen einen sonnigen Ausflug ans Meer machen, Muscheln sammeln und picknicken. Kommst du mit?',
    eventTime: 'Morgen Vormittag',
    isInvitation: true,
    rewardCoins: 26,
    targetState: 'BACKGROUND_SELECT',
    activity: { kind: 'trip', theme: 'beach', title: 'Ausflug an den Tropen-Strand', reward: 30 }
  },
  {
    category: 'trip',
    categoryLabel: '🚌 Ausflug',
    senderId: 'weber',
    title: 'Wald-Spaziergang & Picknick mit den Hunden!',
    body: 'Bello, Flocke und ich machen einen großen Ausflug ins Grüne. Begleitest du uns?',
    eventTime: 'Heute Nachmittag',
    isInvitation: true,
    rewardCoins: 24,
    targetState: 'PETSITTING',
    activity: { kind: 'trip', theme: 'forest', title: 'Wald-Spaziergang & Picknick', reward: 28 }
  },
  {
    category: 'trip',
    categoryLabel: '🚌 Ausflug',
    senderId: 'frieda',
    title: 'Gemütlicher Ausflug in die Eiswelt!',
    body: 'Pack deine warme Jacke ein – wir fahren mit der ganzen Straße zum Schlitten-Ausflug in die Eiswelt!',
    eventTime: 'Am Wochenende',
    isInvitation: true,
    rewardCoins: 28,
    targetState: 'BACKGROUND_SELECT',
    activity: { kind: 'trip', theme: 'ice', title: 'Ausflug in die Eiswelt', reward: 32 }
  },

  // Sonstiges / Briefe & Geschenke
  {
    category: 'letter',
    categoryLabel: '💌 Brief & Gruß',
    senderId: 'frieda',
    title: 'Ein kleines Taschengeld & Dankeschön!',
    body: 'Du kümmerst dich immer so lieb um dein Haus und die Nachbarschaft. Hier ist ein kleiner Gruß für deine Spardose!',
    isInvitation: false,
    rewardCoins: 20
  },
  {
    category: 'letter',
    categoryLabel: '💌 Rezept-Post',
    senderId: 'mia',
    title: 'Frische Zutaten für deine Küche!',
    body: 'Ich hatte heute extra frisches Gemüse und Beeren im Café übrig und habe sie dir direkt mitgeschickt!',
    isInvitation: false,
    rewardCoins: 10,
    giftSupply: { key: 'food', amount: 2, label: '+2 🥘 Koch-Zutaten' }
  },
  {
    category: 'letter',
    categoryLabel: '💌 Tier-Gruß',
    senderId: 'weber',
    title: 'Leckerlis für deine lieben Tiere!',
    body: 'Bello lässt schön grüßen und schickt dir und deinen Haustieren eine Tüte knuspriger Leckerlis!',
    isInvitation: false,
    rewardCoins: 10,
    giftSupply: { key: 'petFood', amount: 2, label: '+2 🦴 Tierfutter' }
  }
];

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getContact(id) {
  return getAllMailContacts().find((c) => c.id === id)
    || MET_FRIEND_PROFILES.find((c) => c.id === id)
    || MAIL_CONTACTS[0];
}

function getDefaultMailboxState() {
  return {
    inbox: [],
    sent: [],
    completedEvents: [],
    lastDeliveryDate: '',
    deliveredToday: 0,
    nextTemplateIdx: 0,
    newVarietyV2Seeded: false
  };
}

function createMailFromTemplate(tpl, dateKey) {
  const contact = getContact(tpl.senderId);
  return {
    id: `mail_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    dateKey,
    timestamp: Date.now(),
    category: tpl.category,
    categoryLabel: tpl.categoryLabel,
    senderId: contact.id,
    senderName: contact.name,
    senderIcon: contact.icon,
    title: tpl.title,
    body: tpl.body,
    eventTime: tpl.eventTime || '',
    isInvitation: !!tpl.isInvitation,
    rsvpStatus: tpl.isInvitation ? 'pending' : null,
    rewardCoins: tpl.rewardCoins || 15,
    giftSupply: tpl.giftSupply || null,
    giftClaimed: false,
    targetState: tpl.targetState || null,
    targetPayload: tpl.targetPayload || null,
    activity: tpl.activity || null,
    read: false
  };
}

export const MailboxManager = {
  getState() {
    try {
      const raw = localStorage.getItem(MAILBOX_KEY);
      if (!raw) return getDefaultMailboxState();
      const parsed = JSON.parse(raw);
      return {
        inbox: Array.isArray(parsed.inbox) ? parsed.inbox : [],
        sent: Array.isArray(parsed.sent) ? parsed.sent : [],
        completedEvents: Array.isArray(parsed.completedEvents) ? parsed.completedEvents : [],
        lastDeliveryDate: parsed.lastDeliveryDate || '',
        deliveredToday: parsed.deliveredToday || 0,
        nextTemplateIdx: parsed.nextTemplateIdx || 0,
        newVarietyV2Seeded: Boolean(parsed.newVarietyV2Seeded)
      };
    } catch {
      return getDefaultMailboxState();
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(MAILBOX_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  },

  hasMailbox() {
    return HomeManager.hasMailbox();
  },

  ensureDailyMail() {
    if (!this.hasMailbox()) return { delivered: [] };
    const state = this.getState();
    const todayKey = getTodayKey();
    const delivered = [];
    let dirty = false;

    if (!state.newVarietyV2Seeded) {
      state.newVarietyV2Seeded = true;
      dirty = true;
      // Guarantee immediate arrival of brand-new invitation types
      [LETTER_TEMPLATES[0], LETTER_TEMPLATES[1], LETTER_TEMPLATES[2]].forEach((tpl, idx) => {
        if (!state.inbox.some((m) => m.title === tpl.title && m.rsvpStatus === 'pending')) {
          const mail = createMailFromTemplate(tpl, todayKey);
          mail.timestamp = Date.now() + idx;
          state.inbox.unshift(mail);
          delivered.push(mail);
        }
      });
    }

    if (state.lastDeliveryDate !== todayKey) {
      state.lastDeliveryDate = todayKey;
      state.deliveredToday = 0;
      dirty = true;

      // Deliver 1 or 2 fresh letters per day
      const dailyCount = state.inbox.length <= 3 ? 1 : (Math.random() < 0.72 ? 2 : 1);
      for (let i = 0; i < dailyCount; i++) {
        const tplIdx = (state.nextTemplateIdx + i * 3) % LETTER_TEMPLATES.length;
        const tpl = LETTER_TEMPLATES[tplIdx];
        if (!state.inbox.some((m) => m.title === tpl.title && m.rsvpStatus === 'pending')) {
          const mail = createMailFromTemplate(tpl, todayKey);
          state.inbox.unshift(mail);
          delivered.push(mail);
          state.deliveredToday += 1;
        }
      }
      state.nextTemplateIdx = (state.nextTemplateIdx + dailyCount * 3 + 1) % LETTER_TEMPLATES.length;
    }

    if (dirty) {
      if (state.inbox.length > 40) {
        state.inbox = state.inbox.slice(0, 40);
      }
      this.saveState(state);
    }

    return { delivered, state };
  },

  deliverExtraPost() {
    if (!this.hasMailbox()) return { ok: false };
    const state = this.getState();
    const todayKey = getTodayKey();
    const pendingTitles = new Set(state.inbox.filter((m) => m.rsvpStatus === 'pending').map((m) => m.title));

    // Prefer varied invitations not currently pending in inbox
    const candidates = LETTER_TEMPLATES.filter((t) => t.isInvitation && !pendingTitles.has(t.title));
    const pool = candidates.length > 0 ? candidates : LETTER_TEMPLATES.filter((t) => t.isInvitation);
    const picked = pool[state.nextTemplateIdx % pool.length] || LETTER_TEMPLATES[0];

    const mail = createMailFromTemplate(picked, todayKey);
    state.inbox.unshift(mail);
    state.nextTemplateIdx = (state.nextTemplateIdx + 1) % LETTER_TEMPLATES.length;
    if (state.inbox.length > 40) state.inbox = state.inbox.slice(0, 40);
    this.saveState(state);
    return { ok: true, mail };
  },

  deliverCustomMail(entry) {
    if (!entry) return { ok: false };
    const state = this.getState();
    const todayKey = getTodayKey();
    if (entry.id && state.inbox.some((m) => m.id === entry.id)) {
      return { ok: false, duplicate: true };
    }
    const mail = {
      id: entry.id || `mail_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      dateKey: todayKey,
      timestamp: Date.now(),
      category: entry.category || 'friend',
      categoryLabel: entry.categoryLabel || '💌 Brief',
      senderId: entry.senderId || 'mila',
      senderName: entry.senderName || 'Neue Freundin',
      senderIcon: entry.senderIcon || '🌟',
      title: entry.title || 'Hallo aus der Traumstadt!',
      body: entry.body || '',
      eventTime: entry.eventTime || '',
      isInvitation: !!entry.isInvitation,
      rsvpStatus: entry.isInvitation ? 'pending' : null,
      rewardCoins: entry.rewardCoins || 15,
      giftSupply: entry.giftSupply || null,
      giftClaimed: false,
      targetState: entry.targetState || null,
      targetPayload: entry.targetPayload || null,
      activity: entry.activity || null,
      read: false
    };
    state.inbox.unshift(mail);
    if (state.inbox.length > 40) state.inbox = state.inbox.slice(0, 40);
    this.saveState(state);
    return { ok: true, mail };
  },

  getUnreadCount() {
    if (!this.hasMailbox()) return 0;
    const state = this.getState();
    return state.inbox.filter((m) => !m.read || (m.isInvitation && m.rsvpStatus === 'pending')).length;
  },

  getPendingCount() {
    if (!this.hasMailbox()) return 0;
    const state = this.getState();
    return state.inbox.filter((m) => (m.isInvitation && m.rsvpStatus === 'pending') || (!m.isInvitation && !m.giftClaimed)).length;
  },

  markAllRead() {
    const state = this.getState();
    let changed = false;
    state.inbox.forEach((m) => {
      if (!m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) this.saveState(state);
  },

  respondToInvitation(mailId, decision) {
    const state = this.getState();
    const mail = state.inbox.find((m) => m.id === mailId);
    if (!mail || !mail.isInvitation || mail.rsvpStatus !== 'pending') {
      return { ok: false };
    }

    mail.read = true;
    mail.rsvpStatus = decision === 'accept' ? 'accepted' : 'declined';

    let coinsEarned = 0;
    let levelUpBonus = 0;
    if (decision === 'accept') {
      const goldBonus = HomeManager.hasItem('garden', 'gold_mailbox') ? 4 : 0;
      coinsEarned = Math.max(5, Math.round((mail.rewardCoins || 16) * 0.5)) + goldBonus;
      mail.giftClaimed = true;
      BankManager.depositEarned(coinsEarned, '📬 Einladungs-Bonus');
      const prog = ShopManager.recordProgress(0, 1);
      levelUpBonus = prog.levelUpBonus;
    }

    this.saveState(state);
    return {
      ok: true,
      decision: mail.rsvpStatus,
      coinsEarned,
      levelUpBonus,
      mail
    };
  },

  claimLetterGift(mailId) {
    const state = this.getState();
    const mail = state.inbox.find((m) => m.id === mailId);
    if (!mail || mail.giftClaimed) return { ok: false };

    mail.read = true;
    mail.giftClaimed = true;

    const goldBonus = HomeManager.hasItem('garden', 'gold_mailbox') ? 4 : 0;
    const coinsEarned = Math.max(4, Math.round((mail.rewardCoins || 10) * 0.5)) + goldBonus;
    if (coinsEarned > 0) {
      BankManager.depositEarned(coinsEarned, `💌 Geschenk: ${mail.senderName || 'Post'}`);
    }
    if (mail.giftSupply) {
      HomeManager.addSupply(mail.giftSupply.key, mail.giftSupply.amount);
    }
    const prog = ShopManager.recordProgress(0, 1);

    this.saveState(state);
    return {
      ok: true,
      coinsEarned,
      supply: mail.giftSupply,
      levelUpBonus: prog.levelUpBonus,
      mail
    };
  },

  sendLetter({ recipientId, body }) {
    const text = (body || '').trim();
    if (!text) return { ok: false, reason: 'empty' };

    const contact = getContact(recipientId);
    const state = this.getState();
    const todayKey = getTodayKey();

    const sentEntry = {
      id: `sent_${Date.now()}`,
      timestamp: Date.now(),
      dateKey: todayKey,
      kind: 'letter',
      recipientId: contact.id,
      recipientName: contact.name,
      recipientIcon: contact.icon,
      title: `Brief an ${contact.name}`,
      body: text,
      replyStatus: 'replied'
    };
    state.sent.unshift(sentEntry);

    // Friendly reply arrives right in your inbox!
    const replies = [
      `Danke für deinen lieben Brief! Es hat mich riesig gefreut, von dir zu lesen. Ich schicke dir ein kleines Geschenk mit!`,
      `Was für eine schöne Post! Wir sehen uns ganz bestimmt bald wieder in der Traumstadt!`,
      `Vielen lieben Dank für deine Zeilen! Komm jederzeit gerne auf einen Besuch vorbei!`
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const replyMail = {
      id: `mail_reply_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      dateKey: todayKey,
      timestamp: Date.now() + 1,
      category: 'reply',
      categoryLabel: '💌 Antwort-Brief',
      senderId: contact.id,
      senderName: contact.name,
      senderIcon: contact.icon,
      title: `Antwort von ${contact.name}`,
      body: replyText,
      isInvitation: false,
      rsvpStatus: null,
      rewardCoins: 12,
      giftClaimed: false,
      read: false
    };
    state.inbox.unshift(replyMail);
    if (state.sent.length > 40) state.sent = state.sent.slice(0, 40);
    this.saveState(state);

    const prog = ShopManager.recordProgress(0, 1);
    return { ok: true, sentEntry, replyMail, levelUpBonus: prog.levelUpBonus };
  },

  sendInvitation({ recipientId, eventTypeId, whenLabel, note }) {
    const evt = INVITE_EVENT_TYPES.find((e) => e.id === eventTypeId) || INVITE_EVENT_TYPES[0];
    const allContacts = getAllMailContacts();
    const contacts = recipientId === 'all' ? allContacts : [getContact(recipientId)];
    const state = this.getState();
    const todayKey = getTodayKey();
    const cleanNote = (note || '').trim() || evt.defaultMsg;

    const replies = [];
    contacts.forEach((contact, idx) => {
      // Friendly realistic RSVP: ~82% accept, ~18% politely decline
      const accepted = Math.random() < 0.84;
      const sentEntry = {
        id: `inv_${Date.now()}_${idx}`,
        timestamp: Date.now() + idx,
        dateKey: todayKey,
        kind: 'invite',
        recipientId: contact.id,
        recipientName: contact.name,
        recipientIcon: contact.icon,
        title: `Einladung: ${evt.label}`,
        eventTypeId: evt.id,
        eventWhen: whenLabel || INVITE_TIMES[0],
        body: cleanNote,
        replyStatus: accepted ? 'accepted' : 'declined',
        activity: evt.activity
      };
      state.sent.unshift(sentEntry);

      const replyMail = {
        id: `mail_inv_reply_${Date.now()}_${idx}`,
        dateKey: todayKey,
        timestamp: Date.now() + 10 + idx,
        category: 'reply',
        categoryLabel: accepted ? '✅ Zusage erhalten' : '📩 Rückmeldung',
        senderId: contact.id,
        senderName: contact.name,
        senderIcon: contact.icon,
        title: accepted
          ? `${contact.name}: Ich nehme deine Einladung gerne an!`
          : `${contact.name}: Schade, ich muss leider absagen`,
        body: accepted
          ? `Juhu! Danke für die Einladung zu "${evt.label}" (${whenLabel}). Ich komme sehr gerne und bringe eine Kleinigkeit mit!`
          : `Vielen Dank für die liebe Einladung zu "${evt.label}" (${whenLabel}). Leider habe ich da schon einen Termin – beim nächsten Mal bin ich bestimmt dabei!`,
        isInvitation: false,
        rsvpStatus: accepted ? 'accepted' : 'declined',
        rewardCoins: accepted ? 14 : 5,
        giftClaimed: false,
        eventTypeId: evt.id,
        activity: accepted ? evt.activity : null,
        read: false
      };
      state.inbox.unshift(replyMail);
      replies.push({ contact, accepted });
    });

    if (state.sent.length > 40) state.sent = state.sent.slice(0, 40);
    this.saveState(state);

    const prog = ShopManager.recordProgress(0, 1);
    return {
      ok: true,
      replies,
      acceptedCount: replies.filter((r) => r.accepted).length,
      declinedCount: replies.filter((r) => !r.accepted).length,
      levelUpBonus: prog.levelUpBonus
    };
  },

  getActivityForEntry(entry) {
    if (!entry) return null;
    if (entry.activity) return entry.activity;

    if (entry.eventTypeId) {
      const evt = INVITE_EVENT_TYPES.find((e) => e.id === entry.eventTypeId);
      if (evt) return evt.activity;
    }

    const title = entry.title || '';
    const tplMatch = LETTER_TEMPLATES.find((t) => t.title === title && t.activity);
    if (tplMatch) return tplMatch.activity;

    const invMatch = INVITE_EVENT_TYPES.find((e) => title.includes(e.label));
    if (invMatch) return invMatch.activity;

    if (entry.category === 'adventure') return { kind: 'treasure_hunt', theme: 'treasure_island', title: title || 'Schatzsuche', reward: 34 };
    if (entry.category === 'concert') return { kind: 'band_jam', theme: 'stage', title: title || 'Band-Konzert', reward: 34 };
    if (entry.category === 'game') return { kind: 'hide_and_seek', theme: 'forest_hide', title: title || 'Versteckspiel', reward: 32 };
    if (entry.category === 'bakery') return { kind: 'baking_fest', theme: 'bakery', title: title || 'Back-Fest', reward: 32 };
    if (entry.category === 'night') return { kind: 'stargazing', theme: 'night_sky', title: title || 'Sternschnuppen-Nacht', reward: 35 };
    if (entry.category === 'party') return { kind: 'party', theme: 'garden_party', title: title || 'Party mit Freunden', reward: 26 };
    if (entry.category === 'trip') return { kind: 'trip', theme: 'forest', title: title || 'Gemeinsamer Ausflug', reward: 26 };
    if (entry.category === 'competition') return { kind: 'race', theme: 'stadium', title: title || 'Freundschafts-Wettbewerb', reward: 30 };
    return null;
  },

  isEventCompleted(eventId) {
    if (!eventId) return false;
    return this.getState().completedEvents.includes(eventId);
  },

  completeEvent(eventId, baseReward = 25) {
    const state = this.getState();
    const firstTime = !!(eventId && !state.completedEvents.includes(eventId));
    if (eventId && firstTime) {
      state.completedEvents.push(eventId);
      if (state.completedEvents.length > 60) {
        state.completedEvents = state.completedEvents.slice(-60);
      }
      this.saveState(state);
    }
    const coinsEarned = firstTime ? Math.max(8, Math.round(baseReward * 0.5)) : 5;
    BankManager.depositEarned(coinsEarned, '🎉 Event-Belohnung');
    const prog = ShopManager.recordProgress(0, firstTime ? 2 : 1);
    return {
      ok: true,
      firstTime,
      coinsEarned,
      levelUpBonus: prog.levelUpBonus
    };
  }
};
