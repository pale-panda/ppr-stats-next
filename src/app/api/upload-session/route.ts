import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseRaceBoxCSV, calculateLapData } from '@/lib/csv-parser';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    const sessionSource = path.basename(file.name, '.csv');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();

    // Parse CSV
    const { header, records } = parseRaceBoxCSV(csvContent);

    if (!header.track) {
      return NextResponse.json(
        { success: false, message: 'Track name not found in CSV' },
        { status: 400 }
      );
    }

    // Calculate lap data
    const laps = calculateLapData(records);

    if (laps.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No lap data found in CSV' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Find or create track
    const { data: existingTrack, error: trackError } = await supabase
      .from('tracks')
      .select('id, name')
      .ilike('name', header.track)
      .single();

    if (trackError && trackError.code !== 'PGRST116') {
      console.error('Error fetching track:', trackError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch track' },
        { status: 500 }
      );
    }

    let trackId: string;

    if (existingTrack) {
      trackId = existingTrack.id;
    } else {
      // Track doesn't exist, create it
      const { data: newTrack, error: createTrackError } = await supabase
        .from('tracks')
        .insert({
          name: header.track,
          location: 'Unknown',
          length_meters: 0,
          turns: 0,
        })
        .select('id')
        .single();

      if (createTrackError || !newTrack) {
        console.error('Error creating track:', createTrackError);
        return NextResponse.json(
          { success: false, message: 'Failed to create track' },
          { status: 500 }
        );
      }

      trackId = newTrack.id;
    }

    const sessionDate = new Date(header.dateUtc);

    // Validate the date
    if (isNaN(sessionDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format in CSV' },
        { status: 400 }
      );
    }

    // Find best lap time
    const bestLap = header.bestLapTime;

    const { data: newSession, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        track_id: trackId,
        session_date: sessionDate.toISOString(),
        total_laps: laps.length,
        best_lap_time_seconds: bestLap,
        session_type: header.sessionType,
        data_source: header.dataSource || 'RaceBox',
        vehicle: 'Unknown',
        duration_seconds:
          records.length > 1
            ? (new Date(records[records.length - 1].time).getTime() -
                new Date(records[0].time).getTime()) /
              1000
            : 0,
        session_source: sessionSource,
      })
      .select('id')
      .single();

    if (sessionError || !newSession) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create session: ${
            sessionError?.message || 'Unknown error'
          }`,
          details: sessionError,
        },
        { status: 500 }
      );
    }

    const sessionId = newSession.id;

    const lapsToInsert = laps.map((lap) => ({
      session_id: sessionId,
      lap_number: lap.lapNumber,
      lap_time_seconds:
        header.lapSummaries[lap.lapNumber - 1]?.lapTimeSeconds || 0,
      max_speed_kmh: lap.maxSpeedKmh,
      max_lean_angle: lap.maxLeanAngle,
      max_g_force_x: lap.maxGForceX,
      min_g_force_x: records
        .filter((r) => r.lap === lap.lapNumber)
        .reduce((min, r) => (r.gForceX < min ? r.gForceX : min), Infinity),
      max_g_force_z: lap.maxGForceZ,

      start_time: new Date(lap.startTime).toISOString(),
      end_time: new Date(lap.endTime).toISOString(),
      sector_1: header.lapSummaries[lap.lapNumber - 1]?.sectorTimes[0] || null,
      sector_2: header.lapSummaries[lap.lapNumber - 1]?.sectorTimes[1] || null,
      sector_3: header.lapSummaries[lap.lapNumber - 1]?.sectorTimes[2] || null,
    }));

    const { data: insertedLaps, error: lapsError } = await supabase
      .from('laps')
      .insert(lapsToInsert)
      .select('id, lap_number');

    if (lapsError || !insertedLaps) {
      console.error('Error inserting laps:', lapsError);
      return NextResponse.json(
        { success: false, message: 'Failed to insert laps' },
        { status: 500 }
      );
    }

    // Create a map of lap_number to lap_id
    const lapNumberToId = new Map(
      insertedLaps.map((lap) => [lap.lap_number, lap.id])
    );

    const telemetryPoints = records.map((record) => ({
      session_id: sessionId,
      lap_id: lapNumberToId.get(record.lap),
      lap_number: record.lap,
      record_number: record.record,
      timestamp: new Date(record.time).toISOString(),
      altitude: record.altitude,
      speed_kmh: record.speed,
      g_force_x: record.gForceX,
      g_force_z: record.gForceZ,
      lean_angle: record.leanAngle,
      gyro_x: record.gyroX,
      gyro_y: record.gyroY,
      gyro_z: record.gyroZ,
      gps_point: {
        lat: record.latitude,
        lng: record.longitude,
      },
    }));

    // Insert in batches of 1000 to avoid payload size limits
    const batchSize = 1000;
    for (let i = 0; i < telemetryPoints.length; i += batchSize) {
      const batch = telemetryPoints.slice(i, i + batchSize);
      const { error: telemetryError } = await supabase
        .from('telemetry_points')
        .insert(batch);

      if (telemetryError) {
        console.error('Error inserting telemetry batch:', telemetryError);
        // Continue with other batches even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Session uploaded successfully! ${laps.length} laps and ${records.length} telemetry points imported.`,
      sessionId,
      trackName: header.track,
      laps: laps.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
