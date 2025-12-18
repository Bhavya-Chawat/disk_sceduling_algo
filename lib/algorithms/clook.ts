import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function clook(input: SimulationInput): SimulationResult {
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
    // Move right to the end, jump to the beginning of requests, continue right
    path = [...right, ...left];
  } else {
    // Move left to the beginning, jump to the end of requests, continue left
    path = [...left.reverse(), ...right.reverse()];
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
    algorithm: 'C-LOOK',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}