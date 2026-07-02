import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconLayoutDashboard, IconUsersGroup, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userStr = localStorage.getItem('admin_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isGuru = user?.role === 'guru';

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-surface border-r border-white/5 flex flex-col h-screen shrink-0 relative transition-all"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-8 w-7 h-7 bg-surface border border-white/10 rounded-full flex items-center justify-center text-muted hover:text-white hover:border-white/20 hover:bg-white/5 shadow-md hover:scale-105 transition-all z-20"
      >
        {isCollapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
      </button>

      <div className={`flex items-center gap-3 p-6 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg shrink-0">
          <span className="text-background font-bold text-lg">Q</span>
        </div>
        {!isCollapsed && <motion.span initial={{opacity: 0}} animate={{opacity: 1}} className="text-xl font-bold text-white tracking-wide">Quizzin</motion.span>}
      </div>
      
      <div className={`flex flex-col gap-2 px-4 ${isCollapsed ? 'items-center' : ''}`}>
        {!isCollapsed && <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">Main Menu</h3>}
        
        <NavLink 
          to="/" 
          title="Overview"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted hover:bg-white/5 hover:text-white'
            } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
          }
        >
          <IconLayoutDashboard size={20} className="shrink-0" />
          {!isCollapsed && <span>Overview</span>}
        </NavLink>
        
        {!isGuru && (
          <NavLink 
            to="/users" 
            title="User Management"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
            }
          >
            <IconUsersGroup size={20} className="shrink-0" />
            {!isCollapsed && <span>User Management</span>}
          </NavLink>
        )}
      </div>

      {!isCollapsed && (
        <div className="mt-auto p-4">
          <div className="bg-gradient-to-tr from-primary/20 to-purple-500/20 p-4 rounded-xl border border-white/5">
            <h4 className="text-sm font-medium text-white mb-1">Need help?</h4>
            <p className="text-xs text-muted mb-3">Check our documentation</p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors">
              Docs
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
