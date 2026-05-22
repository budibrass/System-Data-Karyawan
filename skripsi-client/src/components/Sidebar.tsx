"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, LayoutDashboard, Users, Clock, 
  CalendarDays, Wallet, Info, Layers, 
  Briefcase, FileSearch, LineChart, UserPlus, LogOut, 
  Menu, FileText, ClipboardCheck, Fingerprint, Receipt 
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isKaryawanOpen, setIsKaryawanOpen] = useState(true);
   const { role } = useAuthStore((state) => state); 

  const activeClass = "bg-rose-500 text-white shadow-lg shadow-rose-200";
  const inactiveClass = "text-rose-900/70 hover:bg-rose-100/50 hover:text-rose-600";

  // Helper function untuk styling submenu agar lebih rapi kodenya
  const getSubmenuClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center rounded-lg py-2 transition-all ";
    
    if (isCollapsed) {
      return baseClass + (isActive ? "justify-center px-0 text-rose-600 bg-rose-50" : "justify-center px-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50");
    }
    
    return baseClass + (isActive ? "gap-3 text-rose-600 font-bold italic" : "gap-3 text-rose-900/60 hover:text-rose-600");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsKaryawanOpen(false);
      } else {
        setIsCollapsed(false);
        setIsKaryawanOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`sticky top-0 h-screen shrink-0 transition-all duration-300 border-r border-rose-100 bg-linear-to-br from-[#fff1f2] via-[#fff1f2] to-white z-30 print:hidden ${isCollapsed ? "w-20" : "w-72"}`}>
      <div className="flex h-full flex-col py-6">
        
        {/* HEADER */}
        <div className={`mb-8 flex items-center h-10 ${isCollapsed ? "justify-center" : "justify-between px-6"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500 font-bold text-white">A</div>
              <h1 className="text-xl font-bold tracking-tight text-rose-950 truncate">Aksaramaya</h1>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-100 shrink-0 transition-colors">
            <Menu size={20} />
          </button>
        </div>

        {/* AREA MENU */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar overflow-x-hidden space-y-6">
          
          <nav className="space-y-1">
            {!isCollapsed && <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">Main Menu</p>}
            
            <Link href="/dashboard" title="Dashboard" className={`flex items-center rounded-xl py-3 transition-all duration-200 ${pathname === '/dashboard' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
              <LayoutDashboard size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-semibold text-sm truncate">Dashboard</span>}
            </Link>

            {/* DROPDOWN KARYAWAN */}
            <div>
              <button 
                onClick={() => setIsKaryawanOpen(!isKaryawanOpen)}
                title="Karyawan"
                className={`flex w-full items-center rounded-xl transition-all ${inactiveClass} ${isCollapsed ? "justify-center py-3" : "justify-between px-3 py-3"}`}
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Karyawan</span>}
                </div>
                {!isCollapsed && <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isKaryawanOpen ? "rotate-180" : ""}`} />}
              </button>

              {/* AREA SUBMENU KARYAWAN */}
              {isKaryawanOpen && (
                <div className={`mt-1 space-y-1 ${isCollapsed ? "pt-2 pb-4" : "ml-3 border-l-2 border-rose-200/50 pl-4"}`}>
                  <Link href="/karyawan/data" title="Data Karyawan" className={getSubmenuClass('/karyawan/data')}>
                    <FileText size={16} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm truncate">Data Karyawan</span>}
                  </Link>

                  <Link href="/karyawan/presensi" title="Presensi" className={getSubmenuClass('/karyawan/presensi')}>
                    <Fingerprint size={16} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm truncate">Presensi</span>}
                  </Link>

                  <Link href="/karyawan/slip-gaji" title="Slip Gaji" className={getSubmenuClass('/karyawan/slip-gaji')}>
                    <Receipt size={16} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm truncate">Slip Gaji</span>}
                  </Link>
                </div>
              )}
            </div>

            <Link href="/lembur" title="Lembur" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/lembur' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
              <Clock size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-semibold text-sm truncate">Lembur</span>}
            </Link>

            <Link href="/cuti" title="Cuti" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/cuti' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
              <CalendarDays size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-semibold text-sm truncate">Cuti</span>}
            </Link>

            <Link href="/reimburcement" title="Reimbursement" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/reimbursement' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
              <Wallet size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-semibold text-sm truncate">Reimbursement</span>}
            </Link>
          </nav>

            {role === "admin" && (
              <nav className="space-y-1 pt-4">
                {!isCollapsed && <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">Admin Area</p>}
                
                <Link href="/info" title="Info" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/info' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <Info size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Info</span>}
                </Link>
                
                <Link href="/golongan" title="Golongan" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/golongan' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <Layers size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Golongan</span>}
                </Link>

                <Link href="/project" title="Project" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/project' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <Briefcase size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Project</span>}
                </Link>

                <Link href="/pengajuan" title="Pengajuan" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/pengajuan' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <FileSearch size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Pengajuan</span>}
                </Link>

                {/* <Link href="/performa" title="Performa Karyawan" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/performa' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <LineChart size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Performa Karyawan</span>}
                </Link> */}

                <Link href="/buat-akun" title="Buat Akun" className={`flex items-center rounded-xl py-3 transition-all ${pathname === '/buat-akun' ? activeClass : inactiveClass} ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                  <UserPlus size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-sm truncate">Buat Akun</span>}
                </Link>
              </nav>
            )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-6 border-t border-rose-100 px-4">
          <button 
            onClick={() => { logout(); window.location.href = "/login"; }}
            title="Keluar"
            className={`flex w-full items-center rounded-xl py-3 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 group ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}
          >
            <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-bold text-sm truncate">Keluar</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}