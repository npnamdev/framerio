'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Đăng nhập', href: '/sign-in' },
    { label: 'Đăng ký', href: '/sign-up' },
    { label: 'Quản trị', href: '/manage' },
]

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo bên trái */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                        Learnify
                    </Link>

                    {/* Menu điều hướng bên phải */}
                    <div className="flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/* Avatar/Profile */}
                        <Link href="/profile" className="ml-2">
                            <User className="text-gray-700 dark:text-white hover:text-blue-600" size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}