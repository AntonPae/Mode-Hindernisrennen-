import { PlayerConfig, GameConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ControlsManager } from './controls.js';
import { ObstacleManager } from './obstacles.js';

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
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);

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
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.25);

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
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

export class RunnerEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.controls = new ControlsManager();
    this.obstacles = new ObstacleManager();
    this.sounds = new SoundManager();

    this.scoreValEl = document.getElementById('scoreVal');
    this.highScoreValEl = document.getElementById('highScoreVal');
    this.finalScoreEl = document.getElementById('finalScore');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.restartBtn = document.getElementById('restartBtn');
    this.editorReturnBtn = document.getElementById('editorReturnBtn');

    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('runner_highscore') || '0', 10);
    this.highScoreValEl.textContent = this.highScore;

    this.scrollX = 0;
    this.baseSpeed = 5;
    this.currentSpeed = this.baseSpeed;

    // Player physics state
    this.player = {
      x: 100,
      y: 0,
      vy: 0,
      gravity: 0.65,
      jumpForce: -13,
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
    this.scrollX = 0;
    this.currentSpeed = this.baseSpeed;

    const groundY = this.displayHeight * 0.75;
    this.player.y = groundY;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    this.player.invulnerable = false;
    this.player.invulnerableTimer = 0;

    this.controls.reset();
    this.obstacles.reset();

    this.gameOverModal.classList.add('hidden');
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  stop() {
    this.isRunning = false;
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

  update() {
    if (this.isPaused) return;

    const groundY = this.displayHeight * 0.75;

    // Ability: Speed Boost timer / trigger
    if (this.controls.consumeAbilityPress()) {
      if (PlayerConfig.ability === 'speed_boost' && !this.player.invulnerable) {
        this.player.invulnerable = true;
        this.player.invulnerableTimer = 180; // ~3 seconds at 60fps
        this.sounds.playSprint();
      }
    }

    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer--;
      this.currentSpeed = this.baseSpeed * 1.8;
      if (this.player.invulnerableTimer <= 0) {
        this.player.invulnerable = false;
        this.currentSpeed = this.baseSpeed;
      }
    } else {
      this.currentSpeed = this.baseSpeed + Math.floor(this.score / 100) * 0.3;
    }

    // Controls & Horizontal movement
    if (this.controls.keys.left && this.player.x > 50) {
      this.player.x -= 4;
    }
    if (this.controls.keys.right && this.player.x < this.displayWidth * 0.5) {
      this.player.x += 4;
    }

    // Duck state
    this.player.isDucking = this.controls.keys.duck && this.player.isGrounded;

    // Jump handling
    if (this.controls.consumeJumpPress()) {
      const maxJumps = PlayerConfig.ability === 'double_jump' ? 2 : 1;
      if (this.player.isGrounded || this.player.jumpsLeft > 0) {
        this.player.vy = this.player.jumpForce;
        this.player.isGrounded = false;
        this.player.jumpsLeft--;
        this.sounds.playJump();
      }
    }

    // Apply Gravity
    this.player.vy += this.player.gravity;
    this.player.y += this.player.vy;

    // Ground Collision
    if (this.player.y >= groundY) {
      this.player.y = groundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    }

    // Animation frames
    this.player.animFrame++;

    // Background Scroll
    this.scrollX += this.currentSpeed;
    this.score = Math.floor(this.scrollX / 10);
    this.scoreValEl.textContent = this.score;

    // Update Obstacles
    this.obstacles.update(this.currentSpeed, this.displayWidth, groundY);

    // Collision Check
    if (!this.player.invulnerable) {
      const charScaleX = PlayerConfig.body.width || 1.0;
      const charScaleY = PlayerConfig.body.height || 1.0;
      const playerWidth = 36 * charScaleX;
      const playerHeight = (this.player.isDucking ? 70 : 130) * charScaleY;

      const playerRect = {
        x: this.player.x - playerWidth / 2,
        y: this.player.y - playerHeight,
        width: playerWidth,
        height: playerHeight
      };

      if (this.obstacles.checkCollisions(playerRect)) {
        this.sounds.playCollision();
        this.gameOver();
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    const theme = GameConfig.background || 'meadow';
    const groundY = this.displayHeight * 0.75;

    // Draw Parallax Background
    this.drawBackground(theme, groundY);

    // Draw Obstacles
    this.obstacles.draw(this.ctx, theme);

    // Draw Player
    let pose = 'run';
    if (!this.player.isGrounded) pose = 'jump';
    if (this.player.isDucking) pose = 'duck';

    this.ctx.save();
    if (this.player.invulnerable) {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#f59e0b';
    }

    renderCharacter(this.ctx, this.player.x, this.player.y, PlayerConfig, {
      frame: this.player.animFrame,
      pose: pose
    });
    this.ctx.restore();
  }

  drawBackground(theme, groundY) {
    const w = this.displayWidth;
    const h = this.displayHeight;

    if (theme === 'cave') {
      // Cave Sky / Background
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(1, '#7f1d1d');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Distant cave stalagmites parallax
      this.ctx.fillStyle = '#450a0a';
      for (let i = 0; i < w + 200; i += 150) {
        const x = (i - (this.scrollX * 0.2) % 150) - 150;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 75, groundY - 120);
        this.ctx.lineTo(x + 150, groundY);
        this.ctx.fill();
      }

      // Ground / Lava
      this.ctx.fillStyle = '#991b1b';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#f87171';
      this.ctx.fillRect(0, groundY, w, 6);

    } else if (theme === 'neon') {
      // Neon City Background
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(1, '#1e1b4b');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // City Skyline Parallax
      this.ctx.fillStyle = '#1e1035';
      for (let i = 0; i < w + 300; i += 100) {
        const x = (i - (this.scrollX * 0.3) % 100) - 100;
        this.ctx.fillRect(x, groundY - 160, 70, 160);
        this.ctx.fillStyle = '#ec4899';
        this.ctx.fillRect(x + 10, groundY - 140, 8, 8);
        this.ctx.fillRect(x + 30, groundY - 100, 8, 8);
        this.ctx.fillStyle = '#1e1035';
      }

      // Neon Ground
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(0, groundY, w, 4);

    } else {
      // Meadow Sky
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#38bdf8');
      bgGrad.addColorStop(1, '#bae6fd');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Distant Hills
      this.ctx.fillStyle = '#86efac';
      for (let i = 0; i < w + 400; i += 200) {
        const x = (i - (this.scrollX * 0.2) % 200) - 200;
        this.ctx.beginPath();
        this.ctx.arc(x + 100, groundY + 40, 120, Math.PI, 0);
        this.ctx.fill();
      }

      // Grass Ground
      this.ctx.fillStyle = '#15803d';
      this.ctx.fillRect(0, groundY, w, h - groundY);
      this.ctx.fillStyle = '#22c55e';
      this.ctx.fillRect(0, groundY, w, 10);
    }
  }

  gameOver() {
    this.isRunning = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('runner_highscore', this.highScore.toString());
      this.highScoreValEl.textContent = this.highScore;
    }
    this.finalScoreEl.textContent = this.score;
    this.gameOverModal.classList.remove('hidden');
  }
}
