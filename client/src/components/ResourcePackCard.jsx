import { Typography, Box, Paper, Stack, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { GREEN, GOLD } from '../theme/colors';

// Drop resourcepack.zip into client/public/ to make the download work.
const PACK_URL = '/resourcepack.zip';

const STEPS = [
  { num: '1', text: 'Натисни на іконку завантаження вище та збережи zip-файл' },
  { num: '2', text: 'Розмістити цей zip файл(не розархівовувати) за шляхом ".minecraft/resourcepacks/wedding-resourcepack_3.zip"' },
  { num: '3', text: 'Зайти в майнкрайт, в налаштуваннях ресурс паків перемістити його у список активних і зберегти.' },
];

// Pixel download arrow icon (7×8 grid): 0=empty 1=main 2=shadow
const ARROW = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [1, 1, 1, 2, 1, 1, 1],
  [0, 1, 1, 2, 1, 1, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
];

const ARROW_COLORS = { 1: GREEN, 2: '#3A8A30' };

function PixelDownloadIcon({ pixelSize = 5 }) {
  return (
    <Box sx={{ display: 'inline-block', imageRendering: 'pixelated', lineHeight: 0 }}>
      {ARROW.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cell, c) => (
            <div key={c} style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: cell ? ARROW_COLORS[cell] : 'transparent',
            }} />
          ))}
        </div>
      ))}
    </Box>
  );
}

export default function ResourcePackCard() {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        border: `3px solid ${GREEN}44`,
        borderRadius: 0,
        p: { xs: 3, md: 4 },
        mb: 6,
        textAlign: 'left',
      }}
    >
      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: `${GREEN}99`, mb: 2.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        Пакет ресурсів
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3, mb: 3 }}>
        Щоб свято виглядало особливо —
        встанови наш{' '}
        <Box component="span" sx={{ color: GOLD }}>весільний пакет ресурсів</Box>
        {' '}перед входом на сервер.
      </Typography>

      {/* Download button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Tooltip title="Завантажити пакет ресурсів" placement="top">
          <IconButton
            component="a"
            href={PACK_URL}
            download="wedding-resourcepack.zip"
            sx={{
              border: `2px solid ${GREEN}66`,
              backgroundColor: `${GREEN}18`,
              borderRadius: 0,
              p: 2,
              '&:hover': {
                backgroundColor: `${GREEN}33`,
                borderColor: GREEN,
              },
              transition: 'all 0.15s',
            }}
          >
            <PixelDownloadIcon pixelSize={6} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Steps */}
      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.5rem' }, color: `${GREEN}99`, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
        Як встановити
      </Typography>

      <Stack spacing={2}>
        {STEPS.map(({ num, text }) => (
          <Box key={num} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{
              minWidth: 20,
              height: 20,
              backgroundColor: `${GREEN}22`,
              border: `2px solid ${GREEN}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Typography sx={{ fontSize: '0.8rem', color: GREEN, lineHeight: 1 }}>
                {num}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.8)', lineHeight: 2.5 }}>
              {text}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.5rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 2.5, mt: 3 }}>
        Користуєшся TLauncher? Є{' '}
        <Box
          component="a"
          href="https://tlauncher.org/en/install-texture-packs.html"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: GREEN, textDecoration: 'underline' }}
        >
          офіційний туторіал
        </Box>
        {' '}— дивись, починаючи з кроку 4.
      </Typography>
    </Paper>
  );
}
