"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { SimulationForm } from "@/components/simulator/SimulationForm";
import { DiskHeadAnimation } from "@/components/simulator/DiskHeadAnimation";
import { SimulationSummary } from "@/components/simulator/SimulationSummary";
import { fcfs } from "@/lib/algorithms/fcfs";
import { sstf } from "@/lib/algorithms/sstf";
import { scan } from "@/lib/algorithms/scan";
import { cscan } from "@/lib/algorithms/cscan";
import { look } from "@/lib/algorithms/look";
import { clook } from "@/lib/algorithms/clook";
import { SimulationResult } from "@/lib/algorithms/types";

export default function SimulatorPage() {
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(50);
  const [targetPosition, setTargetPosition] = useState<number | undefined>(
    undefined
  );

  const algorithms = [
    { name: "FCFS", description: "First Come First Serve" },
    { name: "SSTF", description: "Shortest Seek Time First" },
    { name: "SCAN", description: "Elevator Algorithm" },
    { name: "C-SCAN", description: "Circular SCAN" },
    { name: "LOOK", description: "SCAN with Look" },
    { name: "C-LOOK", description: "Circular LOOK" },
  ];

  const runSimulation = (params: {
    initialHead: number;
    trackSize: number;
    requests: number[];
    direction: "left" | "right";
    algorithm: string;
  }) => {
    setIsSimulating(true);
    setCurrentPosition(params.initialHead);
    setTargetPosition(undefined);

    // Simulate animation delay
    setTimeout(() => {
      let result: SimulationResult;

      switch (params.algorithm.toLowerCase()) {
        case "fcfs":
          result = fcfs(params.initialHead, params.requests, params.trackSize);
          break;
        case "sstf":
          result = sstf(params.initialHead, params.requests, params.trackSize);
          break;
        case "scan":
          result = scan(
            params.initialHead,
            params.requests,
            params.trackSize,
            params.direction
          );
          break;
        case "c-scan":
        case "cscan":
          result = cscan(
            params.initialHead,
            params.requests,
            params.trackSize,
            params.direction
          );
          break;
        case "look":
          result = look(
            params.initialHead,
            params.requests,
            params.trackSize,
            params.direction
          );
          break;
        case "c-look":
        case "clook":
          result = clook(
            params.initialHead,
            params.requests,
            params.trackSize,
            params.direction
          );
          break;
        default:
          result = fcfs(params.initialHead, params.requests, params.trackSize);
      }

      setSimulationResult(result);
      setIsSimulating(false);
      setCurrentPosition(result.seekSequence[result.seekSequence.length - 1]);
    }, 1000);
  };

  const resetSimulation = () => {
    setSimulationResult(null);
    setCurrentPosition(50);
    setTargetPosition(undefined);
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

          <h1 className="text-page-title bg-gradient-to-r from-disk-primary-400 to-disk-purple-400 bg-clip-text text-transparent mb-2">
            Disk Scheduling Simulator
          </h1>
          <p className="text-gray-400 text-lg">
            Visualize and understand disk scheduling algorithms in action
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <SimulationForm
              onSimulate={runSimulation}
              algorithms={algorithms}
            />
          </div>

          {/* Visualization Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Disk Head Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel-strong p-6 rounded-2xl"
            >
              <h2 className="text-section text-white mb-6">
                Disk Head Movement
              </h2>
              <DiskHeadAnimation
                currentPosition={currentPosition}
                targetPosition={targetPosition}
                trackSize={200}
                isAnimating={isSimulating}
              />
            </motion.div>

            {/* Results */}
            {simulationResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <SimulationSummary results={[simulationResult]} />

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={resetSimulation}
                    variant="outline"
                    className="glass-panel border-disk-primary-400/50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Simulation
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!simulationResult && !isSimulating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel-strong p-12 rounded-2xl text-center"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-gray-400">
                  Configure your parameters and click &quot;Run Simulation&quot;
                  to see the disk scheduling algorithm in action
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
