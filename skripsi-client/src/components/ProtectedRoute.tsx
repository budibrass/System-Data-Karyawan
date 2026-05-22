"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Tunggu sampai Zustand selesai membaca localStorage
    if (!_hasHydrated) return;

    if (!token && pathname !== "/login") {
      router.replace("/login");
    } else if (token && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [token, pathname, _hasHydrated, router]);

  // Tampilkan loading HANYA saat data sedang disinkronkan
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}