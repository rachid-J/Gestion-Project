import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { Project } from '../pages/Project';
import { Profile } from '../pages/Profile';


import { NotFound } from '../pages/NotFound';
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "../pages/Auth";
import { Default } from "../pages/Default";
import { DefaultSkeleton } from "../components/Skeleton/DefaultSkeleton";
import { useEffect, useState } from "react";

import { user } from "../services/authServices";

import { ProjectLayouts } from "../components/layouts/ProjectLayouts";
import { Summary } from "../pages/Summary";
import { Board } from "../pages/Board";
import { List } from "../pages/List";

import { ContactsPage } from "../pages/ContactPage";


import { Collaboration } from "../pages/Colaboration";
import { logOut, setUser } from "../Redux/features/authSlice";

import { Settings } from "../pages/Settings";
import { Dashboard } from "../pages/Dashboard";
import { Team } from "../pages/Team";
import { LandingPage } from "../pages/LandingPage";
import { Redirect } from "../pages/Redirect";
import { AboutPage } from "../pages/AboutPage";
import { Features } from "../pages/features";
import { HomeLayouts } from "../components/layouts/HomeLayouts";




export const Router = () => {
    const token = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()








    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await user(token);

                // Check if the response has the expected user data structure
                if (response && response.data && response.data.user) {
                    dispatch(setUser(response.data));
                } else {
                    console.error("Invalid user data structure received");
                    dispatch(logOut());
                }
            } catch (error) {
                console.error("Error fetching user:", error);

                // Any authentication error should log out the user
                if (error.response && error.response.status === 401) {
                    const errorMessage = error.response.data?.error || "Authentication failed";
                    console.log(`Auth error: ${errorMessage}`);
                    dispatch(logOut());
                } else {
                    // Handle other errors (like network issues, server errors)
                    console.error("Unexpected error during authentication");
                    dispatch(logOut());
                }
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
        {
            index: true,
            element: <Navigate to="/home" replace />
        },
        { path: "/auth", element: <Auth /> },
        { 
            path: "/home", 
            element: <HomeLayouts />,
            children: [
                { index: true, element: <LandingPage /> },
                { path: "about", element: <AboutPage /> },
                { path: "features", element: <Features /> }
            ]
        },
        { path: "/redirect", element: <Redirect /> },
        { path: "*", element: <NotFound /> }
    ];

    const authenticatedRoutes = [
        {
            path: "/",
            element: <Default />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/Dashboard" replace />
                },
                { path: "projects", element: <Project /> },
                { path: "Dashboard", element: <Dashboard /> },
                { path: "profile/:username", element: <Profile /> },
                { path: "settings", element: <Settings /> },
                { path: "contact", element: <ContactsPage /> },
                { path: "teams", element: <Team /> },





            ]
        },
        {
            path: "projects/:projectId",
            element: <ProjectLayouts />,
            children: [
                { path: "Summary", element: <Summary /> },
                { path: "board", element: <Board /> },
                { path: "List", element: <List /> },
                { path: "collaboration", element: <Collaboration />, },



            ]
        },


        { path: "*", element: <NotFound /> },
        { path: "/redirect", element: <Redirect /> },
    ];

    const routes = token ? authenticatedRoutes : guestRoutes;
    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
};
