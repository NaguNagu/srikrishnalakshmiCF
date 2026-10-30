import { indiaToday, money, dateLabel, type Scheme } from './domain';
export const businessPhone = '9942177315';
export type Plan = { id: string; amount: number; months: number; monthly: number };
export const catalogue: Plan[] = [
  [60000, 20], [100000, 20], [120000, 20], [150000, 20], [150000, 25],
  [180000, 20], [200000, 20], [250000, 25], [300000, 20], [300000, 25],
  [360000, 20], [500000, 25], [600000, 20], [600000, 25], [1000000, 25],
].map(([amount, months]) => ({ id: `plan-${amount}-${months}`, amount, months, monthly: amount / months }));
export type EnquiryPlan = Plan & { name?: string; startDate?: string; slots?: number };
export type Enquirer = { name: string; phone: string; city: string; email?: string; message?: string };
export function enquiryMessage(person: Enquirer, plan?: EnquiryPlan) {
  const lines = ['Hello Sri Krishna Lakshmi Chit Funds,', 'I would like to enquire about ' + (plan ? 'the following savings scheme:' : 'your savings schemes.')];
  if (plan) {
    if (plan.name) lines.push(`Scheme: ${plan.name}`);
    lines.push(`Chit value: ${money(plan.amount)}`, `Duration: ${plan.months} months`, `${plan.startDate ? 'Monthly contribution' : 'Base monthly contribution'}: ${money(plan.monthly)}`);
    if (plan.startDate) lines.push(`Start date: ${dateLabel(plan.startDate)}`);
    if (plan.slots !== undefined) lines.push(`Open slots shown: ${plan.slots}`);
  }
  lines.push('', 'My details:', `Name: ${person.name.trim()}`, `Phone: ${person.phone.trim()}`, `City: ${person.city.trim()}`);
  if (person.email?.trim()) lines.push(`Email: ${person.email.trim()}`);
  if (person.message?.trim()) lines.push(`Message: ${person.message.trim()}`);
  lines.push('', 'Please confirm availability, full contribution details and the joining process.');
  return lines.join('\n');
}
export function nextMonthRange(today = indiaToday()) {
  const [year, month] = today.split('-').map(Number);
  return { start: new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10), end: new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 10) };
}
export function isUpcomingScheme(scheme: Scheme, today = indiaToday()) {
  const { start, end } = nextMonthRange(today);
  return scheme.published && scheme.startDate >= start && scheme.startDate < end;
}
