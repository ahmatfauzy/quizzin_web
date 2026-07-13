import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconChevronLeft, IconLoader, IconAlertCircle, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const StudentDetail = () => {
  const { document_id, user_id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/documents/${document_id}/scanners`);
        const foundStudent = res.data.scanners.find(s => s.user_id === parseInt(user_id));
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          setError("Student not found for this document.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [document_id, user_id]);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      setInsightError(null);
      try {
        const res = await axios.get(`${API_URL}/documents/${document_id}/scanners/${user_id}/insights`);
        setInsights(res.data.insights);
      } catch (err) {
        console.error(err);
        setInsightError("Failed to generate AI insights.");
      } finally {
        setLoadingInsights(false);
      }
    };
    
    if (document_id && user_id) {
      fetchInsights();
    }
  }, [document_id, user_id]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <IconLoader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <IconAlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{error || "Data not found"}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-1 overflow-y-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/documents')}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted hover:text-white border border-white/10"
        >
          <IconChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Detail</h1>
          <p className="text-sm text-muted">Viewing results for document ID: {document_id}</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden shrink-0 ring-4 ring-primary/10">
            {student.avatar_url ? <img src={student.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{student.name}</h2>
            <p className="text-muted">{student.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center">
            <div className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Total Attempts</div>
            <div className="text-4xl font-bold text-white">{student.total_attempts}</div>
          </div>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center">
            <div className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Total Score</div>
            <div className="text-4xl font-bold text-primary">{student.total_score}</div>
          </div>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center">
            <div className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Average Mastery</div>
            <div className={`text-4xl font-bold ${student.average_mastery >= 80 ? 'text-green-400' : student.average_mastery >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {student.average_mastery.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <IconSparkles size={120} className="text-primary" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <IconSparkles size={24} className="text-primary" />
            AI Insights
          </h3>
          {loadingInsights ? (
            <div className="flex items-center gap-3 text-muted py-4">
              <IconLoader size={20} className="animate-spin text-primary" />
              <span>Generating AI insights based on student performance...</span>
            </div>
          ) : insightError ? (
            <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm">
              {insightError}
            </div>
          ) : insights && insights.length > 0 ? (
            <ul className="space-y-4">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex gap-3 text-white/90">
                  <div className="mt-1 text-primary shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  </div>
                  <p className="leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">No insights available for this student.</div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          Test History
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{student.attempts?.length || 0}</span>
        </h3>
        
        <div className="space-y-4">
          {student.attempts && student.attempts.length > 0 ? (
            student.attempts.map((attempt, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/20 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded">Test {idx + 1}</span>
                    <h4 className="text-white font-semibold text-lg">{attempt.chapter_title}</h4>
                  </div>
                  <div className="text-sm text-muted flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      {new Date(attempt.completed_at).toLocaleString()}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    <span className="capitalize px-2 py-0.5 rounded text-xs border border-white/10 bg-white/5">{attempt.difficulty}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-6 sm:gap-1 items-center sm:items-end sm:text-right border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
                  <div>
                    <div className="text-white font-bold text-2xl leading-none">{attempt.total_score}</div>
                    <div className="text-xs text-muted mt-1">points</div>
                  </div>
                  <div className="w-px h-8 bg-white/10 sm:hidden"></div>
                  <div>
                    <div className="text-white font-medium text-lg leading-none">{attempt.time_taken_seconds || 0}</div>
                    <div className="text-xs text-muted mt-1">seconds</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted border border-dashed border-white/10 rounded-xl bg-black/10">
              <p>No tests taken yet for this document.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDetail;
