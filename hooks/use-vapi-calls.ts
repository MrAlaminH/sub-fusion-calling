import { useState, useEffect } from 'react';
import { AICallData } from '@/lib/types';

interface UseVAPICallsOptions {
  timeframe?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'duration_minutes' | 'cost';
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
}

interface UseVAPICallsReturn {
  data: AICallData[] | null;
  error: string | null;
  loading: boolean;
  pagination: PaginationMetadata | null;
  refetch: () => Promise<void>;
}

export function useVAPICalls(options: UseVAPICallsOptions = {}): UseVAPICallsReturn {
  const [data, setData] = useState<AICallData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from options
      const params = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/vapi-calls?${params.toString()}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to fetch VAPI calls');
      }

      setData(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    options.timeframe,
    options.startDate,
    options.endDate,
    options.limit,
    options.offset,
    options.sortBy,
    options.sortOrder,
    options.status,
  ]);

  return {
    data,
    error,
    loading,
    pagination,
    refetch: fetchData,
  };
} 