'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                address: parsedUser.location?.address || ''
            });
        }
    }, []);

    const handleSave = () => {
        const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            location: {
                ...user.location,
                address: formData.address
            }
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header/Cover */}
                <div className="h-32 bg-gradient-to-r from-green-600 to-green-500"></div>

                <div className="px-8 pb-8">
                    {/* Profile Header */}
                    <div className="relative flex items-end -mt-12 mb-6">
                        <div className="bg-white p-2 rounded-2xl shadow-md">
                            <div className="bg-green-100 p-6 rounded-xl">
                                <User size={48} className="text-green-600" />
                            </div>
                        </div>
                        <div className="ml-6 pb-2 w-full max-w-sm">
                            {isEditing ? (
                                <div className="mb-2">
                                    <label className="block text-xs font-bold text-white mb-1 drop-shadow-md">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-2xl font-bold text-gray-900 border-b-2 border-green-500 focus:outline-none bg-white/80 px-2 py-1 rounded shadow-sm"
                                        placeholder="Full Name"
                                    />
                                </div>
                            ) : (
                                <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User Profile'}</h1>
                            )}
                            <p className="text-gray-500 font-medium">{user.role || 'Guest'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        {/* Account Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Shield size={20} className="mr-2 text-green-600" />
                                Account Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <Mail className="text-gray-400 mr-4" size={20} />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full text-gray-900 font-medium bg-white border border-gray-200 rounded px-2 py-1 mt-1 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{user.email || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg opacity-75">
                                    <Shield className="text-gray-400 mr-4" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">User Role</p>
                                        <p className="text-gray-900 font-medium">{user.role || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg opacity-75">
                                    <Calendar className="text-gray-400 mr-4" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Status</p>
                                        <p className="text-green-600 font-bold uppercase text-xs">Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <MapPin size={20} className="mr-2 text-green-600" />
                                Location Details
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-lg h-full">
                                <div className="flex items-start">
                                    <MapPin className="text-gray-400 mr-4 mt-1" size={20} />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Primary Address</p>
                                        {isEditing ? (
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full text-gray-900 leading-relaxed font-medium bg-white border border-gray-200 rounded p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                rows="3"
                                            />
                                        ) : (
                                            <p className="text-gray-900 leading-relaxed font-medium">
                                                {user.location?.address || 'No address provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    {isEditing ? (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            Edit Profile Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
