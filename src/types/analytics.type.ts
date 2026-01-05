export type AnalyticsTrack = {
  id: string;
  name: string;
  country: string;
};

export type AnalyticsLap = {
  id: string;
  lapNumber: number;
  lapTimeSeconds: number;
  maxSpeedKmh: number | null;
  sectors: [number, number, number];
};

export type AnalyticsSession = {
  id: string;
  sessionType: string;
  sessionDate: string;
  totalLaps: number;
  bestLapTimeSeconds: number;
  track: AnalyticsTrack;
  laps: AnalyticsLap[];
};

export type AnalyticsData = {
  sessions: AnalyticsSession[];
  bestLapTime: number;
  avgLapTime: number;
  totalLaps: number;
  topSpeed: number;
};
