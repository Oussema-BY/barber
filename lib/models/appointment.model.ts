import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientPhone: { type: String, default: '' },
    clientEmail: { type: String, default: '' },
    serviceId: { type: String, default: '' },
    serviceName: { type: String, default: '' },
    packageId: { type: String, default: '' },
    packageName: { type: String, default: '' },
    advance: { type: Number, default: 0 },
    eventDate: { type: String, default: '' },
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

// Ensure model is updated if schema changes during development
if (process.env.NODE_ENV !== 'production' && mongoose.models.Appointment) {
  delete mongoose.models.Appointment;
}

const AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
export default AppointmentModel;
