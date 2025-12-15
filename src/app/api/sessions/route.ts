import { getAllSessions } from '@/lib/data/sessions';
import { createFilterParams } from '@/lib/filter-utils';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  let filter = searchParams.get('filter') || '';

  const data = await getAllSessions({
    currentPage: page,
    filter: createFilterParams(filter),
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
