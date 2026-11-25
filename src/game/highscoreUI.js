import { HighscoreManager } from './highscoreData.js';

function formatRunDate(ts) {
  try {
    return new Date(ts).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

export function setupHighscoreUI() {
  const modal = document.getElementById('highscore-modal');
  const closeBtn = document.getElementById('closeHighscoreModalBtn');
  const nameInput = document.getElementById('hsRunnerNameInput');
  const saveNameBtn = document.getElementById('hsSaveNameBtn');
  const tabsEl = document.getElementById('highscoreTabs');
  const listEl = document.getElementById('highscoreListBody');
  const bestSummaryEl = document.getElementById('hsBestSummary');
  const resetTriggerBtn = document.getElementById('hsClearListBtn');
  const resetConfirmBox = document.getElementById('hsClearConfirmBox');
  const resetConfirmYesBtn = document.getElementById('hsClearYesBtn');
  const resetConfirmNoBtn = document.getElementById('hsClearNoBtn');

  let activeTab = 'top';
  let onCloseCallback = null;

  function renderTabs() {
    if (!tabsEl) return;
    const tabs = [
      { id: 'top', label: '🏆 Top-Rekorde' },
      { id: 'runners', label: '👤 Beste pro Läufer' },
      { id: 'recent', label: '🕒 Letzte Läufe' }
    ];
    tabsEl.innerHTML = '';
    tabs.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `earn-tab-btn${activeTab === t.id ? ' active' : ''}`;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        activeTab = t.id;
        renderTabs();
        renderList();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderList() {
    if (nameInput && document.activeElement !== nameInput) {
      nameInput.value = HighscoreManager.getRunnerName();
    }
    if (bestSummaryEl) {
      const top = HighscoreManager.getTopEntries(1)[0];
      bestSummaryEl.textContent = top
        ? `Rekord: ${top.score} m (${top.name})`
        : 'Noch kein Lauf eingetragen';
    }
    if (!listEl) return;

    const entries = activeTab === 'runners'
      ? HighscoreManager.getBestPerRunner()
      : activeTab === 'recent'
        ? HighscoreManager.getRecentEntries(30)
        : HighscoreManager.getTopEntries(30);

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="hs-empty-state">
          🏁 Noch keine Läufe in der Liste! Starte ein Rennen im Stadion, um den ersten Highscore einzutragen.
        </div>
      `;
      return;
    }

    listEl.innerHTML = '';
    entries.forEach((entry, idx) => {
      const rankBadge = activeTab !== 'recent'
        ? (idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`)
        : '🕒';
      const row = document.createElement('div');
      row.className = `hs-entry-row${activeTab !== 'recent' && idx === 0 ? ' is-first' : ''}`;

      const rankSpan = document.createElement('span');
      rankSpan.className = 'hs-rank-badge';
      rankSpan.textContent = rankBadge;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'hs-entry-info';

      const nameEl = document.createElement('strong');
      nameEl.className = 'hs-entry-name';
      nameEl.textContent = entry.name || 'Du';

      const metaEl = document.createElement('span');
      metaEl.className = 'hs-entry-meta';
      metaEl.textContent = `${formatRunDate(entry.timestamp)} Uhr · ${entry.worldLabel || '🌱 Grüne Wiese'}`;

      infoDiv.appendChild(nameEl);
      infoDiv.appendChild(metaEl);

      const scoreDiv = document.createElement('div');
      scoreDiv.className = 'hs-entry-score';
      scoreDiv.innerHTML = `<strong>${entry.score} m</strong>`;
      if (entry.coins > 0) {
        const coinSub = document.createElement('span');
        coinSub.textContent = `+${entry.coins} 🪙`;
        scoreDiv.appendChild(coinSub);
      }

      row.appendChild(rankSpan);
      row.appendChild(infoDiv);
      row.appendChild(scoreDiv);
      listEl.appendChild(row);
    });
  }

  function saveRunnerNameFromInput() {
    if (!nameInput) return;
    HighscoreManager.setRunnerName(nameInput.value);
    nameInput.value = HighscoreManager.getRunnerName();
  }

  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', saveRunnerNameFromInput);
  }
  if (nameInput) {
    nameInput.addEventListener('change', saveRunnerNameFromInput);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveRunnerNameFromInput();
        nameInput.blur();
      }
    });
  }

  if (resetTriggerBtn && resetConfirmBox) {
    resetTriggerBtn.addEventListener('click', () => {
      resetConfirmBox.classList.remove('hidden');
      resetTriggerBtn.classList.add('hidden');
    });
  }
  if (resetConfirmNoBtn && resetConfirmBox && resetTriggerBtn) {
    resetConfirmNoBtn.addEventListener('click', () => {
      resetConfirmBox.classList.add('hidden');
      resetTriggerBtn.classList.remove('hidden');
    });
  }
  if (resetConfirmYesBtn && resetConfirmBox && resetTriggerBtn) {
    resetConfirmYesBtn.addEventListener('click', () => {
      HighscoreManager.clearEntries();
      resetConfirmBox.classList.add('hidden');
      resetTriggerBtn.classList.remove('hidden');
      renderList();
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    if (typeof onCloseCallback === 'function') {
      const cb = onCloseCallback;
      onCloseCallback = null;
      cb();
    }
  }

  function openModal(tab = 'top', { onClose = null } = {}) {
    if (!modal) return;
    activeTab = tab;
    onCloseCallback = typeof onClose === 'function' ? onClose : null;
    if (resetConfirmBox) resetConfirmBox.classList.add('hidden');
    if (resetTriggerBtn) resetTriggerBtn.classList.remove('hidden');
    renderTabs();
    renderList();
    modal.classList.remove('hidden');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('runner:highscores-updated', () => {
    if (modal && !modal.classList.contains('hidden')) {
      renderList();
    }
  });

  return {
    openModal,
    closeModal,
    refresh: renderList
  };
}
