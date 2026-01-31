import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/sessions/[id]/comments/[commentId]'>
) {
  const { id: sessionId, commentId } = await ctx.params;

  if (!sessionId || !commentId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('session_comments')
    .update({ body: parsed.data.body, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('session_id', sessionId);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to update comment', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/sessions/[id]/comments/[commentId]'>
) {
  const { id: sessionId, commentId } = await ctx.params;

  if (!sessionId || !commentId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('session_comments')
    .update({
      body: '[deleted]',
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .eq('session_id', sessionId);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete comment', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
