export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Donation from '../../../models/Donation';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify({
                foodSaved: 450,
                mealsDistributed: 900,
                monthlyData: [
                    { name: 'Jan', value: 10 }, { name: 'Feb', value: 25 },
                    { name: 'Mar', value: 15 }, { name: 'Apr', value: 30 },
                ]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const totalDonations = await Donation.countDocuments({ status: 'Accepted' }); // Rescuing counts as saved

        return new Response(
            JSON.stringify({
                foodSaved: totalDonations * 10, // Simulated kg
                mealsDistributed: totalDonations * 20, // Simulated meals
                monthlyData: [
                    { name: 'Jan', value: 10 },
                    { name: 'Feb', value: 25 },
                    { name: 'Mar', value: 15 },
                    { name: 'Apr', value: totalDonations + 5 },
                ]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Stats API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
