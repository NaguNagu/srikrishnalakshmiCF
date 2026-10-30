import SiteFrame from '@/components/SiteFrame';
import Faqs from '@/components/Faqs';
import { ContactCta } from '@/components/PublicSections';
export const metadata = { title: 'FAQs | Sri Krishna Lakshmi Chit Funds', description: 'Answers to your questions about savings schemes, monthly contributions, digital payments and nationwide enquiries.' };
export default function Page() { return <SiteFrame><section className="faq-section section shell faq-page"><div className="section-title"><p className="eyebrow">YOUR QUESTIONS, WELCOME HERE</p><h1>A little clarity<br />goes a long way.</h1><p>Get to know the process before taking your next step.</p></div><Faqs /></section><ContactCta /></SiteFrame>; }
