import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model('Request', requestSchema);
