import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function sstf(input: SimulationInput): SimulationResult {
  const { requests, initialHead } = input;
  const sequence: number[] = [initialHead];
  const steps: SimulationStep[] = [];
  let totalSeekTime = 0;
  let currentHead = initialHead;
  const remaining = [...requests];

  while (remaining.length > 0) {
    let minDistance = Infinity;
    let minIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      const distance = Math.abs(remaining[i] - currentHead);
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }

    const nextRequest = remaining[minIndex];
    const seekTime = Math.abs(nextRequest - currentHead);
    
    steps.push({
      from: currentHead,
      to: nextRequest,
      seekTime,
    });
    
    totalSeekTime += seekTime;
    currentHead = nextRequest;
    sequence.push(nextRequest);
    remaining.splice(minIndex, 1);
  }

  return {
    algorithm: 'SSTF',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}