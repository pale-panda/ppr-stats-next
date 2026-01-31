import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateNewsSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  content: z.string().trim().min(10).optional(),
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

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/news/[id]'>
) {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateNewsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.title) updatePayload.title = parsed.data.title;
  if (parsed.data.content) updatePayload.content = parsed.data.content;
  if (parsed.data.coverUrl !== undefined) {
    updatePayload.cover_url = parsed.data.coverUrl;
  }
  if (parsed.data.tags) updatePayload.tags = parsed.data.tags;
  if (parsed.data.slug) updatePayload.slug = slugify(parsed.data.slug);

  if (Object.keys(updatePayload).length === 1) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('news_posts')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    const isConflict = error.message?.toLowerCase().includes('duplicate');
    return NextResponse.json(
      { error: 'Failed to update news', details: error.message },
      { status: isConflict ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/news/[id]'>
) {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('news_posts').delete().eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete news', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
