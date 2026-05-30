"use client";
import React, { useState, useEffect } from "react";
import { Calendar, FileText, Send, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock3, XCircle, Printer } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function CutiPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE FORM INTERFACES ---
  const [mulaiTanggal, setMulaiTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");
  const [alasan, setAlasan] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE TABLE, FILTER & PAGINATION ---
  const [historyCuti, setHistoryCuti] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [filterBulan, setFilterBulan] = useState<number | string>(new Date().getMonth() + 1); // Default bulan sekarang
  const [filterTahun, setFilterTahun] = useState<number | string>(new Date().getFullYear()); // Default tahun sekarang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tahunSekarang = new Date().getFullYear();
  const tahunLalu = tahunSekarang - 1;

  // Mengambil KaryawanId dan Nama dari localStorage secara aman
  const getKaryawanData = () => {
    if (typeof window !== "undefined") {
      return {
        id: localStorage.getItem("id"),
        nama: historyCuti[0]?.Karyawan?.namaDepan 
          ? `${historyCuti[0].Karyawan.namaDepan} ${historyCuti[0].Karyawan.namaBelakang || ""}`.trim() 
          : (typeof window !== "undefined" ? localStorage.getItem("nama") : null) || "Karyawan"
      } ;
    }
    return { id: null, nama: "Karyawan" };
  };

  // --- GET DATA HISTORY ---
  const fetchHistoryCuti = async () => {
    const { id: karyawanId } = getKaryawanData();
    if (!karyawanId) {
      addToast("Karyawan ID tidak ditemukan, silahkan login ulang.", "error");
      return;
    }

    try {
      setTableLoading(true);
      const response = await api.get(`/cuti`);
      
      // Filter data cuti di frontend berdasarkan KaryawanId dari localStorage
      const dataFilter = response.data.filter((e: { KaryawanId: number; }) => e.KaryawanId === Number(karyawanId));
      setHistoryCuti(dataFilter);
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Gagal menampilkan data Gaji Karyawan", "error")
      setHistoryCuti([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryCuti();
  }, []);

  // --- SUBMIT AJUKAN CUTI ---
  const handleSubmitCuti = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id: karyawanId } = getKaryawanData();

    if (!karyawanId) {
      addToast("Sesi habis, ID Karyawan tidak valid.", "error");
      return;
    }
    if (!mulaiTanggal || !sampaiTanggal || !alasan) {
      addToast("Harap isi semua field input cuti.", "info");
      return;
    }
    if (new Date(mulaiTanggal) > new Date(sampaiTanggal)) {
      addToast("Tanggal mulai tidak boleh melebihi tanggal akhir.", "info");
      return;
    }

    try {
      setSubmitLoading(true);
      
      const payload = {
        KaryawanId: Number(karyawanId),
        mulaiTanggal: new Date(mulaiTanggal).toISOString(),
        sampaiTanggal: new Date(sampaiTanggal).toISOString(),
        alasan: alasan,
        status: "menunggu konfirmasi"
      };

      await api.post("/cuti", payload);
      addToast("Pengajuan cuti berhasil dikirim!", "success");
      
      // Reset Form
      setMulaiTanggal("");
      setSampaiTanggal("");
      setAlasan("");
      
      fetchHistoryCuti();
    } catch (error) {
      addToast("Gagal mengirim pengajuan cuti.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- LOGIKA FILTERING & SORTING ASCENDING ---
  const filteredData = historyCuti
    .filter((item) => {
      const date = new Date(item.mulaiTanggal);
      const matchBulan = filterBulan !== "" ? (date.getMonth() + 1) === Number(filterBulan) : true;
      const matchTahun = filterTahun !== "" ? date.getFullYear() === Number(filterTahun) : true;
      return matchBulan && matchTahun;
    })
    // Urutan berdasarkan tanggal mulai terkecil ke besar (Ascending)
    .sort((a, b) => new Date(a.mulaiTanggal).getTime() - new Date(b.mulaiTanggal).getTime());

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterBulan, filterTahun]);

  // --- HANDLER PRINT SATUAN ---
  const handlePrintRow = (item: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const { nama } = getKaryawanData();

    printWindow.document.write(`
      <html>
        <head>
          <title>Surat Pengajuan Cuti - ${nama}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; mb: 30px; }
            .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 20px; }
            table { width: 100%; margin-top: 30px; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { width: 30%; font-weight: bold; background: #f9f9f9; }
            .footer { margin-top: 60px; text-align: right; font-weight: bold; }
            .space { margin-top: 70px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SURAT KETERANGAN PENGAJUAN CUTI KARYAWAN</h2>
          </div>
          <table>
            <tr><th>Nama Karyawan</th><td>: ${nama}</td></tr>
            <tr><th>Tanggal Mulai</th><td>: ${new Date(item.mulaiTanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
            <tr><th>Tanggal Akhir</th><td>: ${new Date(item.sampaiTanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
            <tr><th>Alasan Cuti</th><td>: ${item.alasan}</td></tr>
            <tr><th>Status Surat</th><td>: <strong style="text-transform: uppercase;">${item.status}</strong></td></tr>
          </table>
          <div class="footer">
            <p>Hormat Kami,</p>
            <div class="space"></div>
            <p>( ${nama} )</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- HELPER FORMATTER ---
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
      
      {/* CARD 1: FORM PENGAJUAN CUTI */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Form Pengajuan Cuti</h2>
            <p className="text-xs text-slate-400 font-medium">Isi tanggal libur dan alasan cuti kamu secara detail</p>
          </div>
        </div>

        <form onSubmit={handleSubmitCuti} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mulai Tanggal */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Mulai Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={mulaiTanggal}
                  onChange={(e) => setMulaiTanggal(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Sampai Tanggal */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Sampai Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Alasan Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Alasan Cuti</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                rows={3}
                placeholder="Contoh: keperluan keluarga mendesak / cuti hari raya"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none"
                required
              />
            </div>
          </div>

          {/* Button Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full cursor-pointer sm:w-auto px-6 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{submitLoading ? "Mengirim..." : "Ajukan Cuti"}</span>
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
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Riwayat Pengajuan Cuti</h3>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500/20"
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
              className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500/20"
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
                <th className="py-4 px-6">Nama</th>
                <th className="py-4 px-6">Tanggal Mulai</th>
                <th className="py-4 px-6">Tanggal Akhir</th>
                <th className="py-4 px-6">Alasan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {tableLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-slate-800 mr-2 align-middle"></div>
                    Memuat data cuti...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Tidak ada riwayat pengajuan cuti di periode ini.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-mono">{indexOfFirstItem + index + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{getKaryawanData().nama}</td>
                    <td className="py-4 px-6 text-slate-600">{formatTanggal(item.mulaiTanggal)}</td>
                    <td className="py-4 px-6 text-slate-600">{formatTanggal(item.sampaiTanggal)}</td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate" title={item.alasan}>{item.alasan}</td>
                    <td className="py-4 px-6">{renderStatusBadge(item.status)}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handlePrintRow(item)}
                        className="p-2 cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1"
                        title="Print Dokumen Cuti"
                      >
                        <Printer size={15} />
                      </button>
                    </td>
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