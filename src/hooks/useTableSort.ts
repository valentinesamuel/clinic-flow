import { useState, useMemo, useCallback } from 'react';

type SortOrder = 'asc' | 'desc';

interface UseTableSortOptions<T> {
  defaultSortKey?: keyof T;
  defaultSortOrder?: SortOrder;
}

interface UseTableSortReturn<T> {
  sortedData: T[];
  sortKey: keyof T | null;
  sortOrder: SortOrder;
  setSortKey: (key: keyof T) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (key: keyof T) => void;
  clearSort: () => void;
}

export function useTableSort<T extends Record<string, unknown>>(
  data: T[],
  options: UseTableSortOptions<T> = {}
): UseTableSortReturn<T> {
  const { defaultSortKey = null, defaultSortOrder = 'asc' } = options;

  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortOrder]);

  const toggleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      // Toggle order if same key
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New key, start with ascending
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  const clearSort = useCallback(() => {
    setSortKey(null);
    setSortOrder('asc');
  }, []);

  return {
    sortedData,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
    toggleSort,
    clearSort,
  };
}
