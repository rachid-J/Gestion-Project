import React from "react";

export const Pagination = ({ currentPage, lastPage, previous, next, total }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (lastPage <= maxPagesToShow) {
      // If we have fewer pages than maxPagesToShow, show all pages
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(lastPage - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      // Adjust if we're at the end
      if (currentPage >= lastPage - 1) {
        startPage = lastPage - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < lastPage - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(lastPage);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 sm:px-6 bg-white border-t border-gray-200">
      <div className="mb-4 sm:mb-0 text-sm text-gray-700">
        Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{lastPage}</span> • <span className="font-medium">{total}</span> total items
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={previous}
          disabled={currentPage === 1}
          className={`
            relative inline-flex items-center px-3 py-2 sm:px-4 
            border rounded-md text-sm font-medium
            ${currentPage === 1 
              ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
            transition-colors duration-150
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <div className="hidden md:flex space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              disabled={page === '...'}
              className={`
                relative inline-flex items-center px-3 py-2
                border text-sm font-medium rounded-md
                ${page === currentPage 
                  ? 'z-10 bg-blue-600 border-blue-600 text-white' 
                  : page === '...' 
                    ? 'border-gray-300 bg-white text-gray-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
                transition-colors duration-150
              `}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={next}
          disabled={currentPage >= lastPage}
          className={`
            relative inline-flex items-center px-3 py-2 sm:px-4
            border rounded-md text-sm font-medium
            ${currentPage >= lastPage 
              ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'}
            transition-colors duration-150
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};