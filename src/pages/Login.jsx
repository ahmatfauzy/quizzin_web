import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconDeviceDesktopAnalytics } from '@tabler/icons-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { access_token, user } = res.data;
      
      if (user.role !== 'admin' && user.role !== 'guru') {
        setError('Access denied. Admin or Guru only.');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      setAuth({ token: access_token, user: user });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="card-glass p-8 mx-4">
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/logo/logoblue.png" alt="Quizzin" className="h-12 object-contain dark:hidden block" />
              <img src="/logo/logowhite.png" alt="Quizzin" className="h-12 object-contain hidden dark:block" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-muted text-sm">Sign in to Quizzin Admin Dashboard</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="admin@quizzin.com" 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
