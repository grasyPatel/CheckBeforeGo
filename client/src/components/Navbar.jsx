import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, Menu, X, User, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get role from user object or localStorage
  const role = user?.role || localStorage.getItem("role") || "user";
  const dashboardRoute = role === "doctor" ? "/doctor/dashboard" : "/user/dashboard";

  // Function to determine link styling based on active path and theme
  const getLinkClass = useCallback((path) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
      isActive
        ? `${theme === 'dark' 
            ? 'text-green-400 bg-green-400/10 shadow-sm' 
            : 'text-green-600 bg-green-50 shadow-sm'
          }`
        : `${theme === 'dark'
            ? 'text-gray-300 hover:text-green-400 hover:bg-green-400/5'
            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          }`
    }`;
  }, [location.pathname, theme]);

  // Function to get avatar (image or initials)
  const getAvatar = useCallback((profileImage, name, size = 'w-10 h-10') => {
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className={`${size} rounded-full object-cover ring-2 ring-green-400/50 transition-all duration-200 hover:ring-green-400 shadow-lg`}
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
      <div className={`${size} rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold ring-2 ring-green-400/50 transition-all duration-200 hover:ring-green-400 shadow-lg hover:shadow-xl transform hover:scale-105 ${size === 'w-10 h-10' ? 'text-sm' : 'text-lg'}`}>
        {initials}
      </div>
    );
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  }, []);

  // Effect to disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-700/50 shadow-lg shadow-gray-900/20'
          : 'bg-white/95 border-green-200/50 shadow-lg shadow-green-100/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            
            {/* Logo */}
            <div className="flex items-center">
              <a 
                href="/" 
                className={`text-xl lg:text-2xl font-bold no-underline transition-all duration-200 flex items-center space-x-2 ${
                  theme === 'dark' ? 'text-white hover:text-green-400' : 'text-gray-900 hover:text-green-600'
                }`}
              >
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg`}>
                  C
                </div>
                <span className="hidden sm:block">CheckBeforeGo</span>
                <span className="sm:hidden">CBG</span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
              <a href="/doctors" className={getLinkClass("/doctors")}>
                Find Doctors
              </a>
              
              {user ? (
                <>
                  <a href={dashboardRoute} className={getLinkClass(dashboardRoute)}>
                    Dashboard
                  </a>
                  
                  {/* User Profile Dropdown */}
                  <div className="relative user-dropdown">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-green-50'
                      }`}
                    >
                      {getAvatar(user.profileImage, user.name)}
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user.name?.length > 12 ? `${user.name.substring(0, 12)}...` : user.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium capitalize">
                          {role}
                        </p>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserDropdown && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border backdrop-blur-sm z-50 ${
                        theme === 'dark' 
                          ? 'bg-gray-800/95 border-gray-700' 
                          : 'bg-white/95 border-gray-200'
                      }`}>
                        <div className="py-2">
                          <a
                            href="/profile"
                            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={handleLinkClick}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </a>
                          <button
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm text-left transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={() => {
                              // Add logout logic here
                              handleLinkClick();
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <a href="/login/user" className={getLinkClass("/login/user")}>
                    User Login
                  </a>
                  <a href="/login/doctor" className={getLinkClass("/login/doctor")}>
                    Doctor Login
                  </a>
                </div>
              )}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                  theme === 'dark'
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 hover:shadow-lg'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50 hover:shadow-md'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Toggle and Theme Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 transform transition-all duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-black/20'} backdrop-blur-sm`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl flex flex-col`}>
          
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Menu
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 px-4 py-6 space-y-4">
            
            {/* User Profile Section (if logged in) */}
            {user && (
              <div className={`p-4 rounded-lg mb-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {getAvatar(user.profileImage, user.name, 'w-12 h-12')}
                  <div>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium capitalize">
                      {role}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href="/profile"
                    className={`flex items-center space-x-2 w-full p-2 rounded text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-white hover:text-gray-900'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </a>
                  <button
                    className={`flex items-center space-x-2 w-full p-2 rounded text-sm text-left transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-white hover:text-gray-900'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <a 
                href="/doctors" 
                className={`block w-full text-left p-3 rounded-lg text-base font-medium transition-all duration-200 ${getLinkClass("/doctors")}`}
                onClick={handleLinkClick}
              >
                Find Doctors
              </a>
              
              {user ? (
                <a 
                  href={dashboardRoute} 
                  className={`block w-full text-left p-3 rounded-lg text-base font-medium transition-all duration-200 ${getLinkClass(dashboardRoute)}`}
                  onClick={handleLinkClick}
                >
                  Dashboard
                </a>
              ) : (
                <div className="space-y-2">
                  <a 
                    href="/login/user" 
                    className={`block w-full text-left p-3 rounded-lg text-base font-medium transition-all duration-200 ${getLinkClass("/login/user")}`}
                    onClick={handleLinkClick}
                  >
                    User Login
                  </a>
                  <a 
                    href="/login/doctor" 
                    className={`block w-full text-left p-3 rounded-lg text-base font-medium transition-all duration-200 ${getLinkClass("/login/doctor")}`}
                    onClick={handleLinkClick}
                  >
                    Doctor Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .mobile-menu-enter {
          animation: slideIn 0.3s ease-out;
        }
        
        @media (max-width: 640px) {
          .max-w-[85vw] {
            max-width: 85vw;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;