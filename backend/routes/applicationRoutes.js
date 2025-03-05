import express from 'express';
import { check } from 'express-validator';
import { applyForJob, getCandidateApplications, getJobApplications, 
  updateApplicationStatus, addApplicationNote, getApplication } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(protect);

// Routes cho ứng viên
router.get('/candidate', authorize('user'), getCandidateApplications);
router.post(
  '/',
  [
    authorize('user'),
    check('jobId', 'ID công việc là bắt buộc').not().isEmpty().isMongoId(),
    check('coverLetter', 'Thư giới thiệu không được vượt quá 1000 ký tự').optional().isLength({ max: 1000 })
  ],
  applyForJob
);

// Routes cho nhà tuyển dụng
router.get('/job/:jobId', authorize('employer'), getJobApplications);
router.patch(
  '/:id/status',
  authorize('employer'),
  updateApplicationStatus
);
router.post(
  '/:id/notes',
  [
    authorize('employer'),
    check('text', 'Nội dung ghi chú là bắt buộc').not().isEmpty()
  ],
  addApplicationNote
);

// Route chung cho cả ứng viên và nhà tuyển dụng
router.get('/:id', getApplication);

export default router;