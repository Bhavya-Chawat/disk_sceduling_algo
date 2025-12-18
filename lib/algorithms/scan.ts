import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function scan(input: SimulationInput): SimulationResult {
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
    path = [...right, totalTracks - 1, ...left.reverse()];
  } else {
    path = [...left.reverse(), 0, ...right];
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
    algorithm: 'SCAN',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}