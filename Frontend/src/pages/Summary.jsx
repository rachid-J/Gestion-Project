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
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

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

  // Statistics calculations
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
      acc[task.assignee] = (acc[task.assignee] || 0) + 1;
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
      <div className="p-6 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8 p-6 bg-slate-900 rounded-2xl shadow-xl">
            <div>
              <h1 className="text-2xl font-bold text-white">Project Overview</h1>
              <p className="text-slate-300 mt-2">
                {tasks.length} tasks • Last updated: {formatDate(new Date().toISOString())}
              </p>
            </div>
           
          </div>
  
          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            {[
              { 
                label: 'Total Tasks', 
                value: stats.totalTasks,
                icon: ClipboardDocumentIcon,
                color: 'bg-indigo-500'
              },
              { 
                label: 'Completed', 
                value: stats.completed,
                icon: CheckCircleIcon,
                color: 'bg-emerald-500'
              },
              { 
                label: 'In Progress', 
                value: stats.inProgress,
                icon: ArrowPathIcon,
                color: 'bg-amber-500'
              },
              { 
                label: 'Overdue', 
                value: stats.overdue,
                icon: ExclamationTriangleIcon,
                color: 'bg-rose-500'
              },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Modern Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Status Distribution Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-5">Workflow Status</h3>
                <div className="space-y-4">
                  {Object.entries(statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between group hover:bg-slate-50/50 p-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          status === 'done' ? 'bg-emerald-500' :
                          status === 'in_progress' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`} />
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-900">{count}</span>
                        <span className="text-sm text-slate-400">
                          {Math.round((count / stats.totalTasks) * 100 || 0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Team Workload Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-5">Team Workload</h3>
                <div className="space-y-4">
                  {Object.entries(assigneeStats).map(([assignee, count]) => (
                    <div key={assignee} className="flex items-center justify-between group hover:bg-slate-50/50 p-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {assignee[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{assignee}</p>
                          <p className="text-xs text-slate-500">Developer</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {count} {count === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                {/* Priority Distribution Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Priority Distribution</h3>
                  <div className="space-y-5">
                    {Object.entries(priorityStats).map(([priority, count]) => (
                      <div key={priority} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {priority}
                          </span>
                          <span className="text-sm text-slate-500">{count} tasks</span>
                        </div>
                        <div className="relative pt-2">
                          <div className="flex mb-2 items-center justify-between">
                            <div className="flex-1">
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-2 rounded-full ${
                                    priority === 'high' ? 'bg-rose-500' :
                                    priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
  
                {/* Upcoming Deadlines Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Upcoming Deadlines</h3>
                  <div className="space-y-4">
                    {tasks
                      .filter(t => t.due_date && new Date(t.due_date) > new Date())
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                      .slice(0, 3)
                      .map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 hover:bg-slate-50/50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                              <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{task.title}</p>
                              <p className="text-xs text-slate-500">
                                {task.assignee || 'Unassigned'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-800">
                              {formatDate(task.due_date)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatRelativeTime(task.due_date)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Activity Feed Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                  
                </div>
                <div className="space-y-5">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/50 rounded-lg transition-colors">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        {activity.status === 'done' ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : activity.status === 'in_progress' ? (
                          <ArrowPathIcon className="w-5 h-5" />
                        ) : (
                          <DocumentTextIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-slate-900 mb-1">
                              {activity.user} updated {activity.task}
                            </p>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                              <span className="capitalize">{activity.status.replace('_', ' ')}</span>
                              <span className="text-slate-300">•</span>
                              <span>{activity.date}</span>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600">
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                          </button>
                        </div>
                        {activity.comment && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                            {activity.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
               <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-shadow">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
      <ChartBarIcon className="w-5 h-5 text-indigo-500" />
      Task Status Breakdown
    </h3>
  </div>

  {/* Chart Container */}
  <div className="h-48 relative mx-auto w-full max-w-[400px]"> {/* Added max-width and centered */}
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={55}  // Reduced from 75
          outerRadius={75} // Reduced from 95
          paddingAngle={2}
          dataKey="value"
          animationDuration={400}
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="white"
              strokeWidth={2} // Reduced from 4
            />
          ))}
        </Pie>
        
        {/* Center Label */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-semibold text-slate-900" // Reduced text size
        >
          {stats.totalTasks}
        </text>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Enhanced Legend */}
  <div className="grid grid-cols-3 gap-4 mt-6">
    {pieData.map((entry, index) => (
      <div 
        key={index}
        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
      >
        <div 
          className="w-3 h-3 rounded-full shadow-sm" // Smaller indicator
          style={{ backgroundColor: entry.color }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">{entry.name}</span>
            <span className="text-sm font-semibold text-slate-900">
              {((entry.value / stats.totalTasks) * 100 || 0).toFixed(0)}%
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {entry.value} tasks
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  
              {/* Data Visualization Row */}
             
            </div>
          </div>
        </div>
  
       
 
      </div>
    );
  };