import { PET_COMMANDS, SocialManager } from './socialData.js';

export function mountTalkPanel({
  mountEl,
  getTargets,
  onTalkPerson,
  onCommandPet,
  onFocusTarget,
  onMoveInRequest,
  onMoveOutRequest,
  onGoHome
}) {
  if (!mountEl) {
    return { refresh: () => {}, selectTarget: () => {}, setStatusLine: () => {} };
  }

  mountEl.classList.add('event-chat-box', 'talk-dock');
  mountEl.innerHTML = `
    <div class="event-chat-top">
      <div class="talk-dock-header">
        <span class="talk-dock-title">💬 Mit allen reden &amp; 🐾 Tiere anleiten</span>
        <div class="talk-dock-header-right">
          <span class="talk-dock-badge hidden" data-role="badge"></span>
          <span data-role="moveinSlot"></span>
        </div>
      </div>
      <div class="event-friend-pills" data-role="pills"></div>
      <div class="event-chat-line" data-role="line">💬 Wähle eine Person (auch zum Kennenlernen!) oder eines deiner Tiere aus!</div>
    </div>
    <div class="event-quick-chat-row" data-role="quick"></div>
    <div class="event-chat-input-row">
      <input type="text" class="event-chat-input" data-role="input" placeholder="Schreib etwas oder gib deinem Tier eine Anweisung..." maxlength="90" />
      <button type="button" class="btn btn-small btn-primary" data-role="send">💬 Sagen</button>
    </div>
  `;

  const pillsEl = mountEl.querySelector('[data-role="pills"]');
  const lineEl = mountEl.querySelector('[data-role="line"]');
  const badgeEl = mountEl.querySelector('[data-role="badge"]');
  const moveinSlotEl = mountEl.querySelector('[data-role="moveinSlot"]');
  const quickEl = mountEl.querySelector('[data-role="quick"]');
  const inputEl = mountEl.querySelector('[data-role="input"]');
  const sendBtn = mountEl.querySelector('[data-role="send"]');

  let selectedTargetId = null;
  let customLine = '';

  function getResolvedTarget(targets) {
    if (!targets || targets.length === 0) return null;
    let found = targets.find((t) => t.id === selectedTargetId);
    if (!found) {
      found = targets[0];
      selectedTargetId = found.id;
    }
    return found;
  }

  function refresh(forceLine = null) {
    const targets = getTargets() || [];
    const active = getResolvedTarget(targets);
    const roommate = SocialManager.getRoommate();

    pillsEl.innerHTML = '';
    if (moveinSlotEl) moveinSlotEl.innerHTML = '';
    if (targets.length === 0) {
      const emptyNote = document.createElement('span');
      emptyNote.className = 'talk-empty-note';
      emptyNote.textContent = 'Gerade niemand in der Nähe – hol dir ein Tier dazu oder geh auf die Straße!';
      pillsEl.appendChild(emptyNote);
      badgeEl.classList.add('hidden');
      quickEl.innerHTML = '';
      if (forceLine) lineEl.textContent = forceLine;
      return;
    }

    targets.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = active && active.id === t.id;
      const isRoommate = roommate && roommate.id === t.id;
      const isNew = t.type === 'person' && t.isNewPerson && (SocialManager.getAcquaintanceProgress(t.id).stage === 0);
      btn.className = `event-friend-pill${t.type === 'pet' ? ' pet-cmd-pill' : ''}${isNew ? ' new-person-pill' : ''}${isActive ? ' active' : ''}`;
      if (isRoommate) {
        btn.textContent = `🏡 ${t.name} (WG)`;
      } else {
        btn.textContent = isNew ? `🆕 ${t.name} kennenlernen` : `${t.icon || '💬'} ${t.name}`;
      }
      btn.addEventListener('click', () => {
        selectedTargetId = t.id;
        customLine = '';
        if (onFocusTarget) onFocusTarget(t);
        refresh();
      });
      pillsEl.appendChild(btn);
    });

    if (forceLine) {
      customLine = forceLine;
    }

    if (active) {
      if (active.type === 'person') {
        const isRoommate = roommate && roommate.id === active.id;
        if (active.isNewPerson) {
          const prog = SocialManager.getAcquaintanceProgress(active.id);
          if (isRoommate) {
            badgeEl.textContent = '🏡 Wohnt bei dir';
            badgeEl.className = 'talk-dock-badge roommate';
            if (moveinSlotEl) {
              if (onGoHome) {
                const homeBtn = document.createElement('button');
                homeBtn.type = 'button';
                homeBtn.className = 'talk-movein-btn';
                homeBtn.textContent = '🏡 Ins Haus';
                homeBtn.addEventListener('click', () => onGoHome(active));
                moveinSlotEl.appendChild(homeBtn);
              }
              const outBtn = document.createElement('button');
              outBtn.type = 'button';
              outBtn.className = 'talk-moveout-btn';
              outBtn.textContent = '👋 Ausziehen';
              outBtn.addEventListener('click', () => {
                if (onMoveOutRequest) {
                  onMoveOutRequest(active);
                } else {
                  SocialManager.moveOutRoommate();
                  refresh(`👋 ${active.name} ist freundlich ausgezogen – ihr bleibt natürlich Freunde!`);
                }
              });
              moveinSlotEl.appendChild(outBtn);
            }
          } else {
            badgeEl.textContent = SocialManager.getStageLabel(prog.stage);
            badgeEl.className = `talk-dock-badge${prog.stage >= 3 ? ' friend' : ''}`;
            if (moveinSlotEl) {
              const inviteBtn = document.createElement('button');
              inviteBtn.type = 'button';
              inviteBtn.className = 'talk-movein-btn';
              inviteBtn.textContent = '🏡 Zusammenziehen fragen!';
              inviteBtn.addEventListener('click', () => {
                if (onMoveInRequest) {
                  onMoveInRequest(active);
                } else if (onTalkPerson) {
                  onTalkPerson(active, 'Wollen wir zusammenziehen?');
                }
              });
              moveinSlotEl.appendChild(inviteBtn);
            }
          }
        } else if (active.role) {
          badgeEl.textContent = active.role;
          badgeEl.className = 'talk-dock-badge';
        } else {
          badgeEl.classList.add('hidden');
        }

        inputEl.placeholder = `Schreib etwas an ${active.name}...`;
        sendBtn.textContent = '💬 Sagen';
        lineEl.textContent = customLine || (isRoommate
          ? `🏡 ${active.name} wohnt mit dir zusammen! Plaudert oder setzt euch an den Tisch.`
          : `💬 Sprich mit ${active.name}${active.isNewPerson ? ' – du kannst sie/ihn auch fragen, ob ihr zusammenzieht!' : '!'}`);

        quickEl.innerHTML = '';
        let phrases;
        if (isRoommate) {
          phrases = [
            '🏡 Wie gefällt es dir zuhause?',
            '🍽️ Wollen wir zusammen essen?',
            '🎨 Was wollen wir heute machen?',
            '💛 Schön, dass wir zusammen wohnen!'
          ];
        } else if (active.isNewPerson) {
          const prog = SocialManager.getAcquaintanceProgress(active.id);
          if (prog.stage === 0) {
            phrases = ['👋 Hallo! Ich stell mich vor!', '✨ Wollen wir uns kennenlernen?', '🏡 Wollen wir zusammenziehen?', '🎨 Was sind deine Hobbys?'];
          } else {
            phrases = ['🏡 Wollen wir zusammenziehen?', '🎨 Erzähl mir von deinem Hobby!', '💌 Wollen wir Freunde sein?', '⭐ Du bist super nett!'];
          }
        } else {
          phrases = ['👋 Hallo! Wie geht’s?', '🐾 Wie findest du meine Tiere?', '✨ Richtig schön hier!', '❤️ Danke dir!'];
        }

        phrases.forEach((phrase) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mail-phrase-btn';
          b.textContent = phrase;
          b.addEventListener('click', () => {
            if (onTalkPerson) onTalkPerson(active, phrase);
          });
          quickEl.appendChild(b);
        });
      } else {
        // Pet command target!
        badgeEl.textContent = '🐾 Tier-Anweisung';
        badgeEl.className = 'talk-dock-badge pet';
        inputEl.placeholder = `Anweisung für ${active.name} (z.B. Sitz, Bleib, Komm, Dreh dich)...`;
        sendBtn.textContent = '🐾 Befehl';
        lineEl.textContent = customLine || `🐾 Gib ${active.name} eine Anweisung oder sag ein liebes Wort!`;

        quickEl.innerHTML = '';
        PET_COMMANDS.forEach((cmd) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mail-phrase-btn pet-action-chip';
          b.textContent = `${cmd.icon} ${cmd.label}`;
          b.addEventListener('click', () => {
            if (onCommandPet) onCommandPet(active, { commandId: cmd.id, text: cmd.label });
          });
          quickEl.appendChild(b);
        });

        const praiseBtn = document.createElement('button');
        praiseBtn.type = 'button';
        praiseBtn.className = 'mail-phrase-btn';
        praiseBtn.textContent = '❤️ Brav gemacht!';
        praiseBtn.addEventListener('click', () => {
          if (onCommandPet) onCommandPet(active, { commandId: 'praise', text: 'Brav gemacht!' });
        });
        quickEl.appendChild(praiseBtn);
      }
    }
  }

  function handleSend() {
    const val = (inputEl.value || '').trim();
    if (!val) return;
    const targets = getTargets() || [];
    const active = getResolvedTarget(targets);
    if (!active) return;

    inputEl.value = '';
    if (active.type === 'person') {
      if (onTalkPerson) onTalkPerson(active, val);
    } else if (onCommandPet) {
      onCommandPet(active, { text: val });
    }
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

  function selectTarget(targetId, statusLine = null) {
    selectedTargetId = targetId;
    if (statusLine !== null) customLine = statusLine;
    refresh(statusLine);
  }

  function setStatusLine(text) {
    customLine = text;
    lineEl.textContent = text;
  }

  return {
    refresh,
    selectTarget,
    setStatusLine,
    getSelectedTargetId: () => selectedTargetId
  };
}
