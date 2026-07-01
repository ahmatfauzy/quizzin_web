import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Login from './pages/Login';
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
          <Route path="*" element={<Login setAuth={setAuth} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden text-white font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Topbar user={auth.user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
