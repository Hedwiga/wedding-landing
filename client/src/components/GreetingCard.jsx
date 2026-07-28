import { Typography, Box } from '@mui/material';
import PixelHeart from './PixelHeart';
import { GOLD } from '../theme/colors';

export default function GreetingCard({ coupleNames, firstName }) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <PixelHeart pixelSize={10} />
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontSize: { xs: '1rem', md: '1.6rem' }, color: 'white', lineHeight: 2, mb: 2 }}
      >
        {coupleNames}
      </Typography>

      <Box
        sx={{
          display: 'inline-block',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          border: `2px solid ${GOLD}44`,
          px: 3,
          py: 1.5,
          mb: 6,
        }}
      >
        <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.7rem' }, color: GOLD, lineHeight: 2 }}>
          запрошують{' '}
          <Box
            component="span"
            sx={{
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              color: 'white',
            }}
          >
            {firstName}
          </Box>
        </Typography>
      </Box>
    </>
  );
}
