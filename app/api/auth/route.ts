import {NextResponse} from 'next/server';
import {authenticated,configured,db,issueSession,sameOrigin,verifyPassword} from '@/lib/server';
export const runtime='nodejs';
export async function GET(){return NextResponse.json({configured:configured(),authenticated:await authenticated()},{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid request origin'},{status:403});
 if(!configured())return NextResponse.json({error:'Owner login needs the environment variables listed in the setup guide.'},{status:503});
 try {const body=await req.json();if(typeof body.email!=='string'||typeof body.password!=='string'||body.password.length>256)return NextResponse.json({error:'Invalid credentials'},{status:400});
 const database=await db();const bucket=Math.floor(Date.now()/900000);const attempts=database.collection('loginAttempts');const result=await attempts.findOneAndUpdate({key:'owner',bucket},{$inc:{count:1},$setOnInsert:{expires:new Date(Date.now()+1800000)}},{upsert:true,returnDocument:'after'});
 if((result?.count??0)>15)return NextResponse.json({error:'Too many attempts. Please try again in 15 minutes.'},{status:429});
 const valid=verifyPassword(body.password);if(!valid||body.email.toLowerCase()!==process.env.ADMIN_EMAIL!.toLowerCase())return NextResponse.json({error:'Email or password is incorrect.'},{status:401});
 const res=NextResponse.json({ok:true});res.cookies.set('sklcf-session',await issueSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return res;
 }catch{return NextResponse.json({error:'Login service is unavailable. Please check the database connection.'},{status:503});}
}
export async function DELETE(req:Request){if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});const res=NextResponse.json({ok:true});res.cookies.set('sklcf-session','',{maxAge:0,path:'/'});return res;}
