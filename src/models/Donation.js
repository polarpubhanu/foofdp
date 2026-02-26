import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodItem: { type: String, required: true },
    quantity: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted'],
        default: 'Pending',
    },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
