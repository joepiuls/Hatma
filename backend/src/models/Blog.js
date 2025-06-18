import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  industry: { type: String, required: true },
  body: { type: String, required: true }, 
  featured: { type: Boolean, default: false },
  images: [{ type: String }], 
  views: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
