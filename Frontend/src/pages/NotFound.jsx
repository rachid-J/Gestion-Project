import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate  = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <div className="h-2 w-24 bg-indigo-500 mx-auto mb-6"></div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <button 
          onClick={() => navigate("/redirect")} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

