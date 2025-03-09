import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Thêm index để tránh lưu trùng lặp
WishlistSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model('Wishlist', WishlistSchema);