import { useSelector } from "react-redux";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const ProjectLayouts = () => {
    const user = useSelector((state) => state.auth.user);
    return (
        <div className='min-h-screen flex flex-col'>
            {/* Fixed Header */}
            <Header user={user} className="fixed top-0 w-full z-50" />
            
            {/* Main Content Area */}
            <div className="flex flex-1 mt-16"> {/* mt-16 to account for header height */}
                {/* Sidebar positioned below header */}
                <Sidebar user={user} className="w-full md:w-64 h-[calc(100vh-4rem)] md:fixed md:left-0" />
                
                {/* Main Content */}
                <main className="flex-1 md:ml-64 overflow-auto">
                    <Outlet /> {/* Your page content */}
                </main>
            </div>
        </div>
    );
};