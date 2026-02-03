import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientPhone: { type: String, default: '' },
    clientEmail: { type: String, default: '' },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    staffMemberId: { type: String, default: '' },
    staffMemberName: { type: String, default: '' },
    notes: { type: String, default: '' },
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

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
