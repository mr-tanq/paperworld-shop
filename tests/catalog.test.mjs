// The catalogue rules every product must follow before it can be sold.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../products.json',import.meta.url),'utf8'));
const STRIPE=/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/;
// Honest selling: no income promises, fake social proof or brand imitation.
const BANNED=/guarantee(d)? (income|results|money)|get rich|passive income guaranteed|\b(best[- ]?seller|#1)\b|(\d+[,.]?\d*k?\+? )?(happy|satisfied) (customers|buyers)|official (canva|notion|google|microsoft|apple|disney|nintendo|pokemon)/i;
test('shop basics',()=>{
 assert.equal(data.shop,'Digital Business Studio');assert.equal(data.currency,'EUR');
 assert.ok(Array.isArray(data.products));
});
test('every product is complete, honest and correctly priced',()=>{
 const slugs=new Set();
 for(const p of data.products){
  assert.match(p.slug,/^[a-z0-9][a-z0-9-]{2,59}$/,'slug');assert.ok(!slugs.has(p.slug),'unique slug '+p.slug);slugs.add(p.slug);
  assert.ok(typeof p.title==='string'&&p.title.trim()&&p.title.length<=80,'title '+p.slug);
  assert.ok(typeof p.summary==='string'&&p.summary.trim()&&p.summary.length<=200,'summary '+p.slug);
  assert.ok(Number.isFinite(p.price_eur)&&p.price_eur>=1&&p.price_eur<=99&&Math.round(p.price_eur*100)===p.price_eur*100,'price '+p.slug);
  assert.ok(['draft','soon','live'].includes(p.status),'status '+p.slug);
  assert.doesNotMatch(p.title+' '+p.summary+' '+(p.description||''),BANNED,'honest copy '+p.slug);
  if(p.preview){assert.match(p.preview,/^\.\/assets\/previews\/[a-z0-9-]+\.(png|jpg|webp|svg)$/);
   assert.ok(fs.existsSync(new URL('..'+p.preview.slice(1),import.meta.url)),'preview exists '+p.slug)}
  if(p.status==='live'){
   assert.match(p.payment_link||'',STRIPE,'live products need a Stripe payment link '+p.slug);
   assert.match(p.file_key||'',/^[a-z0-9][a-z0-9-]{2,59}\.(pdf|zip|xlsx|csv|png)$/,'live products need a private file key '+p.slug);
   assert.ok(p.preview,'live products need a preview '+p.slug);
  }
 }
});
