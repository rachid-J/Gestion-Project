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

export const Sidebar = ({user}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Summary', path: 'Summary', icon: ChartPieIcon },
    { name: 'board', path: 'board', icon: ClipboardDocumentIcon },
    { name: 'List', path: 'List', icon: ListBulletIcon },
    { name: 'Collaboration', path: 'Collaboration', icon: UserGroupIcon },
    { name: 'Setting', path: 'setting', icon: Cog6ToothIcon },
  ];

  return (
    <>
    
      <button
        type="button"
        className={`md:hidden p-3 fixed top-2 left-0 z-50 ${isMobileMenuOpen ? "hidden" : "visible"} bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-gray-200/50 hover:shadow-gray-300/50 transition-all`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-800" />
      </button>


      <aside
    className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white/95 shadow-lg backdrop-blur-lg transition-transform duration-300 border-r border-gray-100 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
>
        <div className="flex flex-col h-full">
          

          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl text-gray-600 transition-all
                  hover:bg-gray-50 hover:translate-x-2 group
                  ${isActive ? 'bg-blue-50/80 border border-blue-100 text-blue-600' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-6 w-6 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'} group-hover:text-blue-500`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 
                flex items-center justify-center text-white font-medium shadow-sm">
               {user.name?.slice(0,2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

