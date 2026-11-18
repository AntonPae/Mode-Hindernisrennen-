/**
 * Interactive Mini-Puzzle & Quick-Time Event (QTE) System
 * Spawns fast decision / reaction puzzles during the run (e.g. pick matching rune/symbol).
 * Features bullet-time/slow-down, animated countdown timer, rewards, and touch & keyboard inputs.
 */

export class QuickTimeEventManager {
  constructor(runnerEngine) {
    this.runner = runnerEngine;
    this.active = false;
    this.timer = 0;
    this.maxTime = 180; // ~3 seconds of bullet time
    this.targetOption = null;
    this.options = [];
    this.result = null; // 'success' | 'fail' | null
    this.resultTimer = 0;
    this.nextSpawnDistance = 250; // First event at ~250m, then every ~300m

    this.containerEl = document.getElementById('qte-overlay');
    this.promptEl = document.getElementById('qte-prompt');
    this.optionsContainer = document.getElementById('qte-options');
    this.timerBar = document.getElementById('qte-timer-bar');

    this.initKeyListeners();
  }

  reset() {
    this.active = false;
    this.timer = 0;
    this.result = null;
    this.resultTimer = 0;
    this.nextSpawnDistance = 250;
    this.hideOverlay();
  }

  initKeyListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.key === '1' || e.key === 'Digit1') {
        this.selectOption(0);
      } else if (e.key === '2' || e.key === 'Digit2') {
        this.selectOption(1);
      } else if (e.key === '3' || e.key === 'Digit3') {
        this.selectOption(2);
      }
    });
  }

  triggerRandomEvent() {
    const symbolBank = [
      { id: 'star', symbol: '⭐', label: 'Stern' },
      { id: 'flame', symbol: '🔥', label: 'Flamme' },
      { id: 'lightning', symbol: '⚡', label: 'Blitz' },
      { id: 'heart', symbol: '❤️', label: 'Herz' },
      { id: 'gem', symbol: '💎', label: 'Diamant' }
    ];

    // Pick 3 random distinct options
    const shuffled = [...symbolBank].sort(() => Math.random() - 0.5);
    this.options = shuffled.slice(0, 3);

    // Pick one target option
    this.targetOption = this.options[Math.floor(Math.random() * this.options.length)];

    this.active = true;
    this.timer = this.maxTime;
    this.result = null;

    this.renderOverlay();
  }

  renderOverlay() {
    if (!this.containerEl || !this.promptEl || !this.optionsContainer) return;

    this.promptEl.innerHTML = `Wähle schnell das richtige Portal:<br><strong class="qte-target-highlight">${this.targetOption.symbol} ${this.targetOption.label}</strong>`;
    this.optionsContainer.innerHTML = '';

    this.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'qte-btn';
      btn.innerHTML = `<span class="qte-btn-key">[${idx + 1}]</span> <span class="qte-btn-symbol">${opt.symbol}</span>`;
      btn.addEventListener('click', () => this.selectOption(idx));
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.selectOption(idx);
      }, { passive: false });
      this.optionsContainer.appendChild(btn);
    });

    if (this.timerBar) {
      this.timerBar.style.width = '100%';
    }

    this.containerEl.classList.remove('hidden');
  }

  hideOverlay() {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
  }

  selectOption(idx) {
    if (!this.active || this.result !== null) return;

    const chosen = this.options[idx];
    if (chosen && chosen.id === this.targetOption.id) {
      this.onSuccess();
    } else {
      this.onFail();
    }
  }

  onSuccess() {
    this.result = 'success';
    this.resultTimer = 45; // ~0.75s result message
    this.runner.sounds.playSuccess();
    this.runner.addBonusScore(50);
    this.runner.triggerBonusSpeed();

    if (this.promptEl) {
      this.promptEl.innerHTML = `<span class="qte-success-text">✨ PERFEKT! +50m BONUS & BOOST! ✨</span>`;
    }
  }

  onFail() {
    this.result = 'fail';
    this.resultTimer = 45;
    this.runner.sounds.playFail();

    if (this.promptEl) {
      this.promptEl.innerHTML = `<span class="qte-fail-text">❌ ZU LANGSAM / FALSCH! ❌</span>`;
    }
  }

  update(currentScore) {
    // Check spawn trigger
    if (!this.active && currentScore >= this.nextSpawnDistance) {
      this.triggerRandomEvent();
      this.nextSpawnDistance = currentScore + 280 + Math.floor(Math.random() * 80);
    }

    if (!this.active) return;

    if (this.result !== null) {
      this.resultTimer--;
      if (this.resultTimer <= 0) {
        this.active = false;
        this.hideOverlay();
      }
      return;
    }

    // Bullet-time countdown
    this.timer--;
    if (this.timerBar) {
      const pct = Math.max(0, (this.timer / this.maxTime) * 100);
      this.timerBar.style.width = `${pct}%`;
    }

    if (this.timer <= 0) {
      this.onFail();
    }
  }

  isEventActive() {
    return this.active;
  }
}
