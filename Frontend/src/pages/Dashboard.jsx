import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTasks } from '../services/tasksServices';
import { getAllProject } from '../services/projectServices';
import { ProjectAccept, ProjectDecline, ProjectReceived } from '../services/ProjectCollab';
import {
    ArrowPathIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ClipboardDocumentIcon,
    EnvelopeIcon,
    FolderIcon,
    UserGroupIcon,
    CalendarIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Notification } from '../Components/layouts/Notification';
import { setselectedProject } from '../Redux/features/projectSlice';
import { useDispatch } from 'react-redux';


const COLORS = ['#3b82f6', '#f97316', '#10b981'];
const PRIORITY_COLORS = {
    low: '#0ea5e9',
    medium: '#f59e0b',
    high: '#ef4444'
};

export const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: [],
        tasks: [],
        invitations: [],
        loading: true
    });
    const [notification, setNotification] = useState(null);
    const disp = useDispatch()
    const fetchData = async () => {
        try {
            const [projectsRes, invitationsRes] = await Promise.all([
                getAllProject(),
                ProjectReceived()
            ]);

            const tasksPromises = projectsRes.data.projects.map(project =>
                getTasks(1, project.id)
            );
            const tasksResults = await Promise.all(tasksPromises);

            setStats({
                projects: projectsRes.data.projects,
                tasks: tasksResults.flatMap(res => res.data.tasks.data),
                invitations: invitationsRes.data,
                loading: false
            });
        } catch (error) {
            // Use more professional error handling
            console.error('Dashboard data loading error:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInvitationResponse = async (token, accept = true) => {
        try {
            if (accept) {
                await ProjectAccept(token);
                setNotification({ type: "success", message: 'Invitation accepted successfully' });
            } else {
                await ProjectDecline(token);

                setNotification({ type: "error", message: 'Invitation declined' });
            }
            fetchData();
        } catch (error) {
            console.error('Invitation action failed:', error);
            alert('Action failed. Please try again.');
        }
    };

    // Data processing for charts
    const projectStatusData = [
        { name: 'Pending', value: stats.projects.filter(p => p.status === 'pending').length },
        { name: 'In Progress', value: stats.projects.filter(p => p.status === 'in_progress').length },
        { name: 'Completed', value: stats.projects.filter(p => p.status === 'completed').length }
    ];

    const taskPriorityData = [
        { name: 'Low', value: stats.tasks.filter(t => t.priority === 'low').length },
        { name: 'Medium', value: stats.tasks.filter(t => t.priority === 'medium').length },
        { name: 'High', value: stats.tasks.filter(t => t.priority === 'high').length }
    ];

    // Format date helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (stats.loading) {
        return (
            <div className="p-8 flex mt-12 items-center justify-center gap-3 text-indigo-600">
                <div className="animate-spin">
                    <ArrowPathIcon className="w-6 h-6" />
                </div>
                <span className="font-medium">Loading dashboard...</span>
            </div>
        );
    }

    const completedProjects = stats.projects.filter(p => p.status === 'completed').length;
    const completionRate = stats.projects.length > 0
        ? Math.round((completedProjects / stats.projects.length) * 100)
        : 0;

    const highPriorityTasks = stats.tasks.filter(t => t.priority === 'high').length;

    return (
        <div className="bg-gray-50 mt-12 min-h-screen">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    className="fixed top-4 right-4 z-50"
                />
            )}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Overview of your projects, tasks and collaborations
                        </p>
                    </div>


                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Projects</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.projects.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <ClipboardDocumentIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Completion Rate</span>
                                    <span className="font-medium">{completionRate}%</span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full"
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active Tasks</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tasks.length}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <CheckCircleIcon className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>High Priority</span>
                                    <span className="font-medium">{highPriorityTasks} tasks</span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-red-500 h-1.5 rounded-full"
                                        style={{ width: stats.tasks.length ? `${(highPriorityTasks / stats.tasks.length) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Collaborators</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.projects.flatMap(p => p.users).length}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <UserGroupIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className="text-xs text-gray-500">Across {stats.projects.length} projects</span>
                                <Link to="/teams" className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                    View Team
                                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Invites</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.invitations.length}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <EnvelopeIcon className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs">
                                {stats.invitations.length > 0 ? (
                                    <span className="text-amber-600 font-medium">
                                        Action needed
                                    </span>
                                ) : (
                                    <span className="text-gray-500">
                                        No pending invitations
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Project Status Distribution</h3>
                                <div className="flex gap-4">
                                    {projectStatusData.map((entry, i) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-sm text-gray-600">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {projectStatusData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i]} strokeWidth={1} stroke="#ffffff" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ payload }) => (
                                                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                                                    <p className="font-medium">{payload?.[0]?.name}</p>
                                                    <p className="text-sm">{payload?.[0]?.value} projects</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {payload?.[0]?.value > 0 && stats.projects.length > 0
                                                            ? `${((payload?.[0]?.value / stats.projects.length) * 100).toFixed(1)}% of total`
                                                            : '0% of total'
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Task Priority Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskPriorityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        domain={[0, (dataMax) => Math.max(5, Math.ceil(dataMax * 1.2))]}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        content={({ payload }) => (
                                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                                                <p className="font-medium">{payload?.[0]?.payload.name} Priority</p>
                                                <p className="text-sm">{payload?.[0]?.value} tasks</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {payload?.[0]?.value > 0 && stats.tasks.length > 0
                                                        ? `${((payload?.[0]?.value / stats.tasks.length) * 100).toFixed(1)}% of total`
                                                        : '0% of total'
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[6, 6, 0, 0]}
                                        barSize={36}
                                    >
                                        {taskPriorityData.map((entry, i) => (
                                            <Cell
                                                key={i}
                                                fill={PRIORITY_COLORS[entry.name.toLowerCase()]}
                                                className="hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-2">
                            {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                                <div key={priority} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-sm text-gray-600 capitalize">{priority}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                            <Link
                                to="/projects"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View All Projects
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {stats.projects.slice(0, 5).map(project => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}/board`}
                                    className="flex items-center justify-between p-5 hover:bg-blue-50/50 transition-colors rounded-lg"
                                    onClick={() => disp(setselectedProject(project))}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <FolderIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(project.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-amber-100 text-amber-800'
                                        }`}>
                                        {project.status === 'in_progress' ? 'In Progress' :
                                            project.status === 'completed' ? 'Completed' : 'Pending'}
                                    </span>
                                </Link>
                            ))}
                            {stats.projects.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No projects found</p>
                                    <Link to="/projects/new" className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Create your first project
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Collaboration Invitations</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {stats.invitations.map(invite => (
                                <div
                                    key={invite.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="mb-4 sm:mb-0">
                                        <div className="flex items-center">
                                            <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                                                <FolderIcon className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900">{invite.project.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 ml-9">
                                            <UserGroupIcon className="w-3.5 h-3.5 text-gray-400" />
                                            <p className="text-xs text-gray-500">
                                                Invitation from <span className="font-medium">{invite.sender.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-9 sm:ml-0">
                                        <button
                                            onClick={() => handleInvitationResponse(invite.token)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <CheckIcon className="w-4 h-4" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleInvitationResponse(invite.token, false)}
                                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <XMarkIcon className="w-4 h-4" /> Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {stats.invitations.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <EnvelopeIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No pending invitations</p>
                                    <p className="text-sm mt-1">You'll see collaboration requests here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};