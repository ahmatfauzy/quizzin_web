import React, { useState, useRef, useEffect } from 'react';
import { IconLogout, IconMenu2, IconSun, IconMoon, IconChevronDown } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';

const Topbar = ({ user, onLogout, onMenuClick, isDark, toggleTheme }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMenuName = () => {
    switch (location.pathname) {
      case '/': return user?.role === 'guru' ? 'Guru Dashboard' : 'Overview';
      case '/quiz-analytics': return 'Quiz Analytics';
      case '/global-trends': return 'Global Trends';
      case '/users': return 'Users Management';
      case '/documents': return 'Documents Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2 md:gap-4 text-muted font-medium">
        <button onClick={onMenuClick} className="md:hidden text-white hover:text-primary transition-colors">
          <IconMenu2 size={24} />
        </button>
        <span className="text-gray-400 hidden sm:inline">Dashboard</span>
        <span className="text-gray-500 hidden sm:inline">/</span>
        <span className="text-white text-sm md:text-base">{getMenuName()}</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-white">{user?.full_name || 'Admin User'}</span>
              <span className="text-xs text-muted capitalize">{user?.role || 'Administrator'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-background">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <IconChevronDown size={16} className="text-muted hidden md:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 transition-colors text-left text-sm"
              >
                <IconLogout size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
