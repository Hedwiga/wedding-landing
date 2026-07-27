import { Router } from 'express';
import { guests, rsvpStore } from '../data/guests.js';

const router = Router();

// GET /api/guest/:id
// Returns guest name if found, 404 otherwise.
router.get('/:id', (req, res) => {
  const guest = guests.find((g) => g.id === req.params.id);
  if (!guest) return res.status(404).json({ error: 'Guest not found' });
  const attending = rsvpStore.has(guest.id) ? rsvpStore.get(guest.id) : null;
  res.json({ id: guest.id, name: guest.name, attending });
});

// POST /api/rsvp
// Body: { id: string, attending: boolean }
router.post('/rsvp', (req, res) => {
  const { id, attending } = req.body;
  if (typeof id !== 'string' || typeof attending !== 'boolean') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const guest = guests.find((g) => g.id === id);
  if (!guest) return res.status(404).json({ error: 'Guest not found' });
  rsvpStore.set(id, attending);
  res.json({ id: guest.id, name: guest.name, attending });
});

export default router;
