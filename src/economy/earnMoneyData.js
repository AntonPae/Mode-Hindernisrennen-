import { ShopManager } from '../editor/shopData.js';
import { BankManager } from './bankData.js';

const EARN_KEY = 'runner_earn_state';
const WHEEL_REGEN_MS = 120000; // 2 minutes for passive ticket regen
const QUIZ_REGEN_MS = 45000;   // 45 seconds per quiz energy
const TREASURE_COOLDOWN_MS = 45000; // 45 seconds cooldown (or instant reset on run end)

export const WHEEL_SEGMENTS = [
  { label: '+5 🪙', coins: 5, color: '#38bdf8', textColor: '#ffffff' },
  { label: '+10 🪙', coins: 10, color: '#34d399', textColor: '#581c87' },
  { label: '+6 🪙 + 🥘', coins: 6, supply: 'food', supplyLabel: '1x Koch-Zutaten', color: '#fbbf24', textColor: '#581c87' },
  { label: '+15 🪙', coins: 15, color: '#a855f7', textColor: '#ffffff' },
  { label: '+4 🪙', coins: 4, color: '#f472b6', textColor: '#ffffff' },
  { label: '+12 🪙', coins: 12, color: '#ec4899', textColor: '#ffffff' },
  { label: '+6 🪙 + 🦴', coins: 6, supply: 'petFood', supplyLabel: '1x Tierfutter', color: '#22d3ee', textColor: '#581c87' },
  { label: '25 🪙!', coins: 25, jackpot: true, color: '#fde047', textColor: '#701a75' }
];

export const MISSION_DEFS = [
  {
    id: 'run_meters',
    title: 'Lauf-Champion',
    icon: '🏃',
    baseTarget: 250,
    stepTarget: 175,
    baseReward: 12,
    stepReward: 5,
    describe: (target) => `Laufe insgesamt ${target} m im Rennen`
  },
  {
    id: 'solve_riddles',
    title: 'Rätsel-Fuchs',
    icon: '🧩',
    baseTarget: 3,
    stepTarget: 2,
    baseReward: 14,
    stepReward: 5,
    describe: (target) => `Löse ${target} Rätsel (im Lauf oder Blitz-Quiz)`
  },
  {
    id: 'collect_coins',
    title: 'Münzsammler',
    icon: '🪙',
    baseTarget: 35,
    stepTarget: 25,
    baseReward: 12,
    stepReward: 5,
    describe: (target) => `Sammle ${target} 🪙 auf der Laufstrecke`
  },
  {
    id: 'home_care',
    title: 'Haus- & Tierfreund',
    icon: '🏡',
    baseTarget: 4,
    stepTarget: 2,
    baseReward: 12,
    stepReward: 5,
    describe: (target) => `Erledige ${target} Pflege-Aktionen in Haus & Garten`
  },
  {
    id: 'serve_icecream',
    title: 'Café- & Eis-Profi',
    icon: '🍽️',
    baseTarget: 3,
    stepTarget: 2,
    baseReward: 15,
    stepReward: 6,
    describe: (target) => `Bediene ${target} Tische in Café & Eisdiele`
  },
  {
    id: 'pet_sitter',
    title: 'Nachbar-Tiersitter',
    icon: '🐕',
    baseTarget: 3,
    stepTarget: 2,
    baseReward: 15,
    stepReward: 6,
    describe: (target) => `Passe auf ${target} Hunde & Tiere bei den Nachbarn auf`
  }
];

function getDefaultEarnState() {
  const now = Date.now();
  const missions = {};
  MISSION_DEFS.forEach((m) => {
    missions[m.id] = { progress: 0, tier: 1 };
  });
  return {
    wheelTickets: 2,
    lastWheelRegen: now,
    quizEnergy: 3,
    lastQuizRegen: now,
    quizStreak: 0,
    treasureNextAt: 0,
    missions
  };
}

export const EarnMoneyManager = {
  getState() {
    const def = getDefaultEarnState();
    let state;
    try {
      const raw = localStorage.getItem(EARN_KEY);
      if (!raw) {
        state = def;
      } else {
        const parsed = JSON.parse(raw);
        state = {
          wheelTickets: typeof parsed.wheelTickets === 'number' ? parsed.wheelTickets : def.wheelTickets,
          lastWheelRegen: parsed.lastWheelRegen || Date.now(),
          quizEnergy: typeof parsed.quizEnergy === 'number' ? parsed.quizEnergy : def.quizEnergy,
          lastQuizRegen: parsed.lastQuizRegen || Date.now(),
          quizStreak: parsed.quizStreak || 0,
          treasureNextAt: parsed.treasureNextAt || 0,
          missions: { ...def.missions, ...(parsed.missions || {}) }
        };
      }
    } catch {
      state = def;
    }

    const now = Date.now();
    let dirty = false;

    // Passive wheel ticket regen up to 2 tickets
    if (state.wheelTickets < 2) {
      const elapsed = now - state.lastWheelRegen;
      if (elapsed >= WHEEL_REGEN_MS) {
        const gained = Math.floor(elapsed / WHEEL_REGEN_MS);
        state.wheelTickets = Math.min(2, state.wheelTickets + gained);
        state.lastWheelRegen = now;
        dirty = true;
      }
    } else {
      state.lastWheelRegen = now;
    }

    // Passive quiz energy regen up to 3
    if (state.quizEnergy < 3) {
      const elapsed = now - state.lastQuizRegen;
      if (elapsed >= QUIZ_REGEN_MS) {
        const gained = Math.floor(elapsed / QUIZ_REGEN_MS);
        state.quizEnergy = Math.min(3, state.quizEnergy + gained);
        state.lastQuizRegen = now;
        dirty = true;
      }
    } else {
      state.lastQuizRegen = now;
    }

    if (dirty) {
      this.saveState(state);
    }
    return state;
  },

  saveState(state) {
    try {
      localStorage.setItem(EARN_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  },

  recordEvent({ meters = 0, riddles = 0, coins = 0, care = 0, icecream = 0, petsit = 0, runFinished = false } = {}) {
    const state = this.getState();

    if (meters > 0 && state.missions.run_meters) {
      state.missions.run_meters.progress += meters;
    }
    if (riddles > 0 && state.missions.solve_riddles) {
      state.missions.solve_riddles.progress += riddles;
    }
    if (coins > 0 && state.missions.collect_coins) {
      state.missions.collect_coins.progress += coins;
    }
    if (care > 0 && state.missions.home_care) {
      state.missions.home_care.progress += care;
    }
    if (icecream > 0 && state.missions.serve_icecream) {
      state.missions.serve_icecream.progress += icecream;
    }
    if (petsit > 0 && state.missions.pet_sitter) {
      state.missions.pet_sitter.progress += petsit;
    }

    // Finishing a run refreshes quiz & treasure hunt and grants a wheel ticket if >= 40m
    if (runFinished) {
      state.quizEnergy = 3;
      state.lastQuizRegen = Date.now();
      state.treasureNextAt = 0;
      if (meters >= 40) {
        state.wheelTickets = Math.min(5, state.wheelTickets + 1);
      }
    }

    this.saveState(state);
    return state;
  },

  getMissionsView() {
    const state = this.getState();
    return MISSION_DEFS.map((def) => {
      const entry = state.missions[def.id] || { progress: 0, tier: 1 };
      const target = def.baseTarget + (entry.tier - 1) * def.stepTarget;
      const reward = def.baseReward + (entry.tier - 1) * def.stepReward;
      const progress = Math.min(target, entry.progress);
      return {
        id: def.id,
        title: `${def.title} (Stufe ${entry.tier})`,
        icon: def.icon,
        desc: def.describe(target),
        progress,
        rawProgress: entry.progress,
        target,
        reward,
        tier: entry.tier,
        ready: entry.progress >= target
      };
    });
  },

  claimMission(missionId) {
    const state = this.getState();
    const def = MISSION_DEFS.find((m) => m.id === missionId);
    if (!def) return { ok: false };

    const entry = state.missions[missionId] || { progress: 0, tier: 1 };
    const target = def.baseTarget + (entry.tier - 1) * def.stepTarget;
    const reward = def.baseReward + (entry.tier - 1) * def.stepReward;

    if (entry.progress < target) {
      return { ok: false, reason: 'not_ready' };
    }

    entry.progress = Math.max(0, entry.progress - target);
    entry.tier += 1;
    state.missions[missionId] = entry;
    this.saveState(state);

    BankManager.depositEarned(reward, `📋 Mission: ${def.title}`);
    return { ok: true, reward, newTier: entry.tier };
  },

  getReadyBadgeCount() {
    const state = this.getState();
    const missionsReady = this.getMissionsView().filter((m) => m.ready).length;
    const wheelReady = state.wheelTickets > 0 ? 1 : 0;
    return missionsReady + wheelReady;
  },

  spinWheel() {
    const state = this.getState();
    if (state.wheelTickets <= 0) {
      return { ok: false, reason: 'no_tickets' };
    }
    state.wheelTickets -= 1;
    if (state.wheelTickets < 2) {
      state.lastWheelRegen = Date.now();
    }
    this.saveState(state);

    const index = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segment = WHEEL_SEGMENTS[index];
    BankManager.depositEarned(segment.coins, '🎡 Glücksrad-Gewinn');

    return { ok: true, index, segment, ticketsLeft: state.wheelTickets };
  },

  getTreasureCooldownLeftMs() {
    const state = this.getState();
    return Math.max(0, state.treasureNextAt - Date.now());
  },

  startTreasureCooldown() {
    const state = this.getState();
    state.treasureNextAt = Date.now() + TREASURE_COOLDOWN_MS;
    this.saveState(state);
  },

  awardTreasureCoins(amount) {
    if (amount > 0) {
      BankManager.depositEarned(amount, '🪙 Schatzjagd-Beute');
    }
    return BankManager.getBalance();
  },

  answerQuiz(isCorrect) {
    const state = this.getState();
    if (state.quizEnergy <= 0) {
      return { ok: false, reason: 'no_energy' };
    }

    state.quizEnergy -= 1;
    if (state.quizEnergy < 3) {
      state.lastQuizRegen = Date.now();
    }

    let coinsEarned = 0;
    let streakBonus = 0;

    if (isCorrect) {
      coinsEarned = 6;
      state.quizStreak = (state.quizStreak || 0) + 1;
      if (state.quizStreak % 3 === 0) {
        streakBonus = 4;
      }
      if (state.missions.solve_riddles) {
        state.missions.solve_riddles.progress += 1;
      }
      BankManager.depositEarned(coinsEarned + streakBonus, '🧠 Blitz-Quiz');
    } else {
      state.quizStreak = 0;
    }

    this.saveState(state);
    return {
      ok: true,
      isCorrect,
      coinsEarned,
      streakBonus,
      totalEarned: coinsEarned + streakBonus,
      energyLeft: state.quizEnergy,
      streak: state.quizStreak
    };
  }
};
