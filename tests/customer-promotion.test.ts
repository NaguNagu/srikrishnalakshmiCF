import test from 'node:test';
import assert from 'node:assert/strict';
import {promotionMessage} from '../lib/customer-promotion';
import {defaults,whatsapp,Scheme} from '../lib/domain';

test('Customer promotion prepares the selected plan and opens the intended Indian WhatsApp number',()=>{
 const scheme:Scheme={id:'featured',name:'Family & future',amount:300000,monthly:15000,months:20,startDate:'2026-11-20',slots:8,benefits:['Clear monthly schedule','Personal support'],published:true};
 const message=promotionMessage({name:'Test Customer'},scheme,defaults);
 const url=new URL(whatsapp('9876543210',message));
 assert.equal(url.origin,'https://wa.me');
 assert.equal(url.pathname,'/919876543210');
 assert.equal(url.searchParams.get('text'),message);
 for(const detail of ['Test Customer','Family & future','₹3,00,000','₹15,000','20 months','20 Nov 2026','8','Clear monthly schedule',defaults.phone,defaults.address])assert.ok(message.includes(detail));
});

test('International customer numbers retain their country code',()=>{
 const url=new URL(whatsapp('+44 7700 900123','Hello & welcome!'));
 assert.equal(url.pathname,'/447700900123');
 assert.equal(url.searchParams.get('text'),'Hello & welcome!');
});
