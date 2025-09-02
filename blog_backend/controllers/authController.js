const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// JWT Token Generator
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// =======================
// Register Controller
// =======================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Password validation
    if (!password || password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });

    // Check if user exists
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ name, email, password });

    const token = generateToken(user);

    // Optionally send welcome email here

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Login Controller
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Forgot Password Controller
// =======================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // For security, respond with success even if user not found
    return res.json({ message: 'If an account exists, a reset link has been sent to your email.' });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  // Build reset URL
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  // Send email
  try {
    await sendEmail(
      user.email,
      'Password Reset Request',
      `<p>Hello ${user.name || ''},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p>
     <a href="${resetUrl}" style="
        display:inline-block;
        padding: 10px 20px;
        background: #2563eb;
        color: #fff;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
     ">Reset Password</a>
   </p>
   <p>If you did not request this, please ignore this email.</p>`
    );
    return res.json({ message: 'If an account exists, a reset link has been sent to your email.' });
  } catch (err) {
    // Optionally clear token fields if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token.' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.json({ message: 'Password reset successful.' });
};