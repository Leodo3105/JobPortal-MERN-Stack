import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { validationResult } from 'express-validator';

// Dashboard stats
export const getStats = async (req, res) => {
  try {
    // Lấy tổng số người dùng
    const totalUsers = await User.countDocuments();
    
    // Lấy tổng số tin tuyển dụng
    const totalJobs = await Job.countDocuments();
    
    // Lấy tổng số đơn ứng tuyển
    const totalApplications = await Application.countDocuments();
    
    // Lấy số người dùng mới trong ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Lấy số tin tuyển dụng mới trong ngày
    const newJobsToday = await Job.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Lấy số đơn ứng tuyển mới trong ngày
    const newApplicationsToday = await Application.countDocuments({
      createdAt: { $gte: today }
    });
    
    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      newUsersToday,
      newJobsToday,
      newApplicationsToday
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách người dùng
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Xây dựng query
    const query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Tính số lượng trang
    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    // Lấy danh sách người dùng
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      users,
      totalPages,
      currentPage: page,
      totalUsers: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Cập nhật trạng thái người dùng
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ msg: 'Trạng thái không hợp lệ' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách tin tuyển dụng
export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Xây dựng query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Tính số lượng trang
    const total = await Job.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    // Lấy danh sách tin tuyển dụng
    const jobs = await Job.find(query)
      .populate('employer', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      jobs,
      totalPages,
      currentPage: page,
      totalJobs: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Duyệt tin tuyển dụng
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { isApproved: true, status: 'open' },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
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

// Từ chối tin tuyển dụng
export const rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { isApproved: false, status: 'rejected' },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy tin tuyển dụng' });
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