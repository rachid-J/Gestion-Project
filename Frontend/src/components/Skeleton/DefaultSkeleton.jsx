import { TableSkeleton } from "./TableSkeleton";


export const DefaultSkeleton = () => {
  return (
    <div className="p-6 bg-white-900 text-black min-h-screen animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Filters/Controls Skeleton */}
      <div className="flex w-full items-center gap-3 mt-4">
        {/* Search Input Skeleton */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>

        {/* Select Skeleton */}
        <div className="w-48 h-10 bg-gray-200 rounded-md"></div>

        {/* Button Skeleton */}
        <div className="w-32 h-10 bg-gray-200 rounded-md"></div>
      </div>

      {/* Table Area Skeleton */}
      <div className="mt-4 px-2">
        <TableSkeleton heads={["Name", "Status", "Creator"]}/>
      </div>
    </div>
  );
};