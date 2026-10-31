import {Customer,Scheme,Settings,dateLabel,money} from './domain';

export function promotionMessage(customer:Pick<Customer,'name'>,scheme:Scheme,settings:Settings){
 return [
  `Hello ${customer.name}!`,
  '*Sri Krishna Lakshmi Chit Funds*',
  `Explore our featured savings plan: ${scheme.name}`,
  '',
  `Chit value: ${money(scheme.amount)}`,
  `Monthly contribution: ${money(scheme.monthly)}`,
  `Duration: ${scheme.months} months`,
  `Start date: ${dateLabel(scheme.startDate)}`,
  `Available slots: ${scheme.slots}`,
  '',
  ...scheme.benefits.map(benefit=>`• ${benefit}`),
  '',
  'Enquiries welcome from across India. Digital payments accepted.',
  `Contact: ${settings.phone}`,
  settings.address,
  'Reply to know more. Contributions and benefits are subject to the scheme agreement.',
 ].join('\n');
}
