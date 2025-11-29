import { SimulationResult } from "./types";

export function cscan(
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

    // Jump to the beginning of the disk if there are requests on the left
    if (leftRequests.length > 0) {
      const jumpDistance =
        Math.abs(currentHead - (trackSize - 1)) + Math.abs(0 - 0);
      totalSeekDistance += jumpDistance;
      currentHead = 0;
      seekSequence.push(currentHead);
    }

    // Process requests from the beginning
    for (const req of leftRequests) {
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

    // Jump to the end of the disk if there are requests on the right
    if (rightRequests.length > 0) {
      const jumpDistance =
        Math.abs(currentHead - 0) + Math.abs(trackSize - 1 - (trackSize - 1));
      totalSeekDistance += jumpDistance;
      currentHead = trackSize - 1;
      seekSequence.push(currentHead);
    }

    // Process requests from the end
    for (const req of rightRequests) {
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
    algorithm: "C-SCAN",
    totalSeekDistance,
    averageSeekDistance,
    maxSeekDistance,
    variance,
    seekSequence,
    requestsProcessed: requests.length,
  };
}
