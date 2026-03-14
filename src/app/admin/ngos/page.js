"use client";
import { useState, useEffect } from "react";
import { Building2, Mail, MapPin, Calendar, Search, ShieldCheck } from "lucide-react";

export default function AdminNGOs() {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                const res = await fetch('/api/admin/ngos');
                const data = await res.json();
                setNgos(data);
            } catch (err) {
                console.error("Error fetching NGOs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNgos();
    }, []);

    const filteredNgos = ngos.filter(ngo => 
        ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ngo.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading NGO Network...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">NGO Partners</h1>
                    <p className="text-gray-500 mt-1">Manage and verify registered NGO institutions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search NGOs..." 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Institution Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredNgos.map((ngo) => (
                            <tr key={ngo.id || ngo._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
                                            <Building2 size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-900">{ngo.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{ngo.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <MapPin size={14} />
                                            <span>{ngo.location?.address || 'No address provided'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full w-fit font-medium text-xs">
                                        <ShieldCheck size={14} />
                                        Verified
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold hover:underline">Manage Partner</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredNgos.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No NGOs found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
