import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function look(input: SimulationInput): SimulationResult {
  const { requests, initialHead, direction = 'right' } = input;
  const sequence: number[] = [initialHead];
  const steps: SimulationStep[] = [];
  let totalSeekTime = 0;
  let currentHead = initialHead;

  const sortedRequests = [...requests].sort((a, b) => a - b);
  const left = sortedRequests.filter(r => r < initialHead);
  const right = sortedRequests.filter(r => r >= initialHead);

  let path: number[] = [];

  if (direction === 'right') {
    // Move right to the last request, then service left requests in reverse
    path = [...right, ...left.reverse()];
  } else {
    // Move left to the first request, then service right requests
    path = [...left.reverse(), ...right];
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
    sequence.push(request);
  }

  return {
    algorithm: 'LOOK',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}