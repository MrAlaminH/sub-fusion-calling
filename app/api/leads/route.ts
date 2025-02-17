import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { revalidateTag } from 'next/cache';
// import type { Lead } from '@/app/(protected)/add-leads/types';

// Cache configuration
const CACHE_TAG = 'leads';
const CACHE_REVALIDATE_SECONDS = 60;
const STALE_WHILE_REVALIDATE_SECONDS = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortColumn = searchParams.get('sortColumn') || 'created_at';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Get total count
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Get paginated and sorted data
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order(sortColumn, { ascending: sortDirection === 'asc' })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return NextResponse.json(
      {
        data: data || [],
        count: count || 0,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
          'CDN-Cache-Control': `public, s-maxage=${CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
          'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company || null,
        status: 'pending',
        created_at: now,
        updated_at: now,
      }])
      .select()
      .single();

    if (error) throw error;

    // Revalidate the cache
    revalidateTag(CACHE_TAG);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Revalidate the cache
    revalidateTag(CACHE_TAG);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    const { error } = await supabase
      .from('leads')
      .delete()
      .in('id', ids);

    if (error) throw error;

    // Revalidate the cache
    revalidateTag(CACHE_TAG);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting leads:', error);
    return NextResponse.json(
      { error: 'Failed to delete leads' },
      { status: 500 }
    );
  }
} 