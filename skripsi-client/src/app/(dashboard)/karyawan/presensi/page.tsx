"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  Printer,
  QrCode,
  Upload,
  User,
  X,
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.ITF,
];

// Tanggal lokal (bukan UTC) supaya pergantian hari tepat jam 00.00 waktu setempat
const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isToday = (iso?: string) => !!iso && toDateKey(new Date(iso)) === toDateKey(new Date());

export default function AbsensiPage() {
  const addToast = useToastStore((state) => state.addToast);
  const { role, email } = useAuthStore((state) => state);

  const isAdmin = role?.toLowerCase() === "admin";

  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [presensiList, setPresensiList] = useState<any[]>([]);
  const [karyawanList, setKaryawanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [hasClockedInToday, setHasClockedInToday] = useState(false);
  const [hasClockedOutToday, setHasClockedOutToday] = useState(false);

  const [selectedKaryawanId, setSelectedKaryawanId] = useState<string>("");
  const currentTempDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentTempDate.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentTempDate.getFullYear()));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Scanner
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerBusy, setScannerBusy] = useState(false);
  const [scanMode, setScanMode] = useState<"camera" | "file">("camera");
  const [cameraError, setCameraError] = useState("");
  const scanLockRef = useRef(false); // mencegah scan ganda / toast spam
  const scannerContainerId = "qr-reader";
  const fileReaderId = "qr-file-reader";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id") || "";
      setCurrentUserId(id);
      setSelectedKaryawanId(id);
    }
  }, []);

  const normalizePresensiResponse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data && typeof data === "object" && data.constructor === Object) return [data];
    if (data?.data && typeof data.data === "object") return [data.data];
    return [];
  };

  const fetchDaftarKaryawan = async () => {
    if (!isAdmin) return;
    try {
      const response = await api.get("/karyawan");
      const data = response.data?.data ? response.data.data : response.data;
      if (Array.isArray(data)) {
        setKaryawanList(data);

        // Pastikan dropdown default punya value valid
        if (!selectedKaryawanId && data.length > 0) {
          setSelectedKaryawanId(String(data[0].id));
        }
      }
    } catch (error) {
      console.error("Gagal memuat daftar karyawan untuk filter:", error);
    }
  };

  const fetchPresensi = async (opts?: { silent?: boolean }) => {
    if (!currentUserId) return;

    try {
      if (!opts?.silent) setLoading(true);
      const response = await api.get("/presensi");
      const allData = normalizePresensiResponse(response.data);

      const filteredData = allData.filter((item: any) => Number(item.KaryawanId) === Number(selectedKaryawanId));
      setPresensiList(filteredData);

      const userActiveData = allData.filter((item: any) => Number(item.KaryawanId) === Number(currentUserId));
      const findToday = userActiveData.find((item: any) => isToday(item.createdAt));

      if (findToday) {
        setTodayRecord(findToday);
        setHasClockedInToday(!!findToday.clockin);
        setHasClockedOutToday(!!findToday.clockout);
      } else {
        setTodayRecord(null);
        setHasClockedInToday(false);
        setHasClockedOutToday(false);
      }
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Koneksi ke Server Gagal", "error");
      setPresensiList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaftarKaryawan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    if (selectedKaryawanId) {
      fetchPresensi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKaryawanId, currentUserId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear]);

  const getSelectedKaryawanName = () => {
    if (!isAdmin) return email;
    const found = karyawanList.find((k) => Number(k.id) === Number(selectedKaryawanId));
    return found ? `${found.namaDepan || ""} ${found.namaBelakang || ""}`.trim() : email;
  };

  const handleClockIn = async () => {
    if (hasClockedInToday) {
      addToast("Anda telah melakukan clock in pada hari ini!", "info");
      return;
    }

    try {
      setBtnLoading(true);
      const payload = {
        KaryawanId: currentUserId,
        clockin: true,
        clockout: false,
      };
      await api.post("/presensi", payload);
      addToast("Berhasil melakukan Clock In untuk hari ini!", "success");
      await fetchPresensi();
    } catch (error: any) {
      addToast(error.response?.data?.message || "Gagal melakukan Clock In", "error");
    } finally {
      setBtnLoading(false);
    }
  };

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
      await fetchPresensi();
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

  const filteredPresensi = useMemo(() => {
    return presensiList.filter((item) => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      const itemMonth = itemDate.getMonth() + 1;
      const itemYear = itemDate.getFullYear();

      const matchMonth = selectedMonth === "ALL" || Number(selectedMonth) === itemMonth;
      const matchYear = selectedYear === "ALL" || Number(selectedYear) === itemYear;

      return matchMonth && matchYear;
    });
  }, [presensiList, selectedMonth, selectedYear]);

  // Total jam kerja (dihitung otomatis berdasarkan filter)
  const totalWorkDurationMs = useMemo(() => {
    return filteredPresensi.reduce((total, item) => {
      if (item.clockin && item.clockout && item.createdAt && item.updatedAt) {
        const start = new Date(item.createdAt).getTime();
        const end = new Date(item.updatedAt).getTime();
        if (end > start) {
          return total + (end - start);
        }
      }
      return total;
    }, 0);
  }, [filteredPresensi]);

  const totalWorkHours = Math.floor(totalWorkDurationMs / (1000 * 60 * 60));
  const totalWorkMinutes = Math.floor((totalWorkDurationMs % (1000 * 60 * 60)) / (1000 * 60));

  const availableYears = Array.from(
    new Set([
      currentTempDate.getFullYear().toString(),
      ...presensiList.map((item) => (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "")),
    ])
  )
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

  const totalPages = Math.ceil(filteredPresensi.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPresensi.slice(indexOfFirstItem, indexOfLastItem);

  // ================= SCAN BARCODE =================
  const openScanner = (mode: "camera" | "file" = "camera") => {
    scanLockRef.current = false;
    setCameraError("");
    setScanMode(mode);
    setScannerOpen(true);
  };

  const unlockAfterDelay = () => {
    setTimeout(() => {
      scanLockRef.current = false;
    }, 2000);
  };

  const handleQrResult = async (decodedText: string) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;

    const scannedId = Number(decodedText.trim());
    if (!Number.isInteger(scannedId) || scannedId <= 0) {
      addToast("Barcode tidak valid. Isi barcode harus berupa ID Karyawan.", "error");
      unlockAfterDelay();
      return;
    }

    try {
      setScannerBusy(true);

      const response = await api.get("/presensi");
      const allData = normalizePresensiResponse(response.data);

      const record = allData.find(
        (item: any) => Number(item.KaryawanId) === scannedId && isToday(item.createdAt)
      );

      if (!record) {
        // Belum ada record hari ini => Clock In
        await api.post("/presensi", { KaryawanId: scannedId, clockin: true, clockout: false });
        addToast("Berhasil Clock In via Scan", "success");
      } else if (record.clockin && !record.clockout) {
        // Sudah clock in, belum clock out => Clock Out
        await api.put(`/presensi/${record.id}`, { KaryawanId: scannedId, clockin: true, clockout: true });
        addToast("Berhasil Clock Out via Scan", "success");
      } else {
        addToast("Karyawan ini sudah Clock In dan Clock Out hari ini", "info");
      }

      setScannerOpen(false);

      // Admin: tabel pindah ke karyawan yang di-scan (useEffect akan fetch ulang).
      // Kalau sama, cukup refresh pelan-pelan tanpa spinner.
      if (isAdmin && String(scannedId) !== selectedKaryawanId) {
        setSelectedKaryawanId(String(scannedId));
      } else {
        await fetchPresensi({ silent: true });
      }
    } catch (error: any) {
      addToast(error.response?.data?.msg || error.response?.data?.message || "Gagal memproses scan", "error");
      unlockAfterDelay();
    } finally {
      setScannerBusy(false);
    }
  };

  // Ref supaya callback kamera selalu memanggil versi function terbaru (menghindari stale state)
  const handleQrResultRef = useRef(handleQrResult);
  handleQrResultRef.current = handleQrResult;

  // Kamera
  useEffect(() => {
    if (!scannerOpen || scanMode !== "camera") return;

    let cancelled = false;
    const scanner = new Html5Qrcode(scannerContainerId, {
      formatsToSupport: SUPPORTED_FORMATS,
      verbose: false,
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    });

    const startPromise = scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 300, height: 160 } }, // lebar, cocok untuk barcode garis & QR
        (decodedText) => {
          handleQrResultRef.current(decodedText);
        },
        () => {}
      )
      .catch(() => {
        if (!cancelled) {
          setCameraError("Kamera tidak bisa dibuka. Izinkan akses kamera di browser, atau gunakan tab Upload File.");
        }
      });

    return () => {
      cancelled = true;
      startPromise
        .then(() => (scanner.isScanning ? scanner.stop() : undefined))
        .then(() => scanner.clear())
        .catch(() => {});
    };
  }, [scannerOpen, scanMode]);

  // Upload file barcode dari komputer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    const reader = new Html5Qrcode(fileReaderId, {
      formatsToSupport: SUPPORTED_FORMATS,
      verbose: false,
    });

    try {
      const text = await reader.scanFile(file, false);
      await handleQrResultRef.current(text);
    } catch {
      addToast("Barcode tidak terbaca dari file. Pastikan gambar jelas dan tidak terpotong.", "error");
    } finally {
      try {
        reader.clear();
      } catch {}
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center print:hidden">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 print:w-full print:max-w-none print:p-0 print:m-0">
      {/* Header Kop Surat Cetak */}
      <div className="hidden print:block border-b-2 border-slate-950 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Laporan Riwayat Presensi Karyawan</h1>
        <p className="text-sm text-slate-600 mt-1">
          Nama Karyawan: <span className="font-bold text-slate-900">{getSelectedKaryawanName()}</span>
        </p>
        <p className="text-xs text-slate-500">
          Periode: {selectedMonth === "ALL" ? "Semua Bulan" : new Date(2026, Number(selectedMonth) - 1).toLocaleDateString("id-ID", { month: "long" })} {selectedYear === "ALL" ? "Semua Tahun" : selectedYear}
        </p>
        <p className="text-xs text-slate-500">Tanggal Cetak: {formatDate(new Date().toISOString())}</p>
      </div>

      {/* HEADER NAVBAR STYLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-rose-950 tracking-tight uppercase">Presensi</h1>
          <p className="text-sm text-rose-400 font-bold uppercase tracking-wider mt-0.5">Pencatatan Waktu Masuk & Pulang Kerja</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <button
            onClick={() => openScanner("camera")}
            className="flex cursor-pointer items-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-100/40 transition-all active:scale-95"
          >
            <QrCode size={16} />
            <span>Scan Barcode</span>
          </button>

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
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${hasClockedInToday ? "bg-white/20 border-white/40" : "bg-black/20 border-transparent text-rose-200"}`}
            >
              Clock In: {hasClockedInToday && todayRecord ? `Sudah (${formatTime(todayRecord.createdAt)})` : "Belum"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${hasClockedOutToday ? "bg-white/20 border-white/40" : "bg-black/20 border-transparent text-rose-200"}`}
            >
              Clock Out: {hasClockedOutToday && todayRecord ? `Sudah (${formatTime(todayRecord.updatedAt)})` : "Belum"}
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

          <div className="flex flex-wrap items-center gap-2">
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
                <option key={yr} value={yr}>
                  {yr}
                </option>
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
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-black ${item.clockout ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            {item.clockout ? formatTime(item.updatedAt) : "Belum Absen Pulang"}
                          </span>
                        </td>
                        <td className="p-5">
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-black ${duration === "Tidak diketahui" ? "bg-slate-100 text-slate-500 italic font-medium" : "bg-blue-50 text-blue-600"}`}
                          >
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

        {/* RINGKASAN TOTAL JAM KERJA */}
        <div className="p-5 border-t border-rose-50 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-transparent print:border-slate-300 print:p-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-rose-500 print:text-slate-700" />
            <span className="text-sm font-black uppercase tracking-wider text-rose-950 print:text-slate-900">
              Total Jam Kerja <span className="opacity-60 text-xs">(Periode Ini)</span>
            </span>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-xl border border-rose-100 shadow-sm print:bg-transparent print:border-none print:shadow-none print:p-0">
            <span className="text-base font-black text-rose-600 print:text-slate-900">
              {totalWorkHours} Jam {totalWorkMinutes} Menit
            </span>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-rose-50 bg-rose-50/10 flex items-center justify-between flex-col sm:flex-row gap-4 print:hidden">
            <p className="text-xs font-bold text-rose-900/60">
              Menampilkan <span className="text-rose-600 font-black">{indexOfFirstItem + 1}</span> sampai{" "}
              <span className="text-rose-600 font-black">{indexOfLastItem > filteredPresensi.length ? filteredPresensi.length : indexOfLastItem}</span> dari{" "}
              <span className="text-rose-600 font-black">{filteredPresensi.length}</span> data presensi
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
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === page ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "border border-transparent text-rose-950 hover:bg-rose-50"}`}
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

      {/* MODAL SCANNER */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 print:hidden">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-rose-950">Scan Barcode Presensi</h3>
              <button onClick={() => setScannerOpen(false)} className="p-2 rounded-xl hover:bg-rose-50 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Tab */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setCameraError("");
                  setScanMode("camera");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                  scanMode === "camera" ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
              >
                <Camera size={14} /> Kamera
              </button>
              <button
                onClick={() => setScanMode("file")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                  scanMode === "file" ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
              >
                <Upload size={14} /> Upload File
              </button>
            </div>

            {scanMode === "camera" ? (
              <>
                <div id={scannerContainerId} className="overflow-hidden rounded-2xl border border-rose-100 min-h-[240px] bg-slate-50" />
                {cameraError && <p className="mt-3 text-xs font-bold text-red-500">{cameraError}</p>}
                <p className="mt-4 text-sm text-slate-500">
                  Arahkan kamera ke barcode pada ID Card karyawan. Setelah terbaca, sistem otomatis menentukan Clock In atau Clock Out.
                </p>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-48 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 text-rose-500 cursor-pointer hover:bg-rose-50 transition-all">
                <Upload size={28} />
                <span className="text-sm font-bold">Klik untuk pilih gambar barcode</span>
                <span className="text-xs text-slate-400">JPG / PNG dari komputer</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}

            {scannerBusy && <p className="mt-3 text-xs font-bold text-rose-500">Memproses hasil scan...</p>}
          </div>
        </div>
      )}

      {/* Dibutuhkan html5-qrcode untuk scan file; letakkan di luar modal agar selalu ada */}
      <div id={fileReaderId} className="hidden" />
    </div>
  );
}