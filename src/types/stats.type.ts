export type DashboardStats = {
  totalSessions: number;
  totalLaps: number;
  bestLapTime: number | null;
  topSpeed: number | null;
};

export type UserStats = {
  totalSessions: number;
  totalLaps: number;
  bestLapTime: number | null;
  topSpeed: number | null;
};

export type TrackStats = {
  trackId: string;
  trackName: string;
  totalLaps: number;
  bestLapTime: number | null;
  topSpeed: number | null;
};

export type SessionStats = {
  sessionId: string;
  totalLaps: number;
  bestLapTime: number | null;
  topSpeed: number | null;
};

export type LapStats = {
  lapId: string;
  lapTime: number | null;
  averageSpeed: number | null;
  maxSpeed: number | null;
  averageLeanAngle: number | null;
  maxLeanAngle: number | null;
  gForce: number | null;
};

export type AppStats = {
  totalTracks: number;
  totalSessions: number;
  totalLaps: number;
  totalUsers: number;
};

export type StatsType = 'dashboard' | 'user' | 'track' | 'session' | 'lap' | 'app';

export type StatItem = {
  label: string;
  value: string | number | null;
  sublabel?: string;
  icon? : React.ComponentType<React.SVGProps<SVGSVGElement>>;
};