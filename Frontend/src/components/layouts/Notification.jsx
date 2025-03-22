import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export const Notification = ({ message, type }) => {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!open || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 1, 0));
    }, 30);

    const timeout = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, isHovered]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div
        className={`relative w-80 p-6 rounded-2xl shadow-2xl backdrop-blur-xl transform transition-all duration-300 ${
          isHovered ? "translate-x-0" : "translate-x-2"
        } ${
          type === "success"
            ? "bg-emerald-500/15 border border-emerald-500/20"
            : "bg-rose-500/15 border border-rose-500/20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {type === "success" ? (
              <CheckCircleIcon className="w-7 h-7 text-emerald-500" />
            ) : (
              <XCircleIcon className="w-7 h-7 text-rose-500" />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-semibold text-gray-900">
              {type === "success" ? "Success" : "Error"}
            </h3>
            <p className="text-sm text-gray-700">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mt-1 -mr-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 relative">
          <div className="h-1 bg-gray-200/30 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                type === "success" 
                  ? "bg-emerald-500" 
                  : "bg-rose-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

