import { SimulationInput, SimulationResult, SimulationStep } from './types';

export function fcfs(input: SimulationInput): SimulationResult {
  const { requests, initialHead } = input;
  const sequence: number[] = [initialHead];
  const steps: SimulationStep[] = [];
  let totalSeekTime = 0;
  let currentHead = initialHead;

  for (const request of requests) {
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
    algorithm: 'FCFS',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}