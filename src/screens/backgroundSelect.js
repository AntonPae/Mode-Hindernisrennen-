import { GameConfig } from '../editor/characterData.js';

export function setupBackgroundSelectScreen(stateManager) {
  const bgCards = document.querySelectorAll('.bg-card');
  const backToEditorBtn = document.getElementById('backToEditorBtn');

  bgCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedBg = card.dataset.bg;
      GameConfig.background = selectedBg;

      // Highlight selected card visually with cinematic gold border
      bgCards.forEach(c => c.style.borderColor = 'rgba(245, 158, 11, 0.35)');
      card.style.borderColor = '#f59e0b';

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
