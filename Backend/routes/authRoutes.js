import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/', // or show a proper error page
    session: true,
  }),
  (req, res) => {
    // ✅ Redirect to frontend after successful login
    res.redirect('http://localhost:5173/dashboard')
});

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' })

    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' })
      }
      res.clearCookie('connect.sid') // ← this is the default session cookie name for express-session
      res.status(200).json({ message: 'Logged out successfully' })
    })
  })
})


router.get('/user', (req, res) => {
  res.send({ user: req.user });
});

export default router;


