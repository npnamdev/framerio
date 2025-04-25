'use client'

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Xác thực Email
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Chúng tôi đã gửi một liên kết xác minh tới email của bạn. Vui lòng kiểm tra hộp thư để hoàn tất đăng ký.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Gửi lại email
                </button>
            </div>
        </div>
    )
}