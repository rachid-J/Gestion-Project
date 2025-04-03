import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { useSelector } from "react-redux";
import { SidebarHome } from "../components/layouts/SidebarHome";
import { useState } from "react";

export const Default = () => {
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle (hidden on desktop) */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <SidebarHome />
      </div>

      {/* Main Content Area */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header user={user} className="sticky top-0 z-30 bg-white shadow-sm" />
        
        {/* Content Container */}
        <main className="p-4 md:p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};