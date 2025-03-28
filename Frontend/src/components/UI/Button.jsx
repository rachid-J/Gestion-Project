import { CircularProgress } from "@mui/material";
import clsx from "clsx"; 

export const Button = ({ 
  type, 
  loading, 
  onClick, 
  text, 
  bg, 
  color, 
  width,
  className,
  disabled
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ width: width || "100%" }}
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-md font-semibold transition-all",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        color || "text-white",
        bg || "bg-blue-600 hover:bg-blue-700",
        "h-10 px-4 py-2 text-md",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
        {
          "opacity-75 cursor-not-allowed": loading,
          "hover:bg-blue-700 ": bg === "bg-blue-600" && !disabled && !loading,
        }
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <CircularProgress 
            size={22} 
            sx={{ color: "inherit" }} 
            thickness={4}
          />
          <span>Loading...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};