"use client";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, Building2, ClipboardList, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching admin stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse flex items-center justify-center h-64 text-gray-500 font-medium">Loading Admin Insights...</div>;
    if (!stats) return <div className="text-center p-10 text-red-500">Failed to load admin statistics.</div>;

    const COLORS = ['#15803d', '#3b82f6', '#f59e0b', '#ef4444'];

    const statCards = [
        { title: 'Total Donors', value: stats.totalDonors, icon: <Users className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
        { title: 'Registered NGOs', value: stats.totalNGOs, icon: <Building2 className="w-6 h-6" />, color: 'bg-green-100 text-green-700' },
        { title: 'Total Donations', value: stats.totalDonations, icon: <ClipboardList className="w-6 h-6" />, color: 'bg-amber-100 text-amber-700' },
        { title: 'Active Rescues', value: stats.activeRescues, icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-purple-100 text-purple-700' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
                    <p className="text-gray-500 mt-1">Global platform overview and activity monitoring.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg text-green-700 text-sm font-semibold border border-green-100">
                    <TrendingUp size={16} />
                    <span>Real-time Monitoring Active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Platform Activity Chart */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-green-700" size={20} />
                        Platform Activity Trend
                    </h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="donations" fill="#15803d" radius={[6, 6, 0, 0]} name="Donations" />
                                <Bar dataKey="rescues" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rescues" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Distribution */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users className="text-blue-700" size={20} />
                        User Base Distribution
                    </h2>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.impactData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {stats.impactData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-gray-800">{stats.totalDonors + stats.totalNGOs}</span>
                            <span className="text-xs text-gray-500 font-medium">Total Users</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">System Alerts</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="text-amber-600"><AlertCircle size={20} /></div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-amber-900">Pending NGO Verifications</p>
                            <p className="text-xs text-amber-700">3 new NGOs are waiting for documents review.</p>
                        </div>
                        <button className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors">Review Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
