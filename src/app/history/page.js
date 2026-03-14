"use client";
import { useState, useEffect } from "react";
import { History, ChevronRight, CheckCircle2, Clock, Truck, Handshake } from "lucide-react";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/donations?status=all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setHistory(data);
            } catch (err) {
                console.error('Error fetching history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div>Loading history...</div>;

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Pending':
                return { label: 'Awaiting NGO', icon: <Clock size={12} />, colors: 'bg-orange-50 text-orange-700' };
            case 'Accepted':
                return { label: 'NGO Accepted', icon: <Handshake size={12} />, colors: 'bg-blue-50 text-blue-700' };
            case 'PickedUp':
                return { label: 'On The Way', icon: <Truck size={12} />, colors: 'bg-indigo-50 text-indigo-700' };
            case 'Delivered':
                return { label: 'Delivered', icon: <CheckCircle2 size={12} />, colors: 'bg-green-50 text-green-700' };
            default:
                return { label: status, icon: <Clock size={12} />, colors: 'bg-gray-50 text-gray-700' };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <History className="text-green-700 w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Your Activity History</h1>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-white">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Food Item / Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No historical records found.</td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        {item.foodItem}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {(() => {
                                            const { label, icon, colors } = getStatusDisplay(item.status);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${colors}`}>
                                                    {icon} {label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
