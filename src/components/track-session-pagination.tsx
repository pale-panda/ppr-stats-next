import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PAGINATION_MAX_PAGES } from '@/lib/data/constants';
import { cn } from '@/lib/utils';
import { PaginationMeta } from '@/types';
import { useRouter, type ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface PageItemsProps {
  pages: number[];
  currentPage: number;
  newParams: (page: number) => string;
}

function getVisiblePages(meta: PaginationMeta) {
  const maxPagesToShow = Math.min(PAGINATION_MAX_PAGES, meta.totalPages);
  const pages: number[] = [];

  if (meta.totalPages <= maxPagesToShow) {
    for (let page = 1; page <= meta.totalPages; page++) {
      pages.push(page);
    }
    return pages;
  }

  const halfWindow = Math.floor(maxPagesToShow / 2);
  let startPage = meta.currentPage - halfWindow;
  let endPage = meta.currentPage + halfWindow;

  if (maxPagesToShow % 2 === 0) {
    startPage += 1;
  }

  if (startPage < 1) {
    startPage = 1;
    endPage = maxPagesToShow;
  }

  if (endPage > meta.totalPages) {
    endPage = meta.totalPages;
    startPage = meta.totalPages - maxPagesToShow + 1;
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
        href={`?${newParams(page)}`}
        isActive={page === currentPage}>
        {page}
      </PaginationLink>
    </PaginationItem>
  ));
}

interface PaginationLinkProps {
  meta: PaginationMeta;
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
  const hasHiddenTrailingPages = lastVisiblePage < meta.totalPages;
  const shouldShowLeadingEllipsis = firstVisiblePage > 2;
  const shouldShowTrailingEllipsis = lastVisiblePage < meta.totalPages - 1;
  const { replace } = useRouter();

  useEffect(() => {
    if (meta.currentPage > meta.totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      params.sort();
      replace(`?${params.toString()}`);
    }
  }, [meta.currentPage, meta.totalPages, replace, searchParams]);

  const newParams = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.sort();
    const qs = params.toString();
    return qs ? `${qs}&page=${page}` : `page=${page}`;
  };

  return (
    <div className={cn('flex grow justify-center md:flex-1', className)}>
      {meta && meta.totalPages > 1 && (
        <Pagination className='w-auto'>
          <PaginationContent>
            {meta.currentPage !== 1 && (
              <PaginationItem value={meta.currentPage - 1}>
                <PaginationPrevious
                  href={`?${newParams(meta.currentPage - 1)}`}
                />
              </PaginationItem>
            )}
            {hasHiddenLeadingPages && (
              <>
                <PaginationItem value={1}>
                  <PaginationLink href={`?${newParams(1)}`}>1</PaginationLink>
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
              currentPage={meta.currentPage}
              newParams={newParams}
            />
            {hasHiddenTrailingPages && (
              <>
                {shouldShowTrailingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem value={meta.totalPages}>
                  <PaginationLink href={`?${newParams(meta.totalPages)}`}>
                    {meta.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {meta.currentPage < meta.totalPages && (
              <PaginationItem value={meta.currentPage + 1}>
                <PaginationNext href={`?${newParams(meta.currentPage + 1)}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
