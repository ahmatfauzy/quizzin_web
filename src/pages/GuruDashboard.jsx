import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconFile, IconCheck, IconLoader } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL;

const GuruDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Quizzin Dashboard";
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`${API_URL}/documents/`);
        setDocuments(res.data.documents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) return <SkeletonLoader />;

  const readyDocs = documents.filter(d => d.status === 'ready').length;
  const processingDocs = documents.filter(d => d.status === 'processing').length;
  const recentDocs = documents.slice(0, 3); // top 3 recent

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-2">Guru Dashboard</h1>
        <p className="text-muted text-sm">Overview of your modules and recent activities.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-glass p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Total Modules</p>
            <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{documents.length}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20"><IconFile className="text-primary" size={24} /></div>
        </div>
        <div className="card-glass p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Ready for Quiz</p>
            <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{readyDocs}</h3>
          </div>
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20"><IconCheck className="text-green-400" size={24} /></div>
        </div>
        <div className="card-glass p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Processing</p>
            <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{processingDocs}</h3>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20"><IconLoader className="text-yellow-400" size={24} /></div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-on-surface dark:text-white">Recently Documents</h2>
        </div>
        
        {recentDocs.length === 0 ? (
          <div className="text-center p-8 text-muted border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
            No modules uploaded yet. Go to Documents Management to add one.
          </div>
        ) : (
          <div className="space-y-4">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-surface/30">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-medium text-on-surface dark:text-white mb-1">{doc.title}</h3>
                  <p className="text-sm text-muted flex items-center gap-2 mb-2">
                    <IconFile size={16} />
                    {doc.original_filename}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-auto">
                    <span className={`px-2 py-1 rounded-full border ${
                      doc.status === 'ready' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                      doc.status === 'failed' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                      'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                    }`}>
                      {doc.status.toUpperCase()}
                    </span>
                    <span className="text-muted">{doc.uploaded_label || new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GuruDashboard;
