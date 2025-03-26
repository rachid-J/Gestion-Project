import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { useSelector } from "react-redux";


export const Default = () => {
  const user = useSelector((state)=> state.auth.user)
 

  return (
    <div className="min-h-screen flex">
        <Header user={user}  className="fixed top-0 right-0 z-30" />
     
      <main className="flex-1 flex flex-col ">

        <div className="pt-10 flex-1 overflow-auto bg-gray-50">
          <div className="mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};