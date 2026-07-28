import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CssBaseline, Container, Box, CircularProgress } from '@mui/material';
import background from './assets/background-2.jpg';
import CherryBlossoms from './components/CherryBlossoms';
import ServerCard from './components/ServerCard';
import DressCodeCard from './components/DressCodeCard';
import WeddingDateCard from './components/WeddingDateCard';
import MinecraftProfileCard from './components/MinecraftProfileCard';
import InvitationCard from './components/InvitationCard';
import GreetingCard from './components/GreetingCard';
import ResourcePackCard from './components/ResourcePackCard';
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

  const eventStarted = guest && Date.now() >= new Date(guest.content.weddingDateTime).getTime();

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
            position: 'fixed',
            inset: 0,
            zIndex: -1,
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
          {isLoading || !guest ? (
            <CircularProgress size={14} sx={{ color: GOLD }} />
          ) : (
            <>
              <GreetingCard coupleNames={guest.content.coupleNames} firstName={guest.firstName} />
              <InvitationCard />
              <WeddingDateCard
                guestId={guestId}
                initialAttending={guest.attending}
                weddingDateTime={guest.content.weddingDateTime}
                weddingTimezone={guest.content.weddingTimezone}
                nickname={guest.nickname}
                hasSkin={guest.hasSkin}
              />

              {guest.attending && (
                <>
                  <DressCodeCard />
                  <MinecraftProfileCard
                    guestId={guestId}
                    initialNickname={guest.nickname}
                    initialHasSkin={guest.hasSkin}
                  />
                  <ResourcePackCard />
                </>
              )}

              {(guest.attending || eventStarted) && (
                <ServerCard server={guest.content.minecraftServer} />
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export default App;
