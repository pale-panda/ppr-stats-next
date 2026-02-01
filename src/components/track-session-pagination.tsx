'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { type ReadonlyURLSearchParams } from 'next/navigation';

interface PaginationLinkProps {
  nextCursor: string | null;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

export function TrackSessionPagination({
  className,
  nextCursor,
  searchParams,
}: PaginationLinkProps) {
  const hasCursor = Boolean(searchParams.get('cursor'));

  const newParams = (cursor?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (cursor) {
      params.set('cursor', cursor);
    } else {
      params.delete('cursor');
    }
    params.sort();
    const qs = params.toString();
    return `?${qs}`;
  };

  return (
    <div className={cn('flex grow justify-center md:flex-1', className)}>
      {(hasCursor || nextCursor) && (
        <Pagination className='w-auto'>
          <PaginationContent>
            {hasCursor && (
              <PaginationItem>
                <PaginationPrevious href={newParams(null)} scroll={false} />
              </PaginationItem>
            )}
            {nextCursor && (
              <PaginationItem>
                <PaginationNext href={newParams(nextCursor)} scroll={false} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
