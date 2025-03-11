import express from 'express';
import { check } from 'express-validator';
import { getCurrentPreferences, updatePreferences, unsubscribeByToken } from '../controllers/emailPreferenceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes cần xác thực
router.get('/me', protect, getCurrentPreferences);
router.put(
  '/',
  [
    protect,
    check('applicationUpdates', 'applicationUpdates phải là boolean').optional().isBoolean(),
    check('newApplications', 'newApplications phải là boolean').optional().isBoolean(),
    check('weeklyRecommendations', 'weeklyRecommendations phải là boolean').optional().isBoolean(),
    check('marketingEmails', 'marketingEmails phải là boolean').optional().isBoolean()
  ],
  updatePreferences
);

// Route public cho unsubscribe
router.get('/unsubscribe/:token', unsubscribeByToken);

export default router;