import { motion } from "framer-motion";
import { AlgorithmResult, AlgorithmType } from "@/lib/algorithms/types";
import { Activity, Clock, TrendingDown, Zap, Info } from "lucide-react";

interface MetricsPanelProps {
  result: AlgorithmResult | null;
  currentStep: number;
  algorithmId?: AlgorithmType;
}

// Generate algorithm-specific reasoning for each step
const getStepExplanation = (
  algorithmId: AlgorithmType | undefined,
  step: { from: number; to: number; distance: number },
  stepIndex: number,
  allSteps: { from: number; to: number; distance: number }[],
  sequence: number[]
): string => {
  const from = step.from;
  const to = step.to;
  const direction = to > from ? "right (increasing)" : "left (decreasing)";

  switch (algorithmId) {
    case "fcfs":
      return `Serving request in arrival order. Track ${to} was the ${
        stepIndex + 1
      }${getOrdinalSuffix(stepIndex + 1)} request in the queue.`;

    case "sstf":
      return `Selected track ${to} as the nearest unvisited request from position ${from}. This minimizes immediate seek time.`;

    case "scan":
      if (to === 0 || to === 199) {
        return `Reached disk boundary at track ${to}. Head will reverse direction on next move.`;
      }
      return `Moving ${direction} to track ${to}, serving requests in the current sweep direction.`;

    case "cscan":
      if (stepIndex > 0) {
        const prevTo = allSteps[stepIndex - 1]?.to;
        if (prevTo === 0 || prevTo === 199) {
          if (Math.abs(to - prevTo) > 100) {
            return `Jumped back to track ${to} after reaching boundary. C-SCAN only serves in one direction.`;
          }
        }
      }
      return `Moving ${direction} to track ${to}. C-SCAN provides more uniform wait time.`;

    case "look":
      const isLastInDirection = !allSteps
        .slice(stepIndex + 1)
        .some((s) => (to > from && s.to > to) || (to < from && s.to < to));
      if (isLastInDirection && stepIndex < allSteps.length - 1) {
        return `Track ${to} is the last request in current direction. Head will reverse without going to disk edge.`;
      }
      return `Moving ${direction} to track ${to}. LOOK reverses at last request, not disk boundary.`;

    case "clook":
      if (stepIndex > 0) {
        const prevStep = allSteps[stepIndex - 1];
        if (Math.abs(to - prevStep.to) > 50 && to < prevStep.to) {
          return `Jumped to track ${to} (lowest pending request) after serving the highest. C-LOOK combines circular and look optimizations.`;
        }
      }
      return `Moving to track ${to}. C-LOOK serves requests in one direction, then jumps to the lowest request.`;

    default:
      return `Moving from track ${from} to track ${to}.`;
  }
};

const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export function MetricsPanel({
  result,
  currentStep,
  algorithmId,
}: MetricsPanelProps) {
  if (!result) return null;

  const metrics = [
    {
      label: "Algorithm",
      value: result.name,
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Total Seek Time",
      value: `${result.totalSeekTime} tracks`,
      icon: Clock,
      color: "text-accent",
    },
    {
      label: "Average Seek",
      value: `${result.averageSeekTime.toFixed(1)} tracks`,
      icon: TrendingDown,
      color: "text-success",
    },
    {
      label: "Total Steps",
      value: result.steps.length,
      icon: Zap,
      color: "text-orange",
    },
  ];

  // Calculate cumulative seek time up to current step
  const cumulativeSeek =
    currentStep >= 0
      ? result.steps
          .slice(0, currentStep + 1)
          .reduce((sum, s) => sum + s.distance, 0)
      : 0;

  return (
    <div
      className="metrics-panel glass p-4 rounded-xl"
      role="region"
      aria-label="Simulation metrics"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <metric.icon
                className={`w-4 h-4 ${metric.color}`}
                aria-hidden="true"
              />
              <span className="text-xs text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <span className="text-base font-bold text-foreground">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Current step info with detailed explanation */}
      {currentStep >= 0 && currentStep < result.steps.length && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 pt-4 border-t border-border/50"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {result.steps.length}
            </span>
            <span className="text-sm font-mono">
              <span className="text-accent">
                {result.steps[currentStep].from}
              </span>
              <span className="text-muted-foreground mx-2">→</span>
              <span className="text-success">
                {result.steps[currentStep].to}
              </span>
              <span className="text-muted-foreground ml-2">
                ({result.steps[currentStep].distance} tracks)
              </span>
            </span>
          </div>

          {/* Step-by-step explanation */}
          <div className="bg-secondary/30 rounded-lg p-3 mt-2">
            <div className="flex items-start gap-2">
              <Info
                className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">
                  Moving from track {result.steps[currentStep].from} to{" "}
                  {result.steps[currentStep].to}
                </p>
                <p className="text-muted-foreground">
                  Distance = |{result.steps[currentStep].to} -{" "}
                  {result.steps[currentStep].from}| ={" "}
                  {result.steps[currentStep].distance} tracks
                </p>
                <p className="text-primary/80 mt-2 text-xs italic">
                  {getStepExplanation(
                    algorithmId,
                    result.steps[currentStep],
                    currentStep,
                    result.steps,
                    result.sequence
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Cumulative seek: {cumulativeSeek} tracks</span>
            <span>
              Remaining: {result.totalSeekTime - cumulativeSeek} tracks
            </span>
          </div>
        </motion.div>
      )}

      {/* Idle state message */}
      {currentStep === -1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">
              Play
            </kbd>{" "}
            or{" "}
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">
              Step Forward
            </kbd>{" "}
            to start simulation
          </p>
        </motion.div>
      )}

      {/* Seek sequence */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground mb-2 block">
          Seek Sequence:
        </span>
        <div
          className="flex flex-wrap gap-1"
          role="list"
          aria-label="Seek sequence"
        >
          {result.sequence.map((track, index) => (
            <span
              key={index}
              role="listitem"
              className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                index === 0
                  ? "bg-primary/20 text-primary"
                  : index <= currentStep + 1
                  ? "bg-success/20 text-success"
                  : "bg-secondary/50 text-muted-foreground"
              }`}
            >
              {track}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
