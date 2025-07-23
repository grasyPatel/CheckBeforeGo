import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Get role from user object or localStorage
  const role = user?.role || localStorage.getItem("role") || "user";
  const dashboardRoute =
    role === "doctor" ? "/doctor/dashboard" : "/user/dashboard";

  const getLinkClass = (path) =>
    location.pathname === path
      ? "font-semibold text-green-600 underline"
      : "text-black hover:text-green-600 hover:underline";

  const getAvatar = (profileImage, name) => {
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 transition-all duration-200 hover:ring-green-300"
        />
      );
    }
    const initials = name
      ? name.split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-green-400 transition-all duration-200 hover:ring-green-300 hover:from-green-400 hover:to-green-500 shadow-lg">
        {initials}
      </div>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-lg transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/90 border-gray-700' 
        : 'bg-white/90 border-green-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className={`text-xl font-bold no-underline ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              CheckBeforeGo
            </a>
          </div>
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg transition-all duration-200 ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 hover:shadow-lg' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50 hover:shadow-md'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="/doctors" className={getLinkClass("/doctors")}>Doctors</a>
            {user ? (
              <>
                <a href={dashboardRoute} className={getLinkClass(dashboardRoute)}>
                  Dashboard
                </a>
                <div className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-green-50 dark:hover:bg-gray-800 hover:shadow-md">
                  {getAvatar(user.profileImage, user.name)}
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      {role === 'doctor' ? 'Doctor' : 'User'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a href="/login/user" className={getLinkClass("/login/user")}>User Login</a>
                <a href="/login/doctor" className={getLinkClass("/login/doctor")}>Doctor Login</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;