// backend/controllers/applicationController.js
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { validationResult } from 'express-validator';
import { sendNewApplicationEmail, sendApplicationStatusEmail } from '../services/emailService.js';

// Nộp đơn ứng tuyển
export const applyForJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { jobId, coverLetter } = req.body;

  try {
    // Kiểm tra xem công việc có tồn tại và còn mở không
    const job = await Job.findOne({ _id: jobId, status: 'open' });
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng hoặc đã hết hạn' });
    }

    // Kiểm tra xem đã ứng tuyển vào công việc này chưa
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'Bạn đã ứng tuyển vào vị trí này rồi' });
    }

    // Lấy thông tin hồ sơ ứng viên
    const candidateProfile = await CandidateProfile.findOne({ user: req.user.id });
    if (!candidateProfile || !candidateProfile.resumeUrl) {
      return res.status(400).json({ msg: 'Bạn cần tải lên CV trước khi ứng tuyển' });
    }

    // Tạo đơn ứng tuyển
    const application = new Application({
      job: jobId,
      candidate: req.user.id,
      resumeUrl: candidateProfile.resumeUrl,
      coverLetter
    });

    await application.save();
    
    // Gửi email thông báo cho nhà tuyển dụng
    await sendNewApplicationEmail(application);

    // Cập nhật job với application ID
    await Job.findByIdAndUpdate(
      jobId,
      { $push: { applications: application._id } }
    );

    res.status(201).json({
      success: true,
      application
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Bạn đã ứng tuyển vào vị trí này rồi' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách đơn ứng tuyển của ứng viên
export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location status deadline salary jobType'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách đơn ứng tuyển của một công việc
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }

    // Kiểm tra xem người dùng có phải là nhà tuyển dụng sở hữu tin không
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền xem đơn ứng tuyển của tin này' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'candidate',
        select: 'name email avatar'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Cập nhật trạng thái đơn ứng tuyển
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected', 'interview', 'hired'].includes(status)) {
    return res.status(400).json({ msg: 'Trạng thái không hợp lệ' });
  }

  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }

    // Lấy thông tin công việc để kiểm tra quyền
    const job = await Job.findById(application.job);
    
    // Kiểm tra xem người dùng có phải là nhà tuyển dụng sở hữu tin không
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền cập nhật đơn ứng tuyển này' });
    }

    // Lưu trạng thái trước khi cập nhật
    const previousStatus = application.status;
    
    // Cập nhật trạng thái
    application.status = status;
    await application.save();
    
    // Gửi email thông báo cho ứng viên
    await sendApplicationStatusEmail(application, previousStatus);

    res.json({
      success: true,
      application
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Thêm ghi chú cho đơn ứng tuyển
export const addApplicationNote = async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ msg: 'Nội dung ghi chú không được để trống' });
  }

  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }

    // Lấy thông tin công việc để kiểm tra quyền
    const job = await Job.findById(application.job);
    
    // Kiểm tra xem người dùng có phải là nhà tuyển dụng sở hữu tin không
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền thêm ghi chú cho đơn ứng tuyển này' });
    }

    // Thêm ghi chú
    application.notes.unshift({
      text,
      createdBy: req.user.id
    });
    
    await application.save();

    res.json({
      success: true,
      application
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy chi tiết đơn ứng tuyển
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        select: 'title company location status deadline'
      })
      .populate({
        path: 'candidate',
        select: 'name email avatar'
      });
    
    if (!application) {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }

    // Kiểm tra quyền truy cập - chỉ ứng viên hoặc nhà tuyển dụng mới có quyền xem
    const job = await Job.findById(application.job);
    
    if (application.candidate._id.toString() !== req.user.id && 
        job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Không có quyền xem đơn ứng tuyển này' });
    }

    res.json({
      success: true,
      application
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};