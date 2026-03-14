export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import Donation from '../../../../models/Donation';
import jwt from 'jsonwebtoken';

import { updateMockDonation } from '../../../../lib/mockData';

export async function PATCH(req, { params }) {
    try {
        const db = await dbConnect();
        if (db.isMock) {
            const { action } = await req.json();
            const updated = updateMockDonation(params.id, { 
                status: action === 'accept' ? 'Accepted' : 'Delivered'
            });
            return new Response(JSON.stringify(updated || { _id: params.id, status: action === 'accept' ? 'Accepted' : 'Delivered' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
        if (decoded.role !== 'NGO' && decoded.role !== 'DeliveryPartner') {
            return new Response(JSON.stringify({ message: 'Only NGOs or Delivery Partners can update status' }), { status: 403 });
        }

        const { action } = await req.json(); // 'accept' or 'delivered' etc.

        const donation = await Donation.findById(params.id);
        if (!donation) return new Response(JSON.stringify({ message: 'Donation not found' }), { status: 404 });

        if (action === 'accept') {
            if (decoded.role !== 'NGO') {
                return new Response(JSON.stringify({ message: 'Only NGOs can accept donations' }), { status: 403 });
            }
            if (donation.status !== 'Pending') return new Response(JSON.stringify({ message: 'Already processed' }), { status: 400 });
            donation.status = 'Accepted';
            donation.acceptedBy = decoded.id;
        } else if (action === 'deliver') {
            if (decoded.role !== 'DeliveryPartner') {
                return new Response(JSON.stringify({ message: 'Only Delivery Partners can mark as delivered' }), { status: 403 });
            }
            if (donation.status !== 'Accepted' && donation.status !== 'PickedUp') {
                return new Response(JSON.stringify({ message: 'Donation must be accepted before delivery' }), { status: 400 });
            }
            donation.status = 'Delivered';
            donation.deliveryPartner = decoded.id;
        }

        await donation.save();
        return new Response(JSON.stringify(donation), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
