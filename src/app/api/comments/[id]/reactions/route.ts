import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reactionSchema = z.object({
  reaction: z.string().trim().min(1).max(32),
});

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/comments/[id]/reactions'>
) {
  const { id: commentId } = await ctx.params;

  if (!commentId) {
    return NextResponse.json({ error: 'Missing comment id' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = reactionSchema.safeParse(body);

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

  const { error } = await supabase.from('comment_reactions').insert({
    comment_id: commentId,
    user_id: user.id,
    reaction: parsed.data.reaction,
  });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to add reaction', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  ctx: RouteContext<'/api/comments/[id]/reactions'>
) {
  const { id: commentId } = await ctx.params;

  if (!commentId) {
    return NextResponse.json({ error: 'Missing comment id' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = reactionSchema.safeParse(body);

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

  const { error } = await supabase
    .from('comment_reactions')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .eq('reaction', parsed.data.reaction);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to remove reaction', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
