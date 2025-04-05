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

// Professional color palette for user avatars
const AVATAR_COLORS = [
  '#4f46e5', // Indigo
  '#0891b2', // Cyan
  '#0e7490', // Teal
  '#7c3aed', // Violet
  '#0369a1'  // Blue
];

// Role configuration with consistent styling
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

/**
 * Role badge component for displaying user roles
 */
const RoleBadge = ({ role }) => {
  const roleInfo = ROLE_CONFIG[role.toLowerCase()] || ROLE_CONFIG.member;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${roleInfo.style}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

/**
 * User avatar component with consistent styling
 */
const UserAvatar = ({ name, color }) => (
  <div
    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm"
    style={{ backgroundColor: color }}
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

/**
 * User card component for displaying team members
 */
const UserCard = ({ user, role }) => {
  // Generate consistent color based on email
  const hashCode = str => str.split('').reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
  const colorIndex = Math.abs(hashCode(user.email)) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center space-x-3">
        <UserAvatar name={user.name} color={color} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{user.name}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
        </div>
        <RoleBadge role={role} />
      </div>
    </div>
  );
};

/**
 * Status message component for user feedback
 */


/**
 * Project section component for each team project
 */
const ProjectSection = ({ project }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const collaborators = project.users.filter(user => user.id !== project.creator.id);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await ProjectInvite(project.id, email);
      setSuccess('Invitation sent successfully!');
      setEmail('');
      setTimeout(() => setShowInviteModal(false), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send invitation');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Project Header */}
      <div
        className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 rounded-t-xl transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Created {formatDate(project.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            {collaborators.length + 1} members
          </span>
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Project Details (collapsible) */}
      {isOpen && (
        <div className="p-5 pt-2 space-y-5 border-t border-gray-100">
          {/* Project Owner Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project Owner</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{project.creator.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{project.creator.email}</p>
                </div>
                <RoleBadge role="owner" />
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Members</h3>
              <span className="text-xs text-gray-500">{collaborators.length} members</span>
            </div>

            {collaborators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {collaborators.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    role={user.pivot?.role || 'member'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-6 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                <div className="text-gray-500 text-sm mb-2">No team members yet</div>
                <p className="text-xs text-gray-500 mb-4">Build your team by inviting collaborators</p>
              </div>
            )}

            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center p-2.5 border border-dashed border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              {collaborators.length > 0 ? 'Invite More Members' : 'Add Team Members'}
            </button>
          </div>
        </div>
      )}


      <ColaabInvite
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={handleInvite}
        email={email}
        setEmail={setEmail}
        error={error}
        success={success}
      />
    </div>
  );
};


export const Team = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await getAllProject();
      setProjects(response.data.projects);
    } catch (err) {
      setError('Failed to load team structure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      await addProject(projectData);
      await fetchProjects();
      setStatusMessage({ type: 'success', message: 'Project created successfully!' });
      setTimeout(() => setStatusMessage({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to create project' 
      });
    }
    setShowCreateModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex items-center mt-12 justify-center gap-3 text-indigo-600">
        <div className="animate-spin">
          <ArrowPathIcon className="w-6 h-6" />
        </div>
        <span className="font-medium">Loading Teams...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm p-8 bg-white rounded-xl shadow-sm">
          <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIcon className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Teams</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => { setError(''); fetchProjects(); }}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12">
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  rounded-xl pt-6 ml-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your organization's collaborative projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center transition-colors duration-200"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Create New Project
          </button>
        </div>

        {/* Status Messages */}
        {statusMessage.message && (
          <Notification type={statusMessage.type} message={statusMessage.message} />
        )}

        {/* Projects List */}
        <div className="space-y-5">
          {projects.map((project) => (
            <ProjectSection key={project.id} project={project} />
          ))}

          {projects.length === 0 && (
            <div className="text-center p-10 rounded-xl border-2 border-dashed border-gray-300 bg-white">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                <UserGroupIcon className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Get started by creating your first collaborative project and invite team members
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center mx-auto transition-colors"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Create Your First Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};