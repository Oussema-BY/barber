import mongoose, { Schema } from 'mongoose';

const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['rent', 'utilities', 'products', 'wages', 'other'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    description: { type: String, default: '' },
    attachments: { type: [String], default: [] },
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

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
