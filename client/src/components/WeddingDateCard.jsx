import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Paper, Button, Stack, CircularProgress } from '@mui/material';
import PixelHeart from './PixelHeart';
import { GREEN, GOLD } from '../theme/colors';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 31 July 2026, 19:00 Kyiv time (UTC+3)
const WEDDING_DATE = new Date('2026-07-31T19:00:00+03:00');

function getTimeLeft() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

async function submitRsvp({ guestId, attending }) {
  const res = await fetch(`${API_BASE}/guest/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: guestId, attending }),
  });
  if (!res.ok) throw new Error('Failed to submit RSVP');
  return res.json();
}

function CountdownUnit({ value, label }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: { xs: 48, md: 64 } }}>
      <Box sx={{
        backgroundColor: `${GREEN}18`,
        border: `2px solid ${GREEN}66`,
        px: { xs: 1, md: 2 },
        py: 1,
        mb: 1,
      }}>
        <Typography sx={{ fontSize: { xs: '1rem', md: '1.4rem' }, color: GREEN, lineHeight: 1.2 }}>
          {String(value).padStart(2, '0')}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: { xs: '0.35rem', md: '0.42rem' }, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

const RSVP_OPTIONS = [
  { value: 'yes', label: '✔ Так, буду!',   color: GREEN },
  { value: 'no',  label: '✘ На жаль, ні', color: '#FF6B6B' },
];

export default function WeddingDateCard({ guestId, initialAttending }) {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [rsvp, setRsvp] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Sync pre-existing RSVP once the guest query resolves
  useEffect(() => {
    if (initialAttending === null || initialAttending === undefined) return;
    setRsvp(initialAttending ? 'yes' : 'no');
    setSubmitted(true);
  }, [initialAttending]);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: submitRsvp,
    onSuccess: (data) => {
      // Update the cached guest so the greeting reflects the latest state
      queryClient.setQueryData(['guest', guestId], data);
      setSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (rsvp) mutate({ guestId, attending: rsvp === 'yes' });
  };

  const handleChange = () => setSubmitted(false);

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        border: `3px solid ${GREEN}44`,
        borderRadius: 0,
        p: { xs: 3, md: 4 },
        mb: 6,
        textAlign: 'center',
      }}
    >
      <Stack spacing={2}>

        {/* Date */}
        <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: `rgba(255,255,255,0.5)`, textTransform: 'uppercase', letterSpacing: 1 }}>
          Дата та час
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, color: GOLD, lineHeight: 2 }}>
          31 липня 2026
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.7rem' }, color: 'rgba(255,255,255,0.75)' }}>
          19:00 за київським часом
        </Typography>

        {/* Countdown */}
        {timeLeft ? (
          <>
            <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.5rem' }, color: `${GOLD}99`, textTransform: 'uppercase', letterSpacing: 1 }}>
              До урочистості залишилось
            </Typography>
            <Stack direction="row" spacing={{ xs: 1, md: 2 }} justifyContent="center">
              <CountdownUnit value={timeLeft.days}    label="днів" />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', alignSelf: 'flex-start', mt: '6px' }}>:</Typography>
              <CountdownUnit value={timeLeft.hours}   label="годин" />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', alignSelf: 'flex-start', mt: '6px' }}>:</Typography>
              <CountdownUnit value={timeLeft.minutes} label="хвилин" />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', alignSelf: 'flex-start', mt: '6px' }}>:</Typography>
              <CountdownUnit value={timeLeft.seconds} label="секунд" />
            </Stack>
          </>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <PixelHeart pixelSize={8} />
            </Box>
            <Typography sx={{ fontSize: '0.6rem', color: GOLD }}>
              Свято вже почалось! 🎉
            </Typography>
          </Box>
        )}

        {/* RSVP */}
        <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: `${GOLD}99`, textTransform: 'uppercase', letterSpacing: 1 }}>
          Чи будеш ти на святі?
        </Typography>

        {!submitted ? (
          <>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              {RSVP_OPTIONS.map(({ value, label, color }) => (
                <Box
                  key={value}
                  onClick={() => setRsvp(value)}
                  sx={{
                    cursor: 'pointer',
                    border: `2px solid ${rsvp === value ? color : 'rgba(255,255,255,0.2)'}`,
                    backgroundColor: rsvp === value ? `${color}22` : 'transparent',
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: color, backgroundColor: `${color}11` },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: rsvp === value ? color : 'rgba(255,255,255,0.7)' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Box>
              <Button
                variant="contained"
                disabled={!rsvp || isPending}
                onClick={handleSubmit}
                sx={{
                  borderRadius: 0,
                  fontSize: { xs: '0.4rem', md: '0.5rem' },
                  px: 4,
                  py: 1.5,
                  backgroundColor: GOLD,
                  color: '#000',
                  '&:hover': { backgroundColor: '#e8b055' },
                  '&:disabled': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
                }}
              >
                {isPending ? <CircularProgress size={12} sx={{ color: '#000' }} /> : 'Підтвердити'}
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: rsvp === 'yes' ? GREEN : '#FF6B6B', lineHeight: 2.5, mb: 1 }}>
              {rsvp === 'yes'
                ? 'Чудово! Чекаємо тебе на святі! 💚'
                : 'Шкода, що не зможеш. Будемо сумувати! 🌸'}
            </Typography>
            <Button
              variant="text"
              onClick={handleChange}
              sx={{ fontSize: { xs: '0.35rem', md: '0.42rem' }, color: `${GOLD}66`, '&:hover': { color: GOLD }, borderRadius: 0 }}
            >
              Змінити відповідь
            </Button>
          </Box>
        )}

      </Stack>
    </Paper>
  );
}
