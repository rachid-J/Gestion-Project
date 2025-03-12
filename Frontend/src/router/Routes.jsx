import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from '../pages/Dashboard';
import { Project } from '../pages/Project';
import { Team } from '../pages/Team';
import { Task } from '../pages/Task';
import { Profile } from '../pages/Profile';
import { Setting } from '../pages/Setting';
import { Security } from '../pages/Security';
import { Calendar } from '../pages/Calendar';
import { Reports } from '../pages/Reports';
import { NotFound } from '../pages/NotFound';
import { useSelector } from "react-redux";
import { Auth } from "../pages/Auth";
import { Default } from "../pages/Default";
import { DefaultSkeleton } from "../components/Skeleton/DefaultSkeleton";
import { useEffect, useState } from "react";
import Redirect from "../pages/Redirect";

export const Router = () => {
    const token = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       
        if (token) {
           
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000); // adjust timeout as needed
            return () => clearTimeout(timer);
        } else {
            
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <DefaultSkeleton />;
    }

    const guestRoutes = [
        { index: true, element: <Auth /> },
        { path: "*", element: <NotFound /> },
        { path: "/redirect", element: <Redirect /> },

    ];

    const authenticatedRoutes = [
        {
            path: "/",
            element: <Default />,
            children: [
                { path: "dashboard", element: <Dashboard /> },
                { path: "task", element: <Task /> },
                { path: "project", element: <Project /> },
                { path: "calendar", element: <Calendar /> },
                { path: "reports", element: <Reports /> },
                { path: "team", element: <Team /> },
                {
                    path: "setting",
                    element: <Setting />,
                    children: [
                        { path: "profile", element: <Profile /> },
                        { path: "security", element: <Security /> }
                    ]
                },
            ]
        },
        { path: "*", element: <NotFound /> },
    ];

    const routes = token ? authenticatedRoutes : guestRoutes;
    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
};
