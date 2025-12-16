import { type NextRequest, NextResponse } from 'next/server';
import { getTelemetry } from '@/lib/data/telemetry';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/sessions/[id]'>
) {
  try {
    const { id: sessionId } = await ctx.params;
    const { searchParams } = new URL(_req.url);
    const lapNumber = searchParams.get('lap');

    if (!sessionId || !lapNumber) {
      console.error('Missing session or lap parameter', {
        sessionId,
        lapNumber,
      });
      throw new Error('Missing session or lap parameter');
    }

    const telemetry = await getTelemetry(sessionId, Number(lapNumber));
    return NextResponse.json(telemetry);
  } catch (error) {
    console.error('Error fetching telemetry data', error);
    throw new Error('Error fetching telemetry data');
  }
}
