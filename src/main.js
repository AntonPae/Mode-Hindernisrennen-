import './style.css';
import { StateManager, State } from './screens/stateManager.js';
import { ShopManager } from './editor/shopData.js';
import { BankManager } from './economy/bankData.js';
import { setupEditorUI } from './editor/editorUI.js';
import { setupBackgroundSelectScreen } from './screens/backgroundSelect.js';
import { setupTownScreen } from './town/townScreen.js';
import { setupStoreScreen } from './town/storeScreen.js';
import { setupBankScreen } from './town/bankScreen.js';
import { setupHomeScreen } from './home/homeScreen.js';
import { setupIceCreamScreen } from './jobs/iceCreamScreen.js';
import { setupPetSittingScreen } from './jobs/petSittingScreen.js';
import { setupEarnMoneyUI } from './economy/earnMoneyUI.js';
import { setupMailboxUI } from './mailbox/mailboxUI.js';
import { setupEventScreen } from './mailbox/eventScreen.js';
import { RunnerEngine } from './game/runnerEngine.js';
import { setupHighscoreUI } from './game/highscoreUI.js';

function syncMoneyAndBankBadges() {
  const wallet = ShopManager.getCoins();
  const bankBal = BankManager.getBalance();
  document.querySelectorAll('[data-bank-val]').forEach((el) => {
    el.textContent = bankBal;
  });
  [
    'editorCoinsVal',
    'bgCoinsVal',
    'townCoinsVal',
    'storeCoinsVal',
    'homeCoinsVal',
    'iceCoinsVal',
    'petCoinsVal',
    'eventCoinsVal'
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = wallet;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const stateManager = new StateManager();
  const runnerEngine = new RunnerEngine(stateManager);

  setupEditorUI(stateManager);
  setupBackgroundSelectScreen(stateManager);
  setupTownScreen(stateManager);
  setupStoreScreen(stateManager);
  setupBankScreen(stateManager);
  setupHomeScreen(stateManager);
  setupIceCreamScreen(stateManager);
  setupPetSittingScreen(stateManager);
  setupEventScreen(stateManager);

  const earnMoneyUI = setupEarnMoneyUI({
    onCoinsChange: () => {
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    }
  });
  const mailboxUI = setupMailboxUI(stateManager);
  const highscoreUI = setupHighscoreUI();

  window.addEventListener('runner:open-highscores', (e) => {
    const tab = e?.detail?.tab || 'top';
    const onClose = e?.detail?.onClose || null;
    highscoreUI.openModal(tab, { onClose });
  });

  window.addEventListener('runner:coins-updated', () => {
    syncMoneyAndBankBadges();
    earnMoneyUI.refreshBadges();
    mailboxUI.refreshMailboxButtons();
  });

  window.addEventListener('runner:bank-updated', () => {
    syncMoneyAndBankBadges();
    earnMoneyUI.refreshBadges();
  });

  window.addEventListener('runner:mailbox-updated', () => {
    mailboxUI.refreshMailboxButtons();
  });

  stateManager.onStateChange((newState) => {
    if (newState === State.GAME) {
      runnerEngine.start();
    } else {
      runnerEngine.stop();
    }
    syncMoneyAndBankBadges();
    earnMoneyUI.refreshBadges();
    mailboxUI.refreshMailboxButtons();
  });

  syncMoneyAndBankBadges();

  // Initial state setup
  stateManager.setState(State.EDITOR);
});
