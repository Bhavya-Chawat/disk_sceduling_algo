'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HardDrive, Play, GitCompare, BookOpen, Zap, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function HomePage() {
  const features = [
    {
      icon: Play,
      title: 'Interactive Simulation',
      description: 'Run disk scheduling algorithms with custom parameters and see real-time visualization',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: GitCompare,
      title: 'Algorithm Comparison',
      description: 'Compare all algorithms side-by-side to find the most efficient for your use case',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: BookOpen,
      title: 'Algorithm Explanations',
      description: 'Learn how each algorithm works with detailed explanations and code examples',
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: Zap,
      title: 'Smooth Animations',
      description: 'Watch the disk head move across tracks with beautiful, fluid animations',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: BarChart3,
      title: 'Performance Metrics',
      description: 'Analyze total seek time, average seek time, and step-by-step breakdowns',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: HardDrive,
      title: '6 Algorithms',
      description: 'FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK implementations',
      color: 'from-cyan-400 to-cyan-600',
    },
  ];

  const algorithms = [
    {
      name: 'FCFS',
      fullName: 'First Come First Serve',
      description: 'Processes requests in arrival order',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'SSTF',
      fullName: 'Shortest Seek Time First',
      description: 'Selects closest request to current position',
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'SCAN',
      fullName: 'Elevator Algorithm',
      description: 'Moves in one direction until the end',
      color: 'from-pink-400 to-pink-600',
    },
    {
      name: 'C-SCAN',
      fullName: 'Circular SCAN',
      description: 'Jumps back after reaching the end',
      color: 'from-orange-400 to-orange-600',
    },
    {
      name: 'LOOK',
      fullName: 'LOOK Algorithm',
      description: 'Like SCAN but only to last request',
      color: 'from-green-400 to-green-600',
    },
    {
      name: 'C-LOOK',
      fullName: 'Circular LOOK',
      description: 'Circular version of LOOK',
      color: 'from-cyan-400 to-cyan-600',
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <HardDrive className="w-24 h-24 text-blue-500" />
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Disk Scheduling
          <br />
          Simulator
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Visualize, understand, and compare disk scheduling algorithms with interactive animations and detailed performance metrics
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/simulator">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Simulation
            </Button>
          </Link>
          <Link href="/compare">
            <Button
              size="lg"
              variant="outline"
              className="glass text-lg px-8"
            >
              <GitCompare className="w-5 h-5 mr-2" />
              Compare Algorithms
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Algorithms Section */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Supported Algorithms
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algo, idx) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="glass-card h-full">
                <CardContent className="pt-6">
                  <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${algo.color} bg-clip-text text-transparent`}>
                    {algo.name}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {algo.fullName}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {algo.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore how different disk scheduling algorithms optimize head movement and reduce seek time. Perfect for students and professionals learning operating systems.
        </p>
        <Link href="/simulator">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Launch Simulator
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}