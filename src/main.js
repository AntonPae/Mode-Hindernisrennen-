import './style.css';
import { StateManager, State } from './screens/stateManager.js';
import { setupEditorUI } from './editor/editorUI.js';
import { setupBackgroundSelectScreen } from './screens/backgroundSelect.js';
import { setupTownScreen } from './town/townScreen.js';
import { setupHomeScreen } from './home/homeScreen.js';
import { setupIceCreamScreen } from './jobs/iceCreamScreen.js';
import { setupPetSittingScreen } from './jobs/petSittingScreen.js';
import { setupEarnMoneyUI } from './economy/earnMoneyUI.js';
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

  const earnMoneyUI = setupEarnMoneyUI({
    onCoinsChange: () => {
      window.dispatchEvent(new CustomEvent('runner:coins-updated'));
    }
  });

  window.addEventListener('runner:coins-updated', () => {
    earnMoneyUI.refreshBadges();
  });

  stateManager.onStateChange((newState) => {
    if (newState === State.GAME) {
      runnerEngine.start();
    } else {
      runnerEngine.stop();
    }
    earnMoneyUI.refreshBadges();
  });

  // Initial state setup
  stateManager.setState(State.EDITOR);
});
