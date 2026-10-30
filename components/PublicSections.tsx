import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
export function StoryVisual() {
  return <div className="story-visual"><Image src="/family-tomorrow.png" fill alt="An Indian family planning their future together and adding to their savings at home" sizes="(max-width: 600px) 100vw, 50vw" /></div>;
}
export function ContactCta() {
  return <section className="contact-callout shell"><div><p className="eyebrow">A CONVERSATION CAN BE A BEGINNING</p><h2>What are you saving for?</h2><p>Tell us about your next milestone. Let’s find a plan that feels right.</p></div><Link className="button primary" href="/contact">Talk to our team <ArrowUpRight size={18} /></Link></section>;
}
export function HowSteps() {
  return <div className="steps">{[['01', 'Start with your goal', 'Tell us what you’re saving for and the monthly amount that feels comfortable.'], ['02', 'Understand your scheme', 'Review the contribution schedule, fees, agreement and allocation rules with our team. Ask every question.'], ['03', 'Save, one month at a time', 'Contribute on schedule, pay digitally and keep your payment receipts.'], ['04', 'Move towards your milestone', 'Follow your scheme’s allocation and payout process with personal guidance along the way.']].map(([n, t, d]) => <div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>;
}
