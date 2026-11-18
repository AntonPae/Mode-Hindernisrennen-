import { PlayerConfig, GameConfig } from '../editor/characterData.js';
import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ControlsManager } from './controls.js';
import { ObstacleManager, CoinManager } from './obstacles.js';
import { QuickTimeEventManager } from './quickTimeEvent.js';

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
    this.finalScoreEl = document.getElementById('finalScore');
    this.earnedCoinsValEl = document.getElementById('earnedCoinsVal');
    this.totalCoinsValEl = document.getElementById('totalCoinsVal');
    this.gameoverBonusBreakdownEl = document.getElementById('gameoverBonusBreakdown');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.restartBtn = document.getElementById('restartBtn');
    this.editorReturnBtn = document.getElementById('editorReturnBtn');
    this.homeReturnBtn = document.getElementById('homeReturnBtn');

    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.runCoins = 0;
    this.highScore = parseInt(localStorage.getItem('runner_highscore') || '0', 10);
    this.highScoreValEl.textContent = this.highScore;

    this.magnetTimer = 0;
    this.coinRainTimer = 0;
    this.shieldActive = false;
    this.shieldCooldown = 0;

    this.scrollX = 0;
    this.baseSpeed = 5;
    this.currentSpeed = this.baseSpeed;

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

    this.initUIEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  initUIEvents() {
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
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = window.innerWidth;
    this.displayHeight = window.innerHeight;
  }

  start() {
    this.sounds.init();
    this.resizeCanvas();

    this.isRunning = true;
    this.isPaused = false;
    this.score = 0;
    this.runCoins = 0;
    if (this.runCoinsValEl) this.runCoinsValEl.textContent = '0';
    this.magnetTimer = 0;
    this.coinRainTimer = 0;
    this.shieldActive = false;
    this.shieldCooldown = 0;
    this.currentBiome = GameConfig.background || 'meadow';
    this.biomeStartIndex = Math.max(0, this.biomeList.indexOf(this.currentBiome));
    this.zoneNotificationTimer = 120; // 2 seconds banner at start
    this.zoneNotificationText = this.getBiomeName(this.currentBiome);
    this.scrollX = 0;
    this.currentSpeed = this.baseSpeed;
    this.particles = [];

    const groundY = this.displayHeight * 0.75;
    this.player.y = groundY;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    this.player.invulnerable = false;
    this.player.invulnerableTimer = 0;

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

    const groundY = this.displayHeight * 0.75;

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

    // Animation frames
    this.player.animFrame++;

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
    const groundY = this.displayHeight * 0.75;

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

    // Draw Player
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

    renderCharacter(this.ctx, this.player.x, this.player.y, PlayerConfig, {
      frame: this.player.animFrame,
      pose: pose
    });
    this.ctx.restore();

    if (this.shieldActive) {
      this.ctx.save();
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(this.player.x, this.player.y - 60, 68, 0, Math.PI * 2);
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
    const bubbleY = this.player.y - 165 * scaleY;

    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.roundRect(bubbleX - 46, bubbleY - 22, 92, 40, [14]);
    this.ctx.fill();
    this.ctx.stroke();

    // Small pointer tail
    this.ctx.beginPath();
    this.ctx.moveTo(bubbleX - 18, bubbleY + 18);
    this.ctx.lineTo(bubbleX - 28, bubbleY + 30);
    this.ctx.lineTo(bubbleX - 6, bubbleY + 18);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 16px Fredoka, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('❓ Rätsel!', bubbleX, bubbleY - 2);
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

    // Banner Pill
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, [25]);
    this.ctx.fill();
    this.ctx.stroke();

    // Banner Text
    this.ctx.font = 'bold 20px Fredoka, sans-serif';
    this.ctx.fillStyle = '#fef08a';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.zoneNotificationText, this.displayWidth / 2, y + h / 2);
    this.ctx.restore();
  }

  drawSpeedlines() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
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
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      } else if (p.type === 'star') {
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.fillText('⭐', p.x, p.y);
      } else if (p.type === 'coinText') {
        this.ctx.font = 'bold 18px Fredoka, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(p.text, p.x, p.y);
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
      // Cartoon Volcanic Cavern with Glowing Crystals & Bubbling Lava
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.55, '#6b21a8');
      bgGrad.addColorStop(1, '#b91c1c');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Layer 1: Outlined Stalactites with Cel Highlight
      for (let i = 0; i < w + 220; i += 110) {
        const x = (i - (this.scrollX * 0.14) % 110) - 110;
        const tipY = 65 + Math.abs(Math.sin(i * 0.7)) * 45;
        this.ctx.fillStyle = '#4c1d95';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, -4);
        this.ctx.lineTo(x + 38, tipY);
        this.ctx.lineTo(x + 76, -4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Highlight edge
        this.ctx.fillStyle = '#7c3aed';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 12, 0);
        this.ctx.lineTo(x + 38, tipY - 8);
        this.ctx.lineTo(x + 38, 0);
        this.ctx.closePath();
        this.ctx.fill();
      }

      // Layer 2: Cartoon Rocky Arches & Glowing Cyan Crystals
      for (let i = 0; i < w + 320; i += 240) {
        const x = (i - (this.scrollX * 0.3) % 240) - 240;
        this.ctx.fillStyle = '#7f1d1d';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.quadraticCurveTo(x + 120, groundY - 195, x + 240, groundY);
        this.ctx.fill();
        this.ctx.stroke();

        // Cartoon Crystal Cluster
        this.ctx.fillStyle = '#22d3ee';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 95, groundY);
        this.ctx.lineTo(x + 112, groundY - 46);
        this.ctx.lineTo(x + 130, groundY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Ground: Glowing Lava Lake with Animated Bubbles
      const lavaGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      lavaGrad.addColorStop(0, '#f97316');
      lavaGrad.addColorStop(0.4, '#dc2626');
      lavaGrad.addColorStop(1, '#7f1d1d');
      this.ctx.fillStyle = lavaGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillRect(0, groundY, w, 10);
      for (let i = 0; i < w + 160; i += 140) {
        const bx = (i - (this.scrollX * 0.8) % 140) - 140;
        const pop = Math.abs(Math.sin(t * 0.06 + i)) * 8;
        this.ctx.beginPath();
        this.ctx.arc(bx + 60, groundY + 4, 6 + pop * 0.5, Math.PI, 0);
        this.ctx.fill();
      }
      this.ctx.lineWidth = 3.5;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

    } else if (theme === 'neon') {
      // Cartoon Synthwave Metropolis with Striped Sun & Hover Cars
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#090d24');
      bgGrad.addColorStop(0.55, '#31105f');
      bgGrad.addColorStop(1, '#be185d');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Outlined Retro Cartoon Sun with Stripes
      const sunY = groundY - 68;
      const sunGrad = this.ctx.createLinearGradient(0, sunY - 90, 0, sunY + 90);
      sunGrad.addColorStop(0, '#fb7185');
      sunGrad.addColorStop(1, '#fde047');
      this.ctx.save();
      this.ctx.fillStyle = sunGrad;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(w / 2, sunY, 88, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#701a75';
      for (let s = 12; s < 68; s += 16) {
        this.ctx.fillRect(w / 2 - 84, sunY + s, 168, 5);
      }
      this.ctx.restore();

      // Distant City Silhouette
      this.ctx.fillStyle = '#1e1b4b';
      for (let i = 0; i < w + 200; i += 85) {
        const x = (i - (this.scrollX * 0.14) % 85) - 85;
        const bHeight = 95 + (i % 7) * 20;
        this.ctx.fillRect(x, groundY - bHeight, 66, bHeight);
      }

      // Foreground Cartoon Neon Towers
      for (let i = 0; i < w + 300; i += 140) {
        const x = (i - (this.scrollX * 0.34) % 140) - 140;
        const bHeight = 140 + (i % 5) * 28;
        this.ctx.fillStyle = '#1e1035';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3.5;
        this.ctx.fillRect(x, groundY - bHeight, 98, bHeight);
        this.ctx.strokeRect(x, groundY - bHeight, 98, bHeight);

        // Roof antenna
        this.ctx.beginPath();
        this.ctx.moveTo(x + 49, groundY - bHeight);
        this.ctx.lineTo(x + 49, groundY - bHeight - 18);
        this.ctx.stroke();

        // Lit Cartoon Windows
        this.ctx.fillStyle = (i % 2 === 0) ? '#22d3ee' : '#f472b6';
        this.ctx.fillRect(x + 14, groundY - bHeight + 20, 22, 16);
        this.ctx.fillRect(x + 56, groundY - bHeight + 20, 22, 16);
        this.ctx.fillRect(x + 14, groundY - bHeight + 54, 22, 16);
        this.ctx.fillRect(x + 56, groundY - bHeight + 54, 22, 16);
      }

      // Flying Neon Hover-Car in Sky
      const carX = (w + 120) - ((t * 3.2) % (w + 240));
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.roundRect(carX, 85, 38, 14, [7]);
      this.ctx.fill();
      this.ctx.stroke();

      // Cyber Grid Ground
      this.ctx.fillStyle = '#09090b';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      this.ctx.lineWidth = 2;
      for (let gx = 0; gx < w + 80; gx += 60) {
        const sx = (gx - (this.scrollX % 60));
        this.ctx.beginPath();
        this.ctx.moveTo(sx, groundY + 6);
        this.ctx.lineTo(sx - 40, h);
        this.ctx.stroke();
      }
      this.ctx.fillStyle = '#22d3ee';
      this.ctx.fillRect(0, groundY, w, 7);

    } else if (theme === 'ice') {
      // Cartoon Arctic Aurora & Cel-Shaded Peaks
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.45, '#0284c7');
      bgGrad.addColorStop(1, '#bae6fd');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Waving Cartoon Aurora Ribbon
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
      this.ctx.lineWidth = 22;
      this.ctx.beginPath();
      for (let ax = 0; ax <= w; ax += 40) {
        const ay = 75 + Math.sin(ax * 0.012 + t * 0.03) * 24;
        if (ax === 0) this.ctx.moveTo(ax, ay);
        else this.ctx.lineTo(ax, ay);
      }
      this.ctx.stroke();
      this.ctx.restore();

      // Cel-Shaded Snow Peaks with Left Sunlit Side & Right Ice Shadow
      for (let i = 0; i < w + 320; i += 220) {
        const x = (i - (this.scrollX * 0.2) % 220) - 220;
        this.ctx.fillStyle = '#f0f9ff';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 110, groundY - 155);
        this.ctx.lineTo(x + 220, groundY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#bae6fd';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 110, groundY - 155);
        this.ctx.lineTo(x + 220, groundY);
        this.ctx.lineTo(x + 110, groundY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 110, groundY - 155);
        this.ctx.lineTo(x + 220, groundY);
        this.ctx.stroke();
      }

      // Crisp Outlined Snowflakes
      this.ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 97 + t * 0.7) % w);
        const sy = ((i * 53 + t * 1.6) % groundY);
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 3.5 + (i % 3), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Icy Ground with Thick Cartoon Snow Top
      const iceGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      iceGrad.addColorStop(0, '#7dd3fc');
      iceGrad.addColorStop(1, '#0284c7');
      this.ctx.fillStyle = iceGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#f0f9ff';
      this.ctx.fillRect(0, groundY, w, 14);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

    } else if (theme === 'beach') {
      // Sunny Animated Cartoon Beach
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0284c7');
      bgGrad.addColorStop(0.6, '#38bdf8');
      bgGrad.addColorStop(1, '#fef08a');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Smiling Cartoon Sun with Rays
      this.drawCartoonSun(w - 105, 82, 36, t);

      // Outlined Clouds
      for (let i = 0; i < w + 420; i += 300) {
        const x = (i - (this.scrollX * 0.09) % 300) - 300;
        this.drawCartoonCloud(x, 70 + (i % 2) * 28, 42);
      }

      // Animated Sparkling Ocean Waves
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(0, groundY - 40, w, 40);
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      for (let wx = 0; wx <= w; wx += 30) {
        const wy = groundY - 38 + Math.sin(wx * 0.04 + t * 0.08) * 4;
        if (wx === 0) this.ctx.moveTo(wx, wy);
        else this.ctx.lineTo(wx, wy);
      }
      this.ctx.stroke();

      // Outlined Cartoon Palm Trees
      for (let i = 0; i < w + 320; i += 260) {
        const x = (i - (this.scrollX * 0.28) % 260) - 260;
        this.ctx.fillStyle = '#b45309';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(x + 60, groundY - 118, 15, 118);
        this.ctx.strokeRect(x + 60, groundY - 118, 15, 118);

        this.ctx.fillStyle = '#22c55e';
        this.ctx.beginPath();
        this.ctx.ellipse(x + 40, groundY - 118, 34, 11, -0.35, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.ellipse(x + 95, groundY - 118, 34, 11, 0.35, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Golden Cartoon Sand Ground
      this.ctx.fillStyle = '#eab308';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fde047';
      this.ctx.fillRect(0, groundY, w, 14);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

    } else if (theme === 'space') {
      // Cartoon Cosmic Galaxy with Nebula, Saturn, Moon & UFO
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.55, '#1e1b4b');
      bgGrad.addColorStop(1, '#581c87');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Soft Cosmic Nebula Blobs
      this.ctx.fillStyle = 'rgba(236, 72, 153, 0.16)';
      this.ctx.beginPath();
      this.ctx.arc(w * 0.25, groundY * 0.38, 120, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      this.ctx.beginPath();
      this.ctx.arc(w * 0.68, groundY * 0.5, 140, 0, Math.PI * 2);
      this.ctx.fill();

      // Twinkling 4-point Cartoon Stars
      this.ctx.fillStyle = '#fef08a';
      for (let i = 0; i < 36; i++) {
        const sx = (i * 89 + w - (this.scrollX * 0.08) % w) % w;
        const sy = (i * 47) % (groundY - 24);
        const s = 2.5 + (i % 3);
        this.ctx.fillRect(sx, sy, s, s);
      }

      // Outlined Ringed Planet with Cel Highlight
      this.ctx.save();
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(w * 0.72, 110, 44, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.strokeStyle = '#fde68a';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.ellipse(w * 0.72, 110, 74, 16, -0.25, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      // Drifting Friendly Cartoon UFO
      const ufoX = (w + 100) - ((t * 1.4) % (w + 220));
      const ufoY = 90 + Math.sin(t * 0.06) * 14;
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(ufoX, ufoY - 6, 14, Math.PI, 0);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#a855f7';
      this.ctx.beginPath();
      this.ctx.ellipse(ufoX, ufoY, 28, 9, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Moon Crater Ground
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillRect(0, groundY, w, 12);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

    } else if (theme === 'candy') {
      // Cartoon Sugar World with Swirled Lollipops & Icing Sprinkles
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#ec4899');
      bgGrad.addColorStop(0.55, '#fbcfe8');
      bgGrad.addColorStop(1, '#fef9c3');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Puffy Cotton-Candy Clouds
      for (let i = 0; i < w + 400; i += 280) {
        const x = (i - (this.scrollX * 0.1) % 280) - 280;
        this.drawCartoonCloud(x, 72 + (i % 3) * 18, 44, '#fff1f2');
      }

      // Swirled Outlined Lollipops
      for (let i = 0; i < w + 280; i += 200) {
        const x = (i - (this.scrollX * 0.22) % 200) - 200;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(x + 95, groundY - 122, 9, 122);
        this.ctx.strokeRect(x + 95, groundY - 122, 9, 122);

        this.ctx.fillStyle = (i / 200) % 2 === 0 ? '#f43f5e' : '#38bdf8';
        this.ctx.beginPath();
        this.ctx.arc(x + 99, groundY - 124, 28, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // White swirl ring inside lollipop
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.arc(x + 99, groundY - 124, 15, 0, Math.PI * 1.4);
        this.ctx.stroke();
      }

      // Chocolate & Strawberry Icing Ground with Sprinkles
      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#f472b6';
      this.ctx.fillRect(0, groundY, w, 16);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

      const sprinkleColors = ['#fde047', '#38bdf8', '#4ade80', '#ffffff'];
      for (let i = 0; i < w + 100; i += 45) {
        const sx = (i - (this.scrollX) % 45) - 45;
        this.ctx.fillStyle = sprinkleColors[(i / 45) % sprinkleColors.length];
        this.ctx.fillRect(sx + 10, groundY + 5, 10, 4);
      }

    } else {
      // Modern Animated Cartoon Meadow with Smiling Sun, Outlined Clouds, Trees & Hills
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0ea5e9');
      bgGrad.addColorStop(0.62, '#38bdf8');
      bgGrad.addColorStop(1, '#bae6fd');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Smiling Cartoon Sun with Gentle Rotating Rays
      this.drawCartoonSun(w - 110, 86, 38, t);

      // Outlined Puffy Cartoon Clouds (Layer 1)
      for (let i = 0; i < w + 400; i += 280) {
        const x = (i - (this.scrollX * 0.1) % 280) - 280;
        this.drawCartoonCloud(x, 72 + (i % 3) * 20, 48);
      }

      // Distant Cel-Shaded Hills (Layer 2)
      for (let i = 0; i < w + 500; i += 250) {
        const x = (i - (this.scrollX * 0.22) % 250) - 250;
        this.ctx.fillStyle = '#86efac';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.arc(x + 125, groundY + 78, 165, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();

        // Cartoon Tree on Hill
        this.ctx.fillStyle = '#92400e';
        this.ctx.fillRect(x + 118, groundY - 122, 14, 42);
        this.ctx.strokeRect(x + 118, groundY - 122, 14, 42);
        this.ctx.fillStyle = '#16a34a';
        this.ctx.beginPath();
        this.ctx.arc(x + 125, groundY - 138, 28, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = '#4ade80';
        this.ctx.beginPath();
        this.ctx.arc(x + 117, groundY - 146, 12, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Lush Grass Ground
      const grassGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      grassGrad.addColorStop(0, '#22c55e');
      grassGrad.addColorStop(1, '#15803d');
      this.ctx.fillStyle = grassGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      this.ctx.fillStyle = '#4ade80';
      this.ctx.fillRect(0, groundY, w, 13);

      this.ctx.lineWidth = 3.5;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

      // Outlined Grass Tufts & Tiny Meadow Flowers
      for (let i = 0; i < w + 100; i += 90) {
        const x = (i - (this.scrollX) % 90) - 90;
        this.ctx.fillStyle = '#16a34a';
        this.ctx.beginPath();
        this.ctx.arc(x, groundY, 6, Math.PI, 0);
        this.ctx.arc(x + 8, groundY, 9, Math.PI, 0);
        this.ctx.arc(x + 16, groundY, 6, Math.PI, 0);
        this.ctx.fill();

        if ((i / 90) % 2 === 0) {
          this.ctx.fillStyle = '#fef08a';
          this.ctx.beginPath();
          this.ctx.arc(x + 45, groundY + 18, 4.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  drawCartoonSun(x, y, radius, frame) {
    this.ctx.save();
    this.ctx.translate(x, y);
    const rot = frame * 0.01;
    this.ctx.strokeStyle = '#fde047';
    this.ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = rot + (i * Math.PI) / 4;
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(a) * (radius + 6), Math.sin(a) * (radius + 6));
      this.ctx.lineTo(Math.cos(a) * (radius + 17), Math.sin(a) * (radius + 17));
      this.ctx.stroke();
    }

    this.ctx.fillStyle = '#fde047';
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 3.5;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Cute Cartoon Sun Face
    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(-10, -4, 3.2, 0, Math.PI * 2);
    this.ctx.arc(10, -4, 3.2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.arc(0, 2, 11, 0.15 * Math.PI, 0.85 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawCartoonCloud(x, y, radius, fill = '#ffffff') {
    this.ctx.save();
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.65, Math.PI * 0.5, Math.PI * 1.5);
    this.ctx.arc(x + radius * 0.75, y - radius * 0.42, radius * 0.62, Math.PI * 1.05, Math.PI * 1.9);
    this.ctx.arc(x + radius * 1.55, y, radius * 0.68, Math.PI * 1.4, Math.PI * 0.5);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  gameOver() {
    this.isRunning = false;
    this.qte.hideOverlay();
    const isNewHighscore = this.score > this.highScore && this.score >= 30;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('runner_highscore', this.highScore.toString());
      this.highScoreValEl.textContent = this.highScore;
    }

    // Distance bonus coins (+1 coin per 25m run) + Highscore bonus + Home/Pet pocket money + Level progress
    const distanceBonusCoins = Math.floor(this.score / 25);
    const highscoreBonus = isNewHighscore ? 25 : 0;
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
    const newBalance = ShopManager.addCoins(extraCoins);

    if (this.earnedCoinsValEl) this.earnedCoinsValEl.textContent = totalRunEarned;
    if (this.totalCoinsValEl) this.totalCoinsValEl.textContent = newBalance;

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
