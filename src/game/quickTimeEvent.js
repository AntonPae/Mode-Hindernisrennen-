/**
 * Interactive Puzzle / Rätsel Stop System
 * When triggered, the character stops running and stands still first,
 * then a riddle appears. The player must solve the riddle before they can continue!
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
    prompt: 'Wie viele Beine haben 2 Katzen und 1 Vogel zusammen?',
    options: [
      { id: '6', icon: '6️⃣', text: '6 Beine' },
      { id: '8', icon: '8️⃣', text: '8 Beine' },
      { id: '10', icon: '🔟', text: '10 Beine' }
    ],
    correctId: '10'
  },
  {
    prompt: 'Welche Zahl fehlt in der Reihe? 2, 4, 6, __, 10',
    options: [
      { id: '7', icon: '7️⃣', text: '7' },
      { id: '8', icon: '8️⃣', text: '8' },
      { id: '9', icon: '9️⃣', text: '9' }
    ],
    correctId: '8'
  },
  {
    prompt: 'Welche Zahl fehlt? 5, 10, 15, __, 25',
    options: [
      { id: '18', icon: '🔢', text: '18' },
      { id: '20', icon: '🎯', text: '20' },
      { id: '22', icon: '🔢', text: '22' }
    ],
    correctId: '20'
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
  }
];

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
    this.nextSpawnDistance = 150; // First puzzle around 150m, then every ~220-290m

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
    // Character visibly stops and stands still for ~0.55s before the riddle modal opens
    this.stopDelayTimer = 34;
    this.resultTimer = 0;
  }

  renderOverlay() {
    if (!this.containerEl || !this.promptEl || !this.optionsContainer) return;

    this.promptEl.innerHTML = `
      <span class="qte-sublabel">Löse das Rätsel, um weiterzulaufen:</span>
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
    this.resultTimer = 52; // ~0.85s celebration before resuming run
    this.runner.sounds.playSuccess();
    this.runner.addBonusScore(50);

    if (this.feedbackEl) {
      this.feedbackEl.className = 'qte-feedback qte-success-text';
      this.feedbackEl.textContent = '🎉 Richtig gelöst! +50m Bonus — Weiter geht\'s!';
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
    // Check spawn trigger when running freely on safe ground
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
