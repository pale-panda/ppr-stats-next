import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Flag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SessionCardProps {
  id: string;
  title: string;
  track: string;
  date: string;
  duration?: string;
  laps: number;
  bestLap: string;
  status: 'completed' | 'live' | 'upcoming';
  imageUrl: string | null;
}

export function SessionCard({
  id,
  title,
  track,
  date,
  duration,
  laps,
  bestLap,
  status,
  imageUrl,
}: SessionCardProps) {
  const statusStyles = {
    completed: 'bg-muted text-muted-foreground',
    live: 'bg-primary text-primary-foreground animate-pulse',
    upcoming: 'bg-secondary text-secondary-foreground',
  };

  const statusLabels = {
    completed: 'Completed',
    live: 'Live',
    upcoming: 'Upcoming',
  };

  return (
    <Card className='group pt-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300'>
      <div className='relative aspect-video overflow-hidden'>
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent' />
        <Badge className={`absolute top-4 left-4 ${statusStyles[status]}`}>
          {statusLabels[status]}
        </Badge>
        <div className='absolute bottom-4 left-4 right-4'>
          <p className='text-sm text-muted-foreground font-mono'>{date}</p>
          <h3 className='text-xl font-bold text-foreground mt-1 text-balance'>
            {title}
          </h3>
        </div>
      </div>
      <CardContent className='p-4'>
        <div className='flex items-center gap-2 text-muted-foreground mb-4'>
          <MapPin className='w-4 h-4' />
          <span className='text-sm'>{track}</span>
        </div>
        <div className='grid grid-cols-3 gap-4 mb-4'>
          <div>
            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
              Duration
            </p>
            <p className='text-sm font-mono font-medium text-foreground flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {duration}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
              Laps
            </p>
            <p className='text-sm font-mono font-medium text-foreground flex items-center gap-1'>
              <Flag className='w-3 h-3' />
              {laps}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
              Best Lap
            </p>
            <p className='text-sm font-mono font-medium text-primary'>
              {bestLap}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' className='flex-1 bg-transparent' asChild>
            <Link href={`/session/${id}`}>View Results</Link>
          </Button>
          <Button className='flex-1 bg-primary hover:bg-primary/90' asChild>
            <Link href={`/session/${id}/dashboard`}>
              Dashboard
              <ChevronRight className='w-4 h-4 ml-1' />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
