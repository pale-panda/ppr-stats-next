'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
};

type Comment = {
  id: string;
  body: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  parent_id: string | null;
  user_id: string;
  profiles: Profile | null;
};

type Reaction = {
  comment_id: string;
  user_id: string;
  reaction: string;
};

const REACTIONS = ['👍', '🔥', '🏁'];

type CommentNode = Comment & { replies: CommentNode[] };

function buildTree(comments: Comment[]) {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    const node = byId.get(comment.id)!;
    if (comment.parent_id && byId.has(comment.parent_id)) {
      byId.get(comment.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function formatName(profile: Profile | null) {
  if (!profile) return 'Unknown';
  return `${profile.first_name} ${profile.last_name}`.trim();
}

export function SessionComments({ sessionId }: { sessionId: string }) {
  const { data, mutate } = useSWR(
    `/api/sessions/${sessionId}/comments`,
    fetcher,
  );
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const comments = useMemo(
    () => (data?.comments ?? []) as Comment[],
    [data?.comments],
  );
  const reactions = useMemo(
    () => (data?.reactions ?? []) as Reaction[],
    [data?.reactions],
  );
  const currentUserId = data?.currentUserId as string | undefined;

  const tree = useMemo(() => buildTree(comments), [comments]);

  const reactionMap = useMemo(() => {
    const map = new Map<string, Reaction[]>();
    for (const reaction of reactions) {
      const list = map.get(reaction.comment_id) ?? [];
      list.push(reaction);
      map.set(reaction.comment_id, list);
    }
    return map;
  }, [reactions]);

  async function handleSubmit() {
    if (!body.trim()) return;

    setIsSubmitting(true);
    const res = await fetch(`/api/sessions/${sessionId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, parentId: replyTo }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setBody('');
      setReplyTo(null);
      await mutate();
    }
  }

  async function handleReaction(commentId: string, reaction: string) {
    if (!currentUserId) return;
    const existing = (reactionMap.get(commentId) ?? []).some(
      (r) => r.user_id === currentUserId && r.reaction === reaction,
    );

    await fetch(`/api/comments/${commentId}/reactions`, {
      method: existing ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction }),
    });

    await mutate();
  }

  async function handleEdit(commentId: string) {
    if (!editingBody.trim()) return;

    const res = await fetch(
      `/api/sessions/${sessionId}/comments/${commentId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editingBody }),
      },
    );

    if (res.ok) {
      setEditingId(null);
      setEditingBody('');
      await mutate();
    }
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(
      `/api/sessions/${sessionId}/comments/${commentId}`,
      {
        method: 'DELETE',
      },
    );

    if (res.ok) {
      await mutate();
    }
  }

  function renderComment(node: CommentNode, depth = 0) {
    const profile = node.profiles;
    const name = formatName(profile);
    const commentReactions = reactionMap.get(node.id) ?? [];
    const reactionCounts = REACTIONS.map((reaction) => ({
      reaction,
      count: commentReactions.filter((r) => r.reaction === reaction).length,
      active: commentReactions.some(
        (r) => r.reaction === reaction && r.user_id === currentUserId,
      ),
    }));

    return (
      <div key={node.id} className={cn('space-y-4', depth > 0 && 'pl-6')}>
        <div className='flex items-start gap-3'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
            <AvatarFallback>
              {name
                .split(' ')
                .map((part) => part.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm font-semibold text-foreground'>
                {name}
              </span>
              <Badge variant='outline' className='text-[10px] uppercase'>
                {profile?.role ?? 'member'}
              </Badge>
              <span className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(node.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {editingId === node.id ? (
              <div className='space-y-2'>
                <Textarea
                  value={editingBody}
                  onChange={(event) => setEditingBody(event.target.value)}
                />
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => handleEdit(node.id)}
                    disabled={!editingBody.trim()}>
                    Save
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      setEditingId(null);
                      setEditingBody('');
                    }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className={cn(
                  'text-sm text-foreground',
                  node.deleted_at && 'text-muted-foreground italic',
                )}>
                {node.body}
              </p>
            )}
            <div className='flex flex-wrap items-center gap-2'>
              {REACTIONS.map((reaction) => (
                <Button
                  key={reaction}
                  variant='outline'
                  size='sm'
                  onClick={() => handleReaction(node.id, reaction)}
                  className={cn(
                    'h-8 px-2 text-xs',
                    reactionCounts.find((item) => item.reaction === reaction)
                      ?.active && 'border-primary text-primary',
                  )}>
                  {reaction}{' '}
                  <span className='ml-1 text-[10px]'>
                    {
                      reactionCounts.find((item) => item.reaction === reaction)
                        ?.count
                    }
                  </span>
                </Button>
              ))}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setReplyTo(node.id)}>
                Reply
              </Button>
              {currentUserId === node.user_id && !node.deleted_at && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setEditingId(node.id);
                      setEditingBody(node.body);
                    }}>
                    Edit
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(node.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {node.replies.length > 0 && (
          <div className='space-y-4 border-l border-border/60 pl-4'>
            {node.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle className='text-foreground'>Team Comments</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          {replyTo && (
            <div className='flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs'>
              <span>Replying to a comment</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setReplyTo(null)}>
                Clear
              </Button>
            </div>
          )}
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder='Write a comment...'
            className='min-h-[120px]'
          />
          <div className='flex justify-end'>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Post comment
            </Button>
          </div>
        </div>
        <Separator />
        <div className='space-y-6'>
          {tree.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No comments yet. Start the conversation.
            </p>
          ) : (
            tree.map((node) => renderComment(node))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
