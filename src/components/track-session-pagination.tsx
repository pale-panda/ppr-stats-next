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
import {
  setPage,
  incrementPage,
  decrementPage,
} from '@/state/reducers/track-sessions/track-session.reducer';
import { AppDispatch, RootState } from '@/state/store';
import { PaginationMeta } from '@/types';
import { useDispatch, useSelector } from 'react-redux';

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
  onPageChange?: (page: number) => void;
  className?: string;
}

export function TrackSessionPagination({ className }: PaginationLinkProps) {
  const trackSession = useSelector((state: RootState) => state.trackSession);
  const meta = trackSession.meta;
  const isLoading = trackSession.isLoading;
  const dispatch = useDispatch<AppDispatch>();

  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  function handlePageChange(page: number) {
    if (
      isLoading ||
      page < 1 ||
      page > meta.totalPages ||
      page === meta.currentPage
    ) {
      return;
    }
    dispatch(setPage(page));
  }

  function handlePrevious() {
    if (isLoading || meta.currentPage <= 1) {
      return;
    }
    dispatch(decrementPage());
  }

  function handleNext() {
    if (isLoading || meta.currentPage >= meta.totalPages) {
      return;
    }
    dispatch(incrementPage());
  }

  const visiblePages = getVisiblePages(meta);
  const firstVisiblePage = visiblePages[0];
  const lastVisiblePage = visiblePages[visiblePages.length - 1];
  const hasHiddenLeadingPages = firstVisiblePage > 1;
  const hasHiddenTrailingPages = lastVisiblePage < meta.totalPages;
  const shouldShowLeadingEllipsis = firstVisiblePage > 2;
  const shouldShowTrailingEllipsis = lastVisiblePage < meta.totalPages - 1;

  return (
    <Pagination className={className}>
      <PaginationContent>
        {meta.currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePrevious()} href='#' />
          </PaginationItem>
        )}
        {hasHiddenLeadingPages && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(1)}
                href='#'
                isActive={meta.currentPage === 1}>
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
                onClick={() => handlePageChange(meta.totalPages)}
                href='#'
                isActive={meta.currentPage === meta.totalPages}>
                {meta.totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {meta.currentPage < meta.totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => handleNext()} href='#' />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
