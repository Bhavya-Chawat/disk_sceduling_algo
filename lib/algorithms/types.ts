export interface SimulationResult {
  algorithm: string;
  totalSeekDistance: number;
  averageSeekDistance: number;
  maxSeekDistance: number;
  variance: number;
  seekSequence: number[];
  requestsProcessed: number;
}
