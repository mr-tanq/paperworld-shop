// The storefront never loads third-party scripts, never tracks visitors, only
// links to Stripe-hosted checkout and only asks the shop's own delivery service.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
test('pages load only local scripts and no trackers',()=>{
 for(const f of ['index.html','thanks.html']){
  const html=read(f);
  for(const m of html.matchAll(/<script[^>]*src="([^"]+)"/g))assert.match(m[1],/^\.\/[a-z-]+\.js$/,f+' script '+m[1]);
  assert.doesNotMatch(html,/google-analytics|gtag\(|facebook\.net|hotjar|<iframe/i,f);
 }
 assert.match(read('thanks.html'),/<meta name="robots" content="noindex">/);
});
test('buy buttons only go to Stripe checkout; delivery only asks our service',()=>{
 const app=read('app.js');
 assert.match(app,/const STRIPE_LINK=\/\^https:\\\/\\\/buy\\\.stripe\\\.com\\\/\[A-Za-z0-9_\]\+\$\//);
 assert.doesNotMatch(app,/innerHTML|eval\(|document\.cookie|localStorage/);
 const d=read('delivery.js');
 assert.match(d,/const DELIVERY='https:\/\/jrevhzvrgenucuozjowm\.supabase\.co\/functions\/v1\/shop-delivery';/);
 assert.match(d,/\^cs_\(live\|test\)_/);assert.doesNotMatch(d,/innerHTML|eval\(/);
});
