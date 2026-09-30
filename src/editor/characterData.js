export const PlayerConfig = {
  body: {
    height: 1.0,      // Skalierung Höhe (0.8 bis 1.2)
    width: 1.0,       // Skalierung Breite (0.8 bis 1.2)
    faceId: 'face_1',
    hairId: 'hair_3',
    hairColor: '#4a2e00'
  },
  clothes: {
    top: {
      style: 'hoodie',
      color: '#0055ff',
      stickers: [] // Array of { id, type, x, y, scale }
    },
    pants: {
      style: 'jeans',
      color: '#222222'
    },
    shoes: {
      style: 'sneakers',
      color: '#ffffff'
    }
  },
  ability: 'speed_boost' // Mögliche Werte: 'speed_boost', 'double_jump'
};

export const GameConfig = {
  background: 'meadow' // 'meadow', 'cave', 'neon'
};
