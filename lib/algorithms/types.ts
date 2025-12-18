export type Algorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK';

export type Direction = 'left' | 'right';

export interface SimulationInput {
  requests: number[];
  initialHead: number;
  totalTracks: number;
  direction?: Direction;
}

export interface SimulationStep {
  from: number;
  to: number;
  seekTime: number;
}

export interface SimulationResult {
  algorithm: Algorithm;
  sequence: number[];
  steps: SimulationStep[];
  totalSeekTime: number;
  averageSeekTime: number;
}

export interface AlgorithmFunction {
  (input: SimulationInput): SimulationResult;
}