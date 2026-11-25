import { ShopManager } from '../editor/shopData.js';
import { BankManager } from './bankData.js';
import { HomeManager } from '../home/homeData.js';
import { createRandomRiddle } from '../game/quickTimeEvent.js';
import { EarnMoneyManager, WHEEL_SEGMENTS } from './earnMoneyData.js';

export function setupEarnMoneyUI({ onCoinsChange } = {}) {
  const modal = document.getElementById('earn-money-modal');
  const closeBtn = document.getElementById('closeEarnModalBtn');
  const coinsValEl = document.getElementById('earnCoinsVal');
  const bankValEl = document.getElementById('earnBankVal');
  const toastEl = document.getElementById('earnToast');
  const tabsEl = document.getElementById('earnTabs');
  const bodyEl = document.getElementById('earnTabBody');

  const openButtons = [
    document.getElementById('openEarnEditorBtn'),
    document.getElementById('openEarnTownBtn'),
    document.getElementById('openEarnHomeBtn'),
    document.getElementById('openEarnBgBtn'),
    document.getElementById('openEarnIceBtn'),
    document.getElementById('openEarnPetBtn')
  ].filter(Boolean);

  let activeTab = 'missions';
  let toastTimer = null;

  // Wheel animation state
  let wheelAngle = 0;
  let isSpinning = false;
  let wheelRaf = null;

  // Treasure hunt mini-game state
  let treasureTimer = null;
  let treasureSpawnTimer = null;
  let treasureActive = false;
  let treasureTimeLeft = 0;
  let treasureEarned = 0;

  // Quiz state
  const usedQuizRiddles = new Set();
  let currentQuizRiddle = null;
  let quizAnswered = false;

  function notifyGlobalCoins() {
    if (coinsValEl) {
      coinsValEl.textContent = ShopManager.getCoins();
    }
    if (bankValEl) {
      bankValEl.textContent = BankManager.getBalance();
    }
    updateEarnBadges();
    if (typeof onCoinsChange === 'function') {
      onCoinsChange();
    }
  }

  function updateEarnBadges() {
    const readyCount = EarnMoneyManager.getReadyBadgeCount();
    openButtons.forEach((btn) => {
      let badge = btn.querySelector('.earn-ready-dot');
      if (readyCount > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'earn-ready-dot';
          btn.appendChild(badge);
        }
        badge.textContent = String(readyCount);
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3000);
  }

  function stopMiniGames() {
    if (wheelRaf) {
      cancelAnimationFrame(wheelRaf);
      wheelRaf = null;
    }
    isSpinning = false;

    if (treasureTimer) {
      clearInterval(treasureTimer);
      treasureTimer = null;
    }
    if (treasureSpawnTimer) {
      clearInterval(treasureSpawnTimer);
      treasureSpawnTimer = null;
    }
    if (treasureActive && treasureEarned > 0) {
      EarnMoneyManager.awardTreasureCoins(treasureEarned);
      notifyGlobalCoins();
    }
    treasureActive = false;
    treasureEarned = 0;
  }

  function openModal(initialTab = 'missions') {
    if (!modal) return;
    activeTab = initialTab;
    currentQuizRiddle = null;
    quizAnswered = false;
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (bankValEl) bankValEl.textContent = BankManager.getBalance();
    renderTabs();
    renderActiveTab();
    modal.classList.remove('hidden');
  }

  function closeModal() {
    stopMiniGames();
    if (modal) modal.classList.add('hidden');
    notifyGlobalCoins();
  }

  function renderTabs() {
    if (!tabsEl) return;
    const state = EarnMoneyManager.getState();
    const readyMissions = EarnMoneyManager.getMissionsView().filter((m) => m.ready).length;

    const tabs = [
      {
        id: 'missions',
        label: readyMissions > 0 ? `📋 Missionen (${readyMissions})` : '📋 Missionen'
      },
      {
        id: 'wheel',
        label: state.wheelTickets > 0 ? `🎡 Glücksrad (${state.wheelTickets})` : '🎡 Glücksrad'
      },
      { id: 'treasure', label: '🪙 Schatzjagd' },
      { id: 'quiz', label: '🧠 Blitz-Quiz' }
    ];

    tabsEl.innerHTML = '';
    tabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `earn-tab-btn${activeTab === tab.id ? ' active' : ''}`;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => {
        if (isSpinning) return;
        stopMiniGames();
        activeTab = tab.id;
        renderTabs();
        renderActiveTab();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderActiveTab() {
    if (!bodyEl) return;
    if (activeTab === 'missions') {
      renderMissionsTab();
    } else if (activeTab === 'wheel') {
      renderWheelTab();
    } else if (activeTab === 'treasure') {
      renderTreasureTab();
    } else if (activeTab === 'quiz') {
      renderQuizTab();
    }
  }

  // --- TAB 1: MISSIONS ---
  function renderMissionsTab() {
    const missions = EarnMoneyManager.getMissionsView();
    bodyEl.innerHTML = `
      <p class="earn-intro">Erledige Aufgaben beim Rennen &amp; im Haus, um fette Spielgeld-Belohnungen abzuholen!</p>
      <div class="missions-list"></div>
    `;
    const listEl = bodyEl.querySelector('.missions-list');

    missions.forEach((m) => {
      const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
      const card = document.createElement('div');
      card.className = `mission-card${m.ready ? ' ready' : ''}`;
      card.innerHTML = `
        <div class="mission-main">
          <div class="mission-title-row">
            <span class="mission-icon">${m.icon}</span>
            <div>
              <strong>${m.title}</strong>
              <p>${m.desc}</p>
            </div>
          </div>
          <div class="mission-bar-wrap">
            <div class="mission-bar-track">
              <div class="mission-bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="mission-progress-text">${m.progress} / ${m.target}</span>
          </div>
        </div>
        <div class="mission-action">
          ${m.ready
            ? `<button type="button" class="btn btn-small btn-claim">🎁 +${m.reward} 🪙</button>`
            : `<span class="mission-reward-tag">+${m.reward} 🪙</span>`
          }
        </div>
      `;

      const claimBtn = card.querySelector('.btn-claim');
      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          const res = EarnMoneyManager.claimMission(m.id);
          if (res.ok) {
            showToast(`🎉 Aufgabe erledigt! +${res.reward} 🪙 erhalten — neue Stufe ${res.newTier} gestartet!`, 'success');
            notifyGlobalCoins();
            renderTabs();
            renderMissionsTab();
          }
        });
      }

      listEl.appendChild(card);
    });
  }

  // --- TAB 2: LUCKY WHEEL ---
  function drawWheel(ctx, size, angle) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 12;
    const slice = (Math.PI * 2) / WHEEL_SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);

    WHEEL_SEGMENTS.forEach((seg, i) => {
      const start = angle + i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + slice / 2);
      ctx.fillStyle = seg.textColor || '#ffffff';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(seg.label, radius - 14, 0);
      ctx.restore();
    });

    // Outer glossy rim
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 22);
    hubGrad.addColorStop(0, '#f472b6');
    hubGrad.addColorStop(1, '#7c3aed');
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', cx, cy + 1);
  }

  function renderWheelTab() {
    const state = EarnMoneyManager.getState();
    bodyEl.innerHTML = `
      <div class="wheel-section">
        <div class="wheel-info-row">
          <span class="earn-stat-pill">🎫 Dreh-Tickets: <strong id="wheelTicketsCount">${state.wheelTickets}</strong> / 5</span>
          <span class="earn-hint-text">Jeder Lauf ab 40 m gibt +1 Ticket (oder alle 2 Min gratis!)</span>
        </div>
        <div class="wheel-stage">
          <div class="wheel-pointer">▼</div>
          <canvas id="luckyWheelCanvas" width="260" height="260"></canvas>
        </div>
        <button type="button" id="spinWheelBtn" class="btn btn-primary btn-large" ${state.wheelTickets <= 0 ? 'disabled' : ''}>
          ${state.wheelTickets > 0 ? '🎡 Glücksrad drehen!' : '⏳ Keine Tickets (Lauf spielen oder kurz warten)'}
        </button>
      </div>
    `;

    const canvas = document.getElementById('luckyWheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinWheelBtn');
    const ticketsEl = document.getElementById('wheelTicketsCount');

    drawWheel(ctx, canvas.width, wheelAngle);

    spinBtn.addEventListener('click', () => {
      if (isSpinning) return;
      const res = EarnMoneyManager.spinWheel();
      if (!res.ok) {
        showToast('⏳ Keine Tickets mehr! Spiele ein Rennen (ab 40 m) für +1 Ticket.', 'warn');
        return;
      }

      if (res.segment.supply) {
        HomeManager.addSupply(res.segment.supply, 1);
      }

      isSpinning = true;
      spinBtn.disabled = true;
      if (ticketsEl) ticketsEl.textContent = res.ticketsLeft;

      // Pointer sits at -Math.PI / 2 (top). Compute exact target angle for res.index center.
      const slice = (Math.PI * 2) / WHEEL_SEGMENTS.length;
      const segmentCenter = (res.index + 0.5) * slice;
      const desiredFinalMod = ((-Math.PI / 2) - segmentCenter) % (Math.PI * 2);
      const currentMod = wheelAngle % (Math.PI * 2);
      let delta = desiredFinalMod - currentMod;
      if (delta < 0) delta += Math.PI * 2;
      const totalSpin = Math.PI * 2 * 5 + delta;

      const startAngle = wheelAngle;
      const startTime = performance.now();
      const duration = 2600;

      const animate = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        wheelAngle = startAngle + totalSpin * eased;
        drawWheel(ctx, canvas.width, wheelAngle);

        if (t < 1) {
          wheelRaf = requestAnimationFrame(animate);
        } else {
          isSpinning = false;
          wheelRaf = null;
          notifyGlobalCoins();
          renderTabs();
          const bonusTxt = res.segment.supplyLabel ? ` & ${res.segment.supplyLabel}` : '';
          showToast(
            res.segment.jackpot
              ? `🎊 JACKPOT! +${res.segment.coins} 🪙 auf dein 🏦 Bankkonto überwiesen!`
              : `🎡 Gewonnen: +${res.segment.coins} 🪙${bonusTxt} (auf dein 🏦 Bankkonto)!`,
            'success'
          );
          if (res.ticketsLeft > 0) {
            spinBtn.disabled = false;
            spinBtn.textContent = '🎡 Nochmal drehen!';
          } else {
            spinBtn.disabled = true;
            spinBtn.textContent = '⏳ Keine Tickets (Lauf spielen oder kurz warten)';
          }
        }
      };

      wheelRaf = requestAnimationFrame(animate);
    });
  }

  // --- TAB 3: TREASURE HUNT MINI-GAME ---
  function renderTreasureTab() {
    const cooldownMs = EarnMoneyManager.getTreasureCooldownLeftMs();
    const cooldownSec = Math.ceil(cooldownMs / 1000);

    bodyEl.innerHTML = `
      <div class="treasure-section">
        <div class="treasure-hud">
          <span class="earn-stat-pill">⏱️ Zeit: <strong id="treasureTimeVal">15</strong>s</span>
          <span class="earn-stat-pill">💰 Beute: <strong id="treasureLootVal">0</strong> 🪙</span>
        </div>
        <div id="treasureBoard" class="treasure-board">
          <div class="treasure-overlay-msg" id="treasureOverlay">
            <p>Tippe in 15 Sekunden auf 🪙, 💎 &amp; 💰! Aber Finger weg von 🥾!</p>
            <button type="button" id="startTreasureBtn" class="btn btn-primary" ${cooldownSec > 0 ? 'disabled' : ''}>
              ${cooldownSec > 0 ? `⏳ Bereit in ${cooldownSec}s (oder Lauf beenden)` : '🪙 Schatzjagd starten!'}
            </button>
          </div>
        </div>
      </div>
    `;

    const startBtn = document.getElementById('startTreasureBtn');
    const board = document.getElementById('treasureBoard');
    const overlay = document.getElementById('treasureOverlay');
    const timeEl = document.getElementById('treasureTimeVal');
    const lootEl = document.getElementById('treasureLootVal');

    if (cooldownSec > 0) {
      const waitInt = setInterval(() => {
        if (activeTab !== 'treasure' || !document.body.contains(startBtn)) {
          clearInterval(waitInt);
          return;
        }
        const left = Math.ceil(EarnMoneyManager.getTreasureCooldownLeftMs() / 1000);
        if (left <= 0) {
          clearInterval(waitInt);
          startBtn.disabled = false;
          startBtn.textContent = '🪙 Schatzjagd starten!';
        } else {
          startBtn.textContent = `⏳ Bereit in ${left}s (oder Lauf beenden)`;
        }
      }, 1000);
    }

    startBtn.addEventListener('click', () => {
      if (treasureActive) return;
      treasureActive = true;
      treasureTimeLeft = 15;
      treasureEarned = 0;
      EarnMoneyManager.startTreasureCooldown();
      overlay.classList.add('hidden');
      if (timeEl) timeEl.textContent = '15';
      if (lootEl) lootEl.textContent = '0';

      const spawnTarget = () => {
        if (!treasureActive || !board) return;
        const roll = Math.random();
        let item;
        if (roll < 0.45) item = { icon: '🪙', value: 1, label: '+1' };
        else if (roll < 0.68) item = { icon: '🍀', value: 2, label: '+2' };
        else if (roll < 0.84) item = { icon: '💎', value: 3, label: '+3' };
        else if (roll < 0.91) item = { icon: '💰', value: 5, label: '+5' };
        else item = { icon: '🥾', value: -2, label: '-2', bad: true };

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `treasure-target${item.bad ? ' bad' : ''}`;
        btn.textContent = item.icon;
        btn.style.left = `${8 + Math.random() * 80}%`;
        btn.style.top = `${10 + Math.random() * 72}%`;

        let clicked = false;
        btn.addEventListener('click', () => {
          if (clicked || !treasureActive) return;
          clicked = true;
          treasureEarned = Math.max(0, treasureEarned + item.value);
          if (lootEl) lootEl.textContent = String(treasureEarned);
          btn.textContent = `${item.label} 🪙`;
          btn.classList.add('popped');
          setTimeout(() => btn.remove(), 300);
        });

        board.appendChild(btn);
        setTimeout(() => {
          if (!clicked) btn.remove();
        }, 1650);
      };

      spawnTarget();
      treasureSpawnTimer = setInterval(spawnTarget, 480);

      treasureTimer = setInterval(() => {
        treasureTimeLeft--;
        if (timeEl) timeEl.textContent = String(Math.max(0, treasureTimeLeft));
        if (treasureTimeLeft <= 0) {
          const finalLoot = treasureEarned;
          treasureEarned = 0;
          treasureActive = false;
          clearInterval(treasureTimer);
          clearInterval(treasureSpawnTimer);
          treasureTimer = null;
          treasureSpawnTimer = null;

          board.querySelectorAll('.treasure-target').forEach((n) => n.remove());
          if (finalLoot > 0) {
            EarnMoneyManager.awardTreasureCoins(finalLoot);
            notifyGlobalCoins();
            showToast(`🪙 Super gesammelt! +${finalLoot} 🪙 auf dein 🏦 Bankkonto!`, 'success');
          } else {
            showToast('😅 Diesmal leider nichts eingesammelt — gleich nochmal probieren!', 'info');
          }
          renderTreasureTab();
        }
      }, 1000);
    });
  }

  // --- TAB 4: BLITZ-QUIZ ---
  function renderQuizTab() {
    const state = EarnMoneyManager.getState();
    if (!currentQuizRiddle) {
      currentQuizRiddle = createRandomRiddle(usedQuizRiddles);
      quizAnswered = false;
    }

    bodyEl.innerHTML = `
      <div class="quiz-section">
        <div class="wheel-info-row">
          <span class="earn-stat-pill">⚡ Quiz-Energie: <strong id="quizEnergyVal">${state.quizEnergy}</strong> / 3</span>
          <span class="earn-stat-pill">🔥 Serie: <strong>${state.quizStreak || 0}</strong> (alle 3: +4 🪙 Bonus!)</span>
        </div>
        ${state.quizEnergy <= 0 && !quizAnswered ? `
          <div class="quiz-empty-box">
            <p>⏳ Quiz-Energie wird aufgeladen (alle 45s +1) — oder starte kurz ein Rennen, um sofort voll aufzuladen!</p>
          </div>
        ` : `
          <div class="quiz-card">
            <div class="quiz-question">${currentQuizRiddle.prompt}</div>
            <div class="quiz-options"></div>
            <div id="quizResultBanner" class="quiz-result hidden"></div>
            <button type="button" id="nextQuizBtn" class="btn btn-primary hidden">➔ Nächstes Rätsel (+6 🪙 auf die 🏦 Bank)</button>
          </div>
        `}
      </div>
    `;

    const optsEl = bodyEl.querySelector('.quiz-options');
    const resultEl = document.getElementById('quizResultBanner');
    const nextBtn = document.getElementById('nextQuizBtn');

    if (!optsEl) return;

    currentQuizRiddle.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<span>${opt.icon}</span> <strong>${opt.text}</strong>`;
      btn.disabled = quizAnswered;

      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        const isCorrect = opt.id === currentQuizRiddle.correctId;
        const res = EarnMoneyManager.answerQuiz(isCorrect);
        if (!res.ok) {
          renderQuizTab();
          return;
        }
        quizAnswered = true;

        optsEl.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
          b.disabled = true;
          if (currentQuizRiddle.options[idx].id === currentQuizRiddle.correctId) {
            b.classList.add('correct');
          }
        });
        if (!isCorrect) btn.classList.add('wrong');

        if (resultEl) {
          resultEl.classList.remove('hidden');
          if (isCorrect) {
            resultEl.className = 'quiz-result success';
            resultEl.textContent = res.streakBonus > 0
              ? `🎉 Richtig! +${res.coinsEarned} 🪙 & +${res.streakBonus} 🪙 auf dein 🏦 Bankkonto!`
              : `🎉 Richtig! +${res.coinsEarned} 🪙 auf dein 🏦 Bankkonto!`;
          } else {
            resultEl.className = 'quiz-result fail';
            resultEl.textContent = '❌ Leider knapp daneben! Beim nächsten klappt’s!';
          }
        }

        const energyValEl = document.getElementById('quizEnergyVal');
        if (energyValEl) energyValEl.textContent = res.energyLeft;

        notifyGlobalCoins();
        renderTabs();

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
          if (res.energyLeft <= 0) {
            nextBtn.textContent = '⏳ Energie leer (45s warten oder Rennen starten)';
            nextBtn.disabled = true;
          }
        }
      });

      optsEl.appendChild(btn);
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuizRiddle = createRandomRiddle(usedQuizRiddles);
        quizAnswered = false;
        renderQuizTab();
      });
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => openModal('missions'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  updateEarnBadges();

  return {
    openModal,
    refreshBadges: updateEarnBadges
  };
}
