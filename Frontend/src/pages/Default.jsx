import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { Sidebar } from "../components/layouts/Sidebar";
import { useState } from 'react';

export const Default = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

    
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

 
      <main className="flex-1 flex flex-col md:ml-64">

        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="fixed top-0 right-0 left-0 md:left-64 z-30" 
        />

      
        <div className="pt-16 flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};