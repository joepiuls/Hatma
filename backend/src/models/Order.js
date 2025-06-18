import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // product ID
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true } // ✅ New field
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  reference: { type: String, unique: true, sparse: true },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
  deliveryStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  additionalInfo: { type: String },
  address: addressSchema,
  phoneNumber: { type: String }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema);
