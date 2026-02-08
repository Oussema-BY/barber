import mongoose, { Schema } from 'mongoose';

const StaffSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    color: { type: String, default: '#3B82F6' },
    isActive: { type: Boolean, default: true },
    ownerId: { type: String, default: '' },
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

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
