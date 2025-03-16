import { useState, useRef } from 'react';
import { 
  ChevronDownIcon,
  FolderIcon,
  PlusCircleIcon,
  UserPlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { logOut } from '../../Redux/features/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon, BellIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export const Header = ({ user, disp }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const teamsRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  
  const navigate = useNavigate();

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New project assigned to you', read: false, timestamp: '2h ago' },
    { id: 2, message: 'Task deadline approaching', read: true, timestamp: '1d ago' },
    { id: 3, message: 'Team member mentioned you', read: false, timestamp: '4h ago' },
  ]);

  const handleLogout = () => {
    disp(logOut());
    navigate('/auth');
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-50 gap-4">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProjectHub
            </h1>
          
          </div>
        {/* Your Work Dropdown */}
        <div className="relative" ref={workRef}>
          <button
            onClick={() => handleDropdownToggle('work')}
            className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
          >
            Your Work
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </button>

          {activeDropdown === 'work' && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
              <div className="p-2 space-y-1">
                <button className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md">
                  Recent Activity
                </button>
                <button className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md">
                  My Tasks
                </button>
              </div>
            </div>
          )}
        </div>

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
                  View All Projects
                </button>
                <button 
                  onClick={() => navigate('/projects/new')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Create Project
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
            Teams
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </button>

          {activeDropdown === 'teams' && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => navigate('/teams/invite')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Invite People
                </button>
                <button 
                  onClick={() => navigate('/teams/new')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <UserGroupIcon className="h-4 w-4" />
                  Create Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Button */}
        <button
          className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          <ChartBarIcon className="h-5 w-5 mr-1" />
          Dashboard
        </button>
      </div>

      {/* Right Section - Profile */}
    
      <div className="flex items-center gap-4 "></div>
        {/* Notifications Dropdown */}
       
        
      <div className="flex items-center gap-4 ml-auto">
      <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => handleDropdownToggle('notifications')}
            className="p-2 hover:bg-gray-100 rounded-full relative"
          >
            <BellIcon className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100">
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
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {notification.read ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
        </div>
        <div 
          className="relative cursor-pointer"
          ref={profileRef}
          onClick={() => handleDropdownToggle('profile')}
        >
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white 
              flex items-center justify-center font-medium shadow-sm">
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
  );
};