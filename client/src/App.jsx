import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CssBaseline, Container, Typography, Box, CircularProgress } from '@mui/material';
import background from './assets/background-2.jpg';
import CherryBlossoms from './components/CherryBlossoms';
import PixelHeart from './components/PixelHeart';
import ServerCard from './components/ServerCard';
import DressCodeCard from './components/DressCodeCard';
import WeddingDateCard from './components/WeddingDateCard';
import { GOLD } from './theme/colors';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchGuest(guestId) {
  const res = await fetch(`${API_BASE}/guest/${guestId}`);
  if (!res.ok) throw new Error('Guest not found');
  return res.json();
}

function App() {
  const { guestId } = useParams();

  const { data: guest, isLoading } = useQuery({
    queryKey: ['guest', guestId],
    queryFn: () => fetchGuest(guestId),
    retry: false,
  });

  return (
    <>
      <CssBaseline />
      <CherryBlossoms count={45} />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: { xs: 6, md: 10 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(4px)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 20 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <PixelHeart pixelSize={10} />
          </Box>

          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontSize: { xs: '1rem', md: '1.6rem' }, color: 'white', lineHeight: 2, mb: 2 }}
          >
            Діма і Марічка
          </Typography>

          <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.7rem' }, color: GOLD, lineHeight: 2.5, mb: 6 }}>
            {isLoading
              ? <CircularProgress size={14} sx={{ color: GOLD }} />
              : `запрошують ${guest?.name ?? 'вас на весілля'}`}
          </Typography>
          <ServerCard />
          <DressCodeCard />
          <WeddingDateCard guestId={guestId} initialAttending={guest?.attending ?? null} />
        </Container>
      </Box>
    </>
  );
}

export default App;
