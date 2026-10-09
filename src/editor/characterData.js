export const PlayerConfig = {
  body: {
    height: 1.0,      // Skalierung Höhe (0.8 bis 1.2)
    width: 1.0,       // Skalierung Breite (0.8 bis 1.2)
    skinColor: '#f5c29b', // Default Hautfarbe
    faceId: 'face_1',
    hairId: 'hair_3',
    hairColor: '#4a2e00'
  },
  clothes: {
    top: {
      style: 'riding_vest',
      color: '#8b4513',
      stickers: [] // Array of { id, type, x, y, scale }
    },
    pants: {
      style: 'riding_breeches',
      color: '#3d2b1f'
    },
    shoes: {
      style: 'riding_boots',
      color: '#1a0f08'
    }
  },
  ability: 'speed_boost' // Mögliche Werte: 'speed_boost', 'double_jump'
};

export const GameConfig = {
  background: 'meadow' // 'meadow', 'cave', 'neon'
};
