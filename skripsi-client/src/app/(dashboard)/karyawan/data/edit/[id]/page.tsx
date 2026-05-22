"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Camera, User } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

export default function EditKaryawanPage() {
  const { id } = useParams();
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State khusus menampung file gambar baru & preview lokal
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // State Form disesuaikan dengan field dari database
  const [formData, setFormData] = useState({
    nip: "",
    email: "",
    namaDepan: "",
    namaBelakang: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "L",
    agama: "ISLAM",
    jabatan: "",
    pendidikan: "Sarjana",
    noHandphone: "",
    alamat: "",
    statusPernikahan: "BM",
    statusKerja: "WFO",
    tanggalMasuk: "",
    jumlahTanggunganAnak: 0,
    GolonganId: "",
    ProjectId: "",
    fotoProfile: "" // 🌟 Ditambahkan untuk menampung URL foto lama dari database
  });

  // State untuk dropdown options
  const [golonganOptions, setGolonganOptions] = useState<any[]>([]);
  const [projectOptions, setProjectOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [resGolongan, resProject, resKaryawan] = await Promise.all([
          api.get("/golongan"),
          api.get("/project"),
          api.get(`/karyawan/${id}`)
        ]);

        setGolonganOptions(resGolongan.data || []);
        setProjectOptions(resProject.data || []);

        const emp = resKaryawan.data;
        setFormData({
          nip: emp.nip || "",
          email: emp.email || "",
          namaDepan: emp.namaDepan || "",
          namaBelakang: emp.namaBelakang || "",
          tempatLahir: emp.tempatLahir || "",
          tanggalLahir: emp.tanggalLahir ? emp.tanggalLahir.split("T")[0] : "",
          jenisKelamin: emp.jenisKelamin || "L",
          agama: emp.agama || "ISLAM",
          jabatan: emp.jabatan || "",
          pendidikan: emp.pendidikan || "Sarjana",
          noHandphone: emp.noHandphone || "",
          alamat: emp.alamat || "",
          statusPernikahan: emp.statusPernikahan || "BM",
          statusKerja: emp.statusKerja || "WFO",
          tanggalMasuk: emp.tanggalMasuk ? emp.tanggalMasuk.split("T")[0] : "",
          jumlahTanggunganAnak: emp.jumlahTanggunganAnak || 0,
          GolonganId: emp.GolonganId || "",
          ProjectId: emp.ProjectId || "",
          fotoProfile: emp.fotoProfile || ""
        });

        // 🌟 Set preview awal menggunakan foto dari database jika tersedia
        if (emp.fotoProfile) {
          setPreviewUrl(emp.fotoProfile);
        }

      } catch (error) {
        addToast("Gagal memuat data edit karyawan", "error");
        router.push("/karyawan/data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, router, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "jumlahTanggunganAnak" || name === "GolonganId" || name === "ProjectId" 
        ? Number(value) 
        : value
    }));
  };

  // 🌟 Handler saat user memilih file gambar baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Membuat URL Blob sementara untuk keperluan display preview di halaman web
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setSubmitting(true);

    const dataPayload = new FormData();
    
    // 1. Masukkan semua data dari state formData ke dalam FormData payload
    Object.entries(formData).forEach(([key, value]) => {
      // Kita kirimkan saja semua datanya (baik kosong ataupun berisi)
      // Biarkan Backend yang menentukan apakah akan memakai data baru atau mempertahankan data lama di DB
      if (value !== null && value !== undefined) {
        dataPayload.append(key, String(value));
      }
    });

    // 2. Jika user mengunggah foto baru, lampirkan ke FormData
    if (selectedFile) {
      dataPayload.append("fotoProfile", selectedFile);
    }

    // 🌟 3. CARA CEK LOG (Silakan cek di console inspect browser Anda dengan cara ini)
    console.log("--- ISI FORMDATA YANG DIKIRIM ---");
    for (let [key, value] of dataPayload.entries()) {
      console.log(`${key} ->`, value);
    }
    console.log("---------------------------------");

    // 4. Kirim via PUT ke Backend
    await api.put(`/karyawan/${id}`, dataPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    addToast("Data karyawan berhasil diperbarui", "success");
    
    // Segarkan router client agar halaman list data ter-fetch ulang datanya
    router.refresh(); 
    router.push("/karyawan/data");
  } catch (error: any) {
    const message = error.response?.data?.message || "Gagal memperbarui data";
    addToast(message, "error");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-rose-500 font-bold hover:gap-3 transition-all">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-rose-950 uppercase tracking-tight">Edit Data Karyawan</h1>
          <p className="text-sm text-rose-400 font-medium">Ubah informasi personil resmi</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-rose-50 shadow-xl shadow-rose-50/50 space-y-8">
          
          {/* Section 1: Kredensial & Posisi */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-400 mb-6 border-b border-rose-50 pb-2">I. Posisi & Kredensial</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">NIP</label>
                <input type="text" name="nip" value={formData.nip} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Jabatan</label>
                <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
            </div>
          </div>

          {/* Section 2: Profil Pribadi */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-400 mb-6 border-b border-rose-50 pb-2">II. Profil Pribadi</h3>
            
            {/* 🌟 INPUT COMPONENT UPLOAD FOTO PROFILE */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-rose-50/10 p-5 rounded-3xl border border-rose-50/50">
              <div className="relative group w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-100 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-rose-200" />
                )}
                <label htmlFor="fotoProfilePicker" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={18} />
                </label>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-sm font-bold text-rose-950">Foto Profil Karyawan</h4>
                <p className="text-xs text-rose-400/80 font-medium mb-2">Format dokumen gambar JPG, JPEG, atau PNG. Maksimal 2MB.</p>
                <input 
                  type="file" 
                  id="fotoProfilePicker" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <label 
                  htmlFor="fotoProfilePicker" 
                  className="inline-block px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Pilih Gambar Baru
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Nama Depan</label>
                <input type="text" name="namaDepan" value={formData.namaDepan} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Nama Belakang</label>
                <input type="text" name="namaBelakang" value={formData.namaBelakang} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-rose-900/80">Tempat Lahir</label>
                  <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-rose-900/80">Tanggal Lahir</label>
                  <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-rose-900/80">Jenis Kelamin</label>
                  <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-rose-900/80">Agama</label>
                  <select name="agama" value={formData.agama} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                    <option value="ISLAM">ISLAM</option>
                    <option value="KRISTEN">KRISTEN</option>
                    <option value="KATOLIK">KATOLIK</option>
                    <option value="HINDU">HINDU</option>
                    <option value="BUDDHA">BUDDHA</option>
                    <option value="KONGHUCHU">KONGHUCHU</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Nomor Handphone</label>
                <input type="text" name="noHandphone" value={formData.noHandphone} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Pendidikan Terakhir</label>
                <select name="pendidikan" value={formData.pendidikan} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="Diploma">Diploma (D3)</option>
                  <option value="Sarjana">Sarjana (S1)</option>
                  <option value="Magister">Magister (S2)</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-rose-900/80">Alamat Lengkap Domisili</label>
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} required rows={3} className="w-full p-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium resize-none" />
              </div>
            </div>
          </div>

          {/* Section 3: Status Penugasan & Relasi */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-400 mb-6 border-b border-rose-50 pb-2">III. Relasi Kerja & Status Famili</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Golongan Pegawai</label>
                <select name="GolonganId" value={formData.GolonganId} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                  <option value="">Pilih Golongan</option>
                  {golonganOptions.map((gol) => (
                    <option key={gol.id} value={gol.id}>{gol.namaGolongan}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Penempatan Project</label>
                <select name="ProjectId" value={formData.ProjectId} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                  <option value="">Pilih Project</option>
                  {projectOptions.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.nama}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Tanggal Masuk Kerja</label>
                <input type="date" name="tanggalMasuk" value={formData.tanggalMasuk} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Status Kerja</label>
                <select name="statusKerja" value={formData.statusKerja} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                  <option value="WFO">WFO (Work From Office)</option>
                  <option value="WFH">WFH (Work From Home)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Status Pernikahan</label>
                <select name="statusPernikahan" value={formData.statusPernikahan} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700">
                  <option value="BM">Belum Menikah</option>
                  <option value="M">Menikah</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-900/80">Jumlah Tanggungan Anak</label>
                <input type="number" name="jumlahTanggunganAnak" value={formData.jumlahTanggunganAnak} onChange={handleChange} min={0} required className="w-full h-11 px-4 text-sm bg-rose-50/30 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-medium" />
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="flex cursor-pointer items-center gap-2 h-12 px-8 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-xl shadow-rose-200 disabled:opacity-50 transition-all">
            <Save size={18} />
            <span>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}