import EmailPreference from '../models/EmailPreference.js';
import { validationResult } from 'express-validator';

// Lấy preferences của người dùng hiện tại
export const getCurrentPreferences = async (req, res) => {
  try {
    let preferences = await EmailPreference.findOne({ user: req.user.id });
    
    // Nếu chưa có, tạo mới với default values
    if (!preferences) {
      preferences = new EmailPreference({ user: req.user.id });
      await preferences.save();
    }
    
    res.json({
      success: true,
      preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Cập nhật preferences
export const updatePreferences = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { applicationUpdates, newApplications, weeklyRecommendations, marketingEmails } = req.body;

  try {
    let preferences = await EmailPreference.findOne({ user: req.user.id });
    
    // Nếu chưa có, tạo mới
    if (!preferences) {
      preferences = new EmailPreference({ 
        user: req.user.id,
        applicationUpdates: applicationUpdates !== undefined ? applicationUpdates : true,
        newApplications: newApplications !== undefined ? newApplications : true,
        weeklyRecommendations: weeklyRecommendations !== undefined ? weeklyRecommendations : true,
        marketingEmails: marketingEmails !== undefined ? marketingEmails : false
      });
    } else {
      // Cập nhật các trường nếu được cung cấp
      if (applicationUpdates !== undefined) preferences.applicationUpdates = applicationUpdates;
      if (newApplications !== undefined) preferences.newApplications = newApplications;
      if (weeklyRecommendations !== undefined) preferences.weeklyRecommendations = weeklyRecommendations;
      if (marketingEmails !== undefined) preferences.marketingEmails = marketingEmails;
    }
    
    await preferences.save();
    
    res.json({
      success: true,
      preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Hủy đăng ký email thông qua token
export const unsubscribeByToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const preferences = await EmailPreference.findOne({ unsubscribeToken: token });
    
    if (!preferences) {
      return res.status(404).json({ msg: 'Token không hợp lệ' });
    }
    
    // Hủy đăng ký tất cả các loại email
    preferences.applicationUpdates = false;
    preferences.newApplications = false;
    preferences.weeklyRecommendations = false;
    preferences.marketingEmails = false;
    
    await preferences.save();
    
    // Có thể redirect đến trang web xác nhận hủy đăng ký
    res.redirect(`${process.env.FRONTEND_URL}/unsubscribe-success`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};