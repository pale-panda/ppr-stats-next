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
import { PaginationMeta } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PageItemsProps {
  pages: number[];
  currentPage: number;
  handlePageChange: (page: number) => void;
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

function PageItems({ pages, currentPage, handlePageChange }: PageItemsProps) {
  return pages.map((page) => (
    <PaginationItem key={page} value={page}>
      <PaginationLink
        onClick={() => handlePageChange(page)}
        href='#'
        isActive={page === currentPage}>
        {page}
      </PaginationLink>
    </PaginationItem>
  ));
}

interface PaginationLinkProps {
  meta: PaginationMeta;
  className?: string;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function TrackSessionPagination({
  className,
  meta,
  onPageChange,
  onPageSizeChange,
}: PaginationLinkProps) {
  const visiblePages = getVisiblePages(meta);
  const firstVisiblePage = visiblePages[0];
  const lastVisiblePage = visiblePages[visiblePages.length - 1];
  const hasHiddenLeadingPages = firstVisiblePage > 1;
  const hasHiddenTrailingPages = lastVisiblePage < meta.totalPages;
  const shouldShowLeadingEllipsis = firstVisiblePage > 2;
  const shouldShowTrailingEllipsis = lastVisiblePage < meta.totalPages - 1;

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row ', className)}>
      <div className='w-50 flex-none hidden md:block' />
      {meta && meta.totalPages > 1 && (
        <div className='flex grow justify-center md:flex-1'>
          <Pagination className='w-auto'>
            <PaginationContent>
              {meta.currentPage !== 1 && (
                <PaginationItem value={meta.currentPage - 1}>
                  <PaginationPrevious
                    onClick={() => onPageChange(meta.currentPage - 1)}
                    href='#'
                  />
                </PaginationItem>
              )}
              {hasHiddenLeadingPages && (
                <>
                  <PaginationItem value={1}>
                    <PaginationLink onClick={() => onPageChange(1)} href='#'>
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
                currentPage={meta.currentPage}
                handlePageChange={onPageChange}
              />
              {hasHiddenTrailingPages && (
                <>
                  {shouldShowTrailingEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem value={meta.totalPages}>
                    <PaginationLink
                      onClick={() => onPageChange(meta.totalPages)}
                      href='#'>
                      {meta.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {meta.currentPage < meta.totalPages && (
                <PaginationItem value={meta.currentPage + 1}>
                  <PaginationNext
                    onClick={() => onPageChange(meta.currentPage + 1)}
                    href='#'
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <div className='ml-auto flex flex-none items-center gap-2 justify-center w-full md:w-50 md:justify-end'>
        <p className='text-sm font-medium text-nowrap'>Items per page</p>
        <Select
          value={`${meta.pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={`${meta.pageSize}`} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[6, 12, 24, 36, 48, 60, 84, 108].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                disabled={pageSize > meta.totalCount}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
