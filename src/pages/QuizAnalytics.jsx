import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL;

const QuizAnalytics = () => {
  const [trendData, setTrendData] = useState(null);
  const [trendPeriod, setTrendPeriod] = useState('all');
  
  const [peakData, setPeakData] = useState(null);
  const [peakPeriod, setPeakPeriod] = useState('all');

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/analytics/appdata?period=${trendPeriod}`);
        setTrendData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrendData();
  }, [trendPeriod]);

  useEffect(() => {
    const fetchPeakData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/analytics/appdata?period=${peakPeriod}`);
        setPeakData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPeakData();
  }, [peakPeriod]);

  if (!trendData || !peakData) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-2">Quiz Analytics</h1>
        <p className="text-muted text-sm">Monitor quiz engagement and performance trends over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Avg Score Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-on-surface dark:text-white">Quiz Avg Score Trend</h3>
            <select 
              value={trendPeriod}
              onChange={(e) => setTrendPeriod(e.target.value)}
              className="bg-surface text-on-surface dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="90d">Last 90 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          <div className="h-[250px] w-full mt-4">
            {trendData?.quiz_trend && trendData.quiz_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.quiz_trend} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="avg_score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#18181b', stroke: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#18181b', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : trendData ? (
              <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-gray-200 dark:border-white/10 rounded-xl">No sufficient data for this period</div>
            ) : (
              <div className="flex items-center justify-center h-full"><div className="spinner"></div></div>
            )}
          </div>
        </motion.div>

        {/* Peak Activity Times */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-on-surface dark:text-white">Peak Activity Times</h3>
            <select 
              value={peakPeriod}
              onChange={(e) => setPeakPeriod(e.target.value)}
              className="bg-surface text-on-surface dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="90d">Last 90 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          <div className="h-[250px] w-full mt-4">
            {peakData?.peak_times && peakData.peak_times.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakData.peak_times} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a1a1aa" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : peakData ? (
              <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-gray-200 dark:border-white/10 rounded-xl">No sufficient data for this period</div>
            ) : (
              <div className="flex items-center justify-center h-full"><div className="spinner"></div></div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
