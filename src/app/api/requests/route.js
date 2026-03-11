import dbConnect from '../../../lib/db';
import Request from '../../../models/Request';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify([
                { _id: 'mock-req-1', details: 'Need dinner for 10 people', status: 'Pending', address: 'Community Center A' },
            ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const requests = await Request.find({ status: 'Pending' }).populate('recipient', 'name email');
        return new Response(JSON.stringify(requests), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const db = await dbConnect();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Mock mode handling
        if (db.isMock) {
            return new Response(JSON.stringify({ message: 'Mock mode: Request simulated successfully' }), { status: 201 });
        }

        const { details, address, coordinates } = await req.json();
        const foodRequest = new Request({
            recipient: decoded.id,
            details,
            address,
            location: { address, coordinates },
        });
        await foodRequest.save();

        return new Response(JSON.stringify(foodRequest), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
