"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'Donor' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Force refresh to update layout state
                window.location.href = '/dashboard';
            } else {
                setError(data.details ? `${data.message}: ${data.details}` : (data.message || 'Login failed'));
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Login to Food Rescue</h1>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.role === 'Donor' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
                        onClick={() => setFormData({ ...formData, role: 'Donor' })}
                    >
                        Donor
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.role === 'NGO' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
                        onClick={() => setFormData({ ...formData, role: 'NGO' })}
                    >
                        NGO
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.role === 'DeliveryPartner' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
                        onClick={() => setFormData({ ...formData, role: 'DeliveryPartner' })}
                    >
                        Delivery Partner
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">
                Don&apos;t have an account? <Link href="/register" className="text-green-700 font-semibold hover:underline">Register here</Link>
            </p>
        </div>
    );
}
