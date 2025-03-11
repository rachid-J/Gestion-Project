import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import {Welcome} from '../pages/Welcome';
// import {Dashboard} from '../pages/Dashboard';
// import {Project} from '../pages/Project';
// import {Team} from '../pages/Team';
// import {Task} from '../pages/Task';
// import {Profile} from '../pages/Profile';
// import {Loading} from '../pages/Loading';
// import {NotFound} from '../pages/NotFound';
// import {Default} from '../layouts/Default';
import { useSelector } from "react-redux";
import {Auth} from "../pages/Auth";
export const Router =()=>{

    const token = useSelector((state) => state.auth.token);

    const guestRoutes = [
        {
            path:"/auth",
            element: <Auth />,
        },
        { path: "*", element: <NotFound /> },
        { path: "/loadings", element: <Loading /> }
    ]

    const authenticatedRoutes = [
        {
            element: <Default />,
            children:[
                { path: "/loadings", element: <Loading /> },
                // {
                //     path:"/",
                //     element: <Welcome />,
                //     children:[
                //         {path:"/dashboard", element: <Dashboard />},
                //         {path:"/project", element: <Project />},
                //         {path:"/team", element: <Team />},
                //         {path:"/task", element: <Task />},
                //         {path:"/profile", element: <Profile />},
                //     ]
                // }
            ]
        },
        { path: "*", element: <NotFound /> },
    ]

    const Routes = token ? authenticatedRoutes() : guestRoutes();

    const router = createBrowserRouter(Routes);

    return <RouterProvider router={router} />;
}