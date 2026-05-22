"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Send, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock3, XCircle, FileText, User } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function LemburPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE DETEKSI ROLE & USER ---
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentKaryawanId, setCurrentKaryawanId] = useState<string | null>(null);

  // --- STATE FORM INTERFACES (Hanya untuk Karyawan) ---
  const [tanggalInput, setTanggalInput] = useState("");
  const [lamaJamInput, setLamaJamInput] = useState("");
  const [deskripsiInput, setDeskripsiInput] = useState(""); 
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE TABLE, FILTER & PAGINATION ---
  const [historyLembur, setHistoryLembur] = useState<any[]>([]);
  const [daftarKaryawan, setDaftarKaryawan] = useState<any[]>([]); // Menyimpan list unik karyawan untuk filter admin
  const [tableLoading, setTableLoading] = useState(true);
  
  const [filterBulan, setFilterBulan] = useState<number | string>(new Date().getMonth() + 1); 
  const [filterTahun, setFilterTahun] = useState<number | string>(new Date().getFullYear()); 
  const [filterAdminKaryawan, setFilterAdminKaryawan] = useState<string>(""); // State filter nama karyawan (Khusus Admin)
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tahunSekarang = new Date().getFullYear();

  // --- AMBIL SESSION USER & DATA AWAL ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role"); // Mengambil role (admin / karyawan)
      const id = localStorage.getItem("id");
      setUserRole(role ? role.toLowerCase() : "karyawan");
      setCurrentKaryawanId(id);
    }
  }, []);

  const fetchHistoryLembur = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("id")) {
      addToast("Sesi habis, silahkan login ulang.", "error");
      return;
    }

    try {
      setTableLoading(true);
      const response = await api.get(`/lembur`);
      const role = localStorage.getItem("role")?.toLowerCase();
      const karyawanId = localStorage.getItem("id");

      if (role === "admin") {
        // 1. Jika Admin: Masukkan semua data lembur tanpa di-filter di awal
        setHistoryLembur(response.data);

        // 2. Ekstrak daftar nama karyawan unik dari relasi include model Karyawan untuk opsi dropdown filter
        const listKaryawan: any[] = [];
        const uniqueIds = new Set();

        response.data.forEach((item: any) => {
          if (item.Karyawan && !uniqueIds.has(item.KaryawanId)) {
            uniqueIds.add(item.KaryawanId);
            listKaryawan.push({
              id: item.KaryawanId,
              nama: item.Karyawan.namaDepan ? `${item.Karyawan.namaDepan} ${item.Karyawan.namaBelakang || ""}` : `Karyawan ID: ${item.KaryawanId}`
            });
          }
        });
        setDaftarKaryawan(listKaryawan);
      } else {
        // 3. Jika Bukan Admin: Filter data yang KaryawanId-nya sesuai dengan milik user sendiri
        const dataFilter = response.data.filter((e: { KaryawanId: number; }) => e.KaryawanId === Number(karyawanId));
        setHistoryLembur(dataFilter);
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || "Koneksi ke Server Gagal", "error");
      setHistoryLembur([]); 
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (userRole !== null) {
      fetchHistoryLembur();
    }
  }, [userRole]);

  // --- SUBMIT AJUKAN LEMBUR ---
  const handleSubmitLembur = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentKaryawanId) {
      addToast("Sesi habis, ID Karyawan tidak valid.", "error");
      return;
    }
    if (!tanggalInput || !lamaJamInput || !deskripsiInput) { 
      addToast("Harap isi semua field input lembur termasuk deskripsi.", "warning");
      return;
    }

    try {
      setSubmitLoading(true);
      
      const payload = {
        KaryawanId: Number(currentKaryawanId),
        tanggal: new Date(tanggalInput).toISOString(),
        lamaJam: Number(lamaJamInput),
        status: "menunggu konfirmasi",
        deskripsi: deskripsiInput 
      };

      await api.post("/lembur", payload);
      addToast("Pengajuan lembur berhasil dikirim!", "success");
      
      setTanggalInput("");
      setLamaJamInput("");
      setDeskripsiInput(""); 
      
      fetchHistoryLembur();
    } catch (error) {
      addToast("Gagal mengirim pengajuan lembur.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- LOGIKA FILTERING MULTI-LEVEL & SORTING ASCENDING ---
  const filteredData = historyLembur
    .filter((item) => {
      const date = new Date(item.tanggal);
      
      const matchBulan = filterBulan !== "" ? (date.getMonth() + 1) === Number(filterBulan) : true;
      const matchTahun = filterTahun !== "" ? date.getFullYear() === Number(filterTahun) : true;
      
      // 🌟 REKAYASA FILTER ADMIN: Jika role admin dan filter nama dipilih, filter berdasarkan KaryawanId
      const matchKaryawan = (userRole === "admin" && filterAdminKaryawan !== "") 
        ? item.KaryawanId === Number(filterAdminKaryawan) 
        : true;

      return matchBulan && matchTahun && matchKaryawan;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterBulan, filterTahun, filterAdminKaryawan]);

  // --- HELPER FORMATTER ---
  const formatHari = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { weekday: "long" });
  };

  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "diterima":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
            <CheckCircle2 size={14} /> Diterima
          </span>
        );
      case "menunggu konfirmasi":
      case "waitconfirm":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full border border-amber-100">
            <Clock3 size={14} /> Menunggu Konfirmasi
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-100">
            <XCircle size={14} /> Ditolak
          </span>
        );
      default:
        return <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* CARD 1: FORM PENGAJUAN LEMBUR) */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Form Pengajuan Lembur</h2>
            <p className="text-xs text-slate-400 font-medium">Kirim formulir lembur harian kamu ke tim finance/HR</p>
          </div>
        </div>

        <form onSubmit={handleSubmitLembur} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Tanggal Lembur</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={tanggalInput}
                  onChange={(e) => setTanggalInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Durasi (Jam)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="Contoh: 3"
                  value={lamaJamInput}
                  onChange={(e) => setLamaJamInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Deskripsi Pekerjaan / Keterangan Lembur</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                rows={3}
                placeholder="Jelaskan detail pekerjaan yang diselesaikan selama lembur..."
                value={deskripsiInput}
                onChange={(e) => setDeskripsiInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-800 outline-none resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full md:w-52 cursor-pointer py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{submitLoading ? "Mengirim..." : "Ajukan Lembur"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* CARD 2: FILTER & TABEL RIWAYAT */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-slate-500" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              {userRole === "admin" ? "Daftar Pengajuan Lembur Seluruh Karyawan" : "Riwayat Pengajuan Lembur"}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* 🌟 REKAYASA FILTER DROPDOWN KARYAWAN: Hanya tampil jika yang masuk adalah Admin */}
            {userRole === "admin" && (
              <select
                value={filterAdminKaryawan}
                onChange={(e) => setFilterAdminKaryawan(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Semua Karyawan</option>
                {daftarKaryawan.map((krw) => (
                  <option key={krw.id} value={krw.id}>
                    {krw.nama}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Semua Bulan</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2026, i).toLocaleDateString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Semua Tahun</option>
              <option value={tahunSekarang}>{tahunSekarang}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/20">
                <th className="py-4 px-6 w-16">No</th>
                {/* 🌟 TAMBAHAN KOLOM KARYAWAN: Hanya tampil di tabel jika user adalah Admin */}
                {userRole === "admin" && <th className="py-4 px-6">Nama Karyawan</th>}
                <th className="py-4 px-6">Hari</th>
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Jam Lembur</th>
                <th className="py-4 px-6">Deskripsi</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {tableLoading ? (
                <tr>
                  <td colSpan={userRole === "admin" ? 7 : 6} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-slate-800 mr-2 align-middle"></div>
                    Memuat riwayat lembur...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? 7 : 6} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Tidak ada riwayat pengajuan lembur di periode ini.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  const namaLengkap = item.Karyawan 
                    ? `${item.Karyawan.namaDepan} ${item.Karyawan.namaBelakang || ""}` 
                    : `ID: ${item.KaryawanId}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 text-slate-400 font-mono">{indexOfFirstItem + index + 1}</td>
                      
                      {/* 🌟 RENDERING KOLOM NAMA KARYAWAN (Khusus Admin) */}
                      {userRole === "admin" && (
                        <td className="py-4 px-6 font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-slate-100 rounded text-slate-600">
                              <User size={12} />
                            </div>
                            <span className="truncate max-w-[150px]">{namaLengkap}</span>
                          </div>
                        </td>
                      )}

                      <td className="py-4 px-6 capitalize text-slate-700">{formatHari(item.tanggal)}</td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                      <td className="py-4 px-6 font-semibold whitespace-nowrap">{item.lamaJam} Jam</td>
                      
                      <td className="py-4 px-6 text-xs text-slate-500 max-w-xs break-words font-normal">
                        {item.deskripsi || <span className="text-slate-300 italic">Tidak ada keterangan</span>}
                      </td>

                      <td className="py-4 px-6 text-right">{renderStatusBadge(item.status)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {filteredData.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-xs font-black px-3 py-1 bg-slate-100 rounded-md text-slate-800">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}