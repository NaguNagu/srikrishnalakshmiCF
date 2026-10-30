import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue, nextMonthRange, isUpcomingScheme, enquiryMessage, businessPhone } from '../lib/catalogue';
import { examples, whatsapp } from '../lib/domain';

test('All 15 owner-supplied value/duration combinations remain distinct', () => {
  assert.deepEqual(catalogue.map(p => [p.amount, p.months]), [[60000,20],[100000,20],[120000,20],[150000,20],[150000,25],[180000,20],[200000,20],[250000,25],[300000,20],[300000,25],[360000,20],[500000,25],[600000,20],[600000,25],[1000000,25]]);
  assert.equal(new Set(catalogue.map(p => p.id)).size, 15);
  assert.equal(catalogue.find(p => p.amount === 150000 && p.months === 25)?.monthly, 6000);
  assert.equal(catalogue.find(p => p.amount === 1000000)?.monthly, 40000);
});

test('Next calendar month handles year boundaries and leap years', () => {
  assert.deepEqual(nextMonthRange('2026-10-30'), {start:'2026-11-01',end:'2026-12-01'});
  assert.deepEqual(nextMonthRange('2026-12-31'), {start:'2027-01-01',end:'2027-02-01'});
  assert.deepEqual(nextMonthRange('2028-01-31'), {start:'2028-02-01',end:'2028-03-01'});
});

test('Upcoming schemes exclude drafts and dates outside the next month', () => {
  const scheme = {...examples[0], published:true};
  assert.equal(isUpcomingScheme({...scheme,startDate:'2026-11-01'},'2026-10-30'),true);
  assert.equal(isUpcomingScheme({...scheme,startDate:'2026-11-30'},'2026-10-30'),true);
  for (const startDate of ['2026-10-31','2026-12-01','2026-09-01']) assert.equal(isUpcomingScheme({...scheme,startDate},'2026-10-30'),false);
  assert.equal(isUpcomingScheme({...scheme,startDate:'2026-11-15',published:false},'2026-10-30'),false);
});

test('Enquiry contains selected plan and every entered contact field', () => {
  const message = enquiryMessage({name:' Sample Customer ',phone:'9000000000',city:'Mumbai',email:'sample@example.com',message:'20 & 25 months?'},catalogue[4]);
  for (const text of ['₹1,50,000','25 months','₹6,000','Name: Sample Customer','Phone: 9000000000','City: Mumbai','Email: sample@example.com','20 & 25 months?']) assert.ok(message.includes(text),text);
  const url=new URL(whatsapp(businessPhone,message));
  assert.equal(url.pathname,'/919942177315');
  assert.equal(url.searchParams.get('text'),message);
});

test('Upcoming enquiry includes the actual published start and available slots', () => {
  const message=enquiryMessage({name:'Sample',phone:'9000000000',city:'Delhi'}, {...examples[0],startDate:'2026-11-05',slots:7});
  assert.ok(message.includes('Start date: 5 Nov 2026'));
  assert.ok(message.includes('Open slots shown: 7'));
  assert.ok(message.includes('Scheme: A little today. More tomorrow.'));
});
