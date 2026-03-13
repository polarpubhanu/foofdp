export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Donation from '../../../models/Donation';
import jwt from 'jsonwebtoken';

import { mockDonations } from '../../../lib/mockData';

export async function GET(req) {
    try {
        const db = await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'Pending';

        if (db.isMock) {
            const filteredDonations = mockDonations.filter(d => d.status === status);
            return new Response(JSON.stringify(filteredDonations), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Simple JWT check (optional for public viewing, but NGO roles usually required)
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
        if (decoded.role !== 'NGO' && status === 'Pending') {
            // Allow donors to see their own if we added a filter, but for now simple list
        }

        const donations = await Donation.find({ status }).populate('donor', 'name email');
        return new Response(JSON.stringify(donations), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const db = await dbConnect();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
        if (decoded.role !== 'Donor') {
            return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
        }

        // Mock mode handling
        if (db.isMock) {
            return new Response(JSON.stringify({ message: 'Mock mode: Donation simulated successfully' }), { status: 201 });
        }

        const { foodItem, quantity, expiryDate, address, coordinates } = await req.json();
        const donation = new Donation({
            donor: decoded.id,
            foodItem,
            quantity,
            expiryDate,
            location: { address, coordinates },
        });
        await donation.save();

        return new Response(JSON.stringify(donation), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
