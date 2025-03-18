import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDownIcon,
  FolderIcon,
  PlusCircleIcon,
  UserPlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  UserPlusIcon as UserPlusSolid,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import InviteModal from './InviteModal';
import { ContactInvite } from '../../services/ContactService';
import { logOut } from '../../Redux/features/authSlice';
import { useDispatch } from 'react-redux';
import { CreateProjectModal } from './CreateProjectModal';
import { AcceptInvite, GetNotification, markRead } from '../../services/NotificationService';
import { Logout } from '../../services/authServices';

export const Header = ({ user }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const teamsRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const disp = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await GetNotification();
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    fetchNotifications();
    return () => clearInterval(interval);
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    const response = await Logout()
    disp(logOut());
    navigate('/redirect');
  };

  const handleMarkAsRead = async (ids, types) => {
    try {
      await markRead(ids, types);
      setNotifications(prev => 
        prev.map(n => 
          ids.includes(n.id) ? { ...n, read: true } : n
        )
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
        onCreate={(projectData) => {
          // Handle project creation here
          console.log("Creating project:", projectData);
        }}
      />
      <header className="fixed top-0 right-0 left-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-50 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ProjectHub
          </h1>
          
          {/* Projects Dropdown */}
          <div className="relative" ref={projectsRef}>
            <button
              onClick={() => handleDropdownToggle('projects')}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
            >
              Projects
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>

            {activeDropdown === 'projects' && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => navigate('/projects')}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <FolderIcon className="h-4 w-4" />
                    All Projects
                  </button>
                  <button 
                    onClick={() => setIsModalCreateOpen(true)}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                    New Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Teams Dropdown */}
          <div className="relative" ref={teamsRef}>
            <button
              onClick={() => handleDropdownToggle('teams')}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
            >
              Network
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>

            {activeDropdown === 'teams' && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => navigate("/contact")}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    My Contacts
                  </button>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    Invite People
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => handleDropdownToggle('notifications')}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <BellIcon className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {activeDropdown === 'notifications' && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={`${notification.type}-${notification.id}`}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id, notification.type)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 pt-1">
                            {notification.type === 'project' ? (
                              <FolderIcon className="h-5 w-5 text-purple-600" />
                            ) : notification.type === 'contact' ? (
                              <UserPlusSolid className="h-5 w-5 text-blue-600" />
                            ) : (
                              <XMarkIcon className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {notification.type === 'declined' ? 
                                `Invitation declined: ${notification.details}` : 
                                notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">{notification.timestamp}</p>
                              {!notification.read && notification.type !== 'declined' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptInvitation(notification.token, notification.type);
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                >
                                  Accept
                                </button>
                              )}
                              {notification.type === 'declined' && (
                                <span className="text-red-600 text-xs font-medium">Declined</span>
                              )}
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

          {/* Profile Dropdown */}
          <div className="relative cursor-pointer" ref={profileRef}>
            <div 
              className="flex items-center gap-2"
              onClick={() => handleDropdownToggle('profile')}
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-medium shadow-sm">
                {user.name?.slice(0,2).toUpperCase()}
              </div>
            </div>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <UserCircleIcon className="h-4 w-4" />
                    Profile
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Status Messages */}
      {(error || success) && (
        <div className="fixed top-16 right-4 z-50">
          {error && (
            <div className="p-4 mb-2 bg-red-50/90 backdrop-blur-sm rounded-xl border border-red-100 flex items-center gap-3 text-red-700 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50/90 backdrop-blur-sm rounded-xl border border-green-100 flex items-center gap-3 text-green-700 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {success}
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