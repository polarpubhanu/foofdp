export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import Donation from '../../../../models/Donation';
import jwt from 'jsonwebtoken';

import { updateMockDonation } from '../../../../lib/mockData';

export async function PATCH(req, { params }) {
    try {
        const db = await dbConnect();
        if (db.isMock) {
            const updated = updateMockDonation(params.id, { status: 'Accepted' });
            return new Response(JSON.stringify(updated || { _id: params.id, status: 'Accepted' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
        if (decoded.role !== 'DeliveryPartner') {
            return new Response(JSON.stringify({ message: 'Only Delivery Partners can accept rescues' }), { status: 403 });
        }

        const { action } = await req.json(); // 'accept'

        const donation = await Donation.findById(params.id);
        if (!donation) return new Response(JSON.stringify({ message: 'Donation not found' }), { status: 404 });

        if (action === 'accept') {
            if (donation.status !== 'Pending') return new Response(JSON.stringify({ message: 'Already processed' }), { status: 400 });
            donation.status = 'Accepted';
            donation.acceptedBy = decoded.id;
        }

        await donation.save();
        return new Response(JSON.stringify(donation), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
