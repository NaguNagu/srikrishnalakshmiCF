import 'server-only';
import {MongoClient} from 'mongodb';
import {cookies} from 'next/headers';
import {firebaseAdminAuth,firebaseServerConfigured} from './firebase-admin';
import {isAdministrator,sessionCookieName,requestHasSameOrigin} from './auth-policy';
let client:MongoClient|undefined;
let ready:Promise<unknown>|undefined;
export const configured=firebaseServerConfigured;
export async function db(){if(!process.env.MONGODB_URI)throw new Error('Database not configured');client??=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,serverSelectionTimeoutMS:5000});const database=client.db(process.env.MONGODB_DB||'sklcf');ready??=Promise.all([database.collection('customers').createIndex({id:1},{unique:true}),database.collection('schemes').createIndex({id:1},{unique:true}),database.collection('settings').createIndex({key:1},{unique:true}),database.collection('loginAttempts').createIndex({key:1,bucket:1},{unique:true}),database.collection('loginAttempts').createIndex({expires:1},{expireAfterSeconds:0})]).catch(e=>{ready=undefined;throw e;});await ready;return database;}
export async function authenticated(){if(!configured())return false;try{const token=(await cookies()).get(sessionCookieName)?.value;if(!token)return false;const claims=await firebaseAdminAuth().verifySessionCookie(token,true);return isAdministrator(claims,process.env.FIREBASE_ADMIN_UID);}catch{return false;}}
export function sameOrigin(req:Request){return requestHasSameOrigin(req,!!process.env.VERCEL);}
