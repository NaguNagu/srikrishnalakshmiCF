import SiteFrame from '@/components/SiteFrame';
import EnquiryForm from '@/components/EnquiryForm';
import { businessPhone } from '@/lib/catalogue';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
export const metadata = { title: 'Contact us | Sri Krishna Lakshmi Chit Funds', description: 'Enquire about a savings scheme from any city in India. Call 9942177315 or prepare a personalised WhatsApp enquiry.' };
export default function Page() { return <SiteFrame><section className="contact section shell contact-page"><div><p className="eyebrow">LET’S BEGIN WITH A CONVERSATION</p><h1>Your next milestone<br />could start today.</h1><p>No pressure. Just a helpful conversation about your savings goals.</p><a className="contact-phone" href={`tel:+91${businessPhone}`}>+91 99421 77315 <ArrowUpRight size={26} /></a><p className="contact-location">Pollachi, Tamil Nadu<br />Enquiries welcome from across India.<br />Digital transactions accepted.</p></div><div><h2 className="form-title">Tell us a little about yourself.</h2><EnquiryForm /></div></section></SiteFrame>; }
