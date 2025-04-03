import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  
  useEffect(() => {

    const redirectTimeout = setTimeout(() => {
      navigate(token ? "/" : "/auth");
    }, 300);
    
  
    return () => clearTimeout(redirectTimeout);
  }, [token, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-gray-600">Redirecting you to the right place...</p>
      </div>
    </div>
  );
};

