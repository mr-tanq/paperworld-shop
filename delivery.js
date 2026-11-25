/* After a Stripe payment the buyer lands here with ?session_id=… The shop's
 * delivery service checks the payment with Stripe and returns a short-lived,
 * personal download link. Nothing here can grant a download by itself. */
'use strict';
const DELIVERY='https://jrevhzvrgenucuozjowm.supabase.co/functions/v1/shop-delivery';
const status=document.getElementById('status'),link=document.getElementById('download');
const id=new URLSearchParams(location.search).get('session_id')||'';
if(!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(id)){status.textContent='This page needs a valid order link. Please use the link from your checkout.'}
else fetch(DELIVERY+'?session_id='+encodeURIComponent(id)).then(r=>r.json().then(b=>({ok:r.ok,b}))).then(({ok,b})=>{
 if(!ok||!/^https:\/\//.test(b.url||'')){status.textContent='We could not confirm the payment yet. Please refresh in a minute.';return}
 status.textContent='Your download is ready: '+(b.title||'your file')+'.';link.href=b.url;link.hidden=false;
}).catch(()=>{status.textContent='Connection problem. Please refresh in a minute.'});
