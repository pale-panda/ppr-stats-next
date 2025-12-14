import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient();

    // Get all sessions with laps
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(
        `
        *,
        track:tracks(*),
        laps(*)
      `
      )
      .order('session_date', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching analytics data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Calculate all-time stats
    const allLaps = sessions?.flatMap((s) => s.laps || []) || [];
    const allTimes = allLaps
      .map((l) => l.lap_time_seconds)
      .filter((t) => t > 0);
    const bestLapTime = allTimes.length > 0 ? Math.min(...allTimes) : 0;
    const avgLapTime =
      allTimes.length > 0
        ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
        : 0;
    const totalLaps = allLaps.length;
    const topSpeed = Math.max(...allLaps.map((l) => l.max_speed_kmh || 0));

    return NextResponse.json({
      bestLapTime,
      avgLapTime,
      totalLaps,
      topSpeed,
      sessions: sessions || [],
    });
  } catch (error) {
    console.error('[v0] Error in analytics route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
