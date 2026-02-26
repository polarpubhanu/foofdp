export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/db';
import Donation from '../../../models/Donation';

export async function GET(req) {
    try {
        await dbConnect();
        const totalDonations = await Donation.countDocuments({ status: 'Delivered' });
        const activeDeliveries = await Donation.countDocuments({ status: 'Accepted' });

        return new Response(
            JSON.stringify({
                foodSaved: totalDonations * 10, // Simulated kg
                mealsDistributed: totalDonations * 20, // Simulated meals
                activeDeliveries,
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
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
