import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface SimulatorSkeletonProps {
  type: "3d-scene" | "metrics" | "chart";
}

export function SimulatorSkeleton({ type }: SimulatorSkeletonProps) {
  if (type === "3d-scene") {
    return (
      <div className="h-[320px] md:h-[380px] flex items-center justify-center bg-secondary/20 rounded-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <div
              className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin absolute top-4 left-1/2 -translate-x-1/2"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Initializing 3D Scene...
          </p>
        </motion.div>
      </div>
    );
  }

  if (type === "metrics") {
    return (
      <div className="glass p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-wrap gap-1">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-8" />
          ))}
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="glass p-6 rounded-xl">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="h-[300px] flex items-end gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                className="w-full rounded-t"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
