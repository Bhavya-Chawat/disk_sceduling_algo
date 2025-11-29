'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SimulationResult } from '@/lib/algorithms/types';

interface ComparisonChartProps {
  results: SimulationResult[];
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  const maxSeek = Math.max(...results.map(r => r.totalSeekDistance));
  
  const getAlgorithmColor = (algo: string) => {
    const colors: Record<string, string> = {
      'FCFS': 'from-[#06b6d4] to-[#06b6d4]/50',
      'SSTF': 'from-[#8b5cf6] to-[#8b5cf6]/50',
      'SCAN': 'from-[#10b981] to-[#10b981]/50',
      'C-SCAN': 'from-[#f59e0b] to-[#f59e0b]/50',
      'LOOK': 'from-[#ec4899] to-[#ec4899]/50',
      'C-LOOK': 'from-[#f97316] to-[#f97316]/50',
    };
    return colors[algo] || 'from-gray-400 to-gray-400/50';
  };

  const getAlgorithmTextColor = (algo: string) => {
    const colors: Record<string, string> = {
      'FCFS': 'text-[#06b6d4]',
      'SSTF': 'text-[#8b5cf6]',
      'SCAN': 'text-[#10b981]',
      'C-SCAN': 'text-[#f59e0b]',
      'LOOK': 'text-[#ec4899]',
      'C-LOOK': 'text-[#f97316]',
    };
    return colors[algo] || 'text-gray-400';
  };

  return (
    <div className="glass-panel-strong p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Total Seek Distance Comparison
      </h2>
      
      <div className="space-y-6">
        {results.map((result, index) => (
          <motion.div
            key={result.algorithm}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className={`font-semibold text-lg ${getAlgorithmTextColor(result.algorithm)}`}>
                {result.algorithm}
              </span>
              <span className="text-2xl font-bold text-white">
                {result.totalSeekDistance}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-10 bg-white/5 rounded-full overflow-hidden relative backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(result.totalSeekDistance / maxSeek) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getAlgorithmColor(result.algorithm)} relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            
            {/* Additional metrics */}
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Avg: {result.averageSeekDistance.toFixed(2)}</span>
              <span>Max: {result.maxSeekDistance}</span>
              <span>Variance: {result.variance.toFixed(2)}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: results.length * 0.1 + 0.3 }}
        className="mt-8 p-4 glass-panel rounded-lg border border-disk-primary-400/20"
      >
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span className="text-disk-primary-400">ℹ️</span>
          Lower seek distance indicates better performance
        </div>
      </motion.div>
    </div>
  );
}
