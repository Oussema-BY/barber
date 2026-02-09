import mongoose, { Schema } from 'mongoose';

const BasketItemSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    type: { type: String, enum: ['service', 'product', 'custom'], default: 'service' },
    serviceId: { type: String, default: '' },
    productId: { type: String, default: '' },
  },
  { _id: false }
);

const TransactionSchema = new Schema(
  {
    items: { type: [BasketItemSchema], required: true },
    clientName: { type: String, default: '' },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer'],
      default: 'cash',
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    completedBy: { type: String, default: '' },
    notes: { type: String, default: '' },
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

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
