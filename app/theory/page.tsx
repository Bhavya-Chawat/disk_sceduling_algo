"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { ArrowLeft, BookOpen, Lightbulb, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function TheoryPage() {
  const algorithms = [
    {
      name: "FCFS (First Come First Serve)",
      description:
        "Requests are served in the order they arrive. Simple but can lead to high average seek time.",
      pros: ["Simple to implement", "Fair - no starvation"],
      cons: ["High average seek time", "Does not optimize head movement"],
      complexity: "O(n)",
    },
    {
      name: "SSTF (Shortest Seek Time First)",
      description:
        "Always serves the request closest to the current head position. Reduces average seek time but can cause starvation.",
      pros: ["Lower average seek time", "Better performance than FCFS"],
      cons: ["Can cause starvation", "Overhead of calculating distances"],
      complexity: "O(n log n)",
    },
    {
      name: "SCAN (Elevator Algorithm)",
      description:
        "Moves the head in one direction, servicing requests along the way, then reverses direction at the end.",
      pros: [
        "Good response time",
        "No starvation",
        "Better performance than SSTF",
      ],
      cons: ["Long waits at ends", "Head movement to extremes"],
      complexity: "O(n log n)",
    },
    {
      name: "C-SCAN (Circular SCAN)",
      description:
        "Moves the head in one direction only. When it reaches the end, it jumps to the beginning without servicing requests.",
      pros: [
        "Uniform wait time",
        "Better response time for locations",
        "Predictable performance",
      ],
      cons: ["More seek movements", "Jump causes delay"],
      complexity: "O(n log n)",
    },
    {
      name: "LOOK",
      description:
        "Similar to SCAN but reverses direction when there are no more requests in the current direction.",
      pros: ["Better than SCAN", "No unnecessary movement to disk ends"],
      cons: ["Still has some unfairness", "Complex implementation"],
      complexity: "O(n log n)",
    },
    {
      name: "C-LOOK",
      description:
        "Circular version of LOOK. When no more requests in current direction, jumps to farthest request in opposite direction.",
      pros: ["Better uniformity than C-SCAN", "Reduced seek time"],
      cons: ["Complex implementation", "Still has some unfairness"],
      complexity: "O(n log n)",
    },
  ];

  const performanceMetrics = [
    {
      name: "Seek Time",
      description: "Time taken to move the disk arm to the required track",
      formula: "Sum of absolute differences between consecutive positions",
    },
    {
      name: "Rotational Latency",
      description:
        "Time taken for the desired sector to rotate under the read/write head",
      formula: "Average = 1/2 × rotation time",
    },
    {
      name: "Transfer Time",
      description: "Time taken to transfer data between disk and memory",
      formula: "Data size / Transfer rate",
    },
    {
      name: "Average Seek Time",
      description: "Average time taken for seeks across all requests",
      formula: "Total seek time / Number of requests",
    },
  ];

  return (
    <div className="min-h-screen bg-disk-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <BookOpen className="w-8 h-8 text-disk-primary-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-disk-primary-400 to-disk-purple-400 bg-clip-text text-transparent">
              Disk Scheduling Theory
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Learn the fundamental concepts behind disk scheduling algorithms
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-strong p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            What is Disk Scheduling?
          </h2>
          <p className="text-gray-300 mb-4">
            Disk scheduling is the process of deciding which pending I/O
            requests to process next in a disk storage system. The goal is to
            minimize the time required to service requests and maximize disk
            throughput.
          </p>
          <p className="text-gray-300">
            Multiple I/O requests may arrive at different times, and the disk
            scheduler determines the optimal order to service these requests
            based on various algorithms.
          </p>
        </motion.div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-disk-primary-400/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-disk-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Seek Time Optimization
            </h3>
            <p className="text-gray-400">
              Minimizing the movement of the disk head reduces seek time and
              improves overall performance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-disk-purple-400/20 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-disk-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Fairness & Throughput
            </h3>
            <p className="text-gray-400">
              Balancing fairness among requests while maximizing the number of
              requests serviced per unit time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-status-active/20 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-status-active" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Starvation Prevention
            </h3>
            <p className="text-gray-400">
              Ensuring that no request waits indefinitely for service,
              preventing system deadlock.
            </p>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel-strong p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="glass-panel p-4 rounded-xl">
                <h3 className="font-bold text-disk-primary-400 mb-2">
                  {metric.name}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {metric.description}
                </p>
                <div className="text-xs font-mono bg-black/30 p-2 rounded text-gray-400">
                  {metric.formula}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Algorithm Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel-strong p-8 rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Disk Scheduling Algorithms
          </h2>
          <div className="space-y-8">
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-panel p-6 rounded-xl"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {algo.name}
                    </h3>
                    <p className="text-gray-300 mb-4">{algo.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          Advantages
                        </h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {algo.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          Disadvantages
                        </h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {algo.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-32 flex flex-col items-center justify-center p-4 glass-panel rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Complexity</div>
                    <div className="text-lg font-bold text-disk-primary-400">
                      {algo.complexity}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
