// app/signin/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const [email, setEmail] = useState('admin@wedly.info')
    const [password, setPassword] = useState('namdev')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const apiURL = "http://localhost:8080/api/auth/login";
        // const apiURL = "https://api.wedly.info/api/auth/login";

        try {
            const res = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.message || 'Đăng nhập thất bại')
                return
            }

            const data = await res.json()

            console.log(data);
            
            // Xử lý token tại đây nếu cần, ví dụ:
            // localStorage.setItem('accessToken', data.accessToken)

            // Chuyển hướng sau khi đăng nhập thành công
            router.push('/')
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    )
}
