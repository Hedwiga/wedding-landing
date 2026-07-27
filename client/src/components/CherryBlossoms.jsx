import { useMemo } from 'react';

const COLORS = ['#FFB7C5', '#FF9EB5', '#FFC8D5', '#FFADC0', '#FF85A1', '#FFD6E0', '#ffffff'];
const SIZES = [6, 8, 10, 12];
// X-shape sizes must divide evenly by 3 for clean pixel grid
const X_SIZES = [9, 12];

// Positions of the 5 filled cells in a 3x3 + pattern (col, row)
const X_CELLS = [[1,0],[0,1],[1,1],[2,1],[1,2]];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function darkenColor(hex, amount = 70) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export default function CherryBlossoms({ count = 40 }) {
  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const isX = Math.random() > 0.55;
      const sizePool = isX ? X_SIZES : SIZES;
      return {
        id: i,
        isX,
        left: randomBetween(0, 100),
        size: sizePool[Math.floor(Math.random() * sizePool.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: randomBetween(6, 14),
        delay: randomBetween(0, 12),
        sway: randomBetween(40, 120),
        swayDirection: Math.random() > 0.5 ? 1 : -1,
      };
    }),
  [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      {petals.map((p) => {
        const px = p.size / 3;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              imageRendering: 'pixelated',
              animation: `fall-${p.id} ${p.duration}s ${p.delay}s infinite linear`,
              // square petals get a solid bg; X petals use child cells only
              backgroundColor: p.isX ? 'transparent' : p.color,
            }}
          >
            {p.isX ? (
              <>
                {X_CELLS.map(([col, row]) => {
                  const isCenter = col === 1 && row === 1;
                  return (
                    <div key={`${col}-${row}`} style={{
                      position: 'absolute',
                      width: `${px}px`,
                      height: `${px}px`,
                      left: `${col * px}px`,
                      top: `${row * px}px`,
                      backgroundColor: isCenter ? darkenColor(p.color) : p.color,
                    }} />
                  );
                })}
              </>
            ) : (
              <div style={{
                position: 'absolute',
                width: `${px}px`,
                height: `${px}px`,
                backgroundColor: darkenColor(p.color),
                bottom: 0,
                right: 0,
              }} />
            )}
          </div>
        );
      })}
      <style>{petals.map((p) => `
        @keyframes fall-${p.id} {
          0%   { transform: translateY(-20px) translateX(0px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.9; }
          95%  { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(${p.swayDirection * p.sway}px) rotate(${Math.floor(randomBetween(1,4)) * 90}deg); opacity: 0; }
        }
      `).join('')}</style>
    </div>
  );
}
