import Link from 'next/link';
import { ArrowUpRight, GlobeHemisphereEast, Phone, WhatsappLogo } from '@phosphor-icons/react';
import Brand from './Brand';
import { businessPhone } from '@/lib/catalogue';
import { whatsapp } from '@/lib/domain';
import styles from './SiteFooter.module.css';

const links = [['/', 'Home'], ['/schemes', 'Savings schemes'], ['/how-it-works', 'How it works'], ['/about', 'Our story'], ['/faqs', 'Common questions'], ['/contact', 'Enquire with us']];

export default function SiteFooter() {
  return <footer className={styles.footer}>
    <div className="shell">
      <div className={styles.invitation}>
        <div><span className={styles.kicker}>A LITTLE PLANNING. A WORLD OF POSSIBILITY.</span><h2>Your next milestone starts<br />with a conversation.</h2><p>Tell us what you’re saving for. We’ll help you explore the schemes and understand the details.</p></div>
        <Link className="button primary" href="/contact">Let’s plan your next step <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className={styles.columns}>
        <div className={styles.identity}><Brand /><p>Personal service for the future you imagine. Explore savings schemes with clear conversations and support along the way.</p><span className={styles.reach}><GlobeHemisphereEast size={18} aria-hidden="true" /> Welcoming customers across India</span></div>
        <nav className={styles.navigation} aria-label="Footer navigation"><h3>Explore</h3>{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className={styles.contact}><h3>We’re here to help</h3><a className={styles.phone} href={`tel:+91${businessPhone}`}><Phone size={19} aria-hidden="true" /> +91 99421 77315</a><a className={styles.chat} href={whatsapp(businessPhone, 'Hello Sri Krishna Lakshmi Chit Funds! I would like to know more about your savings schemes.')} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={20} aria-hidden="true" /> Chat on WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></a><p>Based in Pollachi, Tamil Nadu.<br />Serving customers across India.</p><p className={styles.payments}>Digital payments accepted.<br />Contact our team for payment details.</p></div>
      </div>
      <div className={styles.note}><strong>Before you join</strong><p>Ask us about scheme availability, contributions, duration and payout conditions. Please review the complete written scheme agreement before enrolling.</p></div>
      <div className={styles.bottom}><span>© {new Date().getFullYear()} Sri Krishna Lakshmi Chit Funds. All rights reserved.</span><Link href="/admin">Owner login <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </div>
  </footer>;
}
