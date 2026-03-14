export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Donation from '../../../models/Donation';
import jwt from 'jsonwebtoken';

import { mockDonations } from '../../../lib/mockData';

export async function GET(req) {
    try {
        const db = await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');

        if (db.isMock) {
            let filteredDonations = mockDonations;
            if (status && status !== 'all') {
                filteredDonations = filteredDonations.filter(d => d.status === status);
            } else if (!status && decoded.role !== 'Donor') {
                filteredDonations = filteredDonations.filter(d => d.status === 'Pending');
            }
            return new Response(JSON.stringify(filteredDonations), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        let query = {};
        if (decoded.role === 'Donor') {
            query.donor = decoded.id;
            if (status && status !== 'all') query.status = status;
        } else if (decoded.role === 'NGO') {
            if (status === 'all') {
                query.$or = [{ status: 'Pending' }, { acceptedBy: decoded.id }];
            } else if (status) {
                query.status = status;
                if (status !== 'Pending') query.acceptedBy = decoded.id;
            } else {
                query.status = 'Pending';
            }
        } else if (decoded.role === 'DeliveryPartner') {
            if (status === 'all') {
                query.status = { $in: ['Accepted', 'PickedUp', 'Delivered'] };
            } else if (status) {
                query.status = status;
            } else {
                query.status = 'Accepted';
            }
        }

        const donations = await Donation.find(query).populate('donor', 'name email').populate('acceptedBy', 'name location').sort({ createdAt: -1 });
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
