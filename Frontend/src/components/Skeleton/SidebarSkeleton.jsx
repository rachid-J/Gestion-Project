import React from 'react';

export const SidebarSkeleton = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white/95 shadow-lg backdrop-blur-lg border-r border-gray-100 animate-pulse">
      <div className="flex flex-col h-full">
        {/* Logo + Close Button */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full md:hidden"></div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-3 flex-1">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center p-3 rounded-xl bg-gray-200"></div>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
