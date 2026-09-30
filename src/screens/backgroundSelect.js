import { GameConfig } from '../editor/characterData.js';

export function setupBackgroundSelectScreen(stateManager) {
  const bgCards = document.querySelectorAll('.bg-card');
  const backToEditorBtn = document.getElementById('backToEditorBtn');

  bgCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedBg = card.dataset.bg;
      GameConfig.background = selectedBg;

      // Highlight selected card visually
      bgCards.forEach(c => c.style.borderColor = '#334155');
      card.style.borderColor = '#60a5fa';

      // Transition to game state
      stateManager.setState('GAME', { background: selectedBg });
    });
  });

  if (backToEditorBtn) {
    backToEditorBtn.addEventListener('click', () => {
      stateManager.setState('EDITOR');
    });
  }
}
