"use client";
import React, { useState, useEffect } from "react";
import { Printer, FolderKanban, User, Search, ChevronLeft, ChevronRight, Loader2, Info, Trash2, Edit3, XCircle, Settings2, X } from "lucide-react";
import api from "@/lib/axios";
import { useToastStore } from "@/store/useToastStore";

interface ProjectItem {
  nama: string;
  id: number;
  projectManager: string;
  createdAt?: string;
}

export default function ProjectPage() {
  const addToast = useToastStore((state) => state.addToast);

  // --- STATE FORM INPUT ---
  const [namaProject, setNamaProject] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- STATE DUAL-MODE (CREATE / EDIT) ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // --- STATE DATA TABLE, SEARCH, & PAGINATION ---
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- DEBOUNCE SEARCH EFFECT ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- 1. FETCH DATA PROJECT (GET ALL) ---
  const fetchProjects = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get("/project");
      const responseData = response.data?.data ? response.data.data : response.data;
      
      if (Array.isArray(responseData)) {
        setProjects(responseData);
      } else if (responseData && Array.isArray(responseData.list)) {
        setProjects(responseData.list);
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal mengambil data Project";
      addToast(errorMessage, "error");
      setProjects([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- LOGIC FILTERING DATA (SEARCH) ---
  const filteredProjects = projects.filter((project) => {
    const query = debouncedSearch.toLowerCase();
    const namaMatch = project.nama?.toLowerCase().includes(query);
    const pmMatch = project.projectManager?.toLowerCase().includes(query);
    
    return namaMatch || pmMatch;
  });

  // --- LOGIC PAGINATION ---
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- 2. RESET/BATAL EDIT FORM ---
  const handleResetForm = () => {
    setNamaProject("");
    setProjectManager("");
    setIsEditMode(false);
    setSelectedId(null);
  };

  // --- 3. SUBMIT DATA PROJECT (POST CREATE / PUT UPDATE) ---
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProject || !projectManager) {
      addToast("Semua inputan wajib diisi.", "info");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        nama: namaProject,
        projectManager,
      };

      if (isEditMode && selectedId) {
        await api.put(`/project/${selectedId}`, payload);
        addToast("Data project berhasil diperbarui!", "success");
      } else {
        await api.post("/project", payload);
        addToast("Project baru berhasil ditambahkan!", "success");
      }

      handleResetForm();
      fetchProjects();
    } catch (error) {
      console.error("Gagal memproses data project:", error);
      addToast(isEditMode ? "Gagal memperbarui data." : "Gagal menambahkan data.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- 4. FETCH DATA INDIVIDU & SET KE FORM (GET BY ID) ---
  const handleEditTrigger = async (id: number) => {
    try {
      setSubmitLoading(true);
      const response = await api.get(`/project/${id}`);
      const data = response.data?.data ? response.data.data : response.data;

      if (data) {
        setNamaProject(data.nama || "");
        setProjectManager(data.projectManager || "");
        
        setIsEditMode(true);
        setSelectedId(id);
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Gagal memuat detail data project:", error);
      addToast("Gagal mengambil detail data project.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- 5. HANDLE DELETE ---
  const handleDeleteProject = async (id: number, nama: string) => {
    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus project "${nama}"?`);
    
    if (konfirmasi) {
      try {
        await api.delete(`/project/${id}`);
        addToast(`Project "${nama}" berhasil dihapus.`, "success");
        if (selectedId === id) handleResetForm();
        fetchProjects();
      } catch (error: any) {
        console.error("Gagal menghapus project:", error);
        addToast(error.response?.data?.msg || "Gagal menghapus data project.", "error");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* SECTION 1: FORM INPUT */}
      <div className={`print:hidden bg-white border rounded-3xl shadow-xl shadow-slate-100/40 p-6 sm:p-8 space-y-6 transition-all duration-300 ${isEditMode ? "border-blue-100 ring-4 ring-blue-50/50" : "border-slate-100"}`}>
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-colors ${isEditMode ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
              {isEditMode ? <Settings2 size={22} /> : <FolderKanban size={22} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEditMode ? "Edit Data Project" : "Tambah Project Baru"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {isEditMode ? "Ubah rincian nama project dan penugasan Product Manager terpilih" : "Kelola standarisasi nama project sistem dan penugasan Product Manager."}
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <XCircle size={14} /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitProject} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nama Project</label>
            <div className="relative">
              <FolderKanban className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Masukkan nama project..."
                value={namaProject}
                onChange={(e) => setNamaProject(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Product Manager</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Nama Product Manager..."
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all font-semibold text-slate-800 ${isEditMode ? "focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 border-slate-200" : "focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-600 border-slate-200/80"}`}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full px-6 py-2.5 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-white ${isEditMode ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-[#7CB342] hover:bg-[#689F38] shadow-green-100"}`}
            >
              {submitLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{isEditMode ? "Update Data Project" : "Simpan Project"}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: DATATABLE & NAVBAR CONTROLS */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Daftar Project Terdaftar</h3>
          
          {/* 🌟 PERBAIKAN: Ditambahkan flexbox wrapper agar input dan tombol berjejer horizontal */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            
            {/* Input Search Wrapper */}
            <div className="relative w-full sm:w-64 print:hidden">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama project atau PM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Tombol Cetak Data (Dipindah ke kanan input pencarian) */}
            <button
              type="button"
              onClick={handlePrint}
              className="print:hidden flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 h-[34px]"
            >
              <Printer size={14} /> 
              <span className="hidden xs:inline">Cetak Data</span>
            </button>

          </div>
        </div>

        {fetchLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Loader2 size={32} className="animate-spin mx-auto text-[#7CB342]" />
            <p className="text-xs font-semibold uppercase tracking-wider">Menyelaraskan data project...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white space-y-3">
            <div className="p-3 bg-slate-50 inline-block rounded-full">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Tidak ada data project yang ditemukan.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="py-4 px-6 w-16">No</th>
                    <th className="py-4 px-6">Nama Project</th>
                    <th className="py-4 px-6">Project Manager</th>
                    <th className="py-4 px-6 text-center w-24 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                  {currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6 text-slate-400 font-bold">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{item.nama}</td>
                      <td className="py-4 px-6 text-slate-600">{item.projectManager}</td>
                      <td className="py-4 px-6 print:hidden">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditTrigger(item.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(item.id, item.nama)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Hapus Project"
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

            {/* BAR PAGINATION */}
            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20 print:hidden">
              <span className="text-xs font-semibold text-slate-400">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
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