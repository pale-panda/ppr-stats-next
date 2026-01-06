import type { SessionFull } from '@/types';
import Image from 'next/image';
import { use } from 'react';

interface TrackSessionHeroProps {
  session: Promise<SessionFull | null>;
}

export default function TrackSessionHero({ session }: TrackSessionHeroProps) {
  const data = use(session);

  if (!data) {
    return null;
  }

  return (
    <Image
      src={data.tracks?.imageUrl ?? '/placeholder.svg'}
      alt={data.tracks?.name || 'Track'}
      className='w-full h-full object-cover'
      width={1200}
      height={400}
      unoptimized
    />
  );
}
