import { useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { GREEN } from '../theme/colors';

export default function InvitationCard({ server }) {
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
        <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3 }}>
          Святкування відбудеться в особливому місці —{' '}
          <Box component="span" sx={{ color: GREEN }}>світі Minecraft</Box>.
          <br />
          Після урочистостей сервер буде відкритий для всіх гостей у режимі виживання!
        </Typography>
      </Paper>
  );
}
