import { useState } from 'react';
import { Typography, Box, Paper, IconButton, Tooltip, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { GREEN, GOLD } from '../theme/colors';

function CopyableField({ label, value, copiedField, onCopy }) {
  const copied = copiedField === label;
  return (
    <>
      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>

      {value ? (
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
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, color: GREEN, flexGrow: 1, letterSpacing: 1 }}>
            {value}
          </Typography>
          <Tooltip title={copied ? 'Скопійовано!' : 'Копіювати'} placement="top">
            <IconButton
              onClick={() => onCopy(label, value)}
              size="small"
              sx={{ color: copied ? GREEN : 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.4)', mb: 3 }}>
          З'явиться за 10 хвилин до події
        </Typography>
      )}
    </>
  );
}

export default function ServerCard({ server }) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
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
        <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: 'rgba(255,255,255,0.5)', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
          Версія
        </Typography>

        <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.7rem' }, color: GOLD, mb: 3, letterSpacing: 1 }}>
          {server.version}
        </Typography>

        <CopyableField label="IP-адреса сервера" value={server.ip} copiedField={copiedField} onCopy={handleCopy} />
        <CopyableField label="Пароль" value={server.password} copiedField={copiedField} onCopy={handleCopy} />
      </Paper>
  );
}
