import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên của bạn"],
      trim: true,
      maxlength: [50, "Tên không thể vượt quá 50 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng nhập email hợp lệ",
      ],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Không trả về password khi query
    },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
      default: "default-avatar.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Mã hóa mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức so sánh mật khẩu
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Tạo token đặt lại mật khẩu
UserSchema.methods.getResetPasswordToken = function () {
  // Tạo token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token và lưu vào database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Đặt thời gian hết hạn
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút

  return resetToken;
};

// Tạo token xác thực email
UserSchema.methods.getEmailVerificationToken = function () {
  // Tạo token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash token và lưu vào database
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Đặt thời gian hết hạn
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

  return verificationToken;
};

export default mongoose.model("User", UserSchema);
