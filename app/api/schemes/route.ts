import {NextResponse} from 'next/server';
import {db} from '@/lib/server';
import {nextMonthRange} from '@/lib/catalogue';
export const runtime='nodejs';
export async function GET(){const {start,end}=nextMonthRange();if(!process.env.MONGODB_URI)return NextResponse.json({schemes:[],monthStart:start},{headers:{'Cache-Control':'no-store'}});try{const database=await db();const schemes=await database.collection('schemes').find({published:true,startDate:{$gte:start,$lt:end}},{projection:{_id:0}}).sort({startDate:1}).limit(100).toArray();return NextResponse.json({schemes,monthStart:start},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Upcoming scheme details are temporarily unavailable. Please contact our team.'},{status:503});}}
