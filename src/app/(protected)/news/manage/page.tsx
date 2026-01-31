import { NewsEditor } from '@/components/news/news-editor';
import { NewsManagerList } from '@/components/news/news-manager-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage News',
  description: 'Publish news updates for the team',
};

export default async function NewsManagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className='container mx-auto px-4 py-10'>
        <Card className='bg-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-foreground'>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Please sign in to manage team news.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'user';
  const canManage = role === 'admin' || role === 'team';

  if (!canManage) {
    return (
      <section className='container mx-auto px-4 py-10'>
        <Card className='bg-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-foreground'>Access denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Your role does not allow publishing news.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className='container mx-auto px-4 py-10 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>News Manager</h1>
        <p className='text-muted-foreground mt-2'>
          Create and publish news updates for Pale Panda Racing.
        </p>
      </div>

      <NewsEditor />

      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle className='text-foreground'>Recent posts</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <NewsManagerList />
        </CardContent>
      </Card>
    </section>
  );
}
