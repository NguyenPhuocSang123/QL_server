const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.post('/users', protect, authorize('admin'), authController.createUser);
router.put('/users/:id', protect, authorize('admin'), authController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), authController.deleteUser);

module.exports = router;
