import { PlayerConfig } from '../editor/characterData.js';
import { MYSTERY_BOX_PRICE, SHOP_CATALOG, ShopManager } from '../editor/shopData.js';
import { HOME_CATALOG, HOME_MYSTERY_BOX_PRICE, HomeManager } from '../home/homeData.js';
import { MailboxManager } from '../mailbox/mailboxData.js';

export const TOWN_SHOP_META = {
  supermarket: {
    id: 'supermarket',
    title: '🛒 Stadt-Supermarkt',
    subtitle: 'Frisches Essen & Zutaten für deinen Kühlschrank in der Küche!',
    tabs: [
      { id: 'fridge_food', label: '🧊 Essen für Kühlschrank' },
      { id: 'pet_food', label: '🦴 Tierfutter' }
    ]
  },
  boutique: {
    id: 'boutique',
    title: '👗 Mode- & Style-Boutique',
    subtitle: 'Neue Outfits, Schuhe, Frisuren & Fähigkeiten kaufen!',
    tabs: [
      { id: 'top', label: '👕 Oberteile' },
      { id: 'pants', label: '👖 Hosen' },
      { id: 'shoes', label: '👟 Schuhe' },
      { id: 'hair', label: '💇 Frisuren' },
      { id: 'face', label: '😀 Gesichter' },
      { id: 'ability', label: '⚡ Fähigkeiten' }
    ]
  },
  furniture: {
    id: 'furniture',
    title: '🛋️ Möbel- & Bau-Kaufhaus',
    subtitle: 'Zimmer anbauen, Möbel, Deko, Garten-Sachen & Haushaltsgeräte!',
    tabs: [
      { id: 'expansions', label: '🏗️ Neue Räume' },
      { id: 'furniture', label: '🛋️ Möbel' },
      { id: 'decor', label: '🖼️ Deko' },
      { id: 'garden', label: '🌳 Garten' },
      { id: 'tools', label: '🧹 Geräte' }
    ]
  },
  petshop: {
    id: 'petshop',
    title: '🐾 Tierhandlung',
    subtitle: 'Süße Haustiere, Spielzeug fürs Tierzimmer & Futter!',
    tabs: [
      { id: 'pets', label: '🐾 Haustiere' },
      { id: 'petItems', label: '🧸 Tiersachen' },
      { id: 'pet_food', label: '🦴 Tierfutter' }
    ]
  }
};

function equipCharacterItem(category, id) {
  switch (category) {
    case 'face': PlayerConfig.body.faceId = id; break;
    case 'hair': PlayerConfig.body.hairId = id; break;
    case 'top': PlayerConfig.clothes.top.style = id; break;
    case 'pants': PlayerConfig.clothes.pants.style = id; break;
    case 'shoes': PlayerConfig.clothes.shoes.style = id; break;
    case 'ability': PlayerConfig.ability = id; break;
    default: break;
  }
  ShopManager.savePlayerConfig(PlayerConfig);
}

function getEquippedCharacterId(category) {
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

export function setupTownShopModal(stateManager, { onPurchaseComplete } = {}) {
  const modal = document.getElementById('town-shop-modal');
  const titleEl = document.getElementById('townShopTitle');
  const subtitleEl = document.getElementById('townShopSubtitle');
  const coinsEl = document.getElementById('townShopCoinsVal');
  const levelEl = document.getElementById('townShopLevelVal');
  const closeBtn = document.getElementById('closeTownShopBtn');
  const exitStreetBtn = document.getElementById('townShopBackStreetBtn');
  const toastEl = document.getElementById('townShopToast');
  const bannerEl = document.getElementById('townShopBanner');
  const tabsEl = document.getElementById('townShopTabs');
  const bodyEl = document.getElementById('townShopBody');

  let activeShopId = null;
  let activeTabId = null;
  let toastTimer = null;

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3000);
  }

  function updateHeaderStats() {
    if (coinsEl) coinsEl.textContent = ShopManager.getCoins();
    if (levelEl) levelEl.textContent = ShopManager.getStats().level;
  }

  function renderBanner() {
    if (!bannerEl || !activeShopId) return;
    const level = ShopManager.getStats().level;
    const nextLv = level + 1;

    if (activeShopId === 'supermarket') {
      const inv = HomeManager.getState().inventory;
      bannerEl.innerHTML = `
        <div class="town-shop-fridge-bar">
          <span>🧊 Aktuell in deinem Kühlschrank:</span>
          <strong>🥘 ${inv.food || 0} Koch-Zutaten</strong>
          <strong>🍓 ${inv.fridgeSnacks || 0} Snacks</strong>
          <strong>🦴 ${inv.petFood || 0} Tierfutter</strong>
        </div>
      `;
      return;
    }

    if (activeShopId === 'boutique') {
      const nextShop = ShopManager.getItemsForLevel(nextLv);
      const hint = nextShop.length > 0
        ? `✨ Ab Level ${nextLv} neu in der Boutique: ${nextShop.slice(0, 3).map((i) => `${i.icon} ${i.name}`).join(' · ')}`
        : `🏆 Level ${level}: Alle Mode-Kollektionen freigeschaltet!`;
      bannerEl.innerHTML = `
        <div class="town-shop-promo-row">
          <span class="town-shop-hint">${hint}</span>
          <button type="button" id="boutiqueMysteryBtn" class="btn btn-small btn-mystery">🎁 Style-Überraschung (${MYSTERY_BOX_PRICE} 🪙)</button>
        </div>
      `;
      const btn = document.getElementById('boutiqueMysteryBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          const res = ShopManager.buyMysteryBox();
          if (res.ok) {
            if (res.category !== 'background') equipCharacterItem(res.category, res.item.id);
            updateHeaderStats();
            renderShopBody();
            window.dispatchEvent(new CustomEvent('runner:coins-updated'));
            if (onPurchaseComplete) onPurchaseComplete();
            showToast(`🎁 Boutique-Überraschung! Neu: ${res.item.icon || ''} ${res.item.name}!`, 'success');
          } else if (res.reason === 'all_unlocked') {
            showToast('🏆 Du besitzt schon alle Boutique-Styles!', 'info');
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig für die Überraschungs-Kiste!`, 'warn');
          }
        });
      }
      return;
    }

    if (activeShopId === 'furniture') {
      const nextHome = HomeManager.getItemsForLevel(nextLv);
      const hint = nextHome.length > 0
        ? `✨ Ab Level ${nextLv} neu im Kaufhaus: ${nextHome.slice(0, 3).map((i) => `${i.icon} ${i.name}`).join(' · ')}`
        : `🏆 Level ${level}: Alle Haus- & Garten-Stufen freigeschaltet!`;
      bannerEl.innerHTML = `
        <div class="town-shop-promo-row">
          <span class="town-shop-hint">${hint}</span>
          <button type="button" id="furnitureMysteryBtn" class="btn btn-small btn-mystery">🎁 Haus-Überraschung (${HOME_MYSTERY_BOX_PRICE} 🪙)</button>
        </div>
      `;
      const btn = document.getElementById('furnitureMysteryBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          const res = HomeManager.buyHomeMysteryBox();
          if (res.ok) {
            if (res.item.id === 'mailbox' || res.item.id === 'gold_mailbox') {
              MailboxManager.ensureDailyMail();
              window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
            }
            updateHeaderStats();
            renderShopBody();
            window.dispatchEvent(new CustomEvent('runner:coins-updated'));
            if (onPurchaseComplete) onPurchaseComplete();
            showToast(`🎁 Haus-Überraschung! Freigeschaltet: ${res.item.icon} ${res.item.name}!`, 'success');
          } else if (res.reason === 'all_unlocked') {
            showToast('🏆 Alle Haus-Sachen gehören dir schon!', 'info');
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig!`, 'warn');
          }
        });
      }
      return;
    }

    if (activeShopId === 'petshop') {
      const inv = HomeManager.getState().inventory;
      const ownCount = (HomeManager.getState().owned.pets || []).length;
      bannerEl.innerHTML = `
        <div class="town-shop-fridge-bar">
          <span>🐾 Deine Tiere: <strong>${ownCount}</strong></span>
          <span>🦴 Tierfutter: <strong>${inv.petFood || 0}</strong></span>
          <span>${HomeManager.hasPetRoom() ? '🏠 Tierzimmer gebaut!' : '💡 Tipp: Tierzimmer gibt es im Möbel-Kaufhaus!'}</span>
        </div>
      `;
    }
  }

  function renderTabs() {
    if (!tabsEl || !activeShopId) return;
    const meta = TOWN_SHOP_META[activeShopId];
    tabsEl.innerHTML = '';
    meta.tabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `home-tab-btn${activeTabId === tab.id ? ' active' : ''}`;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => {
        activeTabId = tab.id;
        renderTabs();
        renderShopBody();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderBoutiqueGrid() {
    const category = activeTabId;
    const items = SHOP_CATALOG[category] || [];
    const currentId = getEquippedCharacterId(category);
    const coins = ShopManager.getCoins();

    const grid = document.createElement('div');
    grid.className = 'town-shop-grid';

    items.forEach((item) => {
      const unlocked = ShopManager.isUnlocked(category, item.id);
      const levelOk = ShopManager.isLevelUnlocked(item);
      const selected = currentId === item.id;
      const price = ShopManager.getEffectivePrice(category, item);
      const isDeal = !unlocked && levelOk && ShopManager.isDailyDeal(category, item.id);
      const canAfford = levelOk && coins >= price;

      const card = document.createElement('div');
      card.className = `home-shop-card${unlocked ? ' owned' : ''}${!unlocked && canAfford ? ' affordable' : ''}${!levelOk ? ' level-locked' : ''}`;

      const badgeHtml = !unlocked && isDeal
        ? '<span class="home-inline-tag deal">🔥 -30%</span>'
        : !unlocked && item.isNew
          ? '<span class="home-inline-tag new">✨ NEU</span>'
          : '';

      const btnLabel = selected
        ? '✓ Angezogen'
        : unlocked
          ? '👗 Anziehen'
          : !levelOk
            ? `🔒 Ab Level ${item.unlockLevel}`
            : `🛍️ Kaufen (${price} 🪙)`;

      card.innerHTML = `
        <div class="home-shop-top">
          <span class="home-shop-icon">${item.icon}</span>
          <div>
            <strong>${item.name} ${badgeHtml}</strong>
            <p>${item.description || (unlocked ? 'Gehört dir schon — tippe zum Anziehen!' : 'Neuer Style aus der Mode-Boutique')}</p>
          </div>
        </div>
        <button type="button" class="btn btn-small ${selected ? 'btn-home' : unlocked ? 'btn-secondary' : !levelOk ? 'btn-secondary' : 'btn-primary'}" ${!levelOk ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      `;

      const btn = card.querySelector('button');
      if (btn && levelOk) {
        btn.addEventListener('click', () => {
          if (unlocked) {
            equipCharacterItem(category, item.id);
            renderShopBody();
            showToast(`👗 "${item.name}" angezogen!`, 'success');
            return;
          }
          const res = ShopManager.buyItem(category, item.id);
          if (res.ok) {
            equipCharacterItem(category, item.id);
            updateHeaderStats();
            renderBanner();
            renderShopBody();
            window.dispatchEvent(new CustomEvent('runner:coins-updated'));
            if (onPurchaseComplete) onPurchaseComplete();
            showToast(`🎉 "${item.name}" für ${res.price} 🪙 gekauft & angezogen!`, 'success');
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${item.name}"!`, 'warn');
          }
        });
      }
      grid.appendChild(card);
    });

    bodyEl.appendChild(grid);
  }

  function renderHomeCatalogGrid(catalogCategory, filterFn = null) {
    const rawList = HOME_CATALOG[catalogCategory] || [];
    const list = filterFn ? rawList.filter(filterFn) : rawList;
    const coins = ShopManager.getCoins();

    const grid = document.createElement('div');
    grid.className = 'town-shop-grid';

    list.forEach((item) => {
      const owned = !item.isConsumable && HomeManager.hasItem(catalogCategory, item.id);
      const levelOk = HomeManager.isLevelUnlocked(item);
      const price = HomeManager.getEffectivePrice(catalogCategory, item);
      const isDeal = !owned && !item.isConsumable && HomeManager.isDailyDeal(catalogCategory, item.id);
      const canAfford = coins >= price;
      const isPetTab = catalogCategory === 'pets';
      const hasPetRoom = HomeManager.hasPetRoom();
      const isComingAlong = owned && isPetTab && HomeManager.isCompanionPet(item.id);

      const card = document.createElement('div');
      card.className = `home-shop-card${owned ? ' owned' : ''}${!owned && levelOk && canAfford ? ' affordable' : ''}${!levelOk ? ' level-locked' : ''}`;

      const badgeHtml = !owned && isDeal
        ? '<span class="home-inline-tag deal">🔥 -30%</span>'
        : !owned && item.isNew
          ? '<span class="home-inline-tag new">✨ NEU</span>'
          : '';

      const btnLabel = owned
        ? (isPetTab
            ? (isComingAlong ? '🎒 Kommt mit' : hasPetRoom ? '🐾 Im Tierzimmer · Mitnehmen' : '👆 Mitnehmen')
            : '✓ Gekauft')
        : !levelOk
          ? `🔒 Ab Level ${item.unlockLevel}`
          : `${isDeal ? '🔥 ' : ''}Kaufen (${price} 🪙)`;

      card.innerHTML = `
        <div class="home-shop-top">
          <span class="home-shop-icon">${item.icon}</span>
          <div>
            <strong>${item.name} ${badgeHtml}</strong>
            <p>${item.desc}</p>
          </div>
        </div>
        <button type="button" class="btn btn-small ${owned ? (isPetTab ? (isComingAlong ? 'btn-home' : 'btn-secondary') : 'btn-secondary') : !levelOk ? 'btn-secondary' : 'btn-primary'}" ${(owned && !isPetTab) || !levelOk ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      `;

      const btn = card.querySelector('button');
      if (btn && owned && isPetTab) {
        btn.addEventListener('click', () => {
          const res = HomeManager.toggleCompanionPet(item.id);
          if (res.ok) {
            renderBanner();
            renderShopBody();
            showToast(
              res.active
                ? `🐾 ${item.name} kommt jetzt überall an der Leine mit dir mit!`
                : `🏡 ${item.name} bleibt gemütlich zuhause${hasPetRoom ? ' im Tierzimmer' : ''}.`,
              res.active ? 'success' : 'info'
            );
          }
        });
      } else if (btn && !owned && levelOk) {
        btn.addEventListener('click', () => {
          const res = HomeManager.buyItem(catalogCategory, item.id);
          if (res.ok) {
            if (item.id === 'mailbox' || item.id === 'gold_mailbox') {
              MailboxManager.ensureDailyMail();
              window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
            }
            updateHeaderStats();
            renderBanner();
            renderShopBody();
            window.dispatchEvent(new CustomEvent('runner:coins-updated'));
            if (onPurchaseComplete) onPurchaseComplete();

            if (activeShopId === 'supermarket' && (item.key === 'food' || item.key === 'fridgeSnacks')) {
              showToast(`🧊 "${item.name}" gekauft & direkt in deinen Kühlschrank geräumt!`, 'success');
            } else if (isPetTab && hasPetRoom) {
              showToast(`🐾 "${item.name}" gekauft! Es wartet in deinem Tierzimmer (oder tippe auf Mitnehmen)!`, 'success');
            } else {
              showToast(`🎉 "${item.name}" für ${res.price} 🪙 gekauft!`, 'success');
            }
          } else if (res.reason === 'insufficient_funds') {
            showToast(`🔒 Noch ${res.missing} 🪙 nötig für "${item.name}"!`, 'warn');
          }
        });
      }

      grid.appendChild(card);
    });

    bodyEl.appendChild(grid);
  }

  function renderShopBody() {
    if (!bodyEl || !activeShopId) return;
    bodyEl.innerHTML = '';

    if (activeShopId === 'boutique') {
      renderBoutiqueGrid();
      return;
    }
    if (activeShopId === 'supermarket') {
      if (activeTabId === 'fridge_food') {
        renderHomeCatalogGrid('supplies', (i) => i.key === 'food' || i.key === 'fridgeSnacks');
      } else {
        renderHomeCatalogGrid('supplies', (i) => i.key === 'petFood');
      }
      return;
    }
    if (activeShopId === 'furniture') {
      if (activeTabId === 'tools') {
        renderHomeCatalogGrid('supplies', (i) => !i.isConsumable);
      } else {
        renderHomeCatalogGrid(activeTabId);
      }
      return;
    }
    if (activeShopId === 'petshop') {
      if (activeTabId === 'pet_food') {
        renderHomeCatalogGrid('supplies', (i) => i.key === 'petFood');
      } else {
        renderHomeCatalogGrid(activeTabId);
      }
    }
  }

  function openShop(shopId, preferredTab = null) {
    const meta = TOWN_SHOP_META[shopId];
    if (!meta || !modal) return;
    activeShopId = shopId;
    activeTabId = preferredTab && meta.tabs.some((t) => t.id === preferredTab)
      ? preferredTab
      : meta.tabs[0].id;

    if (titleEl) titleEl.textContent = meta.title;
    if (subtitleEl) subtitleEl.textContent = meta.subtitle;
    if (toastEl) toastEl.classList.add('hidden');

    updateHeaderStats();
    renderBanner();
    renderTabs();
    renderShopBody();
    modal.classList.remove('hidden');
  }

  function closeShop() {
    if (!modal) return;
    modal.classList.add('hidden');
    activeShopId = null;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeShop);
  if (exitStreetBtn) exitStreetBtn.addEventListener('click', closeShop);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeShop();
    });
  }

  window.addEventListener('runner:coins-updated', () => {
    if (modal && !modal.classList.contains('hidden')) {
      updateHeaderStats();
      renderBanner();
      renderShopBody();
    }
  });

  return { openShop, closeShop, isOpen: () => Boolean(modal && !modal.classList.contains('hidden')) };
}
