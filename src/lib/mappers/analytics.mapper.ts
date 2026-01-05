import type {
  AnalyticsLap,
  AnalyticsSession,
  AnalyticsTrack,
} from '@/types/analytics.type';

export type AnalyticsSessionRow = {
  id: string;
  session_type: string;
  session_date: string;
  total_laps: number;
  best_lap_time_seconds: number;
  track: {
    id: string;
    name: string;
    country: string;
  } | null;
  laps: Array<{
    id: string;
    lap_number: number;
    lap_time_seconds: number;
    max_speed_kmh: number | null;
    sectors: number[];
  }> | null;
};

function toSectorsTuple(
  sectors: number[] | null | undefined
): [number, number, number] {
  return [
    typeof sectors?.[0] === 'number' ? sectors[0] : 0,
    typeof sectors?.[1] === 'number' ? sectors[1] : 0,
    typeof sectors?.[2] === 'number' ? sectors[2] : 0,
  ];
}

export function mapAnalyticsTrackRowToDomain(
  track: AnalyticsSessionRow['track']
): AnalyticsTrack {
  return {
    id: track?.id ?? '',
    name: track?.name ?? '',
    country: track?.country ?? '',
  };
}

export function mapAnalyticsLapRowsToDomain(
  laps: AnalyticsSessionRow['laps']
): AnalyticsLap[] {
  if (!laps) return [];

  return laps
    .filter((lap) => Boolean(lap))
    .map((lap) => ({
      id: lap.id,
      lapNumber: lap.lap_number,
      lapTimeSeconds: lap.lap_time_seconds,
      maxSpeedKmh: lap.max_speed_kmh ?? null,
      sectors: toSectorsTuple(lap.sectors),
    }));
}

export function mapAnalyticsSessionRowsToDomain(
  sessions: AnalyticsSessionRow[]
): AnalyticsSession[] {
  return sessions.map((s) => ({
    id: s.id,
    sessionType: s.session_type,
    sessionDate: s.session_date,
    totalLaps: s.total_laps,
    bestLapTimeSeconds: s.best_lap_time_seconds,
    track: mapAnalyticsTrackRowToDomain(s.track),
    laps: mapAnalyticsLapRowsToDomain(s.laps),
  }));
}
