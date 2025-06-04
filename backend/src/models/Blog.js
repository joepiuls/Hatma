import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
