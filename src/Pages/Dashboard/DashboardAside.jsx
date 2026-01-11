import React, { use, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  Home,
  AlertTriangle,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  HelpCircle,
  Shield,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthProvider/AuthContext';

const DashboardAside = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const {user, logoutUser} = use(AuthContext)
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser()
      .then(() => toast.success("Logout Successful"))
      .catch((error) => toast.error(error.message));
  };
  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      id: 'myissues',
      name: 'My Issues',
      icon: <AlertTriangle className="w-5 h-5" />,
      path: 'dashboard/myissues'
    },
    {
      id: 'addissues',
      name: 'Add Issues',
      icon: <AlertTriangle className="w-5 h-5" />,
      path: 'dashboard/addissues'
    },
    {
      id: 'manageIssues',
      name: 'Manage Issue',
      icon: <FileText className="w-5 h-5" />,
      path: 'dashboard/manageissues'
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      path: '/notifications',
      badge: 3
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings'
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/help'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop and Mobile */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800
        w-64 z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:relative lg:h-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Citizen Portal</h2>
              <p className="text-sm text-gray-400">Public Service Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{user?.displayName}</h3>
              <p className="text-sm text-gray-400">Citizen ID: CTZ-789456</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Member Since</span>
              <span className="text-sm text-white">2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Community Score</span>
              <span className="text-sm text-emerald-400 font-bold">85/100</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => {
                setActiveMenu(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                flex items-center justify-between p-3 rounded-xl transition-all duration-200
                ${activeMenu === item.id 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400' 
                  : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={activeMenu === item.id ? 'text-emerald-400' : 'text-gray-500'}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              
              {item.badge && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
              
              {activeMenu === item.id && (
                <div className="w-1 h-4 bg-emerald-500 rounded-full ml-2"></div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="p-6 border-t border-zinc-800">
          <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-400">Active Issues</span>
              </div>
              <span className="text-sm font-bold text-white">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-400">Resolved</span>
              </div>
              <span className="text-sm font-bold text-white">24</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-400">This Month</span>
              </div>
              <span className="text-sm font-bold text-white">5</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full space-x-2 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardAside;