// backend/routes/authRoutes.js - Cập nhật
import express from 'express';
import { check } from 'express-validator';
import { register, login, getMe, logout, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail } from '../controllers/authController.js';
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

// Quên mật khẩu
router.post(
  '/forgot-password',
  [
    check('email', 'Vui lòng nhập email hợp lệ').isEmail()
  ],
  forgotPassword
);

// Đặt lại mật khẩu
router.put(
  '/reset-password/:resetToken',
  [
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 }),
    check('confirmPassword', 'Xác nhận mật khẩu là bắt buộc').exists()
  ],
  resetPassword
);

// Xác thực email
router.get('/verify-email/:verificationToken', verifyEmail);

// Gửi lại email xác thực
router.get('/resend-verification-email', protect, resendVerificationEmail);

export default router;