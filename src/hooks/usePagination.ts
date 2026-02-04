import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '@/constants/designSystem';

interface UsePaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    itemsPerPage: initialItemsPerPage = PAGINATION.defaultPageSize,
    initialPage = 1,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid when items change
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages) {
      return totalPages;
    }
    if (currentPage < 1) {
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  // Calculate start and end indices
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get paginated items
  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  // Navigation helpers
  const canGoNext = validCurrentPage < totalPages;
  const canGoPrevious = validCurrentPage > 1;

  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);
  const goToNextPage = useCallback(() => {
    if (canGoNext) setCurrentPage(prev => prev + 1);
  }, [canGoNext]);
  const goToPreviousPage = useCallback(() => {
    if (canGoPrevious) setCurrentPage(prev => prev - 1);
  }, [canGoPrevious]);

  // Reset to first page when items per page changes
  const handleSetItemsPerPage = useCallback((size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedItems,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  };
}
