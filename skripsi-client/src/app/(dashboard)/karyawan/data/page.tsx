"use client";
import React, { useEffect, useState } from "react";
import { Edit, Eye, Search, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

interface Karyawan {
  id: number | string; // Tambahkan id agar Link detail & edit tidak error TypeScript
  nip: string;
  email: string;
  namaDepan?: string;
  namaBelakang?: string;
  jabatan?: string;
  Golongan?: {
    kodeGolongan: string;
    namaGolongan: string;
  };
}

export default function DataKaryawanPage() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuthStore((state) => state); 
  const roleKaryawan = role
  const addToast = useToastStore((state) => state.addToast);

  // ==========================================
  // --- STATE FILTER & PAGINATION ---
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDataKaryawan = async () => {
      try {
        setLoading(true);
        const response = await api.get("/karyawan");
        const sortedData = response.data.sort((a: any, b: any) => {
        // Jika nip null/undefined, anggap saja sebagai string kosong ""
        const nipA = a.nip || "";
        const nipB = b.nip || "";
          return nipA.localeCompare(nipB, undefined, { numeric: true });
        });
        setData(sortedData); 
      } catch (err: any) {
        const message = err.response?.data?.message || "Koneksi ke server gagal"; 
        addToast(message, "error")
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataKaryawan();
  }, []);

  // Reset halaman ke 1 setiap kali user mengetik pencarian baru
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ==========================================
  // --- LOGIC FILTERING DATA ---
  // ==========================================
  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    
    // Pastikan item.nip tidak null sebelum di-lowercase
    const nipMatch = (item.nip || "").toLowerCase().includes(query);
    
    const namaLengkap = `${item.namaDepan || ""} ${item.namaBelakang || ""}`.toLowerCase();
    const nameMatch = namaLengkap.includes(query);

    return nipMatch || nameMatch;
  });

  // ==========================================
  // --- LOGIC PAGINATION (Menggunakan filteredData) ---
  // ==========================================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rose-950">Data Karyawan</h1>
          <p className="text-sm text-rose-400 font-medium">Manajemen informasi personil Aksaramaya</p>
        </div>
        <div className="flex items-center gap-3">
          
          {/* INPUT FORM SEARCH */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari NIP atau Nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 rounded-2xl bg-white border border-rose-100 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all shadow-sm font-medium text-slate-800"
            />
            {/* Tombol X untuk reset pencarian dengan cepat */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <Link 
            href="/karyawan/data/tambah-karyawan" 
            className="flex items-center gap-2 h-11 px-5 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
          >
            <Plus size={18} />
            <span className="cursor-pointer">Tambah</span>
          </Link>
        </div>
      </div>

      {/* Tabel Section */}
      <div className="bg-white rounded-4xl border border-rose-50 shadow-xl shadow-rose-50/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">NIP</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Karyawan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Jabatan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Email</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Golongan</th>
                {roleKaryawan?.toLowerCase() === "admin" ? <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 text-center">Aksi</th>: ""}
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20">
                      <div className="h-4 bg-rose-50 rounded-full w-full"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center">
                    <p className="text-rose-500 font-medium bg-rose-50 py-3 rounded-xl inline-block px-6">⚠️ {error}</p>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/20 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-rose-900/80">{item.nip}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-800">{item.namaDepan} {item.namaBelakang}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{item?.Golongan?.namaGolongan || "-"}</td>
                    <td className="px-8 py-5 text-sm text-rose-400/80 font-medium">{item.email}</td>
                    <td className="px-8 py-5">
                      {item.Golongan?.kodeGolongan ? (
                        <span className="px-3 py-1.5 truncate rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-wider ring-1 ring-rose-100">
                          {item.Golongan.kodeGolongan}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    {roleKaryawan?.toLowerCase() === "admin" ? 
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/karyawan/data/${item.id}`}
                          title="Lihat Detail" 
                          className="p-2.5 rounded-xl text-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-200 transition-all duration-300"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/karyawan/data/edit/${item.id}`}
                          title="Edit Data" 
                          className="p-2.5 rounded-xl text-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-200 transition-all duration-300"
                        >
                          <Edit size={18} />
                        </Link>
                      </div>
                    </td>
                    : ""}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 bg-rose-50 rounded-full text-rose-200"><Search size={40}/></div>
                      <p className="text-rose-300 font-bold tracking-wide">Data Karyawan Tidak Ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredData.length > itemsPerPage && (
          <div className="px-8 py-5 bg-rose-50/20 border-t border-rose-50 flex items-center justify-between">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-rose-500 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-rose-500 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}