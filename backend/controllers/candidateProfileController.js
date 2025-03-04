import CandidateProfile from '../models/CandidateProfile.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Lấy hồ sơ của ứng viên hiện tại
export const getCurrentProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Tạo hoặc cập nhật hồ sơ ứng viên
export const createOrUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    dateOfBirth,
    phone,
    address,
    bio,
    headline,
    socialLinks,
    jobPreferences
  } = req.body;

  // Xây dựng đối tượng hồ sơ
  const profileFields = {
    user: req.user.id
  };

  if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
  if (phone) profileFields.phone = phone;
  if (address) profileFields.address = address;
  if (bio) profileFields.bio = bio;
  if (headline) profileFields.headline = headline;

  if (socialLinks) {
    profileFields.socialLinks = {};
    if (socialLinks.linkedin) profileFields.socialLinks.linkedin = socialLinks.linkedin;
    if (socialLinks.github) profileFields.socialLinks.github = socialLinks.github;
    if (socialLinks.website) profileFields.socialLinks.website = socialLinks.website;
  }

  if (jobPreferences) {
    profileFields.jobPreferences = {};
    if (jobPreferences.jobType) profileFields.jobPreferences.jobType = jobPreferences.jobType;
    if (jobPreferences.expectedSalary) profileFields.jobPreferences.expectedSalary = jobPreferences.expectedSalary;
    if (jobPreferences.location) profileFields.jobPreferences.location = jobPreferences.location;
    if (jobPreferences.industries) profileFields.jobPreferences.industries = jobPreferences.industries;
  }

  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (profile) {
      // Cập nhật hồ sơ
      profile = await CandidateProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Tạo hồ sơ mới
      profile = new CandidateProfile(profileFields);
      await profile.save();
    }

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Thêm học vấn
export const addEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  };

  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    profile.education.unshift(newEdu);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xóa học vấn
export const deleteEducation = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    // Lấy chỉ mục cần xóa
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Không tìm thấy mục học vấn' });
    }

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Thêm kinh nghiệm
export const addExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    company,
    position,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    company,
    position,
    from,
    to,
    current,
    description
  };

  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    profile.experience.unshift(newExp);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status// backend/controllers/candidateProfileController.js (tiếp tục)
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xóa kinh nghiệm
export const deleteExperience = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    // Lấy chỉ mục cần xóa
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Không tìm thấy mục kinh nghiệm' });
    }

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Thêm kỹ năng
export const addSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, level } = req.body;

  const newSkill = {
    name,
    level
  };

  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    // Kiểm tra kỹ năng đã tồn tại chưa
    if (profile.skills.some(skill => skill.name === name)) {
      return res.status(400).json({ msg: 'Kỹ năng này đã tồn tại' });
    }

    profile.skills.push(newSkill);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xóa kỹ năng
export const deleteSkill = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    // Lấy chỉ mục cần xóa
    const removeIndex = profile.skills
      .map(item => item.id)
      .indexOf(req.params.skill_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Không tìm thấy kỹ năng' });
    }

    profile.skills.splice(removeIndex, 1);
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Upload CV
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Vui lòng tải lên một file' });
    }

    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có hồ sơ cho người dùng này' });
    }

    // Lưu đường dẫn file vào database
    profile.resumeUrl = req.file.path;
    await profile.save();

    res.json({
      success: true,
      profile,
      completionPercentage: profile.getCompletionPercentage()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};