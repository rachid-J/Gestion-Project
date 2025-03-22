import React from "react";

export const Pagination = ({ currentPage, lastPage, previous, next, total }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="mb-2 md:mb-0 text-sm text-gray-600">
        Showing page {currentPage} of {lastPage} • {total} total items
      </div>
      <div className="flex gap-2">
        <button
          onClick={previous}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border transition-all ${
            currentPage === 1
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600"
          }`}
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={currentPage >= lastPage}
          className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 cursor-pointer text-white transition-all ${
            currentPage >= lastPage
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-blue-700 hover:to-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};