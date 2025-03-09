import express from 'express';
import { getStats, getUsers, updateUserStatus, 
  getJobs, approveJob, rejectJob } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều cần xác thực và phải là admin
router.use(protect);
router.use(authorize('admin'));

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:userId/status', updateUserStatus);

// Jobs
router.get('/jobs', getJobs);
router.patch('/jobs/:jobId/approve', approveJob);
router.patch('/jobs/:jobId/reject', rejectJob);

export default router;