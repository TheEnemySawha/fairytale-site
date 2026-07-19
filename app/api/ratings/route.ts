import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const story_id = searchParams.get('story_id');

  const { data } = await getSupabase()
    .from('ratings')
    .select('stars')
    .eq('story_id', story_id);

  if (!data || data.length === 0) {
    return NextResponse.json({ avg: null, count: 0 });
  }

  const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
  return NextResponse.json({ avg, count: data.length });
}

export async function POST(request: Request) {
  const { story_id, stars } = await request.json();

  if (!story_id || !stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await getSupabaseAdmin().from('ratings').insert([{ story_id, stars }]);

  const { data } = await getSupabase()
    .from('ratings')
    .select('stars')
    .eq('story_id', story_id);

  const avg = data ? data.reduce((sum, r) => sum + r.stars, 0) / data.length : stars;
  return NextResponse.json({ avg, count: data?.length ?? 1 });
}
