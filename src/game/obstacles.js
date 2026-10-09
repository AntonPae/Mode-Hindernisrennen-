export class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.spawnTimer = 0;
    this.minInterval = 110; // Frames between obstacles
  }

  reset() {
    this.obstacles = [];
    this.spawnTimer = 0;
  }

  update(speed, canvasWidth, groundY) {
    this.spawnTimer++;

    if (this.spawnTimer > this.minInterval + Math.random() * 80) {
      this.spawnTimer = 0;
      this.spawnObstacle(canvasWidth, groundY);
    }

    // Move obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= speed;

      // Remove off-screen obstacles
      if (obs.x + obs.width < -50) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  spawnObstacle(canvasWidth, groundY) {
    const types = ['fence', 'rock', 'pit'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'fence') {
      const height = 45 + Math.random() * 15;
      this.obstacles.push({
        type: 'fence',
        x: canvasWidth + 20,
        y: groundY - height,
        width: 32,
        height: height
      });
    } else if (type === 'rock') {
      const height = 35 + Math.random() * 15;
      const width = 40 + Math.random() * 15;
      this.obstacles.push({
        type: 'rock',
        x: canvasWidth + 20,
        y: groundY - height,
        width: width,
        height: height
      });
    } else if (type === 'pit') {
      const width = 65 + Math.random() * 35;
      this.obstacles.push({
        type: 'pit',
        x: canvasWidth + 20,
        y: groundY,
        width: width,
        height: 120 // Depth below ground
      });
    }
  }

  draw(ctx, theme) {
    this.obstacles.forEach(obs => {
      ctx.save();
      if (obs.type === 'fence') {
        this.drawFence(ctx, obs, theme);
      } else if (obs.type === 'rock') {
        this.drawRock(ctx, obs, theme);
      } else if (obs.type === 'pit') {
        this.drawPit(ctx, obs, theme);
      }
      ctx.restore();
    });
  }

  drawFence(ctx, obs, theme) {
    // Rustic Wooden Prairie Fence with Sunset Highlights
    const x = obs.x;
    const y = obs.y;
    const w = obs.width;
    const h = obs.height;

    // Drop Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h, w * 0.8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fence Wooden Posts Color Scheme
    let woodColor = '#854d0e'; // Rich oak brown
    let woodHighlight = '#f59e0b'; // Sunset golden sheen
    let darkWood = '#451a03';

    if (theme === 'cave') {
      woodColor = '#9f1239';
      woodHighlight = '#f43f5e';
      darkWood = '#4c0519';
    } else if (theme === 'neon') {
      woodColor = '#4c1d95';
      woodHighlight = '#c084fc';
      darkWood = '#1e1b4b';
    }

    // Vertical Fence Posts (Left & Right)
    const postWidth = 7;

    // Left Post
    ctx.fillStyle = woodColor;
    ctx.fillRect(x + 2, y, postWidth, h);
    ctx.fillStyle = woodHighlight;
    ctx.fillRect(x + 2, y, 2, h);
    ctx.fillStyle = darkWood;
    ctx.fillRect(x + 2 + postWidth - 2, y, 2, h);

    // Right Post
    ctx.fillStyle = woodColor;
    ctx.fillRect(x + w - 9, y, postWidth, h);
    ctx.fillStyle = woodHighlight;
    ctx.fillRect(x + w - 9, y, 2, h);
    ctx.fillStyle = darkWood;
    ctx.fillRect(x + w - 9 + postWidth - 2, y, 2, h);

    // Pointed top post tips
    ctx.fillStyle = woodHighlight;
    ctx.beginPath();
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 2 + postWidth / 2, y - 5);
    ctx.lineTo(x + 2 + postWidth, y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w - 9, y);
    ctx.lineTo(x + w - 9 + postWidth / 2, y - 5);
    ctx.lineTo(x + w - 9 + postWidth, y);
    ctx.fill();

    // Horizontal Rails
    const railH = 7;
    const railY1 = y + h * 0.25;
    const railY2 = y + h * 0.65;

    ctx.fillStyle = woodColor;
    ctx.fillRect(x, railY1, w, railH);
    ctx.fillRect(x, railY2, w, railH);

    // Rail Sunset Highlights & Shadows
    ctx.fillStyle = woodHighlight;
    ctx.fillRect(x, railY1, w, 2);
    ctx.fillRect(x, railY2, w, 2);

    ctx.fillStyle = darkWood;
    ctx.fillRect(x, railY1 + railH - 2, w, 2);
    ctx.fillRect(x, railY2 + railH - 2, w, 2);

    // Iron nails details
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 5, railY1 + 2, 2, 2);
    ctx.fillRect(x + 5, railY2 + 2, 2, 2);
    ctx.fillRect(x + w - 6, railY1 + 2, 2, 2);
    ctx.fillRect(x + w - 6, railY2 + 2, 2, 2);
  }

  drawRock(ctx, obs, theme) {
    // Majestic Prairie Boulder
    const x = obs.x;
    const y = obs.y;
    const w = obs.width;
    const h = obs.height;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 2, w * 0.6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base rock body
    ctx.beginPath();
    ctx.moveTo(x + 5, y + h);
    ctx.lineTo(x, y + h * 0.5);
    ctx.lineTo(x + w * 0.25, y + 4);
    ctx.lineTo(x + w * 0.7, y);
    ctx.lineTo(x + w, y + h * 0.4);
    ctx.lineTo(x + w * 0.9, y + h);
    ctx.closePath();

    let rockGradient = ctx.createLinearGradient(x, y, x + w, y + h);
    if (theme === 'cave') {
      rockGradient.addColorStop(0, '#7f1d1d');
      rockGradient.addColorStop(1, '#180202');
    } else if (theme === 'neon') {
      rockGradient.addColorStop(0, '#581c87');
      rockGradient.addColorStop(1, '#0f172a');
    } else {
      rockGradient.addColorStop(0, '#78350f');
      rockGradient.addColorStop(0.5, '#451a03');
      rockGradient.addColorStop(1, '#1c1917');
    }

    ctx.fillStyle = rockGradient;
    ctx.fill();

    // Golden Rim Light / Highlight
    ctx.strokeStyle = theme === 'cave' ? '#f87171' : theme === 'neon' ? '#c084fc' : '#fde047';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + h * 0.5);
    ctx.lineTo(x + w * 0.25, y + 4);
    ctx.lineTo(x + w * 0.7, y);
    ctx.stroke();

    // Rock facet lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.4, y + 2);
    ctx.lineTo(x + w * 0.35, y + h * 0.6);
    ctx.lineTo(x + w * 0.8, y + h * 0.8);
    ctx.stroke();
  }

  drawPit(ctx, obs, theme) {
    // Canyon Ravine / Pit
    const x = obs.x;
    const y = obs.y;
    const w = obs.width;
    const h = obs.height;

    // Pit Hole Gradient
    const pitGrad = ctx.createLinearGradient(x, y, x, y + h);
    pitGrad.addColorStop(0, '#0f172a');
    pitGrad.addColorStop(0.2, '#020617');
    pitGrad.addColorStop(1, '#000000');
    ctx.fillStyle = pitGrad;
    ctx.fillRect(x, y, w, h);

    // Cliff Edge Jagged Teeth
    ctx.fillStyle = theme === 'cave' ? '#b91c1c' : theme === 'neon' ? '#311042' : '#854d0e';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6, y + 10);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x + 18, y + 8);
    ctx.lineTo(x + 24, y);
    ctx.lineTo(x, y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w - 6, y + 10);
    ctx.lineTo(x + w - 12, y);
    ctx.lineTo(x + w - 18, y + 8);
    ctx.lineTo(x + w - 24, y);
    ctx.lineTo(x + w, y);
    ctx.fill();

    // Edge glowing danger rim
    ctx.fillStyle = theme === 'cave' ? '#ef4444' : '#f59e0b';
    ctx.fillRect(x - 2, y, 4, 12);
    ctx.fillRect(x + w - 2, y, 4, 12);
  }

  checkCollisions(playerRect) {
    for (const obs of this.obstacles) {
      if (obs.type === 'fence' || obs.type === 'rock') {
        // AABB box intersection with slight padding for fairness
        if (
          playerRect.x < obs.x + obs.width - 4 &&
          playerRect.x + playerRect.width > obs.x + 4 &&
          playerRect.y < obs.y + obs.height - 4 &&
          playerRect.y + playerRect.height > obs.y + 4
        ) {
          return true;
        }
      } else if (obs.type === 'pit') {
        // Player falls in pit if center is over the ravine
        const playerBottom = playerRect.y + playerRect.height;
        const playerCenterX = playerRect.x + playerRect.width / 2;

        if (
          playerCenterX > obs.x + 8 &&
          playerCenterX < obs.x + obs.width - 8 &&
          playerBottom >= obs.y - 5
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
