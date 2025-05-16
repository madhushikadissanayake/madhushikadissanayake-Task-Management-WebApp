import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

export default router;
