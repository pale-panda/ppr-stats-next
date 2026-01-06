import type { SessionFull } from '@/types';
import { use } from 'react';

interface SectionSessionDetailsProps {
  session: Promise<SessionFull | null>;
}

export function SectionSessionDetails({ session }: SectionSessionDetailsProps) {
  const data = use(session);
  if (!data) {
    return <div>No session data available.</div>;
  }

  return (
    <section>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>Session Details</h1>
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-2xl font-semibold mb-2'>{data.tracks.name}</h2>
          <p className='text-gray-600 mb-4'>{data.sessionDate}</p>
          <div>
            <h3 className='text-xl font-semibold mb-2'>Overview</h3>
            <p className='text-gray-700'>{data.sessionType}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
