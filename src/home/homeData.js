import { ShopManager } from '../editor/shopData.js';

export const HOME_CATALOG = {
  expansions: [
    { id: 'living_room', name: 'Wohnzimmer', icon: '🏠', price: 0, desc: 'Dein gemütliches Basis-Zuhause' },
    { id: 'kitchen', name: 'Küche', icon: '🍳', price: 80, desc: 'Schaltet die Einbauküche frei (+5 🪙 beim Kochen)' },
    { id: 'bedroom', name: 'Obergeschoss', icon: '🪜', price: 130, desc: 'Baut ein zweites Stockwerk auf dein Haus' },
    { id: 'conservatory', name: 'Wintergarten', icon: '🪴', price: 170, desc: 'Gläserner Anbau zwischen Haus und Garten' },
    { id: 'balcony', name: 'Sonniger Balkon', icon: '🌅', price: 195, unlockLevel: 2, isNew: true, desc: 'Schicker Balkon am Obergeschoss' },
    { id: 'pool_deck', name: 'Pool-Terrasse', icon: '🏊', price: 260, unlockLevel: 3, isNew: true, desc: 'Blauer Gartenpool zum Abkühlen!' }
  ],
  furniture: [
    { id: 'sofa', name: 'Gemütliches Sofa', icon: '🛋️', price: 50, desc: 'Ein weiches rotes Cartoon-Sofa' },
    { id: 'table', name: 'Esstisch', icon: '🪑', price: 45, desc: 'Holztisch für leckere Mahlzeiten' },
    { id: 'tv', name: 'Smart-TV', icon: '📺', price: 90, desc: 'Großer Flachbildschirm an der Wand' },
    { id: 'bed', name: 'Kuschel-Bett', icon: '🛏️', price: 110, desc: 'Perfekt zum Ausruhen nach dem Rennen' },
    { id: 'aquarium', name: 'Aquarium', icon: '🐠', price: 140, desc: 'Leuchtendes Becken mit bunten Fischen' },
    { id: 'gaming_setup', name: 'Gaming-Ecke', icon: '🎮', price: 165, isNew: true, desc: 'Leuchtender Monitor & Zocker-Stuhl' },
    { id: 'piano', name: 'Konzert-Klavier', icon: '🎹', price: 185, unlockLevel: 2, isNew: true, desc: 'Spielt fröhliche Melodien im Wohnzimmer' }
  ],
  decor: [
    { id: 'rug', name: 'Fluffiger Teppich', icon: '🧶', price: 35, desc: 'Warmer Teppich fürs Wohnzimmer' },
    { id: 'plant', name: 'Zimmerpflanze', icon: '🪴', price: 40, desc: 'Frisches Grün für drinnen' },
    { id: 'painting', name: 'Bilderrahmen', icon: '🖼️', price: 55, desc: 'Schönes Gemälde an der Wand' },
    { id: 'lights', name: 'Lichterkette', icon: '✨', price: 75, desc: 'Gemütliche goldene Lichter' },
    { id: 'lava_lamp', name: 'Lavalampe', icon: '🪩', price: 85, isNew: true, desc: 'Bunte blubbernde Leucht-Deko' },
    { id: 'bookshelf', name: 'Bücherregal', icon: '📚', price: 95, desc: 'Voll mit spannenden Abenteuern' },
    { id: 'trophy_shelf', name: 'Pokal-Regal', icon: '🏆', price: 120, unlockLevel: 2, isNew: true, desc: 'Zeigt deine goldenen Lauf-Pokale' }
  ],
  garden: [
    { id: 'flowerbed', name: 'Blumenbeet', icon: '🌷', price: 0, desc: 'Bunte Blumen im Vorgarten' },
    { id: 'veggies', name: 'Gemüsebeet', icon: '🥕', price: 60, desc: 'Leckeres Gemüse (+10 🪙 pro Ernte)' },
    { id: 'apple_tree', name: 'Apfelbaum', icon: '🍎', price: 95, desc: 'Trägt saftige Äpfel (+12 🪙 pro Ernte)' },
    { id: 'pond', name: 'Gartenteich', icon: '🪷', price: 125, desc: 'Kleiner Teich mit Seerosen' },
    { id: 'swing', name: 'Gartenschaukel', icon: '🎠', price: 145, isNew: true, desc: 'Schaukelspaß im grünen Garten' },
    { id: 'bbq', name: 'Grill-Ecke', icon: '🍔', price: 160, unlockLevel: 2, isNew: true, desc: 'Leckeres BBQ-Fest im Garten (+6 🪙 beim Kochen)' },
    { id: 'treehouse', name: 'Baumhaus', icon: '🏡', price: 180, desc: 'Ein echtes Abenteuer-Baumhaus!' },
    { id: 'greenhouse', name: 'Gewächshaus', icon: '🌿', price: 220, unlockLevel: 3, isNew: true, desc: 'Lässt Pflanzen turbo-schnell wachsen (+15 🪙 Ernte)' }
  ],
  pets: [
    { id: 'turtle', name: 'Schildkröte Speedy', icon: '🐢', price: 65, desc: 'Gemütlich, lieb und mag Salat' },
    { id: 'bunny', name: 'Hase Hoppel', icon: '🐰', price: 70, desc: 'Hüpft fröhlich durch den Garten' },
    { id: 'hamster', name: 'Hamster Krümel', icon: '🐹', price: 75, isNew: true, desc: 'Klein, flauschig und super niedlich' },
    { id: 'cat', name: 'Katze Luna', icon: '🐱', price: 85, desc: 'Schnurrt leise auf dem Sofa' },
    { id: 'dog', name: 'Hund Bello', icon: '🐶', price: 90, desc: 'Dein treuer bester Freund' },
    { id: 'parrot', name: 'Papagei Coco', icon: '🦜', price: 115, desc: 'Bunt, klug und plappert gern' },
    { id: 'fox', name: 'Fuchs Foxy', icon: '🦊', price: 175, unlockLevel: 2, isNew: true, desc: 'Schlauer kleiner Garten-Fuchs' },
    { id: 'unicorn', name: 'Mini-Einhorn', icon: '🦄', price: 280, unlockLevel: 3, isNew: true, desc: 'Magisches Glitzer-Einhorn!' }
  ],
  petItems: [
    { id: 'bowl', name: 'Gold-Napf', icon: '🥣', price: 35, desc: 'Schicker Napf für deine Tiere' },
    { id: 'ball', name: 'Spielball', icon: '⚽', price: 45, desc: 'Damit spielen deine Tiere gern' },
    { id: 'hamster_wheel', name: 'Laufrad', icon: '🎡', price: 65, isNew: true, desc: 'Flitzer-Rad für kleine Tiere' },
    { id: 'pet_bed', name: 'Tierkörbchen', icon: '🧺', price: 70, desc: 'Extra weicher Schlafplatz für Tiere' },
    { id: 'cat_tree', name: 'Kletterbaum', icon: '🪵', price: 85, desc: 'Abenteuer-Kletterturm fürs Haus' },
    { id: 'pet_house', name: 'Hundehütte', icon: '🛖', price: 120, unlockLevel: 2, isNew: true, desc: 'Gemütliche Hütte draußen im Garten' }
  ],
  supplies: [
    { id: 'buy_food', name: 'Koch-Zutaten (+3)', icon: '🥘', price: 15, isConsumable: true, key: 'food', amount: 3, desc: 'Frische Zutaten für 3x Kochen' },
    { id: 'buy_pet_food', name: 'Tierfutter (+3)', icon: '🦴', price: 15, isConsumable: true, key: 'petFood', amount: 3, desc: 'Leckeres Futter für 3x Füttern' },
    { id: 'vacuum', name: 'Turbo-Staubsauger', icon: '🧹', price: 75, desc: 'Putzt blitzschnell & gibt +5 🪙 Extra beim Putzen' },
    { id: 'gold_can', name: 'Gold-Gießkanne', icon: '🚿', price: 80, desc: 'Verdoppelt das Wachstum beim Gießen!' },
    { id: 'robot_helper', name: 'Haus-Roboter', icon: '🤖', price: 240, unlockLevel: 2, isNew: true, desc: 'Hält dein Haus länger sauber & schenkt extra Münzen!' }
  ]
};

const HOME_KEY = 'runner_home_state';
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
      petFood: 3
    },
    needs: {
      cleanliness: 75,
      hunger: 70,
      petCare: 80,
      gardenGrowth: 40
    },
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

  hasItem(category, id) {
    const state = this.getState();
    return Array.isArray(state.owned[category]) && state.owned[category].includes(id);
  },

  isLevelUnlocked(item) {
    if (!item.unlockLevel) return true;
    const playerLevel = ShopManager.getStats().level || 1;
    return playerLevel >= item.unlockLevel;
  },

  // Daily rotating 30% deals in Home Shop
  getDailyDeals() {
    const seed = getDateSeed();
    const pool = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (item.price > 0 && !item.isConsumable) {
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

  onRunCompleted() {
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    const cleanDrop = hasRobot ? 5 : 12;
    state.needs.cleanliness = Math.max(15, state.needs.cleanliness - cleanDrop);
    state.needs.hunger = Math.max(10, state.needs.hunger - 14);
    if (state.owned.pets.length > 0) {
      state.needs.petCare = Math.max(10, state.needs.petCare - 15);
    }
    this.saveState(state);
  },

  tickNeeds() {
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    if (!hasRobot || Math.random() < 0.4) {
      state.needs.cleanliness = Math.max(10, state.needs.cleanliness - 1);
    }
    state.needs.hunger = Math.max(10, state.needs.hunger - 1);
    if (state.owned.pets.length > 0) {
      state.needs.petCare = Math.max(10, state.needs.petCare - 1);
    }
    this.saveState(state);
    return state;
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
    const boost = hasBowl ? 50 : 35;
    const bonusCoins = 10;
    state.needs.petCare = Math.min(100, state.needs.petCare + boost);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    return { ok: true, bonusCoins, state };
  },

  petAnimals() {
    const state = this.getState();
    if (state.owned.pets.length === 0) {
      return { ok: false, reason: 'no_pets' };
    }
    state.needs.petCare = Math.min(100, state.needs.petCare + 15);
    this.saveState(state);
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
      return { ok: true, action: 'harvest', bonusCoins: reward, state };
    }

    const hasGoldCan = this.hasItem('supplies', 'gold_can');
    const hasGreenhouse = this.hasItem('garden', 'greenhouse');
    const growthStep = (hasGoldCan ? 50 : 30) + (hasGreenhouse ? 15 : 0);
    state.needs.gardenGrowth = Math.min(100, state.needs.gardenGrowth + growthStep);
    this.saveState(state);
    return { ok: true, action: 'water', state };
  }
};
