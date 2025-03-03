import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong headers hoặc cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Lấy token từ header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Lấy token từ cookie
    token = req.cookies.token;
  }

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({ msg: 'Không có quyền truy cập' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gán user vào request
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Không có quyền truy cập' });
  }
};

// Kiểm tra role của user
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Role ${req.user.role} không có quyền truy cập vào route này`
      });
    }
    next();
  };
};