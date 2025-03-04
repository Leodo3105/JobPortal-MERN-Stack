import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Đăng ký user mới (gửi email xác thực)
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email đã được sử dụng' });
    }

    // Tạo user mới
    user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Tạo token xác thực email
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Tạo URL xác thực
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;

    // Nội dung email
    const message = `Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác thực email của bạn bằng cách truy cập link sau: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Xác thực tài khoản',
        message
      });

      // Tạo token
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (error) {
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ msg: 'Không thể gửi email xác thực' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xác thực email
export const verifyEmail = async (req, res) => {
  try {
    // Hash token từ URL
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.verificationToken)
      .digest('hex');

    // Tìm user với token và token chưa hết hạn
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Xác thực email
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    
    await user.save();

    // Trả về token mới
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Gửi lại email xác thực
export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: 'Email đã được xác thực' });
    }

    // Tạo token xác thực email mới
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Tạo URL xác thực
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;

    // Nội dung email
    const message = `Vui lòng xác thực email của bạn bằng cách truy cập link sau: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Xác thực tài khoản',
        message
      });

      res.status(200).json({ success: true, data: 'Email xác thực đã được gửi lại' });
    } catch (error) {
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ msg: 'Không thể gửi email xác thực' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Đăng nhập user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Kiểm tra user có tồn tại
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo token
    const token = user.getSignedJwtToken();

    // Thiết lập cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };

    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy thông tin user hiện tại
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Đăng xuất user
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// Chức năng yêu cầu đặt lại mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng với email này' });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = user.getResetPasswordToken();

    // Lưu token vào database
    await user.save({ validateBeforeSave: false });

    // Tạo URL đặt lại mật khẩu
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Nội dung email
    const message = `Bạn đang nhận email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập link sau để đặt lại mật khẩu của bạn: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Đặt lại mật khẩu',
        message
      });

      res.status(200).json({ success: true, data: 'Email đã được gửi' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ msg: 'Không thể gửi email' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Chức năng đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    // Hash token từ URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // Tìm user với token và token chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ msg: 'Mật khẩu không khớp' });
    }

    // Đặt mật khẩu mới
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    // Trả về token mới
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};