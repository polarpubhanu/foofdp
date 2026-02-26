export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import Donation from '../../../../models/Donation';
import jwt from 'jsonwebtoken';

export async function PATCH(req, { params }) {
    try {
        await dbConnect();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'NGO') {
            return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
        }

        const { id } = params;
        const { action } = await req.json(); // 'accept' or 'deliver'

        const donation = await Donation.findById(id);
        if (!donation) return new Response(JSON.stringify({ message: 'Donation not found' }), { status: 404 });

        if (action === 'accept') {
            if (donation.status !== 'Pending') return new Response(JSON.stringify({ message: 'Already processed' }), { status: 400 });
            donation.status = 'Accepted';
            donation.acceptedBy = decoded.id;
        } else if (action === 'deliver') {
            donation.status = 'Delivered';
        }

        await donation.save();
        return new Response(JSON.stringify(donation), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
