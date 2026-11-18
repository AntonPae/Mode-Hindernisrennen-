import { ShopManager } from '../editor/shopData.js';

/**
 * Interactive Puzzle / Rätsel Stop System
 * Combines curated German riddles with a procedural riddle generator
 * (sequences, math, emoji patterns, odd-one-out, word puzzles) so there are always new riddles!
 */

const RIDDLE_BANK = [
  {
    prompt: 'Was hat Zähne, kann aber nicht beißen?',
    options: [
      { id: 'comb', icon: '🪮', text: 'Ein Kamm' },
      { id: 'lion', icon: '🦁', text: 'Ein Löwe' },
      { id: 'spoon', icon: '🥄', text: 'Ein Löffel' }
    ],
    correctId: 'comb'
  },
  {
    prompt: 'Was wird immer nasser, je mehr es trocknet?',
    options: [
      { id: 'cloud', icon: '☁️', text: 'Eine Wolke' },
      { id: 'towel', icon: '🧻', text: 'Ein Handtuch' },
      { id: 'sun', icon: '☀️', text: 'Die Sonne' }
    ],
    correctId: 'towel'
  },
  {
    prompt: 'Ich habe Zeiger, aber keine Hände. Was bin ich?',
    options: [
      { id: 'clock', icon: '🕰️', text: 'Eine Uhr' },
      { id: 'tree', icon: '🌳', text: 'Ein Baum' },
      { id: 'shoe', icon: '👟', text: 'Ein Schuh' }
    ],
    correctId: 'clock'
  },
  {
    prompt: 'Welcher Monat hat 28 Tage?',
    options: [
      { id: 'feb', icon: '❄️', text: 'Nur der Februar' },
      { id: 'all', icon: '📅', text: 'Alle 12 Monate' },
      { id: 'jan', icon: '🎆', text: 'Nur der Januar' }
    ],
    correctId: 'all'
  },
  {
    prompt: 'Je mehr man davon wegnimmt, desto größer wird es. Was ist das?',
    options: [
      { id: 'cake', icon: '🎂', text: 'Ein Kuchen' },
      { id: 'mountain', icon: '⛰️', text: 'Ein Berg' },
      { id: 'hole', icon: '🕳️', text: 'Ein Loch' }
    ],
    correctId: 'hole'
  },
  {
    prompt: 'Was geht die Treppe rauf und runter, bewegt sich aber keinen Millimeter?',
    options: [
      { id: 'carpet', icon: '🧶', text: 'Ein Teppich' },
      { id: 'cat', icon: '🐱', text: 'Eine Katze' },
      { id: 'ball', icon: '⚽', text: 'Ein Ball' }
    ],
    correctId: 'carpet'
  },
  {
    prompt: 'Was fällt durchs Fenster, ohne die Scheibe zu zerbrechen?',
    options: [
      { id: 'stone', icon: '🪨', text: 'Ein Stein' },
      { id: 'light', icon: '☀️', text: 'Sonnenlicht' },
      { id: 'apple', icon: '🍎', text: 'Ein Apfel' }
    ],
    correctId: 'light'
  },
  {
    prompt: 'Was hat einen Hut und einen Stiel, aber keinen Kopf und keine Hände?',
    options: [
      { id: 'mushroom', icon: '🍄', text: 'Ein Pilz' },
      { id: 'robot', icon: '🤖', text: 'Ein Roboter' },
      { id: 'bird', icon: '🐦', text: 'Ein Vogel' }
    ],
    correctId: 'mushroom'
  },
  {
    prompt: 'Was gehört dir, wird aber fast nur von anderen benutzt?',
    options: [
      { id: 'bike', icon: '🚲', text: 'Dein Fahrrad' },
      { id: 'name', icon: '🏷️', text: 'Dein Name' },
      { id: 'bed', icon: '🛏️', text: 'Dein Bett' }
    ],
    correctId: 'name'
  },
  {
    prompt: 'Welches Tier kann nicht rückwärts gehen?',
    options: [
      { id: 'kangaroo', icon: '🦘', text: 'Ein Känguru' },
      { id: 'dog', icon: '🐶', text: 'Ein Hund' },
      { id: 'crab', icon: '🦀', text: 'Eine Krabbe' }
    ],
    correctId: 'kangaroo'
  },
  {
    prompt: 'Wenn du beim Rennen den 2. überholst, auf welchem Platz bist du dann?',
    options: [
      { id: '1st', icon: '🥇', text: 'Auf dem 1. Platz' },
      { id: '2nd', icon: '🥈', text: 'Auf dem 2. Platz' },
      { id: '3rd', icon: '🥉', text: 'Auf dem 3. Platz' }
    ],
    correctId: '2nd'
  },
  {
    prompt: 'Was ist schwerer: 1 kg Federn oder 1 kg Steine?',
    options: [
      { id: 'stones', icon: '🪨', text: '1 kg Steine' },
      { id: 'feathers', icon: '🪶', text: '1 kg Federn' },
      { id: 'equal', icon: '⚖️', text: 'Beide sind gleich schwer' }
    ],
    correctId: 'equal'
  },
  {
    prompt: 'Welche Farbe entsteht, wenn man Blau und Gelb mischt?',
    options: [
      { id: 'green', icon: '🟢', text: 'Grün' },
      { id: 'purple', icon: '🟣', text: 'Lila' },
      { id: 'orange', icon: '🟠', text: 'Orange' }
    ],
    correctId: 'green'
  },
  {
    prompt: 'Was hat viele Schlüssel, kann aber keine einzige Tür öffnen?',
    options: [
      { id: 'piano', icon: '🎹', text: 'Ein Klavier' },
      { id: 'car', icon: '🚗', text: 'Ein Auto' },
      { id: 'house', icon: '🏠', text: 'Ein Haus' }
    ],
    correctId: 'piano'
  },
  {
    prompt: 'Was läuft und läuft, hat aber keine Füße?',
    options: [
      { id: 'river', icon: '🌊', text: 'Ein Fluss' },
      { id: 'rabbit', icon: '🐇', text: 'Ein Hase' },
      { id: 'table', icon: '🪑', text: 'Ein Tisch' }
    ],
    correctId: 'river'
  },
  {
    prompt: 'Was hat 4 Beine, kann aber trotzdem nicht laufen?',
    options: [
      { id: 'table', icon: '🪑', text: 'Ein Tisch' },
      { id: 'horse', icon: '🐎', text: 'Ein Pferd' },
      { id: 'frog', icon: '🐸', text: 'Ein Frosch' }
    ],
    correctId: 'table'
  },
  {
    prompt: 'Je heißer es wird, desto frischer wird es. Was ist gemeint?',
    options: [
      { id: 'bread', icon: '🍞', text: 'Frisches Brot im Ofen' },
      { id: 'snowman', icon: '⛄', text: 'Ein Schneemann' },
      { id: 'icecream', icon: '🍦', text: 'Eine Eiskugel' }
    ],
    correctId: 'bread'
  },
  {
    prompt: 'Welcher Planet ist der Sonne am nächsten?',
    options: [
      { id: 'mercury', icon: '🪐', text: 'Merkur' },
      { id: 'mars', icon: '🔴', text: 'Mars' },
      { id: 'neptune', icon: '🔵', text: 'Neptun' }
    ],
    correctId: 'mercury'
  }
];

function generateDynamicRiddle() {
  const mode = Math.floor(Math.random() * 5);

  if (mode === 0) {
    // Dynamic number sequence
    const start = 2 + Math.floor(Math.random() * 10);
    const step = 2 + Math.floor(Math.random() * 7);
    const missingIdx = 2 + Math.floor(Math.random() * 2); // index 2 or 3
    const seq = [0, 1, 2, 3, 4].map((i) => (i === missingIdx ? '__' : start + i * step));
    const answer = start + missingIdx * step;
    const wrong1 = answer + (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
    const wrong2 = answer + step + (Math.random() < 0.5 ? 2 : -2);

    return {
      isDynamic: true,
      prompt: `Welche Zahl fehlt in der Reihe? ${seq.join(', ')}`,
      options: [
        { id: 'ans', icon: '🎯', text: String(answer) },
        { id: 'w1', icon: '🔢', text: String(wrong1) },
        { id: 'w2', icon: '🔢', text: String(wrong2 === wrong1 ? wrong2 + 3 : wrong2) }
      ],
      correctId: 'ans'
    };
  }

  if (mode === 1) {
    // Dynamic coin / animal math riddle
    const goldCount = 2 + Math.floor(Math.random() * 5);
    const gemCount = 1 + Math.floor(Math.random() * 2);
    const total = goldCount * 5 + gemCount * 15;
    return {
      isDynamic: true,
      prompt: `Du sammelst ${goldCount} Goldmünzen (je 5 🪙) und ${gemCount} Juwel${gemCount > 1 ? 'en' : ''} (je 15 🪙). Wie viel Spielgeld ist das?`,
      options: [
        { id: 'ans', icon: '🪙', text: `${total} Münzen` },
        { id: 'w1', icon: '🪙', text: `${total + 5} Münzen` },
        { id: 'w2', icon: '🪙', text: `${Math.max(5, total - 10)} Münzen` }
      ],
      correctId: 'ans'
    };
  }

  if (mode === 2) {
    // Dynamic animal legs math
    const cats = 1 + Math.floor(Math.random() * 3);
    const birds = 1 + Math.floor(Math.random() * 3);
    const legs = cats * 4 + birds * 2;
    return {
      isDynamic: true,
      prompt: `Wie viele Beine haben ${cats} Katze${cats > 1 ? 'n' : ''} und ${birds} Vogel${birds > 1 ? ' (Vögel)' : ''} zusammen?`,
      options: [
        { id: 'ans', icon: '🐾', text: `${legs} Beine` },
        { id: 'w1', icon: '🐾', text: `${legs + 2} Beine` },
        { id: 'w2', icon: '🐾', text: `${Math.max(2, legs - 2)} Beine` }
      ],
      correctId: 'ans'
    };
  }

  if (mode === 3) {
    // Dynamic emoji pattern
    const sets = [
      [{ icon: '⭐', text: 'Stern' }, { icon: '🔥', text: 'Flamme' }, { icon: '❄️', text: 'Schnee' }],
      [{ icon: '🍎', text: 'Apfel' }, { icon: '🍌', text: 'Banane' }, { icon: '🍇', text: 'Traube' }],
      [{ icon: '🚀', text: 'Rakete' }, { icon: '🪐', text: 'Planet' }, { icon: '🌙', text: 'Mond' }],
      [{ icon: '🐱', text: 'Katze' }, { icon: '🐶', text: 'Hund' }, { icon: '🐸', text: 'Frosch' }]
    ];
    const chosen = sets[Math.floor(Math.random() * sets.length)].sort(() => Math.random() - 0.5);
    const [a, b, c] = chosen;
    return {
      isDynamic: true,
      prompt: `Welches Symbol setzt das Muster fort? ${a.icon} ${b.icon} ${a.icon} ${b.icon} ${a.icon} __`,
      options: [
        { id: 'ans', icon: b.icon, text: b.text },
        { id: 'w1', icon: a.icon, text: a.text },
        { id: 'w2', icon: c.icon, text: c.text }
      ],
      correctId: 'ans'
    };
  }

  // Reverse word / odd-one-out
  const wordPairs = [
    { forward: 'TOR', backward: 'ROT', wrong1: 'ORT', wrong2: 'BROT' },
    { forward: 'NEBEL', backward: 'LEBEN', wrong1: 'EBEN', wrong2: 'REGEN' },
    { forward: 'LAGER', backward: 'REGAL', wrong1: 'GELB', wrong2: 'LAGE' },
    { forward: 'EIS', backward: 'SIE', wrong1: 'SEIN', wrong2: 'EINS' },
    { forward: 'REH', backward: 'HER', wrong1: 'EHE', wrong2: 'ERDE' }
  ];
  const wp = wordPairs[Math.floor(Math.random() * wordPairs.length)];
  return {
    isDynamic: true,
    prompt: `Welches Wort entsteht, wenn man "${wp.forward}" rückwärts liest?`,
    options: [
      { id: 'ans', icon: '🔤', text: wp.backward },
      { id: 'w1', icon: '🔤', text: wp.wrong1 },
      { id: 'w2', icon: '🔤', text: wp.wrong2 }
    ],
    correctId: 'ans'
  };
}

export class QuickTimeEventManager {
  constructor(runnerEngine) {
    this.runner = runnerEngine;
    this.active = false;
    this.phase = 'idle'; // 'idle' | 'stopping' | 'question' | 'solved'
    this.stopDelayTimer = 0;
    this.resultTimer = 0;
    this.currentRiddle = null;
    this.options = [];
    this.wrongIndices = new Set();
    this.usedRiddles = new Set();
    this.nextSpawnDistance = 150;

    this.containerEl = document.getElementById('qte-overlay');
    this.promptEl = document.getElementById('qte-prompt');
    this.optionsContainer = document.getElementById('qte-options');
    this.feedbackEl = document.getElementById('qte-feedback');

    this.initKeyListeners();
  }

  reset() {
    this.active = false;
    this.phase = 'idle';
    this.stopDelayTimer = 0;
    this.resultTimer = 0;
    this.currentRiddle = null;
    this.options = [];
    this.wrongIndices.clear();
    this.nextSpawnDistance = 150;
    this.hideOverlay();
  }

  initKeyListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.active || this.phase !== 'question') return;
      if (e.key === '1' || e.key === 'Digit1') {
        this.selectOption(0);
      } else if (e.key === '2' || e.key === 'Digit2') {
        this.selectOption(1);
      } else if (e.key === '3' || e.key === 'Digit3') {
        this.selectOption(2);
      }
    });
  }

  pickNextRiddle() {
    // 50% freshly generated puzzle, 50% classic curated riddle
    if (Math.random() < 0.5) {
      const dyn = generateDynamicRiddle();
      this.currentRiddle = dyn;
      this.options = [...dyn.options].sort(() => Math.random() - 0.5);
      return;
    }

    if (this.usedRiddles.size >= RIDDLE_BANK.length) {
      this.usedRiddles.clear();
    }
    const available = RIDDLE_BANK
      .map((r, idx) => ({ r, idx }))
      .filter(({ idx }) => !this.usedRiddles.has(idx));

    const picked = available[Math.floor(Math.random() * available.length)];
    this.usedRiddles.add(picked.idx);

    this.currentRiddle = picked.r;
    this.options = [...picked.r.options].sort(() => Math.random() - 0.5);
  }

  triggerPuzzleStop() {
    this.pickNextRiddle();
    this.wrongIndices.clear();
    this.active = true;
    this.phase = 'stopping';
    this.stopDelayTimer = 34;
    this.resultTimer = 0;
  }

  renderOverlay() {
    if (!this.containerEl || !this.promptEl || !this.optionsContainer) return;

    const tagText = this.currentRiddle.isDynamic ? '✨ Frisches Zufalls-Rätsel:' : 'Löse das Rätsel, um weiterzulaufen:';
    this.promptEl.innerHTML = `
      <span class="qte-sublabel">${tagText}</span>
      <div class="qte-question">${this.currentRiddle.prompt}</div>
    `;
    this.optionsContainer.innerHTML = '';

    if (this.feedbackEl) {
      this.feedbackEl.classList.add('hidden');
      this.feedbackEl.className = 'qte-feedback hidden';
      this.feedbackEl.textContent = '';
    }

    this.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qte-btn';
      btn.innerHTML = `
        <span class="qte-btn-key">[${idx + 1}]</span>
        <span class="qte-btn-icon">${opt.icon}</span>
        <span class="qte-btn-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => this.selectOption(idx));
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.selectOption(idx);
      }, { passive: false });
      this.optionsContainer.appendChild(btn);
    });

    this.containerEl.classList.remove('hidden');
  }

  hideOverlay() {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
  }

  selectOption(idx) {
    if (!this.active || this.phase !== 'question') return;
    if (this.wrongIndices.has(idx)) return;

    const chosen = this.options[idx];
    if (!chosen) return;

    const buttons = this.optionsContainer
      ? this.optionsContainer.querySelectorAll('.qte-btn')
      : [];
    const btn = buttons[idx];

    if (chosen.id === this.currentRiddle.correctId) {
      if (btn) btn.classList.add('qte-btn-correct');
      this.onSuccess();
    } else {
      this.wrongIndices.add(idx);
      if (btn) {
        btn.classList.add('qte-btn-wrong');
        btn.disabled = true;
      }
      this.onWrongAttempt();
    }
  }

  onSuccess() {
    this.phase = 'solved';
    this.resultTimer = 52;
    this.runner.sounds.playSuccess();
    this.runner.addBonusScore(50);
    this.runner.addRunCoins(25);
    const prog = ShopManager.recordProgress(0, 1);

    if (this.feedbackEl) {
      this.feedbackEl.className = 'qte-feedback qte-success-text';
      this.feedbackEl.textContent = prog.levelUpBonus > 0
        ? `🎉 Richtig! +50m, +25 🪙 & LEVEL UP (+${prog.levelUpBonus} 🪙)!`
        : '🎉 Richtig! +50m & +25 🪙 — Weiter geht\'s!';
    }
  }

  onWrongAttempt() {
    this.runner.sounds.playFail();

    if (this.feedbackEl) {
      this.feedbackEl.className = 'qte-feedback qte-fail-text';
      this.feedbackEl.textContent = '❌ Leider falsch! Versuch eine andere Antwort!';
    }
  }

  update(currentScore, canStartStop = true) {
    if (!this.active && canStartStop && currentScore >= this.nextSpawnDistance) {
      this.triggerPuzzleStop();
      this.nextSpawnDistance = currentScore + 220 + Math.floor(Math.random() * 70);
      return;
    }

    if (!this.active) return;

    if (this.phase === 'stopping') {
      this.stopDelayTimer--;
      if (this.stopDelayTimer <= 0) {
        this.phase = 'question';
        this.renderOverlay();
      }
      return;
    }

    if (this.phase === 'solved') {
      this.resultTimer--;
      if (this.resultTimer <= 0) {
        this.active = false;
        this.phase = 'idle';
        this.hideOverlay();
        this.runner.resumeFromPuzzle();
      }
    }
  }

  isEventActive() {
    return this.active;
  }
}
