"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Receipt, Send, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock3, XCircle, FileText, Upload, ExternalLink } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function ReimbursementPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE FORM INTERFACES ---
  const [tanggalInput, setTanggalInput] = useState("");
  const [namaReimbursement, setNamaReimbursement] = useState("");
  const [jumlahInput, setJumlahInput] = useState(""); // Nilai asli angka string
  const [fileBerkas, setFileBerkas] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE TABLE, FILTER & PAGINATION ---
  const [historyReimbursement, setHistoryReimbursement] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [filterBulan, setFilterBulan] = useState<number | string>(new Date().getMonth() + 1); // Bulan sekarang
  const [filterTahun, setFilterTahun] = useState<number | string>(new Date().getFullYear()); // Tahun sekarang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tahunSekarang = new Date().getFullYear();
  const tahunLalu = tahunSekarang - 1;

  // Mengambil KaryawanId secara aman dari localStorage
  const getKaryawanId = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("id");
    }
    return null;
  };

  // --- GET DATA HISTORY ---
  const fetchHistoryReimbursement = async () => {
    const karyawanId = getKaryawanId();
    if (!karyawanId) {
      addToast("Karyawan ID tidak ditemukan, silahkan login ulang.", "error");
      return;
    }

    try {
      setTableLoading(true);
      const response = await api.get(`/reimbursement`);
      
      // Filter data di frontend berdasarkan KaryawanId dari localStorage
      const dataFilter = response.data.filter((e: { KaryawanId: number; }) => e.KaryawanId === Number(karyawanId));
      setHistoryReimbursement(dataFilter);
    } catch (error) {
      console.error(error);
      setHistoryReimbursement([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryReimbursement();
  }, []);

  // --- HANDLER INPUT RUPIAH ---
  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Hanya mengizinkan angka
    setJumlahInput(value);
  };

  // --- SUBMIT AJUKAN REIMBURSEMENT ---
  const handleSubmitReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    const karyawanId = getKaryawanId();

    if (!karyawanId) {
      addToast("Sesi habis, ID Karyawan tidak valid.", "error");
      return;
    }
    if (!tanggalInput || !namaReimbursement || !jumlahInput) {
      addToast("Harap isi semua field input klaim.", "info");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();
      formData.append("KaryawanId", String(karyawanId));
      formData.append("tanggal", new Date(tanggalInput).toISOString());
      formData.append("namaReimbursement", namaReimbursement);
      formData.append("jumlah", jumlahInput);
      formData.append("status", "waitconfirm");
      if (fileBerkas) {
        formData.append("berkas", fileBerkas);
      }

      await api.post("/reimbursement", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      addToast("Pengajuan reimbursement berhasil dikirim!", "success");
      
      // Reset Form
      setTanggalInput("");
      setNamaReimbursement("");
      setJumlahInput("");
      setFileBerkas(null);
      
      fetchHistoryReimbursement();
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Gagal mengirim pengajuan reimbursement.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- LOGIKA FILTERING & SORTING ASCENDING ---
  const filteredData = historyReimbursement
    .filter((item) => {
      const date = new Date(item.tanggal);
      const matchBulan = filterBulan !== "" ? (date.getMonth() + 1) === Number(filterBulan) : true;
      const matchTahun = filterTahun !== "" ? date.getFullYear() === Number(filterTahun) : true;
      return matchBulan && matchTahun;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterBulan, filterTahun]);

  // --- HELPER FORMATTER ---
  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatRupiah = (angka: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(Number(angka));
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "diterima":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
            <CheckCircle2 size={14} /> Diterima
          </span>
        );
      case "waitconfirm":
      case "menunggu konfirmasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full border border-amber-100">
            <Clock3 size={14} /> Wait Confirm
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
      
      {/* CARD 1: FORM PENGAJUAN REIMBURSEMENT */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Receipt size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Form Klaim Reimbursement</h2>
            <p className="text-xs text-slate-400 font-medium">Ajukan pengembalian dana operasional atau nota belanja kerja kamu</p>
          </div>
        </div>

        <form onSubmit={handleSubmitReimbursement} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tanggal */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Tanggal Nota</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                value={tanggalInput}
                onChange={(e) => setTanggalInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-medium text-slate-800"
                required
              />
            </div>
          </div>

          {/* Nama Reimbursement */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Nama Kebutuhan Reimburse</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Contoh: Pembayaran internet bulanan"
                value={namaReimbursement}
                onChange={(e) => setNamaReimbursement(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-medium text-slate-800"
                required
              />
            </div>
          </div>

          {/* Jumlah Dana dengan Format IDR */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Jumlah Dana (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
              <input
                type="text"
                placeholder="Contoh: 400.000"
                value={jumlahInput ? Number(jumlahInput).toLocaleString("id-ID") : ""}
                onChange={handleJumlahChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-bold text-slate-800"
                required
              />
            </div>
          </div>

          {/* Upload File Berkas */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Upload Berkas / Nota</label>
            <div className="relative">
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFileBerkas(e.target.files?.[0] || null)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-medium text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Button Submit */}
          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{submitLoading ? "Mengirim..." : "Ajukan Klaim"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* CARD 2: FILTER & TABEL RIWAYAT */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden">
        
        {/* NAVBAR FILTER */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-slate-500" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Riwayat Klaim Reimbursement</h3>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-500/20"
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
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">Semua Tahun</option>
              <option value={tahunSekarang}>{tahunSekarang}</option>
              <option value={tahunLalu}>{tahunLalu}</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE AREA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/20">
                <th className="py-4 px-6 w-12">No</th>
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Nama Reimbursement</th>
                <th className="py-4 px-6">Jumlah</th>
                {/* 🌟 KOLOM BARU UNTUK UNGGAHAN BERKAS */}
                <th className="py-4 px-6">Berkas Nota</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {tableLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-slate-800 mr-2 align-middle"></div>
                    Memuat data klaim...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Tidak ada riwayat klaim reimbursement di periode ini.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-mono">{indexOfFirstItem + index + 1}</td>
                    <td className="py-4 px-6 text-slate-600">{formatTanggal(item.tanggal)}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{item.namaReimbursement}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{formatRupiah(item.jumlah)}</td>
                    
                    {/* 🌟 CELL DARI KOLOM BERKAS NOTA YANG BISA DIKLIK */}
                    <td className="py-4 px-6">
                      {item.imageUrl ? (
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          <ExternalLink size={13} />
                          <span>Lihat Berkas</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 font-bold font-mono">-</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">{renderStatusBadge(item.status)}</td>
                  </tr>
                ))
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