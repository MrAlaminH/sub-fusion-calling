'use client';

import { useState, useCallback } from 'react';
import { STORAGE_KEYS, DEFAULTS } from '../constants';

export function usePageSize(initialPageSize = DEFAULTS.PAGE_SIZE) {
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return initialPageSize;
    }
    
    try {
      const savedPageSize = localStorage.getItem(STORAGE_KEYS.PAGE_SIZE);
      if (savedPageSize) {
        const parsedSize = parseInt(savedPageSize, 10);
        if (!isNaN(parsedSize) && parsedSize > 0) {
          return parsedSize;
        }
      }
    } catch (error) {
      console.error('Error loading page size from localStorage:', error);
    }
    
    return initialPageSize;
  });

  const handlePageSizeChange = useCallback((newSize: number) => {
    if (newSize <= 0) {
      console.error('Invalid page size:', newSize);
      return;
    }
    
    setPageSize(newSize);
    
    try {
      localStorage.setItem(STORAGE_KEYS.PAGE_SIZE, newSize.toString());
    } catch (error) {
      console.error('Error saving page size to localStorage:', error);
    }
  }, []);

  return {
    pageSize,
    setPageSize: handlePageSizeChange
  } as const;
}
