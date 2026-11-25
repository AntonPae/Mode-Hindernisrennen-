import { GameConfig } from '../editor/characterData.js';
import { SHOP_CATALOG, ShopManager } from '../editor/shopData.js';
import { HighscoreManager } from '../game/highscoreData.js';
import { HomeManager } from '../home/homeData.js';
import { MOUNT_META } from '../town/transportRenderer.js';

export function setupBackgroundSelectScreen(stateManager) {
  const container = document.getElementById('bgCardsContainer');
  const backToEditorBtn = document.getElementById('backToEditorBtn');
  const bgCoinsVal = document.getElementById('bgCoinsVal');
  const bgHighscoreBestVal = document.getElementById('bgHighscoreBestVal');
  const bgRunnerNameInput = document.getElementById('bgRunnerNameInput');
  const bgHighscoreBtn = document.getElementById('bgHighscoreBtn');
  const bgMountBar = document.getElementById('bgMountBar');
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

  function syncRunnerControls() {
    if (bgRunnerNameInput && document.activeElement !== bgRunnerNameInput) {
      bgRunnerNameInput.value = HighscoreManager.getRunnerName();
    }
    if (bgHighscoreBestVal) {
      bgHighscoreBestVal.textContent = HighscoreManager.getOverallBestScore();
    }
  }

  function renderMountBar() {
    if (!bgMountBar) return;
    const ownedMounts = HomeManager.getOwnedMounts();
    const activeMountId = HomeManager.getRaceMountId();
    bgMountBar.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'bg-mount-label';
    label.textContent = '🐴 Starten mit:';
    bgMountBar.appendChild(label);

    const footBtn = document.createElement('button');
    footBtn.type = 'button';
    footBtn.className = `bg-mount-chip${!activeMountId ? ' active' : ''}`;
    footBtn.textContent = '🏃 Zu Fuß';
    footBtn.addEventListener('click', () => {
      HomeManager.setRaceMountId(null);
      renderMountBar();
      renderBackgroundCards();
    });
    bgMountBar.appendChild(footBtn);

    if (ownedMounts.length === 0) {
      const shopBtn = document.createElement('button');
      shopBtn.type = 'button';
      shopBtn.className = 'bg-mount-chip shop-link';
      shopBtn.textContent = '🐾 Reittiere in der Tierhandlung kaufen';
      shopBtn.addEventListener('click', () => {
        stateManager.setState('STORE', { shopId: 'petshop', aisle: 'mounts' });
      });
      bgMountBar.appendChild(shopBtn);
      return;
    }

    ownedMounts.forEach((mount) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = activeMountId === mount.id;
      btn.className = `bg-mount-chip${isSelected ? ' active' : ''}`;
      btn.textContent = `${mount.icon} ${mount.name}`;
      btn.addEventListener('click', () => {
        HomeManager.setRaceMountId(mount.id);
        renderMountBar();
        renderBackgroundCards();
        showToast(`${mount.icon} Du reitest auf „${mount.name}“ los! Wähle unten deine Welt.`, 'success');
      });
      bgMountBar.appendChild(btn);
    });
  }

  function renderBackgroundCards() {
    if (!container) return;
    const coins = ShopManager.getCoins();
    if (bgCoinsVal) bgCoinsVal.textContent = coins;
    syncRunnerControls();
    renderMountBar();

    const activeMountId = HomeManager.getRaceMountId();
    const activeMountMeta = activeMountId ? MOUNT_META[activeMountId] : null;
    const startLabel = activeMountMeta
      ? `${activeMountMeta.icon} Auf ${activeMountMeta.name.split(' ')[0]} losreiten!`
      : '🏃 Losrennen!';

    container.innerHTML = '';

    // Surprise / Random Tour Card (always available!)
    const randomCard = document.createElement('div');
    randomCard.className = 'bg-card bg-card-surprise';
    randomCard.innerHTML = `
      <div class="bg-card-preview surprise-preview">🎲✨</div>
      <h3>🎲 Überraschungs-Tour</h3>
      <p>Startet in einer zufälligen freigeschalteten Welt und wechselt unterwegs!</p>
      <button type="button" class="btn btn-primary select-bg-btn">${activeMountMeta ? `${activeMountMeta.icon} Zufällig losreiten` : 'Zufällig starten'}</button>
    `;
    randomCard.addEventListener('click', () => {
      const unlockedBgs = SHOP_CATALOG.background
        .filter((b) => ShopManager.isUnlocked('background', b.id))
        .map((b) => b.id);
      const chosen = unlockedBgs[Math.floor(Math.random() * unlockedBgs.length)] || 'meadow';
      GameConfig.background = chosen;
      stateManager.setState('GAME', { background: chosen, mountId: HomeManager.getRaceMountId() });
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
        ? startLabel
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
          stateManager.setState('GAME', { background: bg.id, mountId: HomeManager.getRaceMountId() });
          return;
        }
        stateManager.setState('STORE', { shopId: 'boutique', aisle: 'background' });
      });

      container.appendChild(card);
    });
  }

  if (bgRunnerNameInput) {
    bgRunnerNameInput.addEventListener('change', () => {
      HighscoreManager.setRunnerName(bgRunnerNameInput.value);
      bgRunnerNameInput.value = HighscoreManager.getRunnerName();
    });
  }

  if (bgHighscoreBtn) {
    bgHighscoreBtn.addEventListener('click', () => {
      if (bgRunnerNameInput) {
        HighscoreManager.setRunnerName(bgRunnerNameInput.value);
      }
      window.dispatchEvent(new CustomEvent('runner:open-highscores', { detail: { tab: 'top' } }));
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

  window.addEventListener('runner:transport-updated', () => {
    if (stateManager.getState() === 'BACKGROUND_SELECT') {
      renderBackgroundCards();
    }
  });

  window.addEventListener('runner:highscores-updated', () => {
    syncRunnerControls();
  });

  stateManager.onStateChange((newState) => {
    if (newState === 'BACKGROUND_SELECT') {
      renderBackgroundCards();
    }
  });

  renderBackgroundCards();
}
