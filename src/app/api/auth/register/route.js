export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password, role, address, coordinates } = await req.json();

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
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
