import { useState } from 'react';
import { Typography, Box, Paper, IconButton, Tooltip, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { GREEN, GOLD } from '../theme/colors';

export default function ServerCard({ server }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(server.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        textAlign: 'left',
      }}
    >
      <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3, mb: 3 }}>
        Святкування відбудеться в особливому місці —{' '}
        <Box component="span" sx={{ color: GREEN }}>світі Minecraft</Box>.
        <br />
        Після урочистостей сервер буде відкритий для всіх гостей у режимі виживання!
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        Версія
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.7rem' }, color: GOLD, mb: 3, letterSpacing: 1 }}>
        {server.version}
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        IP-адреса сервера
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: 0,
          px: 2,
          py: 1,
        }}
      >
        <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, color: GREEN, flexGrow: 1, letterSpacing: 1 }}>
          {server.ip}
        </Typography>
        <Tooltip title={copied ? 'Скопійовано!' : 'Копіювати'} placement="top">
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{ color: copied ? GREEN : 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
