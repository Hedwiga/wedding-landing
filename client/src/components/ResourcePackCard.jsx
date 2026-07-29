import { Typography, Paper, Box } from '@mui/material';
import { GREEN, GOLD } from '../theme/colors';

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

      <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3 }}>
        Щоб свято виглядало особливо — у нас буде <Box component="span" sx={{ color: GOLD }}>весільний пакет ресурсів</Box>.
        Він ще готується. Посилання на завантаження з'явиться тут, а також ми поділимось ним на Discord-сервері.
      </Typography>
    </Paper>
  );
}
