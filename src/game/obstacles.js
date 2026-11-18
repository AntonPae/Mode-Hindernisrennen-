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
    const types = ['fence', 'pit', 'overhead'];
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
    } else if (type === 'overhead') {
      // Overhead obstacle: suspended above ground.
      // Normal standing player height is ~110px. Ducking player height is ~55px.
      // We position the bottom of the overhead barrier around groundY - 60px so a ducking player fits under,
      // but a standing or jumping player will hit it!
      const obstacleHeight = 40;
      const clearance = 58; // gap between ground and bottom of obstacle
      const obstacleWidth = 85 + Math.random() * 30;

      this.obstacles.push({
        type: 'overhead',
        x: canvasWidth + 20,
        y: groundY - clearance - obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight,
        clearance: clearance
      });
    }
  }

  draw(ctx, theme) {
    this.obstacles.forEach(obs => {
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (obs.type === 'overhead') {
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#0f172a';

        if (theme === 'cave') {
          // Hanging Stalactite / Low Rocky Arch
          ctx.fillStyle = '#4c1d95';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height * 0.7, [6]);
          ctx.fill();
          ctx.stroke();

          // Hanging stalactites teeth
          ctx.fillStyle = '#7c3aed';
          const teeth = 4;
          const toothWidth = obs.width / teeth;
          for (let i = 0; i < teeth; i++) {
            ctx.beginPath();
            ctx.moveTo(obs.x + i * toothWidth, obs.y + obs.height * 0.7);
            ctx.lineTo(obs.x + (i + 0.5) * toothWidth, obs.y + obs.height + 6);
            ctx.lineTo(obs.x + (i + 1) * toothWidth, obs.y + obs.height * 0.7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Warning duck label / arrow
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 13px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▼ DUCK ▼', obs.x + obs.width / 2, obs.y - 6);

        } else if (theme === 'neon') {
          // Cyberpunk Low High-Voltage Laser Beam Barrier
          // Left and right emitter posts
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2.5;

          // Glowing laser beam
          ctx.save();
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#ff2d55';
          ctx.fillRect(obs.x, obs.y + obs.height * 0.35, obs.width, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x, obs.y + obs.height * 0.35 + 4, obs.width, 8);
          ctx.restore();

          // Hazard sign
          ctx.fillStyle = '#22d3ee';
          ctx.font = 'bold 12px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ LASER - DUCK! ⚡', obs.x + obs.width / 2, obs.y - 6);

        } else {
          // Stylized Low Tree Branch / Wooden Beam
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y + 4, obs.width, obs.height - 8, [8]);
          ctx.fill();
          ctx.stroke();

          // Green hanging leaves
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.arc(obs.x + 15, obs.y + obs.height, 10, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width * 0.5, obs.y + obs.height + 4, 12, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width - 15, obs.y + obs.height - 2, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Duck cue
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 13px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▼ DUCKEN! ▼', obs.x + obs.width / 2, obs.y - 6);
        }

      } else if (obs.type === 'fence') {
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
      } else if (obs.type === 'overhead') {
        // Overhead obstacle collision check:
        // Player standing height is ~110px, Ducking height is ~55px.
        // If the player's bounding box intersects the overhead box, collision occurs!
        // When ducking, player top (playerRect.y) is lower than the bottom of the overhead obstacle,
        // so no collision will trigger.
        if (
          playerRect.x + 6 < obs.x + obs.width &&
          playerRect.x + playerRect.width - 6 > obs.x &&
          playerRect.y < obs.y + obs.height &&
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
