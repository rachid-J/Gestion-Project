import { useState, useRef} from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  FolderPlusIcon,
  ClipboardDocumentIcon,
  UserGroupIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { logOut } from '../../Redux/features/AuthSlice';

import { useNavigate } from 'react-router-dom';

export const Header = ({ user ,disp}) => {
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const createRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();


  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      disp(logOut());
      setIsLoading(false);
      navigate('/redirect');
    }, 1000);
  };

 


  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 
      flex items-center justify-between px-4 md:px-6 z-30 gap-2 md:gap-6">
      {/* Mobile Search Bar */}
      <div className={`md:hidden absolute top-16 left-0 right-0 bg-white p-4 shadow-lg ${isSearchVisible ? 'block' : 'hidden'}`} ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-full pl-10 pr-6 py-2 rounded-lg bg-gray-50 border border-gray-200
              focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/30
              placeholder:text-gray-400 text-gray-600 transition-all duration-300"
          />
          <XMarkIcon 
            className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" 
            onClick={() => setIsSearchVisible(false)}
          />
        </div>
      </div>

      {/* Left Section (Mobile Menu and Search) */}
      <div className="flex items-center ml-10 gap-2 md:hidden">
        <button
          className="p-2  hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSearchVisible(true)}
        >
          <MagnifyingGlassIcon className="h-6 w-6  text-gray-600" />
        </button>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1">
        <div className="relative w-full max-w-4xl">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full pl-12 pr-6 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200
              focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/30
              placeholder:text-gray-400 text-gray-600 transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-5 ml-auto">
        {/* Create New Button */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white
              px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all
              shadow-lg shadow-blue-500/20 hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden md:inline font-medium ml-2.5">Create New</span>
            <ChevronDownIcon className="hidden md:inline h-4 w-4 ml-1.5" />
          </button>

          {/* Create Dropdown */}
          {isCreateDropdownOpen && (
            <div className="absolute right-0 md:right-auto top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => { /* Add new project handler */ }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
                >
                  <FolderPlusIcon className="h-5 w-5 text-gray-600" />
                  <span>New Project</span>
                </button>
                <button
                  // onClick={onCreateNew}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
                >
                  <ClipboardDocumentIcon className="h-5 w-5 text-gray-600" />
                  <span>New Task</span>
                </button>
                <button
                  onClick={() => { /* Add new team handler */ }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
                >
                  <UserGroupIcon className="h-5 w-5 text-gray-600" />
                  <span>New Team</span>
                </button>
              </div>
              </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-100 rounded-lg md:rounded-xl relative transition-colors">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1.5 right-1 md:right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile Section */}
        <div 
          className="relative cursor-pointer"
          ref={profileRef}
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        >
          <div className="flex items-center gap-1 md:gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white 
              flex items-center justify-center font-medium shadow-sm transition-transform hover:scale-105">
              {user.name?.slice(0,2).toUpperCase()}
            </div>
            <span className="hidden md:inline text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              {user.name}
            </span>
            <ChevronDownIcon className="hidden md:inline h-4 w-4 text-gray-500 ml-1" />
          </div>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 md:left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
            <div className="p-2 space-y-1">
              <button
                onClick={() => { /* Add profile handler */ }}
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-600" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => { /* Add settings handler */ }}
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => { handleLogout()}}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors gap-2"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-600" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

