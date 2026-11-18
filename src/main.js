import './style.css';
import { StateManager, State } from './screens/stateManager.js';
import { setupEditorUI } from './editor/editorUI.js';
import { setupBackgroundSelectScreen } from './screens/backgroundSelect.js';
import { setupHomeScreen } from './home/homeScreen.js';
import { RunnerEngine } from './game/runnerEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const stateManager = new StateManager();
  const runnerEngine = new RunnerEngine(stateManager);

  setupEditorUI(stateManager);
  setupBackgroundSelectScreen(stateManager);
  setupHomeScreen(stateManager);

  stateManager.onStateChange((newState) => {
    if (newState === State.GAME) {
      runnerEngine.start();
    } else {
      runnerEngine.stop();
    }
  });

  // Initial state setup
  stateManager.setState(State.EDITOR);
});
