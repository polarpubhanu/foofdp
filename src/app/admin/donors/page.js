"use client";
import { useState, useEffect } from "react";
import { User, Mail, Calendar, Search } from "lucide-react";

export default function AdminDonors() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await fetch('/api/admin/donors');
                const data = await res.json();
                setDonors(data);
            } catch (err) {
                console.error("Error fetching donors", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonors();
    }, []);

    const filteredDonors = donors.filter(donor => 
        donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        donor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Donor Database...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Donor Directory</h1>
                    <p className="text-gray-500 mt-1">Manage and view all registered food donors.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search donors..." 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Information</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registration Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredDonors.map((donor) => (
                            <tr key={donor.id || donor._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <User size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-900">{donor.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{donor.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(donor.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-green-700 font-bold hover:underline">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDonors.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No donors found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
