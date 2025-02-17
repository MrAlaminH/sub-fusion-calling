'use client';

import { useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';
import type { Lead } from '../types';

interface SortState {
  column: keyof Lead | null;
  direction: 'asc' | 'desc' | null;
}

export function useLeadSort() {
  // Initialize sort state from local storage or default values
  const [sortState, setSortState] = useState<SortState>(() => {
    if (typeof window === 'undefined') {
      return { column: 'created_at', direction: 'desc' };
    }

    const savedSort = localStorage.getItem(STORAGE_KEYS.SORT_STATE);
    return savedSort
      ? JSON.parse(savedSort)
      : { column: 'created_at', direction: 'desc' };
  });

  const handleSort = useCallback((column: keyof Lead) => {
    setSortState((prev) => {
      const newState: SortState = {
        column,
        direction:
          prev.column === column
            ? prev.direction === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc',
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.SORT_STATE, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const getSortedLeads = useCallback(
    (leads: Lead[]) => {
      if (!sortState.column || !sortState.direction) {
        return leads;
      }

      const sorted = [...leads].sort((a, b) => {
        const aVal = a[sortState.column!];
        const bVal = b[sortState.column!];

        // Handle null values
        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return sortState.direction === 'asc' ? 1 : -1;
        if (bVal === null) return sortState.direction === 'asc' ? -1 : 1;

        // Compare dates
        if (sortState.column === "created_at" || sortState.column === "updated_at") {
          const aDate = new Date(aVal as string);
          const bDate = new Date(bVal as string);
          return sortState.direction === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Default string/number comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortState.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        // Fallback for other types
        return sortState.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });

      return sorted;
    },
    [sortState]
  );

  return {
    sortState,
    handleSort,
    getSortedLeads,
  } as const;
}
