import SiteFrame from '@/components/SiteFrame';
import { StandardPlans, UpcomingSchemes } from '@/components/Plans';
import { ContactCta } from '@/components/PublicSections';
export const metadata = { title: 'Savings schemes | Sri Krishna Lakshmi Chit Funds', description: 'Explore 15 savings plans from ₹60,000 to ₹10,00,000, with 20 and 25-month durations. See upcoming schemes and enquire on WhatsApp.' };
export default function Page() { return <SiteFrame><div className="page-heading shell"><h1>A plan for what matters to you.</h1><p>Compare our standard plans, then discover what’s opening next month.</p></div><StandardPlans /><UpcomingSchemes /><ContactCta /></SiteFrame>; }
