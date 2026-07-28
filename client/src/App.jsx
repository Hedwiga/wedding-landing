import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CssBaseline, Container, Typography, Box, CircularProgress } from '@mui/material';
import background from './assets/background-2.jpg';
import CherryBlossoms from './components/CherryBlossoms';
import PixelHeart from './components/PixelHeart';
import ServerCard from './components/ServerCard';
import DressCodeCard from './components/DressCodeCard';
import WeddingDateCard from './components/WeddingDateCard';
import MinecraftProfileCard from './components/MinecraftProfileCard';
import SorryPage from './pages/SorryPage';
import { GOLD } from './theme/colors';

async function fetchGuest(guestId) {
  const res = await fetch(`/api/guest/${guestId}`);
  if (!res.ok) throw new Error('Guest not found');
  return res.json();
}

function App() {
  const { guestId } = useParams();

  const { data: guest, isLoading, isError } = useQuery({
    queryKey: ['guest', guestId],
    queryFn: () => fetchGuest(guestId),
    retry: false,
  });

  if (isError) return <SorryPage />;

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

          {isLoading || !guest ? (
            <CircularProgress size={14} sx={{ color: GOLD }} />
          ) : (
            <>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', md: '1.6rem' }, color: 'white', lineHeight: 2, mb: 2 }}
              >
                {guest.content.coupleNames}
              </Typography>

              <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.7rem' }, color: GOLD, lineHeight: 2.5, mb: 6 }}>
                {`запрошують ${guest.firstName}`}
              </Typography>
              <ServerCard server={guest.content.minecraftServer} />
              <DressCodeCard />
              <WeddingDateCard
                guestId={guestId}
                initialAttending={guest.attending}
                weddingDateTime={guest.content.weddingDateTime}
                weddingTimezone={guest.content.weddingTimezone}
              />
              <MinecraftProfileCard
                guestId={guestId}
                initialNickname={guest.nickname}
                initialHasSkin={guest.hasSkin}
              />
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export default App;
