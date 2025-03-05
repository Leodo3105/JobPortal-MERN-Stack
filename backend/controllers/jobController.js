import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import { validationResult } from 'express-validator';

// Tạo tin tuyển dụng mới
export const createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Lấy thông tin công ty của nhà tuyển dụng
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
    if (!employerProfile) {
      return res.status(404).json({ msg: 'Không tìm thấy thông tin công ty' });
    }

    // Tạo tin tuyển dụng mới
    const jobData = {
      ...req.body,
      employer: req.user.id,
      company: {
        name: employerProfile.companyName,
        logo: employerProfile.logoUrl
      }
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Cập nhật tin tuyển dụng
export const updateJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }

    // Kiểm tra xem người dùng hiện tại có phải là người tạo tin
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền cập nhật tin tuyển dụng này' });
    }

    // Cập nhật tin tuyển dụng
    job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, job });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Thay đổi trạng thái tin tuyển dụng (mở/đóng/nháp)
export const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  if (!status || !['draft', 'open', 'closed'].includes(status)) {
    return res.status(400).json({ msg: 'Trạng thái không hợp lệ' });
  }

  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }

    // Kiểm tra xem người dùng hiện tại có phải là người tạo tin
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền cập nhật tin tuyển dụng này' });
    }

    // Cập nhật trạng thái
    job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status } },
      { new: true }
    );

    res.json({ success: true, job });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xóa tin tuyển dụng
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }

    // Kiểm tra xem người dùng hiện tại có phải là người tạo tin
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền xóa tin tuyển dụng này' });
    }

    await job.deleteOne();

    res.json({ success: true, msg: 'Đã xóa tin tuyển dụng' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy chi tiết tin tuyển dụng
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email')
      .populate({
        path: 'applications',
        select: 'status createdAt',
        match: { status: { $ne: 'rejected' } }
      });
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }

    // Tăng số lượt xem nếu không phải là nhà tuyển dụng đang xem
    if (!req.user || req.user.id !== job.employer._id.toString()) {
      job.views += 1;
      await job.save();
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách tin tuyển dụng đã đăng của nhà tuyển dụng
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'applications',
        select: 'status createdAt',
      });
    
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Tìm kiếm tin tuyển dụng
export const searchJobs = async (req, res) => {
  try {
    let { 
      keyword, location, jobType, experience, 
      education, salaryMin, salaryMax, page, limit 
    } = req.query;
    
    // Xây dựng query
    const query = { status: 'open' };
    
    if (keyword) {
      query.$text = { $search: keyword };
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (jobType && Array.isArray(jobType)) {
      query.jobType = { $in: jobType };
    } else if (jobType) {
      query.jobType = jobType;
    }
    
    if (experience) {
      query.experience = experience;
    }
    
    if (education) {
      query.education = education;
    }
    
    // Xử lý lọc theo lương
    if (salaryMin || salaryMax) {
      query.salary = {};
      
      if (salaryMin) {
        query.salary.max = { $gte: parseInt(salaryMin) };
      }
      
      if (salaryMax) {
        query.salary.min = { $lte: parseInt(salaryMax) };
      }
    }
    
    // Phân trang
    const currentPage = parseInt(page, 10) || 1;
    const jobsPerPage = parseInt(limit, 10) || 10;
    const skip = (currentPage - 1) * jobsPerPage;
    
    // Thực hiện tìm kiếm
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(jobsPerPage);
    
    // Đếm tổng số tin tuyển dụng thỏa mãn điều kiện
    const total = await Job.countDocuments(query);
    
    res.json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / jobsPerPage),
        jobsPerPage
      },
      jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách tin tuyển dụng mới nhất
export const getLatestJobs = async (req, res) => {
  try {
    const latestJobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(8);
    
    res.json({ success: true, jobs: latestJobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách tin tuyển dụng phổ biến (nhiều lượt xem)
export const getPopularJobs = async (req, res) => {
  try {
    const popularJobs = await Job.find({ status: 'open' })
      .sort({ views: -1 })
      .limit(5);
    
    res.json({ success: true, jobs: popularJobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};