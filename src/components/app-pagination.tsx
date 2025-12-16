import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationMeta } from '@/types';

interface PaginationLinkProps {
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  className?: string;
}

interface PaginationItemProps {
  page: number;
  isActive?: boolean;
  onClick?: (page: number) => void;
}

export function AppPagination({ className, ...props }: PaginationLinkProps) {
  const { meta } = props;

  console.log(meta);

  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const paginationItems = [];

  if (meta.currentPage > 0) {
    paginationItems.push(
      <PaginationItem>
        <PaginationPrevious href={`?page=${meta.currentPage - 1}`} />
      </PaginationItem>
    );

    if (meta.currentPage === 1) {
      paginationItems.push(
        <PaginationItem>
          <PaginationLink href={`?page=${meta.currentPage}`} isActive>
            {meta.currentPage}
          </PaginationLink>
        </PaginationItem>
      );
      paginationItems.push(
        <PaginationItem>
          <PaginationLink href={`?page=${meta.currentPage + 1}`}>
            {meta.currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (meta.currentPage > 1 && meta.currentPage < meta.totalPages) {
      paginationItems.push(
        <PaginationItem>
          <PaginationLink href={`?page=${meta.currentPage - 1}`}>
            {meta.currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
      paginationItems.push(
        <PaginationItem>
          <PaginationLink href={`?page=${meta.currentPage}`} isActive>
            {meta.currentPage}
          </PaginationLink>
        </PaginationItem>
      );
      paginationItems.push(
        <PaginationItem>
          <PaginationLink href={`?page=${meta.currentPage + 1}`}>
            {meta.currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }
  if (meta.currentPage < meta.totalPages) {
    paginationItems.push(
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
    );
    paginationItems.push(
      <PaginationItem>
        <PaginationNext href={`?page=${meta.currentPage + 1}`} />
      </PaginationItem>
    );
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        {paginationItems.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
