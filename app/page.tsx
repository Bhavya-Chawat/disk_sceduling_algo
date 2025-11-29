"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Eye, FileText } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const algorithms = [
    {
      name: "FCFS",
      color: "algo-fcfs",
      icon: "→",
      desc: "First Come First Serve",
      details: "Processes requests in order of arrival",
    },
    {
      name: "SSTF",
      color: "algo-sstf",
      icon: "↗",
      desc: "Shortest Seek Time First",
      details: "Selects the closest request to current position",
    },
    {
      name: "SCAN",
      color: "algo-scan",
      icon: "↔",
      desc: "Elevator Algorithm",
      details: "Moves in one direction servicing requests",
    },
    {
      name: "C-SCAN",
      color: "algo-cscan",
      icon: "⟲",
      desc: "Circular SCAN",
      details: "SCAN with circular return to start",
    },
    {
      name: "LOOK",
      color: "algo-look",
      icon: "⇄",
      desc: "SCAN with Look",
      details: "SCAN but reverses at last request",
    },
    {
      name: "C-LOOK",
      color: "algo-clook",
      icon: "↻",
      desc: "Circular LOOK",
      details: "LOOK with circular return pattern",
    },
  ];

  const features = [
    {
      icon: Eye,
      title: "Real-time Visualization",
      description:
        "Watch disk head movements with smooth animations and track the entire process step by step",
    },
    {
      icon: Zap,
      title: "Step-by-step Animation",
      description:
        "Control the simulation speed and step through each request to understand the algorithm behavior",
    },
    {
      icon: BarChart3,
      title: "Performance Comparison",
      description:
        "Compare all algorithms side-by-side with detailed metrics and visual charts",
    },
    {
      icon: FileText,
      title: "Detailed Metrics",
      description:
        "Analyze total seek distance, average seek time, variance, and more performance indicators",
    },
  ];

  return (
    <div className="min-h-screen bg-disk-gradient">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 mb-20"
        >
          {/* Animated Disk Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-disk-primary-400 to-disk-purple-400 rounded-full flex items-center justify-center shadow-2xl shadow-disk-primary-400/50">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-disk-dark rounded-full flex items-center justify-center"
              >
                <div className="w-8 h-8 border-4 border-disk-primary-400 rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-hero bg-gradient-to-r from-disk-primary-400 to-disk-purple-400 bg-clip-text text-transparent">
            Disk Scheduling Simulator
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Visualize and compare disk scheduling algorithms with real-time
            animations and performance metrics
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/simulator">
              <Button className="bg-gradient-to-r from-disk-primary-500 to-disk-primary-600 hover:scale-105 transition-transform px-8 py-6 text-lg">
                Start Simulation
              </Button>
            </Link>
            <Link href="/compare">
              <Button
                variant="outline"
                className="glass-panel border-disk-primary-400/50"
              >
                View Comparison
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Algorithm Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-page-title text-white text-center mb-12">
            Algorithm Showcase
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
              >
                <Link
                  href={`/simulator?algorithm=${algo.name
                    .toLowerCase()
                    .replace("-", "")}`}
                >
                  <div className="glass-panel-strong glass-panel-hover p-6 cursor-pointer group">
                    <div className={`text-4xl mb-4 text-${algo.color}`}>
                      {algo.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {algo.name}
                    </h3>
                    <p className="text-gray-400">{algo.desc}</p>
                    <div className="mt-4 flex items-center text-disk-primary-400 group-hover:translate-x-2 transition-transform">
                      Learn More →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-page-title text-white text-center mb-12 mt-20">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-disk-primary-400/20 to-disk-purple-400/20 rounded-xl">
                    <feature.icon className="w-6 h-6 text-disk-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel-strong p-8 rounded-2xl text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-disk-primary-400 mb-2">
                6
              </div>
              <div className="text-gray-400">Algorithms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-disk-purple-400 mb-2">
                ∞
              </div>
              <div className="text-gray-400">Simulations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-status-active mb-2">
                100%
              </div>
              <div className="text-gray-400">Interactive</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master Disk Scheduling?
          </h2>
          <p className="text-gray-400 mb-8">
            Start simulating and comparing algorithms now
          </p>
          <Link href="/simulator">
            <Button className="bg-gradient-to-r from-disk-primary-500 to-disk-purple-500 hover:scale-105 transition-transform px-10 py-6 text-lg shadow-2xl shadow-disk-primary-400/30">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
