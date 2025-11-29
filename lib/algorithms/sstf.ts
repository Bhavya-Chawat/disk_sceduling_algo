import { SimulationResult } from "./types";

export function sstf(
  initialHead: number,
  requests: number[],
  trackSize: number
): SimulationResult {
  const remainingRequests = [...requests];
  const seekSequence = [initialHead];
  let currentHead = initialHead;
  let totalSeekDistance = 0;

  while (remainingRequests.length > 0) {
    // Find the request with minimum seek time
    let minDistance = Infinity;
    let minIndex = -1;

    for (let i = 0; i < remainingRequests.length; i++) {
      const distance = Math.abs(currentHead - remainingRequests[i]);
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }

    // Move to the nearest request
    const nextRequest = remainingRequests[minIndex];
    seekSequence.push(nextRequest);
    totalSeekDistance += minDistance;
    currentHead = nextRequest;

    // Remove the processed request
    remainingRequests.splice(minIndex, 1);
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
    algorithm: "SSTF",
    totalSeekDistance,
    averageSeekDistance,
    maxSeekDistance,
    variance,
    seekSequence,
    requestsProcessed: requests.length,
  };
}
