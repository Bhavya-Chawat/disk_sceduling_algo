'use client';

import { motion } from 'framer-motion';
import { SimulationResult } from '../../lib/algorithms/types';

interface DiskTrackVisualProps {
  result: SimulationResult;
  totalTracks: number;
}

export default function DiskTrackVisual({ result, totalTracks }: DiskTrackVisualProps) {
  const { sequence } = result;
  const maxTrack = totalTracks - 1;

  const getPositionPercent = (track: number) => {
    return (track / maxTrack) * 100;
  };

  // Filter out closely positioned elements to prevent overlap
  const filteredSequence = sequence.filter((track, idx) => {
    if (idx === 0) return true; // Always include first element
    const prevTrack = sequence[idx - 1];
    const distance = Math.abs(track - prevTrack);
    // Only show if distance is significant or it's the last element
    return distance > Math.max(5, maxTrack * 0.05) || idx === sequence.length - 1;
  });

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-green-400 to-green-600',
    'from-cyan-400 to-cyan-600',
  ];

  return (
    <div className="space-y-6">
      {/* Track Scale */}
      <div className="relative h-20 glass-card rounded-xl p-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full transform -translate-y-1/2" />
        
        {/* Track markers */}
        <div className="relative h-full">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${percent}%` }}
            >
              <div className="w-0.5 h-4 bg-gray-400 mb-1" />
              <span className="text-xs text-gray-500 block -ml-2">
                {Math.round((percent / 100) * maxTrack)}
              </span>
            </div>
          ))}
        </div>

        {/* Head positions - with spacing improvement */}
        {filteredSequence.map((track, idx) => {
          const originalIndex = sequence.indexOf(track);
          return (
            <motion.div
              key={`${track}-${originalIndex}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: originalIndex * 0.1 }}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${getPositionPercent(track)}%` }}
            >
              <motion.div
                whileHover={{ scale: 1.3 }}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                  colors[originalIndex % colors.length]
                } flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer`}
              >
                {track}
              </motion.div>
              {originalIndex === 0 && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 whitespace-nowrap">
                  Start
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Path visualization */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-lg">Seek Sequence</h3>
        <div className="flex flex-wrap gap-2">
          {sequence.map((track, idx) => (
            <motion.div
              key={`seq-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-2"
            >
              <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colors[idx % colors.length]} text-white font-medium shadow-md`}>
                {track}
              </div>
              {idx < sequence.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className="text-gray-400"
                >
                  →
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}