export const SHOP_CATALOG = {
  face: [
    { id: 'face_1', name: 'Glücklich', icon: '😀', price: 0 },
    { id: 'face_2', name: 'Cool', icon: '😎', price: 50 },
    { id: 'face_3', name: 'Fokussiert', icon: '😠', price: 75 },
    { id: 'face_4', name: 'Sternen-Augen', icon: '🤩', price: 120 },
    { id: 'face_6', name: 'Herz-Augen', icon: '😍', price: 140, unlockLevel: 2, isNew: true },
    { id: 'face_5', name: 'Ninja', icon: '🥷', price: 160 },
    { id: 'face_7', name: 'Roboter-Visier', icon: '🤖', price: 190, unlockLevel: 3, isNew: true },
    { id: 'face_8', name: 'Schmetterlings-Glanz', icon: '🦋', price: 165, unlockLevel: 4, isNew: true },
    { id: 'face_9', name: 'Regenbogen-Stern', icon: '🌈', price: 225, unlockLevel: 6, isNew: true }
  ],
  hair: [
    { id: 'hair_1', name: 'Kurz', icon: '👦', price: 0 },
    { id: 'hair_none', name: 'Glatze', icon: '🥚', price: 0 },
    { id: 'hair_3', name: 'Lang', icon: '👩', price: 40 },
    { id: 'hair_2', name: 'Irokese', icon: '🤘', price: 80 },
    { id: 'hair_bunny', name: 'Hasenohren', icon: '🐰', price: 95, unlockLevel: 2, isNew: true },
    { id: 'hair_afro', name: 'Afro', icon: '🦱', price: 110 },
    { id: 'hair_cat', name: 'Katzenohren', icon: '🐱', price: 120, unlockLevel: 2, isNew: true },
    { id: 'hair_crown', name: 'Krone', icon: '👑', price: 150 },
    { id: 'hair_wizard', name: 'Zauberhut', icon: '🧙', price: 170, unlockLevel: 3, isNew: true },
    { id: 'hair_flower', name: 'Blumenkranz', icon: '🌸', price: 160, unlockLevel: 4, isNew: true },
    { id: 'hair_unicorn', name: 'Einhorn-Reif', icon: '🦄', price: 210, unlockLevel: 5, isNew: true },
    { id: 'hair_halo', name: 'Heiligenschein', icon: '😇', price: 210, unlockLevel: 6, isNew: true }
  ],
  top: [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕', price: 0 },
    { id: 'hoodie', name: 'Hoodie', icon: '🧥', price: 50 },
    { id: 'oversize', name: 'Oversized', icon: '🎽', price: 90 },
    { id: 'jacket', name: 'Rennjacke', icon: '🏁', price: 140 },
    { id: 'pirate', name: 'Piraten-Weste', icon: '🏴‍☠️', price: 175, unlockLevel: 2, isNew: true },
    { id: 'sparkle_top', name: 'Glitzer-Top', icon: '✨', price: 155, unlockLevel: 3, isNew: true },
    { id: 'cape', name: 'Helden-Cape', icon: '🦸', price: 200 },
    { id: 'princess_coat', name: 'Gala-Outfit', icon: '👑', price: 240, unlockLevel: 5, isNew: true },
    { id: 'astronaut', name: 'Raumanzug', icon: '🧑‍🚀', price: 230, unlockLevel: 7, isNew: true }
  ],
  pants: [
    { id: 'shorts', name: 'Shorts', icon: '🩳', price: 0 },
    { id: 'jeans', name: 'Jeans', icon: '👖', price: 45 },
    { id: 'sweatpants', name: 'Jogginghose', icon: '🏃', price: 70 },
    { id: 'cargo', name: 'Cargo-Hose', icon: '🎒', price: 110 },
    { id: 'robot_legs', name: 'Cyber-Hose', icon: '🦾', price: 150, unlockLevel: 3, isNew: true },
    { id: 'star_jeans', name: 'Sternen-Hose', icon: '🌟', price: 135, unlockLevel: 4, isNew: true }
  ],
  shoes: [
    { id: 'barefoot', name: 'Barfuß', icon: '🦶', price: 0 },
    { id: 'sneakers', name: 'Sneakers', icon: '👟', price: 0 },
    { id: 'boots', name: 'Boots', icon: '🥾', price: 60 },
    { id: 'skates', name: 'Eis-Skates', icon: '⛸️', price: 130, unlockLevel: 2, isNew: true },
    { id: 'wings', name: 'Flügel-Schuhe', icon: '🪽', price: 150 },
    { id: 'glitter_boots', name: 'Glitzer-Boots', icon: '🪩', price: 185, unlockLevel: 5, isNew: true },
    { id: 'rocket', name: 'Raketen-Boots', icon: '🚀', price: 220, unlockLevel: 7 }
  ],
  ability: [
    {
      id: 'speed_boost',
      name: 'Supersprint',
      icon: '⚡',
      price: 0,
      description: 'Erhöht kurzzeitig das Tempo & macht unbesiegbar'
    },
    {
      id: 'double_jump',
      name: 'Doppelsprung',
      icon: '🦘',
      price: 100,
      description: 'Erlaubt einen zweiten Sprung in der Luft'
    },
    {
      id: 'coin_magnet',
      name: 'Münz-Magnet',
      icon: '🧲',
      price: 140,
      description: 'Zieht alle Münzen in der Nähe automatisch an'
    },
    {
      id: 'shield',
      name: 'Schutzschild',
      icon: '🛡️',
      price: 180,
      description: 'Schützt dich einmal vor einem Hindernis-Treffer'
    },
    {
      id: 'coin_rain',
      name: 'Münzregen',
      icon: '🌧️',
      price: 210,
      unlockLevel: 6,
      isNew: true,
      description: 'Lässt extra Goldmünzen vom Himmel regnen!'
    }
  ],
  background: [
    {
      id: 'meadow',
      name: 'Grüne Wiese',
      icon: '🌱',
      previewClass: 'meadow-preview',
      price: 0,
      description: 'Klassischer Parcours mit blauem Himmel und frischer Luft.'
    },
    {
      id: 'cave',
      name: 'Höhle & Hölle',
      icon: '🌋',
      previewClass: 'cave-preview',
      price: 0,
      description: 'Dunkelrote Felsen, Lava-Elemente und gefährliche Hitze.'
    },
    {
      id: 'neon',
      name: 'Neon-City',
      icon: '🌆',
      previewClass: 'neon-preview',
      price: 0,
      description: 'Futuristisches Nacht-Szenario im leuchtenden Cyberpunk-Glanz.'
    },
    {
      id: 'ice',
      name: 'Eiswelt',
      icon: '❄️',
      previewClass: 'ice-preview',
      price: 60,
      isNew: true,
      description: 'Polarlichter, fallender Schnee und glitzernde Eisberge.'
    },
    {
      id: 'beach',
      name: 'Tropen-Strand',
      icon: '🏖️',
      previewClass: 'beach-preview',
      price: 80,
      isNew: true,
      description: 'Palmen, türkises Meer und sonniger Sandstrand.'
    },
    {
      id: 'space',
      name: 'Weltraum',
      icon: '🚀',
      previewClass: 'space-preview',
      price: 100,
      isNew: true,
      description: 'Sternenhimmel, Planeten und schwebende Asteroiden.'
    },
    {
      id: 'candy',
      name: 'Candy-Land',
      icon: '🍬',
      previewClass: 'candy-preview',
      price: 120,
      isNew: true,
      description: 'Zuckerwatte-Wolken, Lutscher-Hügel und bunte Leckereien.'
    }
  ]
};

const COINS_KEY = 'runner_coins';
const UNLOCKED_KEY = 'runner_unlocked';
const CONFIG_KEY = 'runner_player_config';
const STATS_KEY = 'runner_stats';

export const MYSTERY_BOX_PRICE = 65;

function getDefaultUnlocked() {
  const defaults = {};
  Object.keys(SHOP_CATALOG).forEach((cat) => {
    defaults[cat] = SHOP_CATALOG[cat]
      .filter((item) => item.price === 0)
      .map((item) => item.id);
  });
  return defaults;
}

function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export const ShopManager = {
  getCoins() {
    const raw = localStorage.getItem(COINS_KEY);
    if (raw === null) {
      localStorage.setItem(COINS_KEY, '20');
      return 20;
    }
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
  },

  setCoins(amount) {
    const safeAmount = Math.max(0, Math.floor(amount));
    localStorage.setItem(COINS_KEY, String(safeAmount));
    return safeAmount;
  },

  addCoins(delta) {
    return this.setCoins(this.getCoins() + delta);
  },

  getUnlocked() {
    const defaults = getDefaultUnlocked();
    try {
      const raw = localStorage.getItem(UNLOCKED_KEY);
      if (!raw) return defaults;
      const saved = JSON.parse(raw);
      const merged = {};
      Object.keys(defaults).forEach((cat) => {
        const set = new Set([...(defaults[cat] || []), ...(saved[cat] || [])]);
        merged[cat] = Array.from(set);
      });
      return merged;
    } catch {
      return defaults;
    }
  },

  isUnlocked(category, itemId) {
    const unlocked = this.getUnlocked();
    return Array.isArray(unlocked[category]) && unlocked[category].includes(itemId);
  },

  isLevelUnlocked(item) {
    if (!item || !item.unlockLevel) return true;
    const playerLevel = this.getStats().level || 1;
    return playerLevel >= item.unlockLevel;
  },

  getItemsForLevel(targetLevel) {
    const items = [];
    Object.keys(SHOP_CATALOG).forEach((cat) => {
      SHOP_CATALOG[cat].forEach((item) => {
        if (item.unlockLevel === targetLevel) {
          items.push({ category: cat, ...item });
        }
      });
    });
    return items;
  },

  getItem(category, itemId) {
    const list = SHOP_CATALOG[category] || [];
    return list.find((item) => item.id === itemId) || null;
  },

  // Daily rotating 30% deals so there is always something fresh each day
  getDailyDeals() {
    const seed = getDateSeed();
    const allPaid = [];
    Object.keys(SHOP_CATALOG).forEach((cat) => {
      SHOP_CATALOG[cat].forEach((item) => {
        if (item.price > 0 && this.isLevelUnlocked(item)) {
          allPaid.push({ category: cat, id: item.id });
        }
      });
    });
    if (allPaid.length === 0) return [];
    const idx1 = seed % allPaid.length;
    const idx2 = (seed * 7 + 3) % allPaid.length;
    const deals = [allPaid[idx1]];
    if (idx2 !== idx1) deals.push(allPaid[idx2]);
    return deals;
  },

  isDailyDeal(category, itemId) {
    return this.getDailyDeals().some((d) => d.category === category && d.id === itemId);
  },

  getEffectivePrice(category, item) {
    if (!item || item.price <= 0) return 0;
    if (this.isDailyDeal(category, item.id)) {
      return Math.max(10, Math.round((item.price * 0.7) / 5) * 5);
    }
    return item.price;
  },

  buyItem(category, itemId) {
    const item = this.getItem(category, itemId);
    if (!item) return { ok: false, reason: 'not_found' };
    if (this.isUnlocked(category, itemId)) return { ok: true, alreadyUnlocked: true };

    if (!this.isLevelUnlocked(item)) {
      return { ok: false, reason: 'level_locked', requiredLevel: item.unlockLevel, item };
    }

    const price = this.getEffectivePrice(category, item);
    const coins = this.getCoins();
    if (coins < price) {
      return { ok: false, reason: 'insufficient_funds', missing: price - coins, item, price };
    }

    this.setCoins(coins - price);
    const unlocked = this.getUnlocked();
    unlocked[category].push(itemId);
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
    return { ok: true, item, price, remainingCoins: this.getCoins() };
  },

  buyMysteryBox() {
    const lockedPool = [];
    Object.keys(SHOP_CATALOG).forEach((cat) => {
      SHOP_CATALOG[cat].forEach((item) => {
        if (!this.isUnlocked(cat, item.id) && this.isLevelUnlocked(item)) {
          lockedPool.push({ category: cat, item });
        }
      });
    });

    if (lockedPool.length === 0) {
      return { ok: false, reason: 'all_unlocked' };
    }

    const coins = this.getCoins();
    if (coins < MYSTERY_BOX_PRICE) {
      return { ok: false, reason: 'insufficient_funds', missing: MYSTERY_BOX_PRICE - coins };
    }

    this.setCoins(coins - MYSTERY_BOX_PRICE);
    const pick = lockedPool[Math.floor(Math.random() * lockedPool.length)];
    const unlocked = this.getUnlocked();
    unlocked[pick.category].push(pick.item.id);
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));

    return {
      ok: true,
      category: pick.category,
      item: pick.item,
      remainingCoins: this.getCoins()
    };
  },

  getStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { totalMeters: 0, riddlesSolved: 0, level: 1 };
      const parsed = JSON.parse(raw);
      return {
        totalMeters: parsed.totalMeters || 0,
        riddlesSolved: parsed.riddlesSolved || 0,
        level: parsed.level || 1
      };
    } catch {
      return { totalMeters: 0, riddlesSolved: 0, level: 1 };
    }
  },

  recordProgress(metersAdded, riddlesAdded) {
    const stats = this.getStats();
    stats.totalMeters += metersAdded;
    stats.riddlesSolved += riddlesAdded;

    // Level up every 500 total meters or 5 points/riddles
    const newLevel = 1 + Math.floor((stats.totalMeters / 500) + (stats.riddlesSolved / 5));
    let levelUpBonus = 0;
    const previousLevel = stats.level;
    if (newLevel > stats.level) {
      const gainedLevels = newLevel - stats.level;
      levelUpBonus = gainedLevels * 30;
      stats.level = newLevel;
      this.addCoins(levelUpBonus);
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    if (stats.level > previousLevel && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('runner:level-up', {
        detail: {
          level: stats.level,
          previousLevel,
          bonusCoins: levelUpBonus
        }
      }));
    }
    return { stats, levelUpBonus };
  },

  savePlayerConfig(config) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  },

  loadPlayerConfig(targetConfig) {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (saved.body) {
        if (typeof saved.body.height === 'number') targetConfig.body.height = saved.body.height;
        if (typeof saved.body.width === 'number') targetConfig.body.width = saved.body.width;
        if (saved.body.faceId && this.isUnlocked('face', saved.body.faceId)) {
          targetConfig.body.faceId = saved.body.faceId;
        }
        if (saved.body.hairId && this.isUnlocked('hair', saved.body.hairId)) {
          targetConfig.body.hairId = saved.body.hairId;
        }
        if (saved.body.hairColor) targetConfig.body.hairColor = saved.body.hairColor;
      }

      if (saved.clothes) {
        if (saved.clothes.top) {
          if (saved.clothes.top.style && this.isUnlocked('top', saved.clothes.top.style)) {
            targetConfig.clothes.top.style = saved.clothes.top.style;
          }
          if (saved.clothes.top.color) targetConfig.clothes.top.color = saved.clothes.top.color;
          if (Array.isArray(saved.clothes.top.stickers)) {
            targetConfig.clothes.top.stickers = saved.clothes.top.stickers;
          }
        }
        if (saved.clothes.pants) {
          if (saved.clothes.pants.style && this.isUnlocked('pants', saved.clothes.pants.style)) {
            targetConfig.clothes.pants.style = saved.clothes.pants.style;
          }
          if (saved.clothes.pants.color) targetConfig.clothes.pants.color = saved.clothes.pants.color;
        }
        if (saved.clothes.shoes) {
          if (saved.clothes.shoes.style && this.isUnlocked('shoes', saved.clothes.shoes.style)) {
            targetConfig.clothes.shoes.style = saved.clothes.shoes.style;
          }
          if (saved.clothes.shoes.color) targetConfig.clothes.shoes.color = saved.clothes.shoes.color;
        }
      }

      if (saved.ability && this.isUnlocked('ability', saved.ability)) {
        targetConfig.ability = saved.ability;
      }
    } catch {
      // Keep defaults on parse error
    }
  }
};
