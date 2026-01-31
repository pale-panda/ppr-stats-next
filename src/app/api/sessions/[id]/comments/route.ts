import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().uuid().nullable().optional(),
});

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/sessions/[id]/comments'>
) {
  const { id: sessionId } = await ctx.params;

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: comments, error: commentsError } = await supabase
    .from('session_comments')
    .select(
      'id, body, created_at, updated_at, deleted_at, parent_id, user_id, profiles ( id, first_name, last_name, avatar_url, role )'
    )
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (commentsError) {
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: commentsError.message },
      { status: 500 }
    );
  }

  const commentIds = (comments ?? []).map((comment) => comment.id);

  const { data: reactions, error: reactionsError } = commentIds.length
    ? await supabase
        .from('comment_reactions')
        .select('comment_id, user_id, reaction')
        .in('comment_id', commentIds)
    : { data: [], error: null };

  if (reactionsError) {
    return NextResponse.json(
      { error: 'Failed to fetch reactions', details: reactionsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    comments: comments ?? [],
    reactions: reactions ?? [],
    currentUserId: user.id,
  });
}

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/sessions/[id]/comments'>
) {
  const { id: sessionId } = await ctx.params;

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createCommentSchema.safeParse(body);

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

  const { data, error } = await supabase
    .from('session_comments')
    .insert({
      session_id: sessionId,
      user_id: user.id,
      body: parsed.data.body,
      parent_id: parsed.data.parentId ?? null,
    })
    .select(
      'id, body, created_at, updated_at, deleted_at, parent_id, user_id, profiles ( id, first_name, last_name, avatar_url, role )'
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Failed to create comment', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment: data });
}
