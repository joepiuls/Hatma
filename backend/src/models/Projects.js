import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  metric: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  client: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Branding', 'Digital Marketing', 'Web Development', 'Strategy']
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Published', 'Draft', 'Archived'],
    default: 'Draft'
  },
  year: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  results: [resultSchema],
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster searching
projectSchema.index({ title: 'text', client: 'text', category: 'text', tags: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;
