import SiteFrame from '@/components/SiteFrame';
import { StandardPlans, FeaturedSchemes } from '@/components/Plans';
import { ContactCta } from '@/components/PublicSections';
export const metadata = { title: 'Savings schemes | Sri Krishna Lakshmi Chit Funds', description: 'Explore available savings plans and featured start dates. Enquire with Sri Krishna Lakshmi Chit Funds on WhatsApp.' };
export default function Page() { return <SiteFrame><div className="page-heading shell"><h1>A plan for what matters to you.</h1><p>Compare our available savings plans and explore featured start dates.</p></div><StandardPlans /><FeaturedSchemes /><ContactCta /></SiteFrame>; }
