import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { IconFileText, IconTrendingUp, IconTrendingDown, IconUsers, IconFiles, IconBrain, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const StatCard = ({ title, value, trend, isUp, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="card-glass p-5 flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-surface rounded-xl border border-white/5">
        <Icon size={24} className="text-primary" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-auto">
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {isUp ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
        {trend}%
      </div>
      <span className="text-xs text-muted">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [appData, setAppData] = useState(null);
  const [bigData, setBigData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, bigRes] = await Promise.all([
          axios.get(`${API_URL}/admin/analytics/appdata`),
          axios.get(`${API_URL}/admin/analytics/bigdata`)
        ]);
        setAppData(appRes.data);
        setBigData(bigRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const userRatio = appData ? Math.round((appData.role_breakdown[1].value / appData.summary.total_users) * 100) || 0 : 0;
  const adminRatio = appData ? Math.round((appData.role_breakdown[0].value / appData.summary.total_users) * 100) || 0 : 0;

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Overview
            <span className="text-sm font-normal text-muted bg-surface px-3 py-1 rounded-full border border-white/5">All Analytics</span>
          </h1>
        </div>
        <button className="btn-primary gap-2 shadow-lg shadow-primary/20">
          <IconFileText size={18} /> 
          Generate Report
        </button>
      </motion.div>
      
      {appData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Users" value={appData.summary.total_users} trend={5.2} isUp={true} icon={IconUsers} delay={0.1} />
          <StatCard title="Processed Docs" value={appData.summary.total_documents} trend={1.5} isUp={true} icon={IconFiles} delay={0.2} />
          <StatCard title="Quiz Attempts" value={appData.summary.total_quiz_attempts} trend={2.1} isUp={false} icon={IconBrain} delay={0.3} />
          <StatCard title="Active Admins" value={appData.role_breakdown[0].value} trend={0.0} isUp={true} icon={IconShieldCheck} delay={0.4} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {bigData && bigData.yearly_trend && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-glass p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Global Literacy Rate Trend</h3>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Literacy %
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bigData.yearly_trend} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="#a1a1aa" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#a1a1aa" tick={{fontSize: 12}} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#18181b', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appData && appData.role_breakdown && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card-glass p-6 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-white mb-4">User Roles</h3>
                <div className="flex-1 flex items-center justify-center relative min-h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={appData.role_breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-2xl font-bold text-white">{appData.summary.total_users}</span>
                    <span className="text-xs text-muted">Total</span>
                  </div>
                </div>
                <div className="flex justify-around mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-white">{adminRatio}% Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-white">{userRatio}% Regular</span>
                  </div>
                </div>
              </motion.div>
            )}

            {bigData && bigData.top_countries && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card-glass p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Top Countries</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bigData.top_countries.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis dataKey="country" type="category" stroke="#a1a1aa" width={90} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.6 }}
             className="card-glass p-6"
           >
              <h3 className="text-lg font-semibold text-white mb-6 flex justify-between items-center">
                User Growth
                <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full">Internal Data</span>
              </h3>
              
              <div className="h-48 w-full mt-4">
                {appData?.user_growth && appData.user_growth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appData.user_growth} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Line type="stepAfter" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#18181b', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981', stroke: '#18181b', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-white/10 rounded-xl">No sufficient data</div>
                )}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.7 }}
             className="card-glass p-6"
           >
              <h3 className="text-lg font-semibold text-white mb-6 flex justify-between items-center">
                Peak Activity Times
                <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full">Server Load</span>
              </h3>
              
              <div className="h-48 w-full mt-4">
                {appData?.peak_times && appData.peak_times.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appData.peak_times} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="hour" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Bar dataKey="activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-white/10 rounded-xl">No sufficient data</div>
                )}
              </div>
              <p className="text-xs text-muted mt-4">Predict peak usage for maintenance scheduling</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.8 }}
             className="card-glass p-6 flex-1"
           >
              <h3 className="text-lg font-semibold text-white mb-6 flex justify-between items-center">
                Quiz Avg Score Trend
                <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full">Insights</span>
              </h3>
              <div className="h-48 w-full mt-4">
                {appData?.quiz_trend && appData.quiz_trend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appData.quiz_trend} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="avg_score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#18181b', stroke: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#18181b', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-white/10 rounded-xl">No sufficient data</div>
                )}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
