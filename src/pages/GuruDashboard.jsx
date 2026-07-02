import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconUpload, IconFile, IconCheck, IconX, IconLoader } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const GuruDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/documents/`);
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    // Auto-refresh periodically to update status of processing documents
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Title and file are required');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    
    try {
      setUploading(true);
      setError('');
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTitle('');
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Guru Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="card-glass p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Module</h2>
            {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted block mb-1">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Chapter 1: Introduction"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted block mb-1">PDF File</label>
                <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface/50 relative">
                  <input 
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <IconUpload size={32} className="text-muted mb-2" />
                    <span className="text-sm text-white font-medium">{file ? file.name : 'Select PDF File'}</span>
                    <span className="text-xs text-muted mt-1">Max size: 10MB</span>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={uploading || !file || !title}
                className="btn-primary w-full mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {uploading ? <IconLoader className="animate-spin" size={20} /> : <IconFile size={20} />}
                {uploading ? 'Uploading...' : 'Upload & Generate QR'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Document List & QRs */}
        <div className="lg:col-span-2">
          <div className="card-glass p-6 min-h-full">
            <h2 className="text-xl font-semibold text-white mb-6">Your Modules & QR Codes</h2>
            
            {loading && documents.length === 0 ? (
              <div className="flex justify-center p-8"><IconLoader className="animate-spin text-primary" size={32} /></div>
            ) : documents.length === 0 ? (
              <div className="text-center p-8 text-muted border border-dashed border-white/10 rounded-xl">
                No modules uploaded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={doc.id} 
                    className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-white/10 bg-surface/30 hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-medium text-white mb-1">{doc.title}</h3>
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
                        <span className="text-muted">{doc.uploaded_label}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center bg-white p-2 rounded-lg shrink-0">
                      {doc.status === 'ready' ? (
                        <div className="text-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=quizzin://document/${doc.id}`} 
                            alt="QR Code"
                            className="w-32 h-32 mb-1"
                          />
                          <span className="text-xs font-semibold text-gray-500">Scan to Join</span>
                        </div>
                      ) : (
                        <div className="w-32 h-32 flex flex-col items-center justify-center bg-gray-100 rounded text-gray-400">
                          {doc.status === 'failed' ? <IconX size={32} className="text-red-400 mb-2" /> : <IconLoader size={32} className="animate-spin mb-2" />}
                          <span className="text-xs text-center px-2">{doc.status === 'failed' ? 'Failed' : 'Processing...'}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuruDashboard;
