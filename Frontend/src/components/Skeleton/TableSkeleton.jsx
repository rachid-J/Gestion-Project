export const TableSkeleton = ({ heads }) => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white">
      {/* Header skeleton */}
      <div className="bg-gray-50 p-4 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {heads.map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded-full w-full sm:w-3/4" />
          ))}
          <div className="hidden md:block h-4 bg-gray-200 rounded-full w-3/4" />
        </div>
      </div>

      {/* Rows skeleton */}
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {heads.map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded-full" />
              ))}
              <div className="flex justify-center md:justify-end space-x-3 mt-2 md:mt-0">
                <div className="h-8 w-8 bg-gray-100 rounded-full" />
                <div className="h-8 w-8 bg-gray-100 rounded-full" />
                <div className="h-8 w-8 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};