import { PlayerConfig, GameConfig } from '../editor/characterData.js';
import { ShopManager } from '../editor/shopData.js';
import { BankManager } from '../economy/bankData.js';
import { HomeManager } from '../home/homeData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ControlsManager } from './controls.js';
import { ObstacleManager, CoinManager } from './obstacles.js';
import { QuickTimeEventManager } from './quickTimeEvent.js';
import { HighscoreManager } from './highscoreData.js';
import { drawVectorPet, getPetMeta } from '../home/petCompanion.js';
import { drawPlayerWithTransport, MOUNT_META } from '../town/transportRenderer.js';

class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSprint() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(850, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playCollision() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playDuck() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playSuccess() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.3, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  }

  playFail() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [240, 180].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.35, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.15 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.25);
    });
  }

  playCoin(isGem = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isGem ? 880 : 660, now);
    osc.frequency.setValueAtTime(isGem ? 1320 : 990, now + 0.06);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playShieldBreak() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.28);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }
}

export class RunnerEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.controls = new ControlsManager();
    this.obstacles = new ObstacleManager();
    this.coins = new CoinManager();
    this.sounds = new SoundManager();
    this.qte = new QuickTimeEventManager(this);

    this.scoreValEl = document.getElementById('scoreVal');
    this.runCoinsValEl = document.getElementById('runCoinsVal');
    this.highScoreValEl = document.getElementById('highScoreVal');
    this.runMountPillEl = document.getElementById('runMountPill');
    this.finalScoreEl = document.getElementById('finalScore');
    this.earnedCoinsValEl = document.getElementById('earnedCoinsVal');
    this.totalCoinsValEl = document.getElementById('totalCoinsVal');
    this.totalBankValEl = document.getElementById('totalBankVal');
    this.gameOverRunnerMetaEl = document.getElementById('gameOverRunnerMeta');
    this.gameoverBonusBreakdownEl = document.getElementById('gameoverBonusBreakdown');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.pauseBtn = document.getElementById('pauseBtn');
    this.hudHighscoreBtn = document.getElementById('gameHudHighscoreBtn');
    this.gameOverHighscoreBtn = document.getElementById('gameOverHighscoreBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.editorReturnBtn = document.getElementById('editorReturnBtn');
    this.homeReturnBtn = document.getElementById('homeReturnBtn');

    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.runCoins = 0;
    this.highScore = HighscoreManager.getOverallBestScore();
    if (this.highScoreValEl) this.highScoreValEl.textContent = this.highScore;

    this.magnetTimer = 0;
    this.coinRainTimer = 0;
    this.shieldActive = false;
    this.shieldCooldown = 0;

    this.scrollX = 0;
    this.baseSpeed = 5;
    this.currentSpeed = this.baseSpeed;
    this.activeMount = null;
    this.activeMountMeta = null;

    // Dynamic Biome / Background switching
    this.currentBiome = 'meadow';
    this.biomeList = ['meadow', 'cave', 'neon', 'ice', 'beach', 'space', 'candy'];
    this.biomeTransitionDistance = 200; // Switch biome every 200m
    this.zoneNotificationTimer = 0;
    this.zoneNotificationText = '';

    // Visual particles array (dust, stars, speedlines)
    this.particles = [];

    // Player physics state
    this.player = {
      x: 120,
      y: 0,
      vy: 0,
      gravity: 0.65,
      jumpForce: -13.5,
      isGrounded: false,
      jumpsLeft: 1,
      isDucking: false,
      invulnerable: false,
      invulnerableTimer: 0,
      animFrame: 0
    };

    // Companion pet followers running behind the player
    this.companionStates = [];
    this.companionHitboxes = [];
    this.playerHeightTrail = [];

    this.initUIEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => this.resizeCanvas());
    }
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(this.canvas);
    }
  }

  initUIEvents() {
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '▶️ Weiter' : '⏸️ Pause';
      });
    }

    if (this.hudHighscoreBtn) {
      this.hudHighscoreBtn.addEventListener('click', () => {
        const wasPaused = this.isPaused;
        if (this.isRunning && !wasPaused) {
          this.isPaused = true;
          if (this.pauseBtn) this.pauseBtn.textContent = '▶️ Weiter';
        }
        window.dispatchEvent(new CustomEvent('runner:open-highscores', {
          detail: {
            tab: 'top',
            onClose: () => {
              if (this.isRunning && !wasPaused) {
                this.isPaused = false;
                if (this.pauseBtn) this.pauseBtn.textContent = '⏸️ Pause';
              }
            }
          }
        }));
      });
    }

    if (this.gameOverHighscoreBtn) {
      this.gameOverHighscoreBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('runner:open-highscores', {
          detail: { tab: 'top' }
        }));
      });
    }

    window.addEventListener('runner:highscores-updated', () => {
      this.highScore = HighscoreManager.getOverallBestScore();
      if (this.highScoreValEl) this.highScoreValEl.textContent = this.highScore;
    });

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.gameOverModal.classList.add('hidden');
        this.start();
      });
    }

    if (this.editorReturnBtn) {
      this.editorReturnBtn.addEventListener('click', () => {
        this.gameOverModal.classList.add('hidden');
        this.stateManager.setState('EDITOR');
      });
    }

    if (this.homeReturnBtn) {
      this.homeReturnBtn.addEventListener('click', () => {
        this.gameOverModal.classList.add('hidden');
        this.stateManager.setState('HOME');
      });
    }

    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => {
        if (!this.isRunning || this.stateManager.getState() !== 'GAME') return;
        const rect = this.canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        for (let i = this.companionHitboxes.length - 1; i >= 0; i--) {
          const box = this.companionHitboxes[i];
          if (Math.hypot(cx - box.x, cy - box.y) <= box.r) {
            const st = this.companionStates.find((s) => s.id === box.id);
            const meta = getPetMeta((st && st.petRef) || box.id);
            if (st) {
              st.tapBounce = 24;
              st.speechTimer = 90;
              st.speechText = meta.say;
            }
            HomeManager.cuddleCompanionPet(box.id);
            this.sounds.playCoin(false);
            for (let k = 0; k < 6; k++) {
              this.particles.push({
                type: 'star',
                x: box.x + (Math.random() - 0.5) * 32,
                y: box.y - 10 + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -1.5 - Math.random() * 1.5,
                size: 12,
                alpha: 1,
                life: 28
              });
            }
            break;
          }
        }
      });
    }
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width || window.innerWidth));
    const h = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.displayWidth = w;
    this.displayHeight = h;
  }

  getGroundY() {
    return Math.min(this.displayHeight * 0.72, Math.max(180, this.displayHeight - 115));
  }

  start(payload = {}) {
    this.sounds.init();
    this.resizeCanvas();

    this.isRunning = true;
    this.isPaused = false;
    if (this.pauseBtn) this.pauseBtn.textContent = '⏸️ Pause';
    this.score = 0;
    this.runCoins = 0;
    this.highScore = HighscoreManager.getOverallBestScore();
    if (this.highScoreValEl) this.highScoreValEl.textContent = this.highScore;
    if (this.scoreValEl) this.scoreValEl.textContent = '0';
    if (this.runCoinsValEl) this.runCoinsValEl.textContent = '0';
    this.magnetTimer = 0;
    this.coinRainTimer = 0;
    this.shieldActive = false;
    this.shieldCooldown = 0;
    this.currentBiome = (payload && payload.background) || GameConfig.background || 'meadow';
    this.biomeStartIndex = Math.max(0, this.biomeList.indexOf(this.currentBiome));

    const requestedMountId = (payload && payload.mountId !== undefined)
      ? payload.mountId
      : HomeManager.getRaceMountId();
    const validMountId = (requestedMountId && HomeManager.hasItem('mounts', requestedMountId))
      ? requestedMountId
      : null;
    this.activeMount = validMountId ? { kind: 'mount', id: validMountId } : null;
    this.activeMountMeta = validMountId ? (MOUNT_META[validMountId] || null) : null;

    if (this.runMountPillEl) {
      if (this.activeMountMeta) {
        this.runMountPillEl.textContent = `${this.activeMountMeta.icon} ${this.activeMountMeta.name}`;
        this.runMountPillEl.classList.remove('hidden');
      } else {
        this.runMountPillEl.classList.add('hidden');
      }
    }

    this.baseSpeed = this.activeMountMeta
      ? 5.4 + Math.max(0, ((this.activeMountMeta.speedTown || 7.4) - 7.0) * 0.25)
      : 5;
    this.player.jumpForce = this.activeMountMeta ? -14.2 : -13.5;

    this.zoneNotificationTimer = 120; // 2 seconds banner at start
    this.zoneNotificationText = this.activeMountMeta
      ? `${this.getBiomeName(this.currentBiome)} • ${this.activeMountMeta.icon}`
      : this.getBiomeName(this.currentBiome);
    this.scrollX = 0;
    this.currentSpeed = this.baseSpeed;
    this.particles = [];

    const groundY = this.getGroundY();
    this.player.y = groundY;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    this.player.invulnerable = false;
    this.player.invulnerableTimer = 0;

    const ownCompanions = HomeManager.getCompanionPets().map((id) => ({ id, petRef: id }));
    const sitCompanions = HomeManager.getSittingCompanions().map((sit) => ({ id: sit.id, petRef: sit }));
    this.companionStates = [...ownCompanions, ...sitCompanions].map((entry) => ({
      id: entry.id,
      petRef: entry.petRef,
      tapBounce: 0,
      speechTimer: 0,
      speechText: ''
    }));
    this.companionHitboxes = [];
    this.playerHeightTrail = [];

    this.controls.reset();
    this.obstacles.reset();
    this.coins.reset();
    this.qte.reset();

    this.gameOverModal.classList.add('hidden');
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  getBiomeName(biome) {
    switch (biome) {
      case 'cave': return '🌋 Zone: Höhle & Hölle';
      case 'neon': return '🌆 Zone: Neon-City';
      case 'ice': return '❄️ Zone: Eiswelt';
      case 'beach': return '🏖️ Zone: Tropen-Strand';
      case 'space': return '🚀 Zone: Weltraum';
      case 'candy': return '🍬 Zone: Candy-Land';
      case 'meadow':
      default:
        return '🌱 Zone: Grüne Wiese';
    }
  }

  addBonusScore(bonusMeters) {
    this.scrollX += bonusMeters * 10;
    this.score = Math.floor(this.scrollX / 10);
    this.scoreValEl.textContent = this.score;

    for (let i = 0; i < 20; i++) {
      this.spawnCollisionStars(this.player.x + 30, this.player.y - 60);
    }
  }

  addRunCoins(amount, x = this.player.x + 20, y = this.player.y - 80) {
    if (amount <= 0) return;
    this.runCoins += amount;
    if (this.runCoinsValEl) {
      this.runCoinsValEl.textContent = this.runCoins;
    }
    this.particles.push({
      type: 'coinText',
      text: `+${amount} 🪙`,
      x,
      y,
      vx: 0,
      vy: -1.6,
      alpha: 1,
      life: 40
    });
  }

  triggerBonusSpeed() {
    this.player.invulnerable = true;
    this.player.invulnerableTimer = 120; // 2 sec turbo
  }

  resumeFromPuzzle() {
    this.controls.reset();
    this.triggerBonusSpeed();
    this.sounds.playSprint();
  }

  stop() {
    this.isRunning = false;
    this.qte.hideOverlay();
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return;

    if (this.stateManager.getState() !== 'GAME') {
      this.isRunning = false;
      return;
    }

    this.update();
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  spawnDustParticle(x, y) {
    this.particles.push({
      type: 'dust',
      x: x + (Math.random() - 0.5) * 10,
      y: y - 4,
      vx: -this.currentSpeed * 0.4 - Math.random() * 2,
      vy: -Math.random() * 2,
      radius: 4 + Math.random() * 6,
      alpha: 0.8,
      life: 20
    });
  }

  spawnCollisionStars(x, y) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        type: 'star',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 8,
        alpha: 1.0,
        life: 30
      });
    }
  }

  update() {
    if (this.isPaused) return;

    const groundY = this.getGroundY();

    // Update Puzzle Stop System (only trigger when grounded and on clear ground)
    const canStartPuzzle =
      this.player.isGrounded &&
      !this.obstacles.hasObstacleNearPlayer(this.player.x) &&
      !this.player.invulnerable;
    this.qte.update(this.score, canStartPuzzle);

    if (this.qte.isEventActive()) {
      // Character stops completely & stands still while the riddle is active
      this.currentSpeed = 0;
      this.player.isDucking = false;
      this.player.vy = 0;
      this.player.y = groundY;
      this.player.isGrounded = true;
      this.player.animFrame++;

      // Let existing particles fade out smoothly
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = Math.max(0, p.life / 30);
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
      return;
    }

    // Ability trigger (Speed Boost / Coin Magnet / Shield / Coin Rain)
    if (this.controls.consumeAbilityPress()) {
      if (PlayerConfig.ability === 'speed_boost' && !this.player.invulnerable) {
        this.player.invulnerable = true;
        this.player.invulnerableTimer = 180; // ~3 seconds at 60fps
        this.sounds.playSprint();
      } else if (PlayerConfig.ability === 'coin_magnet' && this.magnetTimer <= 0) {
        this.magnetTimer = 360; // 6 seconds magnet
        this.sounds.playSprint();
      } else if (PlayerConfig.ability === 'shield' && !this.shieldActive && this.shieldCooldown <= 0) {
        this.shieldActive = true;
        this.sounds.playSprint();
      } else if (PlayerConfig.ability === 'coin_rain' && this.coinRainTimer <= 0) {
        this.coinRainTimer = 210; // 3.5 seconds of coin rain!
        this.sounds.playSprint();
      }
    }

    if (this.magnetTimer > 0) this.magnetTimer--;
    if (this.shieldCooldown > 0) this.shieldCooldown--;
    if (this.coinRainTimer > 0) {
      this.coinRainTimer--;
      if (this.coinRainTimer % 16 === 0) {
        const spawnX = this.player.x + 140 + Math.random() * 260;
        const spawnY = groundY - 35 - Math.random() * 110;
        this.coins.spawnRainCoin(spawnX, spawnY);
      }
    }

    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer--;
      this.currentSpeed = this.baseSpeed * 1.85;
      if (this.player.invulnerableTimer <= 0) {
        this.player.invulnerable = false;
        this.currentSpeed = this.baseSpeed;
      }
    } else {
      this.currentSpeed = this.baseSpeed + Math.floor(this.score / 100) * 0.35;
    }

    // Controls & Horizontal movement
    if (this.controls.keys.left && this.player.x > 60) {
      this.player.x -= 4.5;
    }
    if (this.controls.keys.right && this.player.x < this.displayWidth * 0.5) {
      this.player.x += 4.5;
    }

    // Duck state
    const wasDucking = this.player.isDucking;
    this.player.isDucking = this.controls.keys.duck && this.player.isGrounded;
    if (!wasDucking && this.player.isDucking) {
      this.sounds.playDuck();
    }

    // Jump handling
    if (this.controls.consumeJumpPress()) {
      const maxJumps = PlayerConfig.ability === 'double_jump' ? 2 : 1;
      if (this.player.isGrounded || this.player.jumpsLeft > 0) {
        this.player.vy = this.player.jumpForce;
        this.player.isGrounded = false;
        this.player.jumpsLeft--;
        this.sounds.playJump();
        // Spawn jump dust cloud
        this.spawnDustParticle(this.player.x, groundY);
        this.spawnDustParticle(this.player.x - 10, groundY);
      }
    }

    // Apply Gravity
    this.player.vy += this.player.gravity;
    this.player.y += this.player.vy;

    // Ground Collision
    if (this.player.y >= groundY) {
      if (!this.player.isGrounded && this.player.vy > 2) {
        // Landing puff
        this.spawnDustParticle(this.player.x, groundY);
      }
      this.player.y = groundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    }

    // Running dust spawn
    if (this.player.isGrounded && Math.random() < 0.3) {
      this.spawnDustParticle(this.player.x - 12, groundY);
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.alpha = Math.max(0, p.life / 30);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Animation frames & companion height trail for lagged jumping
    this.player.animFrame++;
    const heightOffset = this.player.y - groundY;
    this.playerHeightTrail.unshift(heightOffset);
    if (this.playerHeightTrail.length > 48) this.playerHeightTrail.pop();
    this.companionStates.forEach((st) => {
      if (st.tapBounce > 0) st.tapBounce--;
      if (st.speechTimer > 0) st.speechTimer--;
    });

    // Background Scroll
    this.scrollX += this.currentSpeed;
    this.score = Math.floor(this.scrollX / 10);
    this.scoreValEl.textContent = this.score;

    // Dynamic background biome progression through unlocked worlds
    const unlockedBiomes = this.biomeList.filter((b) => ShopManager.isUnlocked('background', b));
    const activePool = unlockedBiomes.length > 0 ? unlockedBiomes : ['meadow'];
    const startIdx = Math.max(0, activePool.indexOf(GameConfig.background || 'meadow'));
    const biomeIndex = (startIdx + Math.floor(this.score / this.biomeTransitionDistance)) % activePool.length;
    const nextBiome = activePool[biomeIndex];
    if (nextBiome !== this.currentBiome) {
      this.currentBiome = nextBiome;
      this.zoneNotificationText = this.getBiomeName(nextBiome);
      this.zoneNotificationTimer = 150;
    }

    if (this.zoneNotificationTimer > 0) {
      this.zoneNotificationTimer--;
    }

    // Update Obstacles & Coins
    this.obstacles.update(this.currentSpeed, this.displayWidth, groundY);
    this.coins.update(
      this.currentSpeed,
      this.displayWidth,
      groundY,
      { x: this.player.x, y: this.player.y - 50 },
      this.magnetTimer > 0
    );

    const charScaleX = PlayerConfig.body.width || 1.0;
    const charScaleY = PlayerConfig.body.height || 1.0;
    const playerWidth = 36 * charScaleX;
    const playerHeight = (this.player.isDucking ? 55 : 110) * charScaleY;

    const playerRect = {
      x: this.player.x - playerWidth / 2,
      y: this.player.y - playerHeight,
      width: playerWidth,
      height: playerHeight
    };

    // Coin Pickup Check
    const pickup = this.coins.checkPickups(playerRect);
    if (pickup.gained > 0) {
      const hasSpecial = pickup.picked.some((p) => p.kind === 'gem' || p.kind === 'chest');
      this.sounds.playCoin(hasSpecial);
      pickup.picked.forEach((p) => this.addRunCoins(p.value, p.x, p.y - 16));
    }

    // Collision Check
    if (!this.player.invulnerable) {
      if (this.obstacles.checkCollisions(playerRect)) {
        if (this.shieldActive) {
          this.shieldActive = false;
          this.shieldCooldown = 480; // 8s cooldown before next shield
          this.player.invulnerable = true;
          this.player.invulnerableTimer = 60;
          this.sounds.playShieldBreak();
          this.spawnCollisionStars(this.player.x, this.player.y - 50);
        } else {
          this.sounds.playCollision();
          this.spawnCollisionStars(this.player.x, this.player.y - 40);
          this.gameOver();
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    const theme = this.currentBiome || GameConfig.background || 'meadow';
    const groundY = this.getGroundY();

    // Draw Modern Cartoon Parallax Background
    this.drawBackground(theme, groundY);

    // Draw Speedlines if Sprint skill is active
    if (this.player.invulnerableTimer > 0) {
      this.drawSpeedlines();
    }

    // Draw Obstacles & Coins
    this.obstacles.draw(this.ctx, theme);
    this.coins.draw(this.ctx);

    // Draw Zone Banner notification
    if (this.zoneNotificationTimer > 0) {
      this.drawZoneNotification();
    }

    // Draw Particles
    this.drawParticles();

    // Draw Companion Pets running behind the player
    this.companionHitboxes = [];
    this.companionStates.forEach((st, idx) => {
      const lagFrames = Math.min(this.playerHeightTrail.length - 1, (idx + 1) * 5);
      const trailYOffset = lagFrames >= 0 ? (this.playerHeightTrail[lagFrames] || 0) : 0;
      const petX = Math.max(26, this.player.x - 42 - idx * 34);
      const petY = groundY + trailYOffset;
      drawVectorPet(this.ctx, st.petRef || st.id, petX, petY, {
        frame: this.player.animFrame + idx * 13,
        facing: 1,
        scale: 0.9,
        isWalking: !this.qte.isEventActive(),
        tapBounce: st.tapBounce,
        speechText: st.speechTimer > 0 ? st.speechText : ''
      });
      this.companionHitboxes.push({
        id: st.id,
        x: petX,
        y: petY - 16,
        r: 36
      });
    });

    // Draw Player (or Rider + Riding Animal)
    let pose = 'run';
    if (this.qte.isEventActive()) {
      pose = 'idle';
    } else {
      if (!this.player.isGrounded) pose = 'jump';
      if (this.player.isDucking) pose = 'duck';
    }

    this.ctx.save();
    if (this.player.invulnerable) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#fbbf24';
    }

    if (this.activeMount) {
      const isGalloping = !this.qte.isEventActive();
      if (this.player.isDucking) {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.scale(1.06, 0.56);
        drawPlayerWithTransport(
          this.ctx,
          0,
          0,
          this.player.animFrame,
          isGalloping,
          1,
          PlayerConfig,
          'duck',
          false,
          this.activeMount,
          0.95
        );
        this.ctx.restore();
      } else {
        drawPlayerWithTransport(
          this.ctx,
          this.player.x,
          this.player.y,
          this.player.animFrame,
          isGalloping,
          1,
          PlayerConfig,
          pose,
          false,
          this.activeMount,
          0.95
        );
      }
    } else {
      renderCharacter(this.ctx, this.player.x, this.player.y, PlayerConfig, {
        frame: this.player.animFrame,
        pose: pose,
        facing: 1
      });
    }
    this.ctx.restore();

    if (this.shieldActive) {
      this.ctx.save();
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(this.player.x, this.player.y - (this.activeMount ? 56 : 60), this.activeMount ? 74 : 68, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (this.magnetTimer > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = '#c084fc';
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([8, 6]);
      this.ctx.beginPath();
      this.ctx.arc(this.player.x, this.player.y - 55, 76 + Math.sin(this.player.animFrame * 0.2) * 5, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (this.qte.isEventActive()) {
      this.drawPuzzleBubble();
    }
  }

  drawPuzzleBubble() {
    const scaleY = PlayerConfig.body.height || 1.0;
    const bubbleX = this.player.x + 28;
    const bubbleY = this.player.y - (this.activeMount ? 178 : 165) * scaleY;

    this.ctx.save();
    this.ctx.shadowColor = 'rgba(236, 72, 153, 0.35)';
    this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.roundRect(bubbleX - 48, bubbleY - 22, 96, 40, [20]);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(bubbleX - 18, bubbleY + 17);
    this.ctx.lineTo(bubbleX - 28, bubbleY + 30);
    this.ctx.lineTo(bubbleX - 6, bubbleY + 17);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.fillStyle = '#db2777';
    this.ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('✨ Rätsel!', bubbleX, bubbleY - 2);
    this.ctx.restore();
  }

  drawZoneNotification() {
    this.ctx.save();
    const alpha = Math.min(1, this.zoneNotificationTimer / 30);
    this.ctx.globalAlpha = alpha;

    const w = 340;
    const h = 50;
    const x = (this.displayWidth - w) / 2;
    const y = 100;

    const pillGrad = this.ctx.createLinearGradient(x, y, x + w, y);
    pillGrad.addColorStop(0, '#ec4899');
    pillGrad.addColorStop(0.5, '#a855f7');
    pillGrad.addColorStop(1, '#38bdf8');
    this.ctx.shadowColor = 'rgba(236, 72, 153, 0.45)';
    this.ctx.shadowBlur = 16;
    this.ctx.fillStyle = pillGrad;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, [25]);
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    this.ctx.font = 'bold 20px Plus Jakarta Sans, sans-serif';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.zoneNotificationText, this.displayWidth / 2, y + h / 2);
    this.ctx.restore();
  }

  drawSpeedlines() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(244, 114, 182, 0.55)';
    this.ctx.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
      const y = Math.random() * this.displayHeight;
      const x1 = Math.random() * this.displayWidth;
      const len = 100 + Math.random() * 200;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y);
      this.ctx.lineTo(x1 - len, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawParticles() {
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      if (p.type === 'dust') {
        const puffGrad = this.ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.radius);
        puffGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        puffGrad.addColorStop(1, 'rgba(249, 168, 212, 0.35)');
        this.ctx.fillStyle = puffGrad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.fillText('✨', p.x, p.y);
      } else if (p.type === 'coinText') {
        this.ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(219, 39, 119, 0.7)';
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillText(p.text, p.x, p.y);
      }
      this.ctx.restore();
    });
  }

  drawBackground(theme, groundY) {
    const w = this.displayWidth;
    const h = this.displayHeight;
    const t = this.player.animFrame;

    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    if (theme === 'cave') {
      // Luminous Amethyst & Rose Quartz Crystal Cavern
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#3b0764');
      bgGrad.addColorStop(0.5, '#6b21a8');
      bgGrad.addColorStop(1, '#db2777');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Far Glowing Mist Layer
      const mistGrad = this.ctx.createLinearGradient(0, groundY - 120, 0, groundY);
      mistGrad.addColorStop(0, 'rgba(244, 114, 182, 0)');
      mistGrad.addColorStop(1, 'rgba(251, 207, 232, 0.32)');
      this.ctx.fillStyle = mistGrad;
      this.ctx.fillRect(0, groundY - 120, w, 120);

      // Distant Sculpted Cavern Silhouettes
      this.ctx.fillStyle = 'rgba(88, 28, 135, 0.6)';
      for (let i = 0; i < w + 320; i += 240) {
        const x = (i - (this.scrollX * 0.14) % 240) - 240;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.bezierCurveTo(x + 60, groundY - 170, x + 180, groundY - 170, x + 240, groundY);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Faceted Hanging Amethyst Formations
      for (let i = 0; i < w + 240; i += 120) {
        const x = (i - (this.scrollX * 0.22) % 120) - 120;
        const tipY = 62 + Math.abs(Math.sin(i * 0.7)) * 48;
        const sLeft = this.ctx.createLinearGradient(x, 0, x + 40, tipY);
        sLeft.addColorStop(0, '#e879f9');
        sLeft.addColorStop(1, '#9333ea');
        this.ctx.fillStyle = sLeft;
        this.ctx.beginPath();
        this.ctx.moveTo(x, -4);
        this.ctx.lineTo(x + 36, tipY);
        this.ctx.lineTo(x + 36, -4);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#6b21a8';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 36, -4);
        this.ctx.lineTo(x + 36, tipY);
        this.ctx.lineTo(x + 72, -4);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Midground Faceted Glowing Aquamarine & Rose Crystals
      for (let i = 0; i < w + 300; i += 220) {
        const x = (i - (this.scrollX * 0.38) % 220) - 220;
        this.ctx.save();
        this.ctx.shadowColor = '#67e8f9';
        this.ctx.shadowBlur = 18;
        const cLeft = this.ctx.createLinearGradient(x + 80, groundY - 72, x + 105, groundY);
        cLeft.addColorStop(0, '#e0f2fe');
        cLeft.addColorStop(1, '#22d3ee');
        this.ctx.fillStyle = cLeft;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 82, groundY);
        this.ctx.lineTo(x + 104, groundY - 70);
        this.ctx.lineTo(x + 104, groundY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#0891b2';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 104, groundY);
        this.ctx.lineTo(x + 104, groundY - 70);
        this.ctx.lineTo(x + 126, groundY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
      }

      // Shimmering Crystal Path Ground
      const caveGround = this.ctx.createLinearGradient(0, groundY, 0, h);
      caveGround.addColorStop(0, '#f472b6');
      caveGround.addColorStop(0.3, '#be185d');
      caveGround.addColorStop(1, '#500724');
      this.ctx.fillStyle = caveGround;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fde047';
      this.ctx.fillRect(0, groundY, w, 5);

    } else if (theme === 'neon') {
      // Sunset Promenade Pop-Star City
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#312e81');
      bgGrad.addColorStop(0.45, '#9333ea');
      bgGrad.addColorStop(0.82, '#f472b6');
      bgGrad.addColorStop(1, '#fed7aa');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Soft Glowing Setting Sun
      const sunY = groundY - 78;
      this.ctx.save();
      const sunHalo = this.ctx.createRadialGradient(w * 0.55, sunY, 15, w * 0.55, sunY, 150);
      sunHalo.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      sunHalo.addColorStop(0.45, 'rgba(244, 114, 182, 0.45)');
      sunHalo.addColorStop(1, 'rgba(244, 114, 182, 0)');
      this.ctx.fillStyle = sunHalo;
      this.ctx.beginPath();
      this.ctx.arc(w * 0.55, sunY, 150, 0, Math.PI * 2);
      this.ctx.fill();

      const sunCore = this.ctx.createLinearGradient(0, sunY - 70, 0, sunY + 70);
      sunCore.addColorStop(0, '#fef9c3');
      sunCore.addColorStop(0.55, '#fb7185');
      sunCore.addColorStop(1, '#ec4899');
      this.ctx.fillStyle = sunCore;
      this.ctx.beginPath();
      this.ctx.arc(w * 0.55, sunY, 70, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Atmospheric Far Skyline Silhouette
      this.ctx.fillStyle = 'rgba(76, 29, 149, 0.38)';
      for (let i = 0; i < w + 240; i += 90) {
        const x = (i - (this.scrollX * 0.12) % 90) - 90;
        const bh = 90 + ((i * 13) % 75);
        this.ctx.beginPath();
        this.ctx.roundRect(x, groundY - bh, 72, bh, [8, 8, 0, 0]);
        this.ctx.fill();
      }

      // Midground Glassy Towers with Lit Windows & Rim Highlights
      for (let i = 0; i < w + 280; i += 145) {
        const x = (i - (this.scrollX * 0.32) % 145) - 145;
        const bh = 135 + ((i * 7) % 60);
        const bGrad = this.ctx.createLinearGradient(x, groundY - bh, x + 100, groundY);
        bGrad.addColorStop(0, '#6b21a8');
        bGrad.addColorStop(1, '#3b0764');
        this.ctx.fillStyle = bGrad;
        this.ctx.beginPath();
        this.ctx.roundRect(x, groundY - bh, 96, bh, [10, 10, 0, 0]);
        this.ctx.fill();

        // Warm sunset edge highlight on tower
        this.ctx.fillStyle = 'rgba(251, 207, 232, 0.35)';
        this.ctx.fillRect(x, groundY - bh + 8, 4, bh - 8);

        // Glowing glass window strips
        this.ctx.fillStyle = (i % 2 === 0) ? 'rgba(103, 232, 249, 0.8)' : 'rgba(253, 224, 71, 0.78)';
        for (let wy = groundY - bh + 20; wy < groundY - 24; wy += 24) {
          this.ctx.beginPath();
          this.ctx.roundRect(x + 14, wy, 26, 12, [3]);
          this.ctx.roundRect(x + 54, wy, 26, 12, [3]);
          this.ctx.fill();
        }
      }

      // Sleek Boulevard Ground with Perspective Lines
      const roadGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      roadGrad.addColorStop(0, '#581c87');
      roadGrad.addColorStop(0.4, '#3b0764');
      roadGrad.addColorStop(1, '#1e1b4b');
      this.ctx.fillStyle = roadGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      this.ctx.fillStyle = '#67e8f9';
      this.ctx.fillRect(0, groundY, w, 4);
      this.ctx.strokeStyle = 'rgba(244, 114, 182, 0.32)';
      this.ctx.lineWidth = 2;
      for (let gx = 0; gx < w + 80; gx += 64) {
        const sx = (gx - (this.scrollX % 64));
        this.ctx.beginPath();
        this.ctx.moveTo(sx, groundY + 4);
        this.ctx.lineTo(sx - 45, h);
        this.ctx.stroke();
      }

    } else if (theme === 'ice') {
      // Crystal Aurora Alpine Kingdom
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0284c7');
      bgGrad.addColorStop(0.55, '#7dd3fc');
      bgGrad.addColorStop(1, '#f0f9ff');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Soft Painted Aurora Ribbons
      this.ctx.save();
      const aurGrad = this.ctx.createLinearGradient(0, 30, w, 130);
      aurGrad.addColorStop(0, 'rgba(244, 114, 182, 0.25)');
      aurGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.35)');
      aurGrad.addColorStop(1, 'rgba(103, 232, 249, 0.25)');
      this.ctx.strokeStyle = aurGrad;
      this.ctx.lineWidth = 34;
      this.ctx.beginPath();
      for (let ax = 0; ax <= w; ax += 35) {
        const ay = 70 + Math.sin(ax * 0.01 + t * 0.025) * 22;
        if (ax === 0) this.ctx.moveTo(ax, ay);
        else this.ctx.lineTo(ax, ay);
      }
      this.ctx.stroke();
      this.ctx.restore();

      // Far Misty Glacial Peaks
      this.ctx.fillStyle = 'rgba(224, 242, 254, 0.72)';
      for (let i = 0; i < w + 360; i += 240) {
        const x = (i - (this.scrollX * 0.12) % 240) - 240;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 120, groundY - 175);
        this.ctx.lineTo(x + 240, groundY);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Midground Faceted Ice Ridges
      for (let i = 0; i < w + 300; i += 210) {
        const x = (i - (this.scrollX * 0.24) % 210) - 210;
        const leftG = this.ctx.createLinearGradient(x, groundY - 140, x + 105, groundY);
        leftG.addColorStop(0, '#ffffff');
        leftG.addColorStop(1, '#bae6fd');
        this.ctx.fillStyle = leftG;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 105, groundY - 140);
        this.ctx.lineTo(x + 105, groundY);
        this.ctx.closePath();
        this.ctx.fill();

        const rightG = this.ctx.createLinearGradient(x + 105, groundY - 140, x + 210, groundY);
        rightG.addColorStop(0, '#e0f2fe');
        rightG.addColorStop(1, '#38bdf8');
        this.ctx.fillStyle = rightG;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 105, groundY - 140);
        this.ctx.lineTo(x + 210, groundY);
        this.ctx.lineTo(x + 105, groundY);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Drifting Soft Snow Bokeh
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 97 + t * 0.65) % w);
        const sy = ((i * 53 + t * 1.35) % groundY);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 2.2 + (i % 3), 0, Math.PI * 2);
        this.ctx.fill();
      }

      const iceGround = this.ctx.createLinearGradient(0, groundY, 0, h);
      iceGround.addColorStop(0, '#f0f9ff');
      iceGround.addColorStop(0.25, '#bae6fd');
      iceGround.addColorStop(1, '#0284c7');
      this.ctx.fillStyle = iceGround;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, groundY, w, 6);

    } else if (theme === 'beach') {
      // Sunlit Riviera Dream Coast
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0284c7');
      bgGrad.addColorStop(0.55, '#67e8f9');
      bgGrad.addColorStop(1, '#fef3c7');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      this.drawCartoonSun(w - 110, 80, 38, t);

      for (let i = 0; i < w + 420; i += 300) {
        const x = (i - (this.scrollX * 0.08) % 300) - 300;
        this.drawCartoonCloud(x, 70 + (i % 2) * 24, 42);
      }

      // Distant Headland Silhouette
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY - 38);
      this.ctx.bezierCurveTo(w * 0.25, groundY - 82, w * 0.5, groundY - 45, w * 0.85, groundY - 72);
      this.ctx.lineTo(w, groundY - 42);
      this.ctx.lineTo(w, groundY - 38);
      this.ctx.closePath();
      this.ctx.fill();

      // Turquoise Sea with Foam Crest
      const oceanGrad = this.ctx.createLinearGradient(0, groundY - 44, 0, groundY);
      oceanGrad.addColorStop(0, '#0891b2');
      oceanGrad.addColorStop(1, '#22d3ee');
      this.ctx.fillStyle = oceanGrad;
      this.ctx.fillRect(0, groundY - 42, w, 42);

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      for (let wx = 0; wx <= w; wx += 28) {
        const wy = groundY - 22 + Math.sin(wx * 0.04 + t * 0.07) * 3.5;
        if (wx === 0) this.ctx.moveTo(wx, wy);
        else this.ctx.lineTo(wx, wy);
      }
      this.ctx.stroke();

      // Sculpted Curved Palm Trees
      for (let i = 0; i < w + 320; i += 280) {
        const x = (i - (this.scrollX * 0.28) % 280) - 280;
        this.ctx.strokeStyle = '#b45309';
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 70, groundY);
        this.ctx.quadraticCurveTo(x + 58, groundY - 62, x + 78, groundY - 122);
        this.ctx.stroke();

        // Lush arched palm fronds
        const frondGrad = this.ctx.createLinearGradient(x + 25, groundY - 150, x + 130, groundY - 105);
        frondGrad.addColorStop(0, '#4ade80');
        frondGrad.addColorStop(1, '#059669');
        this.ctx.fillStyle = frondGrad;
        [-0.75, -0.25, 0.3, 0.8].forEach((ang) => {
          this.ctx.save();
          this.ctx.translate(x + 78, groundY - 122);
          this.ctx.rotate(ang);
          this.ctx.beginPath();
          this.ctx.ellipse(24, 0, 30, 8.5, 0, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        });
      }

      const sandGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      sandGrad.addColorStop(0, '#fef08a');
      sandGrad.addColorStop(0.3, '#fcd34d');
      sandGrad.addColorStop(1, '#d97706');
      this.ctx.fillStyle = sandGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fef9c3';
      this.ctx.fillRect(0, groundY, w, 6);

    } else if (theme === 'space') {
      // Luminous Cosmic Nebula World
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.55, '#581c87');
      bgGrad.addColorStop(1, '#be185d');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Soft Nebula Glow Clouds
      const neb1 = this.ctx.createRadialGradient(w * 0.28, groundY * 0.4, 10, w * 0.28, groundY * 0.4, 170);
      neb1.addColorStop(0, 'rgba(244, 114, 182, 0.38)');
      neb1.addColorStop(1, 'rgba(244, 114, 182, 0)');
      this.ctx.fillStyle = neb1;
      this.ctx.fillRect(0, 0, w, groundY);

      const neb2 = this.ctx.createRadialGradient(w * 0.72, groundY * 0.55, 10, w * 0.72, groundY * 0.55, 180);
      neb2.addColorStop(0, 'rgba(56, 189, 248, 0.34)');
      neb2.addColorStop(1, 'rgba(56, 189, 248, 0)');
      this.ctx.fillStyle = neb2;
      this.ctx.fillRect(0, 0, w, groundY);

      // Shimmering Stars
      for (let i = 0; i < 42; i++) {
        const sx = (i * 89 + w - (this.scrollX * 0.08) % w) % w;
        const sy = (i * 47) % (groundY - 24);
        const alpha = 0.5 + 0.5 * Math.sin(t * 0.05 + i);
        this.ctx.fillStyle = `rgba(254, 249, 195, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 1.5 + (i % 2), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 3D Shaded Ringed Planet
      this.ctx.save();
      const px = w * 0.72;
      const py = 105;
      const planetGrad = this.ctx.createRadialGradient(px - 16, py - 16, 4, px, py, 48);
      planetGrad.addColorStop(0, '#fef9c3');
      planetGrad.addColorStop(0.55, '#f472b6');
      planetGrad.addColorStop(1, '#7e22ce');
      this.ctx.fillStyle = planetGrad;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 44, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(165, 243, 252, 0.85)';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.ellipse(px, py, 76, 16, -0.22, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      const moonGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      moonGrad.addColorStop(0, '#a855f7');
      moonGrad.addColorStop(1, '#3b0764');
      this.ctx.fillStyle = moonGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fbcfe8';
      this.ctx.fillRect(0, groundY, w, 5);

    } else if (theme === 'candy') {
      // Sunlit Patisserie & Macaron Dreamland
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#f472b6');
      bgGrad.addColorStop(0.55, '#fbcfe8');
      bgGrad.addColorStop(1, '#fef3c7');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      for (let i = 0; i < w + 400; i += 280) {
        const x = (i - (this.scrollX * 0.09) % 280) - 280;
        this.drawCartoonCloud(x, 72 + (i % 3) * 18, 44, '#fff1f2');
      }

      // Soft Rolling Pastel Strawberry Hills
      for (let i = 0; i < w + 500; i += 260) {
        const x = (i - (this.scrollX * 0.16) % 260) - 260;
        const hGrad = this.ctx.createLinearGradient(x, groundY - 95, x, groundY);
        hGrad.addColorStop(0, '#fbcfe8');
        hGrad.addColorStop(1, '#f472b6');
        this.ctx.fillStyle = hGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 30, groundY);
        this.ctx.bezierCurveTo(x + 50, groundY - 105, x + 210, groundY - 105, x + 290, groundY);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Glossy 3D Swirl Lollipops
      for (let i = 0; i < w + 280; i += 210) {
        const x = (i - (this.scrollX * 0.25) % 210) - 210;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.roundRect(x + 95, groundY - 125, 8, 125, [4]);
        this.ctx.fill();

        const popGrad = this.ctx.createRadialGradient(x + 90, groundY - 135, 4, x + 99, groundY - 125, 30);
        if ((i / 210) % 2 === 0) {
          popGrad.addColorStop(0, '#fff1f2');
          popGrad.addColorStop(0.45, '#f472b6');
          popGrad.addColorStop(1, '#db2777');
        } else {
          popGrad.addColorStop(0, '#ecfeff');
          popGrad.addColorStop(0.45, '#22d3ee');
          popGrad.addColorStop(1, '#0891b2');
        }
        this.ctx.fillStyle = popGrad;
        this.ctx.beginPath();
        this.ctx.arc(x + 99, groundY - 125, 28, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.arc(x + 99, groundY - 125, 14, 0, Math.PI * 1.45);
        this.ctx.stroke();
      }

      const cakeGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      cakeGrad.addColorStop(0, '#f472b6');
      cakeGrad.addColorStop(1, '#be185d');
      this.ctx.fillStyle = cakeGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fff5f7';
      this.ctx.fillRect(0, groundY, w, 10);

    } else {
      // Sunlit Cherry-Blossom & Emerald Meadow (Multi-Plane Aerial Perspective)
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#38bdf8');
      bgGrad.addColorStop(0.55, '#bae6fd');
      bgGrad.addColorStop(1, '#fef3c7');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      this.drawCartoonSun(w - 110, 84, 38, t);

      for (let i = 0; i < w + 420; i += 300) {
        const x = (i - (this.scrollX * 0.08) % 300) - 300;
        this.drawCartoonCloud(x, 70 + (i % 3) * 20, 44);
      }

      // Far Misty Blue-Green Mountains
      this.ctx.fillStyle = 'rgba(125, 211, 252, 0.72)';
      for (let i = 0; i < w + 480; i += 360) {
        const x = (i - (this.scrollX * 0.11) % 360) - 360;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.bezierCurveTo(x + 90, groundY - 135, x + 220, groundY - 75, x + 360, groundY);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Midground Undulating Emerald Hills + Sculpted Multi-Cluster Trees
      for (let i = 0; i < w + 500; i += 250) {
        const x = (i - (this.scrollX * 0.24) % 250) - 250;
        const hillGrad = this.ctx.createLinearGradient(x, groundY - 82, x, groundY);
        hillGrad.addColorStop(0, '#6ee7b7');
        hillGrad.addColorStop(1, '#10b981');
        this.ctx.fillStyle = hillGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 40, groundY);
        this.ctx.bezierCurveTo(x + 40, groundY - 86, x + 210, groundY - 86, x + 290, groundY);
        this.ctx.closePath();
        this.ctx.fill();

        // Tapered Curved Tree Trunk
        this.ctx.fillStyle = '#92400e';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 116, groundY - 62);
        this.ctx.quadraticCurveTo(x + 121, groundY - 96, x + 120, groundY - 126);
        this.ctx.lineTo(x + 130, groundY - 126);
        this.ctx.quadraticCurveTo(x + 129, groundY - 96, x + 136, groundY - 62);
        this.ctx.closePath();
        this.ctx.fill();

        // Multi-cluster Lush Cherry Blossom / Emerald Canopy
        const isBlossom = (i / 250) % 2 === 0;
        const clusters = [
          { dx: -16, dy: -124, r: 22 },
          { dx: 16, dy: -124, r: 22 },
          { dx: 0, dy: -144, r: 27 }
        ];
        clusters.forEach((cl) => {
          const cg = this.ctx.createRadialGradient(x + 125 + cl.dx - 6, groundY + cl.dy - 8, 3, x + 125 + cl.dx, groundY + cl.dy, cl.r);
          if (isBlossom) {
            cg.addColorStop(0, '#fff1f2');
            cg.addColorStop(0.5, '#f9a8d4');
            cg.addColorStop(1, '#db2777');
          } else {
            cg.addColorStop(0, '#bbf7d0');
            cg.addColorStop(0.5, '#34d399');
            cg.addColorStop(1, '#047857');
          }
          this.ctx.fillStyle = cg;
          this.ctx.beginPath();
          this.ctx.arc(x + 125 + cl.dx, groundY + cl.dy, cl.r, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }

      // Rich Layered Sunlit Garden Lawn Path
      const grassGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      grassGrad.addColorStop(0, '#34d399');
      grassGrad.addColorStop(0.25, '#10b981');
      grassGrad.addColorStop(1, '#065f46');
      this.ctx.fillStyle = grassGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#a7f3d0';
      this.ctx.fillRect(0, groundY, w, 6);

      // Painted Wildflower Accents
      const flowerColors = ['#f472b6', '#fde047', '#ffffff', '#c084fc'];
      for (let i = 0; i < w + 100; i += 85) {
        const x = (i - (this.scrollX) % 85) - 85;
        this.ctx.fillStyle = flowerColors[(i / 85) % flowerColors.length];
        this.ctx.beginPath();
        this.ctx.arc(x + 35, groundY + 18, 4.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  drawCartoonSun(x, y, radius, frame) {
    this.ctx.save();
    this.ctx.translate(x, y);
    const pulse = 1 + Math.sin(frame * 0.035) * 0.05;

    const halo = this.ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius * 2.5 * pulse);
    halo.addColorStop(0, 'rgba(255, 251, 235, 0.95)');
    halo.addColorStop(0.45, 'rgba(253, 224, 71, 0.35)');
    halo.addColorStop(1, 'rgba(253, 224, 71, 0)');
    this.ctx.fillStyle = halo;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 2.5 * pulse, 0, Math.PI * 2);
    this.ctx.fill();

    const sunGrad = this.ctx.createRadialGradient(-radius * 0.22, -radius * 0.22, 3, 0, 0, radius);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.5, '#fef08a');
    sunGrad.addColorStop(1, '#fbbf24');
    this.ctx.fillStyle = sunGrad;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawCartoonCloud(x, y, radius, fill = '#ffffff') {
    this.ctx.save();
    const cGrad = this.ctx.createLinearGradient(x, y - radius, x, y + radius * 0.6);
    cGrad.addColorStop(0, fill);
    cGrad.addColorStop(0.75, '#f0f9ff');
    cGrad.addColorStop(1, '#fbcfe8');
    this.ctx.fillStyle = cGrad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.62, 0, Math.PI * 2);
    this.ctx.arc(x + radius * 0.68, y - radius * 0.32, radius * 0.72, 0, Math.PI * 2);
    this.ctx.arc(x + radius * 1.45, y - radius * 0.08, radius * 0.58, 0, Math.PI * 2);
    this.ctx.arc(x + radius * 0.72, y + radius * 0.08, radius * 0.6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  gameOver() {
    this.isRunning = false;
    this.qte.hideOverlay();

    // Distance bonus (+1 per 50m) + Highscore bonus (+10) + Home pocket bonus (max 5)
    const distanceBonusCoins = Math.floor(this.score / 50);
    const isNewHighscore = this.score > this.highScore && this.score >= 30;
    const highscoreBonus = isNewHighscore ? 10 : 0;
    const homeBonus = this.score >= 20 ? HomeManager.getRunPocketMoneyBonus() : 0;

    const prog = ShopManager.recordProgress(this.score, 0);
    EarnMoneyManager.recordEvent({
      meters: this.score,
      coins: this.runCoins,
      runFinished: true
    });
    HomeManager.onRunCompleted();

    const extraCoins = this.runCoins + distanceBonusCoins + highscoreBonus + homeBonus;
    const totalRunEarned = extraCoins + prog.levelUpBonus;
    const newBankBalance = BankManager.depositEarned(extraCoins, '🏃 Renn-Prämie');
    const walletBalance = ShopManager.getCoins();

    const hsRecord = HighscoreManager.recordRun({
      score: this.score,
      biome: this.currentBiome,
      runCoins: totalRunEarned
    });

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('runner_highscore', this.highScore.toString());
    } else {
      this.highScore = hsRecord.overallBest;
    }
    if (this.highScoreValEl) this.highScoreValEl.textContent = this.highScore;

    if (this.gameOverRunnerMetaEl) {
      const rankLabel = hsRecord.rank ? `Platz #${hsRecord.rank} in der Liste` : 'Neu gestartet';
      const mountLabel = this.activeMountMeta ? ` • ${this.activeMountMeta.icon} ${this.activeMountMeta.name}` : '';
      this.gameOverRunnerMetaEl.textContent = `🏃 Läufer: ${hsRecord.entry.name} • ${rankLabel} • ${hsRecord.entry.worldLabel}${mountLabel}`;
    }

    if (this.earnedCoinsValEl) this.earnedCoinsValEl.textContent = totalRunEarned;
    if (this.totalCoinsValEl) this.totalCoinsValEl.textContent = walletBalance;
    if (this.totalBankValEl) this.totalBankValEl.textContent = newBankBalance;

    if (this.gameoverBonusBreakdownEl) {
      const notes = [];
      if (distanceBonusCoins > 0) notes.push(`+${distanceBonusCoins} 🪙 Strecke`);
      if (highscoreBonus > 0) notes.push(`+${highscoreBonus} 🪙 Rekord!`);
      if (homeBonus > 0) notes.push(`+${homeBonus} 🪙 Haus & Tiere`);
      if (prog.levelUpBonus > 0) notes.push(`+${prog.levelUpBonus} 🪙 Level Up!`);
      if (this.score >= 40) notes.push('+1 🎡 Glücksrad-Ticket');
      this.gameoverBonusBreakdownEl.textContent = notes.join(' • ');
    }

    this.finalScoreEl.textContent = this.score;
    this.gameOverModal.classList.remove('hidden');
  }
}
