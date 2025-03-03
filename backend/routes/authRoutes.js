import express from 'express';
import { check } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Đăng ký route
router.post(
  '/register',
  [
    check('name', 'Tên là bắt buộc').not().isEmpty(),
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 })
  ],
  register
);

// Đăng nhập route
router.post(
  '/login',
  [
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Mật khẩu là bắt buộc').exists()
  ],
  login
);

// Lấy thông tin user hiện tại
router.get('/me', protect, getMe);

// Đăng xuất
router.get('/logout', logout);

export default router;