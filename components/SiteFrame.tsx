'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, WhatsappLogo, List, X } from '@phosphor-icons/react';
import Brand from './Brand';
import SiteFooter from './SiteFooter';
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
    <SiteFooter />
    <a className="whatsapp-float" aria-label="Chat with Sri Krishna Lakshmi Chit Funds on WhatsApp" href={whatsapp(businessPhone, 'Hello! I would like to enquire about your savings schemes.')} target="_blank" rel="noreferrer"><WhatsappLogo size={27} /></a>
  </>;
}
