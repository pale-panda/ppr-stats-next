export * from './app-stats';
export * from './laps.type';
export * from './profile.type';
export * from './sessions.type';
export * from './stats.type';
export * from './telemetry.type';
export * from './track.type';

export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type PaginationMeta = {
  currentPage: number;
  nextPage: number | null;
  totalPages: number;
  totalCount: number;
  remainingCount: number;
  size: number;
};

// CSV parsing types
export interface RaceBoxCSVLapSummary {
  lapNumber: number;
  lapTimeSeconds: number | null;
  sectorTimes: number[];
}

export interface RaceBoxCSVHeader {
  format: string;
  dataSource: string;
  dateUtc: string;
  date: string;
  time: string;
  sessionIndex: number;
  sessionType: string;
  track: string;
  configuration: string;
  laps: number;
  bestLapTime: number;
  lapSummaries: RaceBoxCSVLapSummary[];
}

export interface RaceBoxCSVRecord {
  record: number;
  time: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  gForceX: number;
  gForceZ: number;
  lap: number;
  leanAngle: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
}

export type SearchParams = Record<string, string | string[] | undefined>;
