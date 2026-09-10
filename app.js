const MARKETS = [
  ['US','United States','USD','amazon.com'],['CA','Canada','CAD','amazon.ca'],['MX','Mexico','MXN','amazon.com.mx'],['BR','Brazil','BRL','amazon.com.br'],
  ['UK','United Kingdom','GBP','amazon.co.uk'],['DE','Germany','EUR','amazon.de'],['FR','France','EUR','amazon.fr'],['IT','Italy','EUR','amazon.it'],['ES','Spain','EUR','amazon.es'],['NL','Netherlands','EUR','amazon.nl'],['SE','Sweden','SEK','amazon.se'],['PL','Poland','PLN','amazon.pl'],
  ['AE','United Arab Emirates','AED','amazon.ae'],['SA','Saudi Arabia','SAR','amazon.sa'],['IN','India','INR','amazon.in'],['JP','Japan','JPY','amazon.co.jp'],['SG','Singapore','SGD','amazon.sg'],['AU','Australia','AUD','amazon.com.au']
];
const AMAZON_AE_TAG='deallensai-21';
const demo={headphones:{name:'Wireless Headphones',score:88,price:49,market:'US',query:'wireless headphones'},watch:{name:'Smart Watch',score:82,price:79,market:'US',query:'smart watch'},shoes:{name:'Running Shoes',score:78,price:65,market:'US',query:'running shoes'}};
const q=document.getElementById('q'),results=document.getElementById('results'),currency=document.getElementById('currency'),marketSelect=document.getElementById('market');
function marketOptions(){return MARKETS.map(m=>`<option value="${m[0]}">${m[1]} — ${m[2]}</option>`).join('')}
if(marketSelect){marketSelect.innerHTML=marketOptions();marketSelect.value='AE';}
function money(v,c){try{return new Intl.NumberFormat(undefined,{style:'currency',currency:c,maximumFractionDigits:0}).format(v)}catch{return v+' '+c}}
function amazonSearchUrl(query){return 'https://www.amazon.ae/s?k='+encodeURIComponent(query)+'&tag='+encodeURIComponent(AMAZON_AE_TAG)}
function render(items){results.innerHTML=items.map(x=>`<article class="card"><div class="score">${x.score}/100</div><h3>${x.name}</h3><p>Demo benchmark only: <strong>${money(x.price,currency.value)}</strong></p><small>This benchmark is not a live Amazon price. Current Amazon.ae results are opened through a tagged Special Link.</small><a class="btn primary" rel="sponsored nofollow noopener" target="_blank" href="${amazonSearchUrl(x.query)}" onclick="trackAmazonClick('${x.query.replace(/'/g,"\\'")}')">View current Amazon.ae results</a><small>(paid link)</small></article>`).join('')}
function trackAmazonClick(query){try{const k='deallens_amazon_clicks';const data=JSON.parse(localStorage.getItem(k)||'[]');data.push({query,at:new Date().toISOString()});localStorage.setItem(k,JSON.stringify(data.slice(-100)));}catch(e){}}
function search(){const s=(q?.value||'').toLowerCase();const list=Object.values(demo).filter(x=>!s||x.name.toLowerCase().includes(s)||s.includes(x.name.split(' ')[1]?.toLowerCase()||''));render(list.length?list:Object.values(demo));}
document.getElementById('searchBtn')?.addEventListener('click',search);q?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});currency?.addEventListener('change',search);search();
const photo=document.getElementById('photo'),preview=document.getElementById('preview');photo?.addEventListener('change',()=>{const f=photo.files?.[0];if(f){preview.src=URL.createObjectURL(f);preview.hidden=false;}});
document.getElementById('listingBtn')?.addEventListener('click',()=>{const n=document.getElementById('sellName').value||'Product';const c=document.getElementById('condition').value;document.getElementById('listing').textContent=`${n}\nCondition: ${c}\n\nAI-ready title: ${n} — ${c}\nDescription: Quality ${n.toLowerCase()} offered in ${c.toLowerCase()} condition.\n\nProduction AI listing generation activates when an approved AI provider is connected.`});
