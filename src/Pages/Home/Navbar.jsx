import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { AuthContext } from '../AuthProvider/AuthContext';
import { use, useState, useEffect, useRef } from "react";
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
  Zap,
  Moon,
  Sun,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "../Theme/ThemeContext";

const Navbar = () => {
  const { user, mUser, logoutUser, role } = use(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setLogoutLoading(true);
    logoutUser()
      .then(() => {
        setLogoutLoading(false);
        toast.success("Logout Successful!");
      })
      .catch((error) => {
        setLogoutLoading(false);
        toast.error(error.message);
      });
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/allissues", label: "Issues", icon: <AlertTriangle className="w-4 h-4" /> },
    { path: "/map-view", label: "Map", icon: <MapPin className="w-4 h-4" /> },
    { path: "/events", label: "Events", icon: <CalendarDays className="w-4 h-4" /> },
    { path: "/premium", label: "Premium", icon: <Zap className="w-4 h-4" /> },
  ];

  const userMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Profile", path: "/dashboard/dashboard/myProfile", icon: <User className="w-4 h-4" /> },
    { type: "divider" },
    {
      label: "Logout",
      action: handleLogout,
      icon: <LogOut className="w-4 h-4" />,
      className: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
    },
  ];

  const handleStaffReportIssue = () => {
    if (role === "staff") {
      toast.error("Staff can't report issues.");
      return;
    }
    navigate("dashboard/dashboard/addissues");
  };

  if (logoutLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-red-500/30 rounded-full" />
            <div className="absolute inset-4 bg-red-500/20 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-0.5 h-6 bg-red-500" />
              <div className="w-4 h-4 border-2 border-red-500 rounded-full -top-5 -translate-x-1/2 left-1/2 absolute" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">Closing session</p>
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">

          {/* ── Logo ── */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[1.15rem] sm:text-xl lg:text-2xl font-black text-white tracking-tight">
                Community
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Fix
                </span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:block mt-0.5">
                Building Better Communities
              </span>
            </div>
          </NavLink>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-300 hover:text-white hover:bg-zinc-800"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-600" />
              ) : (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-300" />
              )}
            </button>

            {/* Report Issue — desktop */}
            <button
              onClick={handleStaffReportIssue}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* ── User menu / Login buttons ── */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-zinc-800 transition-all duration-200"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border-2 border-emerald-500/50">
                      <img
                        src={
                          user?.photoURL ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`
                        }
                        alt={user?.displayName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  </div>

                  {/* Name + role — large screens only */}
                  <div className="hidden xl:flex flex-col items-start">
                    <span className="text-white font-bold text-sm leading-tight">
                      {user?.displayName?.split(" ")[0] || "User"}
                    </span>
                    <span className="text-emerald-400 text-xs font-medium capitalize">
                      {role}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-2xl p-4">

                      {/* User info card */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-emerald-500/10 to-teal-500/10 mb-3">
                        <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden border border-emerald-500/30">
                          <img
                            src={
                              user?.photoURL ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || "default"}`
                            }
                            alt={user?.displayName || "Avatar"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-sm truncate">
                            {user?.displayName || "Unknown User"}
                          </div>
                          <div className="text-emerald-400 text-xs truncate">
                            {user?.email || "No Email"}
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="space-y-0.5">
                        {userMenuItems.map((item, index) =>
                          item.type === "divider" ? (
                            <div key={index} className="h-px bg-zinc-700 my-2" />
                          ) : (
                            <NavLink
                              key={item.label}
                              to={item.path || "#"}
                              onClick={() => {
                                setIsProfileOpen(false);
                                if (item.action) item.action();
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-zinc-700/50 transition-all duration-200 text-sm font-medium ${
                                item.className || ""
                              }`}
                            >
                              <span className="text-emerald-400 shrink-0">
                                {item.icon}
                              </span>
                              {item.label}
                            </NavLink>
                          )
                        )}
                      </div>

                      {/* Stats */}
                      {(role === "staff" || role === "citizen") && (
                        <div className="mt-3 pt-3 border-t border-zinc-700">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 rounded-xl bg-zinc-800 border border-zinc-800">
                              <div className="text-emerald-400 font-bold text-base">
                                {mUser?.role === "staff"
                                  ? mUser?.assignIssued || 0
                                  : mUser?.role === "citizen"
                                  ? mUser?.issueCount || 0
                                  : 0}
                              </div>
                              <div className="text-xs text-gray-400">
                                {mUser?.role === "staff" ? "Assigned" : "Reported"}
                              </div>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-zinc-800 border border-zinc-800">
                              <div className="text-emerald-400 font-bold text-base">
                                {mUser?.role === "staff"
                                  ? mUser?.resolvedIssued || 0
                                  : mUser?.role === "citizen"
                                  ? mUser?.solvedIssue || 0
                                  : 0}
                              </div>
                              <div className="text-xs text-gray-400">Resolved</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <NavLink
                  to="/login"
                  state={{ from: location.pathname }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-emerald-500/50 rounded-xl font-bold text-xs sm:text-sm text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet Drawer ── */}
      {isOpen && (
      <div
        ref={mobileMenuRef}
        className="
          lg:hidden
          fixed
          top-16
          right-0
          w-1/2
          h-[calc(100vh-4rem)]
          bg-zinc-900
          border-l border-zinc-700
          shadow-2xl
          z-50
        "
      >
          <div className="h-full flex flex-col px-4 py-4">

            {/* Top Menu */}
            <div className="space-y-2">

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20"
                        : "text-gray-300 hover:text-white hover:bg-zinc-800"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}

              {user && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20"
                        : "text-gray-300 hover:text-white hover:bg-zinc-800"
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>
              )}

              <div className="h-px bg-zinc-700 my-2" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleStaffReportIssue();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-sm text-white"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>

            {/* Bottom User Section */}
            {user && (
              <div className="mt-auto border-t border-zinc-700 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-emerald-500/40 shrink-0">
                    <img
                      src={
                        user?.photoURL ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`
                      }
                      alt={user?.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">
                      {user?.displayName || "User"}
                    </div>
                    <div className="text-emerald-400 text-xs capitalize">
                      {role}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;