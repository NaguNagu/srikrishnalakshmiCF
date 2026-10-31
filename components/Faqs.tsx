'use client';
import { useState } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';
const questions = [
  ['How does a chit scheme work?', 'Members contribute regularly to a group fund. Allocation, bidding, discounts and payouts depend on the written agreement for each scheme. Our team will explain the complete terms before you join.'],
  ['What does “base monthly contribution” mean?', 'It is the chit value divided by the number of months. This helps you compare plans. Ask our team to confirm the actual contribution schedule, fees, discounts and any other applicable terms before enrolling.'],
  ['Can I enquire from another city?', 'Yes. We welcome enquiries from across India. Tell us your city so our team can confirm availability, eligibility and the enrolment process for your location.'],
  ['Can I pay digitally?', 'Yes, digital transactions are accepted. Contact our team for verified payment details and always keep your receipt. Never transfer money to an unverified account.'],
  ['Where can I see featured savings plans?', 'The Featured section on our homepage and Savings schemes page shows plans selected by our team, with their start dates and available slots. Contact us to confirm availability.'],
  ['What happens when I enquire about a scheme?', 'A short form collects your name, phone number and city, with optional email and a question. Your details and selected plan are added to a WhatsApp message addressed to our business number, 9942177315. Review the message and tap Send in WhatsApp.'],
  ['What should I check before joining?', 'Ask for the scheme agreement, applicable registration details, contribution schedule, fees, allocation rules and payout conditions. Review them carefully before enrolling.'],
];
export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="faq-list">{questions.map(([question, answer], i) => <div className="faq-item" key={question}><button aria-expanded={open === i} aria-controls={'faq-' + i} onClick={() => setOpen(open === i ? null : i)}>{question}{open === i ? <Minus size={18} /> : <Plus size={18} />}</button>{open === i && <p id={'faq-' + i}>{answer}</p>}</div>)}</div>;
}
