import { type NextRequest, NextResponse } from 'next/server';
import { getTelemetry } from '@/lib/data/telemetry.data';

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/sessions/[id]/laps/[lap]'>
) {
  try {
    const { id: sessionId, lap: lapNumber } = await ctx.params;

    if (!sessionId || !lapNumber) {
      console.error('Missing session or lap parameter', {
        sessionId,
        lapNumber,
      });
      return NextResponse.json(
        { error: 'Missing session or lap parameter' },
        { status: 400 }
      );
    }

    if (Number(lapNumber) === 0) {
      return NextResponse.json([]);
    }

    const telemetry = await getTelemetry(sessionId, Number(lapNumber));
    return NextResponse.json(telemetry);
  } catch (error) {
    console.error('Error fetching telemetry data', error);
    throw new Error('Error fetching telemetry data');
  }
}
