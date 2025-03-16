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
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "../pages/Auth";
import { Default } from "../pages/Default";
import { DefaultSkeleton } from "../components/Skeleton/DefaultSkeleton";
import { useEffect, useState } from "react";
import Redirect from "../pages/Redirect";

import { user } from "../services/authServices";
import { setUser } from "../Redux/features/authSlice";
import { ProjectLayouts } from "../components/layouts/ProjectLayouts";
import { Summary } from "../pages/Summary";
import { Board } from "../pages/Board";
import { List } from "../pages/List";


export const Router = () => {
    const token = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await user(token)
                dispatch(setUser(response.data));
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [token, dispatch]);

    if (isLoading) {
        return <DefaultSkeleton />;
    }

    const guestRoutes = [
        { path: "/auth", element: <Auth /> },
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
                { path: "projects", element: <Project /> },
                { path: "team", element: <Team /> },
            ]
        },
        {
            path: "projects/:id",
            element: <ProjectLayouts />,
            children: [
                { path: "Summary", element: <Summary /> },
                { path: "board", element: <Board /> },
                { path: "List", element: <List /> },
                { path: "reports", element: <Reports /> },
            ]
        },

        { path: "*", element: <NotFound /> },
        { path: "/redirect", element: <Redirect /> },
    ];

    const routes = token ? authenticatedRoutes : guestRoutes;
    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
};
