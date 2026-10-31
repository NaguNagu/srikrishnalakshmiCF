import {Scheme,Settings,money,dateLabel} from './domain';
import {wrapPosterText} from './poster-layout';

async function brandMark():Promise<HTMLImageElement> {
 const response=await fetch('/sklcf-logo.png');
 if(!response.ok)throw Error('The company logo could not be loaded.');
 const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('Logo could not be read.'));response.blob().then(blob=>reader.readAsDataURL(blob),reject);});
 // Same navy/background treatment as the approved website mark; no redrawing.
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1092" height="716" viewBox="0 0 1092 716"><defs><filter id="navy" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 .0902 0 0 0 0 .2314 0 0 0 0 .3608 0 -1.4 0 0 1.2"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs><image width="1092" height="716" href="${data}" filter="url(#navy)"/></svg>`;
 const image=new Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await image.decode();return image;
}
export async function posterFile(s:Scheme,settings:Settings):Promise<File>{
 await document.fonts.ready;
 const logo=await brandMark();
 const c=document.createElement('canvas');c.width=1080;c.height=1350;
 const x=c.getContext('2d');if(!x)throw Error('Poster drawing is unavailable.');
 const navy='#173b5c',copper='#9e6447',muted='#526b80',paper='#f6f8fb';
 const sans='"DM Sans", Arial, sans-serif',serif='Lora, Georgia, serif';
 function lines(text:string,font:string,width=936){x!.font=font;return wrapPosterText(text,width,t=>x!.measureText(t).width);}
 const benefitLines=s.benefits.map(b=>lines(b,`24px ${sans}`,874));
 const addressLines=lines(settings.address||'Contact our team for office details',`22px ${sans}`,910);
 const benefitEnd=865+benefitLines.reduce((height,list)=>height+Math.max(1,list.length)*33+15,0);
 const contactTop=Math.max(1040,benefitEnd+35),contactHeight=203+addressLines.length*29;
 c.height=Math.max(1350,contactTop+contactHeight+76);
 function text(t:string,px:number,y:number,font:string,color=navy){x!.font=font;x!.fillStyle=color;x!.fillText(t,px,y);}
 function block(content:string[],px:number,y:number,font:string,color:string,lineHeight:number){for(const line of content){text(line,px,y,font,color);y+=lineHeight;}return y;}
 function box(px:number,y:number,w:number,h:number,fill:string,radius=0){x!.fillStyle=fill;x!.beginPath();x!.roundRect(px,y,w,h,radius);x!.fill();}
 box(0,0,1080,c.height,paper);box(0,0,1080,150,'#fff');
 x.drawImage(logo,65,38,127,83);
 text('Sri Krishna Lakshmi',215,79,`40px ${serif}`);text('CHIT FUNDS',217,116,`600 19px ${sans}`,muted);
 box(0,150,1080,370,navy);
 x.save();x.beginPath();x.rect(0,150,1080,370);x.clip();x.strokeStyle='#355672';x.lineWidth=1.5;for(const radius of [190,230,270]){x.beginPath();x.arc(1088,312,radius,0,Math.PI*2);x.stroke();}x.restore();
 text('FEATURED SAVINGS PLAN',72,200,`600 20px ${sans}`,'#e8c8ad');
 const defaultName=`${money(s.amount)} · ${s.months} months`;
 const headline=s.name===defaultName?'A little today.\nMore tomorrow.':s.name;
 let titleFont=38;while(titleFont>22&&lines(headline,`${titleFont}px ${serif}`,900).length>3)titleFont-=2;
 const titleLines=lines(headline,`${titleFont}px ${serif}`,900);
 block(titleLines,72,263,`${titleFont}px ${serif}`,'#fff',47);
 let amountFont=92;while(amountFont>50&&lines(money(s.amount),`600 ${amountFont}px ${sans}`,930).length>1)amountFont-=2;
 text(money(s.amount),68,444,`600 ${amountFont}px ${sans}`,'#fff');text('CHIT VALUE',74,484,`500 19px ${sans}`,'#c8d8e6');
 box(64,550,952,126,'#fff',12);
 text(money(s.monthly),88,603,`600 43px ${sans}`);text('MONTHLY CONTRIBUTION',90,644,`500 17px ${sans}`,muted);
 x.strokeStyle='#dce4eb';x.beginPath();x.moveTo(592,574);x.lineTo(592,652);x.stroke();
 text(`${s.months} months`,624,603,`600 40px ${sans}`);text('PLAN DURATION',626,644,`500 17px ${sans}`,muted);
 box(64,697,952,78,'#e6edf4',10);box(64,697,5,78,copper);
 text(`Starts ${dateLabel(s.startDate)}`,88,744,`500 27px ${sans}`);
 text(s.slots?`${s.slots} open slots`:'All slots filled',650,744,`600 26px ${sans}`,copper);
 text('A PLAN THAT FITS YOUR LIFE',72,828,`600 20px ${sans}`,copper);
 let y=875;
 for(const group of benefitLines){box(74,y-14,7,7,copper,3.5);y=block(group,100,y,`24px ${sans}`,navy,33)+15;}
 box(64,contactTop,952,contactHeight,navy,14);
 text('LET’S PLAN YOUR NEXT STEP',90,contactTop+40,`600 19px ${sans}`,'#e8c8ad');
 text(`Call ${settings.phone}`,88,contactTop+107,`600 49px ${sans}`,'#fff');
 text('Across India · Digital payments accepted',90,contactTop+153,`23px ${sans}`,'#dbe6ef');
 block(addressLines,90,contactTop+192,`22px ${sans}`,'#dbe6ef',29);
 text('sklcf.vercel.app',72,c.height-31,`500 18px ${sans}`,navy);
 const legal='Subject to scheme agreement. Contact us for full terms.';
 x.font=`16px ${sans}`;text(legal,1008-x.measureText(legal).width,c.height-31,`16px ${sans}`,muted);
 const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('Poster creation failed')),'image/png'));
 return new File([blob],`SKLCF-${s.name.replace(/[^a-z0-9]+/gi,'-')}.png`,{type:'image/png'});
}
export function downloadPoster(file:File){const u=URL.createObjectURL(file),a=document.createElement('a');a.href=u;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
