import { NextResponse } from 'next/server';
import { db } from '@/lib/server';
import { readPlans } from '@/lib/records';
export const runtime='nodejs';
export async function GET(){try{return NextResponse.json({plans:(await readPlans(db())).filter(p=>p.enabled)},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Plans are temporarily unavailable. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}}
