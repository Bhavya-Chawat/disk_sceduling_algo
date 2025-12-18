"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SimulationResult } from "../../lib/algorithms/types";

interface EnhancedDiskVisualProps {
  result: SimulationResult;
  totalTracks: number;
}

const algorithmTheory: Record<
  string,
  {
    definition: string;
    howItWorks: string[];
    advantages: string[];
    disadvantages: string[];
    bestFor: string;
    timeComplexity: string;
    example: string;
  }
> = {
  FCFS: {
    definition:
      "First Come First Serve (FCFS) is the simplest disk scheduling algorithm that services requests in the order they arrive in the disk queue.",
    howItWorks: [
      "1. Requests are serviced in the exact order they arrive",
      "2. The disk head moves from current position to the first request",
      "3. Then moves to the second request, and so on",
      "4. No consideration of seek time optimization",
      "5. Simple queue-based processing",
    ],
    advantages: [
      "Very simple to implement and understand",
      "Fair - every request gets serviced in order",
      "No starvation - all requests eventually get serviced",
      "No overhead for scheduling decisions",
    ],
    disadvantages: [
      "Can result in very high seek times",
      "Not optimal for performance",
      "Wild swings in head movement if requests are scattered",
      "Poor throughput compared to other algorithms",
    ],
    bestFor: "Simple systems where fairness is more important than performance",
    timeComplexity: "O(n) where n is the number of requests",
    example:
      "If requests are [98, 183, 37] and head is at 50, it goes: 50→98→183→37 (total seek = 48+85+146 = 279)",
  },
  SSTF: {
    definition:
      "Shortest Seek Time First (SSTF) selects the request that is closest to the current head position, minimizing seek time for each individual request.",
    howItWorks: [
      "1. From current head position, find the closest unserviced request",
      "2. Move to that request and service it",
      "3. From new position, again find the closest unserviced request",
      "4. Repeat until all requests are serviced",
      "5. Greedy approach - optimizes each individual move",
    ],
    advantages: [
      "Better throughput than FCFS",
      "Lower average seek time",
      "Good performance in most cases",
      "Reduces wild head movements",
    ],
    disadvantages: [
      "Can cause starvation of requests far from current head",
      "Not optimal overall (greedy approach)",
      "Unfair - some requests may wait very long",
      "Higher overhead for finding nearest request",
    ],
    bestFor:
      "Systems where performance is important but some unfairness is acceptable",
    timeComplexity: "O(n²) - need to find minimum distance for each step",
    example:
      "Requests [98, 183, 37] at head 50: Goes to 37 (nearest), then 98, then 183 (total seek = 13+61+85 = 159)",
  },
  SCAN: {
    definition:
      "SCAN (Elevator Algorithm) moves the head in one direction servicing requests until it reaches the end of the disk, then reverses direction.",
    howItWorks: [
      "1. Choose an initial direction (left or right)",
      "2. Service all requests in that direction until reaching the disk end",
      "3. Reverse direction",
      "4. Service all remaining requests in the opposite direction",
      "5. Like an elevator moving up and down",
    ],
    advantages: [
      "Better than SSTF - no starvation",
      "Provides uniform wait times",
      "Good for heavy loads",
      "Predictable behavior",
    ],
    disadvantages: [
      "Must travel to end of disk even if no requests there",
      "Requests at edges may wait longer",
      "Slightly longer seek time than SSTF in some cases",
    ],
    bestFor: "Systems with moderate to heavy disk usage requiring fairness",
    timeComplexity: "O(n log n) for sorting requests",
    example:
      "Requests [98, 183, 37] at 50 going right: 50→98→183→199(end)→37 (total seek = 48+85+16+162 = 311)",
  },
  "C-SCAN": {
    definition:
      "Circular SCAN (C-SCAN) moves in one direction, and when it reaches the end, it jumps back to the beginning and continues in the same direction.",
    howItWorks: [
      "1. Service requests moving in one direction only",
      "2. When reaching the end, jump back to the start",
      "3. Continue servicing in the same direction",
      "4. Treat disk as circular",
      "5. More uniform wait times than SCAN",
    ],
    advantages: [
      "More uniform wait times than SCAN",
      "No bias towards middle tracks",
      "Better for heavy loads",
      "Predictable service time",
    ],
    disadvantages: [
      "Must travel to both ends even without requests",
      "Return trip has no service (wasted movement)",
      "Slightly more seek time than SCAN",
    ],
    bestFor: "Systems requiring very uniform response times",
    timeComplexity: "O(n log n) for sorting requests",
    example:
      "Requests [98, 183, 37] at 50 going right: 50→98→183→199(end)→0→37 (total seek = 48+85+16+199+37 = 385)",
  },
  LOOK: {
    definition:
      "LOOK is similar to SCAN but only goes as far as the last request in each direction, not to the end of the disk.",
    howItWorks: [
      "1. Move in one direction servicing requests",
      "2. When reaching the last request in that direction, reverse",
      "3. No need to go to the physical end of disk",
      "4. Service requests in opposite direction",
      "5. More efficient than SCAN",
    ],
    advantages: [
      "More efficient than SCAN - no wasted movement to disk end",
      "Better average seek time",
      "Still provides fairness",
      "No starvation",
    ],
    disadvantages: [
      "Slightly more complex than SCAN",
      "Still has some directional bias",
    ],
    bestFor:
      "Most modern disk systems - good balance of performance and fairness",
    timeComplexity: "O(n log n) for sorting requests",
    example:
      "Requests [98, 183, 37] at 50 going right: 50→98→183→37 (total seek = 48+85+146 = 279)",
  },
  "C-LOOK": {
    definition:
      "Circular LOOK (C-LOOK) is like C-SCAN but only goes to the last request before jumping back, combining efficiency of LOOK with uniformity of C-SCAN.",
    howItWorks: [
      "1. Service requests in one direction to the last request",
      "2. Jump to the first request in the opposite end",
      "3. Continue in the same direction",
      "4. Most efficient circular algorithm",
      "5. No wasted movement",
    ],
    advantages: [
      "Most efficient algorithm overall",
      "Uniform wait times like C-SCAN",
      "No wasted movement to disk ends",
      "Best of both LOOK and C-SCAN",
    ],
    disadvantages: [
      "Most complex to implement",
      "Still has a jump back (though shorter)",
    ],
    bestFor: "High-performance systems requiring both efficiency and fairness",
    timeComplexity: "O(n log n) for sorting requests",
    example:
      "Requests [98, 183, 37] at 50 going right: 50→98→183→37 (jumps to start) (total seek = 48+85+146 = 279)",
  },
};

export default function EnhancedDiskVisual({
  result,
  totalTracks,
}: EnhancedDiskVisualProps) {
  const [showTheory, setShowTheory] = useState(false);
  const theory = algorithmTheory[result.algorithm];

  const { sequence } = result;
  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#f43f5e",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
  ];

  // Calculate positions for the track diagram
  const minTrack = 0;
  const maxTrack = totalTracks - 1;
  const getXPosition = (track: number) => {
    return ((track - minTrack) / (maxTrack - minTrack)) * 100;
  };

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
              <span>Enhanced Track Visualization</span>
              <Button
                onClick={() => setShowTheory(true)}
                className="bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Theory
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Track Diagram */}
              <div className="glass-card rounded-xl p-8">
                <div className="relative" style={{ height: "400px" }}>
                  {/* Vertical track lines */}
                  {sequence.map((track, idx) => {
                    const xPos = getXPosition(track);
                    return (
                      <motion.div
                        key={`line-${idx}`}
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ delay: idx * 0.1 }}
                        className="absolute bottom-0 w-0.5 bg-gray-300"
                        style={{ left: `${xPos}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                          {track}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Movement path */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ overflow: "visible" }}
                  >
                    {sequence.slice(0, -1).map((track, idx) => {
                      const nextTrack = sequence[idx + 1];
                      const x1 = getXPosition(track);
                      const x2 = getXPosition(nextTrack);
                      const y1 = 350 - idx * 30;
                      const y2 = 350 - (idx + 1) * 30;

                      return (
                        <motion.g key={`path-${idx}`}>
                          <motion.line
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: idx * 0.2, duration: 0.5 }}
                            x1={`${x1}%`}
                            y1={y1}
                            x2={`${x2}%`}
                            y2={y2}
                            stroke={colors[idx % colors.length]}
                            strokeWidth="3"
                            markerEnd="url(#arrowhead)"
                          />

                          {/* Seek distance label */}
                          <motion.text
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.2 + 0.3 }}
                            x={`${(x1 + x2) / 2}%`}
                            y={(y1 + y2) / 2 - 10}
                            textAnchor="middle"
                            className="text-xs font-bold fill-gray-700"
                          >
                            {Math.abs(nextTrack - track)} tracks
                          </motion.text>
                        </motion.g>
                      );
                    })}

                    {/* Arrow marker definition */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="#666" />
                      </marker>
                    </defs>
                  </svg>

                  {/* Position markers */}
                  {sequence.map((track, idx) => {
                    const xPos = getXPosition(track);
                    const yPos = 350 - idx * 30;

                    return (
                      <motion.div
                        key={`marker-${idx}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.2 }}
                        className="absolute"
                        style={{
                          left: `${xPos}%`,
                          top: `${yPos}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${
                              colors[idx % colors.length]
                            }, ${colors[(idx + 1) % colors.length]})`,
                          }}
                        >
                          {idx}
                        </div>
                        {idx === 0 && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
                            Start
                          </div>
                        )}
                        {idx === sequence.length - 1 && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 whitespace-nowrap">
                            End
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Scale reference */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">Track Range: </span>
                    <span className="font-bold">0 - {maxTrack} tracks</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Distance: </span>
                    <span className="font-bold text-orange-500">
                      {result.totalSeekTime} tracks
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Algorithm: </span>
                    <span className="font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      {result.algorithm}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theory Modal */}
      <AnimatePresence>
        {showTheory && theory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTheory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl my-8"
            >
              <div className="p-6 border-b flex items-center justify-between sticky top-0 glass-card z-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {result.algorithm} - Detailed Theory
                </h2>
                <Button
                  onClick={() => setShowTheory(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-8 space-y-8">
                {/* Definition */}
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">
                    📚 Definition
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {theory.definition}
                  </p>
                </div>

                {/* How It Works */}
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-purple-600">
                    ⚙️ How It Works
                  </h3>
                  <div className="space-y-3">
                    {theory.howItWorks.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 text-lg pt-1">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Advantages */}
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4 text-green-600">
                      ✅ Advantages
                    </h3>
                    <ul className="space-y-2">
                      {theory.advantages.map((adv, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-3 items-start text-gray-700"
                        >
                          <span className="text-green-500 text-xl">•</span>
                          <span>{adv}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Disadvantages */}
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4 text-red-600">
                      ❌ Disadvantages
                    </h3>
                    <ul className="space-y-2">
                      {theory.disadvantages.map((dis, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-3 items-start text-gray-700"
                        >
                          <span className="text-red-500 text-xl">•</span>
                          <span>{dis}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best For */}
                <div className="glass-card p-6 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
                  <h3 className="text-2xl font-bold mb-4 text-orange-600">
                    🎯 Best Use Case
                  </h3>
                  <p className="text-gray-700 text-lg">{theory.bestFor}</p>
                </div>

                {/* Complexity */}
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-cyan-600">
                    ⏱️ Time Complexity
                  </h3>
                  <div className="font-mono text-xl p-4 glass rounded-lg text-gray-800">
                    {theory.timeComplexity}
                  </div>
                </div>

                {/* Example */}
                <div className="glass-card p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">
                    💡 Example
                  </h3>
                  <p className="text-gray-700 text-lg font-mono bg-white/50 p-4 rounded-lg">
                    {theory.example}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
