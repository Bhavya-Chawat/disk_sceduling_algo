import { SimulationResult } from "./types";

export function look(
  initialHead: number,
  requests: number[],
  trackSize: number,
  direction: "left" | "right" = "right"
): SimulationResult {
  const seekSequence = [initialHead];
  let currentHead = initialHead;
  let totalSeekDistance = 0;
  const remainingRequests = [...requests].sort((a, b) => a - b);

  if (direction === "right") {
    // Move right first
    const rightRequests = remainingRequests
      .filter((req) => req >= currentHead)
      .sort((a, b) => a - b);
    const leftRequests = remainingRequests
      .filter((req) => req < currentHead)
      .sort((a, b) => a - b);

    // Process requests to the right
    for (const req of rightRequests) {
      const distance = Math.abs(currentHead - req);
      totalSeekDistance += distance;
      currentHead = req;
      seekSequence.push(currentHead);
    }

    // Process requests to the left (without going to end of disk)
    for (let i = leftRequests.length - 1; i >= 0; i--) {
      const req = leftRequests[i];
      const distance = Math.abs(currentHead - req);
      totalSeekDistance += distance;
      currentHead = req;
      seekSequence.push(currentHead);
    }
  } else {
    // Move left first
    const leftRequests = remainingRequests
      .filter((req) => req <= currentHead)
      .sort((a, b) => b - a);
    const rightRequests = remainingRequests
      .filter((req) => req > currentHead)
      .sort((a, b) => b - a);

    // Process requests to the left
    for (const req of leftRequests) {
      const distance = Math.abs(currentHead - req);
      totalSeekDistance += distance;
      currentHead = req;
      seekSequence.push(currentHead);
    }

    // Process requests to the right (without going to start of disk)
    for (let i = rightRequests.length - 1; i >= 0; i--) {
      const req = rightRequests[i];
      const distance = Math.abs(currentHead - req);
      totalSeekDistance += distance;
      currentHead = req;
      seekSequence.push(currentHead);
    }
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
    algorithm: "LOOK",
    totalSeekDistance,
    averageSeekDistance,
    maxSeekDistance,
    variance,
    seekSequence,
    requestsProcessed: requests.length,
  };
}
