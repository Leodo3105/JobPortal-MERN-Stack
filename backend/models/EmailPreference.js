import mongoose from 'mongoose';

const EmailPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  applicationUpdates: {
    type: Boolean,
    default: true
  },
  newApplications: {
    type: Boolean,
    default: true
  },
  weeklyRecommendations: {
    type: Boolean,
    default: true
  },
  marketingEmails: {
    type: Boolean,
    default: false
  },
  unsubscribeToken: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex')
  }
}, { timestamps: true });

export default mongoose.model('EmailPreference', EmailPreferenceSchema);