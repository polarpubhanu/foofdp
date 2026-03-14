export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify([
                { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2026-03-01' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2026-03-05' },
                { id: '3', name: 'Bob Johnson', email: 'bob@example.com', createdAt: '2026-03-10' },
            ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const donors = await User.find({ role: 'Donor' }).select('-password').sort({ createdAt: -1 });
        return new Response(JSON.stringify(donors), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error('Admin Donors API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
