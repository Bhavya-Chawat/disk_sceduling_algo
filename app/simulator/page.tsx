'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SimulationForm from '../../components/simulator/SimulationForm';
import EnhancedDiskVisual from '../../components/simulator/EnhancedDiskVisual';
import SimulationSummary from '../../components/simulator/SimulationSummary';
import DiskHeadAnimation from '../../components/simulator/DiskHeadAnimation';
import { runSimulation } from '../../lib/simulationRunner';
import { Algorithm, Direction, SimulationResult } from '../../lib/algorithms/types';

export default function SimulatorPage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [totalTracks, setTotalTracks] = useState(200);

  const handleSubmit = (data: {
    algorithm: Algorithm;
    requests: number[];
    initialHead: number;
    totalTracks: number;
    direction: Direction;
  }) => {
    try {
      const simulationResult = runSimulation(data.algorithm, {
        requests: data.requests,
        initialHead: data.initialHead,
        totalTracks: data.totalTracks,
        direction: data.direction,
      });
      setResult(simulationResult);
      setTotalTracks(data.totalTracks);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during simulation';
      alert(message);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Disk Scheduling Simulator
        </h1>
        <p className="text-gray-600 text-lg">
          Visualize and compare different disk scheduling algorithms
        </p>
      </motion.div>

      <SimulationForm onSubmit={handleSubmit} />

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <DiskHeadAnimation result={result} totalTracks={totalTracks} />
          <EnhancedDiskVisual result={result} totalTracks={totalTracks} />
          <SimulationSummary result={result} />
        </motion.div>
      )}

      {!result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="glass-card rounded-2xl p-12 inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
            />
            <p className="text-gray-500 text-lg">
              Configure simulation parameters and click Run to visualize
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}