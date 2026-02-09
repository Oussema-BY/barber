import mongoose, { Schema } from 'mongoose';

const ShopSchema = new Schema(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    ownerId: { type: String, required: true },
    createdBy: { type: String, required: true },
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

export default mongoose.models.Shop || mongoose.model('Shop', ShopSchema);
