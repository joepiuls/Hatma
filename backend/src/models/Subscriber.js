import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  avatarUrl: String
}, { timestamps: true });

export default mongoose.model('Subscriber', subscriberSchema);