import { SimulationInput, SimulationResult, Algorithm } from './algorithms/types';
import { fcfs } from './algorithms/fcfs';
import { sstf } from './algorithms/sstf';
import { scan } from './algorithms/scan';
import { cscan } from './algorithms/cscan';
import { look } from './algorithms/look';
import { clook } from './algorithms/clook';

export function runSimulation(
  algorithm: Algorithm,
  input: SimulationInput
): SimulationResult {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(input);
    case 'SSTF':
      return sstf(input);
    case 'SCAN':
      return scan(input);
    case 'C-SCAN':
      return cscan(input);
    case 'LOOK':
      return look(input);
    case 'C-LOOK':
      return clook(input);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

export function runAllAlgorithms(input: SimulationInput): SimulationResult[] {
  const algorithms: Algorithm[] = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'];
  const results: SimulationResult[] = [];

  for (const algorithm of algorithms) {
    try {
      results.push(runSimulation(algorithm, input));
    } catch {
      console.log(`Skipping ${algorithm}: not yet implemented`);
    }
  }

  return results;
}