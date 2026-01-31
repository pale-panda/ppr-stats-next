'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function NewsEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedTags = useMemo(() => parseTags(tags), [tags]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug: slug.trim() || undefined,
        content,
        coverUrl: coverUrl.trim() ? coverUrl.trim() : null,
        tags: parsedTags,
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? 'Failed to publish news.');
      return;
    }

    toast.success('News post published.');
    setTitle('');
    setSlug('');
    setCoverUrl('');
    setTags('');
    setContent('');
  }

  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle className='text-foreground'>Publish News</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='news-title'>Title</Label>
            <Input
              id='news-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='Race recap: Anderstorp sprint'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='news-slug'>Slug (optional)</Label>
            <Input
              id='news-slug'
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder='anderstorp-sprint-recap'
            />
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='news-cover'>Cover image URL</Label>
            <Input
              id='news-cover'
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              placeholder='https://...'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='news-tags'>Tags (comma separated)</Label>
            <Input
              id='news-tags'
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder='race, podium, team'
            />
            <div className='flex flex-wrap gap-2'>
              {parsedTags.map((tag) => (
                <Badge key={tag} variant='outline'>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='news-content'>Content</Label>
          <Textarea
            id='news-content'
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder='Share the story, results, and next steps...'
            className='min-h-[220px]'
          />
        </div>
        <div className='flex justify-end'>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Publish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
