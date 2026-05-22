"use client";
import React, { useState, useEffect } from "react";
import { Info, Search, Calendar, ChevronRight, ChevronLeft, Newspaper, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

interface InfoItem {
  id: number;
  judul: string;
  deskripsi: string;
  gambarInfo: string;
  createdAt: string;
}

export default function InfoPage() {
  const [infos, setInfos] = useState<InfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE SEARCH & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Mengingat bentuknya memanjang ke bawah, 4 item per halaman sudah ideal

  // --- FETCH DATA INFO ---
  const fetchInfos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/info");
      
      if (Array.isArray(response.data)) {
        const sortedData = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setInfos(sortedData);
      }
    } catch (error) {
      console.error("Gagal mengambil data info:", error);
      setInfos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  // --- LOGIKA PENCARIAN ---
  const filteredInfos = infos.filter((item) => {
    const judulAman = item.judul ? item.judul : ""; 
    return judulAman.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* 1. NAVBAR HEADER DENGAN SEARCH BAR */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
            <Newspaper size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pusat Informasi</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Update & Pengumuman Perusahaan</p>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari info berdasarkan judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 transition-all text-slate-800"
          />
        </div>
      </div>

      {/* 2. LIST KONTEN INFO (MEMBENTUK 1 HALAMAN KE BAWAH) */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-white border border-slate-100 rounded-2xl anonymity-pulse animate-pulse" />
          ))}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="p-4 bg-slate-50 inline-block rounded-full mb-4">
            <Info size={40} className="text-slate-300" />
          </div>
          <h3 className="text-slate-500 font-bold">Informasi tidak ditemukan</h3>
        </div>
      ) : (
        <div className="space-y-8">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border-b border-slate-100 pb-8 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Judul Tampil Besar di Atas untuk Versi Mobile jika Layar Kecil */}
              <div className="w-full md:hidden space-y-2">
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {item.judul || "Tanpa Judul"}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
                </div>
              </div>

              {/* Sisi Kiri: Image Container */}
              <div className="w-full md:w-72 h-44 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100">
                {item.gambarInfo ? (
                  <img 
                    src={item.gambarInfo} 
                    alt={item.judul || "Info Gambar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <ImageIcon size={36} />
                  </div>
                )}
              </div>

              {/* Sisi Kanan: Konten Teks & Deskripsi */}
              <div className="flex-grow space-y-3 w-full">
                {/* Judul Besar Versi Desktop */}
                <div className="hidden md:block space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight hover:text-green-600 transition-colors">
                    {item.judul || "Tanpa Judul"}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Calendar size={14} />
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
                  </div>
                </div>

                {/* Deskripsi dengan Pemotongan Titik-titik (Line Clamp) */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {item.deskripsi || "Tidak ada deskripsi tersedia untuk informasi ini."}
                </p>

                {/* Button Aksi Mengarah ke Halaman Baru */}
                <div className="pt-2">
                  <Link 
                    href={`/dashboard/informasi/${item.id}`}
                    className="inline-block px-4 py-2 bg-[#7CB342] hover:bg-[#689F38] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. PAGINATION BUTTONS */}
      {filteredInfos.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-[#7CB342] text-white shadow-md shadow-green-100" 
                  : "bg-white border border-slate-200 text-slate-500 hover:border-green-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

    </div>
  );
}