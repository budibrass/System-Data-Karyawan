"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { Clock, Check, X, ChevronLeft, ChevronRight, Loader2, Info, Eye } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

interface KaryawanDetail {
  namaDepan: string;
  namaBelakang: string;
}

interface LemburItem {
  deskripsi: ReactNode;
  id: number;
  KaryawanId: number;
  tanggal: string;
  lamaJam: number;
  status: string;
  Karyawan?: KaryawanDetail;
}

interface CutiItem {
  id: number;
  KaryawanId: number;
  mulaiTanggal: string;
  sampaiTanggal: string;
  alasan: string;
  status: string;
  Karyawan?: KaryawanDetail;
}

interface ReimbursementItem {
  id: number;
  KaryawanId: number;
  tanggal: string;
  namaReimbursement: string;
  jumlah: number;
  status: string;
  imageUrl?: string; // 🌟 Menambahkan properti imageUrl dari API
  Karyawan?: KaryawanDetail;
}

export default function PengajuanPage() {
  const addToast = useToastStore((state) => state.addToast);
  const itemsPerPage = 5; // Batasan maksimal 5 data per halaman

  // ==========================================
  // --- STATE & PAGINATION: TABEL LEMBUR ---
  // ==========================================
  const [lemburData, setLemburData] = useState<LemburItem[]>([]);
  const [fetchLemburLoading, setFetchLemburLoading] = useState(true);
  const [actionLemburLoadingId, setActionLemburLoadingId] = useState<number | null>(null);
  const [currentLemburPage, setCurrentLemburPage] = useState(1);
  const [totalLemburPages, setTotalLemburPages] = useState(1);

  // ==========================================
  // --- STATE & PAGINATION: TABEL CUTI ---
  // ==========================================
  const [cutiData, setCutiData] = useState<CutiItem[]>([]);
  const [fetchCutiLoading, setFetchCutiLoading] = useState(true);
  const [actionCutiLoadingId, setActionCutiLoadingId] = useState<number | null>(null);
  const [currentCutiPage, setCurrentCutiPage] = useState(1);
  const [totalCutiPages, setTotalCutiPages] = useState(1);

  // ==========================================
  // --- STATE & PAGINATION: TABEL REIMBURSEMENT ---
  // ==========================================
  const [reimbursementData, setReimbursementData] = useState<ReimbursementItem[]>([]);
  const [fetchReimbursementLoading, setFetchReimbursementLoading] = useState(true);
  const [actionReimbursementLoadingId, setActionReimbursementLoadingId] = useState<number | null>(null);
  const [currentReimbursementPage, setCurrentReimbursementPage] = useState(1);
  const [totalReimbursementPages, setTotalReimbursementPages] = useState(1);

  // ==========================================
  // --- LOGIKA UTAMA: FETCH DATA LEMBUR ---
  // ==========================================
  const fetchLembur = async () => {
    try {
      setFetchLemburLoading(true);
      const response = await api.get("/lembur");
      const responseData = response.data?.data ? response.data.data : response.data;
      let targetList: LemburItem[] = [];

      if (Array.isArray(responseData)) {
        targetList = responseData;
      } else if (responseData && Array.isArray(responseData.list)) {
        targetList = responseData.list;
      }

      const filteredList = targetList.filter(
        (item) => item.status?.toLowerCase() === "menunggu konfirmasi"
      );

      setLemburData(filteredList);
      setTotalLemburPages(Math.ceil(filteredList.length / itemsPerPage) || 1);
    } catch (error) {
      console.error("Gagal mengambil data lembur:", error);
      addToast("Gagal memuat data pengajuan lembur.", "error");
      setLemburData([]);
      setTotalLemburPages(1);
    } finally {
      setFetchLemburLoading(false);
    }
  };

  // ==========================================
  // --- LOGIKA UTAMA: FETCH DATA CUTI ---
  // ==========================================
  const fetchCuti = async () => {
    try {
      setFetchCutiLoading(true);
      const response = await api.get("/cuti");
      const responseData = response.data?.data ? response.data.data : response.data;
      let targetList: CutiItem[] = [];

      if (Array.isArray(responseData)) {
        targetList = responseData;
      } else if (responseData && Array.isArray(responseData.list)) {
        targetList = responseData.list;
      }

      const filteredList = targetList.filter(
        (item) => item.status?.toLowerCase() === "menunggu konfirmasi"
      );

      setCutiData(filteredList);
      setTotalCutiPages(Math.ceil(filteredList.length / itemsPerPage) || 1);
    } catch (error) {
      console.error("Gagal mengambil data cuti:", error);
      addToast("Gagal memuat data pengajuan cuti.", "error");
      setCutiData([]);
      setTotalCutiPages(1);
    } finally {
      setFetchCutiLoading(false);
    }
  };

  // ==========================================
  // --- LOGIKA UTAMA: FETCH DATA REIMBURSEMENT ---
  // ==========================================
  const fetchReimbursement = async () => {
    try {
      setFetchReimbursementLoading(true);
      const response = await api.get("/reimbursement");
      const responseData = response.data?.data ? response.data.data : response.data;
      let targetList: ReimbursementItem[] = [];

      if (Array.isArray(responseData)) {
        targetList = responseData;
      } else if (responseData && Array.isArray(responseData.list)) {
        targetList = responseData.list;
      }

      const filteredList = targetList.filter(
        (item) => item.status?.toLowerCase() === "waitconfirm"
      );

      setReimbursementData(filteredList);
      setTotalReimbursementPages(Math.ceil(filteredList.length / itemsPerPage) || 1);
    } catch (error) {
      console.error("Gagal mengambil data reimbursement:", error);
      addToast("Gagal memuat data pengajuan reimbursement.", "error");
      setReimbursementData([]);
      setTotalReimbursementPages(1);
    } finally {
      setFetchReimbursementLoading(false);
    }
  };

  useEffect(() => {
    fetchLembur();
    fetchCuti();
    fetchReimbursement();
  }, []);

  // ==========================================
  // --- ACTION HANDLER: UPDATE LEMBUR ---
  // ==========================================
  const handleUpdateStatusLembur = async (item: LemburItem, newStatus: "diterima" | "ditolak") => {
    const actionText = newStatus === "diterima" ? "menerima" : "menolak";
    const konfirmasi = confirm(`Apakah Anda yakin ingin ${actionText} pengajuan lembur ini?`);
    if (!konfirmasi) return;

    try {
      setActionLemburLoadingId(item.id);
      const payload = {
        KaryawanId: item.KaryawanId,
        tanggal: item.tanggal,
        lamaJam: item.lamaJam,
        status: newStatus,
      };

      await api.put(`/lembur/${item.id}`, payload);
      addToast(`Pengajuan lembur berhasil di-${newStatus}!`, "success");
      
      const currentDataAfterAction = lemburData.length - 1;
      const newTotalPages = Math.ceil(currentDataAfterAction / itemsPerPage) || 1;
      if (currentLemburPage > newTotalPages) {
        setCurrentLemburPage(newTotalPages);
      }
      fetchLembur();
    } catch (error) {
      console.error(`Gagal mengupdate status lembur menjadi ${newStatus}:`, error);
      addToast(`Gagal memproses tindakan ${actionText} pengajuan.`, "error");
    } finally {
      setActionLemburLoadingId(null);
    }
  };

  // ==========================================
  // --- ACTION HANDLER: UPDATE CUTI ---
  // ==========================================
  const handleUpdateStatusCuti = async (item: CutiItem, newStatus: "diterima" | "ditolak") => {
    const actionText = newStatus === "diterima" ? "menerima" : "menolak";
    const konfirmasi = confirm(`Apakah Anda yakin ingin ${actionText} pengajuan cuti ini?`);
    if (!konfirmasi) return;

    try {
      setActionCutiLoadingId(item.id);
      const payload = {
        KaryawanId: item.KaryawanId,
        mulaiTanggal: item.mulaiTanggal,
        sampaiTanggal: item.sampaiTanggal,
        alasan: item.alasan,
        status: newStatus,
      };

      await api.put(`/cuti/${item.id}`, payload);
      addToast(`Pengajuan cuti berhasil di-${newStatus}!`, "success");
      
      const currentDataAfterAction = cutiData.length - 1;
      const newTotalPages = Math.ceil(currentDataAfterAction / itemsPerPage) || 1;
      if (currentCutiPage > newTotalPages) {
        setCurrentCutiPage(newTotalPages);
      }
      fetchCuti();
    } catch (error) {
      console.error(`Gagal mengupdate status cuti menjadi ${newStatus}:`, error);
      addToast(`Gagal memproses tindakan ${actionText} pengajuan.`, "error");
    } finally {
      setActionCutiLoadingId(null);
    }
  };

  // ==========================================
  // --- ACTION HANDLER: UPDATE REIMBURSEMENT ---
  // ==========================================
  const handleUpdateStatusReimbursement = async (item: ReimbursementItem, newStatus: "diterima" | "ditolak") => {
    const actionText = newStatus === "diterima" ? "menerima" : "menolak";
    const konfirmasi = confirm(`Apakah Anda yakin ingin ${actionText} pengajuan reimbursement ini?`);
    if (!konfirmasi) return;

    try {
      setActionReimbursementLoadingId(item.id);
      const payload = {
        KaryawanId: item.KaryawanId,
        tanggal: item.tanggal,
        namaReimbursement: item.namaReimbursement,
        jumlah: item.jumlah,
        status: newStatus,
      };

      await api.put(`/reimbursement/${item.id}`, payload);
      addToast(`Pengajuan reimbursement berhasil di-${newStatus}!`, "success");
      
      const currentDataAfterAction = reimbursementData.length - 1;
      const newTotalPages = Math.ceil(currentDataAfterAction / itemsPerPage) || 1;
      if (currentReimbursementPage > newTotalPages) {
        setCurrentReimbursementPage(newTotalPages);
      }
      fetchReimbursement();
    } catch (error) {
      console.error(`Gagal mengupdate status reimbursement menjadi ${newStatus}:`, error);
      addToast(`Gagal memproses tindakan ${actionText} pengajuan.`, "error");
    } finally {
      setActionReimbursementLoadingId(null);
    }
  };

  // Helper Formatter Tanggal
  const formatTanggal = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Helper Formatter Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-10">
      
      {/* SECTION TITLE & HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Daftar Pengajuan Karyawan</h2>
          <p className="text-xs text-slate-400 font-medium">
            Verifikasi dan kelola permohonan transaksional dari seluruh divisi karyawan.
          </p>
        </div>
      </div>

      {/* ==========================================
          TABEL 1: PENGAJUAN LEMBUR
          ========================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-amber-500 rounded-full block"></span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengajuan Lembur</h3>
          </div>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Menunggu Konfirmasi
          </span>
        </div>

        {fetchLemburLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Loader2 size={32} className="animate-spin mx-auto text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-wider">Memuat data lembur...</p>
          </div>
        ) : lemburData.length === 0 ? (
          <div className="text-center py-16 bg-white space-y-3">
            <div className="p-3 bg-slate-50 inline-block rounded-full">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Tidak ada pengajuan lembur dengan status menunggu konfirmasi.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="py-4 px-6 w-16">No</th>
                    <th className="py-4 px-6">ID Karyawan</th>
                    <th className="py-4 px-6">Nama Karyawan</th>
                    <th className="py-4 px-6">Tanggal Pengajuan</th>
                    <th className="py-4 px-6">Durasi Lembur</th>
                    <th className="py-4 px-6">Deskripsi</th>
                    <th className="py-4 px-6 text-center w-48">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                  {lemburData
                    .slice((currentLemburPage - 1) * itemsPerPage, currentLemburPage * itemsPerPage)
                    .map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-bold">
                          {(currentLemburPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-xs font-bold">
                          #{item?.KaryawanId}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {item.Karyawan ? `${item.Karyawan.namaDepan} ${item.Karyawan.namaBelakang}` : `Karyawan #${item.KaryawanId}`}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-bold">
                          {item.lamaJam} Jam
                        </td>
                        <td className="py-4 px-6 text-slate-500 italic max-w-xs break-words whitespace-normal">
                          {item.deskripsi}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStatusLembur(item, "diterima")}
                              disabled={actionLemburLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionLemburLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              <span>Terima</span>
                            </button>
                            
                            <button
                              onClick={() => handleUpdateStatusLembur(item, "ditolak")}
                              disabled={actionLemburLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionLemburLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                              <span>Tolak</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
              <span className="text-xs font-semibold text-slate-400">
                Halaman {currentLemburPage} dari {totalLemburPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentLemburPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentLemburPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentLemburPage((prev) => Math.min(prev + 1, totalLemburPages))}
                  disabled={currentLemburPage === totalLemburPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==========================================
          TABEL 2: PENGAJUAN CUTI 
          ========================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-500 rounded-full block"></span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengajuan Cuti</h3>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Menunggu Konfirmasi
          </span>
        </div>

        {fetchCutiLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Loader2 size={32} className="animate-spin mx-auto text-blue-500" />
            <p className="text-xs font-semibold uppercase tracking-wider">Memuat data cuti...</p>
          </div>
        ) : cutiData.length === 0 ? (
          <div className="text-center py-16 bg-white space-y-3">
            <div className="p-3 bg-slate-50 inline-block rounded-full">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Tidak ada pengajuan cuti dengan status menunggu konfirmasi.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="py-4 px-6 w-16">No</th>
                    <th className="py-4 px-6">ID Karyawan</th>
                    <th className="py-4 px-6">Nama Karyawan</th>
                    <th className="py-4 px-6">Mulai Tanggal</th>
                    <th className="py-4 px-6">Sampai Tanggal</th>
                    <th className="py-4 px-6">Alasan</th>
                    <th className="py-4 px-6 text-center w-48">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                  {cutiData
                    .slice((currentCutiPage - 1) * itemsPerPage, currentCutiPage * itemsPerPage)
                    .map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-bold">
                          {(currentCutiPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-xs font-bold">
                          #{item?.KaryawanId}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {item.Karyawan ? `${item.Karyawan.namaDepan} ${item.Karyawan.namaBelakang}` : `Karyawan #${item.KaryawanId}`}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {formatTanggal(item.mulaiTanggal)}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {formatTanggal(item.sampaiTanggal)}
                        </td>
                        <td className="py-4 px-6 text-slate-500 italic max-w-xs truncate" title={item.alasan}>
                          "{item.alasan}"
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStatusCuti(item, "diterima")}
                              disabled={actionCutiLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionCutiLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              <span>Terima</span>
                            </button>
                            
                            <button
                              onClick={() => handleUpdateStatusCuti(item, "ditolak")}
                              disabled={actionCutiLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionCutiLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                              <span>Tolak</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
              <span className="text-xs font-semibold text-slate-400">
                Halaman {currentCutiPage} dari {totalCutiPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentCutiPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentCutiPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentCutiPage((prev) => Math.min(prev + 1, totalCutiPages))}
                  disabled={currentCutiPage === totalCutiPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==========================================
          TABEL 3: PENGAJUAN REIMBURSEMENT
          ========================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-purple-500 rounded-full block"></span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengajuan Reimbursement</h3>
          </div>
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Menunggu Konfirmasi
          </span>
        </div>

        {fetchReimbursementLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Loader2 size={32} className="animate-spin mx-auto text-purple-500" />
            <p className="text-xs font-semibold uppercase tracking-wider">Memuat data reimbursement...</p>
          </div>
        ) : reimbursementData.length === 0 ? (
          <div className="text-center py-16 bg-white space-y-3">
            <div className="p-3 bg-slate-50 inline-block rounded-full">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Tidak ada pengajuan reimbursement dengan status menunggu konfirmasi.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="py-4 px-6 w-16">No</th>
                    <th className="py-4 px-6">ID Karyawan</th>
                    <th className="py-4 px-6">Nama Karyawan</th>
                    <th className="py-4 px-6">Tanggal Pengajuan</th>
                    <th className="py-4 px-6">Nama Reimbursement</th>
                    <th className="py-4 px-6">Jumlah</th>
                    {/* 🌟 PENAMBAHAN TH BUKTI DOKUMEN */}
                    <th className="py-4 px-6 text-center">Bukti</th>
                    <th className="py-4 px-6 text-center w-48">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                  {reimbursementData
                    .slice((currentReimbursementPage - 1) * itemsPerPage, currentReimbursementPage * itemsPerPage)
                    .map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-bold">
                          {(currentReimbursementPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-xs font-bold">
                          #{item?.KaryawanId}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {item.Karyawan ? `${item.Karyawan.namaDepan} ${item.Karyawan.namaBelakang}` : `Karyawan #${item.KaryawanId}`}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {item.namaReimbursement}
                        </td>
                        <td className="py-4 px-6 text-emerald-600 font-bold">
                          {formatRupiah(item.jumlah)}
                        </td>
                        {/* 🌟 TD BUKTI DOKUMEN (Bisa buka PDF maupun gambar secara native di tab baru) */}
                        <td className="py-4 px-6 text-center">
                          {item.imageUrl ? (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs truncate"
                            >
                              <Eye size={14} />
                              <span>Lihat Bukti</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic font-normal">Tidak ada file</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStatusReimbursement(item, "diterima")}
                              disabled={actionReimbursementLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionReimbursementLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              <span>Terima</span>
                            </button>
                            
                            <button
                              onClick={() => handleUpdateStatusReimbursement(item, "ditolak")}
                              disabled={actionReimbursementLoadingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {/* 🌟 Perbaikan bug kecil: Mengganti actionLemburLoadingId menjadi actionReimbursementLoadingId */}
                              {actionReimbursementLoadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                              <span>Tolak</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
              <span className="text-xs font-semibold text-slate-400">
                Halaman {currentReimbursementPage} dari {totalReimbursementPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentReimbursementPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentReimbursementPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentReimbursementPage((prev) => Math.min(prev + 1, totalReimbursementPages))}
                  disabled={currentReimbursementPage === totalReimbursementPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}