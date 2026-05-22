"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Layers, CreditCard, Clock, Shield, Trash2, Edit3, Loader2, Info, XCircle, Settings2, Printer } from "lucide-react"; // 🌟 Tambah icon Printer
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore"; 

interface GolonganItem {
  id: number;
  kodeGolongan: string;
  namaGolongan: string;
  uangTransportasi: number; // 🌟 Sedikit catatan: di interface tertulis uangTransportasi (typo dari penamaan sebelumnya), disesuaikan dengan mapping di map() kamu yaitu item.uangTransportasi
  uangSkill: number;
}

export default function GolonganPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE FORM INPUT ---
  const [kodeGolongan, setKodeGolongan] = useState("");
  const [namaGolongan, setNamaGolongan] = useState("");
  const [uangTransportasi, setUangTransportasi] = useState("");
  const [uangSkill, setUangSkill] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE DUAL-MODE (CREATE / EDIT) ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // --- STATE DATA TABLE ---
  const [golongans, setGolongans] = useState<GolonganItem[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // --- 1. FETCH DATA GOLONGAN (GET ALL) ---
  const fetchGolongans = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get("/golongan");
      if (Array.isArray(response.data)) {
        setGolongans(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setGolongans(response.data.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal mengambil data golongan";
      addToast(errorMessage, "error");
      setGolongans([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchGolongans();
  }, []);

  // --- 2. RESET/BATAL EDIT FORM ---
  const handleResetForm = () => {
    setKodeGolongan("");
    setNamaGolongan("");
    setUangTransportasi("");
    setUangSkill("");
    setIsEditMode(false);
    setSelectedId(null);
  };

  // --- 3. SUBMIT DATA (POST CREATE / PUT UPDATE) ---
  const handleSubmitGolongan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kodeGolongan || !namaGolongan || !uangTransportasi || !uangSkill) {
      addToast("Semua inputan wajib diisi.", "info");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        kodeGolongan,
        namaGolongan,
        uangTransportasi: Number(uangTransportasi),
        uangSkill: Number(uangSkill),
      };

      if (isEditMode && selectedId) {
        await api.put(`/golongan/${selectedId}`, payload);
        addToast("Data golongan berhasil diperbarui!", "success");
      } else {
        await api.post("/golongan", payload);
        addToast("Data golongan baru berhasil ditambahkan!", "success");
      }

      handleResetForm();
      fetchGolongans();
    } catch (error) {
      console.error("Gagal memproses data golongan:", error);
      addToast(isEditMode ? "Gagal memperbarui data." : "Gagal menambahkan data.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTrigger = async (id: number) => {
    try {
      setSubmitLoading(true);
      
      const response = await api.get(`/golongan/${id}`);
      const data = response.data?.data ? response.data.data : response.data;

      if (data) {
        setKodeGolongan(data.kodeGolongan || "");
        setNamaGolongan(data.namaGolongan || "");
        setUangTransportasi(data.uangTransportasi ? String(data.uangTransportasi) : "");
        setUangSkill(data.uangSkill ? String(data.uangSkill) : "");
        
        setIsEditMode(true);
        setSelectedId(id);
        
        window.scrollTo({ top: 0, behavior: "smooth" }); 
      }
    } catch (error) {
      console.error("Gagal memuat data detail golongan:", error);
      addToast("Gagal mengambil detail data golongan.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteGolongan = async (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data golongan "${nama}"?`)) {
      try {
        await api.delete(`/golongan/${id}`);
        addToast("Data golongan berhasil dihapus.", "success");
        
        if (selectedId === id) handleResetForm();
        
        fetchGolongans();
      } catch (error) {
        console.error("Gagal menghapus golongan:", error);
        addToast("Gagal menghapus data golongan.", "error");
      }
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // --- 4. HANDLE PRINT ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* 🌟 Ditambahkan class `print:hidden` agar form tidak ikut tercetak */}
      <div className={`bg-white border rounded-3xl shadow-xl shadow-slate-100/40 p-6 sm:p-8 space-y-6 transition-all duration-300 print:hidden ${isEditMode ? "border-blue-100 ring-4 ring-blue-50/50" : "border-slate-100"}`}>
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-colors ${isEditMode ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
              {isEditMode ? <Settings2 size={22} /> : <PlusCircle size={22} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEditMode ? "Edit Golongan Karyawan" : "Tambah Golongan Karyawan"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {isEditMode ? "Ubah rincian tunjangan dan gaji lembur untuk golongan terpilih" : "Kelola standarisasi kode jabatan, tunjangan transaksional, dan upah lembur"}
              </p>
            </div>
          </div>

          {/* Action Buttons Nav */}
          <div className="flex items-center gap-2">
            {/* 🌟 TOMBOL PRINT BARU */}
            

            {/* Munculkan Tombol Batal Hanya Saat Edit Mode */}
            {isEditMode && (
              <button
                onClick={handleResetForm}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <XCircle size={14} /> Batal Edit
              </button>
            )}
          </div>
        </div>

        {/* FORM INPUT GOLONGAN */}
        <form onSubmit={handleSubmitGolongan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kode Golongan</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Contoh: G01, G02"
                value={kodeGolongan}
                onChange={(e) => setKodeGolongan(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          {/* Input Nama Golongan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nama Golongan</label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Contoh: Golongan I, Golongan II"
                value={namaGolongan}
                onChange={(e) => setNamaGolongan(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          {/* Input Uang Transportasi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Uang Transportasi (Rp)</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                placeholder="Nominal transportasi..."
                value={uangTransportasi}
                onChange={(e) => setUangTransportasi(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          {/* Input Uang Skill */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Uang Skill (Rp)</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                placeholder="Nominal lembur..."
                value={uangSkill}
                onChange={(e) => setUangSkill(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          {/* Submit Button Row */}
          <div className="lg:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full sm:w-auto px-6 py-2.5 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-white ${isEditMode ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-[#7CB342] hover:bg-[#689F38] shadow-green-100"}`}
            >
              {submitLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{isEditMode ? "Update Golongan" : "Simpan Golongan"}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: DATATABLE DISPLAY */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden print:border-none print:shadow-none">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Daftar Golongan Terdaftar</h3>
          {/* 🌟 Tombol cetak cadangan di tabel jika form sedang tersembunyi (opsional, otomatis hilang saat print) */}
          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Printer size={14} /> Cetak Data
          </button>
        </div>

        {fetchLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Loader2 size={32} className="animate-spin mx-auto text-[#7CB342]" />
            <p className="text-xs font-semibold uppercase tracking-wider">Menyelaraskan data golongan...</p>
          </div>
        ) : golongans.length === 0 ? (
          <div className="text-center py-16 bg-white space-y-3">
            <div className="p-3 bg-slate-50 inline-block rounded-full">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Belum ada data golongan ditemukan di sistem.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                  <th className="py-4 px-6">No</th>
                  <th className="py-4 px-6">Kode Golongan</th>
                  <th className="py-4 px-6">Nama Golongan</th>
                  <th className="py-4 px-6">Uang Transportasi</th>
                  <th className="py-4 px-6">Uang Skill</th>
                  {/* 🌟 Sembunyikan kolom aksi saat kertas dicetak */}
                  <th className="py-4 px-6 text-center print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {golongans.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 text-slate-400 font-bold">{index + 1}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono text-xs font-bold border border-slate-200/50 print:bg-transparent print:p-0 print:border-none">
                        {item.kodeGolongan}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{item.namaGolongan}</td>
                    <td className="py-4 px-6 text-emerald-600 font-semibold">{formatRupiah(item.uangTransportasi)}</td>
                    <td className="py-4 px-6 text-indigo-600 font-semibold">{formatRupiah(item.uangSkill)}</td>
                    {/* 🌟 Sembunyikan isi tombol aksi edit/hapus ketika dicetak */}
                    <td className="py-4 px-6 print:hidden">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditTrigger(item.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                          title="Edit Golongan"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGolongan(item.id, item.namaGolongan)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Hapus Golongan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}