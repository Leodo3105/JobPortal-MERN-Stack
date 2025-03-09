import Wishlist from '../models/Wishlist.js';
import Job from '../models/Job.js';
import { validationResult } from 'express-validator';

// Thêm công việc vào wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    // Kiểm tra job có tồn tại không
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Không tìm thấy công việc' });
    }
    
    // Kiểm tra xem đã thêm công việc này vào wishlist chưa
    const existingItem = await Wishlist.findOne({
      user: req.user.id,
      job: jobId
    });
    
    if (existingItem) {
      return res.status(400).json({ msg: 'Công việc này đã có trong wishlist' });
    }
    
    // Tạo mới wishlist item
    const wishlistItem = new Wishlist({
      user: req.user.id,
      job: jobId
    });
    
    await wishlistItem.save();
    
    res.status(201).json({
      success: true,
      wishlistItem
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Công việc này đã có trong wishlist' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Xóa công việc khỏi wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      job: req.params.jobId
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ msg: 'Không tìm thấy công việc trong wishlist' });
    }
    
    res.json({
      success: true,
      msg: 'Đã xóa công việc khỏi wishlist'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Lấy danh sách wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location jobType salary deadline status',
        populate: {
          path: 'employer',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: wishlist.length,
      wishlist
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Kiểm tra xem công việc có trong wishlist không
export const checkWishlistItem = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      job: req.params.jobId
    });
    
    res.json({
      success: true,
      isInWishlist: wishlistItem ? true : false
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};