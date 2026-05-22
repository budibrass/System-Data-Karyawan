"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Printer, Landmark, DollarSign, Wallet, FileText, Calendar, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function SlipGajiPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  
  const karyawanId = localStorage.id;

  const [allGajiList, setAllGajiList] = useState<any[]>([]); 
  const [filteredGaji, setFilteredGaji] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  const currentTempDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentTempDate.getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState<string>(String(currentTempDate.getFullYear()));

  const currentYear = currentTempDate.getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, index) => (currentYear - index).toString()
  );

  const fetchAllGaji = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gaji/${karyawanId}`);
      
      if (response.data) {
        const data = response.data;
        setAllGajiList(Array.isArray(data) ? data : [data]); 
      } else {
        setAllGajiList([]);
      }
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Gagal menampilkan data Gaji Karyawan", "error");
      setAllGajiList([]);
    } finally {
      setLoading(false);
    }
  }, [karyawanId, addToast]);

  useEffect(() => {
    if (karyawanId) {
      fetchAllGaji();
    }
  }, [karyawanId, fetchAllGaji]);

  useEffect(() => {
    if (allGajiList.length === 0) {
      setFilteredGaji(null);
      return;
    }

    const matchData = allGajiList.find((gaji) => {
      if (!gaji.tanggal) return false;
      
      const gajiDate = new Date(gaji.tanggal);
      const gajiMonth = String(gajiDate.getMonth() + 1).padStart(2, "0");
      const gajiYear = String(gajiDate.getFullYear());

      return gajiMonth === selectedMonth && gajiYear === selectedYear;
    });

    setFilteredGaji(matchData || null);
  }, [allGajiList, selectedMonth, selectedYear]);

  const handlePrint = () => {
    if (!filteredGaji) return;
    window.print();
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center print:hidden">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  // Parsing data potongan
  let rincianPotongan: any = null;
  if (filteredGaji && filteredGaji.potongan) {
    rincianPotongan = typeof filteredGaji.potongan === "string" 
      ? JSON.parse(filteredGaji.potongan)[0] 
      : (Array.isArray(filteredGaji.potongan) ? filteredGaji.potongan[0] : filteredGaji.potongan);
  }

  // Parsing data benefit perusahaan
  let rincianBenefit: any = null;
  if (filteredGaji && filteredGaji.benefit) {
    rincianBenefit = typeof filteredGaji.benefit === "string" 
      ? JSON.parse(filteredGaji.benefit)[0] 
      : (Array.isArray(filteredGaji.benefit) ? filteredGaji.benefit[0] : filteredGaji.benefit);
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6 pb-12 print:p-0 print:m-0 print:w-full">

      {/* ACTION HEADER & DROPDOWN FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Calendar size={14} className="absolute left-3 text-emerald-600 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer shadow-xs transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer shadow-xs transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePrint}
          disabled={!filteredGaji}
          className="flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed"
        >
          <Printer size={16} />
          <span>Cetak Slip Gaji</span>
        </button>
      </div>

      {/* TAMPILAN JIKA DATA DI BULAN/TAHUN INI TIDAK ADA */}
      {!filteredGaji ? (
        <div className="bg-white border border-slate-100 rounded-4xl p-16 text-center text-slate-400">
          <div className="flex flex-col items-center gap-3 justify-center">
            <div className="p-4 bg-slate-50 inline-block rounded-full text-slate-300">
              <AlertCircle size={36} />
            </div>
            <p className="text-sm font-semibold text-slate-500">Slip gaji belum diterbitkan.</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Data remunerasi Anda untuk periode {new Date(Number(selectedYear), Number(selectedMonth) - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })} belum tersedia atau belum diproses oleh tim finance.
            </p>
          </div>
        </div>
      ) : (
        /* CORE SLIP GAJI CONTAINER */
        <div className="bg-white border border-slate-100 rounded-4xl shadow-xl shadow-slate-100/70 p-8 sm:p-12 print:border-0 print:shadow-none print:p-0">
          
          {/* KOP SURAT */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dashed border-slate-200 pb-8 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600">
                <Landmark size={24} className="stroke-[2.5]" />
                <span className="text-xl font-black tracking-tight uppercase text-slate-800">Aksaramaya Web System</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Jatis Mobile, Jakarta, Indonesia</p>
            </div>
            <div className="text-left sm:text-right space-y-0.5">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Slip Gaji Karyawan</h2>
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                Periode: {formatDate(filteredGaji.tanggal)}
              </p>
            </div>
          </div>

          {/* METADATA KARYAWAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 my-8 text-sm border-b border-slate-100 pb-8">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-medium">ID Karyawan</span>
                <span className="font-bold text-slate-700">#00{filteredGaji.KaryawanId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-medium">Nama Karyawan</span>
                <span className="font-bold text-slate-800">{filteredGaji.Karyawan?.namaDepan ? `${filteredGaji.Karyawan.namaDepan} ${filteredGaji.Karyawan.namaBelakang || ""}` : `Karyawan ID ${filteredGaji.KaryawanId}`}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-medium">Status Lembur</span>
                <span className={`font-bold uppercase text-xs ${filteredGaji.lembur ? "text-emerald-600" : "text-slate-400"}`}>
                  {filteredGaji.lembur ? `Aktif (${filteredGaji.lamaLembur} Jam)` : "Tidak Ada"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-medium">Tanggal Pembayaran</span>
                <span className="font-bold text-slate-700">
                  {new Date(filteredGaji.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* RINCIAN STRUKTUR PENDAPATAN, BENEFIT & POTONGAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* KOLOM KIRI: BENEFIT & PENDAPATAN */}
            <div className="space-y-8">
              
              {/* CARD COMPONENT BENEFIT (DI ATAS PENDAPATAN) */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/60">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200/60 text-blue-700 font-black text-xs uppercase tracking-wider">
                  <Landmark size={16} />
                  <span>Benefit Perusahaan (Tunjangan Kerja)</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">JKK Perusahaan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(rincianBenefit?.jkk)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">JKM Perusahaan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(rincianBenefit?.jkm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">JHT Perusahaan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(rincianBenefit?.jhtCompany)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">JP Perusahaan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(rincianBenefit?.jaminanPensiunCompany)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">BPJS Kesehatan Perusahaan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(rincianBenefit?.bpjsKesehatanCompany)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 flex justify-between font-black text-slate-800">
                    <span>Total Benefit</span>
                    <span>{formatRupiah(rincianBenefit?.jkk + rincianBenefit?.jkm + rincianBenefit?.jhtCompany + rincianBenefit?.jaminanPensiunCompany + rincianBenefit?.bpjsKesehatanCompany)}</span>
                  </div>
                  <span className="italic text-red-400 text-[8px]">* Benefit perusahaan yang diberikan kepada karyawan dalam bentuk tunjangan atau dibayarkan langsung dari perusahaan, bukan diberikan dalam bentuk cash kepada karyawan </span>
                </div>
              </div>

              {/* CARD COMPONENT PENDAPATAN */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/60">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200/60 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Wallet size={16} />
                  <span>Komponen Pendapatan</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Gaji Pokok</span>
                    <span className="font-bold text-slate-800">{formatRupiah(filteredGaji.gajiPokok)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Uang Lembur</span>
                    <span className="font-bold text-slate-800">{formatRupiah(filteredGaji.totalGajiLembur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Uang Transportasi</span>
                    <span className="font-bold text-slate-800">{formatRupiah(filteredGaji?.Karyawan?.Golongan?.uangTransportasi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Uang Golongan</span>
                    <span className="font-bold text-slate-800">{formatRupiah(filteredGaji?.Karyawan?.Golongan?.uangSkill)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 flex justify-between font-black text-slate-800">
                    <span>Total Pendapatan</span>
                    <span>{formatRupiah(filteredGaji.gajiPokok + filteredGaji.totalGajiLembur + filteredGaji?.Karyawan?.Golongan?.uangTransportasi + filteredGaji?.Karyawan?.Golongan?.uangSkill)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN: POTONGAN */}
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/60 h-full">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200/60 text-rose-700 font-black text-xs uppercase tracking-wider">
                <FileText size={16} />
                <span>Komponen Potongan</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">PPh 21</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rincianPotongan?.pph21)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">BPJS Kesehatan</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rincianPotongan?.bpjsKesehatan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">JHT Karyawan</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rincianPotongan?.jhtEmployee || rincianPotongan?.bpjsKetenagakerjaan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">JP Karyawan</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rincianPotongan?.jaminanPensiunEmployee || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Lain-lain</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rincianPotongan?.lainLain || 0)}</span>
                </div>
                <div className="pt-4 border-t border-slate-200/60 flex justify-between font-black text-rose-600">
                  <span>Total Potongan</span>
                  <span>{formatRupiah(filteredGaji.totalPotongan)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* TOTAL BERSIH */}
          <div className="mt-8 bg-linear-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl shadow-slate-900/10 print:bg-none print:bg-slate-100 print:text-slate-900 print:shadow-none">
            <div className="text-center sm:text-left space-y-0.5">
              <h3 className="text-sm font-black uppercase tracking-wider opacity-75 print:text-slate-500">Take Home Pay (Gaji Bersih)</h3>
              <p className="text-xs text-slate-400 print:text-slate-500">Sudah termasuk akumulasi seluruh pendapatan bersih dikurangi potongan pajak/BPJS</p>
            </div>
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-emerald-400 print:text-slate-900">
              <span>{formatRupiah(filteredGaji.totalGaji)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
            <div className="text-center w-48 space-y-16">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">Jakarta, {new Date(filteredGaji.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Finance Department</p>
              </div>
              <div className="border-b border-slate-400 mx-auto w-36"></div>
              <p className="text-xs font-bold text-slate-800">Aksaramaya Web System</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}