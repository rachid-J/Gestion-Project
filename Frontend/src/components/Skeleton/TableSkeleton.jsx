import React from 'react';

export const TableSkeleton = ({ heads }) => {
  return (
    <div className="w-full  mt-6 rounded overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="bg-white text-gray shadow-md">
        <div className="flex">
          {heads.map((header, index) => (
            <div
              key={index}
              className=" px-4 py-3 flex-1 text-center font-bold"
            >
              {header}
              
            </div>
          ))}
        </div>
      </div>
      
      {/* Table Body Skeleton */}
      <div className="animate-pulse space-y-2 p-2">
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex ">
            {heads.map((_, colIndex) => (
              <div
                key={colIndex}
                className="  px-4 py-3 flex-1 text-center"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto transition-opacity duration-500 opacity-75"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
