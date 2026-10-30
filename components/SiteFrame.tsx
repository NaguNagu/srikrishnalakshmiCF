'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Phone, WhatsappLogo, List, X } from '@phosphor-icons/react';
import Brand from './Brand';
import { whatsapp } from '@/lib/domain';
import { businessPhone } from '@/lib/catalogue';
const navigation = [['/', 'Home'], ['/schemes', 'Savings schemes'], ['/how-it-works', 'How it works'], ['/about', 'Our story'], ['/faqs', 'FAQs'], ['/contact', 'Contact']];
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="announcement"><span>Small beginnings. Meaningful milestones.</span><a href={`tel:+91${businessPhone}`}>Let’s talk <Phone size={13} /> +91 99421 77315</a></div>
    <header className="site-header shell"><Brand /><nav className={menu ? 'mobile-open' : ''} aria-label="Main navigation">
      {navigation.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</Link>)}
    </nav><button className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <List />}</button></header>
    <main id="main-content">{children}</main>
    <footer className="shell"><div className="footer-main"><Brand /><p>For the things that matter.<br />For the future you imagine.</p><a href={`tel:+91${businessPhone}`}>{businessPhone}</a></div>
      <nav className="footer-navigation" aria-label="Footer navigation">{navigation.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Sri Krishna Lakshmi Chit Funds</span><span>Pollachi, Tamil Nadu · Enquiries across India</span><Link href="/admin">Owner login <ArrowUpRight size={13} /></Link></div>
    </footer>
    <a className="whatsapp-float" aria-label="Chat with Sri Krishna Lakshmi Chit Funds on WhatsApp" href={whatsapp(businessPhone, 'Hello! I would like to enquire about your savings schemes.')} target="_blank" rel="noreferrer"><WhatsappLogo size={27} /></a>
  </>;
}
