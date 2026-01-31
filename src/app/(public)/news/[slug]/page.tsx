import { HeroSection } from '@/components/hero-section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSessionDate } from '@/lib/format-utils';
import { getNewsPostBySlug } from '@/services/news.service';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest updates from Pale Panda Racing Team',
};

function excerpt(content: string) {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  return (
    <>
      <HeroSection />
      <section className='container mx-auto px-4 py-10'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground'>
            Team News
          </h1>
          <p className='text-muted-foreground mt-2'>
            Race results, events, and announcements from Pale Panda Racing.
          </p>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {!post ? (
            <p className='text-sm text-muted-foreground'>
              No news yet. Check back soon.
            </p>
          ) : (
            <Card
              key={post.id}
              className='bg-card border-border/50 overflow-hidden'>
              {post.cover_url && (
                <div className='relative h-44 w-full'>
                  <Image
                    src={post.cover_url}
                    alt={post.title}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className='text-foreground'>{post.title}</CardTitle>
                <p className='text-xs text-muted-foreground'>
                  {formatSessionDate(post.published_at)}
                </p>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-muted-foreground'>
                  {excerpt(post.content)}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant='outline'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
