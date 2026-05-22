import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <Sidebar />
      
      {/* Container utama sekarang pakai min-w-0 agar tidak meluber */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}