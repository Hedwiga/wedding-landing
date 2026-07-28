import { Box, Typography } from '@mui/material';
import { GOLD } from '../theme/colors';
import CherryBlossoms from '../components/CherryBlossoms';
import background from '../assets/background-2.jpg';

export default function SorryPage() {
  return (
    <>
      <CherryBlossoms count={30} />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: `3px solid ${GOLD}44`,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            maxWidth: 480,
            mx: 2,
          }}
        >
          {/* Pixel "X" mark */}
          <Typography sx={{ fontSize: '2rem', color: '#FF6B6B', mb: 2, lineHeight: 1 }}>
            ✖
          </Typography>
          <Typography
            sx={{ fontSize: { xs: '0.65rem', md: '0.85rem' }, color: GOLD, lineHeight: 2.5, mb: 3 }}
          >
            Ця сторінка тільки для запрошених гостей
          </Typography>
          <Typography
            sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.6)', lineHeight: 2.8 }}
          >
            Якщо ти отримав запрошення —
            <br />
            перевір посилання у своєму повідомленні.
            <br />
            Якщо посилання неробоче, зв&apos;яжись з нами.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
