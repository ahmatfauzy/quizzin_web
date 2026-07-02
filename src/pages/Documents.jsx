import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IconFileText, IconTrash, IconEye, IconUpload, IconLoader, IconCheck, IconX, IconFile } from '@tabler/icons-react';
import SkeletonLoader from '../components/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userStr = localStorage.getItem('admin_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isGuru = user?.role === 'guru';

  // For Guru upload
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  
  // QR Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const endpoint = isGuru ? '/documents/' : '/admin/documents';
      const res = await axios.get(`${API_URL}${endpoint}`);
      setDocuments(res.data.documents || res.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    let interval;
    if (isGuru) {
      interval = setInterval(fetchDocuments, 5000);
    }
    return () => clearInterval(interval);
  }, [isGuru]);

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

  if (loading && documents.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Documents Management</h1>
        <p className="text-muted text-sm">
          {isGuru ? "Upload and manage your modules and generate QR codes." : "View and manage all uploaded documents across the platform."}
        </p>
      </motion.div>

      {isGuru && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Module</h2>
          {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
          
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
              <div className="relative border border-dashed border-white/20 rounded-lg p-2 px-4 text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface/50 h-[42px] flex items-center justify-center">
                <input 
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-sm text-white font-medium truncate">{file ? file.name : 'Select PDF File'}</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={uploading || !file || !title}
                className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {uploading ? <IconLoader className="animate-spin" size={20} /> : <IconUpload size={20} />}
                {uploading ? 'Uploading...' : 'Upload & Generate QR'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table / List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass overflow-hidden"
      >
        <div className="overflow-x-auto">
          {documents.length === 0 ? (
             <div className="py-12 text-center text-muted border border-dashed border-white/10 rounded-xl m-6">
               No documents found.
             </div>
          ) : isGuru ? (
             <div className="p-6 space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-white/10 bg-surface/30 hover:bg-surface/50 transition-colors">
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
                        <span className="text-muted">{doc.uploaded_label || new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center justify-center bg-white p-2 rounded-lg shrink-0 ${doc.status === 'ready' ? 'cursor-pointer hover:scale-105 transition-transform shadow-sm' : ''}`}
                      onClick={() => doc.status === 'ready' && setPreviewDoc(doc)}
                      title={doc.status === 'ready' ? "Click to enlarge QR Code" : ""}
                    >
                      {doc.status === 'ready' ? (
                        <div className="text-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=quizzin://document/${doc.id}`} 
                            alt="QR Code"
                            className="w-24 h-24 mb-1 pointer-events-none"
                          />
                          <span className="text-[10px] font-semibold text-gray-500">Scan to Join</span>
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex flex-col items-center justify-center bg-gray-100 rounded text-gray-400">
                          {doc.status === 'failed' ? <IconX size={24} className="text-red-400 mb-1" /> : <IconLoader size={24} className="animate-spin mb-1" />}
                          <span className="text-[10px] text-center px-1">{doc.status === 'failed' ? 'Failed' : 'Processing...'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-white/5">
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Document Title</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Owner</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Chapters</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Upload Date</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map((doc, i) => (
                    <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <IconFileText size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm max-w-xs truncate" title={doc.title}>{doc.title}</div>
                            <div className="text-xs text-muted">{doc.total_pages} pages</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-white text-sm">{doc.owner_name}</div>
                          <div className="text-xs text-muted">{doc.owner_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          doc.status === 'ready' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : doc.status === 'failed'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-white">
                        {doc.chapters_count}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted">
                        {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="View Document">
                            <IconEye size={18} />
                          </button>
                          <button className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete Document">
                            <IconTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          )}
        </div>
      </motion.div>

      {/* QR Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full relative cursor-default"
            >
              <button 
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
              >
                <IconX size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center px-6">{previewDoc.title}</h3>
              <p className="text-sm text-gray-500 mb-6 text-center">Scan this QR code to join the quiz directly from the mobile app</p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=quizzin://document/${previewDoc.id}`} 
                  alt="Large QR Code"
                  className="w-64 h-64"
                />
              </div>
              
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Quizzin App</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
