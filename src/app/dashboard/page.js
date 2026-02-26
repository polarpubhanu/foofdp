"use client";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Package, Utensils, truck, Map as MapIcon, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        foodSaved: 0,
        mealsDistributed: 0,
        activeDeliveries: 0,
        monthlyData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Food Saved', value: `${stats.foodSaved} kg`, icon: <Package className="w-6 h-6" />, color: 'bg-green-100 text-green-700' },
        { title: 'Meals Distributed', value: stats.mealsDistributed, icon: <Utensils className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
        { title: 'Active Deliveries', value: stats.activeDeliveries, icon: <truck className="w-6 h-6" />, color: 'bg-orange-100 text-orange-700' },
    ];

    if (loading) return <div className="animate-pulse flex space-x-4">...Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Track your impact and active rescues in real-time.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-4 rounded-full ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Impact Statistics (Monthly)</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Mini-Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">Recent Activity</h2>
                    <button className="text-sm text-green-700 font-semibold hover:underline">View All</button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 text-sm">
                        <div className="bg-green-100 p-2 rounded-full text-green-700"><CheckCircle2 size={16} /></div>
                        <div className="flex-grow">
                            <p className="font-semibold">Donation Delivered</p>
                            <p className="text-gray-500">50 Lunch Boxes reached Shelter A</p>
                        </div>
                        <span className="text-gray-400">2h ago</span>
                    </div>
                    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 text-sm">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-700"><Clock size={16} /></div>
                        <div className="flex-grow">
                            <p className="font-semibold">New Donation Submitted</p>
                            <p className="text-gray-500">Donor John Doe posted 10kg Rice</p>
                        </div>
                        <span className="text-gray-400">5h ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
