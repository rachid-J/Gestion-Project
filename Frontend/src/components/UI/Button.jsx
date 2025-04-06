export const Button = ({ 
  type = "button", 
  loading = false, 
  onClick, 
  text, 
  bg, 
  color, 
  width,
  className,
  disabled = false,
  icon,
  size = "md"
}) => {
  // Size classes
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-md",
    lg: "h-12 px-6 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${color || "text-white"}
        ${bg || "bg-blue-600 hover:bg-blue-700"}
        ${sizeClasses[size]}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${width || ""}
        ${className || ""}
      `}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && (
        <span className="mr-1">{icon}</span>
      )}
      <span>{loading ? "Loading..." : text}</span>
    </button>
  );
};