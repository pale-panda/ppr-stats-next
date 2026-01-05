import { AppImage } from '@/components/app-image';
import { TrackCardSkeleton } from '@/components/skeletons';

export default function Page() {
  return (
    <>
      <section className='relative h-64 md:h-80'>
        <AppImage
          src='/spa-francorchamps-race-track-aerial-view.jpg'
          alt='Track Hero Image'
          width={1200}
          height={500}
          className='absolute inset-0 w-full h-full object-fill'
        />

        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-6'>
          <div className='container mx-auto px-4'>
            <div className='max-w-2xl gap-3 mb-4'>
              <h1 className='text-4xl font-bold text-foreground mb-4 text-balance'>
                Tracks
              </h1>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Explore circuit information, your personal statistics, and
                performance data for each track you&apos;ve raced on.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=' py-8 border-b border-border bg-card/50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>0</p>
              <p className='text-sm text-muted-foreground'>Total Tracks</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-primary'>10</p>
              <p className='text-sm text-muted-foreground'>Total Sessions</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>10</p>
              <p className='text-sm text-muted-foreground'>Total Laps</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>104 km</p>
              <p className='text-sm text-muted-foreground'>Combined Length</p>
            </div>
          </div>
        </div>
      </section>
      <section className='py-6'>
        <TrackCardSkeleton />
      </section>
    </>
  );
}
