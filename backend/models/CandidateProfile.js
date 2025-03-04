import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: [true, 'Vui lòng nhập tên trường']
  },
  degree: {
    type: String,
    required: [true, 'Vui lòng nhập bằng cấp']
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Vui lòng nhập ngành học']
  },
  from: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày bắt đầu']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
});

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Vui lòng nhập tên công ty']
  },
  position: {
    type: String,
    required: [true, 'Vui lòng nhập vị trí']
  },
  from: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày bắt đầu']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
});

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên kỹ năng']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  }
});

const CandidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  bio: {
    type: String,
    maxlength: [500, 'Giới thiệu không thể vượt quá 500 ký tự']
  },
  headline: {
    type: String,
    maxlength: [100, 'Tiêu đề không thể vượt quá 100 ký tự']
  },
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [SkillSchema],
  resumeUrl: {
    type: String
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  jobPreferences: {
    jobType: {
      type: [String],
      enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract']
    },
    expectedSalary: {
      type: Number
    },
    location: {
      type: String
    },
    industries: {
      type: [String]
    }
  }
}, { timestamps: true });

// Tính mức độ hoàn thiện hồ sơ
CandidateProfileSchema.methods.getCompletionPercentage = function() {
  let totalFields = 11; // Tổng số trường thông tin cơ bản
  let filledFields = 0;
  
  if (this.dateOfBirth) filledFields++;
  if (this.phone) filledFields++;
  if (this.address) filledFields++;
  if (this.bio) filledFields++;
  if (this.headline) filledFields++;
  if (this.education && this.education.length > 0) filledFields++;
  if (this.experience && this.experience.length > 0) filledFields++;
  if (this.skills && this.skills.length > 0) filledFields++;
  if (this.resumeUrl) filledFields++;
  if (this.socialLinks && Object.values(this.socialLinks).some(link => link)) filledFields++;
  if (this.jobPreferences && Object.values(this.jobPreferences).some(pref => pref)) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
};

export default mongoose.model('CandidateProfile', CandidateProfileSchema);