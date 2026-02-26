export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Donation from '../../../models/Donation';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify([
                { _id: 'mock-1', foodItem: 'Bread & Pastries', quantity: '5kg', status: 'Pending', donor: { name: 'Local Bakery' }, location: { address: 'Main St' } },
                { _id: 'mock-2', foodItem: 'Fruit Basket', quantity: '10kg', status: 'Pending', donor: { name: 'Fruit Mart' }, location: { address: 'Market Square' } }
            ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'Pending';

        // Simple JWT check (optional for public viewing, but NGO roles usually required)
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        await dbConnect();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Donor') {
            return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
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
