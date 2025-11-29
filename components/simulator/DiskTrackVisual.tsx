"use client";

import React from "react";
import { motion } from "framer-motion";

interface Request {
  position: number;
  completed: boolean;
  active: boolean;
}

interface DiskTrackVisualProps {
  headPosition: number;
  requests: Request[];
  trackSize: number;
  seekSequence: number[];
}

export function DiskTrackVisual({
  headPosition,
  requests,
  trackSize,
  seekSequence,
}: DiskTrackVisualProps) {
  return (
    <div className="glass-panel-strong p-8">
      {/* Track Line */}
      <div className="relative h-32 mb-8">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-white/10 rounded-full top-1/2 -translate-y-1/2" />

        {/* Track markers */}
        <div className="absolute w-full flex justify-between top-0">
          {[0, 50, 100, 150, 200].map((pos) => (
            <div key={pos} className="flex flex-col items-center">
              <div className="w-px h-4 bg-disk-primary-400/50" />
              <span className="text-xs text-gray-400 mt-1">{pos}</span>
            </div>
          ))}
        </div>

        {/* Disk head (animated) */}
        <div
          className="absolute w-6 h-6 bg-gradient-to-br from-disk-primary-400 to-disk-purple-400 rounded-full shadow-lg shadow-disk-primary-400/50 top-1/2 -translate-y-1/2 transition-all duration-500"
          style={{ left: `${(headPosition / trackSize) * 100}%` }}
        >
          <div className="absolute inset-0 rounded-full animate-ping bg-disk-primary-400/50" />
        </div>

        {/* Request markers */}
        {requests.map((req, idx) => (
          <div
            key={idx}
            className={`absolute w-3 h-3 rounded-full top-1/2 -translate-y-1/2 transition-all duration-300 ${
              req.completed ? "bg-status-completed" : "bg-status-waiting"
            }`}
            style={{ left: `${(req.position / trackSize) * 100}%` }}
          />
        ))}
      </div>

      {/* Request Queue Display */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Request Queue</h3>
        <div className="flex flex-wrap gap-2">
          {requests.map((req, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                req.completed
                  ? "bg-status-completed/20 text-status-completed border border-status-completed/50"
                  : req.active
                  ? "bg-status-active/20 text-status-active border border-status-active/50 scale-110"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {req.position}
            </div>
          ))}
        </div>
      </div>

      {/* Seek Sequence */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Seek Sequence</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {seekSequence.map((pos, idx) => (
            <React.Fragment key={idx}>
              <span className="px-3 py-1 bg-disk-primary-400/20 text-disk-primary-400 rounded-lg font-mono">
                {pos}
              </span>
              {idx < seekSequence.length - 1 && (
                <span className="text-gray-500">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
