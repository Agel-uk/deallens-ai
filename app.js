const MARKETS = [
  ['AE','United Arab Emirates','AED','amazon.ae'],['SA','Saudi Arabia','SAR','amazon.sa'],
  ['US','United States','USD','amazon.com'],['CA','Canada','CAD','amazon.ca'],['MX','Mexico','MXN','amazon.com.mx'],['BR','Brazil','BRL','amazon.com.br'],
  ['UK','United Kingdom','GBP','amazon.co.uk'],['DE','Germany','EUR','amazon.de'],['FR','France','EUR','amazon.fr'],['IT','Italy','EUR','amazon.it'],['ES','Spain','EUR','amazon.es'],
  ['NL','Netherlands','EUR','amazon.nl'],['SE','Sweden','SEK','amazon.se'],['PL','Poland','PLN','amazon.pl'],['IN','India','INR','amazon.in'],['JP','Japan','JPY','amazon.co.jp'],
  ['SG','Singapore','SGD','amazon.sg'],['AU','Australia','AUD','amazon.com.au']
];
const TAGS = window.DEALLENS_AFFILIATE_TAGS || {};
const demo = [
  {name:'Wireless Headphones',query:'wireless headphones',guide:'guide-wireless-headphones.html'},
  {name:'Smart Watch',query:'smart watch',guide:'guide-smart-watches.html'},
  {name:'Running Shoes',query:'running shoes',guide:'guide-running-shoes.html'},
  {name:'Power Bank',query:'power bank usb c',guide:'guide-power-banks.html'},
  {name:'Robot Vacuum',query:'robot vacuum cleaner',guide:'guide-robot-vacuums.html'},
  {name:'Air Fryer',query:'air fryer',guide:'guide-air-fryers.html'}
];
const $ = id => document.getElementById(id);
const marketSelect=$('market'), currency=$('currency'), q=$('q'), results=$('results');
function marketByCode(code){return MARKETS.find(m=>m[0]===code)||MARKETS.find(m=>m[0]==='US')}
function preferredMarket(){
  try {
    const saved = localStorage.getItem('deallens_market');
    if (saved && MARKETS.some(m => m[0] === saved)) return saved;
  } catch (_) {}
  return 'US';
}
function marketOptions(){return MARKETS.map(m=>`<option value="${m[0]}">${m[1]} — ${m[2]}</option>`).join('')}
if(marketSelect){marketSelect.innerHTML=marketOptions();marketSelect.value=preferredMarket();}
function selectedMarket(){return marketByCode(marketSelect?.value || 'US');}
function hasAffiliateTag(){return Boolean(TAGS[selectedMarket()[0]]);}
function syncCurrency(){
  const m = selectedMarket();
  if(currency) currency.value = m[2]; // Display label only: no exchange-rate conversion.
  try { localStorage.setItem('deallens_market',m[0]); } catch (_) {}
  const state = $('affiliateState');
  if(state) state.textContent = hasAffiliateTag()
    ? 'Paid affiliate links may earn DealLens a commission from qualifying purchases.'
    : 'Standard retailer links — no DealLens affiliate tracking for this market.';
}
function amazonSearchUrl(query){
  const m = selectedMarket();
  const url = new URL(`https://www.${m[3]}/s`);
  url.searchParams.set('k',query);
  if(TAGS[m[0]]) url.searchParams.set('tag',TAGS[m[0]]);
  return url.toString();
}
function trackOutbound(query){
  try {
    const k='deallens_outbound_clicks';
    const data=JSON.parse(localStorage.getItem(k)||'[]');
    if(!Array.isArray(data)) return;
    data.push({query,market:selectedMarket()[0],affiliate:hasAffiliateTag(),at:new Date().toISOString()});
    localStorage.setItem(k,JSON.stringify(data.slice(-500)));
  } catch (_) {}
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function offerButton(query){
  return `<a class="btn primary" rel="${hasAffiliateTag()?'sponsored ':''}nofollow noopener" target="_blank" href="${escapeHtml(amazonSearchUrl(query))}" data-query="${escapeHtml(query)}">View current offers</a>`;
}
function wireOutboundLinks(container){
  container.querySelectorAll('a[data-query]').forEach(a => a.addEventListener('click',()=>trackOutbound(a.dataset.query)));
}
function render(items, customQuery=''){
  if(!results)return;
  const cards=items.map(x=>`<article class="card"><div class="score">DEALLENS BUYING GUIDE</div><h3>${escapeHtml(x.name)}</h3><p>Review the buying criteria, then compare current products, sellers, delivery and prices on the selected marketplace.</p><div class="card-actions"><a class="btn" href="${escapeHtml(x.guide)}">Read guide</a>${offerButton(x.query)}</div><small>${hasAffiliateTag()?'Paid affiliate link. DealLens may earn from qualifying purchases.':'No DealLens affiliate tag is active for this market yet.'}</small></article>`);
  if(customQuery){
    cards.unshift(`<article class="card"><div class="score">MARKETPLACE SEARCH</div><h3>Search: ${escapeHtml(customQuery)}</h3><p>Open current retailer results for your exact search. DealLens does not display live prices or verify individual listings.</p><div class="card-actions">${offerButton(customQuery)}</div><small>${hasAffiliateTag()?'Paid affiliate link. DealLens may earn from qualifying purchases.':'Standard retailer link; no DealLens affiliate tag for this market.'}</small></article>`);
  }
  results.innerHTML=cards.join('');
  wireOutboundLinks(results);
}
function search(){
  const term=(q?.value||'').trim().replace(/\s+/g,' ').slice(0,180);
  if(!term){render(demo);return;}
  const normalized=term.toLowerCase();
  const matches=demo.filter(x=>x.name.toLowerCase().includes(normalized)||x.query.includes(normalized));
  render(matches,term);
}
function refreshGuideOfferLinks(){
  document.querySelectorAll('.offer-link[data-query]').forEach(a => {
    const query=a.dataset.query;
    if(!query)return;
    a.href=amazonSearchUrl(query);
    a.target='_blank';
    a.rel=(hasAffiliateTag()?'sponsored ':'')+'nofollow noopener';
    if(a.dataset.deallensTracked!=='yes'){
      a.addEventListener('click',()=>trackOutbound(query));
      a.dataset.deallensTracked='yes';
    }
  });
}
$('searchBtn')?.addEventListener('click',search);q?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});marketSelect?.addEventListener('change',()=>{syncCurrency();search();refreshGuideOfferLinks()});currency?.addEventListener('change',search);
syncCurrency();search();
const photo=$('photo'),preview=$('preview');photo?.addEventListener('change',()=>{const f=photo.files?.[0];if(f){preview.src=URL.createObjectURL(f);preview.hidden=false;}});
$('listingBtn')?.addEventListener('click',()=>{const n=$('sellName').value.trim()||'Product';const c=$('condition').value;$('listing').textContent=`${n}\nCondition: ${c}\n\nSuggested title: ${n} — ${c}\nDescription: ${n} offered in ${c.toLowerCase()} condition. Confirm specifications, defects, delivery and warranty before publishing.\n\nAI image recognition is not enabled until an approved server-side AI provider is connected.`});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

// Deep-link search and guide offer buttons.
const params = new URLSearchParams(location.search);
if(q && params.get('search')) { q.value = params.get('search').slice(0,180); search(); }
refreshGuideOfferLinks();
