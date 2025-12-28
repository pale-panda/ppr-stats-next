import { getAllSessions } from '@/lib/data/track-session.data';
import { createFilterParams } from '@/lib/filter-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || undefined;
  const pageSize = Number(searchParams.get('pageSize')) || undefined;
  const queryParams = searchParams.get('query') || undefined;
  const query = queryParams ? createFilterParams(queryParams) : undefined;

  const data = await getAllSessions({
    page,
    pageSize,
    query,
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
}
