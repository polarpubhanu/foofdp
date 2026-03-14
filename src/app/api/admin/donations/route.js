export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import Donation from '../../../../models/Donation';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify([
                { id: '1', foodType: 'Rice', quantity: '10kg', status: 'Pending', donorName: 'John Doe', createdAt: '2026-03-14T10:00:00Z' },
                { id: '2', foodType: 'Bread', quantity: '50 units', status: 'Accepted', donorName: 'Jane Smith', createdAt: '2026-03-14T11:30:00Z' },
                { id: '3', foodType: 'Vegetables', quantity: '20kg', status: 'Completed', donorName: 'Bob Johnson', createdAt: '2026-03-14T09:15:00Z' },
            ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const donations = await Donation.find().populate('donor', 'name email').sort({ createdAt: -1 });
        return new Response(JSON.stringify(donations), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error('Admin Donations API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
