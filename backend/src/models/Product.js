import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  optionName: { type: String, required: true },
  optionValues: [{ type: String, required: true }],
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  deliveryInfo: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  costPrice: { type: Number, required: true, min: 0 },
  featured: { type: Boolean, default: false },
  variants: [variantSchema],
  images: [{ type: String }],
  views: { type: Number, default: 0 },
}, { timestamps: true });


export default mongoose.model('Product', productSchema);
