import {NextResponse} from 'next/server';
import {db} from '@/lib/server';
export const runtime='nodejs';
export async function GET(){if(!process.env.MONGODB_URI)return NextResponse.json({schemes:[],preview:true});try{const database=await db();const schemes=await database.collection('schemes').find({published:true},{projection:{_id:0}}).sort({startDate:1}).limit(100).toArray();return NextResponse.json({schemes,preview:false},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Scheme details are temporarily unavailable. Please contact our team.'},{status:503});}}
