import mongoose, { Schema } from 'mongoose';

const PackageSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
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
delete mongoose.models.Package;
export default mongoose.model('Package', PackageSchema);
