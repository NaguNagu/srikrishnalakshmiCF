// Wrap arbitrary administrator text, including long words, without losing content.
export function wrapPosterText(text:string,maxWidth:number,measure:(text:string)=>number):string[] {
 const lines:string[]=[];
 for(const paragraph of text.split('\n')){
  let line='';
  for(const word of paragraph.trim().split(/\s+/).filter(Boolean)){
   if(measure(word)>maxWidth){
    if(line){lines.push(line);line='';}
    for(const letter of word){if(line&&measure(line+letter)>maxWidth){lines.push(line);line='';}line+=letter;}
   }else if(line&&measure(line+' '+word)>maxWidth){lines.push(line);line=word;}
   else line+=(line?' ':'')+word;
  }
  if(line)lines.push(line);
 }
 return lines;
}
