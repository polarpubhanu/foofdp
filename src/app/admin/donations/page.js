"use client";
import { useState, useEffect } from "react";
import { ClipboardList, Search, Clock, CheckCircle2, AlertCircle, ShoppingCart } from "lucide-react";

export default function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await fetch('/api/admin/donations');
                const data = await res.json();
                setDonations(data);
            } catch (err) {
                console.error("Error fetching donations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const filteredDonations = donations.filter(d => 
        d.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (d.donorName || d.donor?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Donation Logs...</div>;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Global Donation Log</h1>
                    <p className="text-gray-500 mt-1">Real-time monitoring of all food rescue activities.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredDonations.map((donation) => (
                            <tr key={donation.id || donation._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                            <ShoppingCart size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{donation.foodType}</p>
                                            <p className="text-xs text-gray-500">{donation.quantity}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-700">
                                    {donation.donorName || (donation.donor?.name) || 'Anonymous Donor'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`px-3 py-1 border rounded-full text-xs font-bold w-fit ${getStatusStyle(donation.status)}`}>
                                        {donation.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                    <Clock size={14} />
                                    {new Date(donation.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-amber-700 font-bold hover:underline">Audit Trail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDonations.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No activity found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
