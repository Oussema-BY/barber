import mongoose, { Schema } from 'mongoose';

const ShopMemberSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    shopId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ['owner', 'staff'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
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

ShopMemberSchema.index({ userId: 1, shopId: 1 }, { unique: true });

export default mongoose.models.ShopMember || mongoose.model('ShopMember', ShopMemberSchema);
