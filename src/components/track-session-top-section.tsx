import { Badge } from '@/components/ui/badge';
import { formatSessionDate } from '@/lib/format-utils';
import type { SessionAppFull } from '@/types/sessions.type';
import { MapPin } from 'lucide-react';
import { use } from 'react';

interface TrackSessionTopSectionProps {
  session: Promise<SessionAppFull | null>;
}

export default function TrackSessionTopSection({
  session,
}: TrackSessionTopSectionProps) {
  const data = use(session);
  if (!data) {
    return null;
  }
  const track = data.tracks;

  return (
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
  );
}
