'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type NewsPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string | null;
  tags: string[];
  published_at: string;
};

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function NewsManagerList() {
  const { data, mutate } = useSWR('/api/news?limit=50', fetcher);
  const posts = (data?.posts ?? []) as NewsPost[];

  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const parsedTags = useMemo(() => parseTags(tags), [tags]);

  const openEditor = (post: NewsPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCoverUrl(post.cover_url ?? '');
    setTags(post.tags.join(', '));
    setContent(post.content);
  };

  const closeEditor = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setCoverUrl('');
    setTags('');
    setContent('');
  };

  const handleSave = async () => {
    if (!editingPost) return;
    const res = await fetch(`/api/news/${editingPost.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        content,
        coverUrl: coverUrl.trim() ? coverUrl.trim() : null,
        tags: parsedTags,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? 'Failed to update news.');
      return;
    }

    toast.success('News updated.');
    closeEditor();
    await mutate();
  };

  const handleDelete = async (postId: string) => {
    const confirmDelete = window.confirm(
      'Delete this news post? This cannot be undone.'
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/news/${postId}`, { method: 'DELETE' });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? 'Failed to delete news.');
      return;
    }

    toast.success('News deleted.');
    await mutate();
  };

  return (
    <div className='space-y-4'>
      {posts.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No news published yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className='flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {post.title}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {format(new Date(post.published_at), 'PPP')}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant='outline'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>/news/{post.slug}</p>
            <div className='flex gap-2'>
              <Button size='sm' variant='secondary' onClick={() => openEditor(post)}>
                Edit
              </Button>
              <Button size='sm' variant='destructive' onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}

      <Dialog open={Boolean(editingPost)} onOpenChange={(open) => (!open ? closeEditor() : null)}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Edit news post</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder='Slug' />
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder='Cover image URL'
            />
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='Tags (comma separated)'
            />
            <div className='flex flex-wrap gap-2'>
              {parsedTags.map((tag) => (
                <Badge key={tag} variant='outline'>
                  {tag}
                </Badge>
              ))}
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Content'
              className='min-h-[180px]'
            />
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={closeEditor}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
