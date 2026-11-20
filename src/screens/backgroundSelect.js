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

      const card = document.createElement('div');
      card.className = `bg-card${!unlocked ? ' locked' : ''}`;

      const tagHtml = !unlocked
        ? `<span class="bg-corner-badge new">👗 In der Boutique</span>`
        : bg.isNew
          ? `<span class="bg-corner-badge new">✨ NEU</span>`
          : '';

      const btnText = unlocked
        ? '🏃 Losrennen!'
        : '👗 Ticket in Mode-Boutique holen';
      const btnClass = unlocked ? 'btn-primary' : 'btn-secondary';

      card.innerHTML = `
        ${tagHtml}
        <div class="bg-card-preview ${bg.previewClass}"></div>
        <h3>${bg.icon || ''} ${bg.name}</h3>
        <p>${bg.description}</p>
        <button type="button" class="btn ${btnClass} select-bg-btn">${btnText}</button>
      `;

      card.addEventListener('click', () => {
        if (ShopManager.isUnlocked('background', bg.id)) {
          GameConfig.background = bg.id;
          stateManager.setState('GAME', { background: bg.id });
          return;
        }
        stateManager.setState('STORE', { shopId: 'boutique', aisle: 'background' });
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
