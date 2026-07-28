import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Paper, Button, Stack, CircularProgress } from '@mui/material';
import PixelHeart from './PixelHeart';
import { GREEN, GOLD } from '../theme/colors';

function formatDateParts(date, timezone, options) {
  return new Intl.DateTimeFormat('uk-UA', { ...options, timeZone: timezone })
    .formatToParts(date)
    .filter((part) => part.type !== 'literal' || part.value === ' ' || part.value === ':')
    .map((part) => part.value)
    .join('')
    .trim();
}

function getTimeLeft(weddingDate) {
  const diff = weddingDate - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

async function submitRsvp({ guestId, attending }) {
  const res = await fetch(`/api/guest/${guestId}/rsvp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attending }),
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

function CountdownSeparator() {
  return (
    <Box sx={{
      border: '2px solid transparent',
      py: 1,
      mb: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Typography sx={{ fontSize: { xs: '1rem', md: '1.4rem' }, color: 'rgba(255,255,255,0.3)', lineHeight: 1.2 }}>
        :
      </Typography>
    </Box>
  );
}

const RSVP_OPTIONS = [
  { value: 'yes', label: '✔ Так, буду!',   color: GREEN },
  { value: 'no',  label: '✘ На жаль, ні', color: '#FF6B6B' },
];

export default function WeddingDateCard({ guestId, initialAttending, weddingDateTime, weddingTimezone, nickname, hasSkin }) {
  const queryClient = useQueryClient();
  const weddingDate = useMemo(() => new Date(weddingDateTime), [weddingDateTime]);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(weddingDate));
  const [rsvp, setRsvp] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const dateDisplay = formatDateParts(weddingDate, weddingTimezone, { day: 'numeric', month: 'long', year: 'numeric' });
  const timeDisplay = formatDateParts(weddingDate, weddingTimezone, { hour: '2-digit', minute: '2-digit', hour12: false });

  // Sync pre-existing RSVP once the guest query resolves
  useEffect(() => {
    if (initialAttending === null || initialAttending === undefined) return;
    setRsvp(initialAttending ? 'yes' : 'no');
    setSubmitted(true);
  }, [initialAttending]);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

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
          {dateDisplay}
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.7rem' }, color: 'rgba(255,255,255,0.75)' }}>
          {timeDisplay} за київським часом
        </Typography>

        {/* Countdown */}
        {timeLeft ? (
          <>
            <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.5rem' }, color: `${GOLD}99`, textTransform: 'uppercase', letterSpacing: 1 }}>
              До урочистості залишилось
            </Typography>
            <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} justifyContent="center">
              <CountdownUnit value={timeLeft.days}    label="днів" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.hours}   label="годин" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.minutes} label="хвилин" />
              <CountdownSeparator />
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
        {timeLeft && (
          <>
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
                {rsvp === 'yes' && (!nickname || !hasSkin) && (
                  <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.55rem' }, color: `${GOLD}99`, lineHeight: 2, mb: 1 }}>
                    Не забудь вказати нікнейм і завантажити скін нижче 👇
                  </Typography>
                )}
                <Button
                  variant="text"
                  onClick={handleChange}
                  sx={{ fontSize: { xs: '0.5rem', md: '0.5rem' }, color: `${GOLD}66`, '&:hover': { color: GOLD }, borderRadius: 0 }}
                >
                  Змінити відповідь
                </Button>
              </Box>
            )}
          </>
        )}

      </Stack>
    </Paper>
  );
}
