// components/Sidebar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FolderIcon,
  XMarkIcon,
  Bars3Icon,
  ClipboardDocumentIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { ListBulletIcon, UserGroupIcon } from '@heroicons/react/24/solid';

export const Sidebar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Summary', path: 'Summary', icon: ChartPieIcon },
    { name: 'Board', path: 'board', icon: ClipboardDocumentIcon },
    { name: 'List', path: 'List', icon: ListBulletIcon },
    { name: 'Collaboration', path: 'Collaboration', icon: UserGroupIcon },
    { name: 'Settings', path: 'settings', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className={`md:hidden p-3 fixed top-4 left-4 z-50 ${
          isMobileMenuOpen ? 'hidden' : 'visible'
        } bg-white backdrop-blur-sm rounded-lg shadow-lg shadow-gray-200/50 hover:shadow-gray-300/50 transition-all hover:scale-105`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-800" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white/90 backdrop-blur-xl shadow-xl transition-transform duration-300 border-r border-gray-100/50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>

          {/* Logo/Branding Area */}
          <div className="p-6 pb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              ProjectFlow
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-600 transition-all
                  hover:bg-gray-50/80 group relative overflow-hidden
                  ${isActive ? 'bg-blue-50/60 text-blue-600 font-medium' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active State Indicator */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full" />
                    )}
                    
                    <item.icon
                      className={`h-6 w-6 mr-3 ${
                        isActive ? 'text-blue-500' : 'text-gray-400'
                      } group-hover:text-blue-500 transition-colors`}
                    />
                    <span className="flex-1">{item.name}</span>
                    
                    {/* Subtle Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-100/50 p-4 mt-auto">
            <div className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-400 flex items-center justify-center text-white font-medium shadow-md">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <Cog6ToothIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};