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
      x: 120,
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

    // Particles array for cinematic dirt kickup, ambient dust & speed sparkles
    this.particles = [];
    this.ambientParticles = [];

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

    this.initAmbientParticles();
  }

  initAmbientParticles() {
    this.ambientParticles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.displayWidth,
        y: Math.random() * this.displayHeight * 0.8,
        radius: Math.random() * 2.5 + 1,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
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

    this.particles = [];
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
    if (this.controls.keys.left && this.player.x > 60) {
      this.player.x -= 4;
    }
    if (this.controls.keys.right && this.player.x < this.displayWidth * 0.5) {
      this.player.x += 4;
    }

    // Duck state
    this.player.isDucking = this.controls.keys.duck && this.player.isGrounded;

    // Jump handling
    if (this.controls.consumeJumpPress()) {
      if (this.player.isGrounded || this.player.jumpsLeft > 0) {
        this.player.vy = this.player.jumpForce;
        this.player.isGrounded = false;
        this.player.jumpsLeft--;
        this.sounds.playJump();

        // Jump dust puff
        this.spawnDustPuff(this.player.x, groundY, 8);
      }
    }

    // Apply Gravity
    this.player.vy += this.player.gravity;
    this.player.y += this.player.vy;

    // Ground Collision
    if (this.player.y >= groundY) {
      if (!this.player.isGrounded) {
        // Landing dust puff
        this.spawnDustPuff(this.player.x, groundY, 6);
      }
      this.player.y = groundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = PlayerConfig.ability === 'double_jump' ? 2 : 1;
    }

    // Continuous running dust particles when running on ground
    if (this.player.isGrounded && Math.random() < 0.6) {
      this.particles.push({
        x: this.player.x - 12 + (Math.random() * 8 - 4),
        y: groundY - 2,
        vx: -this.currentSpeed * 0.4 - Math.random() * 1.5,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 4 + 3,
        opacity: 0.6,
        life: 1,
        decay: Math.random() * 0.03 + 0.02,
        color: GameConfig.background === 'cave' ? 'rgba(239, 68, 68, ' : 'rgba(217, 119, 6, '
      });
    }

    // Speed boost trails
    if (this.player.invulnerable) {
      for (let i = 0; i < 2; i++) {
        this.particles.push({
          x: this.player.x - 15,
          y: this.player.y - 40 + (Math.random() * 60 - 30),
          vx: -this.currentSpeed * 0.8,
          vy: Math.random() * 2 - 1,
          size: Math.random() * 5 + 3,
          opacity: 0.9,
          life: 1,
          decay: 0.05,
          color: 'rgba(245, 158, 11, '
        });
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size += 0.1;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Ambient Floating Particles
    this.ambientParticles.forEach(p => {
      p.x -= (this.currentSpeed * 0.15) + p.speedX;
      p.y += p.speedY;
      p.pulse += 0.03;
      if (p.x < -20) p.x = this.displayWidth + 20;
      if (p.y < 0) p.y = this.displayHeight * 0.8;
      if (p.y > this.displayHeight * 0.8) p.y = 10;
    });

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
      const playerHeight = (this.player.isDucking ? 60 : 120) * charScaleY;

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

  spawnDustPuff(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y,
        vx: (Math.random() - 0.7) * 3,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 6 + 4,
        opacity: 0.7,
        life: 1,
        decay: Math.random() * 0.03 + 0.02,
        color: GameConfig.background === 'cave' ? 'rgba(220, 38, 38, ' : 'rgba(217, 119, 6, '
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    const theme = GameConfig.background || 'meadow';
    const groundY = this.displayHeight * 0.75;

    // Draw Parallax Cinematic Background
    this.drawBackground(theme, groundY);

    // Draw Particles behind player / obstacles
    this.drawParticles();

    // Draw Obstacles
    this.obstacles.draw(this.ctx, theme);

    // Draw Player
    let pose = 'run';
    if (!this.player.isGrounded) pose = 'jump';
    if (this.player.isDucking) pose = 'duck';

    this.ctx.save();
    if (this.player.invulnerable) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#f59e0b';
    }

    renderCharacter(this.ctx, this.player.x, this.player.y, PlayerConfig, {
      frame: this.player.animFrame,
      pose: pose
    });
    this.ctx.restore();

    // Draw Cinematic Lighting Overlay & Vignette
    this.drawCinematicOverlay(theme, groundY);
  }

  drawParticles() {
    // Draw Ground Dirt & Speed Particles
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + (p.opacity * p.life) + ')';
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw Floating Golden Sun Dust / Pollen
    this.ambientParticles.forEach(p => {
      this.ctx.save();
      this.ctx.beginPath();
      const alpha = (p.opacity + Math.sin(p.pulse) * 0.2) * 0.8;
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = GameConfig.background === 'cave'
        ? `rgba(248, 113, 113, ${alpha})`
        : GameConfig.background === 'neon'
          ? `rgba(192, 132, 252, ${alpha})`
          : `rgba(254, 240, 138, ${alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#fde047';
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawBackground(theme, groundY) {
    const w = this.displayWidth;
    const h = this.displayHeight;

    if (theme === 'cave') {
      // Canyon Trail (Cinematic Canyon Sunset)
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.4, '#7f1d1d');
      bgGrad.addColorStop(0.8, '#c2410c');
      bgGrad.addColorStop(1, '#f97316');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Sunset Sun in Canyon
      this.ctx.save();
      const sunGrad = this.ctx.createRadialGradient(w * 0.75, groundY * 0.6, 10, w * 0.75, groundY * 0.6, 180);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)');
      sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      this.ctx.arc(w * 0.75, groundY * 0.6, 180, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Canyon Distant Rock Pillars / Mesas (Parallax 0.1)
      this.ctx.fillStyle = '#581c87';
      for (let i = 0; i < w + 400; i += 250) {
        const x = (i - (this.scrollX * 0.1) % 250) - 250;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 20, groundY - 140);
        this.ctx.lineTo(x + 100, groundY - 150);
        this.ctx.lineTo(x + 140, groundY - 120);
        this.ctx.lineTo(x + 180, groundY);
        this.ctx.fill();
      }

      // Midground Canyon Cliffs (Parallax 0.3)
      this.ctx.fillStyle = '#831843';
      for (let i = 0; i < w + 300; i += 180) {
        const x = (i - (this.scrollX * 0.3) % 180) - 180;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 30, groundY - 90);
        this.ctx.lineTo(x + 90, groundY - 100);
        this.ctx.lineTo(x + 150, groundY);
        this.ctx.fill();
      }

      // Canyon Floor
      const groundGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#7f1d1d');
      groundGrad.addColorStop(0.3, '#450a0a');
      groundGrad.addColorStop(1, '#180202');
      this.ctx.fillStyle = groundGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Edge rim light
      this.ctx.fillStyle = '#f97316';
      this.ctx.fillRect(0, groundY, w, 6);

    } else if (theme === 'neon') {
      // Mystic Sunset Forest (Zauber-Wald)
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#312e81');
      bgGrad.addColorStop(0.85, '#581c87');
      bgGrad.addColorStop(1, '#831843');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Moon / Mystic Orb Glow
      this.ctx.save();
      const moonGrad = this.ctx.createRadialGradient(w * 0.2, groundY * 0.3, 10, w * 0.2, groundY * 0.3, 140);
      moonGrad.addColorStop(0, 'rgba(232, 121, 249, 0.8)');
      moonGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
      moonGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      this.ctx.fillStyle = moonGrad;
      this.ctx.beginPath();
      this.ctx.arc(w * 0.2, groundY * 0.3, 140, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Silhouetted Ancient Tree Tops (Parallax 0.15)
      this.ctx.fillStyle = '#1e1b4b';
      for (let i = 0; i < w + 300; i += 120) {
        const x = (i - (this.scrollX * 0.15) % 120) - 120;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 60, groundY - 180);
        this.ctx.lineTo(x, groundY);
        this.ctx.lineTo(x + 120, groundY);
        this.ctx.fill();
      }

      // Midground Pine Forest (Parallax 0.35)
      this.ctx.fillStyle = '#311042';
      for (let i = 0; i < w + 200; i += 80) {
        const x = (i - (this.scrollX * 0.35) % 80) - 80;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 40, groundY - 120);
        this.ctx.lineTo(x, groundY);
        this.ctx.lineTo(x + 80, groundY);
        this.ctx.fill();
      }

      // Mystic Ground
      const groundGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#2e1065');
      groundGrad.addColorStop(1, '#0f172a');
      this.ctx.fillStyle = groundGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Glowing bioluminescent rim
      this.ctx.fillStyle = '#c084fc';
      this.ctx.fillRect(0, groundY, w, 4);

    } else {
      // Spirit-Prärie (Spirit Wild West Sunset Prairie)
      // Majestic Sunset Sky: Deep purple -> vibrant sunset orange -> warm golden yellow
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
      bgGrad.addColorStop(0, '#1e112a');
      bgGrad.addColorStop(0.35, '#9a3412');
      bgGrad.addColorStop(0.7, '#ea580c');
      bgGrad.addColorStop(1, '#fef08a');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, groundY);

      // Golden Sun on Horizon with Volumetric Sun Rays
      const sunX = w * 0.65;
      const sunY = groundY - 30;

      this.ctx.save();
      // Sun Disc Glow
      const sunGlow = this.ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 220);
      sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      sunGlow.addColorStop(0.25, 'rgba(251, 146, 60, 0.6)');
      sunGlow.addColorStop(0.6, 'rgba(234, 88, 12, 0.25)');
      sunGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
      this.ctx.fillStyle = sunGlow;
      this.ctx.beginPath();
      this.ctx.arc(sunX, sunY, 220, 0, Math.PI * 2);
      this.ctx.fill();

      // Sunbeams / God Rays
      this.ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      for (let angle = -Math.PI * 0.8; angle < -Math.PI * 0.1; angle += 0.25) {
        this.ctx.beginPath();
        this.ctx.moveTo(sunX, sunY);
        this.ctx.lineTo(sunX + Math.cos(angle - 0.08) * 800, sunY + Math.sin(angle - 0.08) * 800);
        this.ctx.lineTo(sunX + Math.cos(angle + 0.08) * 800, sunY + Math.sin(angle + 0.08) * 800);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();

      // Layer 1: Distant Majestic Mountains Silhouette (Parallax 0.1)
      this.ctx.fillStyle = '#581c87'; // Majestic purple mountain
      const mOffset = (this.scrollX * 0.1) % 400;
      for (let i = -400; i < w + 400; i += 400) {
        const x = i - mOffset;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + 120, groundY - 180);
        this.ctx.lineTo(x + 190, groundY - 140);
        this.ctx.lineTo(x + 280, groundY - 210);
        this.ctx.lineTo(x + 400, groundY);
        this.ctx.fill();

        // Mountain summit golden highlight
        this.ctx.fillStyle = 'rgba(253, 186, 116, 0.25)';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 280, groundY - 210);
        this.ctx.lineTo(x + 310, groundY - 160);
        this.ctx.lineTo(x + 260, groundY - 170);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#581c87';
      }

      // Layer 2: Rolling Golden Prairie Hills & Pines (Parallax 0.25)
      this.ctx.fillStyle = '#9a3412';
      const hOffset = (this.scrollX * 0.25) % 300;
      for (let i = -300; i < w + 300; i += 300) {
        const x = i - hOffset;
        this.ctx.beginPath();
        this.ctx.arc(x + 150, groundY + 80, 180, Math.PI, 0);
        this.ctx.fill();

        // Pine trees on hill ridge
        this.drawPineTree(this.ctx, x + 80, groundY - 60, 35, '#365314');
        this.drawPineTree(this.ctx, x + 120, groundY - 75, 45, '#1a2e05');
        this.drawPineTree(this.ctx, x + 210, groundY - 50, 30, '#365314');
      }

      // Layer 3: Warm Foreground Prairie Hills (Parallax 0.5)
      this.ctx.fillStyle = '#ca8a04'; // Rich prairie gold
      const fOffset = (this.scrollX * 0.5) % 250;
      for (let i = -250; i < w + 250; i += 250) {
        const x = i - fOffset;
        this.ctx.beginPath();
        this.ctx.arc(x + 125, groundY + 110, 160, Math.PI, 0);
        this.ctx.fill();
      }

      // Layer 4: Prairie Trail & Grass Terrain (Foreground 1.0)
      const prairieGroundGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
      prairieGroundGrad.addColorStop(0, '#a16207');
      prairieGroundGrad.addColorStop(0.15, '#854d0e');
      prairieGroundGrad.addColorStop(0.5, '#3f2206');
      prairieGroundGrad.addColorStop(1, '#1f0d02');
      this.ctx.fillStyle = prairieGroundGrad;
      this.ctx.fillRect(0, groundY, w, h - groundY);

      // Top Grass / Meadow Rim
      this.ctx.fillStyle = '#eab308';
      this.ctx.fillRect(0, groundY, w, 8);
      this.ctx.fillStyle = '#65a30d';
      this.ctx.fillRect(0, groundY + 8, w, 6);

      // Dynamic Grass Tufts & Prairie Sunflowers along the trail
      this.drawPrairieDetails(groundY);
    }
  }

  drawPineTree(ctx, x, y, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    const w = height * 0.45;
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x - w, y);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - height * 0.7);
    ctx.lineTo(x - w * 1.2, y + height * 0.3);
    ctx.lineTo(x + w * 1.2, y + height * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPrairieDetails(groundY) {
    this.ctx.save();
    const gSpacing = 80;
    const offset = (this.scrollX) % gSpacing;

    for (let x = -gSpacing; x < this.displayWidth + gSpacing; x += gSpacing) {
      const px = x - offset;
      const sway = Math.sin((this.scrollX + px) * 0.05) * 4;

      // Grass tuft
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(px, groundY);
      this.ctx.quadraticCurveTo(px - 5 + sway, groundY - 14, px - 10 + sway, groundY - 18);
      this.ctx.moveTo(px, groundY);
      this.ctx.quadraticCurveTo(px + sway, groundY - 18, px + sway * 1.2, groundY - 24);
      this.ctx.moveTo(px, groundY);
      this.ctx.quadraticCurveTo(px + 5 + sway, groundY - 12, px + 8 + sway, groundY - 16);
      this.ctx.stroke();

      // Prairie Sunflower / Wildflower occasionally
      if ((Math.abs(Math.floor(px)) % 240) < 80) {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(px + sway, groundY - 22, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#f59e0b';
        this.ctx.beginPath();
        this.ctx.arc(px + sway, groundY - 22, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.ctx.restore();
  }

  drawCinematicOverlay(theme, groundY) {
    const w = this.displayWidth;
    const h = this.displayHeight;

    // Soft warm sun glare at top right for Prairie
    if (theme === 'meadow' || !theme) {
      this.ctx.save();
      const glareGrad = this.ctx.createRadialGradient(w * 0.7, 0, 50, w * 0.7, 0, w * 0.6);
      glareGrad.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
      glareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = glareGrad;
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.restore();
    }

    // Cinematic Edge Vignette (Movie Feel)
    this.ctx.save();
    const vignette = this.ctx.createRadialGradient(w / 2, h / 2, Math.max(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.75);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(15, 23, 42, 0.55)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, w, h);
    this.ctx.restore();
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
