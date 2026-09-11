const MARKETS = [
  ['AE','United Arab Emirates','AED','amazon.ae'],['SA','Saudi Arabia','SAR','amazon.sa'],
  ['US','United States','USD','amazon.com'],['CA','Canada','CAD','amazon.ca'],['MX','Mexico','MXN','amazon.com.mx'],['BR','Brazil','BRL','amazon.com.br'],
  ['UK','United Kingdom','GBP','amazon.co.uk'],['DE','Germany','EUR','amazon.de'],['FR','France','EUR','amazon.fr'],['IT','Italy','EUR','amazon.it'],['ES','Spain','EUR','amazon.es'],
  ['NL','Netherlands','EUR','amazon.nl'],['SE','Sweden','SEK','amazon.se'],['PL','Poland','PLN','amazon.pl'],['IN','India','INR','amazon.in'],['JP','Japan','JPY','amazon.co.jp'],
  ['SG','Singapore','SGD','amazon.sg'],['AU','Australia','AUD','amazon.com.au']
];
const TAGS = window.DEALLENS_AFFILIATE_TAGS || {};
const demo = [
  {name:'Wireless Headphones',score:88,query:'wireless headphones'},
  {name:'Smart Watch',score:82,query:'smart watch'},
  {name:'Running Shoes',score:78,query:'running shoes'},
  {name:'Power Bank',score:86,query:'power bank usb c'},
  {name:'Robot Vacuum',score:84,query:'robot vacuum cleaner'},
  {name:'Air Fryer',score:83,query:'air fryer'}
];
const $ = id => document.getElementById(id);
const marketSelect=$('market'), currency=$('currency'), q=$('q'), results=$('results');
function marketByCode(code){return MARKETS.find(m=>m[0]===code)||MARKETS[0]}
function preferredMarket(){
  const saved=localStorage.getItem('deallens_market'); if(saved&&marketByCode(saved)) return saved;
  const region=(navigator.language||'en-AE').split('-')[1]?.toUpperCase();
  return MARKETS.some(m=>m[0]===region)?region:'AE';
}
function marketOptions(){return MARKETS.map(m=>`<option value="${m[0]}">${m[1]} — ${m[2]}</option>`).join('')}
if(marketSelect){marketSelect.innerHTML=marketOptions();marketSelect.value=preferredMarket();}
function syncCurrency(){if(!marketSelect||!currency)return;const m=marketByCode(marketSelect.value);currency.value=m[2];localStorage.setItem('deallens_market',m[0]);$('affiliateState')?.replaceChildren(document.createTextNode(TAGS[m[0]]?'Affiliate link active for this market':'Standard retailer link — affiliate not activated for this market'));}
function amazonSearchUrl(query){const m=marketByCode(marketSelect?.value||'AE');const url=new URL(`https://www.${m[3]}/s`);url.searchParams.set('k',query);if(TAGS[m[0]])url.searchParams.set('tag',TAGS[m[0]]);return url.toString()}
function trackOutbound(query){try{const k='deallens_outbound_clicks';const data=JSON.parse(localStorage.getItem(k)||'[]');data.push({query,market:marketSelect?.value||'AE',affiliate:Boolean(TAGS[marketSelect?.value||'AE']),at:new Date().toISOString()});localStorage.setItem(k,JSON.stringify(data.slice(-500)));}catch{}}
function render(items){if(!results)return;results.innerHTML=items.map(x=>`<article class="card"><div class="score">DEALLENS GUIDE · ${x.score}/100</div><h3>${x.name}</h3><p>Compare current products, sellers, delivery and prices on the selected Amazon marketplace.</p><a class="btn primary" rel="${TAGS[marketSelect?.value||'AE']?'sponsored ':''}nofollow noopener" target="_blank" href="${amazonSearchUrl(x.query)}" data-query="${x.query}">View current offers</a><small>${TAGS[marketSelect?.value||'AE']?'Paid affiliate link. DealLens may earn from qualifying purchases.':'No DealLens affiliate tag is active for this market yet.'}</small></article>`).join('');results.querySelectorAll('[data-query]').forEach(a=>a.addEventListener('click',()=>trackOutbound(a.dataset.query)));}
function search(){const s=(q?.value||'').trim().toLowerCase();const list=demo.filter(x=>!s||x.name.toLowerCase().includes(s)||x.query.includes(s));render(list.length?list:demo)}
$('searchBtn')?.addEventListener('click',search);q?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});marketSelect?.addEventListener('change',()=>{syncCurrency();search()});currency?.addEventListener('change',search);
syncCurrency();search();
const photo=$('photo'),preview=$('preview');photo?.addEventListener('change',()=>{const f=photo.files?.[0];if(f){preview.src=URL.createObjectURL(f);preview.hidden=false;}});
$('listingBtn')?.addEventListener('click',()=>{const n=$('sellName').value.trim()||'Product';const c=$('condition').value;$('listing').textContent=`${n}\nCondition: ${c}\n\nSuggested title: ${n} — ${c}\nDescription: ${n} offered in ${c.toLowerCase()} condition. Confirm specifications, defects, delivery and warranty before publishing.\n\nAI image recognition is not enabled until an approved server-side AI provider is connected.`});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
