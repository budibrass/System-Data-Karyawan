"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Image as ImageIcon, FileText, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

// 1. INTERFACE DATA INFO
interface InfoItem {
  id: number;
  judul: string;
  deskripsi: string;
  gambarInfo: string;
  createdAt: string;
}

export default function InfoDetailPage() {
  const params = useParams(); // 🌟 Menangkap parameter ID dari URL (contoh: /info/5 -> params.id = 5)
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  
  const [info, setInfo] = useState<InfoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(false);

  // 2. FETCH DETAIL DATA BERDASARKAN ID
  useEffect(() => {
    const fetchDetailInfo = async () => {
      try {
        setLoading(true);
        setErrorApi(false);
        
        // Memanggil API GET /info/:id (contoh: GET /info/5)
        const response = await api.get(`/info/${params.id}`);
        
        // Catatan: Sesuaikan jika BE kamu membungkus datanya dalam bentuk response.data.data
        if (response.data) {
          setInfo(response.data);
        } else {
          setErrorApi(true);
        }
      } catch (error: any) {
        addToast(error.response?.data?.msg || "Gagal menampilkan data Gaji Karyawan", "error")
        setErrorApi(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDetailInfo();
    }
  }, [params.id]);

  // 3. LOOK & FEEL: SKELETON LOADING ANIMATION
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 mt-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded-md w-20"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 rounded-xl w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl w-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
        </div>
      </div>
    );
  }

  // 4. LOOK & FEEL: DATA TIDAK DITEMUKAN ATAU API ERROR
  if (errorApi || !info) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4 mt-10 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="p-4 bg-amber-50 inline-block rounded-full text-amber-500">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Detail Informasi Tidak Ditemukan</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Maaf, data informasi gagal dimuat. Berita mungkin telah dihapus oleh pihak admin atau tautan url salah.
        </p>
        <div className="pt-2">
          <button 
            onClick={() => router.back()} 
            className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 5. RENDER UTAMA HALAMAN DETAIL
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* TOMBOL NAVIGASI KEMBALI */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Kembali ke Berita
      </button>

      {/* HEADER ARTIKEL */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {info.judul || "Tanpa Judul"}
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Calendar size={14} className="text-slate-400" />
          <span>
            {info.createdAt ? new Date(info.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
          </span>
        </div>
      </div>

      {/* BANNER FOTO / MEDIA LAMPIRAN */}
      {info.gambarInfo ? (
        <div className="w-full max-h-[500px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center">
          <img 
            src={info.gambarInfo} 
            alt={info.judul || "Detail Gambar"} 
            className="w-full h-full object-contain max-h-[500px]"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
          <ImageIcon size={32} />
          <span className="text-xs font-medium">Tidak ada lampiran gambar pada pengumuman ini</span>
        </div>
      )}

      {/* KONTEN DESKRIPSI LENGKAP */}
      <div className="bg-white p-2 rounded-2xl whitespace-pre-line text-sm sm:text-base text-slate-700 leading-relaxed font-normal antialiased">
        {info.deskripsi || "Tidak ada deskripsi tersedia."}
      </div>

    </div>
  );
}