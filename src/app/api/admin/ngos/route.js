export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify([
                { id: '1', name: 'Helping Hands', email: 'contact@helpinghands.org', location: { address: '123 Charity St' }, createdAt: '2026-01-15' },
                { id: '2', name: 'Food For All', email: 'info@foodforall.org', location: { address: '456 Hope Ave' }, createdAt: '2026-02-20' },
            ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const ngos = await User.find({ role: 'NGO' }).select('-password').sort({ createdAt: -1 });
        return new Response(JSON.stringify(ngos), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error('Admin NGOs API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
