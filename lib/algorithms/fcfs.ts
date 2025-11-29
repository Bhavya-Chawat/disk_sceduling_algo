import { SimulationResult } from "./types";

export function fcfs(
  initialHead: number,
  requests: number[],
  trackSize: number
): SimulationResult {
  const seekSequence = [initialHead, ...requests];
  let totalSeekDistance = 0;

  for (let i = 1; i < seekSequence.length; i++) {
    totalSeekDistance += Math.abs(seekSequence[i] - seekSequence[i - 1]);
  }

  const distances = [];
  for (let i = 1; i < seekSequence.length; i++) {
    distances.push(Math.abs(seekSequence[i] - seekSequence[i - 1]));
  }

  const maxSeekDistance = distances.length > 0 ? Math.max(...distances) : 0;
  const averageSeekDistance =
    distances.length > 0 ? totalSeekDistance / distances.length : 0;

  // Calculate variance
  const squaredDifferences = distances.map((dist) =>
    Math.pow(dist - averageSeekDistance, 2)
  );
  const variance =
    squaredDifferences.length > 0
      ? squaredDifferences.reduce((sum, val) => sum + val, 0) /
        squaredDifferences.length
      : 0;

  return {
    algorithm: "FCFS",
    totalSeekDistance,
    averageSeekDistance,
    maxSeekDistance,
    variance,
    seekSequence,
    requestsProcessed: requests.length,
  };
}
