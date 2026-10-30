import {Scheme,Settings,money,dateLabel} from './domain';
export async function posterFile(s:Scheme,settings:Settings):Promise<File>{
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d')!;
 x.fillStyle='#f4f6fa';x.fillRect(0,0,1080,1350);x.fillStyle='#163c61';x.fillRect(0,0,1080,280);x.fillStyle='#fff';x.font='bold 52px Georgia';x.fillText('Sri Krishna Lakshmi',70,105);x.font='25px Arial';x.fillText('CHIT FUNDS',72,155);x.fillStyle='#afcbe0';x.fillText('Save for what matters.',72,219);
 function wrap(t:string,y:number,font:string,color:string,max=920,line=47){x.font=font;x.fillStyle=color;let text='';for(const word of t.split(' ')){const test=text+word+' ';if(x.measureText(test).width>max&&text){x.fillText(text,72,y);y+=line;text=word+' ';}else text=test;}x.fillText(text,72,y);return y+line;}
 let y=wrap(s.name,350,'bold 38px Georgia','#163c61',920,44);y=wrap(money(s.amount)+' chit value',y+25,'bold 54px Arial','#163c61',920,62);y=wrap(`${money(s.monthly)} / month  ·  ${s.months} months`,y+10,'25px Arial','#425d74',920,36);y=wrap(`Starts ${dateLabel(s.startDate)}  ·  ${s.slots} open slots`,y+10,'24px Arial','#425d74',920,36);
 for(const b of s.benefits)y=wrap('✓ '+b,y+6,'23px Arial','#163c61',920,31);
 x.fillStyle='#e3eaf2';x.fillRect(52,1060,976,225);wrap('Enquiries welcome from across India',1105,'bold 27px Arial','#163c61');wrap('Digital payments accepted',1148,'26px Arial','#163c61');wrap(`Call ${settings.phone}`,1194,'bold 29px Arial','#163c61');wrap(settings.address||'Contact our team for office details',1236,'22px Arial','#425d74',920,28);wrap('Subject to scheme agreement. Contact us for full terms.',1320,'18px Arial','#425d74');
 const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('Poster creation failed')),'image/png'));
 return new File([blob],`SKLCF-${s.name.replace(/[^a-z0-9]+/gi,'-')}.png`,{type:'image/png'});
}
export function downloadPoster(file:File){const u=URL.createObjectURL(file),a=document.createElement('a');a.href=u;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
