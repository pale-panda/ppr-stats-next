import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { breadcrumbLinks } from '@/lib/data/breadcrumb-links';
import type { TrackSessionsBySlug } from '@/types/slug.type';
import { use } from 'react';

interface SectionSessionTrackProps {
  sessions: Promise<TrackSessionsBySlug | null>;
}

export function SectionSessionTrack({ sessions }: SectionSessionTrackProps) {
  const data = use(sessions);
  if (!data) {
    return <div>No session data available.</div>;
  }

  return (
    <section>
      <div className='container mx-auto px-4 py-8'>
        <AppBreadcrumb {...breadcrumbLinks} />
        <h1 className='text-3xl font-bold mb-4'>
          Session @ {data.name}
        </h1>
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-2xl font-semibold mb-2'>{data.name}</h2>
          <p className='text-gray-600 mb-4'>
            {data.sessions[0]?.sessionDate}
          </p>
          <div>
            <h3 className='text-xl font-semibold mb-2'>Overview</h3>
            <p className='text-gray-700'>
              {data.sessions[0]?.sessionType}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
