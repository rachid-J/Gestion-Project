
  
  
  
  
  
  
  import React from 'react';
  import { Button } from "../UI/Button";
  
  export const EmptyState = ({ 
    title, 
    description, 
    icon = "📭", 
    actionLabel, 
    onAction,
    variant = "default",
    className = "" 
  }) => {
    const variantStyles = {
      default: "text-gray-400",
      error: "text-red-400",
      warning: "text-amber-400",
      success: "text-green-400"
    };
  
    return (
      <div className={`py-12 px-6 text-center flex flex-col items-center justify-center ${className}`}>
        <div className="max-w-md mx-auto">
          <div className={`text-5xl mb-6 ${variantStyles[variant]} flex justify-center`}>
            <span className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center shadow-sm">
              {icon}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">{description}</p>
          
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  };
  