import React from 'react';

export const HeaderSkeleton = () => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 
      flex items-center justify-between px-4 md:px-6 z-30 gap-2 md:gap-6 animate-pulse">
      
      <div className="hidden md:flex flex-1">
        <div className="relative w-full max-w-4xl">
          <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5 ml-auto">
        <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>

        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="hidden md:block h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </header>
  );
};
