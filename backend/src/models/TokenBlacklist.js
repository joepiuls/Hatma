import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['access', 'refresh'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete when expiresAt is reached
  }
}, {
  timestamps: true
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
export default TokenBlacklist;