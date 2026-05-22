"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, FileText, Upload, Image as ImageIcon, Trash2, Calendar, Newspaper, Layers } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

interface InfoData {
  id: number;
  judul: string;
  deskripsi: string;
  gambarInfo: string;
  createdAt: string;
}

export default function AdminInfoPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE FORM INPUT ---
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileGambar, setFileGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE RECENT POSTS ---
  const [recentInfos, setRecentInfos] = useState<InfoData[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // --- FETCH DATA INFO TERBARU ---
  const fetchRecentInfos = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get("/info");
      if (Array.isArray(response.data)) {
        // Urutkan dari yang paling baru diunggah
        const sorted = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentInfos(sorted);
      }
    } catch (error) {
      console.error(error);
      setRecentInfos([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentInfos();
  }, []);

  // --- HANDLE PREVIEW GAMBAR (Object URL Sementara) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileGambar(file);
      // Membuat URL Blob lokal sementara untuk kebutuhan kosmetik/preview di form admin
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- SUBMIT POST INFO BARU ---
  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul || !deskripsi) {
      addToast("Judul dan deskripsi informasi wajib diisi.", "info");
      return;
    }

    try {
      setSubmitLoading(true);

      // Gunakan FormData agar file gambar ditangkap sempurna oleh Multer di BE
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      if (fileGambar) {
        // 'berkas' atau sesuaikan dengan nama parameter di upload.single("parameter") backend kamu
        formData.append("gambarInfo", fileGambar); 
      }

      await api.post("/info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(formData, `<<< formData`);
      

      addToast("Informasi baru berhasil diterbitkan!", "success");

      // Reset Input Form
      setJudul("");
      setDeskripsi("");
      setFileGambar(null);
      setPreviewUrl("");

      // Refresh list info di bawahnya
      fetchRecentInfos();
    } catch (error) {
      addToast("Gagal mengunggah informasi baru.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- DELETE INFO ---
  const handleDeleteInfo = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await api.delete(`/info/${id}`);
        addToast("Informasi berhasil dihapus.", "success");
        fetchRecentInfos();
      } catch (error) {
        addToast("Gagal menghapus informasi.", "error");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* KOLOM KIRI: FORM UPLOAD (MENGAMBIL 2 KOLOM) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <PlusCircle size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Buat Pengumuman Baru</h2>
              <p className="text-xs text-slate-400 font-medium">Unggah berita, kebijakan baru, atau informasi berkala untuk dashboard karyawan</p>
            </div>
          </div>

          <form onSubmit={handleSubmitInfo} className="space-y-5">
            {/* Input Judul */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Judul Informasi / Berita</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Ketik judul pengumuman di sini..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Isi Konten & Deskripsi</label>
              <textarea
                rows={5}
                placeholder="Tuliskan isi pengumuman secara detail dan jelas di sini..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium text-slate-800"
                required
              ></textarea>
            </div>

            {/* Upload File Gambar */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Pilih Banner / Gambar Informasi</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-grow w-full">
                  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                  />
                </div>
                
                {/* Preview Thumbnail Box */}
                {previewUrl && (
                  <div className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full cursor-pointer sm:w-auto px-6 py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitLoading ? "Menerbitkan..." : "Terbitkan Info"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: RIWAYAT INFO TERAKHIR (MENGAMBIL 1 KOLOM) */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Layers size={16} className="text-slate-500" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Terbitan Terakhir</h3>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {fetchLoading ? (
              <div className="text-center py-8 text-xs font-bold text-slate-400 animate-pulse uppercase tracking-wider">
                Sinkronisasi data...
              </div>
            ) : recentInfos.length === 0 ? (
              <div className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Belum ada info terbit.
              </div>
            ) : (
              recentInfos.map((info) => (
                <div key={info.id} className="flex gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-all items-center justify-between group">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                      {info.gambarInfo ? (
                        <img src={info.gambarInfo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 truncate leading-snug">{info.judul}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {new Date(info.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteInfo(info.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}