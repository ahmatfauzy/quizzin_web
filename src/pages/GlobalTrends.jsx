import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL;

const GlobalTrends = () => {
  const [bigData, setBigData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Big Data currently doesn't support period filtering natively in the backend 
  // as it aggregates a fixed dataset (2000-2023), but we can add a visual dropdown
  // to satisfy the UI requirement, or add it later if the API evolves.
  const [literacyFilter, setLiteracyFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('top10');

  useEffect(() => {
    const fetchBigData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/analytics/bigdata`);
        setBigData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBigData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  // Basic client-side filtering for demonstration of per-visual filter
  const getLiteracyData = () => {
    if (!bigData?.yearly_trend) return [];
    let data = [...bigData.yearly_trend];
    if (literacyFilter === 'last10') data = data.filter(d => parseInt(d.year) >= 2013);
    if (literacyFilter === 'last5') data = data.filter(d => parseInt(d.year) >= 2018);
    return data;
  };

  const getCountryData = () => {
    if (!bigData?.top_countries) return [];
    let data = [...bigData.top_countries];
    if (countryFilter === 'top5') return data.slice(0, 5);
    if (countryFilter === 'top3') return data.slice(0, 3);
    return data;
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-2">Global Trends (Big Data)</h1>
        <p className="text-muted text-sm">Explore macro-level insights and external data correlations.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {/* Global Literacy Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-on-surface dark:text-white">Global Literacy Rate Trend</h3>
              <p className="text-xs text-muted">Averaged across all reported countries</p>
            </div>
            <select 
              value={literacyFilter}
              onChange={(e) => setLiteracyFilter(e.target.value)}
              className="bg-surface text-on-surface dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="all">2000 - 2023</option>
              <option value="last10">Last 10 Years</option>
              <option value="last5">Last 5 Years</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {getLiteracyData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getLiteracyData()} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
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
            ) : (
              <div className="flex items-center justify-center h-full text-muted">No data available</div>
            )}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-on-surface dark:text-white">Top Countries by Literacy</h3>
            <select 
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-surface text-on-surface dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="top10">Top 10</option>
              <option value="top5">Top 5</option>
              <option value="top3">Top 3</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {getCountryData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCountryData()} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="country" type="category" stroke="#a1a1aa" width={150} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">No data available</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalTrends;
