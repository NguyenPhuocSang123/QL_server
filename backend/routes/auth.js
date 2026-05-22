const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' });
    }
    await logAction(user._id, 'Đăng nhập', `User: ${user.email}`, 'login');
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.get('/users', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

router.post('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });
    const user = await User.create({ fullName, email, password, role });
    await logAction(req.user._id, 'Tạo tài khoản', email);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    const { fullName, email, role, isActive, password } = req.body;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password;
    await user.save();
    await logAction(req.user._id, 'Cập nhật tài khoản', user.email);
    res.json({ _id: user._id, fullName: user.fullName, email: user.email, role: user.role, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
  await user.deleteOne();
  await logAction(req.user._id, 'Xóa tài khoản', user.email);
  res.json({ message: 'Đã xóa' });
});

module.exports = router;
