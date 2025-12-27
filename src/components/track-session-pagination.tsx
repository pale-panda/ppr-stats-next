import { Dispatch, SetStateAction } from 'react';
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
} from './ui/select';
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
    <PaginationItem key={page}>
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
  meta?: PaginationMeta;
  className?: string;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  size: {
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
  };
}

export function TrackSessionPagination({
  className,
  meta,
  currentPage,
  setCurrentPage,
  isLoading,
  size,
}: PaginationLinkProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (
      !meta ||
      page < 1 ||
      page > meta.totalPages ||
      page === meta.currentPage
    ) {
      return;
    }
    setCurrentPage(page);
  };

  function handlePrevious() {
    if (!meta || meta.currentPage <= 1) {
      return;
    }
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function handleNext() {
    console.log('Handling next page');
    if (!meta || currentPage >= meta.totalPages) {
      console.log('No next page available');
      return;
    }
    console.log('Moving to next page', currentPage);
    return setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, meta.totalPages)
    );
  }

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
      <div className='flex grow justify-center md:flex-1'>
        <Pagination className='w-auto'>
          <PaginationContent>
            {currentPage !== 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => !isLoading && handlePrevious()}
                  href='#'
                />
              </PaginationItem>
            )}
            {hasHiddenLeadingPages && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => !isLoading && handlePageChange(1)}
                    href='#'
                    isActive={currentPage === 1}>
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
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
            {hasHiddenTrailingPages && (
              <>
                {shouldShowTrailingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() =>
                      !isLoading && handlePageChange(meta.totalPages)
                    }
                    href='#'
                    isActive={currentPage === meta.totalPages}>
                    {meta.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {currentPage < meta.totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => !isLoading && handleNext()}
                  href='#'
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
      <div className='flex flex-none items-center gap-2 justify-center w-full md:w-50 md:justify-end'>
        <p className='text-sm font-medium text-nowrap'>Items per page</p>
        <Select
          value={`${size.pageSize}`}
          onValueChange={(value) => {
            size.setPageSize(Number(value));
          }}>
          <SelectTrigger>
            <SelectValue placeholder={size.pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[6, 12, 24, 36, 48, 60, 72].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
