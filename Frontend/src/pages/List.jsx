import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  RectangleStackIcon
} from '@heroicons/react/24/solid';
import { useParams } from 'react-router-dom';
import { createTask, getAllTasks } from '../services/tasksServices';
import { CreateTaskModal } from '../components/layouts/CreateTaskModal';
import { Button } from '../components/UI/Button';
import { useSelector } from 'react-redux';


export const List = () => {
  const user = useSelector((state) => state.auth.user);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const fetchTasks = async () => {
    try {
      const { data } = await getAllTasks(projectId);
      setTasks(data.tasks);
      console.log("tasksss", data.tasks)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(projectId, taskData);
      if (response.status === 200) {
        setIsModalCreateOpen(false);
        fetchTasks()
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center gap-3 text-indigo-600">
      <div className="animate-spin">
        <ArrowPathIcon className="w-6 h-6" />
      </div>
      <span className="font-medium">Loading tasks...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 flex items-center gap-3 text-rose-600">
      <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
      <span>Error loading tasks: {error}</span>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isCreator = user.id === selectedProject.creator.id
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-100/50 ring-1 ring-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Project Tasks</h2>
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

        <div className="overflow-x-auto relative">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50/50 to-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Task</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Assignee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${{
                        done: 'bg-emerald-500',
                        in_progress: 'bg-amber-500',
                        to_do: 'bg-blue-500'
                      }[task.status]
                        }`} />
                      <div>
                        <div className="font-medium text-slate-900">{task.title}</div>
                        <div className="text-sm text-slate-500 mt-1">{task.key || `TASK-${task.id}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {task.assignee[0]}
                        </div>
                        <div>
                          <div className="text-sm text-slate-900">{task.assignee}</div>
                          <div className="text-xs text-slate-400">{task.assigneejob}</div>
                        </div>
                      </div>
                    ) : (
                      <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                        <UserCircleIcon className="w-5 h-5" />
                        <span className="text-sm">Assign</span>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {task.status === 'done' && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                      {task.status === 'in_progress' && <ArrowPathIcon className="w-4 h-4 text-amber-500 animate-spin" />}
                      {task.status === 'to_do' && <DocumentTextIcon className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm text-slate-700 capitalize">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${task.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                      {task.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {task.due_date ? formatDate(task.due_date) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {formatDate(task.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {formatDate(task.updated_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tasks.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <RectangleStackIcon className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-500 mb-6">Get started by creating your first task</p>
              {isCreator && (
              <button 
                onClick={() => setIsModalCreateOpen(true)} 
               className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                Create Task
              </button>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateTaskModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreate={handleCreateTask}
        projectId={projectId}
      />

    </div>
  );
};