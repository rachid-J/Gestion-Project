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
  
  export const SidebarHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
  
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
  
    // Navigation items for better maintainability
    const navItems = [
      { path: "/dashboard", icon: <ChartBarIcon className="h-5 w-5" />, label: "Dashboard" },
      { path: "/projects", icon: <FolderIcon className="h-5 w-5" />, label: "Projects" },
      { path: "/teams", icon: <UserGroupIcon className="h-5 w-5" />, label: "Teams" }
    ];
  
    return (
      <aside className="w-64 fixed top-14 h-[calc(100vh-3.5rem)] flex flex-col bg-white border-r border-gray-100 shadow-md">
        {/* User Profile Section */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user?.users_info?.profile_photo ? (
              <img
                src={`${import.meta.env.VITE_STORAGE_URL}/${user?.users_info?.profile_photo}`}
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                alt="Profile"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                {user?.name?.slice(0, 2).toUpperCase() || "UN"}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'Account Name'}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
  
        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
  
          <div className="px-3 pt-6 mt-6 border-t border-gray-100">
            <NavLink
              to="/settings"
              className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-3" />
              Settings
            </NavLink>
          </div>
        </nav>
  
        {/* Footer Section */}
        <div className="px-3 py-4 mb-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition-all hover:bg-red-50 group"
            aria-label="Logout"
          >
            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
            Logout
          </button>
        </div>
      </aside>
    );
  };