"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MapPin, Calendar, Package } from "lucide-react";

export default function DonationFormPage() {
    const [formData, setFormData] = useState({
        foodItem: '',
        quantity: '',
        expiryDate: '',
        address: '',
        coordinates: { lat: 20.5937, lng: 78.9629 }
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Donation submitted successfully!');
                router.push('/dashboard');
            } else {
                alert('Submission failed');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-green-700 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Donate Surplus Food</h1>
                    <p className="text-green-100 opacity-90">Your contribution helps reduce waste and feed families in need.</p>
                </div>
                <LeafIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-green-600 opacity-30 rotate-12" />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Package size={16} /> Food Item Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Fresh Meals, 50 Pizzas"
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Utensils size={16} /> Quantity/Weight
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 10 kg, 20 boxes"
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Calendar size={16} /> Expiry Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <MapPin size={16} /> Pickup Address
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Complete pickup address"
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Send size={20} /> Submit Donation
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

function LeafIcon({ className }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path d="M21 16c0-4.42-3.58-8-8-8-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8zM5 16c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z" />
        </svg>
    )
}

function Utensils({ size, className }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
}
