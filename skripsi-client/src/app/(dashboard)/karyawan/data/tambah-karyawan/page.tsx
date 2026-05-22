"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User, Briefcase, MapPin, GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function TambahKaryawanPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [loading, setLoading] = useState(false);
  const [golongans, setGolongans] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    GolonganId: "",
    ProjectId: "",
    nip: "",
    email: "",
    namaDepan: "",
    namaBelakang: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    jabatan: "",
    pendidikan: "",
    noHandphone: "",
    alamat: "",
    statusPernikahan: "",
    statusKerja: "",
    tanggalMasuk: "",
    jumlahTanggunganAnak: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAllFilled = Object.values(formData).every(value => value !== "" && value !== null);
    
    if (!isAllFilled) {
      addToast("Data anda masih ada yang belum terisim Harap isi semua form tanpa terkecuali!", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/karyawan", formData);
      addToast("Karyawan berhasil ditambahkan!", "success")
      router.push("/karyawan/data");
    } catch (error: any) {
      addToast(error.response?.data?.msg || "Gagal menambah karyawan", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [resGolongan, resProject] = await Promise.all([
          api.get("/golongan"),
          api.get("/project")
        ]);
        setGolongans(resGolongan.data);
        setProjects(resProject.data);
      } catch (error) {
        addToast("Gagal memuat data Golongan atau Project", "error");
      }
    };
    fetchDropdownData();
  }, [addToast]);

  const inputStyle = "w-full h-11 rounded-xl bg-gray-50 border border-rose-100 px-4 text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all";
  const labelStyle = "block text-xs font-bold text-rose-900/60 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-rose-500 font-bold hover:text-rose-700 transition-colors">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-black text-rose-950">Tambah Karyawan Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Identitas Pribadi */}
        <div className="bg-white p-8 rounded-4xl border border-rose-50 shadow-xl shadow-rose-50/50">
          <div className="flex items-center gap-3 mb-8 border-b border-rose-50 pb-4">
            <div className="p-2 bg-rose-500 rounded-lg text-white"><User size={20} /></div>
            <h2 className="text-lg font-bold text-rose-950">Identitas Pribadi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>NIP</label>
              <input required name="nip" type="text" required onChange={handleChange} className={inputStyle} placeholder="Contoh: 202601001" />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input name="email" type="email" required onChange={handleChange} className={inputStyle} placeholder="email@aksaramaya.com" />
            </div>
            <div>
              <label className={labelStyle}>Nama Depan</label>
              <input name="namaDepan" type="text" required onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Nama Belakang</label>
              <input name="namaBelakang" type="text" required onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Tempat Lahir</label>
              <input name="tempatLahir" type="text" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Tanggal Lahir</label>
              <input name="tanggalLahir" type="date" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Jenis Kelamin</label>
              <select name="jenisKelamin" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki laki">Laki laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Agama</label>
              <select name="agama" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Agama</option>
                <option value="Islam">Islam</option>
                <option value="Budha">Budha</option>
                <option value="Hindhu">Hindhu</option>
                <option value="Kristen">Kristen</option>
                <option value="Kongucu">Kongucu</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Pekerjaan & Status */}
        <div className="bg-white p-8 rounded-4xl border border-rose-50 shadow-xl shadow-rose-50/50">
          <div className="flex items-center gap-3 mb-8 border-b border-rose-50 pb-4">
            <div className="p-2 bg-rose-500 rounded-lg text-white"><Briefcase size={20} /></div>
            <h2 className="text-lg font-bold text-rose-950">Informasi Pekerjaan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Jabatan</label>
              <input name="jabatan" type="text" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Golongan</label>
              <select name="GolonganId" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Golongan</option>
                {golongans.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.namaGolongan || g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Project</label>
              <select name="ProjectId" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Project</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Status Kerja</label>
              <select name="statusKerja" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Status</option>
                <option value="WFH">WFH</option>
                <option value="WFO">WFO</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Tanggal Masuk</label>
              <input name="tanggalMasuk" type="date" onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* SECTION 3: Tambahan */}
        <div className="bg-white p-8 rounded-[2rem] border border-rose-50 shadow-xl shadow-rose-50/50">
          <div className="flex items-center gap-3 mb-8 border-b border-rose-50 pb-4">
            <div className="p-2 bg-rose-500 rounded-lg text-white"><GraduationCap size={20} /></div>
            <h2 className="text-lg font-bold text-rose-950">Detail Tambahan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Pendidikan</label>
              <select name="pendidikan" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Pendidikan</option>
                <option value="SD atau Sederajat">SD atau Sederajat</option>
                <option value="SMP atau Sederajat">SMP atau Sederajat</option>
                <option value="SMA Atau sederajat">SMA Atau sederajat</option>
                <option value="Sarjana atau Sederajat">Sarjana atau Sederajat</option>
                <option value="Master">Master</option>
                <option value="Doktor">Doktor</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Status Pernikahan</label>
              <select name="statusPernikahan" onChange={handleChange} className={inputStyle}>
                <option value="">Pilih Status</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Duda">Duda</option>
                <option value="Janda">Janda</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Jumlah Tanggungan Anak</label>
              <input name="jumlahTanggunganAnak" type="number" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>No Handphone</label>
              <input name="noHandphone" type="text" onChange={handleChange} className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Alamat Lengkap</label>
              <textarea name="alamat" rows={3} onChange={handleChange} className={`${inputStyle} h-auto py-3 resize-none`}></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-8 py-3 rounded-2xl font-bold text-rose-400 hover:bg-rose-50 transition-all"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-10 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-xl shadow-rose-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : <><Save size={20} /> Simpan Data</>}
          </button>
        </div>
      </form>
    </div>
  );
}