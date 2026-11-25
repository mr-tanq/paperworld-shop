/* Digital Business Studio storefront: renders products.json. No tracking,
 * no cookies. "Buy" only ever links to a Stripe-hosted checkout page. */
'use strict';
const STRIPE_LINK=/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/;
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function card(p){
 const c=el('article','card');
 if(p.preview){const img=el('img');img.src=p.preview;img.alt=p.title;img.loading='lazy';c.append(img)}
 c.append(el('h2','',p.title),el('p','',p.summary),el('p','price',(p.price_eur).toFixed(2).replace('.',',')+' €'));
 const buy=el('a','btn',STRIPE_LINK.test(p.payment_link||'')?'Buy · instant download':'Coming soon');
 if(STRIPE_LINK.test(p.payment_link||'')){buy.href=p.payment_link;buy.rel='noopener'}
 else buy.setAttribute('aria-disabled','true');
 c.append(buy);return c;
}
fetch('./products.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{
 const list=(data.products||[]).filter(p=>p.status==='live'||p.status==='soon');
 document.getElementById('products').replaceChildren(...list.map(card));
 document.getElementById('empty').hidden=list.length>0;
}).catch(()=>{document.getElementById('empty').hidden=false});
