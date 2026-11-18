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
        if (theme === 'cave') {
          const rockGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          rockGrad.addColorStop(0, '#c084fc');
          rockGrad.addColorStop(1, '#7e22ce');
          ctx.fillStyle = rockGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height * 0.72, [10]);
          ctx.fill();

          const teeth = 4;
          const toothWidth = obs.width / teeth;
          for (let i = 0; i < teeth; i++) {
            const cGrad = ctx.createLinearGradient(0, obs.y + obs.height * 0.65, 0, obs.y + obs.height + 6);
            cGrad.addColorStop(0, '#e879f9');
            cGrad.addColorStop(1, '#67e8f9');
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.moveTo(obs.x + i * toothWidth, obs.y + obs.height * 0.7);
            ctx.lineTo(obs.x + (i + 0.5) * toothWidth, obs.y + obs.height + 6);
            ctx.lineTo(obs.x + (i + 1) * toothWidth, obs.y + obs.height * 0.7);
            ctx.closePath();
            ctx.fill();
          }

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▼ DUCKEN! ▼', obs.x + obs.width / 2, obs.y - 6);

        } else if (theme === 'neon') {
          ctx.save();
          ctx.shadowColor = '#f472b6';
          ctx.shadowBlur = 18;
          const beamGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y);
          beamGrad.addColorStop(0, '#f472b6');
          beamGrad.addColorStop(0.5, '#38bdf8');
          beamGrad.addColorStop(1, '#c084fc');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y + obs.height * 0.32, obs.width, 16, [8]);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + obs.height * 0.32 + 4, obs.width - 8, 6, [4]);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#67e8f9';
          ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✨ LASER - DUCKEN! ✨', obs.x + obs.width / 2, obs.y - 6);

        } else if (theme === 'ice') {
          const iceGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          iceGrad.addColorStop(0, '#ffffff');
          iceGrad.addColorStop(0.45, '#7dd3fc');
          iceGrad.addColorStop(1, '#38bdf8');
          ctx.fillStyle = iceGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height * 0.75, [12]);
          ctx.fill();

          ctx.fillStyle = '#e0f2fe';
          for (let i = 0; i < 4; i++) {
            const tw = obs.width / 4;
            ctx.beginPath();
            ctx.moveTo(obs.x + i * tw, obs.y + obs.height * 0.75);
            ctx.lineTo(obs.x + (i + 0.5) * tw, obs.y + obs.height + 8);
            ctx.lineTo(obs.x + (i + 1) * tw, obs.y + obs.height * 0.75);
            ctx.closePath();
            ctx.fill();
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('❄️ DUCKEN! ❄️', obs.x + obs.width / 2, obs.y - 6);

        } else if (theme === 'space') {
          const spaceGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
          spaceGrad.addColorStop(0, '#c084fc');
          spaceGrad.addColorStop(1, '#6366f1');
          ctx.fillStyle = spaceGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height * 0.82, [14]);
          ctx.fill();

          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.roundRect(obs.x + 8, obs.y + 10, obs.width - 16, 10, [5]);
          ctx.fill();

          ctx.fillStyle = '#a5f3fc';
          ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛸 DUCKEN! 🛸', obs.x + obs.width / 2, obs.y - 6);

        } else if (theme === 'candy') {
          const candyGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          candyGrad.addColorStop(0, '#f9a8d4');
          candyGrad.addColorStop(1, '#ec4899');
          ctx.fillStyle = candyGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height * 0.85, [14]);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 12, obs.y + 4, 10, obs.height * 0.74, [5]);
          ctx.roundRect(obs.x + obs.width - 22, obs.y + 4, 10, obs.height * 0.74, [5]);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🍬 DUCKEN! 🍬', obs.x + obs.width / 2, obs.y - 6);

        } else {
          // Lush Blossoming Branch / Pastel Dream Arch (meadow & beach)
          const branchGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          branchGrad.addColorStop(0, theme === 'beach' ? '#fb923c' : '#d97706');
          branchGrad.addColorStop(1, theme === 'beach' ? '#ea580c' : '#92400e');
          ctx.fillStyle = branchGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y + 4, obs.width, obs.height - 8, [12]);
          ctx.fill();

          const leafGrad = ctx.createRadialGradient(obs.x + obs.width * 0.4, obs.y + obs.height - 4, 4, obs.x + obs.width * 0.5, obs.y + obs.height, 34);
          leafGrad.addColorStop(0, theme === 'beach' ? '#6ee7b7' : '#f9a8d4');
          leafGrad.addColorStop(1, theme === 'beach' ? '#10b981' : '#ec4899');
          ctx.fillStyle = leafGrad;
          ctx.beginPath();
          ctx.arc(obs.x + 15, obs.y + obs.height, 11, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width * 0.5, obs.y + obs.height + 4, 13, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width - 15, obs.y + obs.height - 2, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▼ DUCKEN! ▼', obs.x + obs.width / 2, obs.y - 6);
        }

      } else if (obs.type === 'fence') {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.width / 2, obs.y + obs.height + 2, obs.width * 0.56, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (theme === 'cave') {
          const spikeGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
          spikeGrad.addColorStop(0, '#fb7185');
          spikeGrad.addColorStop(1, '#be185d');
          ctx.fillStyle = spikeGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [10]);
          ctx.fill();

          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.moveTo(obs.x + 2, obs.y + 2);
          ctx.lineTo(obs.x + obs.width / 2, obs.y - 12);
          ctx.lineTo(obs.x + obs.width - 2, obs.y + 2);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + 5, 7, obs.height - 10, [4]);
          ctx.fill();

        } else if (theme === 'neon') {
          const neonGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          neonGrad.addColorStop(0, '#38bdf8');
          neonGrad.addColorStop(1, '#ec4899');
          ctx.save();
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#f472b6';
          ctx.fillStyle = neonGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [10]);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = 'rgba(255,255,255,0.78)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 5, obs.y + 8, obs.width - 10, 6, [3]);
          ctx.roundRect(obs.x + 5, obs.y + obs.height - 14, obs.width - 10, 6, [3]);
          ctx.fill();

        } else if (theme === 'ice') {
          const iceBar = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
          iceBar.addColorStop(0, '#ffffff');
          iceBar.addColorStop(0.4, '#bae6fd');
          iceBar.addColorStop(1, '#38bdf8');
          ctx.fillStyle = iceBar;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [10]);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + 4, obs.width - 8, 10, [5]);
          ctx.fill();
        } else if (theme === 'space') {
          const astGrad = ctx.createRadialGradient(obs.x + 12, obs.y + 12, 3, obs.x + obs.width / 2, obs.y + obs.height / 2, obs.height);
          astGrad.addColorStop(0, '#e879f9');
          astGrad.addColorStop(1, '#6366f1');
          ctx.fillStyle = astGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [14]);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(obs.x + 12, obs.y + 14, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme === 'candy') {
          const cGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
          cGrad.addColorStop(0, '#f472b6');
          cGrad.addColorStop(1, '#db2777');
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [12]);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + 8, obs.width - 8, 7, [3]);
          ctx.roundRect(obs.x + 4, obs.y + 24, obs.width - 8, 7, [3]);
          ctx.fill();
        } else {
          // Colorful Glossy Pastel/Gold Dream Hurdle (meadow & beach)
          const hurdleGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
          hurdleGrad.addColorStop(0, theme === 'beach' ? '#fb7185' : '#f472b6');
          hurdleGrad.addColorStop(1, theme === 'beach' ? '#e11d48' : '#db2777');
          ctx.fillStyle = hurdleGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [12]);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + 8, obs.width - 8, 8, [4]);
          ctx.roundRect(obs.x + 4, obs.y + obs.height - 16, obs.width - 8, 8, [4]);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.roundRect(obs.x + 4, obs.y + 4, 6, obs.height - 8, [3]);
          ctx.fill();
        }

      } else if (obs.type === 'pit') {
        const pitGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
        pitGrad.addColorStop(0, theme === 'candy' ? '#831843' : '#312e81');
        pitGrad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = pitGrad;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [0, 0, 12, 12]);
        ctx.fill();

        if (theme === 'cave') {
          ctx.fillStyle = '#fb7185';
          ctx.fillRect(obs.x, obs.y, obs.width, 10);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(obs.x, obs.y + 10, obs.width, 4);
        } else if (theme === 'neon') {
          ctx.save();
          ctx.fillStyle = '#f472b6';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#f472b6';
          ctx.fillRect(obs.x, obs.y, obs.width, 8);
          ctx.restore();
        } else {
          ctx.fillStyle = theme === 'beach' ? '#fde047' : theme === 'candy' ? '#f9a8d4' : '#34d399';
          ctx.beginPath();
          ctx.roundRect(obs.x - 4, obs.y, 10, 14, [4]);
          ctx.roundRect(obs.x + obs.width - 6, obs.y, 10, 14, [4]);
          ctx.fill();
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

  hasObstacleNearPlayer(playerX) {
    for (const obs of this.obstacles) {
      if (obs.x + obs.width > playerX - 70 && obs.x < playerX + 150) {
        return true;
      }
    }
    return false;
  }
}

export class CoinManager {
  constructor() {
    this.coins = [];
    this.spawnTimer = 0;
    this.animFrame = 0;
  }

  reset() {
    this.coins = [];
    this.spawnTimer = 0;
    this.animFrame = 0;
  }

  update(speed, canvasWidth, groundY, playerCenter, magnetActive) {
    this.animFrame++;
    this.spawnTimer++;

    if (this.spawnTimer > 55 + Math.random() * 45) {
      this.spawnTimer = 0;
      this.spawnCoinGroup(canvasWidth, groundY);
    }

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];

      if (magnetActive && playerCenter) {
        const dx = playerCenter.x - c.x;
        const dy = playerCenter.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 1) {
          const pull = 10;
          c.x += (dx / dist) * pull;
          c.y += (dy / dist) * pull;
        } else {
          c.x -= speed;
        }
      } else {
        c.x -= speed;
      }

      if (c.x < -40) {
        this.coins.splice(i, 1);
      }
    }
  }

  spawnCoinGroup(canvasWidth, groundY) {
    const pattern = Math.random();
    const startX = canvasWidth + 30;

    if (pattern < 0.45) {
      // Ground row of 3 gold coins
      for (let i = 0; i < 3; i++) {
        this.coins.push({
          x: startX + i * 42,
          y: groundY - 26,
          radius: 14,
          value: 5,
          kind: 'gold'
        });
      }
    } else if (pattern < 0.78) {
      // Jump arc of 3 coins
      const offsets = [0, -45, 0];
      for (let i = 0; i < 3; i++) {
        this.coins.push({
          x: startX + i * 44,
          y: groundY - 85 + offsets[i],
          radius: 14,
          value: 5,
          kind: 'gold'
        });
      }
    } else if (pattern < 0.93) {
      // Rare high diamond coin (+15)
      this.coins.push({
        x: startX,
        y: groundY - 125,
        radius: 16,
        value: 15,
        kind: 'gem'
      });
    } else {
      // Super rare Golden Bonus Chest (+30)
      this.coins.push({
        x: startX,
        y: groundY - 95,
        radius: 18,
        value: 30,
        kind: 'chest'
      });
    }
  }

  spawnRainCoin(x, y) {
    this.coins.push({
      x,
      y,
      radius: 14,
      value: 5,
      kind: 'gold'
    });
  }

  checkPickups(playerRect) {
    let gained = 0;
    const picked = [];
    const px = playerRect.x + playerRect.width / 2;
    const py = playerRect.y + playerRect.height / 2;

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      const hitX = Math.abs(px - c.x) < playerRect.width * 0.65 + c.radius;
      const hitY = Math.abs(py - c.y) < playerRect.height * 0.55 + c.radius;
      if (hitX && hitY) {
        gained += c.value;
        picked.push({ x: c.x, y: c.y, value: c.value, kind: c.kind });
        this.coins.splice(i, 1);
      }
    }
    return { gained, picked };
  }

  draw(ctx) {
    const pulse = Math.sin(this.animFrame * 0.14);
    this.coins.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y + pulse * 3);

      if (c.kind === 'chest') {
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 18;
        const chestGrad = ctx.createLinearGradient(-16, -12, 16, 12);
        chestGrad.addColorStop(0, '#f472b6');
        chestGrad.addColorStop(1, '#be185d');
        ctx.fillStyle = chestGrad;
        ctx.beginPath();
        ctx.roundRect(-16, -12, 32, 24, [8]);
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.fillRect(-16, -4, 32, 6);
        ctx.beginPath();
        ctx.roundRect(-4, -8, 8, 12, [3]);
        ctx.fill();

        ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText('+30', 0, -18);
      } else if (c.kind === 'gem') {
        const gemGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, 16);
        gemGrad.addColorStop(0, '#ffffff');
        gemGrad.addColorStop(0.45, '#67e8f9');
        gemGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = gemGrad;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(13, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(-13, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 8);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        const scaleX = 0.74 + Math.abs(Math.sin(this.animFrame * 0.1 + c.x * 0.02)) * 0.26;
        ctx.scale(scaleX, 1);

        const coinGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, c.radius);
        coinGrad.addColorStop(0, '#fef9c3');
        coinGrad.addColorStop(0.55, '#fbbf24');
        coinGrad.addColorStop(1, '#d97706');
        ctx.shadowColor = 'rgba(251, 191, 36, 0.45)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = coinGrad;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(-3, -3, c.radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 1);
      }

      ctx.restore();
    });
  }
}
