// layouts/ProjectLayouts.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useParams, Navigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { getAllProject } from "../../services/projectServices";
import { setProject } from "../../Redux/features/projectSlice";
import { DefaultSkeleton } from "../Skeleton/DefaultSkeleton";
import { logOut } from "../../Redux/features/authSlice";

export const ProjectLayouts = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidProject, setIsValidProject] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.projects);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const verifyProjectAccess = async () => {
      try {
        if (!projects || projects.length === 0) {
          const response = await getAllProject(token);
          dispatch(setProject(response.data.projects));
        }

        const numericProjectId = Number(projectId);
        if (isNaN(numericProjectId)) {
          setIsValidProject(false);
          return;
        }

        const currentProject = projects.find(
          project => project.id === numericProjectId
        );

        const hasAccess = currentProject && (
          currentProject.creator.id === user?.id ||
          currentProject.users.some(u => u.id === user?.id)
        );

        setIsValidProject(!!hasAccess);
      } catch (error) {
        console.error("Project verification error:", error);
        if (error.response?.status === 401) {
          dispatch(logOut());
          return;
        }
        setIsValidProject(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user) verifyProjectAccess();
    else setIsLoading(false);
  }, [projectId, dispatch, token, user, projects]);

  if (isLoading) return <DefaultSkeleton />;
  if (!token) return <Navigate to="/auth" replace />;
  if (!isValidProject) return <Navigate to="/projects" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/20">
      <Header user={user} />
      <div className="flex flex-1 mt-16">
        <Sidebar user={user} />
        <main className="flex-1 md:ml-72 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};