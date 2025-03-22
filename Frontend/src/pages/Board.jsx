import React, { useState, useEffect } from "react";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { TableSkeleton } from "../components/Skeleton/TableSkeleton";
import { Table } from "../components/tables/Table";
import { errors } from "../constants/Errors";
import { useSelector } from "react-redux";
import { createTask, getTasks } from "../services/tasksServices";
import { useParams } from "react-router-dom";
import {CreateTaskModal} from "../components/layouts/CreateTaskModal";

export const Board = () => {
  const user = useSelector((state) => state.auth.user);
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
  });

  const { projectId } = useParams (); 
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const fetchTasks = async (page = 1) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await getTasks(page, projectId);
      console.log("API Response:", response.data.tasks.current_page);

      if (response.status === 200) {
        const taskData = response.data.tasks;
        console.log("Tasks Extracted:", taskData);

        setPaginate(true);
        setTasks(taskData?.data || []);
        setPagination({
          currentPage: response.data.tasks.current_page,
          lastPage: response.data.tasks.last_page,
          total: response.data.tasks.total,
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
      console.log(taskData)
      const response = await createTask(projectId, taskData);
      if (response.status === 200) {
        console.log("Task Created Successfully:", response.data);
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

  return (
    <>
    <CreateTaskModal
      isOpen={isModalCreateOpen}
      onClose={() => setIsModalCreateOpen(false)}
      onCreate={handleCreateTask}
      projectId={projectId}
    />
    <div className="p-6 bg-white-900 text-black min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Tasks</h1>
        <p className="text-gray-500 mb-5">Manage and track your tasks</p>
      </div>
      <Button 
        text="+ New Task" 
        width="w-auto" 
        onClick={() => setIsModalCreateOpen(true)}
      />
      <div className="mt-4 px-2">
              {errorMessage && (
                <span className="text-red-300 text-xl font-semibold">
                  {errorMessage}
                </span>
              )}
      
              {loading ? (
                <TableSkeleton heads={["Title","Description","Status","Assigned_to","Action"]} />
              ) : tasks.length > 0 ? (
                <Table
                  heads={["Title","Description","Status","Assigned_To"]}
                  data={tasks}
                  keys={["title","description","status","assigned_to"]}
                  getData={fetchTasks}
                  paginate={paginate}
                  pagination={pagination}
                  deleteButton={true}
                  updateButton={true}
                  viewButton={true}
                  currentUserId ={user.id}
                />
              ) : (
                !loading && (
                  <div className="overflow-hidden rounded-xl border mt-3 border-gray-200 bg-white shadow-sm">
                    <div className="p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mb-4 text-6xl">📭</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No tasks found</h3>
                  </div>
                </div>
                  </div>
                )
              )}
            </div>
    </div>
    </>
  );
};
