import { PlayerConfig } from './characterData.js';
import { renderCharacter } from './characterRenderer.js';

export function setupEditorUI(stateManager) {
  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');

  // Input Elements
  const bodyHeight = document.getElementById('bodyHeight');
  const heightVal = document.getElementById('heightVal');
  const bodyWidth = document.getElementById('bodyWidth');
  const widthVal = document.getElementById('widthVal');
  const faceSelect = document.getElementById('faceSelect');
  const hairSelect = document.getElementById('hairSelect');
  const hairColor = document.getElementById('hairColor');

  const topStyle = document.getElementById('topStyle');
  const topColor = document.getElementById('topColor');
  const pantsStyle = document.getElementById('pantsStyle');
  const pantsColor = document.getElementById('pantsColor');
  const shoesStyle = document.getElementById('shoesStyle');
  const shoesColor = document.getElementById('shoesColor');

  const stickerSelect = document.getElementById('stickerSelect');
  const addStickerBtn = document.getElementById('addStickerBtn');
  const stickersList = document.getElementById('stickersList');

  const abilityInputs = document.querySelectorAll('input[name="ability"]');
  const toBgSelectBtn = document.getElementById('toBgSelectBtn');

  // Set initial input values from PlayerConfig
  bodyHeight.value = PlayerConfig.body.height;
  heightVal.textContent = PlayerConfig.body.height;
  bodyWidth.value = PlayerConfig.body.width;
  widthVal.textContent = PlayerConfig.body.width;

  faceSelect.value = PlayerConfig.body.faceId;
  hairSelect.value = PlayerConfig.body.hairId;
  hairColor.value = PlayerConfig.body.hairColor;

  topStyle.value = PlayerConfig.clothes.top.style;
  topColor.value = PlayerConfig.clothes.top.color;
  pantsStyle.value = PlayerConfig.clothes.pants.style;
  pantsColor.value = PlayerConfig.clothes.pants.color;
  shoesStyle.value = PlayerConfig.clothes.shoes.style;
  shoesColor.value = PlayerConfig.clothes.shoes.color;

  // Render loop for preview
  function updatePreview() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCharacter(ctx, canvas.width / 2, canvas.height - 50, PlayerConfig, { frame: 0, pose: 'idle' });
  }

  // Bind Listeners
  bodyHeight.addEventListener('input', (e) => {
    PlayerConfig.body.height = parseFloat(e.target.value);
    heightVal.textContent = PlayerConfig.body.height;
    updatePreview();
  });

  bodyWidth.addEventListener('input', (e) => {
    PlayerConfig.body.width = parseFloat(e.target.value);
    widthVal.textContent = PlayerConfig.body.width;
    updatePreview();
  });

  faceSelect.addEventListener('change', (e) => {
    PlayerConfig.body.faceId = e.target.value;
    updatePreview();
  });

  hairSelect.addEventListener('change', (e) => {
    PlayerConfig.body.hairId = e.target.value;
    updatePreview();
  });

  hairColor.addEventListener('input', (e) => {
    PlayerConfig.body.hairColor = e.target.value;
    updatePreview();
  });

  topStyle.addEventListener('change', (e) => {
    PlayerConfig.clothes.top.style = e.target.value;
    updatePreview();
  });

  topColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.top.color = e.target.value;
    updatePreview();
  });

  pantsStyle.addEventListener('change', (e) => {
    PlayerConfig.clothes.pants.style = e.target.value;
    updatePreview();
  });

  pantsColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.pants.color = e.target.value;
    updatePreview();
  });

  shoesStyle.addEventListener('change', (e) => {
    PlayerConfig.clothes.shoes.style = e.target.value;
    updatePreview();
  });

  shoesColor.addEventListener('input', (e) => {
    PlayerConfig.clothes.shoes.color = e.target.value;
    updatePreview();
  });

  // Stickers logic
  addStickerBtn.addEventListener('click', () => {
    if (PlayerConfig.clothes.top.stickers.length >= 3) {
      alert('Maximal 3 Sticker erlaubt!');
      return;
    }
    const newSticker = {
      id: Date.now(),
      type: stickerSelect.value,
      x: (Math.random() - 0.5) * 0.5,
      y: 0.3 + Math.random() * 0.4,
      scale: 1.0
    };
    PlayerConfig.clothes.top.stickers.push(newSticker);
    renderStickersUI();
    updatePreview();
  });

  function renderStickersUI() {
    stickersList.innerHTML = '';
    PlayerConfig.clothes.top.stickers.forEach((sticker, index) => {
      const item = document.createElement('div');
      item.className = 'sticker-item';
      item.innerHTML = `
        <span>Sticker ${index + 1}: ${getStickerName(sticker.type)}</span>
        <div class="sticker-controls">
          <button type="button" class="btn btn-small btn-secondary remove-sticker" data-id="${sticker.id}">❌</button>
        </div>
      `;
      stickersList.appendChild(item);
    });

    stickersList.querySelectorAll('.remove-sticker').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        PlayerConfig.clothes.top.stickers = PlayerConfig.clothes.top.stickers.filter(s => s.id !== id);
        renderStickersUI();
        updatePreview();
      });
    });
  }

  function getStickerName(type) {
    switch (type) {
      case 'star': return '⭐ Stern';
      case 'flame': return '🔥 Flamme';
      case 'heart': return '❤️ Herz';
      case 'lightning': return '⚡ Blitz';
      default: return type;
    }
  }

  abilityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        PlayerConfig.ability = e.target.value;
      }
    });
  });

  toBgSelectBtn.addEventListener('click', () => {
    stateManager.setState('BACKGROUND_SELECT');
  });

  // Initial draw
  updatePreview();
}
