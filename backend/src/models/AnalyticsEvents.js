import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'page_visit',
      'service_request',
      'conversion',
      'traffic_source',
      'subscribe',
      'sale',
      'session',
      'product_request',
      'contact_form_submission',
      'error',
      'session_start',
      'session_end',
      'session_resume',
      'session_pause'
    ],
    required: true,
  },
  referrer: String,

  metadata: {
    type: mongoose.Schema.Types.Mixed, // allows flexible data per event type
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Complete'],
    default: 'Complete'
  },

  user: { 
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false
},
sessionId: String,
  deviceType: String,
  screenResolution: String,
  language: String,
  userId: mongoose.Schema.Types.ObjectId,
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  performance: {
    timing: {
      dns: Number,
      connect: Number,
      ttfb: Number,
      download: Number,
      domInteractive: Number,
      domComplete: Number,
      loadEvent: Number
    },
    memory: {
      jsHeapSizeLimit: Number,
      totalJSHeapSize: Number,
      usedJSHeapSize: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ip: String
});

export default mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
