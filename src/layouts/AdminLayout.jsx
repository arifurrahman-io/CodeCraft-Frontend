import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <AdminNavbar
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
