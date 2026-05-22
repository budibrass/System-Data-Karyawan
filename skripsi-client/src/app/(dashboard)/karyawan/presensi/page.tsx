"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LogIn, LogOut, Users, Clock, AlertCircle, ChevronLeft, ChevronRight, Printer, User } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function AbsensiPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  
  const { role, email } = useAuthStore((state) => state); 
  const currentUserId = localStorage.id; 
  
  // Memastikan role admin dicek dengan aman (case-insensitive sesuai kebutuhan backend-mu)
  const isAdmin = role?.toLowerCase() === "admin";

  const [presensiList, setPresensiList] = useState<any[]>([]);
  const [karyawanList, setKaryawanList] = useState<any[]>([]); // State menampung daftar karyawan (Khusus Admin)
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // State Status Hari Ini (Untuk komponen Clock In / Clock Out user aktif)
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [hasClockedInToday, setHasClockedInToday] = useState(false);
  const [hasClockedOutToday, setHasClockedOutToday] = useState(false);

  // 🌟 NEW FILTER: State Karyawan Terpilih (Default ke user aktif saat ini)
  const [selectedKaryawanId, setSelectedKaryawanId] = useState<string>(currentUserId || "");

  // State Filter Bulan dan Tahun
  const currentTempDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentTempDate.getMonth() + 1)); 
  const [selectedYear, setSelectedYear] = useState<string>(String(currentTempDate.getFullYear()));

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- FETCH DAFTAR KARYAWAN (HANYA UNTUK ADMIN) ---
  const fetchDaftarKaryawan = async () => {
    if (!isAdmin) return;
    try {
      const response = await api.get("/karyawan");
      const data = response.data?.data ? response.data.data : response.data;
      if (Array.isArray(data)) {
        setKaryawanList(data);
      }
    } catch (error) {
      console.error("Gagal memuat daftar karyawan untuk filter:", error);
    }
  };

  // --- FETCH HISTORY ABSENSI ALL ---
  const fetchPresensi = async () => {
    try {
      setLoading(true);
      const response = await api.get("/presensi");
      let allData: any[] = [];

      if (Array.isArray(response.data)) {
        allData = response.data;
      } else if (response.data && typeof response.data === "object" && response.data.constructor === Object) {
        allData = [response.data];
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        allData = response.data.data;
      } else if (response.data?.data && typeof response.data.data === "object") {
        allData = [response.data.data];
      }
        
      // 🌟 DINAMIS FILTER: Saring data berdasarkan Karyawan yang sedang dipilih di filter dropdown
      const filteredData = allData.filter((item: any) => Number(item.KaryawanId) === Number(selectedKaryawanId));
      setPresensiList(filteredData);

      // Cek record hari ini khusus untuk user yang sedang aktif log-in (untuk mengendalikan tombol Clock In/Out)
      const userActiveData = allData.filter((item: any) => Number(item.KaryawanId) === Number(currentUserId));
      const todayStr = new Date().toISOString().split("T")[0];
      const findToday = userActiveData.find((item: any) => item.createdAt?.split("T")[0] === todayStr);

      if (findToday) {
        setTodayRecord(findToday);
        setHasClockedInToday(findToday.clockin);
        setHasClockedOutToday(findToday.clockout);
      } else {
        setTodayRecord(null);
        setHasClockedInToday(false);
        setHasClockedOutToday(false);
      }
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Koneksi ke Server Gagal", "error")
      setPresensiList([]); 
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle pertama kali load page
  useEffect(() => {
    fetchDaftarKaryawan();
  }, [role]);

  // Trigger ulang fetch presensi setiap kali filter karyawan berubah
  useEffect(() => {
    if (selectedKaryawanId) {
      fetchPresensi();
    }
  }, [selectedKaryawanId]);

  // Reset ke halaman 1 setiap kali filter waktu berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear]);

  // Mendapatkan nama karyawan terpilih untuk keperluan teks Kop Surat saat di-print
  const getSelectedKaryawanName = () => {
    if (!isAdmin) return email;
    const found = karyawanList.find(k => Number(k.id) === Number(selectedKaryawanId));
    return found ? `${found.namaDepan || ""} ${found.namaBelakang || ""}` : email;
  };

  // Aksi Karyawan: Clock In
  const handleClockIn = async () => {
    if (hasClockedInToday) {
      addToast("Anda telah melakukan clock in pada hari ini!", "info");
      return;
    }

    try {
      setBtnLoading(true);
      const payload = {
        KaryawanId: currentUserId, // Selalu gunakan ID user asli yang menekan tombol
        clockin: true,
        clockout: false,
      };
      await api.post("/presensi", payload);
      addToast("Berhasil melakukan Clock In untuk hari ini!", "success");
      fetchPresensi(); 
    } catch (error: any) {
      addToast(error.response?.data?.message || "Gagal melakukan Clock In", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // Aksi Karyawan: Clock Out
  const handleClockOut = async () => {
    if (!hasClockedInToday) {
      addToast("Anda harus melakukan Clock In terlebih dahulu!", "error");
      return;
    }

    if (hasClockedOutToday) {
      addToast("Anda telah melakukan clock out pada hari ini!", "info");
      return;
    }

    if (!todayRecord?.id) {
      addToast("Data presensi hari ini tidak ditemukan", "error");
      return;
    }

    try {
      setBtnLoading(true);
      const payload = {
        KaryawanId: currentUserId,
        clockin: true,
        clockout: true,
      };
      await api.put(`/presensi/${todayRecord.id}`, payload);
      addToast("Berhasil melakukan Clock Out! Selamat beristirahat.", "success");
      fetchPresensi();
    } catch (error: any) {
      addToast(error.response?.data?.message || "Gagal melakukan Clock Out", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const handlePrint = () => {
    if (filteredPresensi.length === 0) {
      addToast("Tidak ada data presensi pada periode ini yang bisa dicetak", "error");
      return;
    }
    window.print();
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const calculateDuration = (item: any) => {
    if (!item.clockin || !item.clockout || !item.createdAt || !item.updatedAt) {
      return "Tidak diketahui";
    }
    
    const start = new Date(item.createdAt).getTime();
    const end = new Date(item.updatedAt).getTime();
    
    if (end <= start) return "Tidak diketahui";

    const diffInMs = end - start;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffInHours === 0) {
      return `${diffInMinutes} Menit`;
    }
    return `${diffInHours} Jam ${diffInMinutes} Menit`;
  };

  // Logika Pemfilteran Data Waktu di Sisi Klien
  const filteredPresensi = presensiList.filter((item) => {
    if (!item.createdAt) return false;
    const itemDate = new Date(item.createdAt);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    const matchMonth = selectedMonth === "ALL" || Number(selectedMonth) === itemMonth;
    const matchYear = selectedYear === "ALL" || Number(selectedYear) === itemYear;

    return matchMonth && matchYear;
  });

  const availableYears = Array.from(
    new Set([currentTempDate.getFullYear().toString(), ...presensiList.map(item => item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "")])
  ).filter(Boolean).sort((a, b) => b.localeCompare(a));

  // Pagination
  const totalPages = Math.ceil(filteredPresensi.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPresensi.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center print:hidden">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 print:w-full print:max-w-none print:p-0 print:m-0">
      
      {/* Header Kop Surat Cetak */}
      <div className="hidden print:block border-b-2 border-slate-950 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Laporan Riwayat Presensi Karyawan</h1>
        <p className="text-sm text-slate-600 mt-1">Nama Karyawan: <span className="font-bold text-slate-900">{getSelectedKaryawanName()}</span></p>
        <p className="text-xs text-slate-500">Periode: {selectedMonth === "ALL" ? "Semua Bulan" : new Date(2026, Number(selectedMonth) - 1).toLocaleDateString("id-ID", { month: "long" })} {selectedYear === "ALL" ? "Semua Tahun" : selectedYear}</p>
        <p className="text-xs text-slate-500">Tanggal Cetak: {formatDate(new Date().toISOString())}</p>
      </div>

      {/* HEADER NAVBAR STYLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-rose-950 tracking-tight uppercase">Presensi</h1>
          <p className="text-sm text-rose-400 font-bold uppercase tracking-wider mt-0.5">Pencatatan Waktu Masuk & Pulang Kerja</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex cursor-pointer items-center gap-2 px-5 py-3 bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-200 shadow-lg shadow-rose-100/40 transition-all active:scale-95"
          >
            <Printer size={16} />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* CARD UTAMA: STATUS HARI INI */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-100 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-widest opacity-75">Status Kehadiran Anda Hari Ini</p>
          <h2 className="text-2xl font-black">{formatDate(new Date().toISOString())}</h2>
          <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${hasClockedInToday ? "bg-white/20 border-white/40" : "bg-black/20 border-transparent text-rose-200"}`}>
              Clock In: {hasClockedInToday ? `Sudah (${formatTime(todayRecord.createdAt)})` : "Belum"}
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${hasClockedOutToday ? "bg-white/20 border-white/40" : "bg-black/20 border-transparent text-rose-200"}`}>
              Clock Out: {hasClockedOutToday ? `Sudah (${formatTime(todayRecord.updatedAt)})` : "Belum"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleClockIn}
            disabled={btnLoading}
            className="flex-1 cursor-pointer md:flex-initial flex items-center justify-center gap-2 h-14 px-6 bg-white text-rose-600 disabled:bg-rose-200/50 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={18} />
            <span>{hasClockedInToday ? "Clocked In" : "Clock In"}</span>
          </button>

          <button
            onClick={handleClockOut}
            disabled={btnLoading}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 h-14 px-6 bg-slate-950 text-white disabled:bg-slate-800/50 cursor-pointer rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut size={18} />
            <span>{hasClockedOutToday ? "Clocked Out" : "Clock Out"}</span>
          </button>
        </div>
      </div>

      {/* TABEL HISTORI ABSENSI */}
      <div className="bg-white rounded-[2rem] border border-rose-50 shadow-xl shadow-rose-50/40 overflow-hidden print:border-0 print:shadow-none print:rounded-none">
        
        <div className="p-6 border-b border-rose-50 bg-rose-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-rose-500" />
            <h3 className="text-sm font-black text-rose-950 uppercase tracking-wider">
              {isAdmin ? "Monitoring Presensi Personil" : "Histori Presensi Kamu"}
            </h3>
          </div>
          
          {/* BAR FILTER KONTROL */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 🌟 NEW FILTER: Dropdown Pilih Karyawan (Hanya tampil jika user adalah ADMIN) */}
            {isAdmin && (
              <div className="relative flex items-center">
                <User size={14} className="absolute left-3 text-rose-400 pointer-events-none" />
                <select
                  value={selectedKaryawanId}
                  onChange={(e) => setSelectedKaryawanId(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-950 outline-none cursor-pointer shadow-sm transition-all focus:border-rose-300 min-w-[180px]"
                >
                  {karyawanList.map((karyawan) => (
                    <option key={karyawan.id} value={karyawan.id}>
                      {karyawan.namaDepan} {karyawan.namaBelakang || ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-950 outline-none cursor-pointer shadow-sm transition-all focus:border-rose-300"
            >
              <option value="ALL">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-950 outline-none cursor-pointer shadow-sm transition-all focus:border-rose-300"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-rose-50 text-[11px] font-black text-rose-400 uppercase tracking-widest bg-rose-50/10 print:bg-slate-100 print:text-slate-900 print:border-b-2 print:border-slate-300">
                <th className="p-5 print:p-3">No</th>
                <th className="p-5 print:p-3">Tanggal</th>
                <th className="p-5 print:p-3">Jam Masuk (Clock In)</th>
                <th className="p-5 print:p-3">Jam Pulang (Clock Out)</th>
                <th className="p-5 print:p-3">Durasi Kerja</th>
                <th className="p-5 print:p-3 print:hidden">Status Ringkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50/60 text-sm font-bold text-rose-950 print:text-slate-900 print:divide-slate-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-rose-300 italic">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <AlertCircle size={24} />
                      <span>Tidak ada rekam jejak absensi pada periode filter ini.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {/* TAMPILAN WEB NORMAL */}
                  {currentItems.map((item, idx) => {
                    const duration = calculateDuration(item);
                    return (
                      <tr key={`web-${item.id}`} className="hover:bg-rose-50/30 transition-colors print:hidden">
                        <td className="p-5 text-rose-400 font-medium">{indexOfFirstItem + idx + 1}</td>
                        <td className="p-5">{formatDate(item.createdAt)}</td>
                        <td className="p-5">
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black">
                            {item.clockin ? formatTime(item.createdAt) : "-"}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${item.clockout ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                            {item.clockout ? formatTime(item.updatedAt) : "Belum Absen Pulang"}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${duration === "Tidak diketahui" ? "bg-slate-100 text-slate-500 italic font-medium" : "bg-blue-50 text-blue-600"}`}>
                            {duration}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${item.clockin && item.clockout ? "text-emerald-500" : "text-amber-500"}`}>
                            <div className={`w-2 h-2 rounded-full ${item.clockin && item.clockout ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {item.clockin && item.clockout ? "Selesai" : "Aktif Bekerja"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* TAMPILAN PRINTER */}
                  {filteredPresensi.map((item, idx) => {
                    const duration = calculateDuration(item);
                    return (
                      <tr key={`print-${item.id}`} className="hidden print:table-row border-b border-slate-200">
                        <td className="p-3 text-xs text-slate-600 font-medium">{idx + 1}</td>
                        <td className="p-3 text-xs text-slate-900">{formatDate(item.createdAt)}</td>
                        <td className="p-3 text-xs text-slate-900">{item.clockin ? formatTime(item.createdAt) : "-"}</td>
                        <td className="p-3 text-xs text-slate-900">{item.clockout ? formatTime(item.updatedAt) : "Belum Absen"}</td>
                        <td className="p-3 text-xs font-bold text-slate-900">{duration}</td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* CONTROLLER PAGINATION */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-rose-50 bg-rose-50/10 flex items-center justify-between flex-col sm:flex-row gap-4 print:hidden">
            <p className="text-xs font-bold text-rose-900/60">
              Menampilkan <span className="text-rose-600 font-black">{indexOfFirstItem + 1}</span> sampai{" "}
              <span className="text-rose-600 font-black">
                {indexOfLastItem > filteredPresensi.length ? filteredPresensi.length : indexOfLastItem}
              </span>{" "}
              dari <span className="text-rose-600 font-black">{filteredPresensi.length}</span> data presensi
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center p-2 rounded-xl border border-rose-100 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm shadow-rose-100"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      currentPage === page
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "border border-transparent text-rose-950 hover:bg-rose-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center p-2 rounded-xl border border-rose-100 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm shadow-rose-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}