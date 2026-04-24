import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import SupportButton from "../SupportChat/SupportButton";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="page-body">
          <Outlet />
        </div>
      </div>

      <SupportButton />
    </div>
  );
}
