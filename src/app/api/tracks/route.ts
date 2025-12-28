import { getTracks } from '@/lib/data/tracks.data';
import { createFilterParams } from '@/lib/filter-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queryParams = searchParams.get('query') || undefined;
  const query = queryParams ? createFilterParams(queryParams) : undefined;

  const data = await getTracks({
    query,
  });

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
