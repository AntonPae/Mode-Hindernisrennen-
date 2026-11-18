import { PlayerConfig, GameConfig } from '../editor/characterData.js';
import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';
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
      const hasGem = pickup.picked.some((p) => p.kind === 'gem');
      this.sounds.playCoin(hasGem);
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

    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    if (theme === 'cave') {
      // Modern Cartoon Cave / Volcanic Setting
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.6, '#581c87');
      bgGrad.addColorStop(1, '#991b1b');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Layer 1: Distant Stalactites Silhouette
      this.ctx.fillStyle = '#3b0764';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3;
      for (let i = 0; i < w + 200; i += 120) {
        const x = (i - (this.scrollX * 0.15) % 120) - 120;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x + 40, 80 + Math.sin(i) * 30);
        this.ctx.lineTo(x + 80, 0);
        this.ctx.fill();
      }

      // Layer 2: Rocky Arches Parallax
      this.ctx.fillStyle = '#7f1d1d';
      for (let i = 0; i < w + 300; i += 220) {
        const x = (i - (this.scrollX * 0.3) % 220) - 220;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.quadraticCurveTo(x + 110, groundY - 180, x + 220, groundY);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Ground: Glowing Lava Lake
      const lavaGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      lavaGrad.addColorStop(0, '#dc2626');
      lavaGrad.addColorStop(0.5, '#ef4444');
      lavaGrad.addColorStop(1, '#7f1d1d');
      this.ctx.fillStyle = lavaGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Lava Top Rim Highlight
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillRect(0, groundY, w, 8);
      this.ctx.lineWidth = 3.5;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

    } else if (theme === 'neon') {
      // Modern Cyberpunk / Synthwave City
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.6, '#1e1b4b');
      bgGrad.addColorStop(1, '#831843');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Neon Sun on Horizon
      const sunY = groundY - 60;
      const sunGrad = this.ctx.createLinearGradient(0, sunY - 80, 0, sunY + 80);
      sunGrad.addColorStop(0, '#f43f5e');
      sunGrad.addColorStop(1, '#fbbf24');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      this.ctx.arc(w / 2, sunY, 90, 0, Math.PI * 2);
      this.ctx.fill();

      // Skyline Layer 1 (Distant Silhouette)
      this.ctx.fillStyle = '#0f172a';
      for (let i = 0; i < w + 200; i += 80) {
        const x = (i - (this.scrollX * 0.15) % 80) - 80;
        const bHeight = 100 + (i % 7) * 20;
        this.ctx.fillRect(x, groundY - bHeight, 60, bHeight);
      }

      // Skyline Layer 2 (Neon Illuminated Buildings)
      this.ctx.fillStyle = '#1e1035';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3;
      for (let i = 0; i < w + 300; i += 130) {
        const x = (i - (this.scrollX * 0.35) % 130) - 130;
        const bHeight = 140 + (i % 5) * 30;
        this.ctx.fillRect(x, groundY - bHeight, 95, bHeight);
        this.ctx.strokeRect(x, groundY - bHeight, 95, bHeight);

        // Neon Windows / Sign
        this.ctx.fillStyle = (i % 2 === 0) ? '#06b6d4' : '#ec4899';
        this.ctx.fillRect(x + 15, groundY - bHeight + 20, 18, 18);
        this.ctx.fillRect(x + 55, groundY - bHeight + 20, 18, 18);
        this.ctx.fillRect(x + 15, groundY - bHeight + 60, 18, 18);
        this.ctx.fillRect(x + 55, groundY - bHeight + 60, 18, 18);
        this.ctx.fillStyle = '#1e1035';
      }

      // Neon Grid Ground
      this.ctx.fillStyle = '#09090b';
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Cyan Grid Line Rim
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#06b6d4';
      this.ctx.fillRect(0, groundY, w, 6);
      this.ctx.shadowBlur = 0;

    } else if (theme === 'ice') {
      // Arctic Ice World
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0c4a6e');
      bgGrad.addColorStop(0.55, '#0284c7');
      bgGrad.addColorStop(1, '#bae6fd');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Snow Peaks Parallax
      this.ctx.fillStyle = '#e0f2fe';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3;
      for (let i = 0; i < w + 320; i += 220) {
        const x = (i - (this.scrollX * 0.2) % 220) - 220;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 110, groundY - 150);
        this.ctx.lineTo(x + 220, groundY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Falling Snowflakes
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 97 + this.player.animFrame * 0.7) % w);
        const sy = ((i * 53 + this.player.animFrame * 1.6) % groundY);
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 3 + (i % 3), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Icy Ground
      const iceGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      iceGrad.addColorStop(0, '#7dd3fc');
      iceGrad.addColorStop(1, '#0284c7');
      this.ctx.fillStyle = iceGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#f0f9ff';
      this.ctx.fillRect(0, groundY, w, 10);

    } else if (theme === 'beach') {
      // Sunny Tropical Beach
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0ea5e9');
      bgGrad.addColorStop(0.65, '#38bdf8');
      bgGrad.addColorStop(1, '#fef08a');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Sun
      this.ctx.fillStyle = '#fde047';
      this.ctx.beginPath();
      this.ctx.arc(w - 110, 90, 42, 0, Math.PI * 2);
      this.ctx.fill();

      // Turquoise Ocean Strip
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(0, groundY - 36, w, 36);

      // Distant Palm Trees
      for (let i = 0; i < w + 320; i += 260) {
        const x = (i - (this.scrollX * 0.28) % 260) - 260;
        this.ctx.fillStyle = '#92400e';
        this.ctx.fillRect(x + 60, groundY - 115, 14, 115);
        this.ctx.fillStyle = '#16a34a';
        this.ctx.beginPath();
        this.ctx.ellipse(x + 42, groundY - 115, 32, 10, -0.3, 0, Math.PI * 2);
        this.ctx.ellipse(x + 92, groundY - 115, 32, 10, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Golden Sand Ground
      this.ctx.fillStyle = '#eab308';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#fde047';
      this.ctx.fillRect(0, groundY, w, 12);

    } else if (theme === 'space') {
      // Deep Galaxy Space
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.6, '#1e1b4b');
      bgGrad.addColorStop(1, '#3b0764');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Twinkling Stars
      this.ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 89 + w - (this.scrollX * 0.08) % w) % w;
        const sy = (i * 47) % (groundY - 20);
        this.ctx.fillRect(sx, sy, (i % 3) + 1, (i % 3) + 1);
      }

      // Ringed Planet
      this.ctx.save();
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(w * 0.72, 110, 44, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#fde68a';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.ellipse(w * 0.72, 110, 74, 16, -0.25, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      // Moon Crater Ground
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillRect(0, groundY, w, 8);

    } else if (theme === 'candy') {
      // Cotton Candy World
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#f472b6');
      bgGrad.addColorStop(0.6, '#fbcfe8');
      bgGrad.addColorStop(1, '#fef9c3');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Lollipop Hills
      for (let i = 0; i < w + 280; i += 200) {
        const x = (i - (this.scrollX * 0.22) % 200) - 200;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 95, groundY - 120, 8, 120);
        this.ctx.fillStyle = (i / 200) % 2 === 0 ? '#ec4899' : '#38bdf8';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x + 99, groundY - 120, 26, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Chocolate & Icing Ground
      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#f472b6';
      this.ctx.fillRect(0, groundY, w, 14);

    } else {
      // Modern 2D Cartoon Meadow Sky
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#38bdf8');
      bgGrad.addColorStop(0.7, '#7dd3fc');
      bgGrad.addColorStop(1, '#bae6fd');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Puffy Cartoon Clouds (Layer 1)
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < w + 400; i += 280) {
        const x = (i - (this.scrollX * 0.1) % 280) - 280;
        this.drawCartoonCloud(x, 70 + (i % 3) * 20, 50);
      }

      // Distant Rounded Hills (Layer 2)
      this.ctx.fillStyle = '#86efac';
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 3.5;
      for (let i = 0; i < w + 500; i += 250) {
        const x = (i - (this.scrollX * 0.25) % 250) - 250;
        this.ctx.beginPath();
        this.ctx.arc(x + 125, groundY + 80, 160, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Lush Grass Ground
      const grassGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      grassGrad.addColorStop(0, '#22c55e');
      grassGrad.addColorStop(1, '#15803d');
      this.ctx.fillStyle = grassGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Top Grass Outline & Layer
      this.ctx.fillStyle = '#4ade80';
      this.ctx.fillRect(0, groundY, w, 12);

      this.ctx.lineWidth = 3.5;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(w, groundY);
      this.ctx.stroke();

      // Grass tufts along the ground
      this.ctx.fillStyle = '#16a34a';
      for (let i = 0; i < w + 100; i += 90) {
        const x = (i - (this.scrollX) % 90) - 90;
        this.ctx.beginPath();
        this.ctx.arc(x, groundY, 6, Math.PI, 0);
        this.ctx.arc(x + 8, groundY, 9, Math.PI, 0);
        this.ctx.arc(x + 16, groundY, 6, Math.PI, 0);
        this.ctx.fill();
      }
    }
  }

  drawCartoonCloud(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI * 1.5);
    this.ctx.arc(x + radius, y - radius * 0.5, radius * 0.7, Math.PI, Math.PI * 1.85);
    this.ctx.arc(x + radius * 2, y, radius * 0.8, Math.PI * 1.2, Math.PI * 0.2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  gameOver() {
    this.isRunning = false;
    this.qte.hideOverlay();
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('runner_highscore', this.highScore.toString());
      this.highScoreValEl.textContent = this.highScore;
    }

    // Distance bonus coins (+1 coin per 25m run) + Level progress
    const distanceBonusCoins = Math.floor(this.score / 25);
    const prog = ShopManager.recordProgress(this.score, 0);
    const totalRunEarned = this.runCoins + distanceBonusCoins + prog.levelUpBonus;
    const newBalance = ShopManager.addCoins(this.runCoins + distanceBonusCoins);
    HomeManager.onRunCompleted();

    if (this.earnedCoinsValEl) this.earnedCoinsValEl.textContent = totalRunEarned;
    if (this.totalCoinsValEl) this.totalCoinsValEl.textContent = newBalance;

    this.finalScoreEl.textContent = this.score;
    this.gameOverModal.classList.remove('hidden');
  }
}
