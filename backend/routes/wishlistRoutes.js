import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlistItem } from '../controllers/wishlistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều cần xác thực và chỉ dành cho ứng viên
router.use(protect);
router.use(authorize('user'));

// Thêm vào wishlist
router.post('/', addToWishlist);

// Xóa khỏi wishlist
router.delete('/:jobId', removeFromWishlist);

// Lấy danh sách wishlist
router.get('/', getWishlist);

// Kiểm tra xem công việc có trong wishlist không
router.get('/check/:jobId', checkWishlistItem);

export default router;