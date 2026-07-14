import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconLayoutDashboard, IconUsersGroup, IconChevronLeft, IconChevronRight, IconFiles, IconChartPie, IconChartBar, IconWorld } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpenMobile, setIsOpenMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userStr = localStorage.getItem('admin_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isGuru = user?.role === 'guru';

  const handleLinkClick = () => {
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className={`bg-surface border-r border-gray-200 dark:border-white/5 flex flex-col h-screen shrink-0 fixed md:relative z-40 transition-transform duration-300 md:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className={`flex items-center gap-3 p-6 ${isCollapsed ? 'justify-center' : ''}`}>
        <img src="/logo/logoblue.png" alt="Quizzin" className={`object-contain dark:hidden block ${isCollapsed ? 'h-8' : 'h-10'}`} />
        <img src="/logo/logowhite.png" alt="Quizzin" className={`object-contain hidden dark:block ${isCollapsed ? 'h-8' : 'h-10'}`} />
      </div>
      
      <div className={`flex flex-col gap-2 px-4 ${isCollapsed ? 'items-center' : ''}`}>
        {!isCollapsed && <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">Main Menu</h3>}
        
        <NavLink onClick={handleLinkClick} 
          to="/" 
          title="Overview"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-on-surface dark:hover:text-white'
            } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
          }
        >
          <IconLayoutDashboard size={20} className="shrink-0" />
          {!isCollapsed && <span>Overview</span>}
        </NavLink>
        
        {!isGuru && (
          <>            <NavLink onClick={handleLinkClick} 
              to="/quiz-analytics" 
              title="Quiz Analytics"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-on-surface dark:hover:text-white'
                } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
              }
            >
              <IconChartBar size={20} className="shrink-0" />
              {!isCollapsed && <span>Quiz Analytics</span>}
            </NavLink>

            <NavLink onClick={handleLinkClick} 
              to="/global-trends" 
              title="Global Trends"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-on-surface dark:hover:text-white'
                } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
              }
            >
              <IconWorld size={20} className="shrink-0" />
              {!isCollapsed && <span>Global Trends</span>}
            </NavLink>
            <NavLink onClick={handleLinkClick} 
              to="/users" 
              title="Users Management"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-on-surface dark:hover:text-white'
                } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
              }
            >
              <IconUsersGroup size={20} className="shrink-0" />
              {!isCollapsed && <span>Users Management</span>}
            </NavLink>
          </>
        )}

        <NavLink onClick={handleLinkClick} 
          to="/documents" 
          title="Document Management"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-on-surface dark:hover:text-white'
            } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
          }
        >
          <IconFiles size={20} className="shrink-0" />
          {!isCollapsed && <span>Documents Management</span>}
        </NavLink>
      </div>

      <div className="mt-auto border-t border-gray-200 dark:border-white/5 p-4 flex justify-center">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center gap-2 text-muted hover:text-on-surface dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 w-full justify-center"
        >
          {isCollapsed ? <IconChevronRight size={20} /> : (
            <>
              <IconChevronLeft size={20} />
              <span className="text-sm font-medium">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
};

export default Sidebar;
