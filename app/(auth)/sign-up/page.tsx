'use client'

import { useState } from 'react'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Password:', password)
        // Gọi API đăng ký tại đây...
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Đăng ký</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-2 rounded border border-gray-300 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    )
}