"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false); // Penahan agar tidak kedip

  useEffect(() => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("token"); // Sesuaikan jika nama key-nya beda

    if (!token && pathname !== "/login") {
      // Belum login & mau akses selain login -> lempar ke login
      router.replace("/login");
    } else if (token && pathname === "/login") {
      // Sudah login tapi iseng buka halaman login -> lempar ke dashboard
      router.replace("/dashboard");
    } else if (pathname === "/") {
      // Cegat halaman root (/)
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    } else {
      // Semua aman, izinkan halaman dirender
      setIsReady(true);
    }
  }, [pathname, router]);

  // SELAMA PROSES PENGECEKAN, JANGAN TAMPILKAN APA-APA (Menghilangkan flip/kedip)
  if (!isReady && pathname !== "/login") {
    return <div className="min-h-screen w-full bg-white"></div>; 
  }

  // Render halaman aslinya
  return <>{children}</>;
}