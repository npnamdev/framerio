"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8081/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Not authorized");

        const data = await res.json();
        const roleName = data?.role?.name || "";

        if (roleName === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/"); // Redirect if not admin
        }
      } catch (error) {
        console.error("Error checking admin access", error);
        setIsAdmin(false);
        router.push("/"); // Redirect if error
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, router]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading }}>
      {loading ? <p>Loading admin access...</p> : children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
