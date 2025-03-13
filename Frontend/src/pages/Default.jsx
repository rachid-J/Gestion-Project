import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { Sidebar } from "../components/layouts/Sidebar";
import { useDispatch, useSelector } from "react-redux";


export const Default = () => {
  const user = useSelector((state)=> state.auth.user)
  const disp = useDispatch()

  return (
    <div className="min-h-screen flex">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col md:ml-64">
        <Header user={user} disp={disp} className="fixed top-0 right-0 left-0 md:left-64 z-30" />
        <div className="pt-16 flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};