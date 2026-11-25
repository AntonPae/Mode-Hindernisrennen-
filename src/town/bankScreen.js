import { PlayerConfig } from '../editor/characterData.js';
import { renderCharacter } from '../editor/characterRenderer.js';
import { ShopManager } from '../editor/shopData.js';
import { BankManager } from '../economy/bankData.js';
import { PetFollowerController } from '../home/petCompanion.js';
import { drawCanvasSpeechBubble } from '../social/canvasSpeech.js';
import { askPersonAI } from '../social/socialData.js';
import { mountTalkPanel } from '../social/talkPanel.js';

const BANKER = {
  id: 'banker_muenz',
  name: 'Bankerin Frau Münz',
  icon: '🏦',
  role: 'Leiterin der Traum-Bank',
  x: 520,
  y: 215,
  charConfig: {
    body: { height: 1.0, width: 1.0, faceId: 'face_6', hairId: 'hair_3', hairColor: '#451a03' },
    clothes: {
      top: { style: 'jacket', color: '#0369a1', stickers: [{ type: 'star', x: 0, y: 0.45, scale: 1 }] },
      pants: { style: 'jeans', color: '#0f172a' },
      shoes: { style: 'boots', color: '#1e293b' }
    }
  }
};

function formatTxTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function setupBankScreen(stateManager) {
  const canvas = document.getElementById('bankCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const bankCoinsWalletEl = document.getElementById('bankWalletHeaderVal');
  const bankBalanceHeaderEl = document.getElementById('bankBalanceHeaderVal');
  const bankCardBalanceEl = document.getElementById('bankCardBalanceVal');
  const bankCardWalletEl = document.getElementById('bankCardWalletVal');
  const bankCustomInput = document.getElementById('bankCustomAmountInput');
  const bankWithdrawCustomBtn = document.getElementById('bankWithdrawCustomBtn');
  const bankDepositCustomBtn = document.getElementById('bankDepositCustomBtn');
  const bankTxListEl = document.getElementById('bankTxList');
  const statusEl = document.getElementById('bankStatusText');
  const toastEl = document.getElementById('bankToast');

  const bankResetTriggerBtn = document.getElementById('bankResetChallengeBtn');
  const bankResetConfirmBox = document.getElementById('bankResetConfirmBox');
  const bankResetConfirmYesBtn = document.getElementById('bankResetConfirmYesBtn');
  const bankResetConfirmNoBtn = document.getElementById('bankResetConfirmNoBtn');

  const walkLeftBtn = document.getElementById('bankWalkLeftBtn');
  const walkRightBtn = document.getElementById('bankWalkRightBtn');
  const walkUpBtn = document.getElementById('bankWalkUpBtn');
  const walkDownBtn = document.getElementById('bankWalkDownBtn');
  const actionBtn = document.getElementById('bankActionBtn');

  const backTownBtn = document.getElementById('bankToTownBtn');
  const toHomeBtn = document.getElementById('bankToHomeBtn');

  let rafId = null;
  let animFrame = 0;
  let toastTimer = null;
  let bankerBubble = 'Willkommen in der 🏦 Traum-Bank! Hier kannst du Geld abheben oder einzahlen.';
  let bankerBubbleTimer = 140;

  const player = {
    x: 155,
    y: 315,
    facing: 1,
    targetX: null,
    targetY: null,
    pendingCallback: null,
    pose: 'idle',
    poseTimer: 0,
    speechText: '',
    speechTimer: 0
  };

  const petFollowers = new PetFollowerController();
  const fxParticles = [];
  const keys = { left: false, right: false, up: false, down: false };
  const holdPad = { left: false, right: false, up: false, down: false };

  const talkPanel = mountTalkPanel({
    mountId: 'bankTalkMount',
    getTargets: () => [
      { id: BANKER.id, name: BANKER.name, icon: BANKER.icon, role: BANKER.role, kind: 'shopkeeper' }
    ],
    getSceneContext: () => ({ scene: 'bank', bankBalance: BankManager.getBalance() }),
    onPersonReply: (target, res, spokenText) => {
      player.speechText = spokenText;
      player.speechTimer = 120;
      bankerBubble = res.bubble;
      bankerBubbleTimer = 160;
    },
    onPetCommand: (_petId, petMeta, text) => {
      player.speechText = text;
      player.speechTimer = 105;
      if (statusEl) statusEl.textContent = `${petMeta.icon} ${petMeta.name} wartet brav in der Bank!`;
    }
  });

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3000);
  }

  function spawnFX(color, x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      fxParticles.push({
        x: x + (Math.random() - 0.5) * 26,
        y: y + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * 2.4,
        vy: -1.4 - Math.random() * 2.0,
        color,
        life: 36 + Math.floor(Math.random() * 14)
      });
    }
  }

  function refreshUI() {
    const bankBal = BankManager.getBalance();
    const walletCoins = ShopManager.getCoins();
    if (bankCoinsWalletEl) bankCoinsWalletEl.textContent = walletCoins;
    if (bankBalanceHeaderEl) bankBalanceHeaderEl.textContent = bankBal;
    if (bankCardBalanceEl) bankCardBalanceEl.textContent = bankBal;
    if (bankCardWalletEl) bankCardWalletEl.textContent = walletCoins;

    document.querySelectorAll('[data-bank-withdraw]').forEach((btn) => {
      const val = btn.dataset.bankWithdraw;
      if (val === 'all') {
        btn.disabled = bankBal <= 0;
      } else {
        btn.disabled = bankBal < Number(val);
      }
    });

    document.querySelectorAll('[data-bank-deposit]').forEach((btn) => {
      const val = btn.dataset.bankDeposit;
      if (val === 'all') {
        btn.disabled = walletCoins <= 0;
      } else {
        btn.disabled = walletCoins < Number(val);
      }
    });

    if (bankTxListEl) {
      const txs = BankManager.getTransactions();
      if (txs.length === 0) {
        bankTxListEl.innerHTML = '<div class="bank-tx-empty">Noch keine Kontobewegungen.</div>';
      } else {
        bankTxListEl.innerHTML = txs.slice(0, 12).map((tx) => {
          const sign = tx.kind === 'out' ? '−' : tx.kind === 'in' ? '+' : '⚖️';
          const cls = tx.kind === 'out' ? 'is-out' : tx.kind === 'in' ? 'is-in' : 'is-reset';
          return `
            <div class="bank-tx-item">
              <div class="bank-tx-meta">
                <strong>${tx.label}</strong>
                <span>${formatTxTime(tx.at)} Uhr</span>
              </div>
              <span class="bank-tx-amount ${cls}">${sign}${tx.amount} 🪙</span>
            </div>
          `;
        }).join('');
      }
    }
  }

  function handleWithdraw(rawAmount) {
    const bankBal = BankManager.getBalance();
    const amount = rawAmount === 'all' ? bankBal : Math.max(0, Math.floor(Number(rawAmount) || 0));
    if (amount <= 0) {
      showToast('Auf deinem Bankkonto ist gerade nichts zum Abheben!', 'info');
      return;
    }
    const res = BankManager.withdrawToWallet(amount);
    if (!res.ok) {
      showToast(`Auf dem Konto sind nur ${res.available || 0} 🪙 verfügbar!`, 'warn');
      return;
    }
    player.pose = 'pet';
    player.poseTimer = 26;
    bankerBubble = `Hier sind deine ${res.amount} 🪙 Bargeld!`;
    bankerBubbleTimer = 140;
    spawnFX('#fbbf24', player.x, player.y - 34, 14);
    refreshUI();
    showToast(`🏧 ${res.amount} 🪙 abgehoben! Du hast jetzt ${res.wallet} 🪙 Bargeld zum Einkaufen.`, 'success');
    if (statusEl) statusEl.textContent = `🏧 ${res.amount} 🪙 abgehoben! Jetzt ab in die Geschäfte auf der Einkaufsstraße.`;
  }

  function handleDeposit(rawAmount) {
    const wallet = ShopManager.getCoins();
    const amount = rawAmount === 'all' ? wallet : Math.max(0, Math.floor(Number(rawAmount) || 0));
    if (amount <= 0) {
      showToast('In deinem Portemonnaie ist gerade kein Bargeld zum Einzahlen!', 'info');
      return;
    }
    const res = BankManager.depositFromWallet(amount);
    if (!res.ok) {
      showToast(`Du hast nur ${res.available || 0} 🪙 Bargeld dabei!`, 'warn');
      return;
    }
    player.pose = 'pet';
    player.poseTimer = 26;
    bankerBubble = `Sicher auf dein Konto eingezahlt: +${res.amount} 🪙!`;
    bankerBubbleTimer = 140;
    spawnFX('#10b981', 520, 225, 12);
    refreshUI();
    showToast(`🏦 ${res.amount} 🪙 eingezahlt! Neuer Kontostand: ${res.bankBalance} 🪙.`, 'success');
  }

  document.querySelectorAll('[data-bank-withdraw]').forEach((btn) => {
    btn.addEventListener('click', () => handleWithdraw(btn.dataset.bankWithdraw));
  });
  document.querySelectorAll('[data-bank-deposit]').forEach((btn) => {
    btn.addEventListener('click', () => handleDeposit(btn.dataset.bankDeposit));
  });

  if (bankWithdrawCustomBtn && bankCustomInput) {
    bankWithdrawCustomBtn.addEventListener('click', () => {
      handleWithdraw(bankCustomInput.value);
    });
  }
  if (bankDepositCustomBtn && bankCustomInput) {
    bankDepositCustomBtn.addEventListener('click', () => {
      handleDeposit(bankCustomInput.value);
    });
  }

  if (bankResetTriggerBtn && bankResetConfirmBox) {
    bankResetTriggerBtn.addEventListener('click', () => {
      bankResetConfirmBox.classList.remove('hidden');
      bankResetTriggerBtn.classList.add('hidden');
    });
  }
  if (bankResetConfirmNoBtn && bankResetConfirmBox && bankResetTriggerBtn) {
    bankResetConfirmNoBtn.addEventListener('click', () => {
      bankResetConfirmBox.classList.add('hidden');
      bankResetTriggerBtn.classList.remove('hidden');
    });
  }
  if (bankResetConfirmYesBtn && bankResetConfirmBox && bankResetTriggerBtn) {
    bankResetConfirmYesBtn.addEventListener('click', () => {
      BankManager.resetMoneyForChallenge(25, 0);
      bankResetConfirmBox.classList.add('hidden');
      bankResetTriggerBtn.classList.remove('hidden');
      bankerBubble = 'Neustart aktiviert! Starte mit 25 🪙 Bargeld!';
      bankerBubbleTimer = 150;
      refreshUI();
      showToast('🔄 Zurückgesetzt! Du startest jetzt spannend mit 25 🪙 Bargeld & 0 🪙 auf der Bank.', 'success');
    });
  }

  function walkTo(tx, ty, callback = null) {
    player.targetX = Math.max(62, Math.min(795, tx));
    player.targetY = Math.max(246, Math.min(425, ty));
    player.pendingCallback = callback;
  }

  function leaveBankToTown() {
    stateManager.setState('TOWN', { from: 'BANK' });
  }

  if (backTownBtn) backTownBtn.addEventListener('click', leaveBankToTown);
  if (toHomeBtn) toHomeBtn.addEventListener('click', () => stateManager.setState('HOME', { room: 'living_room' }));

  const bindHold = (btn, dir) => {
    if (!btn) return;
    const on = (e) => {
      e.preventDefault();
      holdPad[dir] = true;
      player.targetX = null;
      player.targetY = null;
      player.pendingCallback = null;
    };
    const off = () => { holdPad[dir] = false; };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('pointercancel', off);
  };
  bindHold(walkLeftBtn, 'left');
  bindHold(walkRightBtn, 'right');
  bindHold(walkUpBtn, 'up');
  bindHold(walkDownBtn, 'down');

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (player.x < 105 && player.y < 290) {
        leaveBankToTown();
        return;
      }
      if (Math.abs(player.x - 245) < 85) {
        const bal = BankManager.getBalance();
        if (bal >= 25) {
          handleWithdraw(25);
        } else if (bal > 0) {
          handleWithdraw(bal);
        } else {
          showToast('Auf dem Konto ist noch 0 🪙 – arbeite im Café, beim Hundesitting oder lauf ein Rennen!', 'info');
        }
        return;
      }
      walkTo(520, 268, () => {
        bankerBubble = `Du hast ${BankManager.getBalance()} 🪙 auf dem Konto & ${ShopManager.getCoins()} 🪙 Bargeld!`;
        bankerBubbleTimer = 140;
        talkPanel.selectTarget(BANKER.id);
      });
    });
  }

  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

      const petTap = petFollowers.handleTap(cx, cy);
      if (petTap.hit) {
        player.pose = 'pet';
        player.poseTimer = 22;
        talkPanel.selectTarget(petTap.petId);
        return;
      }

      // Exit Door Left
      if (cx <= 96 && cy >= 100 && cy <= 268) {
        walkTo(74, 264, leaveBankToTown);
        return;
      }

      // ATM / Geldautomat (x ~ 245)
      if (cx >= 185 && cx <= 305 && cy >= 105 && cy <= 262) {
        walkTo(245, 262, () => {
          const bal = BankManager.getBalance();
          if (bal >= 25) handleWithdraw(25);
          else if (bal > 0) handleWithdraw(bal);
          else showToast('🏧 Geldautomat: Konto ist leer! Verdien erst Münzen in der Stadt oder beim Rennen.', 'info');
        });
        return;
      }

      // Banker Counter (x ~ 520)
      if (cx >= 430 && cx <= 610 && cy >= 100 && cy <= 265) {
        walkTo(520, 266, async () => {
          player.speechText = 'Hallo Frau Münz!';
          player.speechTimer = 110;
          bankerBubble = '💭 …';
          bankerBubbleTimer = 90;
          talkPanel.selectTarget(BANKER.id, `💭 ${BANKER.name} überlegt...`);
          const res = await askPersonAI(BANKER, 'Hallo! Wie läuft es in der Bank?', {
            scene: 'bank',
            bankBalance: BankManager.getBalance()
          });
          if (res.ok) {
            bankerBubble = res.bubble;
            bankerBubbleTimer = 160;
            talkPanel.selectTarget(BANKER.id, `${BANKER.icon} ${BANKER.name}: „${res.reply}“`);
          }
        });
        return;
      }

      // Vault / Tresor (x ~ 735)
      if (cx >= 665 && cy >= 105 && cy <= 265) {
        walkTo(725, 264, () => {
          showToast(`🔐 Im Traum-Tresor liegen sicher deine ${BankManager.getBalance()} 🪙!`, 'info');
        });
        return;
      }

      walkTo(cx, cy, null);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (stateManager.getState() !== 'BANK') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (document.querySelector('.modal:not(.hidden)')) return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      player.targetX = null;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      player.targetX = null;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = true;
      player.targetY = null;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      keys.down = true;
      player.targetY = null;
    } else if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (actionBtn) actionBtn.click();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  });

  function updateSimulation() {
    let mx = 0;
    let my = 0;
    if (keys.left || holdPad.left) mx -= 1;
    if (keys.right || holdPad.right) mx += 1;
    if (keys.up || holdPad.up) my -= 1;
    if (keys.down || holdPad.down) my += 1;

    const speed = 4.6;
    if (mx !== 0 || my !== 0) {
      const len = Math.hypot(mx, my) || 1;
      player.x = Math.max(62, Math.min(795, player.x + (mx / len) * speed));
      player.y = Math.max(246, Math.min(425, player.y + (my / len) * speed));
      if (mx !== 0) player.facing = Math.sign(mx);
      player.pose = 'walk';
    } else if (player.targetX !== null && player.targetY !== null) {
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= speed + 1) {
        player.x = player.targetX;
        player.y = player.targetY;
        player.targetX = null;
        player.targetY = null;
        player.pose = 'idle';
        if (player.pendingCallback) {
          const cb = player.pendingCallback;
          player.pendingCallback = null;
          cb();
        }
      } else {
        if (Math.abs(dx) > 1) player.facing = dx > 0 ? 1 : -1;
        player.x += (dx / dist) * speed;
        player.y += (dy / dist) * speed;
        player.pose = 'walk';
      }
    } else if (player.poseTimer > 0) {
      player.poseTimer--;
      if (player.poseTimer <= 0) player.pose = 'idle';
    } else {
      player.pose = 'idle';
    }

    if (player.speechTimer > 0) player.speechTimer--;
    if (bankerBubbleTimer > 0) bankerBubbleTimer--;
  }

  function drawScene() {
    if (!ctx || !canvas) return;
    animFrame++;
    updateSimulation();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Wall backdrop (Elegant Marble & Sky Blue)
    const wallG = ctx.createLinearGradient(0, 0, 0, 240);
    wallG.addColorStop(0, '#e0f2fe');
    wallG.addColorStop(1, '#f8fafc');
    ctx.fillStyle = wallG;
    ctx.fillRect(0, 0, w, 240);

    // Floor Tiles (Warm Cream & Light Slate Marble)
    const floorG = ctx.createLinearGradient(0, 240, 0, h);
    floorG.addColorStop(0, '#f1f5f9');
    floorG.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = floorG;
    ctx.fillRect(0, 240, w, h - 240);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;
    for (let fy = 240; fy <= h; fy += 38) {
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(w, fy);
      ctx.stroke();
    }
    for (let fx = 0; fx <= w; fx += 72) {
      ctx.beginPath();
      ctx.moveTo(fx, 240);
      ctx.lineTo(fx, h);
      ctx.stroke();
    }

    // Gold Trim Header Banner inside Bank
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, w, 16);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, 16, w, 5);

    // Exit Door (Left)
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(24, 96, 68, 144, [10, 10, 0, 0]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(28, 104, 60, 22, [6]);
    ctx.fill();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪 RAUS', 58, 115);

    // 1. ATM / Geldautomat (x ~ 245)
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(195, 86, 100, 154, [12, 12, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();
    // ATM Screen
    const screenG = ctx.createLinearGradient(208, 116, 282, 162);
    screenG.addColorStop(0, '#0ea5e9');
    screenG.addColorStop(1, '#38bdf8');
    ctx.fillStyle = screenG;
    ctx.beginPath();
    ctx.roundRect(208, 116, 74, 48, [6]);
    ctx.fill();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🏧 25 🪙', 245, 134);
    ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ABHEBEN', 245, 150);
    // Cash slot & keypad
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(216, 174, 58, 18);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.roundRect(218, 204, 54, 10, [4]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(190, 62, 110, 22, [10]);
    ctx.fill();
    ctx.fillStyle = '#0369a1';
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('💳 Geldautomat', 245, 73);
    ctx.restore();

    // 2. Bank Counter & Banker Frau Münz (x ~ 520)
    ctx.save();
    ctx.translate(BANKER.x, BANKER.y);
    ctx.scale(0.84, 0.84);
    renderCharacter(ctx, 0, 0, BANKER.charConfig, {
      frame: animFrame,
      pose: bankerBubbleTimer > 0 ? 'pet' : 'idle',
      facing: player.x >= BANKER.x ? 1 : -1
    });
    ctx.restore();

    // Marble Counter Desk in front of Frau Münz
    ctx.save();
    const deskG = ctx.createLinearGradient(420, 198, 420, 246);
    deskG.addColorStop(0, '#ffffff');
    deskG.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = deskG;
    ctx.beginPath();
    ctx.roundRect(420, 198, 200, 48, [8]);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(420, 198, 200, 10);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(442, 62, 156, 24, [10]);
    ctx.fill();
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0369a1';
    ctx.fillText('🏦 Bank-Schalter', 520, 74);
    ctx.restore();

    // 3. Golden Safe Vault (x ~ 740)
    ctx.save();
    const vaultG = ctx.createLinearGradient(680, 96, 800, 240);
    vaultG.addColorStop(0, '#475569');
    vaultG.addColorStop(1, '#1e293b');
    ctx.fillStyle = vaultG;
    ctx.beginPath();
    ctx.roundRect(682, 96, 118, 144, [12]);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Safe Wheel
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(741, 166, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(741, 140);
    ctx.lineTo(741, 192);
    ctx.moveTo(715, 166);
    ctx.lineTo(767, 166);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(674, 62, 134, 24, [10]);
    ctx.fill();
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText(`🔐 Konto: ${BankManager.getBalance()} 🪙`, 741, 74);
    ctx.restore();

    // Companion Pets
    petFollowers.update(player.x, player.y + 4, player.facing, {
      minX: 48,
      maxX: 810,
      minY: 248,
      maxY: 432
    });
    petFollowers.draw(ctx, animFrame, {
      scale: 0.9,
      showLeashes: true,
      anchorX: player.x,
      anchorY: player.y + 4,
      facing: player.facing
    });

    // Player Character
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(0.86, 0.86);
    renderCharacter(ctx, 0, 0, PlayerConfig, {
      frame: animFrame,
      pose: player.pose,
      facing: player.facing
    });
    ctx.restore();

    if (bankerBubbleTimer > 0 && bankerBubble) {
      drawCanvasSpeechBubble(ctx, BANKER.x, BANKER.y - 102, bankerBubble, {
        accent: '#0284c7',
        maxX: w - 12
      });
    }
    if (player.speechTimer > 0 && player.speechText) {
      drawCanvasSpeechBubble(ctx, player.x, player.y - 104, player.speechText, {
        accent: '#ec4899',
        maxX: w - 12
      });
    }

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / 42);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    rafId = requestAnimationFrame(drawScene);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(drawScene);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('runner:bank-updated', () => {
    if (stateManager.getState() === 'BANK') refreshUI();
  });
  window.addEventListener('runner:coins-updated', () => {
    if (stateManager.getState() === 'BANK') refreshUI();
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'BANK') {
      player.x = 155;
      player.y = 315;
      player.facing = 1;
      player.targetX = null;
      player.targetY = null;
      player.pendingCallback = null;
      player.speechTimer = 0;
      bankerBubble = `Willkommen! Auf deinem Konto sind ${BankManager.getBalance()} 🪙!`;
      bankerBubbleTimer = 140;
      if (bankResetConfirmBox) bankResetConfirmBox.classList.add('hidden');
      if (bankResetTriggerBtn) bankResetTriggerBtn.classList.remove('hidden');
      petFollowers.reset(player.x, player.y + 4);
      refreshUI();
      talkPanel.refresh();
      startLoop();
    } else {
      stopLoop();
    }
  });
}
