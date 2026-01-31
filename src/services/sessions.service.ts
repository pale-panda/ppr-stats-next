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
import type { SearchParams, SessionExtras, SessionFull } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export type SessionFullData = {
  data: SessionFull[];
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

    const extras: SessionExtras = {
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

  return { data: mapped as SessionFull[], meta: res.meta };
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

  const extras: SessionExtras = {
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

    const extras: SessionExtras = {
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

  return mapped as SessionFull[];
});

export const getSessionsByTrackSlug = cache(async (slug: string) => {
  const db: SupabaseClient = await createClient();
  const res = await SessionsDAL.getSessionsByTrackSlug(db, slug);

  const mapped = res.map((s) => {
    const trackRaw = s.tracks;
    const profilesRaw = s.profiles;
    const telemetryRaw = s.telemetry_points ? s.telemetry_points : undefined;
    const lapsRaw = s.laps;

    const extras: SessionExtras = {
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

  return mapped as SessionFull[];
});

export const getSessionByIdFull = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();

  const minSpeed = await TelemetryPointsDAL.getTelemetryMinSpeedBySessionId(
    db,
    id,
  );
  const laps = await LapsDAL.getLapsBySessionId(db, id);
  const session = await SessionsDAL.getSessionByIdFull(db, id);

  const calculateTheoreticalBest = () => {
    if (!session) return 0;
    if (!laps.length) return 0;

    const sector1Times = laps
      .map((lap) => lap.sectors?.[0])
      .filter((time): time is number => typeof time === 'number' && time > 0);
    const sector2Times = laps
      .map((lap) => lap.sectors?.[1])
      .filter((time): time is number => typeof time === 'number' && time > 0);
    const sector3Times = laps
      .map((lap) => lap.sectors?.[2])
      .filter((time): time is number => typeof time === 'number' && time > 0);

    if (!sector1Times.length || !sector2Times.length || !sector3Times.length) {
      return 0;
    }

    return (
      Math.min(...sector1Times) +
      Math.min(...sector2Times) +
      Math.min(...sector3Times)
    );
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

  const extras: SessionExtras = {
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
