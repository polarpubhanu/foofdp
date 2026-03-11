export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const db = await dbConnect();
        const { name, email, password, role, address, coordinates } = await req.json();

        if (db.isMock) {
            console.warn('Simulating successful registration in MOCK MODE');
            const token = jwt.sign(
                { id: 'mock-id-123', name, email, role: role || 'Donor' },
                process.env.JWT_SECRET || 'mock-secret',
                { expiresIn: '1d' }
            );
            return new Response(JSON.stringify({
                token: token,
                user: { id: 'mock-id-123', name, email, role: role || 'Donor' },
            }), { status: 201, headers: { 'Content-Type': 'application/json' } });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = new User({
            name,
            email,
            password,
            role,
            location: { address, coordinates },
        });
        await user.save();

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing in environment variables');
            return new Response(JSON.stringify({ message: 'Server configuration error' }), { status: 500 });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return new Response(
            JSON.stringify({
                token,
                user: { id: user._id, name, email, role },
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (err) {
        console.error('Registration API Error:', err);

        // Handle MongoDB duplicate key error (code 11000)
        if (err.code === 11000) {
            return new Response(JSON.stringify({ message: 'User with this email already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Server error', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
