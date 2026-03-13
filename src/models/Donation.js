import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodItem: { type: String, required: true },
    quantity: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'PickedUp', 'Delivered'],
        default: 'Pending',
    },
    pickupStatus: {
        type: String,
        enum: ['None', 'Pending', 'PickedUp'],
        default: 'None'
    },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
