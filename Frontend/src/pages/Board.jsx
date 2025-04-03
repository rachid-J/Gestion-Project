import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { createTask, getTasks } from "../services/tasksServices";
import { TaskTable } from "../components/tables/TaskTable";
import { CreateTaskModal } from "../components/layouts/CreateTaskModal";
import { Button } from "../components/UI/Button";
import { errors } from "../constants/Errors";
import { EmptyState } from "../components/Skeleton/EmptyState";

export const Board = () => {
  const user = useSelector((state) => state.auth.user);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const { projectId } = useParams();
  
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
  });
  const [paginate, setPaginate] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  
  const fetchTasks = async (page = 1) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await getTasks(page, projectId);
      if (response.status === 200) {
        const taskData = response.data.tasks;
        setTasks(taskData?.data || []);
        setPaginate(true);
        setPagination({
          currentPage: taskData.current_page,
          lastPage: taskData.last_page,
          total: taskData.total,
        });
        setErrorMessage(taskData?.data?.length > 0 ? "" : errors.notFound);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setErrorMessage(
        error.response?.status === 404 ? errors.notFound : errors.tryAgain
      );
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
 
  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(projectId, taskData);
      if (response.status === 200) {
        setIsModalCreateOpen(false);
        fetchTasks(1);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, [projectId]);

  const isCreator = user.id === selectedProject?.creator?.id;
  
  return (
    <>
      <CreateTaskModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreate={handleCreateTask}
        projectId={projectId}
        getData={fetchTasks}
      />

      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </span>
                Task Management
              </h1>
              <p className="text-gray-500 mt-1 flex items-center">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Project ID: {projectId}</span>
                {selectedProject?.name && <span className="ml-2 text-sm">{selectedProject.name}</span>}
              </p>
            </div>
          
            {isCreator && (
                 <Button
                 text="+ New Task"
                 width="20%"
                 onClick={() => setIsModalCreateOpen(true)}
                 className="bg-gradient-to-r from-blue-600 to-purple-500 cursor-pointer"
               >
                 New Task
               </Button>
            )}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <h2 className="font-medium text-gray-700">Tasks</h2>
              </div>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                {pagination.total} tasks
              </span>
            </div>

            {/* Card Content */}
            <div>
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin">
                      <ArrowPathIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-600">Loading tasks...</span>
                  </div>
                </div>
              ) : errorMessage ? (
                <EmptyState
                  title="Unable to load tasks"
                  description={errorMessage}
                  icon="⚠️"
                  variant="error"
                  className="my-8"
                />
              ) : tasks.length > 0 ? (
                <TaskTable
                  data={tasks}
                  getData={fetchTasks}
                  pagination={pagination}
                  paginate={paginate}
                  currentUserId={user.id}
                  viewButton={true}
                  updateButton={true}
                  deleteButton={true}
                  toUpdateOrDelete={"task"}
                />
              ) : (
                <EmptyState
                  title="No tasks found"
                  description="Get started by creating your first task for this project"
                  icon="📋"
                  actionLabel="Create Task"
                  onAction={() => setIsModalCreateOpen(true)}
                  className="py-16"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};