"use client";

import { motion } from "framer-motion";
import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card border-t mt-20"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.div>
              <span>for Operating Systems</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Bhavya-Chawat/disk_sceduling_algo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          {/* Copyright and creators */}
          <div className="border-t pt-6 space-y-2 text-center">
            <div className="text-xs text-gray-500">
              © 2025 Disk Scheduling Simulator. Educational project.
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Created by:</span> Kruthi Krishna
              & Bhavya Chawat
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
