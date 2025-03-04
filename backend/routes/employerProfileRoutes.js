import express from 'express';
import { check } from 'express-validator';
import { getCurrentProfile, createOrUpdateProfile, uploadLogo, uploadCoverImage, addLocation, deleteLocation } from '../controllers/employerProfileController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Tất cả routes đều cần xác thực và chỉ dành cho nhà tuyển dụng
router.use(protect);
router.use(authorize('employer'));
 
// Lấy hồ sơ nhà tuyển dụng hiện tại
router.get('/me', getCurrentProfile);

// Tạo hoặc cập nhật hồ sơ nhà tuyển dụng
router.post(
  '/',
  [
    check('companyName', 'Tên công ty là bắt buộc').not().isEmpty()
  ],
  createOrUpdateProfile
);

// Upload logo công ty
router.post('/logo', uploadImage, uploadLogo);

// Upload ảnh bìa công ty
router.post('/cover-image', uploadImage, uploadCoverImage);

// Thêm địa điểm công ty
router.put(
  '/locations',
  [
    check('address', 'Địa chỉ là bắt buộc').not().isEmpty()
  ],
  addLocation
);

// Xóa địa điểm công ty
router.delete('/locations/:location_id', deleteLocation);

export default router;