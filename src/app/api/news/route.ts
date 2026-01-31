import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createNewsSchema = z.object({
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().min(10),
  coverUrl: z.string().trim().url().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(32)).optional(),
  slug: z.string().trim().min(3).max(140).optional(),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? '20');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select(
      'id, title, slug, content, cover_url, tags, published_at, created_at, author_id, profiles ( id, first_name, last_name, avatar_url, role )'
    )
    .order('published_at', { ascending: false })
    .limit(Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 20);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createNewsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.title);

  const { data, error } = await supabase
    .from('news_posts')
    .insert({
      author_id: user.id,
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      cover_url: parsed.data.coverUrl ?? null,
      tags: parsed.data.tags ?? [],
    })
    .select('id, title, slug, published_at')
    .single();

  if (error) {
    const isConflict = error.message?.toLowerCase().includes('duplicate');
    return NextResponse.json(
      { error: 'Failed to create news', details: error.message },
      { status: isConflict ? 409 : 500 }
    );
  }

  return NextResponse.json({ post: data });
}
