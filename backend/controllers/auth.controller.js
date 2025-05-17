const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (user) => jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user);
    const userData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&userData=${userData}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out' });
};