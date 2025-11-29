"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiskHeadAnimationProps {
  currentPosition: number;
  targetPosition?: number;
  trackSize: number;
  isAnimating?: boolean;
  showTrail?: boolean;
}

export function DiskHeadAnimation({
  currentPosition,
  targetPosition,
  trackSize,
  isAnimating = false,
  showTrail = true,
}: DiskHeadAnimationProps) {
  const [trail, setTrail] = useState<number[]>([]);
  const percentage = (currentPosition / trackSize) * 100;

  useEffect(() => {
    if (isAnimating && showTrail) {
      setTrail((prev) => [...prev.slice(-20), currentPosition]);
    }
  }, [currentPosition, isAnimating, showTrail]);

  return (
    <div className="relative w-full h-32">
      {/* Track Line */}
      <div className="absolute w-full h-2 bg-white/10 rounded-full top-1/2 -translate-y-1/2 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-disk-primary-400/30 to-transparent"
        />
      </div>

      {/* Track Markers */}
      <div className="absolute w-full flex justify-between top-0">
        {Array.from({ length: 5 }, (_, i) => {
          const pos = (trackSize / 4) * i;
          return (
            <div key={pos} className="flex flex-col items-center">
              <div className="w-px h-4 bg-disk-primary-400/50" />
              <span className="text-xs text-gray-400 mt-1 font-mono">
                {Math.round(pos)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Trail effect */}
      {showTrail && trail.length > 0 && (
        <div className="absolute w-full top-1/2 -translate-y-1/2">
          {trail.map((pos, idx) => (
            <motion.div
              key={`${pos}-${idx}`}
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1 }}
              className="absolute w-3 h-3 rounded-full bg-disk-primary-400/40"
              style={{
                left: `${(pos / trackSize) * 100}%`,
                marginLeft: "-6px",
              }}
            />
          ))}
        </div>
      )}

      {/* Target position indicator */}
      {targetPosition !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${(targetPosition / trackSize) * 100}%` }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-8 h-8 border-2 border-disk-purple-400 rounded-full -translate-x-1/2"
          />
        </motion.div>
      )}

      {/* Disk Head */}
      <motion.div
        animate={{
          left: `${percentage}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-10 h-10 bg-disk-primary-400/50 rounded-full blur-xl"
        />

        {/* Main head */}
        <motion.div
          animate={
            isAnimating
              ? {
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: isAnimating ? Infinity : 0,
          }}
          className="relative w-8 h-8 bg-gradient-to-br from-disk-primary-400 to-disk-purple-400 rounded-full shadow-lg shadow-disk-primary-400/50 flex items-center justify-center"
        >
          {/* Inner circle */}
          <div className="w-4 h-4 bg-white rounded-full" />

          {/* Pulse ring */}
          <motion.div
            animate={{
              scale: [1, 2],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-disk-primary-400"
          />
        </motion.div>

        {/* Position label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="px-3 py-1 rounded-lg bg-disk-dark/80 backdrop-blur-sm border border-disk-primary-400/30">
            <span className="text-xs font-mono text-disk-primary-400 font-bold">
              {currentPosition}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Direction indicator */}
      <AnimatePresence>
        {targetPosition !== undefined && targetPosition !== currentPosition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${percentage}%`,
              marginLeft: targetPosition > currentPosition ? "20px" : "-40px",
            }}
          >
            <motion.div
              animate={{
                x: targetPosition > currentPosition ? [0, 10, 0] : [0, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-2xl"
            >
              {targetPosition > currentPosition ? "→" : "←"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
