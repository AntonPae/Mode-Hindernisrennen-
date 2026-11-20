// Shared crisp canvas comic speech bubble helper used across Town, Store, Home, PetSitting & IceCream scenes

export function drawCanvasSpeechBubble(ctx, anchorX, anchorY, text, opts = {}) {
  if (!ctx || !text) return;
  const {
    maxWidth = 185,
    accent = '#ec4899',
    bg = '#ffffff',
    textColor = '#1e1b4b',
    minX = 10,
    maxX = 9999
  } = opts;

  ctx.save();
  ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';

  // Word-wrap into up to 2 concise lines
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth - 20) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= 2) break;
    }
  }
  if (current && lines.length < 2) lines.push(current);
  if (lines.length === 0) lines.push(String(text).slice(0, 28));

  const lineHeights = lines.length * 14;
  const textWidths = lines.map((l) => ctx.measureText(l).width);
  const bw = Math.max(72, Math.min(maxWidth, Math.max(...textWidths) + 22));
  const bh = lineHeights + 14;

  const bx = Math.max(minX, Math.min(maxX - bw, anchorX - bw / 2));
  const by = Math.max(8, anchorY - bh - 10);

  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, [12]);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Tail pointing down toward speaker
  const tailX = Math.max(bx + 14, Math.min(bx + bw - 14, anchorX));
  ctx.beginPath();
  ctx.moveTo(tailX - 6, by + bh - 1);
  ctx.lineTo(tailX, by + bh + 9);
  ctx.lineTo(tailX + 6, by + bh - 1);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, [12]);
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    ctx.fillText(line, bx + bw / 2, by + 13 + i * 14);
  });

  ctx.restore();
}
