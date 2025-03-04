import express from 'express';
import { check } from 'express-validator';
import { getCurrentProfile, createOrUpdateProfile, addEducation, deleteEducation, 
    addExperience, deleteExperience, addSkill, deleteSkill, uploadResume } from '../controllers/candidateProfileController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResume as uploadResumeMiddleware } from '../middleware/upload.js';

const router = express.Router();

// Tất cả routes đều cần xác thực và chỉ dành cho ứng viên
router.use(protect);
router.use(authorize('user'));

// Lấy hồ sơ ứng viên hiện tại
router.get('/me', getCurrentProfile);

// Tạo hoặc cập nhật hồ sơ ứng viên
router.post(
  '/',
  [
    check('headline', 'Tiêu đề không thể vượt quá 100 ký tự').optional().isLength({ max: 100 }),
    check('bio', 'Giới thiệu không thể vượt quá 500 ký tự').optional().isLength({ max: 500 })
  ],
  createOrUpdateProfile
);

// Thêm học vấn
router.put(
  '/education',
  [
    check('school', 'Tên trường là bắt buộc').not().isEmpty(),
    check('degree', 'Bằng cấp là bắt buộc').not().isEmpty(),
    check('fieldOfStudy', 'Ngành học là bắt buộc').not().isEmpty(),
    check('from', 'Ngày bắt đầu là bắt buộc').not().isEmpty()
  ],
  addEducation
);

// Xóa học vấn
router.delete('/education/:edu_id', deleteEducation);

// Thêm kinh nghiệm
router.put(
  '/experience',
  [
    check('company', 'Tên công ty là bắt buộc').not().isEmpty(),
    check('position', 'Vị trí là bắt buộc').not().isEmpty(),
    check('from', 'Ngày bắt đầu là bắt buộc').not().isEmpty()
  ],
  addExperience
);

// Xóa kinh nghiệm
router.delete('/experience/:exp_id', deleteExperience);

// Thêm kỹ năng
router.put(
  '/skills',
  [
    check('name', 'Tên kỹ năng là bắt buộc').not().isEmpty(),
    check('level', 'Mức độ không hợp lệ').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
  ],
  addSkill
);

// Xóa kỹ năng
router.delete('/skills/:skill_id', deleteSkill);

// Upload CV
router.post('/resume', uploadResumeMiddleware, uploadResume);

export default router;