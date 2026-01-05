'use server';
import { LapsDAL } from '@/db/laps.dal';
import { SessionsDAL } from '@/db/sessions.dal';
import { TelemetryPointsDAL } from '@/db/telemetry-points.dal';
import type { QueryOptions } from '@/db/types/db.types';
import { mapLapRowsToApp } from '@/lib/mappers/lap.mapper';
import { mapProfileRowToApp } from '@/lib/mappers/profile.mapper';
import {
  mapSessionFullRowToApp,
  mapSessionRowsToApp,
} from '@/lib/mappers/session.mapper';
import { mapTelemetryRowsToApp } from '@/lib/mappers/telemetry.mapper';
import { mapTrackRowToApp } from '@/lib/mappers/track.mapper';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams, SessionAppExtras, SessionAppFull } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export type SessionFullData = {
  data: SessionAppFull[];
  meta: QueryOptions;
};

export const getSessions = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const data = await SessionsDAL.listSessions(db, searchParams);

  return {
    data: mapSessionRowsToApp(data.data),
    meta: data.meta,
  };
});

export const getSessionsFull = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const res = await SessionsDAL.listSessionsFull(db, searchParams);
  const mapped = res.data.map((s) => {
    const trackRaw = s.tracks;
    const profilesRaw = s.profiles;
    const telemetryRaw = s.telemetry_points ? s.telemetry_points : undefined;
    const lapsRaw = s.laps;

    const extras: SessionAppExtras = {
      tracks: mapTrackRowToApp(trackRaw),
      profiles: mapProfileRowToApp(profilesRaw),
      telemetryPoints: telemetryRaw
        ? mapTelemetryRowsToApp(telemetryRaw)
        : undefined,
      laps: mapLapRowsToApp(lapsRaw),
    };

    // mapSessionRowToApp will combine base session row with computed relations
    return mapSessionFullRowToApp(s, extras);
  });

  return { data: mapped as SessionAppFull[], meta: res.meta };
});

export const getSessionById = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const data = await SessionsDAL.getSessionById(db, id);

  const trackRaw = data.tracks;
  const profilesRaw = data.profiles;
  const telemetryRaw = data.telemetry_points
    ? data.telemetry_points
    : undefined;
  const lapsRaw = data.laps;

  const extras: SessionAppExtras = {
    tracks: mapTrackRowToApp(trackRaw),
    profiles: mapProfileRowToApp(profilesRaw),
    telemetryPoints: telemetryRaw
      ? mapTelemetryRowsToApp(telemetryRaw)
      : undefined,
    laps: mapLapRowsToApp(lapsRaw),
  };

  return mapSessionFullRowToApp(data, extras);
});

export const getSessionsByTrackId = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const res = await SessionsDAL.getSessionsByTrackId(db, id);

  const mapped = res.map((s) => {
    const trackRaw = s.tracks;
    const profilesRaw = s.profiles;
    const telemetryRaw = s.telemetry_points ? s.telemetry_points : undefined;
    const lapsRaw = s.laps;

    const extras: SessionAppExtras = {
      tracks: mapTrackRowToApp(trackRaw),
      profiles: mapProfileRowToApp(profilesRaw),
      telemetryPoints: telemetryRaw
        ? mapTelemetryRowsToApp(telemetryRaw)
        : undefined,
      laps: mapLapRowsToApp(lapsRaw),
    };

    // mapSessionRowToApp will combine base session row with computed relations
    return mapSessionFullRowToApp(s, extras);
  });

  return mapped as SessionAppFull[];
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

  const extras: SessionAppExtras = {
    telemetryPoints: telemetryRaw
      ? mapTelemetryRowsToApp(telemetryRaw)
      : undefined,
    tracks: mapTrackRowToApp(trackRaw),
    profiles: mapProfileRowToApp(profilesRaw),
    laps: mapLapRowsToApp(laps),
    avgSpeed: laps.length
      ? laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length
      : null,
    minSpeed: minSpeed ?? null,
    maxSpeed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
    maxLeanAngle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
    maxGForceX: Math.max(...laps.map((l) => l.max_g_force_x || 0)),
    minGForceX: Math.min(...laps.map((l) => l.max_g_force_x || 0)),
    maxGForceZ: Math.max(...laps.map((l) => l.max_g_force_z || 0)),
    theoreticalBest: calculateTheoreticalBest(),
  };

  return mapSessionFullRowToApp(session, extras);
});
