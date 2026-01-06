'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatSessionDate } from '@/lib/format-utils';
import type { SessionFull } from '@/types/sessions.type';
import { ArrowLeft, BarChart3, MapPin } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { usePathname } from 'next/navigation';

interface TrackSessionTopSectionProps {
  session: Promise<SessionFull | null>;
}

export default function TrackSessionTopSection({
  session,
}: TrackSessionTopSectionProps) {
  const data = use(session);
  const pathname = usePathname();

    const dashboardUrl = pathname.replace('/sessions', '/dashboard');

  if (!data) {
    return null;
  }
  const track = data.tracks;

  return (
    <div className='container mx-auto px-4 pb-6'>
      <Link
        href='/sessions'
        className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors'>
        <ArrowLeft className='w-4 h-4' />
        Back to Sessions
      </Link>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
        <div>
          <Badge className='bg-primary text-primary-foreground'>
            {data.sessionType}
          </Badge>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance'>
            {track?.name || 'Unknown Track'}
          </h1>
          <div className='flex items-center gap-2 text-muted-foreground mt-2'>
            <MapPin className='w-4 h-4' />
            <span>
              {track?.name}
              {track?.country && `, ${track.country}`}
            </span>
            <span className='text-border'>•</span>
            <span>{formatSessionDate(data.sessionDate)}</span>
          </div>
        </div>
        <Button className='bg-primary hover:bg-primary/90 w-fit' asChild>
          <Link href={dashboardUrl}>
            <BarChart3 className='w-4 h-4 mr-2' />
            Open Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
