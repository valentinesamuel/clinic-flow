import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface QueuePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  // Support both startIndex/endIndex and itemsPerPage patterns
  startIndex?: number;
  endIndex?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function QueuePagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex: providedStartIndex,
  endIndex: providedEndIndex,
  itemsPerPage,
  onPageChange,
  className,
}: QueuePaginationProps) {
  // Calculate startIndex and endIndex if itemsPerPage is provided
  const startIndex = providedStartIndex ?? ((currentPage - 1) * (itemsPerPage || 10)) + 1;
  const endIndex = providedEndIndex ?? Math.min(currentPage * (itemsPerPage || 10), totalItems);

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) {
    if (totalItems === 0) return null;
    
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        Showing {startIndex}-{endIndex} of {totalItems}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        Showing {startIndex}-{endIndex} of {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 h-9"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="w-9 h-9 p-0"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
