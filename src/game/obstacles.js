export class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.spawnTimer = 0;
    this.minInterval = 120; // Frames between obstacles
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
      if (obs.x + obs.width < 0) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  spawnObstacle(canvasWidth, groundY) {
    const types = ['fence', 'pit'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'fence') {
      const height = 40 + Math.random() * 20;
      this.obstacles.push({
        type: 'fence',
        x: canvasWidth + 20,
        y: groundY - height,
        width: 30,
        height: height
      });
    } else if (type === 'pit') {
      const width = 60 + Math.random() * 40;
      this.obstacles.push({
        type: 'pit',
        x: canvasWidth + 20,
        y: groundY,
        width: width,
        height: 100 // Depth below ground
      });
    }
  }

  draw(ctx, theme) {
    this.obstacles.forEach(obs => {
      ctx.save();
      if (obs.type === 'fence') {
        // Wooden / Cyber / Lava Fence depending on theme
        if (theme === 'cave') {
          ctx.fillStyle = '#b91c1c';
          ctx.strokeStyle = '#f87171';
        } else if (theme === 'neon') {
          ctx.fillStyle = '#06b6d4';
          ctx.strokeStyle = '#22d3ee';
        } else {
          ctx.fillStyle = '#854d0e';
          ctx.strokeStyle = '#ca8a04';
        }

        ctx.lineWidth = 2;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

        // Fence posts detail
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obs.x + 4, obs.y + 6, obs.width - 8, 4);
        ctx.fillRect(obs.x + 4, obs.y + obs.height - 12, obs.width - 8, 4);

      } else if (obs.type === 'pit') {
        // Pit / Hole in ground
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Pit edges highlight
        ctx.fillStyle = theme === 'cave' ? '#ef4444' : '#64748b';
        ctx.fillRect(obs.x, obs.y, 4, 10);
        ctx.fillRect(obs.x + obs.width - 4, obs.y, 4, 10);
      }
      ctx.restore();
    });
  }

  checkCollisions(playerRect) {
    for (const obs of this.obstacles) {
      if (obs.type === 'fence') {
        // AABB box intersection
        if (
          playerRect.x < obs.x + obs.width &&
          playerRect.x + playerRect.width > obs.x &&
          playerRect.y < obs.y + obs.height &&
          playerRect.y + playerRect.height > obs.y
        ) {
          return true;
        }
      } else if (obs.type === 'pit') {
        // Player falls in pit if their center/bottom is directly over the hole without being high enough in jump
        const playerBottom = playerRect.y + playerRect.height;
        const playerCenterX = playerRect.x + playerRect.width / 2;

        if (
          playerCenterX > obs.x + 5 &&
          playerCenterX < obs.x + obs.width - 5 &&
          playerBottom >= obs.y - 5
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
