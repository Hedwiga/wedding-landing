// 0 = empty, 1 = main red, 2 = highlight, 3 = shadow
const HEART = [
  [0, 2, 2, 0, 0, 2, 2, 0],
  [2, 2, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 3],
  [0, 1, 1, 1, 1, 1, 3, 0],
  [0, 0, 1, 1, 1, 3, 0, 0],
  [0, 0, 0, 1, 3, 0, 0, 0],
];

const COLOR = {
  1: '#C8312A',
  2: '#FF6B6B',
  3: '#7B1313',
};

export default function PixelHeart({ pixelSize = 8 }) {
  return (
    <div style={{ display: 'inline-block', imageRendering: 'pixelated', lineHeight: 0 }}>
      {HEART.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cell, c) => (
            <div
              key={c}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: cell ? COLOR[cell] : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
