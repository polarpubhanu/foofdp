export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Request from '../../../models/Request';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        await dbConnect();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        // Only NGOs can see all requests
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'NGO') return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

        const requests = await Request.find({ status: 'Pending' }).populate('recipient', 'name email');
        return new Response(JSON.stringify(requests), { status: 200 });
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
        if (decoded.role !== 'Recipient') {
            return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
        }

        const { details, address, coordinates } = await req.json();
        const foodRequest = new Request({
            recipient: decoded.id,
            details,
            location: { address, coordinates },
        });
        await foodRequest.save();

        return new Response(JSON.stringify(foodRequest), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
