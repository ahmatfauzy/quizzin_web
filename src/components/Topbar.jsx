import React from 'react';
import { IconSearch, IconBell, IconLogout } from '@tabler/icons-react';

const Topbar = ({ user, onLogout }) => {
  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2 text-muted bg-surface px-4 py-2 rounded-full border border-white/5 w-96 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <IconSearch size={18} />
        <input 
          type="text" 
          placeholder="Search anywhere..." 
          className="bg-transparent border-none text-white outline-none text-sm w-full placeholder-white/30"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-muted hover:text-white transition-colors">
          <IconBell size={22} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        
        <div className="h-8 w-px bg-white/10"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{user?.full_name || 'Admin User'}</span>
            <span className="text-xs text-muted">Administrator</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-background">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>

        <button 
          onClick={onLogout} 
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ml-2" 
          title="Logout"
        >
          <IconLogout size={20} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
