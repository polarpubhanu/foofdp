"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, History, ShoppingCart, Map as MapIcon, BarChart3, User } from 'lucide-react';

export default function Sidebar({ role }) {
    const pathname = usePathname();

    const donorLinks = [
        { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { title: 'Donate Food', path: '/donate', icon: <PlusCircle className="w-5 h-5" /> },
        { title: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
    ];

    const ngoLinks = [
        { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { title: 'Available Food', path: '/donations', icon: <ShoppingCart className="w-5 h-5" /> },
        { title: 'Impact', path: '/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    ];

    const links = role === 'Donor' ? donorLinks : ngoLinks;

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 py-6 overflow-y-auto z-40">
            <nav className="px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                                }`}
                        >
                            {link.icon}
                            <span>{link.title}</span>
                        </Link>
                    );
                })}
                <div className="pt-6 mt-6 border-t border-gray-100">
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all"
                    >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
