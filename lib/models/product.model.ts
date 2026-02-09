import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    supplier: { type: String, required: true },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    minQuantity: { type: Number, required: true, default: 5 },
    unit: { type: String, default: 'pcs' },
    barcode: { type: String, default: '' },
    shopId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
