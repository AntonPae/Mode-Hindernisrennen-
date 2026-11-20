import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';

export const HOME_CATALOG = {
  expansions: [
    { id: 'living_room', name: 'Wohnzimmer', icon: '🏠', price: 0, desc: 'Dein gemütliches Basis-Zuhause' },
    { id: 'kitchen', name: 'Küche', icon: '🍳', price: 80, desc: 'Schaltet die Einbauküche frei (+5 🪙 beim Kochen)' },
    { id: 'pet_room', name: 'Tierzimmer', icon: '🐾', price: 95, isNew: true, desc: 'Ein eigener Raum für deine Tiere – dort bleiben sie & du kannst sie abholen!' },
    { id: 'bedroom', name: 'Obergeschoss', icon: '🪜', price: 130, desc: 'Baut ein zweites Stockwerk auf dein Haus' },
    { id: 'conservatory', name: 'Wintergarten', icon: '🪴', price: 170, desc: 'Gläserner Anbau zwischen Haus und Garten' },
    { id: 'balcony', name: 'Sonniger Balkon', icon: '🌅', price: 195, unlockLevel: 2, isNew: true, desc: 'Schicker Balkon am Obergeschoss' },
    { id: 'pool_deck', name: 'Pool-Terrasse', icon: '🏊', price: 260, unlockLevel: 3, isNew: true, desc: 'Blauer Gartenpool zum Abkühlen!' },
    { id: 'observatory', name: 'Dach-Sternwarte', icon: '🔭', price: 340, unlockLevel: 6, isNew: true, desc: 'Glaskuppel mit Teleskop zum Sternegucken!' }
  ],
  furniture: [
    { id: 'sofa', name: 'Gemütliches Sofa', icon: '🛋️', price: 50, desc: 'Ein weiches rotes Cartoon-Sofa' },
    { id: 'table', name: 'Esstisch', icon: '🪑', price: 45, desc: 'Holztisch für leckere Mahlzeiten' },
    { id: 'tv', name: 'Smart-TV', icon: '📺', price: 90, desc: 'Großer Flachbildschirm an der Wand' },
    { id: 'bed', name: 'Kuschel-Bett', icon: '🛏️', price: 110, desc: 'Perfekt zum Ausruhen nach dem Rennen' },
    { id: 'aquarium', name: 'Aquarium', icon: '🐠', price: 140, desc: 'Leuchtendes Becken mit bunten Fischen' },
    { id: 'gaming_setup', name: 'Gaming-Ecke', icon: '🎮', price: 165, isNew: true, desc: 'Leuchtender Monitor & Zocker-Stuhl' },
    { id: 'piano', name: 'Konzert-Klavier', icon: '🎹', price: 185, unlockLevel: 2, isNew: true, desc: 'Spielt fröhliche Melodien im Wohnzimmer' },
    { id: 'dj_booth', name: 'DJ-Musik-Ecke', icon: '🎧', price: 195, unlockLevel: 3, isNew: true, desc: 'Perfekt für deine eigenen Haus-Partys!' },
    { id: 'home_cinema', name: 'Heimkino', icon: '🎬', price: 260, unlockLevel: 5, isNew: true, desc: 'Große Kino-Leinwand für Filmabende mit Freunden' }
  ],
  decor: [
    { id: 'rug', name: 'Fluffiger Teppich', icon: '🧶', price: 35, desc: 'Warmer Teppich fürs Wohnzimmer' },
    { id: 'plant', name: 'Zimmerpflanze', icon: '🪴', price: 40, desc: 'Frisches Grün für drinnen' },
    { id: 'painting', name: 'Bilderrahmen', icon: '🖼️', price: 55, desc: 'Schönes Gemälde an der Wand' },
    { id: 'lights', name: 'Lichterkette', icon: '✨', price: 75, desc: 'Gemütliche goldene Lichter' },
    { id: 'lava_lamp', name: 'Lavalampe', icon: '🪩', price: 85, isNew: true, desc: 'Bunte blubbernde Leucht-Deko' },
    { id: 'bookshelf', name: 'Bücherregal', icon: '📚', price: 95, desc: 'Voll mit spannenden Abenteuern' },
    { id: 'trophy_shelf', name: 'Pokal-Regal', icon: '🏆', price: 120, unlockLevel: 2, isNew: true, desc: 'Zeigt deine goldenen Lauf-Pokale' },
    { id: 'chandelier', name: 'Kristall-Leuchter', icon: '💎', price: 165, unlockLevel: 4, isNew: true, desc: 'Funkelnder Kronleuchter für dein Wohnzimmer' }
  ],
  garden: [
    { id: 'mailbox', name: 'Briefkasten', icon: '📬', price: 45, isNew: true, desc: 'Bekomme jeden Tag 1–2 Briefe & Einladungen von Freunden!' },
    { id: 'flowerbed', name: 'Blumenbeet', icon: '🌷', price: 0, desc: 'Bunte Blumen im Vorgarten' },
    { id: 'veggies', name: 'Gemüsebeet', icon: '🥕', price: 60, desc: 'Leckeres Gemüse (+10 🪙 pro Ernte)' },
    { id: 'apple_tree', name: 'Apfelbaum', icon: '🍎', price: 95, desc: 'Trägt saftige Äpfel (+12 🪙 pro Ernte)' },
    { id: 'pond', name: 'Gartenteich', icon: '🪷', price: 125, desc: 'Kleiner Teich mit Seerosen' },
    { id: 'swing', name: 'Gartenschaukel', icon: '🎠', price: 145, isNew: true, desc: 'Schaukelspaß im grünen Garten' },
    { id: 'bbq', name: 'Grill-Ecke', icon: '🍔', price: 160, unlockLevel: 2, isNew: true, desc: 'Leckeres BBQ-Fest im Garten (+6 🪙 beim Kochen)' },
    { id: 'treehouse', name: 'Baumhaus', icon: '🏡', price: 180, desc: 'Ein echtes Abenteuer-Baumhaus!' },
    { id: 'gold_mailbox', name: 'Gold-Briefkasten', icon: '✨', price: 135, unlockLevel: 3, isNew: true, desc: 'Schicker Gold-Briefkasten mit Extra-Münzen in Geschenkbriefen!' },
    { id: 'greenhouse', name: 'Gewächshaus', icon: '🌿', price: 220, unlockLevel: 3, isNew: true, desc: 'Lässt Pflanzen turbo-schnell wachsen (+15 🪙 Ernte)' },
    { id: 'fountain', name: 'Garten-Brunnen', icon: '⛲', price: 190, unlockLevel: 4, isNew: true, desc: 'Plätschernder Wunschbrunnen direkt vor der Terrasse' },
    { id: 'hammock', name: 'Hängematte', icon: '🌴', price: 185, unlockLevel: 5, isNew: true, desc: 'Gemütliche Sonnen-Hängematte im Garten' },
    { id: 'rainbow_slide', name: 'Regenbogen-Rutsche', icon: '🌈', price: 290, unlockLevel: 6, isNew: true, desc: 'Bunte Garten-Rutsche für Partys mit Nachbarn!' }
  ],
  pets: [
    { id: 'turtle', name: 'Schildkröte Speedy', icon: '🐢', price: 65, desc: 'Gemütlich, lieb und mag Salat' },
    { id: 'bunny', name: 'Hase Hoppel', icon: '🐰', price: 70, desc: 'Hüpft fröhlich durch den Garten' },
    { id: 'hamster', name: 'Hamster Krümel', icon: '🐹', price: 75, isNew: true, desc: 'Klein, flauschig und super niedlich' },
    { id: 'cat', name: 'Katze Luna', icon: '🐱', price: 85, desc: 'Schnurrt leise auf dem Sofa' },
    { id: 'dog', name: 'Hund Bello', icon: '🐶', price: 90, desc: 'Dein treuer bester Freund' },
    { id: 'parrot', name: 'Papagei Coco', icon: '🦜', price: 115, desc: 'Bunt, klug und plappert gern' },
    { id: 'fox', name: 'Fuchs Foxy', icon: '🦊', price: 175, unlockLevel: 2, isNew: true, desc: 'Schlauer kleiner Garten-Fuchs' },
    { id: 'unicorn', name: 'Mini-Einhorn', icon: '🦄', price: 280, unlockLevel: 3, isNew: true, desc: 'Magisches Glitzer-Einhorn!' },
    { id: 'panda', name: 'Panda Mochi', icon: '🐼', price: 230, unlockLevel: 4, isNew: true, desc: 'Knuddeliger Panda, der frischen Bambus knabbert' },
    { id: 'dragon', name: 'Glücks-Drache Fips', icon: '🐉', price: 310, unlockLevel: 5, isNew: true, desc: 'Süßer Mini-Drache mit Glitzerflügeln' },
    { id: 'phoenix', name: 'Sternen-Vogel', icon: '🐦‍🔥', price: 360, unlockLevel: 6, isNew: true, desc: 'Magischer Traumvogel, der extra Münzen bringt' }
  ],
  petItems: [
    { id: 'bowl', name: 'Gold-Napf', icon: '🥣', price: 35, desc: 'Schicker Napf fürs Tierzimmer' },
    { id: 'pet_cushion', name: 'Kuschelkissen', icon: '🛋️', price: 40, isNew: true, desc: 'Weiches Sternen-Kissen fürs Tierzimmer' },
    { id: 'ball', name: 'Spielball', icon: '⚽', price: 45, desc: 'Damit spielen deine Tiere gern' },
    { id: 'pet_tunnel', name: 'Spiel-Tunnel', icon: '🌈', price: 55, isNew: true, desc: 'Bunter Flitzer-Tunnel fürs Tierzimmer' },
    { id: 'hamster_wheel', name: 'Laufrad', icon: '🎡', price: 65, isNew: true, desc: 'Flitzer-Rad für kleine Tiere' },
    { id: 'pet_bed', name: 'Tierkörbchen', icon: '🧺', price: 70, desc: 'Extra weicher Schlafplatz fürs Tierzimmer' },
    { id: 'water_fountain', name: 'Trink-Brunnen', icon: '⛲', price: 75, isNew: true, desc: 'Frisches Sprudelwasser fürs Tierzimmer (+4 🪙 beim Füttern)' },
    { id: 'cat_tree', name: 'Kletterbaum', icon: '🪵', price: 85, desc: 'Abenteuer-Kletterturm fürs Tierzimmer' },
    { id: 'pet_bath', name: 'Schaum-Wanne', icon: '🛁', price: 80, unlockLevel: 2, isNew: true, desc: 'Blubber-Badewanne für glückliche Tiere' },
    { id: 'pet_house', name: 'Hundehütte', icon: '🛖', price: 120, unlockLevel: 2, isNew: true, desc: 'Gemütliche Hütte für Garten & Tierzimmer' }
  ],
  supplies: [
    { id: 'buy_food', name: 'Koch-Zutaten (+3)', icon: '🥘', price: 15, isConsumable: true, key: 'food', amount: 3, desc: 'Frische Zutaten für deinen Kühlschrank (3x Kochen)' },
    { id: 'buy_snacks', name: 'Obst & Snacks (+3)', icon: '🍓', price: 14, isConsumable: true, key: 'fridgeSnacks', amount: 3, desc: 'Leckere Snacks direkt für deinen Kühlschrank' },
    { id: 'buy_cheese_box', name: 'Käse & Pasta-Box (+4)', icon: '🧀', price: 18, isConsumable: true, key: 'food', amount: 4, desc: 'Große Vorratsbox für den Kühlschrank (4x Kochen)' },
    { id: 'buy_pet_food', name: 'Tierfutter (+3)', icon: '🦴', price: 15, isConsumable: true, key: 'petFood', amount: 3, desc: 'Leckeres Futter für 3x Füttern' },
    { id: 'buy_medicine', name: 'Kräutertee & Medizin (+3)', icon: '🍵', price: 16, isConsumable: true, key: 'medicine', amount: 3, desc: 'Hilft dir schnell wieder gesund zu werden, wenn du mal erkältet bist' },
    { id: 'buy_pet_medicine', name: 'Tier-Medizin (+3)', icon: '💊', price: 16, isConsumable: true, key: 'petMedicine', amount: 3, desc: 'Pflegt ein kränkelndes Tier schnell wieder fit und munter' },
    { id: 'vacuum', name: 'Turbo-Staubsauger', icon: '🧹', price: 75, desc: 'Putzt blitzschnell & gibt +5 🪙 Extra beim Putzen' },
    { id: 'gold_can', name: 'Gold-Gießkanne', icon: '🚿', price: 80, desc: 'Verdoppelt das Wachstum beim Gießen!' },
    { id: 'robot_helper', name: 'Haus-Roboter', icon: '🤖', price: 240, unlockLevel: 2, isNew: true, desc: 'Hält dein Haus länger sauber & schenkt extra Münzen!' }
  ]
};

const HOME_KEY = 'runner_home_state';
const PETSIT_SLOTS_KEY = 'runner_petsit_slots';
export const HOME_MYSTERY_BOX_PRICE = 75;

function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getDefaultHomeState() {
  return {
    owned: {
      expansions: ['living_room'],
      furniture: [],
      decor: [],
      garden: ['flowerbed'],
      pets: [],
      petItems: [],
      supplies: []
    },
    inventory: {
      food: 3,
      petFood: 3,
      fridgeSnacks: 2,
      medicine: 2,
      petMedicine: 2
    },
    needs: {
      cleanliness: 75,
      hunger: 70,
      petCare: 80,
      gardenGrowth: 40,
      energy: 88,
      petEnergy: 88
    },
    health: {
      playerSick: null,
      sickPets: {},
      lastSickTime: 0,
      ticksSinceSickCheck: 0
    },
    companionPets: [],
    sittingCompanions: [],
    lastDailyBonusDate: '',
    lastUpdate: Date.now()
  };
}

export const HomeManager = {
  getState() {
    try {
      const raw = localStorage.getItem(HOME_KEY);
      if (!raw) {
        const def = getDefaultHomeState();
        this.saveState(def);
        return def;
      }
      const parsed = JSON.parse(raw);
      const def = getDefaultHomeState();
      return {
        owned: { ...def.owned, ...(parsed.owned || {}) },
        inventory: { ...def.inventory, ...(parsed.inventory || {}) },
        needs: { ...def.needs, ...(parsed.needs || {}) },
        health: {
          ...def.health,
          ...(parsed.health || {}),
          sickPets: { ...(parsed.health?.sickPets || {}) }
        },
        companionPets: Array.isArray(parsed.companionPets) ? parsed.companionPets : [],
        sittingCompanions: Array.isArray(parsed.sittingCompanions) ? parsed.sittingCompanions : [],
        lastDailyBonusDate: parsed.lastDailyBonusDate || '',
        lastUpdate: parsed.lastUpdate || Date.now()
      };
    } catch {
      return getDefaultHomeState();
    }
  },

  saveState(state) {
    try {
      state.lastUpdate = Date.now();
      localStorage.setItem(HOME_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  },

  hasMailbox() {
    return this.hasItem('garden', 'mailbox') || this.hasItem('garden', 'gold_mailbox');
  },

  hasPetRoom() {
    return this.hasItem('expansions', 'pet_room');
  },

  hasItem(category, id) {
    const state = this.getState();
    return Array.isArray(state.owned[category]) && state.owned[category].includes(id);
  },

  getCompanionPets() {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? state.owned.pets : [];
    const selected = Array.isArray(state.companionPets) ? state.companionPets : [];
    return selected.filter((id) => ownedPets.includes(id));
  },

  getStayingPets() {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? state.owned.pets : [];
    const companions = this.getCompanionPets();
    return ownedPets.filter((id) => !companions.includes(id));
  },

  isCompanionPet(petId) {
    return this.getCompanionPets().includes(petId);
  },

  toggleCompanionPet(petId) {
    if (!this.hasItem('pets', petId)) {
      return { ok: false, reason: 'not_owned' };
    }
    const state = this.getState();
    const list = Array.isArray(state.companionPets) ? [...state.companionPets] : [];
    const idx = list.indexOf(petId);
    let active = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      active = false;
    } else {
      list.push(petId);
      active = true;
    }
    state.companionPets = list;
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: list } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === petId);
    return { ok: true, active, petId, item, companionPets: list };
  },

  setAllCompanions(enabled) {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? [...state.owned.pets] : [];
    state.companionPets = enabled ? ownedPets : [];
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    return state.companionPets;
  },

  getSittingCompanions() {
    const state = this.getState();
    return Array.isArray(state.sittingCompanions) ? state.sittingCompanions : [];
  },

  getSittingCompanionById(sitId) {
    return this.getSittingCompanions().find((s) => s.id === sitId) || null;
  },

  setSittingCompanions(list) {
    const state = this.getState();
    state.sittingCompanions = Array.isArray(list) ? list : [];
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { sittingCompanions: state.sittingCompanions } }));
    return state.sittingCompanions;
  },

  getPetSittingSlots() {
    try {
      const raw = localStorage.getItem(PETSIT_SLOTS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length === 3 ? parsed : null;
    } catch {
      return null;
    }
  },

  savePetSittingSlots(slots) {
    try {
      const clean = (Array.isArray(slots) ? slots : [null, null, null]).slice(0, 3);
      localStorage.setItem(PETSIT_SLOTS_KEY, JSON.stringify(clean));
      const activeLeashed = clean
        .filter((v) => v && v.state === 'caring' && v.onLeash && v.info)
        .map((v) => ({
          id: `sit_${v.houseIdx}`,
          houseIdx: v.houseIdx,
          species: v.info.species || 'dog',
          name: v.info.name || 'Bello',
          badge: v.info.badge || '🐕 Hund',
          body: v.info.body || '#d97706',
          ear: v.info.ear || '#92400e',
          accent: v.info.accent || '#fde68a',
          collar: v.info.collar || '#ec4899',
          say: `${v.info.species === 'cat' ? 'Miau' : v.info.species === 'bunny' ? 'Hoppel' : 'Wuff'}! Gassi! ❤️`,
          isSitting: true
        }));
      this.setSittingCompanions(activeLeashed);
    } catch {
      // Ignore storage errors
    }
  },

  cuddleCompanionPet(petId) {
    const state = this.getState();
    const sittingObj = typeof petId === 'string' && petId.startsWith('sit_')
      ? this.getSittingCompanionById(petId)
      : null;

    if (sittingObj) {
      state.needs.petCare = Math.min(100, (state.needs.petCare || 70) + 6);
      this.saveState(state);
      const slots = this.getPetSittingSlots();
      if (slots && slots[sittingObj.houseIdx] && slots[sittingObj.houseIdx].state === 'caring') {
        slots[sittingObj.houseIdx].leashDistance = Math.min(240, (slots[sittingObj.houseIdx].leashDistance || 0) + 18);
        if (slots[sittingObj.houseIdx].leashDistance >= 220) {
          slots[sittingObj.houseIdx].walkReady = true;
        }
        try {
          localStorage.setItem(PETSIT_SLOTS_KEY, JSON.stringify(slots));
        } catch {
          // Ignore storage error
        }
      }
      ShopManager.recordProgress(0, 1);
      EarnMoneyManager.recordEvent({ care: 1 });
      return { ok: true, isSitting: true, item: sittingObj, state };
    }

    if (!this.hasItem('pets', petId)) return { ok: false };
    state.needs.petCare = Math.min(100, (state.needs.petCare || 70) + 8);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === petId);
    return { ok: true, item, state };
  },

  isLevelUnlocked(item) {
    if (!item.unlockLevel) return true;
    const playerLevel = ShopManager.getStats().level || 1;
    return playerLevel >= item.unlockLevel;
  },

  getItemsForLevel(targetLevel) {
    const items = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (item.unlockLevel === targetLevel) {
          items.push({ category: cat, ...item });
        }
      });
    });
    return items;
  },

  // Daily rotating 30% deals in Home Shop
  getDailyDeals() {
    const seed = getDateSeed();
    const pool = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (item.price > 0 && !item.isConsumable && this.isLevelUnlocked(item)) {
          pool.push({ category: cat, id: item.id });
        }
      });
    });
    if (pool.length === 0) return [];
    const idx1 = (seed * 3 + 5) % pool.length;
    const idx2 = (seed * 11 + 2) % pool.length;
    const deals = [pool[idx1]];
    if (idx2 !== idx1) deals.push(pool[idx2]);
    return deals;
  },

  isDailyDeal(category, itemId) {
    return this.getDailyDeals().some((d) => d.category === category && d.id === itemId);
  },

  getEffectivePrice(category, item) {
    if (!item || item.price <= 0) return 0;
    if (!item.isConsumable && this.isDailyDeal(category, item.id)) {
      return Math.max(10, Math.round((item.price * 0.7) / 5) * 5);
    }
    return item.price;
  },

  claimDailyVisitBonus() {
    const today = new Date().toDateString();
    const state = this.getState();
    if (state.lastDailyBonusDate !== today) {
      state.lastDailyBonusDate = today;
      this.saveState(state);
      ShopManager.addCoins(15);
      return 15;
    }
    return 0;
  },

  addSupply(key, amount = 1) {
    const state = this.getState();
    state.inventory[key] = (state.inventory[key] || 0) + amount;
    this.saveState(state);
    return state.inventory[key];
  },

  getRunPocketMoneyBonus() {
    const state = this.getState();
    let bonus = (state.owned.pets?.length || 0) * 2;
    if (this.hasItem('decor', 'trophy_shelf')) bonus += 5;
    if (this.hasItem('supplies', 'robot_helper')) bonus += 5;
    if (this.hasItem('garden', 'greenhouse')) bonus += 4;
    if (this.hasItem('pets', 'phoenix')) bonus += 8;
    return bonus;
  },

  buyItem(category, itemId) {
    const list = HOME_CATALOG[category] || [];
    const item = list.find((i) => i.id === itemId);
    if (!item) return { ok: false, reason: 'not_found' };

    if (!this.isLevelUnlocked(item)) {
      return { ok: false, reason: 'level_locked', requiredLevel: item.unlockLevel, item };
    }

    const state = this.getState();
    const price = this.getEffectivePrice(category, item);

    if (item.isConsumable) {
      const coins = ShopManager.getCoins();
      if (coins < price) {
        return { ok: false, reason: 'insufficient_funds', missing: price - coins, item, price };
      }
      ShopManager.setCoins(coins - price);
      state.inventory[item.key] = (state.inventory[item.key] || 0) + item.amount;
      this.saveState(state);
      return { ok: true, item, price, consumable: true, remainingCoins: ShopManager.getCoins() };
    }

    if (this.hasItem(category, itemId)) {
      return { ok: true, alreadyOwned: true, item };
    }

    const coins = ShopManager.getCoins();
    if (coins < price) {
      return { ok: false, reason: 'insufficient_funds', missing: price - coins, item, price };
    }

    ShopManager.setCoins(coins - price);
    if (!Array.isArray(state.owned[category])) state.owned[category] = [];
    state.owned[category].push(itemId);

    if (category === 'pets' && state.owned.pets.length === 1) {
      state.needs.petCare = 80;
    }

    this.saveState(state);
    return { ok: true, item, price, remainingCoins: ShopManager.getCoins() };
  },

  buyHomeMysteryBox() {
    const lockedPool = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (!item.isConsumable && !this.hasItem(cat, item.id) && this.isLevelUnlocked(item)) {
          lockedPool.push({ category: cat, item });
        }
      });
    });

    if (lockedPool.length === 0) {
      return { ok: false, reason: 'all_unlocked' };
    }

    const coins = ShopManager.getCoins();
    if (coins < HOME_MYSTERY_BOX_PRICE) {
      return { ok: false, reason: 'insufficient_funds', missing: HOME_MYSTERY_BOX_PRICE - coins };
    }

    ShopManager.setCoins(coins - HOME_MYSTERY_BOX_PRICE);
    const pick = lockedPool[Math.floor(Math.random() * lockedPool.length)];
    const state = this.getState();
    if (!Array.isArray(state.owned[pick.category])) state.owned[pick.category] = [];
    state.owned[pick.category].push(pick.item.id);

    if (pick.category === 'pets' && state.owned.pets.length === 1) {
      state.needs.petCare = 80;
    }

    this.saveState(state);
    return { ok: true, category: pick.category, item: pick.item, remainingCoins: ShopManager.getCoins() };
  },

  _maybeTriggerRareSickness(state, source = 'tick') {
    if (!state.health) {
      state.health = { playerSick: null, sickPets: {}, lastSickTime: 0, ticksSinceSickCheck: 0 };
    }
    const now = Date.now();
    const cooldownMs = 180000; // Mindestens 3 Minuten Pause zwischen seltenen Krankheiten
    if (now - (state.health.lastSickTime || 0) < cooldownMs) return null;

    const alreadyPlayerSick = Boolean(state.health.playerSick);
    const ownedPets = Array.isArray(state.owned?.pets) ? state.owned.pets : [];
    const healthyPets = ownedPets.filter((id) => !state.health.sickPets?.[id]);
    if (alreadyPlayerSick && healthyPets.length === 0) return null;

    state.health.ticksSinceSickCheck = (state.health.ticksSinceSickCheck || 0) + 1;
    if (source === 'tick' && state.health.ticksSinceSickCheck < 5) return null;

    const lowPlayer = (state.needs.energy || 80) < 28 || (state.needs.hunger || 70) < 25;
    const lowPet = (state.needs.petEnergy || 80) < 28 || (state.needs.petCare || 80) < 28;
    let chance = source === 'run' ? 0.06 : 0.014;
    if (lowPlayer || lowPet) chance *= 2.1;

    if (Math.random() >= chance) return null;

    state.health.lastSickTime = now;
    state.health.ticksSinceSickCheck = 0;

    const choosePet = healthyPets.length > 0 && (alreadyPlayerSick || Math.random() < 0.5);
    if (choosePet) {
      const petId = healthyPets[Math.floor(Math.random() * healthyPets.length)];
      const kinds = [
        { kind: 'cold', label: 'Kleiner Schnupfen' },
        { kind: 'tummy', label: 'Leichtes Bauchweh' }
      ];
      const pick = kinds[Math.floor(Math.random() * kinds.length)];
      state.health.sickPets[petId] = { ...pick, since: now };
      return { target: 'pet', petId, ...pick };
    }

    const pKinds = [
      { kind: 'cold', label: 'Leichte Erkältung' },
      { kind: 'tired', label: 'Hatschi-Schnupfen' }
    ];
    const pick = pKinds[Math.floor(Math.random() * pKinds.length)];
    state.health.playerSick = { ...pick, since: now };
    return { target: 'player', ...pick };
  },

  onRunCompleted() {
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    const cleanDrop = hasRobot ? 5 : 12;
    state.needs.cleanliness = Math.max(15, state.needs.cleanliness - cleanDrop);
    state.needs.hunger = Math.max(10, state.needs.hunger - 14);
    state.needs.energy = Math.max(10, (state.needs.energy ?? 88) - 16);
    if (state.owned.pets.length > 0) {
      state.needs.petCare = Math.max(10, state.needs.petCare - 15);
      state.needs.petEnergy = Math.max(10, (state.needs.petEnergy ?? 88) - 14);
    }
    this._maybeTriggerRareSickness(state, 'run');
    this.saveState(state);
  },

  tickNeeds(options = {}) {
    const { isSleeping = false } = options;
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    if (!hasRobot || Math.random() < 0.4) {
      state.needs.cleanliness = Math.max(10, state.needs.cleanliness - 1);
    }
    state.needs.hunger = Math.max(10, state.needs.hunger - (isSleeping ? 0 : 1));

    if (isSleeping) {
      const hasBed = this.hasItem('furniture', 'bed') || this.hasItem('expansions', 'bedroom');
      const energyGain = hasBed ? 12 : 8;
      state.needs.energy = Math.min(100, (state.needs.energy ?? 88) + energyGain);
      if (state.owned.pets.length > 0) {
        const hasPetBed = this.hasItem('petItems', 'pet_bed') || this.hasItem('petItems', 'pet_cushion');
        state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 88) + (hasPetBed ? 14 : 10));
      }
      if (state.needs.energy >= 95 && state.health?.playerSick) {
        state.health.playerSick = null;
      }
    } else {
      state.needs.energy = Math.max(8, (state.needs.energy ?? 88) - 1);
      if (state.owned.pets.length > 0) {
        state.needs.petCare = Math.max(10, state.needs.petCare - 1);
        state.needs.petEnergy = Math.max(8, (state.needs.petEnergy ?? 88) - 1);
      }
      this._maybeTriggerRareSickness(state, 'tick');
    }

    this.saveState(state);
    return state;
  },

  sleepStep(isDreamBed = false) {
    const state = this.getState();
    const gain = isDreamBed ? 8 : 5;
    state.needs.energy = Math.min(100, (state.needs.energy ?? 88) + gain);
    if (state.owned.pets.length > 0) {
      const hasPetBed = this.hasItem('petItems', 'pet_bed') || this.hasItem('petItems', 'pet_cushion');
      state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 88) + (hasPetBed ? 9 : 6));
    }
    let recovered = false;
    if (state.needs.energy >= 92 && state.health?.playerSick) {
      state.health.playerSick = null;
      recovered = true;
    }
    const sickIds = Object.keys(state.health?.sickPets || {});
    if (state.needs.petEnergy >= 94 && sickIds.length > 0) {
      state.health.sickPets = {};
      recovered = true;
    }
    this.saveState(state);
    return { state, recovered };
  },

  healPlayer() {
    const state = this.getState();
    if (!state.health?.playerSick) {
      return { ok: false, reason: 'healthy', state };
    }
    const meds = state.inventory.medicine || 0;
    if (meds <= 0) {
      return { ok: false, reason: 'no_medicine', state };
    }
    state.inventory.medicine = meds - 1;
    state.health.playerSick = null;
    state.needs.energy = Math.min(100, (state.needs.energy ?? 80) + 22);
    state.needs.hunger = Math.min(100, (state.needs.hunger ?? 70) + 10);
    this.saveState(state);
    const bonusCoins = 8;
    ShopManager.addCoins(bonusCoins);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, remaining: state.inventory.medicine, state };
  },

  healPet(petId = 'all') {
    const state = this.getState();
    const sickMap = state.health?.sickPets || {};
    const sickIds = petId === 'all' ? Object.keys(sickMap) : (sickMap[petId] ? [petId] : []);
    if (sickIds.length === 0) {
      return { ok: false, reason: 'healthy', state };
    }
    const meds = state.inventory.petMedicine || 0;
    if (meds <= 0) {
      return { ok: false, reason: 'no_pet_medicine', state };
    }
    const targetId = sickIds[0];
    state.inventory.petMedicine = meds - 1;
    delete state.health.sickPets[targetId];
    state.needs.petCare = Math.min(100, (state.needs.petCare ?? 80) + 24);
    state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 80) + 18);
    this.saveState(state);
    const bonusCoins = 10;
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === targetId);
    return { ok: true, petId: targetId, item, bonusCoins, remaining: state.inventory.petMedicine, state };
  },

  eatFridgeSnack() {
    const state = this.getState();
    const snacks = state.inventory.fridgeSnacks || 0;
    if (snacks <= 0) {
      return { ok: false, reason: 'no_snacks' };
    }
    state.inventory.fridgeSnacks = snacks - 1;
    state.needs.hunger = Math.min(100, (state.needs.hunger || 0) + 25);
    this.saveState(state);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, remaining: state.inventory.fridgeSnacks, state };
  },

  cookMeal() {
    const state = this.getState();
    if ((state.inventory.food || 0) <= 0) {
      return { ok: false, reason: 'no_food' };
    }
    state.inventory.food -= 1;
    const hasKitchen = this.hasItem('expansions', 'kitchen');
    const hasBbq = this.hasItem('garden', 'bbq');
    const heal = hasKitchen ? 45 : 30;
    const bonusCoins = 7 + (hasKitchen ? 5 : 0) + (hasBbq ? 6 : 0);
    state.needs.hunger = Math.min(100, state.needs.hunger + heal);
    state.needs.cleanliness = Math.max(10, state.needs.cleanliness - 5);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  cleanHouse() {
    const state = this.getState();
    if (state.needs.cleanliness >= 98) {
      return { ok: false, reason: 'already_clean' };
    }
    const hasVacuum = this.hasItem('supplies', 'vacuum');
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    const boost = hasVacuum ? 50 : 32;
    const bonusCoins = 8 + (hasVacuum ? 5 : 0) + (hasRobot ? 4 : 0);
    state.needs.cleanliness = Math.min(100, state.needs.cleanliness + boost);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  feedPets() {
    const state = this.getState();
    if (state.owned.pets.length === 0) {
      return { ok: false, reason: 'no_pets' };
    }
    if ((state.inventory.petFood || 0) <= 0) {
      return { ok: false, reason: 'no_pet_food' };
    }
    state.inventory.petFood -= 1;
    const hasBowl = this.hasItem('petItems', 'bowl');
    const hasFountain = this.hasItem('petItems', 'water_fountain');
    const boost = hasBowl ? 50 : 35;
    const bonusCoins = 10 + (hasFountain ? 4 : 0);
    state.needs.petCare = Math.min(100, state.needs.petCare + boost);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  petAnimals() {
    const state = this.getState();
    if (state.owned.pets.length === 0) {
      return { ok: false, reason: 'no_pets' };
    }
    state.needs.petCare = Math.min(100, state.needs.petCare + 15);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, state };
  },

  waterOrHarvestGarden() {
    const state = this.getState();
    if (state.needs.gardenGrowth >= 100) {
      let reward = 18;
      if (this.hasItem('garden', 'veggies')) reward += 10;
      if (this.hasItem('garden', 'apple_tree')) reward += 12;
      if (this.hasItem('garden', 'pond')) reward += 6;
      if (this.hasItem('garden', 'greenhouse')) reward += 15;
      state.needs.gardenGrowth = 10;
      this.saveState(state);
      ShopManager.addCoins(reward);
      ShopManager.recordProgress(0, 2);
      EarnMoneyManager.recordEvent({ care: 1 });
      return { ok: true, action: 'harvest', bonusCoins: reward, state };
    }

    const hasGoldCan = this.hasItem('supplies', 'gold_can');
    const hasGreenhouse = this.hasItem('garden', 'greenhouse');
    const growthStep = (hasGoldCan ? 50 : 30) + (hasGreenhouse ? 15 : 0);
    state.needs.gardenGrowth = Math.min(100, state.needs.gardenGrowth + growthStep);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, action: 'water', state };
  }
};
