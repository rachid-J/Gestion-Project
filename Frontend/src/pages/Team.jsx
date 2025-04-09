import React, { useEffect, useState } from 'react';
import {
  UserCircleIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  SparklesIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { addProject, getAllProject } from '../services/projectServices';
import { ProjectInvite } from '../services/ProjectCollab';
import { CreateProjectModal } from '../components/layouts/CreateProjectModal';
import { ColaabInvite } from '../components/layouts/ColaabInvite';
import { Notification } from '../Components/layouts/Notification';

const AVATAR_COLORS = [
  '#4f46e5',
  '#0891b2',
  '#0e7490',
  '#7c3aed',
  '#0369a1'
];

const ROLE_CONFIG = {
  owner: {
    style: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    icon: ShieldCheckIcon
  },
  admin: {
    style: 'bg-purple-50 text-purple-700 border border-purple-100',
    icon: null
  },
  member: {
    style: 'bg-blue-50 text-blue-700 border border-blue-100',
    icon: null
  },
  guest: {
    style: 'bg-gray-50 text-gray-700 border border-gray-100',
    icon: null
  }
};

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.member;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.style}`}>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const UserAvatar = ({ name, color }) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
    style={{ backgroundColor: color }}
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

const UserCard = ({ user, role }) => {
  const color = AVATAR_COLORS[Math.abs(user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % AVATAR_COLORS.length];
  
  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
      <UserAvatar name={user.name} color={color} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      <RoleBadge role={role} />
    </div>
  );
};

const ProjectSection = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInvite = async (e) => {
    e.stopPropagation();
    setIsInviting(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">Created {formatDate(project.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleInvite}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <UserPlusIcon className="h-5 w-5" />
          </button>
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Project Owner</h4>
            <UserCard user={project.owner} role="owner" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">Team Members</h4>
              <span className="text-xs text-gray-500">{project.members.length} members</span>
            </div>
            <div className="space-y-2">
              {project.members.map((member) => (
                <UserCard key={member.id} user={member.user} role={member.role} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isInviting && (
        <ColaabInvite
          projectId={project.id}
          onClose={() => setIsInviting(false)}
        />
      )}
    </div>
  );
};

export const Team = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProject();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await addProject(projectData);
      await fetchProjects();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
        <p className="text-lg text-gray-900">{error}</p>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your projects and team members
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectSection key={project.id} project={project} />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};