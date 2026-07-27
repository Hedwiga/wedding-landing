import { Router } from 'express';
import guestsRouter from './guests.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/guest', guestsRouter);

export default router;
