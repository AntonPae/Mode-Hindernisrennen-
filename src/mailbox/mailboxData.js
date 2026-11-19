import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';

const MAILBOX_KEY = 'runner_mailbox_state';

export const MAIL_CONTACTS = [
  { id: 'frieda', name: 'Oma Frieda', icon: '🏡', role: 'Nachbarin & Bäckerin' },
  { id: 'weber', name: 'Herr Weber', icon: '🐕', role: 'Hundefreund von nebenan' },
  { id: 'kaya', name: 'Frau Kaya', icon: '🐱', role: 'Tierliebhaberin & Gärtnerin' },
  { id: 'mia', name: 'Mia', icon: '🍦', role: 'Chefin im Traum-Café' },
  { id: 'leo', name: 'Leo', icon: '🏃', role: 'Lauf-Freund im Stadion' }
];

export const INVITE_EVENT_TYPES = [
  { id: 'party', icon: '🥳', label: 'Party bei mir zu Hause', defaultMsg: 'Ich feiere eine fröhliche Party bei mir im Haus! Es gibt Musik und Snacks.' },
  { id: 'cafe', icon: '🍰', label: 'Eis & Waffeln im Café', defaultMsg: 'Lass uns gemeinsam leckeres Eis und warme Waffeln im Traum-Café essen!' },
  { id: 'garden', icon: '🌳', label: 'Garten-Picknick', defaultMsg: 'Komm durchs Gartentor zu meinem Picknick im Garten – wir können auch spielen!' },
  { id: 'race', icon: '🏆', label: 'Freundschafts-Wettbewerb', defaultMsg: 'Hast du Lust auf einen spannenden kleinen Lauf-Wettbewerb im Stadion?' },
  { id: 'trip', icon: '🚌', label: 'Gemeinsamer Ausflug', defaultMsg: 'Wir machen einen schönen Ausflug durch die Traumstadt – kommst du mit?' }
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
    targetState: 'BACKGROUND_SELECT'
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
    targetState: 'ICECREAM'
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
    targetState: 'PETSITTING'
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
    targetPayload: { room: 'garden' }
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
    targetState: 'PETSITTING'
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
    targetState: 'ICECREAM'
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
    targetState: 'EDITOR'
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
    targetState: 'BACKGROUND_SELECT'
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
    targetState: 'PETSITTING'
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
    targetState: 'BACKGROUND_SELECT'
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
  return MAIL_CONTACTS.find((c) => c.id === id) || MAIL_CONTACTS[0];
}

function getDefaultMailboxState() {
  return {
    inbox: [],
    sent: [],
    lastDeliveryDate: '',
    deliveredToday: 0,
    nextTemplateIdx: 0
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
        lastDeliveryDate: parsed.lastDeliveryDate || '',
        deliveredToday: parsed.deliveredToday || 0,
        nextTemplateIdx: parsed.nextTemplateIdx || 0
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

    if (state.lastDeliveryDate !== todayKey) {
      state.lastDeliveryDate = todayKey;
      state.deliveredToday = 0;

      // Deliver 1 or 2 fresh letters per day (always 2 on very first mailbox setup!)
      const dailyCount = state.inbox.length === 0 ? 2 : (Math.random() < 0.72 ? 2 : 1);
      for (let i = 0; i < dailyCount; i++) {
        // Pick varied templates so user gets invitations AND letters
        const tplIdx = (state.nextTemplateIdx + i * 4) % LETTER_TEMPLATES.length;
        const tpl = LETTER_TEMPLATES[tplIdx];
        const mail = createMailFromTemplate(tpl, todayKey);
        state.inbox.unshift(mail);
        delivered.push(mail);
        state.deliveredToday += 1;
      }
      state.nextTemplateIdx = (state.nextTemplateIdx + dailyCount * 5 + 1) % LETTER_TEMPLATES.length;
      if (state.inbox.length > 40) {
        state.inbox = state.inbox.slice(0, 40);
      }
      this.saveState(state);
    }

    return { delivered, state };
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
      const goldBonus = HomeManager.hasItem('garden', 'gold_mailbox') ? 10 : 0;
      coinsEarned = (mail.rewardCoins || 20) + goldBonus;
      mail.giftClaimed = true;
      ShopManager.addCoins(coinsEarned);
      const prog = ShopManager.recordProgress(0, 2);
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

    const goldBonus = HomeManager.hasItem('garden', 'gold_mailbox') ? 10 : 0;
    const coinsEarned = (mail.rewardCoins || 10) + goldBonus;
    if (coinsEarned > 0) {
      ShopManager.addCoins(coinsEarned);
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
    const contacts = recipientId === 'all' ? MAIL_CONTACTS : [getContact(recipientId)];
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
        eventWhen: whenLabel || INVITE_TIMES[0],
        body: cleanNote,
        replyStatus: accepted ? 'accepted' : 'declined'
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
  }
};
