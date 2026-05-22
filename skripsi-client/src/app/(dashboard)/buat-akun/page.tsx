"use client";
import React, { useState } from "react";
import { UserPlus, Mail, Lock, Shield, Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";
import useRouter from "next/navigation"; // Jika ingin redirect setelah sukses

export default function RegisterKaryawanPage() {
  const addToast = useToastStore((state) => state.addToast);
  // const router = useRouter(); // Uncomment jika ingin auto-redirect setelah sukses

  // ==========================================
  // --- STATE FORMS & LOADING ---
  // ==========================================
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "karyawan", // default value
  });
  const [loading, setLoading] = useState(false);

  // Handle Perubahan Input Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // --- SUBMIT HANDLER (HIT API) ---
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Sederhana Client-side
    if (!formData.email || !formData.password || !formData.role) {
      addToast("Semua field wajib diisi!", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // Hit API sesuai endpoint yang kamu minta
      await api.post("/user/register", payload);

      addToast("Akun baru berhasil didaftarkan!", "success");

      // Reset form setelah sukses membuat akun
      setFormData({
        email: "",
        password: "",
        role: "karyawan",
      });

      // Optional: Redirect admin ke halaman daftar karyawan
      // router.push("/admin/karyawan");

    } catch (error: any) {
      console.error("Gagal mendaftarkan akun baru:", error);
      const errorMessage = error.response?.data?.message || "Gagal membuat akun baru. Silakan coba lagi.";
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* HEADER PAGE */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Tambah Akun Karyawan</h2>
          <p className="text-xs text-slate-400 font-medium">
            Daftarkan kredensial akun baru untuk akses sistem administrasi maupun portal mandiri.
          </p>
        </div>
      </div>

      {/* CARD KOTAK FORM */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* FIELD 1: EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Alamat Email Karyawan
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="contoh: budi.setiawan@perusahaan.com"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* FIELD 2: PASSWORD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Kata Sandi (Password)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-60"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Gunakan minimal 8 karakter kombinasi huruf dan angka untuk keamanan optimal.
            </p>
          </div>

          {/* FIELD 3: ROLE (SELECT) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Hak Akses Sistem (Role)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Shield size={18} />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer disabled:opacity-60 appearance-none"
              >
                <option value="karyawan">Karyawan (User Biasa)</option>
                <option value="admin">Admin (Pengelola/HRD)</option>
              </select>
              {/* Custom Arrow indicator untuk Select */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Buat Akun Sekarang</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}