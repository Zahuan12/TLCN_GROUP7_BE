import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * Hook to manage pagination state
 */
export function usePagination(initialPage = 1, initialPageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const goToPage = (newPage) => {
    setPage(newPage);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const changePageSize = (newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page
  };

  const reset = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    page,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    reset
  };
}

