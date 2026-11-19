import { ShopManager } from '../editor/shopData.js';
import { HomeManager } from '../home/homeData.js';
import {
  MailboxManager,
  MAIL_CONTACTS,
  INVITE_EVENT_TYPES,
  INVITE_TIMES,
  QUICK_PHRASES
} from './mailboxData.js';

export function setupMailboxUI(stateManager) {
  const modal = document.getElementById('mailbox-modal');
  const closeBtn = document.getElementById('closeMailboxBtn');
  const coinsValEl = document.getElementById('mailboxCoinsVal');
  const toastEl = document.getElementById('mailboxToast');
  const tabsEl = document.getElementById('mailboxTabs');
  const bodyEl = document.getElementById('mailboxBody');

  const triggerButtons = [
    document.getElementById('homeMailboxBtn'),
    document.getElementById('townMailboxBtn')
  ].filter(Boolean);

  let activeTab = 'inbox';
  let toastTimer = null;

  // Compose state for iPad
  let writeRecipientId = MAIL_CONTACTS[0].id;
  let writeDraft = '';
  let inviteRecipientId = 'all';
  let inviteEventId = INVITE_EVENT_TYPES[0].id;
  let inviteWhen = INVITE_TIMES[0];
  let inviteNote = '';

  function showToast(msg, type = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `shop-toast shop-toast-${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3200);
  }

  function refreshMailboxButtons() {
    const owned = MailboxManager.hasMailbox();
    if (owned) {
      MailboxManager.ensureDailyMail();
    }
    const pending = owned ? MailboxManager.getUnreadCount() : 0;

    triggerButtons.forEach((btn) => {
      if (!owned) {
        btn.innerHTML = '📬 Briefkasten kaufen (45 🪙)';
      } else if (pending > 0) {
        btn.innerHTML = `📬 Briefkasten <span class="mail-badge-count">${pending}</span>`;
      } else {
        btn.innerHTML = '📬 Briefkasten';
      }
    });
  }

  function notifyGlobalUpdate() {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    refreshMailboxButtons();
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    window.dispatchEvent(new CustomEvent('runner:mailbox-updated'));
  }

  function renderTabs() {
    if (!tabsEl) return;
    if (!MailboxManager.hasMailbox()) {
      tabsEl.innerHTML = '';
      return;
    }

    const unread = MailboxManager.getUnreadCount();
    const tabs = [
      { id: 'inbox', label: unread > 0 ? `📥 Posteingang (${unread})` : '📥 Posteingang' },
      { id: 'write', label: '✍️ Brief schreiben' },
      { id: 'invite', label: '🎉 Einladen' },
      { id: 'sent', label: '📤 Gesendet' }
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
        renderBody();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderLockedMailboxView() {
    const coins = ShopManager.getCoins();
    const canBuy = coins >= 45;
    bodyEl.innerHTML = `
      <div class="mailbox-buy-card">
        <div class="mailbox-buy-icon">📬</div>
        <h3>Hol dir deinen eigenen Briefkasten!</h3>
        <p>Mit dem Briefkasten bekommst du jeden Tag 1–2 Briefe und Einladungen zu Wettbewerben, Partys &amp; Ausflügen. Außerdem kannst du deinen Nachbarn schreiben und sie selbst einladen!</p>
        <div class="mailbox-buy-actions">
          <button type="button" id="buyMailboxNowBtn" class="btn btn-primary btn-large">
            ${canBuy ? '📬 Briefkasten kaufen (45 🪙)' : `🔒 Noch ${45 - coins} 🪙 nötig (Preis: 45 🪙)`}
          </button>
        </div>
      </div>
    `;

    const buyBtn = document.getElementById('buyMailboxNowBtn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const res = HomeManager.buyItem('garden', 'mailbox');
        if (res.ok) {
          MailboxManager.ensureDailyMail();
          notifyGlobalUpdate();
          renderTabs();
          renderBody();
          showToast('🎉 Briefkasten aufgestellt! Schau mal – deine ersten 2 Briefe sind schon da!', 'success');
        } else if (res.reason === 'insufficient_funds') {
          showToast(`🔒 Noch ${res.missing} 🪙 nötig! Spiele ein Rennen oder arbeite im Café.`, 'warn');
        }
      });
    }
  }

  function renderInboxView() {
    MailboxManager.ensureDailyMail();
    const state = MailboxManager.getState();

    if (state.inbox.length === 0) {
      bodyEl.innerHTML = `
        <div class="quiz-empty-box">
          <p>📭 Dein Briefkasten ist gerade leer. Schau morgen wieder vorbei oder schreibe selbst einen Brief!</p>
        </div>
      `;
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'mailbox-list';

    state.inbox.forEach((mail) => {
      const card = document.createElement('article');
      card.className = `mail-card${!mail.read ? ' unread' : ''}`;

      let statusHtml = '';
      if (mail.isInvitation) {
        if (mail.rsvpStatus === 'accepted') {
          statusHtml = `<span class="mail-status accepted">✅ Angenommen</span>`;
        } else if (mail.rsvpStatus === 'declined') {
          statusHtml = `<span class="mail-status declined">❌ Abgelehnt</span>`;
        } else {
          statusHtml = `<span class="mail-status pending">📩 Einladung offen</span>`;
        }
      } else if (mail.giftClaimed) {
        statusHtml = `<span class="mail-status accepted">🎁 Eingesammelt</span>`;
      }

      card.innerHTML = `
        <div class="mail-card-head">
          <div class="mail-sender-block">
            <span class="mail-avatar">${mail.senderIcon}</span>
            <div>
              <strong>${mail.senderName}</strong>
              <span class="mail-meta">${mail.categoryLabel}${mail.eventTime ? ` · ${mail.eventTime}` : ''}</span>
            </div>
          </div>
          ${statusHtml}
        </div>
        <h3 class="mail-title">${mail.title}</h3>
        <p class="mail-text">${mail.body}</p>
        <div class="mail-actions-row"></div>
      `;

      const actionsRow = card.querySelector('.mail-actions-row');

      if (mail.isInvitation && mail.rsvpStatus === 'pending') {
        const acceptBtn = document.createElement('button');
        acceptBtn.type = 'button';
        acceptBtn.className = 'btn btn-mail-accept';
        acceptBtn.textContent = `✅ Annehmen (+${mail.rewardCoins || 20} 🪙)`;
        acceptBtn.addEventListener('click', () => {
          const res = MailboxManager.respondToInvitation(mail.id, 'accept');
          if (res.ok) {
            notifyGlobalUpdate();
            renderTabs();
            renderBody();
            const bonusMsg = res.levelUpBonus > 0 ? ` & LEVEL UP (+${res.levelUpBonus} 🪙)!` : '!';
            showToast(`🎉 Einladung angenommen! +${res.coinsEarned} 🪙 erhalten${bonusMsg}`, 'success');
          }
        });

        const declineBtn = document.createElement('button');
        declineBtn.type = 'button';
        declineBtn.className = 'btn btn-mail-decline';
        declineBtn.textContent = '❌ Ablehnen';
        declineBtn.addEventListener('click', () => {
          const res = MailboxManager.respondToInvitation(mail.id, 'decline');
          if (res.ok) {
            notifyGlobalUpdate();
            renderTabs();
            renderBody();
            showToast(`Du hast ${mail.senderName} freundlich abgesagt.`, 'info');
          }
        });

        actionsRow.appendChild(acceptBtn);
        actionsRow.appendChild(declineBtn);
      } else if (mail.isInvitation && mail.rsvpStatus === 'accepted' && mail.targetState) {
        const goBtn = document.createElement('button');
        goBtn.type = 'button';
        goBtn.className = 'btn btn-primary';
        goBtn.textContent = '🚀 Jetzt zum Event starten';
        goBtn.addEventListener('click', () => {
          closeModal();
          stateManager.setState(mail.targetState, mail.targetPayload || undefined);
        });
        actionsRow.appendChild(goBtn);
      } else if (!mail.isInvitation && !mail.giftClaimed) {
        const claimBtn = document.createElement('button');
        claimBtn.type = 'button';
        claimBtn.className = 'btn btn-mail-accept';
        const giftLabel = mail.giftSupply
          ? `🎁 Einsammeln (${mail.giftSupply.label} + ${mail.rewardCoins} 🪙)`
          : `🎁 Geschenk einsammeln (+${mail.rewardCoins} 🪙)`;
        claimBtn.textContent = giftLabel;
        claimBtn.addEventListener('click', () => {
          const res = MailboxManager.claimLetterGift(mail.id);
          if (res.ok) {
            notifyGlobalUpdate();
            renderTabs();
            renderBody();
            showToast(`🎁 Geschenk eingesammelt: +${res.coinsEarned} 🪙${res.supply ? ` & ${res.supply.label}` : ''}!`, 'success');
          }
        });
        actionsRow.appendChild(claimBtn);
      }

      const replyQuickBtn = document.createElement('button');
      replyQuickBtn.type = 'button';
      replyQuickBtn.className = 'btn btn-secondary';
      replyQuickBtn.textContent = '✍️ Antworten';
      replyQuickBtn.addEventListener('click', () => {
        if (!mail.read) {
          mail.read = true;
          MailboxManager.saveState(state);
        }
        writeRecipientId = mail.senderId;
        activeTab = 'write';
        renderTabs();
        renderBody();
      });
      actionsRow.appendChild(replyQuickBtn);

      wrap.appendChild(card);
    });

    bodyEl.innerHTML = '';
    bodyEl.appendChild(wrap);
    MailboxManager.markAllRead();
    refreshMailboxButtons();
  }

  function renderWriteView() {
    bodyEl.innerHTML = `
      <div class="mail-compose-panel">
        <div class="mail-field-group">
          <label class="mail-label">1. An wen möchtest du schreiben?</label>
          <div id="writeRecipientRow" class="mail-chip-grid"></div>
        </div>

        <div class="mail-field-group">
          <label class="mail-label">2. Schnell-Sätze zum Antippen (perfekt fürs iPad!)</label>
          <div id="writeQuickPhrases" class="mail-phrases-row"></div>
        </div>

        <div class="mail-field-group">
          <label class="mail-label" for="writeLetterTextarea">3. Dein Brief-Text</label>
          <textarea id="writeLetterTextarea" class="mail-textarea" rows="4" placeholder="Schreibe hier deine Nachricht auf dem iPad..."></textarea>
        </div>

        <div class="mail-compose-footer">
          <button type="button" id="sendLetterBtn" class="btn btn-primary btn-large">📮 Brief abschicken</button>
        </div>
      </div>
    `;

    const recRow = document.getElementById('writeRecipientRow');
    MAIL_CONTACTS.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mail-pick-btn${writeRecipientId === c.id ? ' active' : ''}`;
      btn.innerHTML = `<span>${c.icon}</span><strong>${c.name}</strong>`;
      btn.addEventListener('click', () => {
        writeRecipientId = c.id;
        renderWriteView();
      });
      recRow.appendChild(btn);
    });

    const textarea = document.getElementById('writeLetterTextarea');
    textarea.value = writeDraft;
    textarea.addEventListener('input', () => {
      writeDraft = textarea.value;
    });

    const phrasesRow = document.getElementById('writeQuickPhrases');
    QUICK_PHRASES.forEach((phrase) => {
      const pBtn = document.createElement('button');
      pBtn.type = 'button';
      pBtn.className = 'mail-phrase-btn';
      pBtn.textContent = phrase;
      pBtn.addEventListener('click', () => {
        writeDraft = writeDraft ? `${writeDraft.trim()} ${phrase}` : phrase;
        textarea.value = writeDraft;
      });
      phrasesRow.appendChild(pBtn);
    });

    const sendBtn = document.getElementById('sendLetterBtn');
    sendBtn.addEventListener('click', () => {
      const res = MailboxManager.sendLetter({
        recipientId: writeRecipientId,
        body: textarea.value
      });
      if (!res.ok) {
        showToast('✏️ Bitte schreib erst noch einen kurzen Text oder tippe einen Schnell-Satz an!', 'warn');
        return;
      }
      writeDraft = '';
      notifyGlobalUpdate();
      activeTab = 'inbox';
      renderTabs();
      renderBody();
      showToast(`📮 Brief abgeschickt! ${res.replyMail.senderName} hat dir schon geantwortet!`, 'success');
    });
  }

  function renderInviteView() {
    const selectedEvt = INVITE_EVENT_TYPES.find((e) => e.id === inviteEventId) || INVITE_EVENT_TYPES[0];
    bodyEl.innerHTML = `
      <div class="mail-compose-panel">
        <div class="mail-field-group">
          <label class="mail-label">1. Wen möchtest du einladen?</label>
          <div id="inviteRecipientRow" class="mail-chip-grid"></div>
        </div>

        <div class="mail-field-group">
          <label class="mail-label">2. Was wollt ihr zusammen machen?</label>
          <div id="inviteEventRow" class="mail-chip-grid"></div>
        </div>

        <div class="mail-field-group">
          <label class="mail-label">3. Wann findet es statt?</label>
          <div id="inviteTimeRow" class="mail-phrases-row"></div>
        </div>

        <div class="mail-field-group">
          <label class="mail-label" for="inviteNoteTextarea">4. Einladungs-Text (kannst du ändern)</label>
          <textarea id="inviteNoteTextarea" class="mail-textarea" rows="3"></textarea>
        </div>

        <div class="mail-compose-footer">
          <button type="button" id="sendInviteBtn" class="btn btn-primary btn-large">💌 Einladung absenden</button>
        </div>
      </div>
    `;

    const recRow = document.getElementById('inviteRecipientRow');
    const allOption = { id: 'all', icon: '👥', name: 'Alle Freunde' };
    [allOption, ...MAIL_CONTACTS].forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mail-pick-btn${inviteRecipientId === c.id ? ' active' : ''}`;
      btn.innerHTML = `<span>${c.icon}</span><strong>${c.name}</strong>`;
      btn.addEventListener('click', () => {
        inviteRecipientId = c.id;
        renderInviteView();
      });
      recRow.appendChild(btn);
    });

    const evtRow = document.getElementById('inviteEventRow');
    INVITE_EVENT_TYPES.forEach((evt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mail-pick-btn${inviteEventId === evt.id ? ' active' : ''}`;
      btn.innerHTML = `<span>${evt.icon}</span><strong>${evt.label}</strong>`;
      btn.addEventListener('click', () => {
        inviteEventId = evt.id;
        inviteNote = evt.defaultMsg;
        renderInviteView();
      });
      evtRow.appendChild(btn);
    });

    const timeRow = document.getElementById('inviteTimeRow');
    INVITE_TIMES.forEach((tLabel) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mail-phrase-btn${inviteWhen === tLabel ? ' active' : ''}`;
      btn.textContent = `🕒 ${tLabel}`;
      btn.addEventListener('click', () => {
        inviteWhen = tLabel;
        renderInviteView();
      });
      timeRow.appendChild(btn);
    });

    const noteArea = document.getElementById('inviteNoteTextarea');
    noteArea.value = inviteNote || selectedEvt.defaultMsg;
    noteArea.addEventListener('input', () => {
      inviteNote = noteArea.value;
    });

    const sendBtn = document.getElementById('sendInviteBtn');
    sendBtn.addEventListener('click', () => {
      const res = MailboxManager.sendInvitation({
        recipientId: inviteRecipientId,
        eventTypeId: inviteEventId,
        whenLabel: inviteWhen,
        note: noteArea.value
      });
      if (res.ok) {
        inviteNote = '';
        notifyGlobalUpdate();
        activeTab = 'inbox';
        renderTabs();
        renderBody();
        showToast(`💌 Einladung verschickt! ${res.acceptedCount}x Zusage erhalten – schau in deinen Posteingang!`, 'success');
      }
    });
  }

  function renderSentView() {
    const state = MailboxManager.getState();
    if (state.sent.length === 0) {
      bodyEl.innerHTML = `
        <div class="quiz-empty-box">
          <p>📤 Du hast noch keine Briefe oder Einladungen verschickt. Schreib deinen Freunden doch mal!</p>
        </div>
      `;
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'mailbox-list';
    state.sent.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'mail-card';
      const statusBadge = entry.replyStatus === 'accepted'
        ? '<span class="mail-status accepted">✅ Angenommen</span>'
        : entry.replyStatus === 'declined'
          ? '<span class="mail-status declined">❌ Abgesagt</span>'
          : '<span class="mail-status pending">💌 Gesendet</span>';

      card.innerHTML = `
        <div class="mail-card-head">
          <div class="mail-sender-block">
            <span class="mail-avatar">${entry.recipientIcon}</span>
            <div>
              <strong>An ${entry.recipientName}</strong>
              <span class="mail-meta">${entry.kind === 'invite' ? '🎉 Einladung' : '✍️ Brief'}${entry.eventWhen ? ` · ${entry.eventWhen}` : ''}</span>
            </div>
          </div>
          ${statusBadge}
        </div>
        <h3 class="mail-title">${entry.title}</h3>
        <p class="mail-text">${entry.body}</p>
      `;
      wrap.appendChild(card);
    });

    bodyEl.innerHTML = '';
    bodyEl.appendChild(wrap);
  }

  function renderBody() {
    if (!bodyEl) return;
    if (!MailboxManager.hasMailbox()) {
      renderLockedMailboxView();
      return;
    }
    if (activeTab === 'inbox') {
      renderInboxView();
    } else if (activeTab === 'write') {
      renderWriteView();
    } else if (activeTab === 'invite') {
      renderInviteView();
    } else {
      renderSentView();
    }
  }

  function openModal(initialTab = 'inbox') {
    if (!modal) return;
    activeTab = initialTab;
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    if (MailboxManager.hasMailbox()) {
      const { delivered } = MailboxManager.ensureDailyMail();
      if (delivered.length > 0) {
        showToast(`📬 ${delivered.length} neue Post heute erhalten!`, 'info');
      }
    }
    renderTabs();
    renderBody();
    modal.classList.remove('hidden');
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
    refreshMailboxButtons();
  }

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', () => openModal('inbox'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('runner:coins-updated', () => {
    if (coinsValEl) coinsValEl.textContent = ShopManager.getCoins();
    refreshMailboxButtons();
  });

  window.addEventListener('runner:open-mailbox', (e) => {
    const tab = e.detail?.tab || 'inbox';
    openModal(tab);
  });

  refreshMailboxButtons();

  return {
    openModal,
    closeModal,
    refreshMailboxButtons
  };
}
