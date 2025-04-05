import {
  ChartBarIcon,
  Cog6ToothIcon,
  FolderIcon,
  UserGroupIcon,
  ArrowLeftEndOnRectangleIcon
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { Logout } from "../../services/authServices";
import { logOut } from "../../Redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export const SidebarHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await Logout();
      if (response.status === 200) {
        dispatch(logOut());
        navigate('/redirect');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { 
      path: "/dashboard", 
      icon: <ChartBarIcon className="h-5 w-5" />, 
      label: "Dashboard",
      description: "Overview and analytics"
    },
    { 
      path: "/projects", 
      icon: <FolderIcon className="h-5 w-5" />, 
      label: "Projects",
      description: "Manage your projects"
    },
    { 
      path: "/teams", 
      icon: <UserGroupIcon className="h-5 w-5" />, 
      label: "Teams",
      description: "Team collaboration"
    }
  ];

  const getUserInitials = () => {
    if (!user?.name) return "UN";
    const nameParts = user.name.split(" ");
    return nameParts.slice(0, 2).map(part => part[0].toUpperCase()).join("");
  };

  return (
    <aside 
      className={`w-64 fixed top-14 h-[calc(100vh-3.5rem)] flex flex-col bg-white/95 backdrop-blur-lg border-r border-gray-100 transition-all duration-300 ease-in-out group/sidebar ${
        isHovering ? 'shadow-xl' : 'shadow-md'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* User Profile Section */}
      <div className="px-6 py-5 border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          {user?.users_info?.profile_photo ? (
            <img
              src={`${import.meta.env.VITE_STORAGE_URL}/${user?.users_info?.profile_photo}`}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-lg hover:ring-blue-300 transition-all duration-300"
              alt="Profile"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow-lg">
              {getUserInitials()}
            </div>
          )}
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-gray-800 truncate">
              {user?.name || 'Account Name'}
            </h3>
            <p className="text-xs text-gray-500/80 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <h4 className="px-4 text-[0.7rem] font-bold text-gray-400/80 uppercase tracking-wider">
            Navigation
          </h4>
          
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center px-4 py-2.5 my-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-600 shadow-sm border-l-[3px] border-blue-500' 
                  : 'text-gray-500/90 hover:bg-gray-100/50 hover:text-gray-900 border-l-[3px] border-transparent'
              }`}
            >
              <span className={`mr-3 transition-transform duration-200 ${
                isHovering ? 'transform scale-110 text-blue-500' : 'text-gray-400'
              }`}>
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                {isHovering && (
                  <span className="text-xs text-gray-400/80 font-normal mt-0.5">
                    {item.description}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </div>

        {/* Settings Section */}
        <div className="px-3 pt-6 mt-6 border-t border-gray-100/50">
          <NavLink
            to="/settings"
            className={({ isActive }) => `flex items-center px-4 py-2.5 my-1 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'bg-blue-500/10 text-blue-600 shadow-sm border-l-[3px] border-blue-500' 
                : 'text-gray-500/90 hover:bg-gray-100/50 hover:text-gray-900 border-l-[3px] border-transparent'
            }`}
          >
            <Cog6ToothIcon className={`h-5 w-5 mr-3 transition-transform duration-300 ${
              isHovering ? 'animate-spin-slow text-blue-400' : 'text-gray-400'
            }`} />
            <div className="flex flex-col">
              <span className="font-medium">Settings</span>
              {isHovering && (
                <span className="text-xs text-gray-400/80 font-normal mt-0.5">
                  Account configuration
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </nav>

      {/* Logout Footer */}
      <div className="mt-auto px-3 py-4 border-t border-gray-100/50 bg-white/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-500/90 hover:text-red-600 rounded-xl transition-all duration-300 hover:bg-red-50/50 group"
        >
          <div className="flex items-center">
            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
            <span>Sign out</span>
          </div>
          <span className="text-xs text-center font-mono  text-gray-400/70 group-hover:text-red-400">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </button>
      </div>
    </aside>
  );
};