import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsBarSkeleton() {
  return (
    <section className='border-b border-border bg-card/50'>
      <div className='px-4 py-8 container mx-auto  grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-border'>
        {[...Array(4)].map((_, index) => (
          <Card className='bg-card border-border/50' key={index}>
            <CardContent className='px-6 sm:px-6'>
              <div className='flex items-center justify-between mb-2 sm:mb-0'>
                <Skeleton className='h-4 rounded w-1/3' />
              </div>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-8 rounded w-1/2' />
                <Skeleton className='w-10 h-10 rounded-lg' />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className='h-4 rounded w-1/2' />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function TrackSessionCardSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, index) => (
        <Card
          className='group pt-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300'
          key={index}>
          <div className='relative aspect-video overflow-hidden'>
            <Skeleton className='w-full h-full object-cover' />
            <div className='absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent' />

            <div className='absolute bottom-4 left-4 right-4'>
              <Skeleton className='h-4 rounded w-1/3 mb-2' />
              <Skeleton className='h-6 rounded w-2/3' />
            </div>
          </div>

          <CardContent className='p-4'>
            <div className='flex items-center gap-2 text-muted-foreground mb-4'>
              <Skeleton className='w-4 h-4 rounded' />
              <Skeleton className='h-4 rounded w-1/4' />
            </div>
            <div className='grid grid-cols-3 gap-4 mb-4'>
              <div>
                <Skeleton className='h-3 rounded w-1/2 mb-2' />
                <Skeleton className='h-5 rounded w-3/4' />
              </div>
              <div>
                <Skeleton className='h-3 rounded w-1/2 mb-2' />
                <Skeleton className='h-5 rounded w-3/4' />
              </div>

              <div>
                <Skeleton className='h-3 rounded w-1/2 mb-2' />
                <Skeleton className='h-5 rounded w-3/4' />
              </div>
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-10 rounded w-1/2' />
              <Skeleton className='h-10 rounded w-1/2' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrackSessionFilterSkeleton() {
  return (
    <div className='flex gap-2 justify-between w-full md:w-auto'>
      <Skeleton className='h-8 rounded w-22' />
      <Skeleton className='h-8 rounded w-24' />
    </div>
  );
}

export function TrackCardSkeleton() {
  return (
    <div className='container mx-auto px-4'>
      <div className='grid gap-6'>
        <Card className='overflow-hidden bg-card border-border py-0 hover:border-primary/50 transition-colors'>
          <div className='grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]'>
            {/* Track Image */}
            <div className='relative h-48 md:h-auto'>
              <Skeleton className='absolute inset-0 w-full h-full object-cover' />
              <div className='absolute inset-0 bg-linear-to-r from-transparent to-card/80 hidden md:block' />
            </div>

            {/* Track Info */}
            <div className='p-6'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6'>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <Skeleton className='h-8 w-48 rounded' />
                  </div>
                  <div className='flex items-center gap-1 text-muted-foreground mt-3'>
                    <Skeleton className='h-4 w-4 rounded' />
                    <Skeleton className='h-4 w-1/4 rounded' />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='h-9 w-29' />
                  <Skeleton className='h-9 w-38' />
                </div>
              </div>

              {/* Track Specs */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-border'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-9 w-1/2' />
                </div>

                <div className='flex items-center gap-2'>
                  <Skeleton className='h-9 w-1/2' />
                </div>
              </div>

              {/* Personal Stats */}
              <Skeleton className='h-4 w-16 mb-3' />
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Skeleton className='h-18 w-full' />
                <Skeleton className='h-18 w-full' />
                <Skeleton className='h-18 w-full' />
                <Skeleton className='h-18 w-full' />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
