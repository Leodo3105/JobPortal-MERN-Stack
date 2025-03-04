import EmployerProfile from '../models/EmployerProfile.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Lấy hồ sơ của nhà tuyển dụng hiện tại
export const getCurrentProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có thông tin công ty cho người dùng này' });
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

// Tạo hoặc cập nhật hồ sơ nhà tuyển dụng
export const createOrUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    companyName,
    website,
    industry,
    companySize,
    foundedYear,
    description,
    contactEmail,
    contactPhone,
    socialLinks
  } = req.body;

  // Xây dựng đối tượng hồ sơ
  const profileFields = {
    user: req.user.id
  };

  if (companyName) profileFields.companyName = companyName;
  if (website) profileFields.website = website;
  if (industry) profileFields.industry = industry;
  if (companySize) profileFields.companySize = companySize;
  if (foundedYear) profileFields.foundedYear = foundedYear;
  if (description) profileFields.description = description;
  if (contactEmail) profileFields.contactEmail = contactEmail;
  if (contactPhone) profileFields.contactPhone = contactPhone;

  if (socialLinks) {
    profileFields.socialLinks = {};
    if (socialLinks.linkedin) profileFields.socialLinks.linkedin = socialLinks.linkedin;
    if (socialLinks.facebook) profileFields.socialLinks.facebook = socialLinks.facebook;
    if (socialLinks.twitter) profileFields.socialLinks.twitter = socialLinks.twitter;
  }

  try {
    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (profile) {
      // Cập nhật hồ sơ
      profile = await EmployerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Tạo hồ sơ mới
      profile = new EmployerProfile(profileFields);
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

// Upload logo công ty
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Vui lòng tải lên một file' });
    }

    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có thông tin công ty cho người dùng này' });
    }

    // Lưu đường dẫn file vào database
    profile.logoUrl = req.file.path;
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

// Upload ảnh bìa công ty
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Vui lòng tải lên một file' });
    }

    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có thông tin công ty cho người dùng này' });
    }

    // Lưu đường dẫn file vào database
    profile.coverImageUrl = req.file.path;
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

// Thêm địa điểm công ty
export const addLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address, isHeadquarter } = req.body;

  const newLocation = {
    address,
    isHeadquarter: isHeadquarter || false
  };

  try {
    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có thông tin công ty cho người dùng này' });
    }

    // Nếu địa điểm mới là trụ sở chính, cập nhật các địa điểm khác
    if (newLocation.isHeadquarter) {
      profile.locations.forEach(location => {
        location.isHeadquarter = false;
      });
    }

    profile.locations.push(newLocation);
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

// Xóa địa điểm công ty
export const deleteLocation = async (req, res) => {
  try {
    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Chưa có thông tin công ty cho người dùng này' });
    }

    // Lấy chỉ mục cần xóa
    const removeIndex = profile.locations
      .map(item => item.id)
      .indexOf(req.params.location_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Không tìm thấy địa điểm' });
    }

    profile.locations.splice(removeIndex, 1);
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