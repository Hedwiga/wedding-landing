import { Typography, Box, Paper, Tooltip, IconButton } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { GREEN, GOLD } from '../theme/colors';

export default function DiscordCard({ inviteUrl }) {
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
      <Typography sx={{ fontSize: { xs: '0.45rem', md: '0.55rem' }, color: `${GREEN}99`, mb: 2.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        Discord
      </Typography>

      <Typography sx={{ fontSize: { xs: '0.5rem', md: '0.6rem' }, color: 'rgba(255,255,255,0.9)', lineHeight: 3, mb: 3 }}>
        Приєднуйся до нашого{' '}
        <Box component="span" sx={{ color: GOLD }}>Discord-сервера</Box>
        {' '}, щоб бути на зв'язку до й під час свята.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="Приєднатися до Discord" placement="top">
          <IconButton
            component="a"
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              border: `2px solid ${GREEN}66`,
              backgroundColor: `${GREEN}18`,
              borderRadius: 0,
              p: 2,
              '&:hover': {
                backgroundColor: `${GREEN}33`,
                borderColor: GREEN,
              },
              transition: 'all 0.15s',
            }}
          >
            <ForumIcon sx={{ color: GREEN }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
