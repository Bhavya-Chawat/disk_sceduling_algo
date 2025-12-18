'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Code, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { SimulationResult } from '../../lib/algorithms/types';

interface SimulationSummaryProps {
  result: SimulationResult;
}

const algorithmInfo: Record<string, { description: string; code: string; complexity: string }> = {
  FCFS: {
    description: 'First Come First Serve (FCFS) processes disk requests in the order they arrive. Simple but can lead to high seek times if requests are scattered.',
    code: `function fcfs(requests, initialHead) {
  let currentHead = initialHead;
  let totalSeek = 0;
  
  for (const request of requests) {
    totalSeek += Math.abs(request - currentHead);
    currentHead = request;
  }
  
  return totalSeek;
}`,
    complexity: 'Time: O(n) | Space: O(1)'
  },
  SSTF: {
    description: 'Shortest Seek Time First (SSTF) selects the request closest to the current head position. Reduces seek time but can cause starvation.',
    code: `function sstf(requests, initialHead) {
  let currentHead = initialHead;
  let remaining = [...requests];
  let totalSeek = 0;
  
  while (remaining.length > 0) {
    let minDist = Infinity;
    let minIndex = 0;
    
    for (let i = 0; i < remaining.length; i++) {
      const dist = Math.abs(remaining[i] - currentHead);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
    }
    
    totalSeek += minDist;
    currentHead = remaining[minIndex];
    remaining.splice(minIndex, 1);
  }
  
  return totalSeek;
}`,
    complexity: 'Time: O(n²) | Space: O(n)'
  },
  SCAN: {
    description: 'SCAN (Elevator Algorithm) moves in one direction servicing requests until the end, then reverses. Provides uniform wait times.',
    code: `function scan(requests, initialHead, direction, totalTracks) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initialHead);
  const right = sorted.filter(r => r >= initialHead);
  
  let path = [];
  if (direction === 'right') {
    path = [...right, totalTracks - 1, ...left.reverse()];
  } else {
    path = [...left.reverse(), 0, ...right];
  }
  
  return calculateSeek(path, initialHead);
}`,
    complexity: 'Time: O(n log n) | Space: O(n)'
  },
  'C-SCAN': {
    description: 'Circular SCAN moves in one direction, jumps back to the start, and continues. Provides more uniform wait times than SCAN.',
    code: `function cscan(requests, initialHead, direction, totalTracks) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initialHead);
  const right = sorted.filter(r => r >= initialHead);
  
  let path = [];
  if (direction === 'right') {
    path = [...right, totalTracks - 1, 0, ...left];
  } else {
    path = [...left.reverse(), 0, totalTracks - 1, ...right.reverse()];
  }
  
  return calculateSeek(path, initialHead);
}`,
    complexity: 'Time: O(n log n) | Space: O(n)'
  },
  LOOK: {
    description: 'LOOK is similar to SCAN but only goes as far as the last request in each direction, without reaching the end of the disk.',
    code: `function look(requests, initialHead, direction) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initialHead);
  const right = sorted.filter(r => r >= initialHead);
  
  let path = [];
  if (direction === 'right') {
    path = [...right, ...left.reverse()];
  } else {
    path = [...left.reverse(), ...right];
  }
  
  return calculateSeek(path, initialHead);
}`,
    complexity: 'Time: O(n log n) | Space: O(n)'
  },
  'C-LOOK': {
    description: 'Circular LOOK is like C-SCAN but only goes to the last request before jumping back, avoiding unnecessary movement to disk ends.',
    code: `function clook(requests, initialHead, direction) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initialHead);
  const right = sorted.filter(r => r >= initialHead);
  
  let path = [];
  if (direction === 'right') {
    path = [...right, ...left];
  } else {
    path = [...left.reverse(), ...right.reverse()];
  }
  
  return calculateSeek(path, initialHead);
}`,
    complexity: 'Time: O(n log n) | Space: O(n)'
  }
};

export default function SimulationSummary({ result }: SimulationSummaryProps) {
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const info = algorithmInfo[result.algorithm];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Performance Metrics
              </div>
              <Button
                onClick={() => setShowAlgorithmInfo(true)}
                variant="outline"
                className="glass"
              >
                <Code className="w-4 h-4 mr-2" />
                View Algorithm
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="text-sm text-gray-600 mb-2">Algorithm</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {result.algorithm}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="text-sm text-gray-600 mb-2">Total Seek Time</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {result.totalSeekTime} <span className="text-lg">tracks</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="text-sm text-gray-600 mb-2">Average Seek Time</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
                  {result.averageSeekTime.toFixed(2)} <span className="text-lg">tracks</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 glass-card p-6 rounded-xl">
              <h4 className="font-semibold mb-3 text-lg">Step-by-Step Breakdown</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center justify-between p-3 glass rounded-lg"
                  >
                    <span className="text-sm">
                      <span className="font-semibold text-blue-600">Step {idx + 1}:</span> {step.from} → {step.to}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full text-xs font-semibold">
                      +{step.seekTime} tracks
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showAlgorithmInfo && info && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAlgorithmInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              <div className="p-6 border-b flex items-center justify-between sticky top-0 glass-card">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-500" />
                  {result.algorithm} Algorithm
                </h2>
                <Button
                  onClick={() => setShowAlgorithmInfo(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-600">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{info.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">Complexity</h3>
                  <div className="glass-card p-4 rounded-lg font-mono text-sm">
                    {info.complexity}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">Implementation</h3>
                  <pre className="glass-card p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-gray-800">{info.code}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}