import mongoose, { Schema } from 'mongoose';

const WorkingHoursSchema = new Schema(
  {
    day: { type: String, required: true },
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const SettingsSchema = new Schema(
  {
    businessName: { type: String, default: 'BarberPro Shop' },
    businessPhone: { type: String, default: '' },
    businessEmail: { type: String, default: '' },
    businessAddress: { type: String, default: '' },
    businessCity: { type: String, default: '' },
    businessZipCode: { type: String, default: '' },
    workingHours: { type: [WorkingHoursSchema], default: [] },
    currency: { type: String, default: 'EUR' },
    timezone: { type: String, default: 'Europe/Paris' },
    taxRate: { type: Number, default: 0 },
    salonMode: { type: String, enum: ['solo', 'multi'], default: 'solo' },
    numberOfChairs: { type: Number, default: 1 },
    ownerId: { type: String, default: '' },
    isOnboarded: { type: Boolean, default: false },
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

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
