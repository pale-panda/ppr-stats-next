'use server';
import { LapsDAL } from '@/db/laps.dal';
import { SessionsDAL } from '@/db/sessions.dal';
import { TelemetryPointsDAL } from '@/db/telemetry-points.dal';
import type { MetaOptions } from '@/db/types/db.types';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams, SessionFull, SessionApp } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { mapTelemetryRowsToApp } from '@/lib/mappers/telemetry.mapper';
import { mapLapRowsToApp } from '@/lib/mappers/lap.mapper';
import { mapSessionRowToApp } from '@/types/sessions.type';
import { mapProfileRowToApp } from '@/lib/mappers/profile.mapper';
import { mapTrackRowToApp } from '@/lib/mappers/track.mapper';

export type SessionFullData = {
  data: SessionFull[];
  meta: MetaOptions;
};

export const getSessions = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  return SessionsDAL.listSessions(db, searchParams);
});

export const getSessionsFull = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const res = await SessionsDAL.listSessionsFull(db, searchParams);
  const mapped = res.data.map((s) => {
    const trackRaw = s.tracks
      ? Array.isArray(s.tracks)
        ? s.tracks[0]
        : s.tracks
      : undefined;
    const profilesRaw = s.profiles
      ? Array.isArray(s.profiles)
        ? s.profiles[0]
        : s.profiles
      : undefined;
    const telemetryRaw = s.telemetry_points
      ? Array.isArray(s.telemetry_points)
        ? s.telemetry_points
        : s.telemetry_points
      : undefined;
    const lapsRaw = s.laps ? s.laps : undefined;

    const extras: Partial<SessionFull> = {
      tracks: trackRaw ? mapTrackRowToApp(trackRaw) : undefined,
      profiles: profilesRaw ? mapProfileRowToApp(profilesRaw) : undefined,
      telemetry_points: telemetryRaw
        ? mapTelemetryRowsToApp(telemetryRaw)
        : undefined,
      laps: lapsRaw ? mapLapRowsToApp(lapsRaw) : undefined,
    };

    // mapSessionRowToApp will combine base session row with computed relations
    return mapSessionRowToApp(s, extras);
  });

  return { data: mapped as SessionApp[], meta: res.meta };
});

export const getSessionById = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const data = await SessionsDAL.getSessionById(db, id);

  return mapSessionRowToApp(data);
});

export const getSessionByTrackId = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const data = await SessionsDAL.getSessionsByTrackId(db, id);
  return mapSessionRowTpApp(data);
});

export const getSessionByIdFull = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();

  const minSpeed = await TelemetryPointsDAL.getTelemetryMinSpeedBySessionId(
    db,
    id
  );
  const laps = await LapsDAL.getLapsBySessionId(db, id);
  const session = await SessionsDAL.getSessionByIdFull(db, id);

  const calculateTheoreticalBest = () => {
    if (!session) return 0;
    const sector1Best = Math.min(
      ...laps.map((lap) => lap.sector_1).filter((time) => time !== null)
    );
    const sector2Best = Math.min(
      ...laps.map((lap) => lap.sector_2).filter((time) => time !== null)
    );
    const sector3Best = Math.min(
      ...laps.map((lap) => lap.sector_3).filter((time) => time !== null)
    );
    return (sector1Best || 0) + (sector2Best || 0) + (sector3Best || 0);
  };

  if (!session) return null;

  const telemetryRaw = session.telemetry_points
    ? session.telemetry_points
    : undefined;
  const trackRaw = session.tracks
    ? Array.isArray(session.tracks)
      ? session.tracks[0]
      : session.tracks
    : undefined;
  const profilesRaw = session.profiles
    ? Array.isArray(session.profiles)
      ? session.profiles[0]
      : session.profiles
    : undefined;

  const extras: Partial<SessionFull> = {
    telemetry_points: telemetryRaw
      ? mapTelemetryRowsToApp(telemetryRaw)
      : undefined,
    tracks: trackRaw ? mapTrackRowToApp(trackRaw) : undefined,
    profiles: profilesRaw ? mapProfileRowToApp(profilesRaw) : undefined,
    laps: laps ? mapLapRowsToApp(laps) : undefined,
    avg_speed: laps.length
      ? laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length
      : null,
    min_speed: minSpeed ?? null,
    max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
    max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
    max_g_force_x: Math.max(...laps.map((l) => l.max_g_force_x || 0)),
    min_g_force_x: Math.min(...laps.map((l) => l.max_g_force_x || 0)),
    max_g_force_z: Math.max(...laps.map((l) => l.max_g_force_z || 0)),
    theoretical_best: calculateTheoreticalBest(),
  };

  return mapSessionRowToApp(session, extras);
});
