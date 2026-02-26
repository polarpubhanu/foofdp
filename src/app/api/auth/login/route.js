export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

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
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (err) {
        console.error('Login API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
