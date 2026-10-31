import { NextResponse } from 'next/server';
import { db } from '@/lib/server';
import { readUpcomingSchemes } from '@/lib/records';
export const runtime = 'nodejs';
export async function GET() {
  try { return NextResponse.json(await readUpcomingSchemes(db()), { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ error: 'Upcoming scheme details are temporarily unavailable. Please contact our team.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}
