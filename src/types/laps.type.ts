export type LapFilters = {
  session_id?: string[];
  lap_number?: number[];
  track_id?: string[];
};

// App-facing lap model (camelCase)
export type Lap = {
  id: string;
  lapNumber: number;
  lapTimeSeconds: number;
  maxLeanAngle: number;
  maxSpeedKmh: number;
  maxGForceX: number;
  maxGForceZ: number;
  minGForceX: number;
  minGForceZ: number;
  startTime: string;
  endTime: string;
  sectors: [number, number, number];
  trackId: string;
  sessionId: string | null;
};
