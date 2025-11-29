"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComparisonChart } from "@/components/simulator/ComparisonChart";
import { SimulationSummary } from "@/components/simulator/SimulationSummary";
import { fcfs } from "@/lib/algorithms/fcfs";
import { sstf } from "@/lib/algorithms/sstf";
import { scan } from "@/lib/algorithms/scan";
import { cscan } from "@/lib/algorithms/cscan";
import { look } from "@/lib/algorithms/look";
import { clook } from "@/lib/algorithms/clook";
import { SimulationResult } from "@/lib/algorithms/types";
import { ArrowLeft, Play, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const [initialHead, setInitialHead] = useState<number>(50);
  const [trackSize, setTrackSize] = useState<number>(200);
  const [requests, setRequests] = useState<string>(
    "82, 170, 43, 140, 24, 16, 190"
  );
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const generateRandomRequests = () => {
    const count = 8;
    const randomReqs = Array.from({ length: count }, () =>
      Math.floor(Math.random() * trackSize)
    );
    setRequests(randomReqs.join(", "));
  };

  const runComparison = () => {
    setIsComparing(true);
    const requestArray = requests
      .split(",")
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r));

    if (requestArray.length === 0) {
      alert("Please enter valid requests");
      setIsComparing(false);
      return;
    }

    // Simulate a slight delay for animation effect
    setTimeout(() => {
      const comparisonResults: SimulationResult[] = [
        fcfs(initialHead, requestArray, trackSize),
        sstf(initialHead, requestArray, trackSize),
        scan(initialHead, requestArray, trackSize, direction),
        cscan(initialHead, requestArray, trackSize, direction),
        look(initialHead, requestArray, trackSize, direction),
        clook(initialHead, requestArray, trackSize, direction),
      ];

      setResults(comparisonResults);
      setIsComparing(false);
    }, 500);
  };

  const resetComparison = () => {
    setResults([]);
    setInitialHead(50);
    setTrackSize(200);
    setRequests("82, 170, 43, 140, 24, 16, 190");
    setDirection("right");
  };

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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-disk-primary-400" />
            </motion.div>
            <h1 className="text-page-title bg-gradient-to-r from-disk-primary-400 to-disk-purple-400 bg-clip-text text-transparent">
              Algorithm Performance Comparison
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Compare all disk scheduling algorithms with the same input
            parameters
          </p>
        </motion.div>

        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-strong p-6 rounded-2xl mb-8"
        >
          <h2 className="text-section text-white mb-4">
            Simulation Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Initial Head Position
              </label>
              <Input
                type="number"
                value={initialHead}
                onChange={(e) => setInitialHead(parseInt(e.target.value) || 0)}
                className="bg-white/5 border-disk-primary-400/30 text-white"
                min={0}
                max={trackSize - 1}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Track Size
              </label>
              <Input
                type="number"
                value={trackSize}
                onChange={(e) => setTrackSize(parseInt(e.target.value) || 200)}
                className="bg-white/5 border-disk-primary-400/30 text-white"
                min={100}
                max={1000}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Request Queue (comma-separated)
              </label>
              <div className="flex gap-2">
                <Input
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder="82, 170, 43, 140, 24, 16, 190"
                  className="bg-white/5 border-disk-primary-400/30 text-white flex-1"
                />
                <Button
                  onClick={generateRandomRequests}
                  variant="outline"
                  className="glass-panel border-disk-primary-400/50 whitespace-nowrap"
                >
                  Random
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Direction (for SCAN, C-SCAN, LOOK, C-LOOK)
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={direction === "left"}
                  onChange={() => setDirection("left")}
                  className="accent-disk-primary-400"
                />
                <span className="text-sm text-gray-300">Left</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={direction === "right"}
                  onChange={() => setDirection("right")}
                  className="accent-disk-primary-400"
                />
                <span className="text-sm text-gray-300">Right</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runComparison}
              disabled={isComparing}
              className="bg-gradient-to-r from-disk-primary-500 to-disk-primary-600 hover:scale-105 transition-transform px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              {isComparing ? "Comparing..." : "Compare All Algorithms"}
            </Button>

            {results.length > 0 && (
              <Button
                onClick={resetComparison}
                variant="outline"
                className="glass-panel border-disk-primary-400/50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Comparison Chart */}
            <ComparisonChart results={results} />

            {/* Summary Table and Stats */}
            <SimulationSummary results={results} />

            {/* Algorithm Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel-strong p-6 rounded-2xl"
            >
              <h2 className="text-section text-white mb-6">Seek Sequences</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((result) => (
                  <div
                    key={result.algorithm}
                    className="glass-panel p-4 rounded-xl"
                  >
                    <h3 className="text-algo text-white mb-3">
                      {result.algorithm}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      {result.seekSequence.map((pos, idx) => (
                        <React.Fragment key={idx}>
                          <span className="text-disk-primary-400 font-mono font-bold">
                            {pos}
                          </span>
                          {idx < result.seekSequence.length - 1 && (
                            <span className="text-gray-600">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isComparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-strong p-12 rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Compare
            </h3>
            <p className="text-gray-400">
              Configure your parameters above and click "Compare All Algorithms"
              to see the results
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
