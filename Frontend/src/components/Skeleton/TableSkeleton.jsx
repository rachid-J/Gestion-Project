import React from 'react';

export const TableSkeleton = ({ heads }) => {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="hidden md:grid grid-cols-4 gap-4 mb-4">
        {heads.map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded-full w-1/4" />
        ))}
        <div className="h-4 bg-gray-200 rounded-full w-1/4" />
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 py-4">
          {heads.map((_, j) => (
            <div key={j} className="h-4 bg-gray-100 rounded-full" />
          ))}
          <div className="flex space-x-3">
            <div className="h-6 w-6 bg-gray-100 rounded-full" />
            <div className="h-6 w-6 bg-gray-100 rounded-full" />
            <div className="h-6 w-6 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};