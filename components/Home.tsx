'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, GlobeHemisphereEast, DeviceMobile, HandCoins, Phone } from '@phosphor-icons/react';
import SiteFrame from './SiteFrame';
import { StandardPlans, UpcomingSchemes } from './Plans';
import { StoryVisual, ContactCta } from './PublicSections';
export { default as Brand } from './Brand';
export default function Home() {
  const [intro, setIntro] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const legacy: Record<string, string> = { '#schemes': '/schemes', '#about': '/about', '#how-it-works': '/how-it-works', '#faqs': '/faqs', '#contact': '/contact' };
    if (legacy[window.location.hash]) { router.replace(legacy[window.location.hash]); return; }
    if (!sessionStorage.getItem('sklcf-intro') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro(true); sessionStorage.setItem('sklcf-intro', '1');
      const t = setTimeout(() => setIntro(false), 3200);
      return () => clearTimeout(t);
    }
  }, [router]);
  return <SiteFrame>
    {intro && <div className="intro" role="status" aria-label="Welcome to Sri Krishna Lakshmi Chit Funds"><div className="intro-art"><Image src="/treasure.png" fill alt="An ornate treasure chest filled with rupee notes, gold coins and jewellery" priority sizes="(max-width: 720px) 100vw, 720px" /><div className="chest-lid" /></div><p>A little saved. A world of possibilities.</p><button onClick={() => setIntro(false)}>Skip intro <ArrowRight /></button></div>}
    <section className="hero shell"><div className="hero-copy"><div className="eyebrow"><span className="short-line" /> SAVING TOGETHER. GROWING TOGETHER.</div><h1>Today’s savings.<br /><em>Tomorrow’s possibilities.</em></h1><p>A new home. Your child’s education. A dream of your own. Make space for what matters, one month at a time.</p><div className="hero-actions"><Link className="button primary" href="/schemes">Find your savings scheme <ArrowUpRight size={19} /></Link><Link className="text-link" href="/how-it-works">Let’s make it simple <ArrowRight size={18} /></Link></div></div><div className="hero-art"><Image src="/treasure.png" alt="A decorated Indian treasure chest overflowing with currency, coins and gold jewellery" fill priority sizes="(max-width: 600px) 100vw, 52vw" /></div></section>
    <div className="promise-bar shell"><div><GlobeHemisphereEast /><span>Enquiries across India</span></div><div><DeviceMobile /><span>Digital payments accepted</span></div><div><HandCoins /><span>A habit worth building</span></div><div><Phone /><span>Real people. Personal support.</span></div></div>
    <StandardPlans featured /><UpcomingSchemes />
    <section className="about section shell"><StoryVisual /><div><p className="eyebrow">SAVINGS WITH A PERSONAL TOUCH</p><h2>Built around<br /><em>your tomorrow.</em></h2><p>Every savings goal has a story. A child’s next step. A home to call your own. A business ready to grow.</p><p>We’re here to help you plan that next chapter with clear conversations, steady contributions and personal support.</p><Link className="text-link" href="/about">Get to know us <ArrowUpRight /></Link></div></section>
    <ContactCta />
  </SiteFrame>;
}
