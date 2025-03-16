import React from "react";

export const Pagination = ({ currentPage, lastPage, previus, next, total }) => {
  return (
    <div className="flex justify-between mt-2">
      <div>
        <span className="font-semibold">
          Total:{total}, Showing {currentPage} from {lastPage} pages
        </span>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-inherit border-2 border-blue-600 px-3 py-1 rounded-md"
          onClick={() => previus()}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 border-2 text-white rounded-md border-blue-600 px-3 py-1"
          onClick={() => next()}
          disabled={currentPage >= lastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};
