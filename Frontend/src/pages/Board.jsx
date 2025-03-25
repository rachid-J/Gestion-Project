import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createTask, getTasks } from "../services/tasksServices";
import { TaskTable } from "../components/tables/TaskTable";
import { TableSkeleton } from "../components/Skeleton/TableSkeleton";
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
        console.log(taskData)
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
  }, []);


  const isCreator = user.id === selectedProject.creator.id
  console.log("asd",selectedProject)
  return (
    <>
      <CreateTaskModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreate={handleCreateTask}
        projectId={projectId}
        getData={fetchTasks}
      />

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
              <p className="text-gray-500 mt-1">Project ID: {projectId}</p>
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-500">
                  Showing {pagination.total} tasks
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
               <div className="p-8 flex items-center justify-center gap-3 text-indigo-600">
               <div className="animate-spin">
                 <ArrowPathIcon className="w-6 h-6" />
               </div>
               <span className="font-medium">Loading tasks...</span>
             </div>
              ) : errorMessage ? (
                <EmptyState
                  title="Unable to load tasks"
                  description={errorMessage}
                  icon="⚠️"
                  variant="error"
                  className="my-4 mx-4"
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
                  title="No tasks yet"
                  description="Get started by creating your first task"
                  icon="📋"
                  actionLabel="New Task"
                  onAction={() => setIsModalCreateOpen(true)}
                  className="py-12 border-t border-gray-100"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};