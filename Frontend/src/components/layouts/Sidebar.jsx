// components/Sidebar.tsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Summary', path: 'Summary', icon: ChartPieIcon },
    { name: 'board', path: 'board', icon: ClipboardDocumentIcon },
    { name: 'Tasks', path: 'List', icon: ListBulletIcon },
    { name: 'Team', path: 'Collaboration', icon: UserGroupIcon }
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        type="button"
        className={`md:hidden fixed bottom-5 right-4 z-50 ${
          isMobileMenuOpen ? 'hidden' : 'visible'
        } bg-white/90 rounded-md shadow-lg p-2 backdrop-blur-sm border border-gray-100`}
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-72 h-screen bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-in-out shadow-lg
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <button
            onClick={closeMobileMenu}
            className="md:hidden absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>

          {/* Logo */}
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProjectFlow
            </h1>
          </div>

          {/* Navigation menu */}
          <nav className="px-4 space-y-1 flex-1 mt-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full" />
                    )}
                    
                    <item.icon
                      className={`h-5 w-5 mr-3 ${
                        isActive ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User profile */}
          <div className="border-t border-gray-200 p-4 mt-auto mx-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm">
                {user.name?.slice(0, 2).toUpperCase() || 'UN'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
              </div>
              <button 
                onClick={() => {
                  navigate("/settings");
                  closeMobileMenu();
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Settings"
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};