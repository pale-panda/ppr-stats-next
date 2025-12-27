import { type NextRequest, NextResponse } from 'next/server';
import { getAllSessions } from '@/lib/data/track-session.data';
import { createFilterParams } from '@/lib/filter-utils';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/sessions/page/[index]'>
) {
  try {
    const { index } = await ctx.params;
    const { searchParams } = new URL(_req.url);
    const pageSize = searchParams.get('pageSize') || '';
    const filter = searchParams.get('filter') || '';
    const page = parseInt(index, 10);

    if (!page) {
      console.error('Missing page parameter', { page });
      throw new Error('Missing page parameter');
    }

    const data = await getAllSessions({
      currentPage: page,
      filter: createFilterParams(filter),
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });

    if (!data.sessions || data.sessions.length === 0) {
      return NextResponse.json(
        { sessions: [], meta: data.meta },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching telemetry data', error);
    throw new Error('Error fetching telemetry data');
  }
}
