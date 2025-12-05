/**
 * usePagination Hook
 * 
 * Custom hook to manage pagination state and transitions.
 * Handles smooth transitions between pages with fade animations.
 */

import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  itemsPerPage: number;
  transitionDuration?: number;
  transitionResetDelay?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  isTransitioning: boolean;
  displayedItems: T[];
  totalPages: number;
  handlePageChange: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

/**
 * Hook to manage pagination with smooth transitions
 * 
 * @param items - Array of items to paginate
 * @param options - Configuration options
 * @param options.itemsPerPage - Number of items per page
 * @param options.transitionDuration - Duration of fade transition (default: 150ms)
 * @param options.transitionResetDelay - Delay before resetting transition state (default: 30ms)
 * @returns Pagination state and handlers
 */
export const usePagination = <T>(
  items: readonly T[],
  { itemsPerPage, transitionDuration = 150, transitionResetDelay = 30 }: UsePaginationOptions
): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const getDisplayedItems = useCallback((): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage || page < 1 || page > totalPages) return;

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        setTimeout(() => {
          setIsTransitioning(false);
        }, transitionResetDelay);
      }, transitionDuration);
    },
    [currentPage, totalPages, transitionDuration, transitionResetDelay]
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  return {
    currentPage,
    isTransitioning,
    displayedItems: getDisplayedItems(),
    totalPages,
    handlePageChange,
    goToNextPage,
    goToPreviousPage,
  };
};

