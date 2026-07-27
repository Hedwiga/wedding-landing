import { Typography, Box, Paper, Link } from '@mui/material';
import { GREEN, GOLD } from '../theme/colors';

// Simple pixel suit icon (8×10 grid): 0=empty, 1=dark, 2=white shirt, 3=tie
const SUIT = [
  [0,1,1,1,0,1,1,1,0],
  [0,1,2,1,0,1,2,1,0],
  [0,0,2,1,1,1,2,0,0],
  [0,0,2,2,3,2,2,0,0],
  [0,0,2,2,3,2,2,0,0],
  [0,1,1,2,3,2,1,1,0],
  [0,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,0,1,1,0],
  [0,1,1,0,0,0,1,1,0],
];

// Simple pixel dress icon (8×10 grid): 0=empty, 1=dress, 2=lighter, 3=dark
const DRESS = [
  [0,0,1,1,1,1,0,0,0],
  [0,0,2,1,1,2,0,0,0],
  [0,0,1,1,1,1,0,0,0],
  [0,1,1,1,1,1,1,0,0],
  [0,1,2,1,1,2,1,0,0],
  [1,1,1,1,1,1,1,1,0],
  [1,1,2,1,1,2,1,1,0],
  [1,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,1,1,0,0],
  [0,1,1,0,0,1,1,0,0],
];

const SUIT_COLORS  = { 1: '#2C2C3E', 2: '#F0F0F0', 3: '#C0392B' };
const DRESS_COLORS = { 1: '#C0609A', 2: '#E080BB', 3: '#8B2E6A' };

function PixelFigure({ grid, colors, pixelSize = 6 }) {
  return (
    <Box sx={{ display: 'inline-block', imageRendering: 'pixelated', lineHeight: 0 }}>
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cell, c) => (
            <div key={c} style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: cell ? colors[cell] : 'transparent',
            }} />
          ))}
        </div>
      ))}
    </Box>
  );
}

export default function DressCodeCard() {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        border: `3px solid ${GOLD}44`,
        borderRadius: 0,
        p: { xs: 3, md: 4 },
        mb: 6,
        textAlign: 'left',
      }}
    >
      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
        Дрес-код
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mb: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <PixelFigure grid={SUIT} colors={SUIT_COLORS} pixelSize={7} />
          <Typography sx={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.6)', mt: 1 }}>костюм</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <PixelFigure grid={DRESS} colors={DRESS_COLORS} pixelSize={7} />
          <Typography sx={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.6)', mt: 1 }}>сукня</Typography>
        </Box>
      </Box>

      <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3, mb: 3 }}>
        Ми будемо дуже раді, якщо ви завітаєте до нас у святковому образі!
        <br />
        Оберіть собі скін Minecraft у стилі{' '}
        <Box component="span" sx={{ color: GOLD }}>елегантного костюма або розкішної сукні</Box>{' '}
        — нехай кожен гість виглядає по-особливому в цей чудовий день.
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        Референси для скінів
      </Typography>

      <Box sx={{
        backgroundColor: 'rgba(255,255,255,0.07)',
        border: '2px solid rgba(255,255,255,0.2)',
        px: 2,
        py: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}>
        <Link
          href="https://namemc.com/minecraft-skins/formal"
          target="_blank"
          rel="noopener"
          sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: GREEN, textDecorationColor: `${GREEN}66`, '&:hover': { color: 'white' } }}
        >
          NameMC — формальні скіни →
        </Link>
        <Link
          href="https://www.minecraftskins.com/search/skin/formal"
          target="_blank"
          rel="noopener"
          sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: GREEN, textDecorationColor: `${GREEN}66`, '&:hover': { color: 'white' } }}
        >
          The Skindex — пошук formal →
        </Link>
      </Box>
    </Paper>
  );
}
