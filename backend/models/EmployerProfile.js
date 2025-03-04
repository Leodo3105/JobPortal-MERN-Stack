import mongoose from 'mongoose';

const EmployerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Vui lòng nhập tên công ty']
  },
  logoUrl: {
    type: String,
    default: 'default-company-logo.jpg'
  },
  coverImageUrl: {
    type: String
  },
  website: {
    type: String
  },
  industry: {
    type: String
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  foundedYear: {
    type: Number
  },
  description: {
    type: String
  },
  locations: [{
    address: {
      type: String,
      required: true
    },
    isHeadquarter: {
      type: Boolean,
      default: false
    }
  }],
  socialLinks: {
    linkedin: { type: String },
    facebook: { type: String },
    twitter: { type: String }
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  }
}, { timestamps: true });

// Tính mức độ hoàn thiện hồ sơ
EmployerProfileSchema.methods.getCompletionPercentage = function() {
  let totalFields = 10; // Tổng số trường thông tin cơ bản
  let filledFields = 0;
  
  if (this.companyName) filledFields++;
  if (this.logoUrl && this.logoUrl !== 'default-company-logo.jpg') filledFields++;
  if (this.website) filledFields++;
  if (this.industry) filledFields++;
  if (this.companySize) filledFields++;
  if (this.foundedYear) filledFields++;
  if (this.description) filledFields++;
  if (this.locations && this.locations.length > 0) filledFields++;
  if (this.socialLinks && Object.values(this.socialLinks).some(link => link)) filledFields++;
  if (this.contactEmail || this.contactPhone) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
};

export default mongoose.model('EmployerProfile', EmployerProfileSchema);