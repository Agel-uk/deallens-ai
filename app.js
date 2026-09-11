const MARKETS=[
{id:'US',name:'United States',currency:'USD',domain:'amazon.com'},
{id:'UK',name:'United Kingdom',currency:'GBP',domain:'amazon.co.uk'},
{id:'DE',name:'Germany',currency:'EUR',domain:'amazon.de'},
{id:'CA',name:'Canada',currency:'CAD',domain:'amazon.ca'},
{id:'FR',name:'France',currency:'EUR',domain:'amazon.fr'},
{id:'IT',name:'Italy',currency:'EUR',domain:'amazon.it'},
{id:'ES',name:'Spain',currency:'EUR',domain:'amazon.es'},
{id:'JP',name:'Japan',currency:'JPY',domain:'amazon.co.jp'},
{id:'IN',name:'India',currency:'INR',domain:'amazon.in'},
{id:'AE',name:'United Arab Emirates',currency:'AED',domain:'amazon.ae'},
{id:'SA',name:'Saudi Arabia',currency:'SAR',domain:'amazon.sa'},
{id:'AU',name:'Australia',currency:'AUD',domain:'amazon.com.au'},
{id:'SG',name:'Singapore',currency:'SGD',domain:'amazon.sg'},
{id:'OTHER',name:'Other country',currency:'USD',domain:''}];

const PRODUCTS=[
{name:'Wireless Headphones',score:88,query:'wireless headphones'},
{name:'USB-C Power Bank',score:86,query:'USB C power bank'},
{name:'Smart Watch',score:84,query:'smart watch'},
{name:'Running Shoes',score:82,query:'running shoes'},
{name:'Robot Vacuum',score:81,query:'robot vacuum cleaner'},
{name:'Laptop Stand',score:80,query:'adjustable laptop stand'},
{name:'Air Fryer',score:79,query:'air fryer'},
{name:'Everyday Backpack',score:78,query:'everyday backpack'},
{name:'Gaming Accessories',score:77,query:'gaming accessories'},
{name:'Books & Learning',score:76,query:'books learning'}];

const q=document.getElementById('q'),results=document.getElementById('results'),currency=document.getElementById('currency'),marketSelect=document.getElementById('market'),marketNotice=document.getElementById('marketNotice');
function getMarket(id){return MARKETS.find(m=>m.id===id)||MARKETS[0]}
function marketOptions(){return MARKETS.map(m=>`<option value="${m.id}">${m.name} — ${m.currency}</option>`).join('')}
if(marketSelect){marketSelect.innerHTML=marketOptions();marketSelect.value='AE'}
function buildShoppingUrl(market,query){
 const tag=(window.DEALLENS_AFFILIATE_TAGS||{})[market.id];
 if(market.domain&&tag)return `https://${market.domain}/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`;
 if(market.domain)return `https://${market.domain}/s?k=${encodeURIComponent(query)}`;
 return `https://www.google.com/search?q=${encodeURIComponent(query+' online shopping')}`;
}
function hasAffiliate(market){return Boolean((window.DEALLENS_AFFILIATE_TAGS||{})[market.id])}
function updateNotice(market){
 if(!marketNotice)return;
 marketNotice.innerHTML=hasAffiliate(market)
 ? `<strong>${market.name}:</strong> affiliate shopping links are active.`
 : market.domain
 ? `<strong>${market.name}:</strong> shopping links are available, but an affiliate tracking ID has not yet been activated.`
 : `<strong>Other countries:</strong> DealLens will expand here as approved programs are connected.`;
}
function render(items){
 const market=getMarket(marketSelect?.value);updateNotice(market);
 results.innerHTML=items.map(x=>{
  const url=buildShoppingUrl(market,x.query), affiliate=hasAffiliate(market);
  const label=affiliate?`Shop on ${market.domain}`:(market.domain?`Open ${market.domain}`:'Find shopping options');
  return `<article class="card"><div class="score">DEALLENS MATCH · ${x.score}/100</div><h3>${x.name}</h3>
  <p class="small">Search intent: <strong>${x.query}</strong></p>
  <a class="btn primary" rel="${affiliate?'sponsored nofollow noopener':'nofollow noopener'}" target="_blank" href="${url}" onclick="trackOutbound('${market.id}','${x.query.replace(/'/g,"\\'")}')">${label}</a>
  ${affiliate?'<small>(paid link)</small>':''}</article>`;
 }).join('');
}
function search(){
 const s=(q?.value||'').trim().toLowerCase();
 const list=s?PRODUCTS.filter(x=>x.name.toLowerCase().includes(s)||x.query.toLowerCase().includes(s)):PRODUCTS;
 render(list.length?list:PRODUCTS);
}
function trackOutbound(market,query){
 try{const k='deallens_outbound_clicks',d=JSON.parse(localStorage.getItem(k)||'[]');
 d.push({market,query,at:new Date().toISOString()});localStorage.setItem(k,JSON.stringify(d.slice(-200)))}catch(e){}
}
document.getElementById('searchBtn')?.addEventListener('click',search);
q?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
currency?.addEventListener('change',search);marketSelect?.addEventListener('change',search);
const photo=document.getElementById('photo'),preview=document.getElementById('preview');
photo?.addEventListener('change',()=>{const f=photo.files?.[0];if(f){preview.src=URL.createObjectURL(f);preview.hidden=false}});
document.getElementById('listingBtn')?.addEventListener('click',()=>{
 const n=document.getElementById('sellName').value||'Product',c=document.getElementById('condition').value;
 document.getElementById('listing').textContent=`${n}\nCondition: ${c}\n\nAI-ready title: ${n} — ${c}\nDescription: Quality ${n.toLowerCase()} offered in ${c.toLowerCase()} condition.\n\nProduction AI listing generation activates when an approved AI provider is connected.`;
});
search();