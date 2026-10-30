import 'server-only';
import {MongoClient} from 'mongodb';
import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
import {scryptSync,timingSafeEqual} from 'node:crypto';
let client:MongoClient|undefined;
let ready:Promise<unknown>|undefined;
export const configured=()=>!!(process.env.MONGODB_URI&&process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD_HASH&&process.env.SESSION_SECRET&&process.env.SESSION_SECRET.length>=32);
export async function db(){if(!process.env.MONGODB_URI)throw new Error('Database not configured');client??=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,serverSelectionTimeoutMS:5000});const database=client.db(process.env.MONGODB_DB||'sklcf');ready??=Promise.all([database.collection('customers').createIndex({id:1},{unique:true}),database.collection('schemes').createIndex({id:1},{unique:true}),database.collection('settings').createIndex({key:1},{unique:true}),database.collection('loginAttempts').createIndex({key:1,bucket:1},{unique:true}),database.collection('loginAttempts').createIndex({expires:1},{expireAfterSeconds:0})]).catch(e=>{ready=undefined;throw e;});await ready;return database;}
const key=()=>new TextEncoder().encode(process.env.SESSION_SECRET);
export async function authenticated(){if(!configured())return false;try{const token=(await cookies()).get('sklcf-session')?.value;if(!token)return false;const {payload}=await jwtVerify(token,key(),{issuer:'sklcf',audience:'owner',algorithms:['HS256']});return payload.sub===process.env.ADMIN_EMAIL;}catch{return false;}}
export async function issueSession(){return new SignJWT({}).setProtectedHeader({alg:'HS256'}).setSubject(process.env.ADMIN_EMAIL!).setIssuer('sklcf').setAudience('owner').setIssuedAt().setExpirationTime('8h').sign(key());}
export function verifyPassword(value:string){try{const [salt,hash]=process.env.ADMIN_PASSWORD_HASH!.split(':');const expected=Buffer.from(hash,'hex');const actual=scryptSync(value,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
