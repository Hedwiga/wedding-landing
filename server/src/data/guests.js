// Hardcoded guest list.
// Each guest has a unique id (share /invite/<id> with them) and a display name.
// To add a guest: copy any entry, replace id with a new UUID and set the name.
export const guests = [
  { id: 'a1b2c3d4', name: 'Олена та Василь' },
  { id: 'e5f6g7h8', name: 'Марина та Олег' },
  { id: 'i9j0k1l2', name: 'Тетяна' },
  { id: 'm3n4o5p6', name: 'Андрій та Катерина' },
  { id: 'q7r8s9t0', name: 'Ірина' },
];

// In-memory RSVP responses: { [guestId]: boolean }
// Resets on server restart — replace with a real DB when ready.
export const rsvpStore = new Map();
