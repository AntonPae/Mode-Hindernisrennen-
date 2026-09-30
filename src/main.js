import './style.css';
import { StateManager, State } from './screens/stateManager.js';
import { setupEditorUI } from './editor/editorUI.js';
import { setupBackgroundSelectScreen } from './screens/backgroundSelect.js';
import { RunnerEngine } from './game/runnerEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const stateManager = new StateManager();
  const runnerEngine = new RunnerEngine(stateManager);

  setupEditorUI(stateManager);
  setupBackgroundSelectScreen(stateManager);

  stateManager.onStateChange((newState, payload) => {
    if (newState === State.GAME) {
      runnerEngine.start();
    } else {
      runnerEngine.stop();
    }
  });

  // Initial state setup
  stateManager.setState(State.EDITOR);
});
