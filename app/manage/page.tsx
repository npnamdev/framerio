"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);  // Loading state để kiểm tra quyền truy cập

  useEffect(() => {
    if (!user) {
      setLoading(false); // Nếu không có user, dừng việc kiểm tra
      return;
    }

    // Kiểm tra quyền truy cập
    if (user.role?.name !== "admin") {
      router.push("/unauthorized");  // Redirect nếu không phải admin
    } else {
      setLoading(false);  // Nếu là admin, dừng loading
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Khi đang kiểm tra quyền truy cập
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
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
  );
}
