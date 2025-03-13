import { useState, useEffect } from "react";

export const Notification = ({ message, type }) => {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 1, 0));
    }, 30); // Decrease progress every 30ms for smooth animation

    const timeout = setTimeout(() => {
      setOpen(false);
      clearInterval(interval);
    }, 3000); // Close notification after 3 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`relative w-80 p-4 rounded-lg shadow-lg backdrop-blur-sm ${
          type === "success" ? "bg-green-100/80" : "bg-red-100/80"
        }`}
      >
        <div className="flex items-center">
          <span className={`text-xl ${type === "success" ? "text-green-600" : "text-red-600"}`}>
            {type === "success" ? "✔" : "❌"}
          </span>
          <span
            className={`ml-2 text-md font-semibold ${
              type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </span>
        </div>
        <div
          className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
            type === "success" ? "bg-green-400/80" : "bg-red-400/80"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};