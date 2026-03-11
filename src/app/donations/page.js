"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { ShoppingCart, MapPin, Clock, CheckCircle } from "lucide-react";

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function NGOAvailableDonationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/donations?status=Pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDonations(data);
        } catch (err) {
            console.error('Error fetching donations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/donations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action: 'accept' }),
            });

            if (res.ok) {
                alert('Donation accepted and added to your deliveries!');
                fetchDonations();
            } else {
                alert('Error accepting donation');
            }
        } catch (err) {
            alert('An error occurred');
        }
    };

    if (loading) return <div>Loading available foods...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Available Surplus Food</h1>
                    <p className="text-gray-500">Discover and rescue available food donations near you.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-700">
                        <ShoppingCart size={16} />
                    </div>
                    <span className="font-semibold text-gray-700">{donations.length} items available</span>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[450px] relative z-0">
                <Map donations={donations} />
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                        No donations available at the moment.
                    </div>
                ) : (
                    donations.map((donation) => (
                        <div key={donation._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className="p-6 flex-grow space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-green-700 leading-tight">{donation.foodItem}</h3>
                                    <span className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Pending</span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-600" />
                                        <span><strong>Qty:</strong> {donation.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400" />
                                        <span><strong>Expiry:</strong> {donation.expiryDate ? new Date(donation.expiryDate).toLocaleString() : 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 border-t border-gray-50 pt-2 mt-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="truncate"><strong>Pickup:</strong> {donation.location?.address}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => handleAccept(donation._id)}
                                    className="w-full py-2.5 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors"
                                >
                                    Accept Donation
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
