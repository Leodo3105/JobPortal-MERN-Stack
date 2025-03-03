import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

// Đăng ký user mới
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

    // Tạo token
    const token = user.getSignedJwtToken();

    res.status(201).json({
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