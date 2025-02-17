import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

// Response type definitions
interface APIResponse<T> {
  data?: T;
  error?: string;
  timestamp: string;
}

// Query parameter schema
const QuerySchema = z.object({
  timeframe: z.enum(['daily', 'weekly', 'monthly']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.enum(['created_at', 'duration_minutes', 'cost']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate and parse query parameters
    const validatedParams = QuerySchema.safeParse({
      ...queryParams,
      limit: queryParams.limit ? parseInt(queryParams.limit) : undefined,
      offset: queryParams.offset ? parseInt(queryParams.offset) : undefined,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validatedParams.error.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabase.from('vapi_call_data').select('*');

    // Apply filters based on validated parameters
    const params = validatedParams.data;

    if (params.timeframe) {
      const now = new Date();
      const startDate = new Date();

      switch (params.timeframe) {
        case 'daily':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      query = query
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString());
    }

    if (params.startDate && params.endDate) {
      query = query
        .gte('created_at', params.startDate)
        .lte('created_at', params.endDate);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    // Apply sorting
    if (params.sortBy) {
      query = query.order(params.sortBy, {
        ascending: params.sortOrder === 'asc',
      });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch VAPI calls',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('vapi_call_data')
      .select('*', { count: 'exact', head: true });

    const response: APIResponse<typeof data> = {
      data,
      timestamp: new Date().toISOString(),
    };

    // Add pagination metadata
    return NextResponse.json(
      {
        ...response,
        pagination: {
          total: count,
          limit: params.limit || 10,
          offset: params.offset || 0,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 