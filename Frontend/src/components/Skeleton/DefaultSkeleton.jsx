import { Outlet } from "react-router-dom";


import { SidebarSkeleton } from "./SidebarSkeleton";
import { HeaderSkeleton } from "./HeaderSkeleton";

export const DefaultSkeleton = () => {
 
    
  return (
    <div className="min-h-screen flex">

    

    
      <SidebarSkeleton/>

 
      <main className="flex-1 flex flex-col md:ml-64">

        <HeaderSkeleton />

      
        <div className="pt-16 flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
           
          </div>
        </div>
      </main>
    </div>
  );
};