'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { MetaOptions, QueryOptions } from '@/db/types/db.types';
import { cn } from '@/lib/utils';
import { type ReadonlyURLSearchParams } from 'next/navigation';

interface PageItemsProps {
  pages: number[];
  currentPage: number;
  newParams: (page: number) => string;
}

function getVisiblePages(meta: MetaOptions) {
  const maxPagesToShow = Math.min(
    meta.limit,
    Math.ceil(meta.count / meta.limit)
  );
  const pages: number[] = [];

  if (Math.ceil(meta.count / meta.limit) <= maxPagesToShow) {
    for (let page = 1; page <= Math.ceil(meta.count / meta.limit); page++) {
      pages.push(page);
    }
    return pages;
  }

  const halfWindow = Math.floor(maxPagesToShow / 2);
  let startPage = meta.page - halfWindow;
  let endPage = meta.page + halfWindow;

  if (maxPagesToShow % 2 === 0) {
    startPage += 1;
  }

  if (startPage < 1) {
    startPage = 1;
    endPage = maxPagesToShow;
  }

  if (endPage > Math.ceil(meta.count / meta.limit)) {
    endPage = Math.ceil(meta.count / meta.limit);
    startPage = Math.ceil(meta.count / meta.limit) - maxPagesToShow + 1;
  }

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  return pages;
}

function PageItems({ pages, currentPage, newParams }: PageItemsProps) {
  return pages.map((page) => (
    <PaginationItem key={page} value={page}>
      <PaginationLink
        href={newParams(page)}
        isActive={page === currentPage}
        scroll={false}>
        {page}
      </PaginationLink>
    </PaginationItem>
  ));
}

interface PaginationLinkProps {
  meta: QueryOptions;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

export function TrackSessionPagination({
  className,
  meta,
  searchParams,
}: PaginationLinkProps) {
  const visiblePages = getVisiblePages(meta);
  const firstVisiblePage = visiblePages[0];
  const lastVisiblePage = visiblePages[visiblePages.length - 1];
  const hasHiddenLeadingPages = firstVisiblePage > 1;
  const hasHiddenTrailingPages =
    lastVisiblePage < Math.ceil(meta.count / meta.limit);
  const shouldShowLeadingEllipsis = firstVisiblePage > 2;
  const shouldShowTrailingEllipsis =
    lastVisiblePage < Math.ceil(meta.count / meta.limit) - 1;

  const newParams = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.sort();
    const qs = params.toString();
    return `?${qs}`;
  };

  return (
    <div className={cn('flex grow justify-center md:flex-1', className)}>
      {meta && Math.ceil(meta.count / meta.limit) > 1 && (
        <Pagination className='w-auto'>
          <PaginationContent>
            {meta.page !== 1 && (
              <PaginationItem value={meta.page - 1}>
                <PaginationPrevious
                  href={newParams(meta.page - 1)}
                  scroll={false}
                />
              </PaginationItem>
            )}
            {hasHiddenLeadingPages && (
              <>
                <PaginationItem value={1}>
                  <PaginationLink href={newParams(1)} scroll={false}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {shouldShowLeadingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}
            <PageItems
              pages={visiblePages}
              currentPage={meta.page}
              newParams={newParams}
            />
            {hasHiddenTrailingPages && (
              <>
                {shouldShowTrailingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem value={Math.ceil(meta.count / meta.limit)}>
                  <PaginationLink
                    href={newParams(Math.ceil(meta.count / meta.limit))}
                    scroll={false}>
                    {Math.ceil(meta.count / meta.limit)}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {meta.page < Math.ceil(meta.count / meta.limit) && (
              <PaginationItem value={meta.page + 1}>
                <PaginationNext
                  href={newParams(meta.page + 1)}
                  scroll={false}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
