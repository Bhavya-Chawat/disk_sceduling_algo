'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SimulationResult } from '@/lib/algorithms/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SimulationSummaryProps {
  results: SimulationResult[];
}

export function SimulationSummary({ results }: SimulationSummaryProps) {
  // Sort results by total seek distance to find winner
  const sortedResults = [...results].sort((a, b) => a.totalSeekDistance - b.totalSeekDistance);
  const winner = sortedResults[0];
  const worst = sortedResults[sortedResults.length - 1];

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-strong rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-disk-primary-400/20">
          <h2 className="text-2xl font-bold text-white">Algorithm Comparison Table</h2>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-b border-disk-primary-400/20 hover:bg-transparent">
              <TableHead className="text-disk-primary-400 font-semibold">Algorithm</TableHead>
              <TableHead className="text-disk-primary-400 font-semibold">Total Seek</TableHead>
              <TableHead className="text-disk-primary-400 font-semibold">Avg Seek</TableHead>
              <TableHead className="text-disk-primary-400 font-semibold">Max Seek</TableHead>
              <TableHead className="text-disk-primary-400 font-semibold">Variance</TableHead>
              <TableHead className="text-disk-primary-400 font-semibold">Requests</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result, idx) => (
              <TableRow
                key={result.algorithm}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  idx === 0 ? 'bg-status-active/10' : ''
                }`}
              >
                <TableCell className="font-semibold text-white">
                  {result.algorithm}
                  {idx === 0 && <span className="ml-2 text-status-active">👑</span>}
                </TableCell>
                <TableCell className="font-mono text-disk-primary-400 font-bold">
                  {result.totalSeekDistance}
                </TableCell>
                <TableCell className="font-mono text-gray-300">
                  {result.averageSeekDistance.toFixed(2)}
                </TableCell>
                <TableCell className="font-mono text-gray-300">
                  {result.maxSeekDistance}
                </TableCell>
                <TableCell className="font-mono text-gray-300">
                  {result.variance.toFixed(2)}
                </TableCell>
                <TableCell className="font-mono text-gray-400">
                  {result.requestsProcessed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Winner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel-strong p-8 rounded-2xl border-2 border-status-active/50 relative overflow-hidden"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-status-active/10 to-transparent"
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              👑
            </motion.span>
            <h3 className="text-2xl font-bold text-white">Best Performer</h3>
          </div>
          
          <div className="text-4xl font-bold text-status-active mb-2">
            {winner.algorithm}
          </div>
          
          <p className="text-gray-300 mb-4">
            Achieved the lowest total seek distance of <span className="font-bold text-status-active">{winner.totalSeekDistance}</span> cylinders
          </p>
          
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-status-active/20 text-status-active text-sm font-medium">
              {winner.averageSeekDistance.toFixed(2)} avg seek
            </span>
            <span className="px-3 py-1 rounded-full bg-disk-primary-400/20 text-disk-primary-400 text-sm font-medium">
              {((1 - winner.totalSeekDistance / worst.totalSeekDistance) * 100).toFixed(1)}% better than worst
            </span>
            <span className="px-3 py-1 rounded-full bg-disk-purple-400/20 text-disk-purple-400 text-sm font-medium">
              {winner.requestsProcessed} requests processed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-xl"
        >
          <div className="text-sm text-gray-400 mb-2">Best Average Seek</div>
          <div className="text-2xl font-bold text-disk-primary-400">
            {Math.min(...results.map(r => r.averageSeekDistance)).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">cylinders per request</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-xl"
        >
          <div className="text-sm text-gray-400 mb-2">Lowest Variance</div>
          <div className="text-2xl font-bold text-disk-purple-400">
            {Math.min(...results.map(r => r.variance)).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">most consistent</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-xl"
        >
          <div className="text-sm text-gray-400 mb-2">Algorithms Compared</div>
          <div className="text-2xl font-bold text-status-completed">
            {results.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">total comparisons</div>
        </motion.div>
      </div>
    </div>
  );
}