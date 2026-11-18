import { ShopManager } from './shopData.js';

export const PlayerConfig = {
  body: {
    height: 1.0,      // Skalierung Höhe (0.8 bis 1.2)
    width: 1.0,       // Skalierung Breite (0.8 bis 1.2)
    faceId: 'face_1',
    hairId: 'hair_1',
    hairColor: '#4a2e00'
  },
  clothes: {
    top: {
      style: 'tshirt',
      color: '#0055ff',
      stickers: [] // Array of { id, type, x, y, scale }
    },
    pants: {
      style: 'shorts',
      color: '#222222'
    },
    shoes: {
      style: 'sneakers',
      color: '#ffffff'
    }
  },
  ability: 'speed_boost' // 'speed_boost', 'double_jump', 'coin_magnet', 'shield'
};

ShopManager.loadPlayerConfig(PlayerConfig);

export const GameConfig = {
  background: 'meadow' // 'meadow', 'cave', 'neon'
};
