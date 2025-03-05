import express from 'express';
import { check } from 'express-validator';
import { createJob, updateJob, updateJobStatus, deleteJob, getJob, 
  getEmployerJobs, searchJobs, getLatestJobs, getPopularJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Các routes công khai
router.get('/', searchJobs);
router.get('/latest', getLatestJobs);
router.get('/popular', getPopularJobs);
router.get('/:id', getJob);

// Các routes cần xác thực - Chỉ dành cho nhà tuyển dụng
router.use(protect);
router.use(authorize('employer'));

// Route lấy danh sách tin tuyển dụng của nhà tuyển dụng
router.get('/employer/jobs', getEmployerJobs);

// Route tạo tin tuyển dụng mới
router.post(
  '/',
  [
    check('title', 'Tiêu đề công việc là bắt buộc').not().isEmpty(),
    check('description', 'Mô tả công việc là bắt buộc').not().isEmpty(),
    check('requirements', 'Yêu cầu công việc là bắt buộc').not().isEmpty(),
    check('jobType', 'Loại công việc là bắt buộc').isArray().not().isEmpty(),
    check('location', 'Địa điểm làm việc là bắt buộc').not().isEmpty(),
    check('deadline', 'Hạn nộp hồ sơ là bắt buộc').not().isEmpty().isISO8601().toDate()
  ],
  createJob
);

// Route cập nhật tin tuyển dụng
router.put(
  '/:id',
  [
    check('title', 'Tiêu đề công việc là bắt buộc').optional().not().isEmpty(),
    check('jobType', 'Loại công việc phải là mảng').optional().isArray(),
    check('deadline', 'Hạn nộp hồ sơ không hợp lệ').optional().isISO8601().toDate()
  ],
  updateJob
);

// Route cập nhật trạng thái tin tuyển dụng (mở/đóng/nháp)
router.patch('/:id/status', updateJobStatus);

// Route xóa tin tuyển dụng
router.delete('/:id', deleteJob);

export default router;