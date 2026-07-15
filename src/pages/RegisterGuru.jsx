import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const RegisterGuru = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/register-guru`, { 
        full_name: fullName,
        email, 
        password 
      });
      
      setSuccess('Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk verifikasi.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/[0.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-500/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <img src="/logo/logoblue.png" alt="Quizzin" className="h-16 object-contain mx-auto mb-6" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Daftar Mitra Guru</h2>
          <p className="text-gray-500 mb-10 text-center">Bergabung dan kelola kuis Anda</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-8 text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl text-sm mb-8 text-center"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-[15px]"
                placeholder="Budi Santoso" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-[15px]"
                placeholder="guru@quizzin.com" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-[15px]"
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-white rounded-xl px-5 py-3.5 font-semibold text-[15px] hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading || success !== ''}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mendaftar...
                </span>
              ) : 'Daftar Sekarang'}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <a href="/login" className="text-primary font-semibold hover:underline">
                  Login di sini
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterGuru;
