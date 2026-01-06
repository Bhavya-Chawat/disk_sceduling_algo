import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlgorithmResult } from "@/lib/algorithms/types";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "./button";

interface TrackVisualizationProps {
  result: AlgorithmResult | null;
  totalTracks: number;
  currentStep: number;
  algorithmId: string;
}

// Color palette for arrows
const STEP_COLORS = [
  "#F97316", // orange
  "#EC4899", // pink
  "#8B5CF6", // purple
  "#10B981", // green
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#EAB308", // yellow
  "#EF4444", // red
  "#14B8A6", // teal
  "#A855F7", // violet
];

export function TrackVisualization({
  result,
  totalTracks,
  currentStep,
  algorithmId,
}: TrackVisualizationProps) {
  const chartData = useMemo(() => {
    if (!result || !result.steps || result.steps.length === 0) return null;

    const steps = result.steps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
      color: STEP_COLORS[index % STEP_COLORS.length],
    }));

    return { steps };
  }, [result]);

  // Get current head position for animation
  const currentHeadPosition = useMemo(() => {
    if (!result || currentStep < 0) return result?.sequence?.[0] ?? 0;
    if (currentStep >= result.steps.length)
      return result.sequence[result.sequence.length - 1];
    return result.steps[currentStep]?.to ?? result.sequence[0] ?? 0;
  }, [result, currentStep]);

  if (!chartData || !result || !result.sequence) {
    return (
      <div className="glass p-6 rounded-xl">
        <p className="text-muted-foreground text-center">
          Run simulation to see track visualization
        </p>
      </div>
    );
  }

  const chartWidth = 1000;
  const chartHeight = Math.max(400, (chartData.steps.length + 1) * 55 + 140);
  const padding = { left: 50, right: 50, top: 50, bottom: 100 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // X position for a track number
  const getX = (track: number) => {
    return padding.left + (track / Math.max(1, totalTracks - 1)) * plotWidth;
  };

  // Y position for a step
  const getY = (stepIndex: number) => {
    return (
      padding.top +
      ((stepIndex + 1) / (chartData.steps.length + 1)) * plotHeight
    );
  };

  // Generate tick marks for x-axis
  const xTicks = [];
  const tickInterval = Math.ceil(totalTracks / 10);
  for (let i = 0; i <= totalTracks; i += tickInterval) {
    xTicks.push(i);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          Seek Sequence Visualization
        </h2>
        <Link to={`/theory/${algorithmId}`}>
          <Button variant="default" size="sm" className="gap-2">
            <BookOpen className="w-4 h-4" />
            View Theory
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-card/30 rounded-lg p-4">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[600px]"
          style={{ maxWidth: "100%", height: "auto" }}
        >
          {/* Defs for effects */}
          <defs>
            <filter id="glow2d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id="headGradient2"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* X-axis at bottom */}
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom + 40}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom + 40}
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          {xTicks.map((tick) => (
            <g key={`tick-${tick}`}>
              <line
                x1={getX(tick)}
                y1={chartHeight - padding.bottom + 35}
                x2={getX(tick)}
                y2={chartHeight - padding.bottom + 45}
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <text
                x={getX(tick)}
                y={chartHeight - padding.bottom + 60}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="11"
              >
                {tick}
              </text>
            </g>
          ))}
          <text
            x={chartWidth / 2}
            y={chartHeight - 20}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            fontSize="12"
            fontWeight="600"
          >
            Track Position (0 - {totalTracks - 1})
          </text>

          {/* Starting position marker */}
          <circle
            cx={getX(result.sequence[0])}
            cy={getY(-1)}
            r="16"
            fill="#F97316"
          />
          <text
            x={getX(result.sequence[0])}
            y={getY(-1) + 5}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
          >
            {result.sequence[0]}
          </text>
          <text
            x={getX(result.sequence[0]) + 25}
            y={getY(-1) + 5}
            textAnchor="start"
            fill="hsl(var(--muted-foreground))"
            fontSize="11"
          >
            Start
          </text>

          {/* Diagonal lines connecting steps */}
          {chartData.steps.map((step, index) => {
            const fromX = getX(step.from);
            const toX = getX(step.to);
            const fromY = getY(index - 1);
            const toY = getY(index);
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <g key={`step-${index}`}>
                {/* Diagonal line from previous position to current */}
                <motion.line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isActive ? step.color : "hsl(var(--border))"}
                  strokeWidth={isCurrent ? 4 : 2.5}
                  strokeLinecap="round"
                  opacity={isActive ? 1 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                />

                {/* Destination marker */}
                <circle
                  cx={toX}
                  cy={toY}
                  r={isCurrent ? 18 : 14}
                  fill={isActive ? step.color : "hsl(var(--muted))"}
                  opacity={isActive ? 1 : 0.4}
                  filter={isCurrent ? "url(#glow2d)" : undefined}
                />
                <text
                  x={toX}
                  y={toY + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isCurrent ? "12" : "10"}
                  fontWeight="bold"
                >
                  {step.to}
                </text>

                {/* Distance badge - positioned offset from line */}
                {isActive && (
                  <g>
                    <rect
                      x={(fromX + toX) / 2 + 20}
                      y={(fromY + toY) / 2 - 12}
                      width="44"
                      height="18"
                      rx="9"
                      fill={step.color}
                      opacity="0.15"
                    />
                    <text
                      x={(fromX + toX) / 2 + 42}
                      y={(fromY + toY) / 2 + 2}
                      textAnchor="middle"
                      fill={step.color}
                      fontSize="10"
                      fontWeight="600"
                    >
                      +{step.distance}
                    </text>
                  </g>
                )}

                {/* Step number on left */}
                <text
                  x={padding.left - 25}
                  y={toY + 5}
                  textAnchor="middle"
                  fill={
                    isActive
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))"
                  }
                  fontSize="12"
                  fontWeight={isCurrent ? "bold" : "normal"}
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

          {/* Animated head position indicator at bottom */}
          <motion.g
            initial={false}
            animate={{
              x: 0,
            }}
          >
            {/* Head vertical line */}
            <motion.line
              x1={getX(currentHeadPosition)}
              y1={padding.top - 10}
              x2={getX(currentHeadPosition)}
              y2={chartHeight - padding.bottom + 35}
              stroke="url(#headGradient2)"
              strokeWidth="3"
              initial={false}
              animate={{
                x1: getX(currentHeadPosition),
                x2: getX(currentHeadPosition),
              }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            />
            {/* Head triangle at bottom */}
            <motion.polygon
              points={`${getX(currentHeadPosition)},${
                chartHeight - padding.bottom + 30
              } ${getX(currentHeadPosition) - 10},${
                chartHeight - padding.bottom + 45
              } ${getX(currentHeadPosition) + 10},${
                chartHeight - padding.bottom + 45
              }`}
              fill="#F97316"
              filter="url(#glow2d)"
              initial={false}
              animate={{
                points: `${getX(currentHeadPosition)},${
                  chartHeight - padding.bottom + 30
                } ${getX(currentHeadPosition) - 10},${
                  chartHeight - padding.bottom + 45
                } ${getX(currentHeadPosition) + 10},${
                  chartHeight - padding.bottom + 45
                }`,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            />
            {/* Head position circle with number */}
            <motion.g
              initial={false}
              animate={{
                x: getX(currentHeadPosition),
              }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            >
              <circle
                cx={0}
                cy={chartHeight - padding.bottom + 55}
                r="14"
                fill="#F97316"
              />
              <text
                x={0}
                y={chartHeight - padding.bottom + 59}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {currentHeadPosition}
              </text>
            </motion.g>
          </motion.g>
        </svg>
      </div>

      {/* Footer stats */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-muted-foreground">
            Head Position:{" "}
            <span className="text-foreground font-semibold">
              {currentHeadPosition}
            </span>
          </span>
        </div>
        <span className="text-muted-foreground">
          Step:{" "}
          <span className="text-foreground font-medium">
            {Math.max(0, currentStep + 1)} / {result.steps.length}
          </span>
        </span>
        <span className="text-muted-foreground">
          Total Seek:{" "}
          <span className="text-orange-500 font-bold text-base">
            {result.totalSeekTime}
          </span>{" "}
          tracks
        </span>
      </div>
    </motion.div>
  );
}
