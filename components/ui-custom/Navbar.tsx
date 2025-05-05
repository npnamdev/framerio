"use client";

import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center text-white">
                <div className="text-lg font-semibold">My App</div>
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <p>Welcome, {user?.fullName}</p>
                            {user?.role?.name === "admin" && (
                                <Link href="/manage">
                                    <button className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
                                        Manage
                                    </button>
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/sign-in">
                                <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                                    Login
                                </button>
                            </Link>
                            <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
