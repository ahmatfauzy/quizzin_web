import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => (
  <div className="p-8 w-full h-full animate-pulse">
    <div className="h-8 bg-white/5 rounded-lg w-1/4 mb-4"></div>
    <div className="h-4 bg-white/5 rounded-lg w-1/3 mb-8"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="h-32 bg-white/5 rounded-2xl"></div>
      <div className="h-32 bg-white/5 rounded-2xl"></div>
      <div className="h-32 bg-white/5 rounded-2xl"></div>
      <div className="h-32 bg-white/5 rounded-2xl"></div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-2xl w-full"></div>
      <div className="h-64 bg-white/5 rounded-2xl w-full"></div>
    </div>
  </div>
);

export default SkeletonLoader;
