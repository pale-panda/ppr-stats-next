import { LatLngLiteral } from '@/types';

export type TrackFilters = {
  name?: string[];
  country?: string[];
  search?: string;
};

// App-facing track model (camelCase)
export type Track = {
  id: string;
  name: string;
  country: string;
  lengthMeters?: number | null;
  turns?: number | null;
  imageUrl: string | null;
  configuration?: string | null;
  description?: string | null;
  gpsPoint?: LatLngLiteral | null;
};

export type TrackStats = {
  id: string;
  name: string;
  country: string;
  lengthMeters: number;
  turns: number;
  imageUrl: string | null;
  stats: {
      bestLapTime: number;
      totalLaps: number;
      avgTopSpeed: number;
      totalSessions: number;
  };
}