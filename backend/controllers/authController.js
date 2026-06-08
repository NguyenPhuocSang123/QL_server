const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logAction } = require('../middleware/logger');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
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
};

/**
 * @desc    Lấy thông tin người dùng hiện tại
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  res.json(req.user);
};

/**
 * @desc    Lấy danh sách tất cả người dùng
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Tạo người dùng mới
 * @route   POST /api/auth/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
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
};

/**
 * @desc    Cập nhật thông tin người dùng
 * @route   PUT /api/auth/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
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
};

/**
 * @desc    Xóa người dùng
 * @route   DELETE /api/auth/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    await user.deleteOne();
    await logAction(req.user._id, 'Xóa tài khoản', user.email);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
