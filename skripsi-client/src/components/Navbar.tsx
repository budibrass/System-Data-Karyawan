"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { User, Search, Settings } from "lucide-react";
import api from "@/lib/axios"; // 🌟 Pastikan import api axios Anda sudah benar

export default function Navbar() {
  const { email, role } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // 🌟 State tambahan untuk menampung URL foto profile dari backend
  const [fotoProfile, setFotoProfile] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Ambil data localStorage di awal mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("id");
      setUserId(storedId);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🌟 2. Buat useEffect kedua untuk fetch data karyawan berdasarkan userId
  useEffect(() => {
    const fetchNavbarAvatar = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/karyawan/${userId}`);
        if (response.data && response.data.fotoProfile) {
          setFotoProfile(response.data.fotoProfile);
        }
      } catch (error) {
        console.error("Gagal memuat foto profil di navbar:", error);
      }
    };

    fetchNavbarAvatar();
  }, [userId]);

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    const segment = pathname.split("/").pop();
    return segment ? segment.replace(/-/g, " ").toUpperCase() : "DASHBOARD";
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    if (userId) {
      router.push(`/karyawan/data/edit/${userId}`);
    } else {
      console.error("User ID tidak ditemukan di localStorage");
    }
  };

  const handleNavigatePassword = () => {
    setIsDropdownOpen(false);
    router.push(`/karyawan/data/edit-password/${userId}`);
  };

  return (
    <nav className="sticky top-0 z-20 flex h-20 items-center justify-between bg-white/70 px-10 backdrop-blur-xl border-b border-rose-50">
      
      {/* Kiri: Judul Halaman & Search */}
      <div className="flex items-center gap-12">
        <h2 className="text-sm font-black tracking-[0.2em] text-rose-800 uppercase">
          {getTitle()}
        </h2>
        
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari sesuatu..." 
            className="h-10 w-64 rounded-full bg-rose-50/50 pl-10 pr-4 text-sm outline-none ring-1 ring-rose-100 focus:ring-rose-300 transition-all"
          />
        </div> */}
      </div>

      {/* Kanan: Notifikasi & Profil */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-l border-rose-100 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">
              {email}
            </p>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">
              {role}
            </p>
          </div>
          
          {/* Container Profil & Dropdown dengan Ref */}
          <div className="relative" ref={dropdownRef}>
            {/* Tombol Avatar */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-11 w-11 rounded-full bg-linear-to-tr from-rose-400 to-rose-600 p-[2px] shadow-lg shadow-rose-200 flex items-center justify-center transition-transform active:scale-95 outline-none overflow-hidden"
            >
              <div className="flex cursor-pointer h-full w-full items-center justify-center rounded-full bg-white text-rose-500 hover:bg-rose-50/50 transition-colors overflow-hidden">
                {/* 🌟 CONDITIONAL RENDERING FOTO PROFILE / AVATAR KOSONG */}
                {fotoProfile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={fotoProfile} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={22} />
                )}
              </div>
            </button>

            {/* Menu Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl border border-rose-50 bg-white p-2 shadow-xl shadow-rose-100/50 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-30">
                <div className="px-3 py-2 border-b border-rose-50/60 sm:hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{email}</p>
                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">{role}</p>
                </div>
                
                {/* Sub Menu: Setting / Edit Data Karyawan */}
                <button
                  onClick={handleEditProfile}
                  className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Settings size={16} className="text-rose-400" />
                  <span>Pengaturan Profil</span>
                </button>

                <button
                  onClick={handleNavigatePassword}
                  className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <span>Ubah Password</span>
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}