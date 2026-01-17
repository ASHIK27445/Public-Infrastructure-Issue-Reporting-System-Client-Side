import { NavLink } from "react-router";
import { AuthContext } from '../AuthProvider/AuthContext';
import { use, useState } from "react";
import { toast } from "react-toastify";
import { 
  Menu, 
  X, 
  Home, 
  AlertTriangle, 
  MapPin, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  Zap, Moon, Sun
} from "lucide-react";
import { useTheme } from "../Theme/ThemeContext";

const Navbar = () => {
  const {user, logoutUser, role} = use(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
      .then(() => toast.success("Logout Successful"))
      .catch((error) => toast.error(error.message));
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/allissues", label: "All Issues", icon: <AlertTriangle className="w-4 h-4" /> },
    { path: "/map-view", label: "Map View", icon: <MapPin className="w-4 h-4" /> },
    { path: "/premium", label: "Premium", icon: <Zap className="w-4 h-4" /> },
  ];

  const userMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Profile", path: "dashboard/dashboard/myProfile", icon: <User className="w-4 h-4" /> },
    { type: "divider" },
    { 
      label: "Logout", 
      action: handleLogout, 
      icon: <LogOut className="w-4 h-4" />,
      className: "text-red-400 hover:text-red-300"
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section - Fixed width */}
          <div className="shrink-0 min-w-50">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white">
                  Community<span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Fix</span>
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">Building Better Communities</span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center mx-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `group flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                  }`
                }
              >
                {link.icon}
                <span className="whitespace-nowrap">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-3 rounded-2xl hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme">
              {theme === 'light' ? (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              )}
            </button>
            
            {/* Report Button */}
            <NavLink
              to="dashboard/dashboard/addissues"
              className="hidden md:flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-white shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Report Issue</span>
            </NavLink>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-2xl hover:bg-zinc-800 transition-all duration-300">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-emerald-500/50">
                      <img
                        src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.displayName}
                        alt={user?.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  </div>
                  
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-white font-bold text-sm">
                      {user?.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <span className="text-emerald-400 text-xs font-medium">{role}</span>
                  </div>
                  
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-zinc-800/95 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-2xl p-4 mt-4">
                    
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-linear-to-r from-emerald-500/10 to-teal-500/10 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.displayName}
                          alt={user?.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold truncate">{user?.displayName}</div>
                        <div className="text-emerald-400 text-sm truncate">{user?.email}</div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      {userMenuItems.map((item, index) => (
                        item.type === "divider" ? (
                          <div key={index} className="h-px bg-zinc-700 my-2" />
                        ) : (
                          <NavLink
                            key={item.label}
                            to={item.path || "#"}
                            onClick={item.action}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-zinc-700/50 transition-all duration-300 ${
                              item.className || ''
                            }`}
                          >
                            <div className="text-emerald-400">{item.icon}</div>
                            <span className="font-medium">{item.label}</span>
                          </NavLink>
                        )
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-xl bg-zinc-900/50">
                          <div className="text-emerald-400 font-bold">12</div>
                          <div className="text-xs text-gray-400">Reports</div>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-zinc-900/50">
                          <div className="text-emerald-400 font-bold">8</div>
                          <div className="text-xs text-gray-400">Resolved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Login Button for non-authenticated users
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NavLink
                  to="/login"
                  className="px-4 py-2 sm:px-6 sm:py-3 border-2 border-emerald-500/50 rounded-2xl font-bold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300 whitespace-nowrap"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-white shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-2xl hover:bg-zinc-800 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen &&  
        <div className="md:hidden bg-zinc-800/95 backdrop-blur-xl border-t border-zinc-700">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400'
                      : 'text-gray-300 hover:text-white hover:bg-zinc-700/50'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
            
            <NavLink
              to="/report"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-white shadow-lg mt-4"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Report Issue</span>
            </NavLink>
          </div>
        </div>}
    </nav>
  );
};

export default Navbar;