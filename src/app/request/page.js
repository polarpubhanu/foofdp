"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, HandHelping } from "lucide-react";

export default function RequestFormPage() {
    const [formData, setFormData] = useState({
        details: '',
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
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Food request submitted successfully!');
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
            <div className="bg-blue-700 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2 text-white">Need Food Support?</h1>
                    <p className="text-blue-100 opacity-90">Our community of NGOs and donors is here to help. Submit your request below.</p>
                </div>
                <HandHelping className="absolute -bottom-8 -right-8 w-40 h-40 text-blue-600 opacity-30 -rotate-12" />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Heart size={16} className="text-red-500" /> Requirement Details
                            </label>
                            <textarea
                                required
                                placeholder="Please describe your need (e.g. Need dinner for 20 children at our local community center)"
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            ></textarea>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <MapPin size={16} className="text-blue-600" /> Delivery Address
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Complete address where food should be delivered"
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <SendIcon className="w-5 h-5" /> Submit Food Request
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

function SendIcon({ className }) {
    return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={className}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
}
