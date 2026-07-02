import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IconShieldCheck, IconUser, IconTrash, IconActivity, IconX } from '@tabler/icons-react';
import { 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics State
  const [roleData, setRoleData] = useState(null);
  const [rolePeriod, setRolePeriod] = useState('all');
  const [growthData, setGrowthData] = useState(null);
  const [growthPeriod, setGrowthPeriod] = useState('all');
  
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

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/analytics/appdata?period=${rolePeriod}`);
        setRoleData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoleData();
  }, [rolePeriod]);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/analytics/appdata?period=${growthPeriod}`);
        setGrowthData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGrowthData();
  }, [growthPeriod]);

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

  if (loading || !roleData || !growthData) {
    return <SkeletonLoader />;
  }

  const userRatio = roleData ? Math.round((roleData.role_breakdown.find(r => r.name === 'user')?.value || 0) / (roleData.summary.total_users || 1) * 100) : 0;
  const adminRatio = roleData ? Math.round((roleData.role_breakdown.find(r => r.name === 'admin')?.value || 0) / (roleData.summary.total_users || 1) * 100) : 0;
  const guruRatio = roleData ? Math.round((roleData.role_breakdown.find(r => r.name === 'guru')?.value || 0) / (roleData.summary.total_users || 1) * 100) : 0;

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">User Management & Analytics</h1>
        <p className="text-muted text-sm">Analyze user roles and manage user access across the Quizzin platform.</p>
      </motion.div>

      {/* Analytics Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Roles Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">User Roles</h3>
              <select 
                value={rolePeriod}
                onChange={(e) => setRolePeriod(e.target.value)}
                className="bg-surface text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="90d">Last 90 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>
            <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
              {roleData?.role_breakdown ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleData.role_breakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="value" stroke="none">
                        {roleData.role_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'admin' ? '#3b82f6' : entry.name === 'guru' ? '#f97316' : '#10b981'} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-3xl font-bold text-white">{roleData.summary.total_users}</span>
                    <span className="text-xs text-muted">Total</span>
                  </div>
                </>
              ) : (
                <div className="spinner"></div>
              )}
            </div>
            <div className="flex justify-around mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="text-sm font-medium text-white">{adminRatio}% Admin</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-sm font-medium text-white">{guruRatio}% Guru</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm font-medium text-white">{userRatio}% Regular</span></div>
            </div>
          </motion.div>

          {/* User Growth Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">User Growth</h3>
              <select 
                value={growthPeriod}
                onChange={(e) => setGrowthPeriod(e.target.value)}
                className="bg-surface text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="90d">Last 90 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>
            <div className="h-[250px] w-full mt-4">
              {growthData?.user_growth && growthData.user_growth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData.user_growth} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Line type="stepAfter" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#18181b', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981', stroke: '#18181b', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : growthData ? (
                <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-white/10 rounded-xl">No sufficient data for this period</div>
              ) : (
                <div className="flex items-center justify-center h-full"><div className="spinner"></div></div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Table Section */}
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
                        : u.role === 'guru'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
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
                        <option value="guru">Guru</option>
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
