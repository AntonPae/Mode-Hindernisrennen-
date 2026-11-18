import { PlayerConfig } from './characterData.js';
import { renderCharacter } from './characterRenderer.js';
import { SHOP_CATALOG, ShopManager } from './shopData.js';

export function setupEditorUI(stateManager) {
  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');

  // Input Elements
  const bodyHeight = document.getElementById('bodyHeight');
  const heightVal = document.getElementById('heightVal');
  const bodyWidth = document.getElementById('bodyWidth');
  const widthVal = document.getElementById('widthVal');
  const hairColor = document.getElementById('hairColor');
  const topColor = document.getElementById('topColor');
  const pantsColor = document.getElementById('pantsColor');
  const shoesColor = document.getElementById('shoesColor');

  const faceOptions = document.getElementById('faceOptions');
  const hairOptions = document.getElementById('hairOptions');
  const topOptions = document.getElementById('topOptions');
  const pantsOptions = document.getElementById('pantsOptions');
  const shoesOptions = document.getElementById('shoesOptions');
  const abilityOptions = document.getElementById('abilityOptions');

  const editorCoinsVal = document.getElementById('editorCoinsVal');
  const editorLevelVal = document.getElementById('editorLevelVal');
  const mysteryBoxBtn = document.getElementById('mysteryBoxBtn');
  const shopToast = document.getElementById('shopToast');

  const stickerSelect = document.getElementById('stickerSelect');
  const addStickerBtn = document.getElementById('addStickerBtn');
  const stickersList = document.getElementById('stickersList');
  const toBgSelectBtn = document.getElementById('toBgSelectBtn');

  let toastTimer = null;

  function showToast(message, type = 'info') {
    if (!shopToast) return;
    shopToast.textContent = message;
    shopToast.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      shopToast.classList.add('hidden');
    }, 2600);
  }

  function updateWalletUI() {
    if (editorCoinsVal) {
      editorCoinsVal.textContent = ShopManager.getCoins();
    }
    if (editorLevelVal) {
      editorLevelVal.textContent = ShopManager.getStats().level;
    }
  }

  function updatePreview() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCharacter(ctx, canvas.width / 2, canvas.height - 50, PlayerConfig, { frame: 0, pose: 'idle' });
  }

  function getSelectedId(category) {
    switch (category) {
      case 'face': return PlayerConfig.body.faceId;
      case 'hair': return PlayerConfig.body.hairId;
      case 'top': return PlayerConfig.clothes.top.style;
      case 'pants': return PlayerConfig.clothes.pants.style;
      case 'shoes': return PlayerConfig.clothes.shoes.style;
      case 'ability': return PlayerConfig.ability;
      default: return null;
    }
  }

  function setSelectedId(category, id) {
    switch (category) {
      case 'face': PlayerConfig.body.faceId = id; break;
      case 'hair': PlayerConfig.body.hairId = id; break;
      case 'top': PlayerConfig.clothes.top.style = id; break;
      case 'pants': PlayerConfig.clothes.pants.style = id; break;
      case 'shoes': PlayerConfig.clothes.shoes.style = id; break;
      case 'ability': PlayerConfig.ability = id; break;
    }
    ShopManager.savePlayerConfig(PlayerConfig);
  }

  function handleItemClick(category, item) {
    if (ShopManager.isUnlocked(category, item.id)) {
      setSelectedId(category, item.id);
      renderAllShopGrids();
      updatePreview();
      return;
    }

    const res = ShopManager.buyItem(category, item.id);
    if (res.ok) {
      setSelectedId(category, item.id);
      updateWalletUI();
      renderAllShopGrids();
      updatePreview();
      showToast(`🎉 "${item.name}" für ${res.price} 🪙 gekauft & ausgerüstet!`, 'success');
    } else if (res.reason === 'insufficient_funds') {
      showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${item.name}"! Sammle Münzen im Lauf oder löse Rätsel.`, 'warn');
    }
  }

  function renderCategoryGrid(container, category) {
    if (!container) return;
    const items = SHOP_CATALOG[category] || [];
    const currentId = getSelectedId(category);
    const coins = ShopManager.getCoins();

    container.innerHTML = '';
    items.forEach((item) => {
      const unlocked = ShopManager.isUnlocked(category, item.id);
      const selected = currentId === item.id;
      const effectivePrice = ShopManager.getEffectivePrice(category, item);
      const isDeal = !unlocked && ShopManager.isDailyDeal(category, item.id);
      const canAfford = coins >= effectivePrice;

      const btn = document.createElement('button');
      btn.type = 'button';

      if (category === 'ability') {
        btn.className = `ability-shop-card${selected ? ' selected' : ''}${!unlocked ? ' locked' : ''}${!unlocked && canAfford ? ' affordable' : ''}`;
        const statusHtml = selected
          ? '<span class="shop-tag shop-tag-active">Aktiv</span>'
          : unlocked
            ? '<span class="shop-tag shop-tag-owned">Besitz</span>'
            : `<span class="shop-tag shop-tag-price">${isDeal ? '🔥 ' : '🔒 '}${effectivePrice} 🪙</span>`;

        btn.innerHTML = `
          <div class="ability-shop-top">
            <strong>${item.icon} ${item.name}</strong>
            ${statusHtml}
          </div>
          <p>${item.description}</p>
        `;
      } else {
        btn.className = `shop-item-btn${selected ? ' selected' : ''}${!unlocked ? ' locked' : ''}${!unlocked && canAfford ? ' affordable' : ''}`;
        const badgeText = selected
          ? '✓ Aktiv'
          : unlocked
            ? 'Frei'
            : isDeal
              ? `🔥 ${effectivePrice} 🪙`
              : `🔒 ${effectivePrice} 🪙`;

        const cornerBadge = !unlocked && isDeal
          ? '<span class="item-corner-tag deal">-30%</span>'
          : item.isNew && !unlocked
            ? '<span class="item-corner-tag new">NEU</span>'
            : '';

        btn.innerHTML = `
          ${cornerBadge}
          <span class="shop-item-icon">${item.icon}</span>
          <span class="shop-item-name">${item.name}</span>
          <span class="shop-item-badge">${badgeText}</span>
        `;
      }

      btn.addEventListener('click', () => handleItemClick(category, item));
      container.appendChild(btn);
    });
  }

  function renderAllShopGrids() {
    renderCategoryGrid(faceOptions, 'face');
    renderCategoryGrid(hairOptions, 'hair');
    renderCategoryGrid(topOptions, 'top');
    renderCategoryGrid(pantsOptions, 'pants');
    renderCategoryGrid(shoesOptions, 'shoes');
    renderCategoryGrid(abilityOptions, 'ability');
  }

  // Initial form values
  bodyHeight.value = PlayerConfig.body.height;
  heightVal.textContent = PlayerConfig.body.height;
  bodyWidth.value = PlayerConfig.body.width;
  widthVal.textContent = PlayerConfig.body.width;
  hairColor.value = PlayerConfig.body.hairColor;
  topColor.value = PlayerConfig.clothes.top.color;
  pantsColor.value = PlayerConfig.clothes.pants.color;
  shoesColor.value = PlayerConfig.clothes.shoes.color;

  // Bind Listeners
  bodyHeight.addEventListener('input', (e) => {
    PlayerConfig.body.height = parseFloat(e.target.value);
    heightVal.textContent = PlayerConfig.body.height;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  bodyWidth.addEventListener('input', (e) => {
    PlayerConfig.body.width = parseFloat(e.target.value);
    widthVal.textContent = PlayerConfig.body.width;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  hairColor.addEventListener('input', (e) => {
    PlayerConfig.body.hairColor = e.target.value;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  topColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.top.color = e.target.value;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  pantsColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.pants.color = e.target.value;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  shoesColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.shoes.color = e.target.value;
    ShopManager.savePlayerConfig(PlayerConfig);
    updatePreview();
  });

  // Stickers logic
  addStickerBtn.addEventListener('click', () => {
    if (PlayerConfig.clothes.top.stickers.length >= 3) {
      showToast('Maximal 3 Sticker erlaubt!', 'warn');
      return;
    }
    const newSticker = {
      id: Date.now(),
      type: stickerSelect.value,
      x: (Math.random() - 0.5) * 0.5,
      y: 0.3 + Math.random() * 0.4,
      scale: 1.0
    };
    PlayerConfig.clothes.top.stickers.push(newSticker);
    ShopManager.savePlayerConfig(PlayerConfig);
    renderStickersUI();
    updatePreview();
  });

  function renderStickersUI() {
    stickersList.innerHTML = '';
    PlayerConfig.clothes.top.stickers.forEach((sticker, index) => {
      const item = document.createElement('div');
      item.className = 'sticker-item';
      item.innerHTML = `
        <span>Sticker ${index + 1}: ${getStickerName(sticker.type)}</span>
        <div class="sticker-controls">
          <button type="button" class="btn btn-small btn-secondary remove-sticker" data-id="${sticker.id}">❌</button>
        </div>
      `;
      stickersList.appendChild(item);
    });

    stickersList.querySelectorAll('.remove-sticker').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        PlayerConfig.clothes.top.stickers = PlayerConfig.clothes.top.stickers.filter((s) => s.id !== id);
        ShopManager.savePlayerConfig(PlayerConfig);
        renderStickersUI();
        updatePreview();
      });
    });
  }

  function getStickerName(type) {
    switch (type) {
      case 'star': return '⭐ Stern';
      case 'flame': return '🔥 Flamme';
      case 'heart': return '❤️ Herz';
      case 'lightning': return '⚡ Blitz';
      case 'crown': return '👑 Krone';
      case 'rainbow': return '🌈 Regenbogen';
      case 'diamond': return '💎 Diamant';
      case 'rocket': return '🚀 Rakete';
      default: return type;
    }
  }

  if (mysteryBoxBtn) {
    mysteryBoxBtn.addEventListener('click', () => {
      const res = ShopManager.buyMysteryBox();
      if (res.ok) {
        if (res.category !== 'background') {
          setSelectedId(res.category, res.item.id);
        }
        updateWalletUI();
        renderAllShopGrids();
        updatePreview();
        const catLabels = {
          face: 'Gesicht',
          hair: 'Frisur',
          top: 'Oberteil',
          pants: 'Hose',
          shoes: 'Schuhe',
          ability: 'Fähigkeit',
          background: 'Welt'
        };
        const label = catLabels[res.category] || 'Extra';
        showToast(`🎁 Überraschung! Neue ${label} freigeschaltet: ${res.item.icon || ''} ${res.item.name}!`, 'success');
      } else if (res.reason === 'all_unlocked') {
        showToast('🏆 Wow! Du besitzt schon alle Items im Spiel!', 'info');
      } else if (res.reason === 'insufficient_funds') {
        showToast(`🔒 Noch ${res.missing} 🪙 nötig für die Überraschungs-Kiste!`, 'warn');
      }
    });
  }

  toBgSelectBtn.addEventListener('click', () => {
    stateManager.setState('BACKGROUND_SELECT');
  });

  const toHomeBtn = document.getElementById('toHomeBtn');
  if (toHomeBtn) {
    toHomeBtn.addEventListener('click', () => {
      stateManager.setState('HOME');
    });
  }

  window.addEventListener('runner:coins-updated', () => {
    updateWalletUI();
    renderAllShopGrids();
  });

  // Refresh coin wallet & unlock affordability whenever returning to Editor
  stateManager.onStateChange((newState) => {
    if (newState === 'EDITOR') {
      updateWalletUI();
      renderAllShopGrids();
      updatePreview();
    }
  });

  // Initial draw
  updateWalletUI();
  renderAllShopGrids();
  renderStickersUI();
  updatePreview();
}
