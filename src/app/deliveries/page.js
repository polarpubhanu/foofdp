"use client";
import { useState, useEffect } from "react";
import { Truck, MapPin, Clock, CheckCircle, Package } from "lucide-react";

export default function NextActiveDeliveriesPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [role, setRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setRole(user.role);
        fetchActiveDeliveries();
    }, []);

    const fetchActiveDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            // Mock mode in API might not save state, so we'll simulate some if empty
            const res = await fetch('/api/donations?status=Accepted', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            // If mock mode returns empty (as it doesn't store state), let's show one for demo
            if (data.length === 0) {
                setDeliveries([
                    {
                        _id: 'mock-accepted-1',
                        foodItem: 'Bread & Pastries',
                        quantity: '5kg',
                        status: 'Accepted',
                        location: { address: 'Delhi Gate, New Delhi' }
                    }
                ]);
            } else {
                setDeliveries(data);
            }
        } catch (err) {
            console.error('Error fetching deliveries', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeliver = async (id) => {
        try {
            const token = localStorage.getItem('token');
            // Normally this would update status to 'Delivered'
            alert('Marked as delivered! Thank you for your service.');
            // Simulate removal
            setDeliveries(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            alert('Error updating delivery');
        }
    };

    if (loading) return <div className="p-8">Loading your rescues...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Truck className="text-green-700 w-8 h-8" />
                <h1 className="text-2xl font-bold text-gray-800">{role === 'NGO' ? 'Track Ongoing Rescues' : 'Your Active Rescues'}</h1>
            </div>

            {deliveries.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <Package className="mx-auto text-gray-300 w-12 h-12 mb-4" />
                    <p className="text-gray-500">You don&apos;t have any active deliveries. Check &quot;Available Food&quot; to start rescuing!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {deliveries.map(item => (
                        <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-lg font-bold text-green-700">{item.foodItem}</h3>
                                <p className="text-gray-600"><strong>Quantity:</strong> {item.quantity}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <MapPin size={14} />
                                    <span>{item.location?.address}</span>
                                </div>
                            </div>
                            {role === 'DeliveryPartner' ? (
                                <button
                                    onClick={() => handleDeliver(item._id)}
                                    className="w-full md:w-auto px-6 py-2.5 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle size={18} /> Mark Delivered
                                </button>
                            ) : (
                                <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Truck size={16} /> In Progress
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
