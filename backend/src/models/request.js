import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber:{type: String},
  description: { type: String, },
  attachment: { type: String }, // optional URL
  budget:{type:String}, 
  message:{type:String},
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Complete'],
    default: 'Complete'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    default: 'Website'
  },
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', RequestSchema);

export default Request;