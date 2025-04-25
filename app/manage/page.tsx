'use client'

import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây (xoá token, gọi API, v.v...)
    // Sau đó chuyển hướng về trang đăng nhập
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Chào mừng tới với trang quản trị
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
      >
        Đăng xuất
      </button>
    </div>
  )
}