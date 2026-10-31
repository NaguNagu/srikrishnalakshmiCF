import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runningMonth,paymentDue,birthday,indiaToday,whatsapp,customerSchema,schemeSchema,Customer,examples} from '../lib/domain';
const customer:Customer={id:'test',name:'Sample Customer',phone:'9000000000',address:'Sample address',city:'Chennai',dob:'1990-10-30',schemeId:'example-1',status:'live',dueDate:'2026-01-31',months:3,consent:false,paidPeriods:[]};
test('Monthly dues clamp to February and respect the scheme duration',()=>{assert.equal(paymentDue(customer,'2026-01-31'),true);assert.equal(paymentDue(customer,'2026-02-28'),true);assert.equal(paymentDue(customer,'2026-03-31'),true);assert.equal(paymentDue(customer,'2026-04-30'),false);assert.equal(paymentDue(customer,'2026-01-30'),false);});
test('Paid and closed records do not produce due reminders',()=>{assert.equal(paymentDue({...customer,paidPeriods:['2026-02']},'2026-02-28'),false);assert.equal(paymentDue({...customer,status:'closed'},'2026-01-31'),false);});
test('Leap-year and year-boundary monthly schedules',()=>{assert.equal(paymentDue({...customer,dueDate:'2027-12-31'},'2028-02-29'),true);assert.equal(paymentDue({...customer,dueDate:'2027-12-31'},'2028-02-28'),false);});
test('Birthday matching and India date boundary',()=>{assert.equal(birthday(customer,'2026-10-30'),true);assert.equal(birthday(customer,'2026-10-31'),false);assert.equal(indiaToday(new Date('2026-10-29T19:00:00Z')),'2026-10-30');});
test('WhatsApp numbers and message encoding',()=>{assert.equal(whatsapp('9942177315','Hello & welcome'), 'https://wa.me/919942177315?text=Hello%20%26%20welcome');assert.match(whatsapp('+447123456789','Hi'),/wa.me\/447123456789/);});
test('Server schemas reject invalid customer or scheme data',()=>{assert.equal(customerSchema.safeParse(customer).success,true);assert.equal(customerSchema.safeParse({...customer,dob:'2099-01-01'}).success,false);assert.equal(customerSchema.safeParse({...customer,phone:'123'}).success,false);assert.equal(schemeSchema.safeParse({...examples[0],slots:-1}).success,false);assert.equal(schemeSchema.safeParse({...examples[0],benefits:[]}).success,false);});

test('Running month advances on due dates including shorter months and stops at duration',()=>{
 const c={dueDate:'2026-01-31',months:3};
 for(const [date,month] of [['2026-01-30',0],['2026-01-31',1],['2026-02-27',1],['2026-02-28',2],['2026-03-30',2],['2026-03-31',3],['2027-01-01',3]] as const)assert.equal(runningMonth(c,date),month,date);
 assert.equal(runningMonth({dueDate:'2027-12-31',months:25},'2028-02-28'),2);
 assert.equal(runningMonth({dueDate:'2027-12-31',months:25},'2028-02-29'),3);
 assert.equal(runningMonth({dueDate:'2026-10-15',months:20},'2026-11-14'),1);
 assert.equal(runningMonth({dueDate:'2026-10-15',months:20},'2026-11-15'),2);
});
