export type Slug =
  | undefined
  | { slug: string }
  | { slug: string; year: string }
  | { slug: string; year: string; sessionId: string };

export type RouteState =
  | { kind: 'index' }
  | { kind: 'track'; slug: string }
  | { kind: 'year'; slug: string; year: string }
  | {
      kind: 'session';
      slug: string;
      year: string;
      sessionId: string;
    };

export type TrackBySlug = {
  id: string;
  slug: string;
  name: string;
};

type TrackSessionsBySlugLaps = {
  lapNumber: number;
  lapTimeSeconds: number;
  sectors: number[];
  lapTelemetry: {
    lapNumber: number;
    totalPoints: number;
    avgSpeedKmh: number;
    maxSpeedKmh: number;
    minSpeedKmh: number;
    avgGForceX: number;
    maxGForceX: number;
    minGForceX: number;
    avgGForceZ: number;
    maxGForceZ: number;
    minGForceZ: number;
    avgLeanAngle: number;
    maxLeanAngle: number;
    minLeanAngle: number;
  }[];
};

type TrackSessionsBySlugSessions = {
  id: string;
  sessionDate: string;
  sessionType: string;
  trackSlug: string;
  totalSessions: number;
  lapStats: {
    bestLapTimeSeconds: number;
    totalLaps: number;
    topSpeedKmh: number;
    telemetry: {
      totalRows: number;
      avgSpeedKmh: number;
      maxSpeedKmh: number;
      minSpeedKmh: number;
    }[];
  }[];
  laps: TrackSessionsBySlugLaps[];
};

export type TrackSessionsBySlug = {
  id: string;
  slug: string;
  name: string;
  country: string;
  imageUrl: string | null;
  lengthMeters: number;
  turns: number;
  sessions: TrackSessionsBySlugSessions[];
};
