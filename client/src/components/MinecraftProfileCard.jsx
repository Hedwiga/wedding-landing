import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Typography, Box, Paper, Button, Stack, TextField, CircularProgress } from '@mui/material';
import { GREEN, GOLD } from '../theme/colors';

async function saveNickname({ guestId, nickname }) {
  const res = await fetch(`/api/guest/${guestId}/nickname`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  });
  if (!res.ok) throw new Error('Не вдалося зберегти нікнейм');
  return res.json();
}

async function uploadSkin({ guestId, file }) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`/api/guest/${guestId}/skin`, { method: 'POST', body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? 'Не вдалося завантажити скін');
  }
}

export default function MinecraftProfileCard({ guestId, initialNickname, initialHasSkin }) {
  const [nickname, setNickname] = useState(initialNickname ?? '');
  const [hasSkin, setHasSkin] = useState(initialHasSkin);
  const [skinVersion, setSkinVersion] = useState(0);

  const nicknameMutation = useMutation({ mutationFn: saveNickname });

  const skinMutation = useMutation({
    mutationFn: uploadSkin,
    onSuccess: () => {
      setHasSkin(true);
      setSkinVersion((v) => v + 1);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) skinMutation.mutate({ guestId, file });
  };

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
        <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Твій нікнейм у грі
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" alignItems="stretch">
          <TextField
            size="small"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            inputProps={{ maxLength: 20 }}
            sx={{
              flex: 1,
              input: { color: GOLD, fontSize: '0.6rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: `${GREEN}66` },
            }}
          />
          <Button
            variant="contained"
            disabled={!nickname || nicknameMutation.isPending}
            onClick={() => nicknameMutation.mutate({ guestId, nickname })}
            sx={{
              borderRadius: 0,
              fontSize: '0.4rem',
              px: 2,
              flexShrink: 0,
              backgroundColor: GOLD,
              color: '#000',
              '&:hover': { backgroundColor: '#e8b055' },
              '&:disabled': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {nicknameMutation.isPending ? <CircularProgress size={12} sx={{ color: '#000' }} /> : 'Зберегти'}
          </Button>
        </Stack>
        {nicknameMutation.isSuccess && (
          <Typography sx={{ fontSize: '0.4rem', color: GREEN }}>Збережено!</Typography>
        )}
        {nicknameMutation.isError && (
          <Typography sx={{ fontSize: '0.4rem', color: '#FF6B6B' }}>{nicknameMutation.error.message}</Typography>
        )}

        <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, mt: 2 }}>
          Твій скін
        </Typography>

        {hasSkin && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={`/api/guest/${guestId}/skin?v=${skinVersion}`}
              alt="Прев'ю скіна"
              style={{ width: 64, height: 64, imageRendering: 'pixelated', border: `2px solid ${GREEN}66` }}
            />
          </Box>
        )}

        <Button
          component="label"
          variant="outlined"
          disabled={skinMutation.isPending}
          sx={{
            borderRadius: 0,
            fontSize: '0.4rem',
            color: GREEN,
            borderColor: `${GREEN}66`,
            alignSelf: 'center',
            px: 2,
            py: 1.2,
            '&:hover': { borderColor: GREEN },
          }}
        >
          {skinMutation.isPending
            ? <CircularProgress size={12} sx={{ color: GREEN }} />
            : (hasSkin ? 'Замінити скін' : 'Завантажити скін')}
          <input type="file" accept="image/png" hidden onChange={handleFileChange} />
        </Button>

        {skinMutation.isError && (
          <Typography sx={{ fontSize: '0.4rem', color: '#FF6B6B' }}>{skinMutation.error.message}</Typography>
        )}
      </Stack>
    </Paper>
  );
}
