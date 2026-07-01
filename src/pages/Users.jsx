import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IconShieldCheck, IconUser, IconTrash, IconActivity, IconX } from '@tabler/icons-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Activity Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/role?role=${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  const openActivityModal = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setLoadingActivity(true);
    setActivities([]);
    
    try {
      const res = await axios.get(`${API_URL}/admin/users/${user.id}/activity`);
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
        <p className="text-muted text-sm">Manage user access and track activities across the Quizzin platform.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-white/5">
                <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Joined Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  key={u.id} 
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-bold">
                        {u.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{u.full_name}</div>
                        <div className="text-xs text-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      u.role === 'admin' 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {u.role === 'admin' ? <IconShieldCheck size={14} /> : <IconUser size={14} />}
                      {u.role?.charAt(0).toUpperCase() + u.role?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${u.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-xs text-muted">{u.is_verified ? 'Verified' : 'Pending'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <select 
                        value={u.role || 'user'} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-surface text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button 
                        onClick={() => openActivityModal(u)}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                        title="Track Activity"
                      >
                        <IconActivity size={18} />
                      </button>

                      <button className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete User">
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-12 text-center text-muted">
              No users found.
            </div>
          )}
        </div>
      </motion.div>

      {/* Activity Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card-glass w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border-white/10 bg-surface"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <IconActivity className="text-primary" />
                    Activity Log
                  </h3>
                  <p className="text-xs text-muted mt-1">Tracking {selectedUser?.full_name} ({selectedUser?.email})</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingActivity ? (
                  <div className="flex justify-center py-12"><div className="spinner !w-8 !h-8 !border-2"></div></div>
                ) : activities.length === 0 ? (
                  <div className="text-center text-muted py-12 border border-dashed border-white/10 rounded-xl">
                    No activity recorded for this user yet.
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:via-white/10 before:to-transparent">
                    {activities.map((act, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="relative flex items-start group"
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-surface bg-primary shadow shrink-0 z-10 mt-1"></div>
                        <div className="ml-4 w-full bg-background p-4 rounded-xl border border-white/5 shadow-sm group-hover:border-primary/30 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-white capitalize text-sm flex items-center gap-2">
                              {act.action.replace('_', ' ')}
                            </div>
                            <time className="text-xs text-muted font-medium bg-white/5 px-2 py-1 rounded-md">
                              {act.time}
                            </time>
                          </div>
                          {act.detail && (
                            <div className="text-xs text-muted bg-white/5 p-2 rounded border border-white/5 break-all">
                              {act.detail}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
