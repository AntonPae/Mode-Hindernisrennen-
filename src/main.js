import './style.css';
import { StateManager, State } from './screens/stateManager.js';
import { setupEditorUI } from './editor/editorUI.js';
import { setupBackgroundSelectScreen } from './screens/backgroundSelect.js';
import { setupTownScreen } from './town/townScreen.js';
import { setupHomeScreen } from './home/homeScreen.js';
import { setupIceCreamScreen } from './jobs/iceCreamScreen.js';
import { setupPetSittingScreen } from './jobs/petSittingScreen.js';
import { setupEarnMoneyUI } from './economy/earnMoneyUI.js';
import { setupMailboxUI } from './mailbox/mailboxUI.js';
import { setupEventScreen } from './mailbox/eventScreen.js';
import { RunnerEngine } from './game/runnerEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const stateManager = new StateManager();
  const runnerEngine = new RunnerEngine(stateManager);

  setupEditorUI(stateManager);
  setupBackgroundSelectScreen(stateManager);
  setupTownScreen(stateManager);
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

  window.addEventListener('runner:coins-updated', () => {
    earnMoneyUI.refreshBadges();
    mailboxUI.refreshMailboxButtons();
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
    earnMoneyUI.refreshBadges();
    mailboxUI.refreshMailboxButtons();
  });

  // Initial state setup
  stateManager.setState(State.EDITOR);
});
