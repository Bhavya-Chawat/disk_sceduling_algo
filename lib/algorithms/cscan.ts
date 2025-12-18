import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function cscan(input: SimulationInput): SimulationResult {
  const { requests, initialHead, totalTracks, direction = 'right' } = input;
  const sequence: number[] = [initialHead];
  const steps: SimulationStep[] = [];
  let totalSeekTime = 0;
  let currentHead = initialHead;

  const sortedRequests = [...requests].sort((a, b) => a - b);
  const left = sortedRequests.filter(r => r < initialHead);
  const right = sortedRequests.filter(r => r >= initialHead);

  let path: number[] = [];

  if (direction === 'right') {
    // Move right to the end, jump to beginning, then service remaining
    path = [...right, totalTracks - 1, 0, ...left];
  } else {
    // Move left to the beginning, jump to end, then service remaining
    path = [...left.reverse(), 0, totalTracks - 1, ...right.reverse()];
  }

  for (const request of path) {
    const seekTime = Math.abs(request - currentHead);
    steps.push({
      from: currentHead,
      to: request,
      seekTime,
    });
    totalSeekTime += seekTime;
    currentHead = request;
    if (requests.includes(request)) {
      sequence.push(request);
    }
  }

  return {
    algorithm: 'C-SCAN',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}