import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  ListBulletIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getAllTasks } from '../services/tasksServices';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';


const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
};

export const Summary = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await getAllTasks(projectId);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <span className="font-medium">Loading dashboard...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 flex items-center gap-3 text-rose-600">
      <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
      <span>Error loading data: {error}</span>
    </div>
  );

  const stats = {
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t =>
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length,
  };

  const priorityStats = {
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
    medium: tasks.filter(t => t.priority === 'medium' && t.status !== 'done').length,
    low: tasks.filter(t => t.priority === 'low' && t.status !== 'done').length,
  };

  const statusDistribution = {
    todo: tasks.filter(t => t.status === 'to_do').length,
    in_progress: stats.inProgress,
    done: stats.completed,
  };

  const assigneeStats = tasks.reduce((acc, task) => {
    if (task.assignee) {
      if (!acc[task.assignee]) {
        acc[task.assignee] = {
          count: 1,
          job: task.assigneejob
        };
      } else {
        acc[task.assignee].count++;
      }
    }
    return acc;
  }, {});

  const recentActivity = tasks
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3)
    .map(task => ({
      id: task.id,
      task: task.title,
      status: task.status,
      date: formatRelativeTime(task.updated_at),
      user: task.assignee || task.creator.name,
      comment: "Updated task status"
    }));

  const pieData = [
    { name: 'Done', value: statusDistribution.done, color: '#10b981' },
    { name: 'In Progress', value: statusDistribution.in_progress, color: '#f59e0b' },
    { name: 'To Do', value: statusDistribution.todo, color: '#3b82f6' },
  ];


 return (
    <div className="p-6 min-h-screen bg-gray-50/95">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-pro">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Project Performance Dashboard</h1>
            <p className="text-gray-300/90 mt-1 text-sm">
              Comprehensive overview of {tasks.length} tasks • Updated {formatRelativeTime(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Tasks', value: stats.totalTasks, icon: ClipboardDocumentIcon, color: 'bg-indigo-500' },
            { label: 'Completed', value: stats.completed, icon: CheckCircleIcon, color: 'bg-emerald-500' },
            { label: 'In Progress', value: stats.inProgress, icon: ArrowPathIcon, color: 'bg-amber-500' },
            { label: 'Overdue', value: stats.overdue, icon: ExclamationTriangleIcon, color: 'bg-rose-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 hover:border-gray-200 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2.5 rounded-lg text-white shadow-sm`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-full">
  <div 
    className={`h-full ${stat.color} bg-opacity-75 transition-all duration-500`}
    style={{ width: `${(stat.value / stats.totalTasks) * 100}%` }}
  />
</div>

              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Workflow Status */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Workflow Distribution</h3>
              <div className="space-y-3">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2.5 hover:bg-gray-50/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${status === 'done' ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                      <span className="text-sm text-gray-700 font-medium capitalize">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        ({Math.round((count / stats.totalTasks) * 100 || 0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Allocation */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Team Allocation</h3>
              <div className="space-y-3">
                {Object.entries(assigneeStats).map(([assignee, { count, job }]) => (
                  <div key={assignee} className="flex items-center justify-between p-2.5 hover:bg-gray-50/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100/80 rounded-full flex items-center justify-center shadow-xs">
                        <span className="text-sm font-medium text-indigo-600 uppercase">
                          {assignee[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignee}</p>
                        <p className="text-xs text-gray-500 font-medium">{job}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {count} {count === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Matrix */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Priority Matrix</h3>
              <div className="space-y-3">
                {Object.entries(priorityStats).map(([priority, count]) => (
                  <div key={priority} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                      <span className="text-xs font-medium text-gray-500">{count} tasks</span>
                    </div>
                    <div className="relative pt-1.5">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${priority === 'high' ? 'bg-rose-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} transition-all duration-500`}
                          style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Activity</h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 bg-indigo-100/50 rounded-lg">
                        {activity.status === 'done' ? (
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                        ) : activity.status === 'in_progress' ? (
                          <ArrowPathIcon className="w-4 h-4 text-amber-500" />
                        ) : (
                          <DocumentTextIcon className="w-4 h-4 text-indigo-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-0.5">
                              {activity.user} updated task
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {activity.task}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                            {activity.date}
                          </span>
                        </div>
                        {activity.comment && (
                          <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 font-medium">
                            "{activity.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Task Status Breakdown
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <span>Total Tasks</span>
                  <span className="text-gray-900">{stats.totalTasks}</span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full max-w-[240px] relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xl font-semibold text-gray-900"
                      >
                        {stats.totalTasks}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-3 w-full">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50/50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.value}
                        </span>
                        <span className="text-xs font-medium text-gray-400">
                          ({((entry.value / stats.totalTasks) * 100 || 0).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};