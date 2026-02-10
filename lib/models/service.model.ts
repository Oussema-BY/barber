import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['hair', 'beard', 'face', 'package', 'other'],
      default: 'other',
    },
    price: { type: Number, required: true },
    duration: { type: Number, default: 30 },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
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

// Force re-register to pick up schema changes during dev hot-reload
delete mongoose.models.Service;
export default mongoose.model('Service', ServiceSchema);
