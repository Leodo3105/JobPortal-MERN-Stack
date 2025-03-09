import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề công việc"],
      trim: true,
      maxlength: [100, "Tiêu đề không thể vượt quá 100 ký tự"],
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả công việc"],
    },
    requirements: {
      type: String,
      required: [true, "Vui lòng nhập yêu cầu công việc"],
    },
    benefits: {
      type: String,
    },
    jobType: {
      type: [String],
      required: true,
      enum: {
        values: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
        message: "Vui lòng chọn loại công việc hợp lệ",
      },
    },
    location: {
      type: String,
      required: [true, "Vui lòng nhập địa điểm làm việc"],
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      isNegotiable: {
        type: Boolean,
        default: false,
      },
      currency: {
        type: String,
        default: "VND",
      },
    },
    skills: {
      type: [String],
    },
    experience: {
      type: String,
      enum: {
        values: [
          "Không yêu cầu",
          "1 năm",
          "2 năm",
          "3-5 năm",
          "5-10 năm",
          "Trên 10 năm",
        ],
        message: "Vui lòng chọn kinh nghiệm hợp lệ",
      },
    },
    education: {
      type: String,
      enum: {
        values: [
          "Không yêu cầu",
          "Trung cấp",
          "Cao đẳng",
          "Đại học",
          "Thạc sĩ",
          "Tiến sĩ",
        ],
        message: "Vui lòng chọn trình độ học vấn hợp lệ",
      },
    },
    deadline: {
      type: Date,
      required: [true, "Vui lòng nhập hạn nộp hồ sơ"],
    },
    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    company: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

JobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  location: "text",
});

export default mongoose.model("Job", JobSchema);
