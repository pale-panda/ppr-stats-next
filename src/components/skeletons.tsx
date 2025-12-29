import { Skeleton } from '@/components/ui/skeleton';
export function StatsBarSkeleton() {
  return (
    <section className='border-b border-border bg-card/50'>
      <div className='px-4 py-8 container mx-auto  grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='space-y-4 w-full'>
            <Skeleton className='h-9 rounded w-3/4'></Skeleton>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-8 rounded w-1/2'></Skeleton>
              <Skeleton className='w-10 h-10 rounded-lg'></Skeleton>
            </div>
            <Skeleton className='h-8 rounded w-full'></Skeleton>
          </div>
        ))}
      </div>
    </section>
  );
}
