'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
                <p className="text-gray-600 mb-6">
                    You don&apos;t have permission to view this page.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}
