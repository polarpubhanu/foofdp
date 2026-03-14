export const dynamic = 'force-dynamic';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import Donation from '../../../../models/Donation';

export async function GET(req) {
    try {
        const db = await dbConnect();

        if (db.isMock) {
            return new Response(JSON.stringify({
                totalNGOs: 15,
                totalDonors: 120,
                totalDonations: 450,
                activeRescues: 45,
                impactData: [
                    { name: 'Donors', value: 120 },
                    { name: 'NGOs', value: 15 },
                ],
                monthlyActivity: [
                    { name: 'Jan', donations: 40, rescues: 30 },
                    { name: 'Feb', donations: 55, rescues: 45 },
                    { name: 'Mar', donations: 48, rescues: 40 },
                    { name: 'Apr', donations: 70, rescues: 60 },
                ]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const totalNGOs = await User.countDocuments({ role: 'NGO' });
        const totalDonors = await User.countDocuments({ role: 'Donor' });
        const totalDonations = await Donation.countDocuments();
        const activeRescues = await Donation.countDocuments({ status: 'Accepted' });

        return new Response(
            JSON.stringify({
                totalNGOs,
                totalDonors,
                totalDonations,
                activeRescues,
                impactData: [
                    { name: 'Donors', value: totalDonors },
                    { name: 'NGOs', value: totalNGOs },
                ],
                monthlyActivity: [
                    { name: 'Jan', donations: 10, rescues: 5 },
                    { name: 'Feb', donations: 20, rescues: 15 },
                    { name: 'Mar', donations: 15, rescues: 10 },
                    { name: 'Apr', donations: totalDonations, rescues: activeRescues },
                ]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Admin Stats API Error:', err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
