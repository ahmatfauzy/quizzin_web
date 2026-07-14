import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconFileText, IconTrendingUp, IconTrendingDown, IconUsers, IconFiles, IconBrain, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL;

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
        <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-surface rounded-xl border border-gray-200 dark:border-white/5">
        <Icon size={24} className="text-primary" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-auto">
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${isUp ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
        {isUp ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
        {trend}%
      </div>
      <span className="text-xs text-muted">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [appData, setAppData] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Quizzin Dashboard";
    const fetchData = async () => {
      try {
        const [appRes, docsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/analytics/appdata?period=30d`),
          axios.get(`${API_URL}/admin/documents`)
        ]);
        
        setAppData(appRes.data);
        const docs = docsRes.data.documents || docsRes.data || [];
        setRecentDocs(docs.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-white flex items-center gap-3">
            Overview
            <span className="text-sm font-normal text-muted bg-surface px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">At a Glance</span>
          </h1>
          <p className="text-muted text-sm mt-2">Welcome to the Quizzin Admin Dashboard. Select an analytics menu from the sidebar for detailed charts.</p>
        </div>
      </motion.div>
      
      {appData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={appData.summary.total_users} trend={5.2} isUp={true} icon={IconUsers} delay={0.1} />
            <StatCard title="Processed Docs" value={appData.summary.total_documents} trend={1.5} isUp={true} icon={IconFiles} delay={0.2} />
            <StatCard title="Quiz Attempts" value={appData.summary.total_quiz_attempts} trend={2.1} isUp={false} icon={IconBrain} delay={0.3} />
            <StatCard title="Active Admins" value={appData.role_breakdown.find(r => r.name === 'admin')?.value || 0} trend={0.0} isUp={true} icon={IconShieldCheck} delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth mini chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="card-glass p-6"
            >
              <h3 className="text-lg font-semibold text-on-surface dark:text-white mb-4">User Growth (Last 30 Days)</h3>
              <div className="h-[250px] w-full">
                {appData.user_growth && appData.user_growth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appData.user_growth} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgb(var(--color-surface))', border: '1px solid rgba(var(--color-on-surface) / 0.1)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="users" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-gray-200 dark:border-white/10 rounded-xl">No sufficient data for this period</div>
                )}
              </div>
            </motion.div>

            {/* Recent Documents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }} 
              className="card-glass p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-on-surface dark:text-white mb-4">Recently Uploaded</h3>
              <div className="space-y-4 flex-1">
                {recentDocs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-gray-200 dark:border-white/10 rounded-xl py-12">No recent documents</div>
                ) : (
                  recentDocs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface/30 border border-gray-200 dark:border-white/5 hover:bg-surface/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <IconFileText size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium text-on-surface dark:text-white truncate">{doc.title}</h4>
                        <p className="text-xs text-muted truncate">{doc.owner_name}</p>
                      </div>
                      <div className="shrink-0">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${
                          doc.status === 'ready' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' :
                          doc.status === 'failed' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
