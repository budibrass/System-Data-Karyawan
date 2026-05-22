"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function DetailKaryawanPage() {
  const { id } = useParams();
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/karyawan/${id}`);
        setData(response.data);
      } catch (error: any) {
        addToast("Gagal mengambil detail karyawan", "error");
        router.push("/karyawan/data");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, addToast, router]);

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const InfoBlock = ({ icon: Icon, label, value, subValue }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/50 hover:bg-rose-50 transition-colors">
      <div className="p-2.5 bg-white rounded-xl text-rose-500 shadow-sm flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-rose-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-rose-950 break-words">
          {value || "-"}
        </p>
        {subValue && (
          <p className="text-[10px] font-medium text-rose-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header & Meta Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-rose-500 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke List</span>
          </button>
          <div>
            <h1 className="text-3xl font-black text-rose-950 tracking-tight uppercase">
              Profil Karyawan
            </h1>
            <div className="flex items-center gap-3 mt-1 text-rose-400 text-xs font-bold uppercase tracking-widest">
              <span>ID Sistem: {data?.id}</span>
              <span>•</span>
              <span>NIP: {data?.nip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Identity Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-rose-50 shadow-xl shadow-rose-50/50 flex flex-col md:flex-row items-center gap-10">
        {/* <div className="w-40 h-40 rounded-[3rem] bg-rose-500 flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-rose-200">
          {data?.namaDepan?.charAt(0)}
        </div> */}
        <div className="w-40 h-40 rounded-[3rem] bg-rose-500 flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-rose-200 overflow-hidden">
          {data?.fotoProfile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={data.fotoProfile} 
              alt={`Foto ${data?.namaDepan}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{data?.namaDepan?.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <h2 className="text-4xl font-black text-rose-950 leading-tight">
            {data?.namaDepan} {data?.namaBelakang}
          </h2>

          {/* Kontainer Lane Baru */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-bold ring-1 ring-rose-100 italic">
              {data?.jabatan}
            </span>

            <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold ring-1 ring-rose-100 uppercase tracking-wider">
              {data?.Project?.nama}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {" "}
        {/* Tambahkan items-stretch */}
        {/* Kolom 1: Personal */}
        <div className="flex flex-col h-full">
          {" "}
          {/* Tambahkan flex & h-full */}
          <div className="bg-white p-6 rounded-[2rem] border border-rose-50 shadow-lg shadow-rose-50/50 flex-1">
            {" "}
            {/* Tambahkan flex-1 */}
            <h3 className="text-xs font-black text-rose-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User size={16} className="text-rose-500" /> Identitas Diri
            </h3>
            <div className="space-y-4">
              <InfoBlock
                icon={Mail}
                label="Email Address"
                value={data?.email}
              />
              <InfoBlock
                icon={Phone}
                label="Contact"
                value={data?.noHandphone}
              />
              <InfoBlock
                icon={MapPin}
                label="Tempat, Tgl Lahir"
                value={`${data?.tempatLahir}, ${formatDate(data?.tanggalLahir)}`}
              />
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock
                  icon={User}
                  label="Gender"
                  value={data?.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                />
                <InfoBlock icon={User} label="Agama" value={data?.agama} />
              </div>
              <InfoBlock
                icon={MapPin}
                label="Alamat Domisili"
                value={data?.alamat}
              />
            </div>
          </div>
        </div>
        {/* Kolom 2: Pekerjaan & Status */}
        <div className="flex flex-col h-full">
          {" "}
          {/* Tambahkan flex & h-full */}
          <div className="bg-white p-6 rounded-[2rem] border border-rose-50 shadow-lg shadow-rose-50/50 flex-1">
            {" "}
            {/* Tambahkan flex-1 */}
            <h3 className="text-xs font-black text-rose-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Briefcase size={16} className="text-rose-500" /> Status Karir
            </h3>
            <div className="space-y-4">
              <InfoBlock
                icon={Building2}
                label="Project Terkait"
                value={data?.Project?.nama}
                subValue={`Manager: ${data?.Project?.productManager}`}
              />
              <InfoBlock
                icon={Calendar}
                label="Tanggal Bergabung"
                value={formatDate(data?.tanggalMasuk)}
              />
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock
                  icon={Briefcase}
                  label="Status Kerja"
                  value={data?.statusKerja}
                />
                <InfoBlock
                  icon={GraduationCap}
                  label="Pendidikan"
                  value={data?.pendidikan}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock
                  icon={User}
                  label="Pernikahan"
                  value={
                    data?.statusPernikahan === "BM"
                      ? "Belum Menikah"
                      : "Menikah"
                  }
                />
                <InfoBlock
                  icon={User}
                  label="Anak"
                  value={`${data?.jumlahTanggunganAnak} Orang`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Kolom 3: Finansial & Golongan */}
        <div className="flex flex-col h-full gap-6">
          {" "}
          {/* Tambahkan flex, h-full & gap-6 */}
          {/* Benefit Card */}
          <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-200 relative overflow-hidden group flex-1 flex flex-col justify-between">
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
                  Benefit Golongan
                </p>
                <h3 className="text-xl font-black leading-tight italic">
                  {data?.Golongan?.namaGolongan}
                </h3>
              </div>
              <div className="space-y-4 border-t border-white/20 pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">
                    Uang Transportasi
                  </p>
                  <p className="text-3xl font-black tracking-tighter">
                    Rp {data?.Golongan?.uangTransportasi?.toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">
                    Uang Skill
                  </p>
                  <p className="text-xl font-black tracking-tighter">
                    Rp {data?.Golongan?.uangSkill?.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-rose-600/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1 text-rose-100">
                Gaji Pokok
              </p>
              <p className="font-bold text-rose-50">
                {data?.Gaji?.totalGaji 
                  ? `Rp ${data.Gaji.gajiPokok.toLocaleString("id-ID")}` 
                  : "Belum ditentukan"}
              </p>
            </div>

            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck size={180} />
            </div>
          </div>
          {/* Riwayat Sistem */}
          <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Riwayat Sistem
            </p>
            <ul className="text-[11px] font-bold text-slate-500 space-y-1 italic">
              <li>• Project ID: {data?.ProjectId}</li>
              <li>• Golongan ID: {data?.GolonganId}</li>
              <li>• Cuti Terpakai: {data?.Cutis?.length} cuti</li>
              <li>
                • Total Lembur: {data?.PengajuanLemburs?.length} pengajuan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
