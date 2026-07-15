import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import GuruDashboard from './pages/GuruDashboard';
import Users from './pages/Users';
import Documents from './pages/Documents';
import QuizAnalytics from './pages/QuizAnalytics';
import GlobalTrends from './pages/GlobalTrends';
import Login from './pages/Login';
import RegisterGuru from './pages/RegisterGuru';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/Kebijakan';
import StudentDetail from './pages/StudentDetail';
import './index.css';

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    return {
      token: token || null,
      user: userStr ? JSON.parse(userStr) : null
    };
  });
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme Management
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return false; // Default to light mode
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, [auth.token]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAuth({ token: null, user: null });
  };

  if (!auth.token) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register-guru" element={<RegisterGuru />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden text-on-surface font-sans antialiased relative">
        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <Sidebar isOpenMobile={isMobileSidebarOpen} setIsOpenMobile={setMobileSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden relative w-full">
          <Topbar 
            user={auth.user} 
            onLogout={handleLogout} 
            onMenuClick={() => setMobileSidebarOpen(true)} 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
          />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={auth.user?.role === 'guru' ? <GuruDashboard /> : <Dashboard />} />
              <Route path="/users" element={auth.user?.role === 'guru' ? <Navigate to="/" /> : <Users />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:document_id/scanners/:user_id" element={<StudentDetail />} />
              <Route path="/quiz-analytics" element={<QuizAnalytics />} />
              <Route path="/global-trends" element={<GlobalTrends />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
