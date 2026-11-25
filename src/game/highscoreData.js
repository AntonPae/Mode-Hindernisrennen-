const HIGHSCORE_LIST_KEY = 'runner_highscores_v1';
const LEGACY_BEST_KEY = 'runner_highscore';

const WORLD_LABELS = {
  meadow: '🌱 Grüne Wiese',
  cave: '🌋 Höhle & Hölle',
  neon: '🌆 Neon-City',
  ice: '❄️ Eiswelt',
  beach: '🏖️ Tropen-Strand',
  space: '🚀 Weltraum',
  candy: '🍬 Candy-Land'
};

export function getWorldLabel(biome) {
  return WORLD_LABELS[biome] || '🌱 Grüne Wiese';
}

function getDefaultState() {
  const legacyBest = parseInt(localStorage.getItem(LEGACY_BEST_KEY) || '0', 10);
  const entries = [];
  if (!Number.isNaN(legacyBest) && legacyBest > 0) {
    entries.push({
      id: `hs_legacy_${Date.now()}`,
      name: 'Du',
      score: legacyBest,
      biome: 'meadow',
      worldLabel: getWorldLabel('meadow'),
      coins: 0,
      timestamp: Date.now()
    });
  }
  return {
    runnerName: 'Du',
    entries
  };
}

export const HighscoreManager = {
  getState() {
    try {
      const raw = localStorage.getItem(HIGHSCORE_LIST_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            runnerName: (parsed.runnerName || 'Du').trim() || 'Du',
            entries: Array.isArray(parsed.entries) ? parsed.entries : []
          };
        }
      }
    } catch {
      // fall through
    }
    const def = getDefaultState();
    this.saveState(def);
    return def;
  },

  saveState(state) {
    try {
      localStorage.setItem(HIGHSCORE_LIST_KEY, JSON.stringify({
        runnerName: (state.runnerName || 'Du').trim() || 'Du',
        entries: Array.isArray(state.entries) ? state.entries.slice(0, 80) : []
      }));
    } catch {
      // ignore storage errors
    }
  },

  getRunnerName() {
    return this.getState().runnerName;
  },

  setRunnerName(name) {
    const clean = (name || '').trim().slice(0, 22) || 'Du';
    const state = this.getState();
    state.runnerName = clean;
    this.saveState(state);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('runner:highscores-updated'));
    }
    return clean;
  },

  getEntries() {
    return this.getState().entries;
  },

  getTopEntries(limit = 30) {
    return [...this.getEntries()]
      .sort((a, b) => (b.score - a.score) || (b.timestamp - a.timestamp))
      .slice(0, limit);
  },

  getRecentEntries(limit = 30) {
    return [...this.getEntries()]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },

  getBestPerRunner() {
    const byName = new Map();
    this.getEntries().forEach((entry) => {
      const key = (entry.name || 'Du').toLowerCase();
      const prev = byName.get(key);
      if (!prev || entry.score > prev.score || (entry.score === prev.score && entry.timestamp > prev.timestamp)) {
        byName.set(key, entry);
      }
    });
    return Array.from(byName.values()).sort((a, b) => (b.score - a.score) || (b.timestamp - a.timestamp));
  },

  getOverallBestScore() {
    const top = this.getTopEntries(1)[0];
    const legacy = parseInt(localStorage.getItem(LEGACY_BEST_KEY) || '0', 10) || 0;
    return Math.max(top ? top.score : 0, legacy);
  },

  recordRun({ name = null, score = 0, biome = 'meadow', runCoins = 0 } = {}) {
    const safeScore = Math.max(0, Math.floor(score));
    const state = this.getState();
    const runnerName = (name || state.runnerName || 'Du').trim().slice(0, 22) || 'Du';
    const entry = {
      id: `hs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: runnerName,
      score: safeScore,
      biome,
      worldLabel: getWorldLabel(biome),
      coins: Math.max(0, Math.floor(runCoins)),
      timestamp: Date.now()
    };

    if (safeScore > 0) {
      state.entries.push(entry);
      // Keep the best 50 scores plus the 20 most recent runs so neither history nor top list disappears
      const topSet = new Set(
        [...state.entries].sort((a, b) => b.score - a.score).slice(0, 50).map((e) => e.id)
      );
      const recentSet = new Set(
        [...state.entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20).map((e) => e.id)
      );
      state.entries = state.entries.filter((e) => topSet.has(e.id) || recentSet.has(e.id));
      this.saveState(state);
    }

    const sorted = this.getTopEntries(80);
    const rankIndex = sorted.findIndex((e) => e.id === entry.id);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('runner:highscores-updated'));
    }

    return {
      entry,
      rank: rankIndex >= 0 ? rankIndex + 1 : null,
      overallBest: this.getOverallBestScore()
    };
  },

  clearEntries() {
    const state = this.getState();
    state.entries = [];
    this.saveState(state);
    localStorage.setItem(LEGACY_BEST_KEY, '0');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('runner:highscores-updated'));
    }
  }
};
