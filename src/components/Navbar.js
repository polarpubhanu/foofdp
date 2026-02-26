"use client";
import Link from 'next/link';
import { Leaf, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar({ user, setUser }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <nav className="fixed top-0 w-full h-16 bg-green-700 text-white flex items-center justify-between px-6 z-50 shadow-md">
            <Link href="/" className="flex items-center gap-2">
                <Leaf className="w-8 h-8" />
                <span className="text-xl font-bold">Food Rescue</span>
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <div className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            <span>{user.name} ({user.role})</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 hover:text-green-200 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link href="/login" className="hover:text-green-200">Login</Link>
                        <Link href="/register" className="bg-white text-green-700 px-4 py-1.5 rounded-md font-medium hover:bg-green-50 transition-colors">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
