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
  return [...Array(3)].map((_, index) => (
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
  ));
}

export function TrackSessionFilterSkeleton() {
  return (
    <div className='flex gap-2 justify-between w-full md:w-auto'>
      <Skeleton className='h-8 rounded w-22' />
      <Skeleton className='h-8 rounded w-24' />
    </div>
  );
}
