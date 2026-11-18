import { GameConfig } from '../editor/characterData.js';
import { SHOP_CATALOG, ShopManager } from '../editor/shopData.js';

export function setupBackgroundSelectScreen(stateManager) {
  const container = document.getElementById('bgCardsContainer');
  const backToEditorBtn = document.getElementById('backToEditorBtn');
  const bgCoinsVal = document.getElementById('bgCoinsVal');
  const bgToast = document.getElementById('bgToast');
  let toastTimer = null;

  function showToast(msg, type = 'info') {
    if (!bgToast) return;
    bgToast.textContent = msg;
    bgToast.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      bgToast.classList.add('hidden');
    }, 2600);
  }

  function renderBackgroundCards() {
    if (!container) return;
    const coins = ShopManager.getCoins();
    if (bgCoinsVal) bgCoinsVal.textContent = coins;

    container.innerHTML = '';

    // Surprise / Random Tour Card (always available!)
    const randomCard = document.createElement('div');
    randomCard.className = 'bg-card bg-card-surprise';
    randomCard.innerHTML = `
      <div class="bg-card-preview surprise-preview">🎲✨</div>
      <h3>🎲 Überraschungs-Tour</h3>
      <p>Startet in einer zufälligen freigeschalteten Welt und wechselt unterwegs!</p>
      <button type="button" class="btn btn-primary select-bg-btn">Zufällig starten</button>
    `;
    randomCard.addEventListener('click', () => {
      const unlockedBgs = SHOP_CATALOG.background
        .filter((b) => ShopManager.isUnlocked('background', b.id))
        .map((b) => b.id);
      const chosen = unlockedBgs[Math.floor(Math.random() * unlockedBgs.length)] || 'meadow';
      GameConfig.background = chosen;
      stateManager.setState('GAME', { background: chosen });
    });
    container.appendChild(randomCard);

    // Individual Worlds
    SHOP_CATALOG.background.forEach((bg) => {
      const unlocked = ShopManager.isUnlocked('background', bg.id);
      const isDeal = !unlocked && ShopManager.isDailyDeal('background', bg.id);
      const effectivePrice = ShopManager.getEffectivePrice('background', bg);

      const card = document.createElement('div');
      card.className = `bg-card${!unlocked ? ' locked' : ''}`;

      const tagHtml = isDeal
        ? `<span class="bg-corner-badge deal">🔥 -30% HEUTE</span>`
        : bg.isNew
          ? `<span class="bg-corner-badge new">✨ NEU</span>`
          : '';

      const btnText = unlocked
        ? 'Auswählen'
        : `🔒 Freischalten (${effectivePrice} 🪙)`;
      const btnClass = unlocked ? 'btn-secondary' : 'btn-primary';

      card.innerHTML = `
        ${tagHtml}
        <div class="bg-card-preview ${bg.previewClass}"></div>
        <h3>${bg.name}</h3>
        <p>${bg.description}</p>
        <button type="button" class="btn ${btnClass} select-bg-btn">${btnText}</button>
      `;

      card.addEventListener('click', () => {
        if (ShopManager.isUnlocked('background', bg.id)) {
          GameConfig.background = bg.id;
          stateManager.setState('GAME', { background: bg.id });
          return;
        }

        const res = ShopManager.buyItem('background', bg.id);
        if (res.ok) {
          showToast(`🎉 Welt "${bg.name}" für ${res.price} 🪙 freigeschaltet!`, 'success');
          renderBackgroundCards();
        } else if (res.reason === 'insufficient_funds') {
          showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${bg.name}"!`, 'warn');
        }
      });

      container.appendChild(card);
    });
  }

  if (backToEditorBtn) {
    backToEditorBtn.addEventListener('click', () => {
      stateManager.setState('EDITOR');
    });
  }

  window.addEventListener('runner:coins-updated', () => {
    if (stateManager.getState() === 'BACKGROUND_SELECT') {
      renderBackgroundCards();
    }
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'BACKGROUND_SELECT') {
      renderBackgroundCards();
    }
  });

  renderBackgroundCards();
}
