import { useState, useEffect, useRef } from 'react';
import {
  ChevronDownIcon,
  FolderIcon,
  PlusCircleIcon,
  UserPlusIcon,
  UserGroupIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  UserPlusIcon as UserPlusSolid,
  XMarkIcon,
  PencilIcon,
  ChatBubbleOvalLeftIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import InviteModal from './InviteModal';
import { ContactInvite } from '../../services/ContactService';
import { logOut } from '../../Redux/features/authSlice';
import { useDispatch } from 'react-redux';
import { CreateProjectModal } from './CreateProjectModal';
import { AcceptInvite, GetNotification, markRead } from '../../services/NotificationService';
import { Logout } from '../../services/authServices';
import { ProjectDecline } from '../../services/ProjectCollab';

const getInitials = (name) => {
  return name?.split(' ').map(word => word[0]).join('');
};

export const Header = ({ user }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const projectsRef = useRef(null);
  const teamsRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const disp = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
console.log(notifications)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await GetNotification();
        
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    const interval = setInterval(fetchNotifications, 30000);
    fetchNotifications();
    return () => clearInterval(interval);
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    const response = await Logout();
    if (response.status === 200) {
      disp(logOut());
      navigate('/redirect');
    }
  };

  const handleMarkAsRead = async (ids, types) => {
    try {
      await markRead(ids, types);
      setNotifications(prev =>
        prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAsRead = (id, type) => {
    handleMarkAsRead([id], [type]);
  };

  const markAllAsRead = () => {
    const unread = notifications.filter(n => !n.read);
    handleMarkAsRead(
      unread.map(n => n.id),
      unread.map(n => n.type)
    );
  };

  const handleAcceptInvitation = async (token, type) => {
    try {
      await AcceptInvite(token, type);
      setNotifications(prev => prev.filter(n => n.token !== token));
      setSuccess(`${type === 'project' ? 'Project' : 'Contact'} invitation accepted!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept invitation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeclineInvitation = async (token, type) => {
    try {
      await ProjectDecline(token, type);
      setNotifications(prev => prev.filter(n => n.token !== token));
      setSuccess(`${type === 'project' ? 'Project' : 'Contact'} invitation declined`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to decline invitation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleInvite = async (email) => {
    try {
      await ContactInvite(email);
      setSuccess('Contact invitation sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send invitation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <CreateProjectModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreate={(projectData) => console.log("Creating project:", projectData)}
      />
      
      <header className="fixed top-0 right-0 left-0 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 md:px-6 z-50 gap-4 shadow-sm shadow-gray-100/50">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent tracking-tight">
            ProjectHub
          </h1>

          {/* Projects Dropdown */}
          <div className="relative" ref={projectsRef}>
            <button
              onClick={() => handleDropdownToggle('projects')}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-all hover:bg-gray-100/50 group"
            >
              Projects
              <ChevronDownIcon className="h-4 w-4 ml-1 transition-transform group-hover:-rotate-180" />
            </button>

            {activeDropdown === 'projects' && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 animate-fade-in">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => navigate('/projects')}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FolderIcon className="h-5 w-5 text-gray-500" />
                    All Projects
                  </button>
                  <button
                    onClick={() => setIsModalCreateOpen(true)}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <PlusCircleIcon className="h-5 w-5 text-gray-500" />
                    New Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Network Dropdown */}
          <div className="relative" ref={teamsRef}>
            <button
              onClick={() => handleDropdownToggle('teams')}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-all hover:bg-gray-100/50 group"
            >
              Network
              <ChevronDownIcon className="h-4 w-4 ml-1 transition-transform group-hover:-rotate-180" />
            </button>

            {activeDropdown === 'teams' && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 animate-fade-in">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => navigate("/contact")}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <UserGroupIcon className="h-5 w-5 text-gray-500" />
                    My Contacts
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <UserPlusIcon className="h-5 w-5 text-gray-500" />
                    Invite People
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => handleDropdownToggle('notifications')}
              className="p-2 hover:bg-gray-100/50 rounded-full relative transition-colors group"
            >
              <BellIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-900" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {activeDropdown === 'notifications' && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 animate-fade-in">
                <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <EnvelopeIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={`${notification.type}-${notification.id}`}
                        className={`p-4 border-b border-gray-100/50 hover:bg-gray-50/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id, notification.type)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 pt-1">
                            {/* Add task-related icons */}
                            {notification.type === 'task_updated' && (
                              <PencilIcon className="h-5 w-5 text-blue-500" />
                            )} {notification.type === 'task_created' && (
                              <PlusCircleIcon className="h-5 w-5 text-green-500" />
                            )}
                            {notification.type === 'task_assigned' && (
                              <UserPlusIcon className="h-5 w-5 text-blue-500" />
                            )}
                            {notification.type === 'task_completed' && (
                              <DocumentCheckIcon className="h-5 w-5 text-purple-500" />
                            )}
                            {notification.type === 'comment_added' && (
                              <ChatBubbleOvalLeftIcon className="h-5 w-5 text-green-500" />
                            )}
                            {notification.type === 'attachment_added' && (
                              <PaperClipIcon className="h-5 w-5 text-purple-500" />
                            )}
                            {/* Keep existing icons */}
                            {notification.type === 'project_deleted' && (
                              <XMarkIcon className="h-5 w-5 text-red-500" />
                            )}
                            {notification.type === 'project_updated' && (
                              <PencilIcon className="h-5 w-5 text-blue-500" />
                            )}
                            {notification.type === 'contact' && (
                              <UserPlusSolid className="h-5 w-5 text-blue-500" />
                            )}
                            {notification.type === 'project' && (
                              <FolderIcon className="h-5 w-5 text-purple-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 leading-snug">
                              {notification.message}
                              {/* Add task-related metadata */}
                              {(notification.type === 'task_updated' || 
                                notification.type === 'comment_added' ||
                                notification.type === 'attachment_added') && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/projects/${notification.data.meta.project_id}/board`);
                                  }}
                                  className="block text-xs text-blue-600 hover:text-blue-700 mt-1"
                                >
                                  View Task
                                </button>
                              )}
                              {/* Existing metadata */}
                              {notification.data?.project && (
                                <span className="block text-xs text-gray-500 mt-1">
                                  {notification.type === 'project_deleted' && 
                                    `Deleted by: ${notification.data.project.deleted_by}`}
                                  {notification.type === 'project_updated' && 
                                    `Updated by: ${notification.data.project.updated_by}`}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                {notification.timestamp}
                              </p>
                              <div className="flex gap-2">
                               
                                {['project', 'contact'].includes(notification.type) && (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAcceptInvitation(notification.token, notification.type);
                                      }}
                                      className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 text-xs flex items-center gap-1.5 transition-colors"
                                    >
                                      <CheckCircleIcon className="h-3.5 w-3.5" />
                                      Accept
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeclineInvitation(notification.token, notification.type);
                                      }}
                                      className="px-2.5 py-1 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 text-xs flex items-center gap-1.5 transition-colors"
                                    >
                                      <XMarkIcon className="h-3.5 w-3.5" />
                                      Decline
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative cursor-pointer" ref={profileRef}>
            <div
              className="flex items-center gap-2 group"
              onClick={() => handleDropdownToggle('profile')}
            >
              {user?.users_info?.profile_photo ? (
                <img
                  src={`${import.meta.env.VITE_STORAGE_URL}/${user?.users_info?.profile_photo}`}
                  alt={`${user.name}'s profile`}
                  className="h-10 w-10 rounded-full object-cover shadow-sm border-2 border-white hover:border-gray-200 transition-all"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 text-white flex items-center justify-center font-medium shadow-sm group-hover:scale-105 transition-transform">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 animate-fade-in">
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2.5 flex items-center gap-3">
                    {user?.users_info?.profile_photo ? (
                      <img
                        src={`${import.meta.env.VITE_STORAGE_URL}/${user?.users_info?.profile_photo}`}
                        className="h-9 w-9 rounded-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 text-white flex items-center justify-center">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <UserCircleIcon className="h-5 w-5 text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notifications */}
      {(error || success) && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {error && (
            <div className="p-4 pr-8 bg-red-50/90 backdrop-blur-sm rounded-xl border border-red-200 flex items-center gap-3 text-red-700 animate-slide-in">
              <XMarkIcon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError('')} className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          {success && (
            <div className="p-4 pr-8 bg-green-50/90 backdrop-blur-sm rounded-xl border border-green-200 flex items-center gap-3 text-green-700 animate-slide-in">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
              <button onClick={() => setSuccess('')} className="absolute top-2 right-2 p-1 hover:bg-green-100 rounded-full">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <InviteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleInvite={handleInvite}
      />
    </>
  );
};