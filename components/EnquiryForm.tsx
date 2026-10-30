'use client';
import { useState } from 'react';
import { ArrowUpRight, WhatsappLogo } from '@phosphor-icons/react';
import { businessPhone, enquiryMessage, type EnquiryPlan } from '@/lib/catalogue';
import { money, dateLabel, whatsapp } from '@/lib/domain';
export default function EnquiryForm({ plan, city = '' }: { plan?: EnquiryPlan; city?: string }) {
  const [prepared, setPrepared] = useState<string | null>(null);
  return <form className="enquiry-form" onSubmit={e => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const message = enquiryMessage({ name: String(f.get('name')), phone: String(f.get('phone')), city: String(f.get('city')), email: String(f.get('email') || ''), message: String(f.get('message') || '') }, plan);
    const url = whatsapp(businessPhone, message); setPrepared(url); window.open(url, '_blank', 'noopener,noreferrer');
  }}>
    {plan && <div className="enquiry-selection"><strong>{money(plan.amount)} · {plan.months} months</strong><span>{money(plan.monthly)} {plan.startDate ? 'monthly contribution' : 'base monthly contribution'}</span>{plan.startDate && <span>Starts {dateLabel(plan.startDate)}</span>}</div>}
    <label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" /></label>
    <div className="form-grid"><label>Phone number<input name="phone" type="tel" required pattern="[+]?[1-9][0-9]{9,14}" maxLength={16} placeholder="Your mobile number" autoComplete="tel" /></label><label>Your city<input name="city" defaultValue={city} required minLength={2} maxLength={100} placeholder="Any city in India" autoComplete="address-level2" /></label></div>
    <label>Email address (optional)<input name="email" type="email" maxLength={150} autoComplete="email" placeholder="you@example.com" /></label>
    <label>Anything you’d like to ask? (optional)<textarea name="message" rows={2} maxLength={600} placeholder="Tell us about your savings goal" /></label>
    <button className="button primary" type="submit"><WhatsappLogo size={20} /> Continue on WhatsApp <ArrowUpRight size={18} /></button>
    <small>Your details and selected scheme will open in a message to {businessPhone}. Review the message in WhatsApp and tap Send.</small>
    {prepared && <p className="notice" role="status">Your enquiry is ready. If WhatsApp did not open, <a href={prepared} target="_blank" rel="noreferrer">open your prepared message here</a>.</p>}
  </form>;
}
