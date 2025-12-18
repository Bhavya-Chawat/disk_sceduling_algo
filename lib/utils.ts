import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRequestString(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n >= 0);
}

export function validateRequests(
  requests: number[],
  totalTracks: number
): { valid: boolean; error?: string } {
  if (requests.length === 0) {
    return { valid: false, error: 'At least one request is required' };
  }

  const invalidRequests = requests.filter(r => r >= totalTracks);
  if (invalidRequests.length > 0) {
    return {
      valid: false,
      error: `Requests ${invalidRequests.join(', ')} exceed total tracks (${totalTracks})`,
    };
  }

  return { valid: true };
}

export function generateRandomRequests(
  count: number,
  totalTracks: number
): number[] {
  const requests: number[] = [];
  for (let i = 0; i < count; i++) {
    requests.push(Math.floor(Math.random() * totalTracks));
  }
  return requests;
}