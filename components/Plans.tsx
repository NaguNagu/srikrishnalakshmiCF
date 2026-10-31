'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, HandCoins, CalendarBlank, Check, GlobeHemisphereEast, X } from '@phosphor-icons/react';
import { type EnquiryPlan } from '@/lib/catalogue';
import { type Scheme, type SavingsPlan, dateLabel, money } from '@/lib/domain';
import EnquiryForm from './EnquiryForm';
const cities = ['Across India', 'Bengaluru', 'Chennai', 'Coimbatore', 'Delhi', 'Hyderabad', 'Kochi', 'Kolkata', 'Mumbai', 'Pollachi', 'Pune', 'Other city'];
function EnquiryDialog({ chosen, city, close }: { chosen: EnquiryPlan | null; city: string; close: () => void }) {
  return <Dialog.Root open={!!chosen} onOpenChange={open => !open && close()}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content enquiry-dialog"><Dialog.Title>A good place to begin.</Dialog.Title><Dialog.Description>Share your details and we’ll prepare your scheme enquiry for WhatsApp.</Dialog.Description><Dialog.Close className="dialog-close" aria-label="Close enquiry"><X /></Dialog.Close>{chosen && <EnquiryForm key={chosen.id} plan={chosen} city={['Across India', 'Other city'].includes(city) ? '' : city} />}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
export function StandardPlans({ featured = false }: { featured?: boolean }) {
  const [catalogue,setCatalogue]=useState<SavingsPlan[]>([]),[loadError,setLoadError]=useState(''),[plansLoading,setPlansLoading]=useState(true);
  useEffect(()=>{const load=async()=>{try{const r=await fetch('/api/plans',{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error);setCatalogue(d.plans);setLoadError('');}catch{setCatalogue([]);setLoadError('Plans are temporarily unavailable. Please try again.');}finally{setPlansLoading(false);}};void load();window.addEventListener('focus',load);return()=>window.removeEventListener('focus',load);},[]);
  const [duration, setDuration] = useState('all');
  const [city, setCity] = useState('Across India');
  const [chosen, setChosen] = useState<EnquiryPlan | null>(null);
  const plans = featured ? catalogue.slice(0,3) : catalogue.filter(p => duration === 'all' || p.months === Number(duration));
  return <section className="section shell standard-plans" id="schemes">
    <div className="section-top"><div className="section-title"><p className="eyebrow">A PLAN FOR YOUR NEXT CHAPTER</p>{featured ? <h2>A little today.<br />Room for tomorrow.</h2> : <h2>Choose your pace.<br />Plan your possibilities.</h2>}<p>{featured ? 'A few ways to begin. Explore our complete range of available savings plans.' : 'Explore our available plans and find a monthly contribution that fits your life.'}</p></div><label className="city-picker"><GlobeHemisphereEast size={19} /><select aria-label="Your city" value={city} onChange={e => setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select></label></div>
    {!featured && <div className="plan-filter" role="group" aria-label="Filter plans by duration">{[['all', `All ${catalogue.length} plans`], ...[...new Set(catalogue.map(p=>p.months))].sort((a,b)=>a-b).map(m=>[String(m),`${m} months`])].map(([value, label]) => <button key={value} aria-pressed={duration === value} className={duration === value ? 'active' : ''} onClick={() => setDuration(value)}>{label}</button>)}<span>{plans.length} plans to explore</span></div>}
    {plansLoading?<p className="notice" role="status">Loading available plans…</p>:loadError?<p className="notice" role="alert">{loadError}</p>:!plans.length?<p className="notice">No plans available for this duration. Contact our team for help.</p>:null}
    <div className="scheme-grid catalogue-grid">{plans.map((p, i) => <article className={`scheme-card catalogue-card scheme-${i % 3}`} key={p.id}><div className="plan-top"><span>{p.months}-MONTH SAVINGS PLAN</span><HandCoins size={24} /></div><h3 className="catalogue-value">{money(p.amount)}<span>chit value</span></h3><div className="plan-stats"><div><strong>{money(p.monthly)}</strong><span>base monthly contribution</span></div><div><strong>{p.months} months</strong><span>scheme duration</span></div></div><h3 className="catalogue-note">{p.name}</h3><ul>{p.benefits.map(b=><li key={b}><Check size={15}/>{b}</li>)}</ul><button className="button" onClick={() => setChosen(p)}>Enquire about this scheme <ArrowUpRight size={18} /></button></article>)}</div>
    <p className="fine-print">Monthly contributions are shown for each available plan. Final contributions, fees, allocation and payout terms are subject to the scheme agreement. Ask our team to confirm availability and complete terms.</p>
    {featured && <Link className="button secondary all-plans-link" href="/schemes">Explore all plans <ArrowUpRight size={18} /></Link>}
    <EnquiryDialog chosen={chosen} city={city} close={() => setChosen(null)} />
  </section>;
}
export function FeaturedSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [chosen, setChosen] = useState<EnquiryPlan | null>(null);
  async function load() {
    try { setLoading(true); setError(''); const r = await fetch('/api/schemes', { cache: 'no-store' }); const d = await r.json(); if (!r.ok) throw Error(d.error || 'Unable to load featured plans.'); setSchemes(d.schemes); }
    catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load();const refresh=()=>void load();window.addEventListener('focus',refresh);return()=>window.removeEventListener('focus',refresh); }, []);
  return <section className="upcoming-section" id="featured"><div className="shell section"><div className="section-title"><h2>Featured</h2><p>Explore our featured savings plans, with their start dates and available places. Speak to our team to join.</p></div>
    {loading ? <p className="notice" role="status">Loading featured plans…</p> : error ? <div className="notice" role="alert"><p>{error}</p><button className="button secondary" onClick={load}>Try again</button></div> : schemes.length ? <div className="scheme-grid upcoming-grid">{schemes.map((s, i) => <article className={`scheme-card scheme-${i % 3}`} key={s.id}><div className="plan-top"><span>{s.slots ? 'OPEN FOR ENQUIRIES' : 'FULLY SUBSCRIBED'}</span><CalendarBlank size={24} /></div><h3>{s.name}</h3><p className="chit-value">{money(s.amount)}<span>chit value</span></p><div className="plan-stats"><div><strong>{money(s.monthly)}</strong><span>monthly contribution</span></div><div><strong>{s.months} months</strong><span>scheme duration</span></div></div><ul>{s.benefits.map(b => <li key={b}><Check size={15} />{b}</li>)}</ul><div className="plan-date"><CalendarBlank size={16} /> Starts {dateLabel(s.startDate)}<span>{s.slots} open slots</span></div><button className="button" disabled={!s.slots} onClick={() => setChosen(s)}>{s.slots ? 'Enquire about this scheme' : 'All slots filled'} <ArrowUpRight size={18} /></button></article>)}</div> : <div className="upcoming-empty"><CalendarBlank size={32} /><div><h3>Good things are being planned.</h3><p>Our next featured savings plans will appear here. Contact our team to register your interest.</p></div><Link className="button secondary" href="/contact">Keep me informed <ArrowUpRight size={18} /></Link></div>}
    <EnquiryDialog chosen={chosen} city="Across India" close={() => setChosen(null)} />
  </div></section>;
}
