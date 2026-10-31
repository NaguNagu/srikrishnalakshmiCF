import test from 'node:test';
import assert from 'node:assert/strict';
import {wrapPosterText} from '../lib/poster-layout';
const measure=(text:string)=>text.length*10;
test('Poster wrapping retains full benefits and addresses within the width',()=>{
 const text='A long benefit explaining the full contribution schedule and personal assistance';
 const wrapped=wrapPosterText(text,180,measure);
 assert.equal(wrapped.join(' '),text);
 assert.ok(wrapped.every(line=>measure(line)<=180));
});
test('Poster wrapping breaks long unspaced text and respects explicit lines',()=>{
 const word='W'.repeat(140),wrapped=wrapPosterText(word,180,measure);
 assert.equal(wrapped.join(''),word);
 assert.ok(wrapped.every(line=>measure(line)<=180));
 assert.deepEqual(wrapPosterText('A little today.\nMore tomorrow.',400,measure),['A little today.','More tomorrow.']);
});
