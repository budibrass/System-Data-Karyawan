"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function EditPasswordPage() {
    const emailUser = localStorage.getItem("email");
  const { userId } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return addToast("Password baru tidak cocok!", "error");
    }

    setLoading(true);
    try {
      await api.put(`/user/${emailUser}`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      addToast("Password berhasil diubah!", "success");
      router.back();
    } catch (error: any) {
      addToast(error.response?.data?.message || "Gagal mengubah password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl border border-rose-50 shadow-xl shadow-rose-100/50">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Ubah Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Password Lama</label>
          <input 
            type="password"
            className="w-full h-10 px-4 rounded-xl bg-rose-50/50 outline-none focus:ring-2 focus:ring-rose-200"
            onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Password Baru</label>
          <input 
            type="password"
            className="w-full h-10 px-4 rounded-xl bg-rose-50/50 outline-none focus:ring-2 focus:ring-rose-200"
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Konfirmasi Password Baru</label>
          <input 
            type="password"
            className="w-full h-10 px-4 rounded-xl bg-rose-50/50 outline-none focus:ring-2 focus:ring-rose-200"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>

        <button 
          disabled={loading}
          className="w-full h-10 mt-4 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}