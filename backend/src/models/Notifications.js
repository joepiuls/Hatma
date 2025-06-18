import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'order', 'subscriber', 'form', 'system', 'analytics', 'inventory'],
    required: true
  },
  subtype: String,
  message: String,
  referenceId: mongoose.Schema.Types.ObjectId,
  context: Object,
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  priority: { type: Number, default: 0, min: 0, max: 2 },
  icon: String,
  iconBg: String,
  iconColor: String
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);