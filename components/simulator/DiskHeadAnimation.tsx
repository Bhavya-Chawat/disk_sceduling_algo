'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SimulationResult } from '../../lib/algorithms/types';

interface DiskHeadAnimationProps {
  result: SimulationResult;
  totalTracks: number;
}

export default function DiskHeadAnimation({ result, totalTracks }: DiskHeadAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= result.sequence.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, result.sequence.length, speed]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentPosition = result.sequence[currentStep];
  const positionPercent = (currentPosition / (totalTracks - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Disk Head Animation</span>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                className="bg-gradient-to-r from-green-400 to-green-600"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline" className="glass">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Speed control */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Animation Speed:</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">{(1000 / speed).toFixed(1)}x</span>
            </div>

            {/* Disk visualization */}
            <div className="relative h-32 glass-card rounded-xl p-6 overflow-hidden">
              {/* Track line */}
              <div className="absolute top-1/2 left-4 right-4 h-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full transform -translate-y-1/2" />

              {/* Request markers */}
              {result.sequence.slice(1).map((track, idx) => {
                const percent = (track / (totalTracks - 1)) * 100;
                const isVisited = idx < currentStep;
                return (
                  <motion.div
                    key={`marker-${idx}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 transform -translate-y-1/2"
                    style={{ left: `calc(1rem + ${percent}% - 0.25rem)` }}
                  >
                    <div
                      className={`w-2 h-8 rounded transition-colors ${
                        isVisited ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  </motion.div>
                );
              })}

              {/* Disk head */}
              <motion.div
                animate={{ left: `calc(1rem + ${positionPercent}%)` }}
                transition={{ duration: speed / 1000, ease: 'easeInOut' }}
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg border-2 border-white"
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                  {currentPosition}
                </div>
              </motion.div>
            </div>

            {/* Step info */}
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Step: </span>
                  <span className="font-bold text-lg">
                    {currentStep + 1} / {result.sequence.length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Position: </span>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {currentPosition}
                  </span>
                </div>
                {currentStep < result.steps.length && (
                  <div>
                    <span className="text-sm text-gray-600">Seek Distance: </span>
                    <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {currentStep === 0 ? 0 : result.steps[currentStep - 1].seekTime} <span className="text-sm">tracks</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}