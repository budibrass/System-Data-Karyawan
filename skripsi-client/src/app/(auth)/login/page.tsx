"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import api from "../../../lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function LoginPage() {
  // State untuk form dan UI
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Menembak API Express kamu di port 3000
      const response = await api.post("/user/login", {
        email,
        password,
      });

      if(response.status === 200) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('email', response.data.email)
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('id', response.data.id)
      }

      const { token, email: userEmail, role } = response.data;
      // Simpan ke Zustand (Global State)
      setAuth(token, userEmail, role);

      addToast("Login Berhasil! Selamat datang di Aksaramaya CMS.", "success");
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Koneksi ke server gagal";
      setErrorMessage(message);
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* KIRI: BRANDING AKSARAMAYA */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-white lg:flex">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-primary/5 shadow-sm">
            <img src="/logo/mccpLogo.jpg" alt="Aksaramaya Logo" className="object-contain" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            AKSARA<span className="text-primary">MAYA</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-500 uppercase tracking-widest">
            CMS Karyawan
          </p>
        </div>
      </div>

      {/* KANAN: FORM LOGIN (MERAH MODERN) */}
      <div className="flex w-full items-center justify-center bg-linear-to-br from-primary via-primary-dark to-slate-900 lg:w-1/2">
        <div className="w-full max-w-md px-10">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">Login</h2>
            <p className="mt-2 text-rose-100/70">Masukkan kredensial untuk mengakses dashboard</p>
          </div>

          {/* Alert jika login gagal */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/10 p-4 text-white backdrop-blur-md ring-1 ring-white/20 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-rose-300" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-100">Email Address</label>
              <input
                type="email"
                placeholder="email@aksaramaya.com"
                className="w-full rounded-xl border-none bg-white/10 p-4 text-white placeholder-rose-200/50 backdrop-blur-sm outline-none ring-1 ring-white/20 transition-all focus:bg-white/20 focus:ring-2 focus:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-100">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border-none bg-white/10 p-4 text-white placeholder-rose-200/50 backdrop-blur-sm outline-none ring-1 ring-white/20 transition-all focus:bg-white/20 focus:ring-2 focus:ring-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-black uppercase tracking-widest text-primary shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Masuk Sistem
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-xs font-medium text-rose-200/40">
            PT AKSARAMAYA &copy; 2022 • HR MANAGEMENT SYSTEM
          </div>
        </div>
      </div>
    </div>
  );
}