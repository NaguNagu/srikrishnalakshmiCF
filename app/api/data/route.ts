import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { authenticated, db, sameOrigin } from '@/lib/server';
import { MissingSchemeError, readRecords, writeRecord } from '@/lib/records';
export const runtime = 'nodejs';
const noStore = { 'Cache-Control': 'no-store' };
export async function GET() {
  if (!await authenticated()) return NextResponse.json({ error: 'Please sign in.' }, { status: 401, headers: noStore });
  try { return NextResponse.json(await readRecords(db()), { headers: noStore }); }
  catch { return NextResponse.json({ error: 'Unable to load records. Please retry.' }, { status: 503, headers: noStore }); }
}
export async function PUT(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!await authenticated()) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  try {
    await writeRecord(db(), await req.json());
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) return NextResponse.json({ error: 'Please check all fields and dates.' }, { status: 400 });
    if (error instanceof MissingSchemeError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Changes could not be saved. Please retry.' }, { status: 503 });
  }
}
