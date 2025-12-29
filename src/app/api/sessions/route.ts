import { getAllSessions } from '@/lib/data/track-session.data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || undefined;
  const size = Number(searchParams.get('size')) || undefined;
  const country = searchParams.getAll('country') || undefined;
  const name = searchParams.getAll('name') || undefined;

  let filter = {};
  if (country.length > 0) {
    filter = { ...filter, country };
  }
  if (name.length > 0) {
    filter = { ...filter, name };
  }

  const data = await getAllSessions({
    page,
    size,
    filter,
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
