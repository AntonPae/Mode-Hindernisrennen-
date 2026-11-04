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

    if (this.spawnTimer > this.minInterval + Math.random() * 70) {
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
    const types = ['fence', 'pit'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'fence') {
      const height = 45 + Math.random() * 25;
      this.obstacles.push({
        type: 'fence',
        x: canvasWidth + 20,
        y: groundY - height,
        width: 36,
        height: height
      });
    } else if (type === 'pit') {
      const width = 70 + Math.random() * 45;
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
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (obs.type === 'fence') {
        // Modern 2D Cartoon Fence / Barrier / Barricade
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#0f172a';

        if (theme === 'cave') {
          // Volcanic Spiked Barrier
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [6]);
          ctx.fill();
          ctx.stroke();

          // Spikes on top
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y - 12);
          ctx.lineTo(obs.x + obs.width, obs.y);
          ctx.fill();
          ctx.stroke();

          // Glowing lava cracks
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(obs.x + 8, obs.y + 10);
          ctx.lineTo(obs.x + obs.width - 10, obs.y + obs.height - 12);
          ctx.stroke();

        } else if (theme === 'neon') {
          // Cyberpunk Neon Hologram Barrier
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [8]);
          ctx.fill();

          ctx.strokeStyle = '#22d3ee';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#06b6d4';
          ctx.stroke();

          // Neon Hazard Stripes
          ctx.fillStyle = '#22d3ee';
          ctx.fillRect(obs.x + 4, obs.y + 8, obs.width - 8, 6);
          ctx.fillRect(obs.x + 4, obs.y + obs.height - 14, obs.width - 8, 6);

        } else {
          // Stylized Wooden Cartoon Hurdle
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [6]);
          ctx.fill();
          ctx.stroke();

          // Wooden planks & bolts
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obs.x + 4, obs.y + 8, obs.width - 8, 8);
          ctx.fillRect(obs.x + 4, obs.y + obs.height - 16, obs.width - 8, 8);

          // Bolts
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(obs.x + 8, obs.y + 12, 2.5, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width - 8, obs.y + 12, 2.5, 0, Math.PI * 2);
          ctx.arc(obs.x + 8, obs.y + obs.height - 12, 2.5, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width - 8, obs.y + obs.height - 12, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (obs.type === 'pit') {
        // Cartoon Hole / Pit with depth and sharp edges
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Edge highlights & hazard indicators
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#0f172a';

        if (theme === 'cave') {
          // Lava Pit Edge
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x, obs.y, obs.width, 14);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(obs.x, obs.y + 14, obs.width, 4);
        } else if (theme === 'neon') {
          // Glowing Neon Edge
          ctx.fillStyle = '#ec4899';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#f43f5e';
          ctx.fillRect(obs.x, obs.y, obs.width, 8);
        } else {
          // Grass Cliff Edge
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(obs.x - 4, obs.y, 8, 12);
          ctx.fillRect(obs.x + obs.width - 4, obs.y, 8, 12);
          ctx.strokeRect(obs.x - 4, obs.y, 8, 12);
          ctx.strokeRect(obs.x + obs.width - 4, obs.y, 8, 12);
        }
      }
      ctx.restore();
    });
  }

  checkCollisions(playerRect) {
    for (const obs of this.obstacles) {
      if (obs.type === 'fence') {
        // AABB box intersection with slight generous margin
        if (
          playerRect.x + 6 < obs.x + obs.width &&
          playerRect.x + playerRect.width - 6 > obs.x &&
          playerRect.y + 6 < obs.y + obs.height &&
          playerRect.y + playerRect.height > obs.y + 4
        ) {
          return true;
        }
      } else if (obs.type === 'pit') {
        // Player falls in pit if center is directly over hole without jump clearance
        const playerBottom = playerRect.y + playerRect.height;
        const playerCenterX = playerRect.x + playerRect.width / 2;

        if (
          playerCenterX > obs.x + 8 &&
          playerCenterX < obs.x + obs.width - 8 &&
          playerBottom >= obs.y - 4
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
