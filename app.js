const MARKETS = [
  ['US','United States','USD','amazon.com'],['CA','Canada','CAD','amazon.ca'],['MX','Mexico','MXN','amazon.com.mx'],['BR','Brazil','BRL','amazon.com.br'],
  ['UK','United Kingdom','GBP','amazon.co.uk'],['DE','Germany','EUR','amazon.de'],['FR','France','EUR','amazon.fr'],['IT','Italy','EUR','amazon.it'],['ES','Spain','EUR','amazon.es'],['NL','Netherlands','EUR','amazon.nl'],['SE','Sweden','SEK','amazon.se'],['PL','Poland','PLN','amazon.pl'],
  ['AE','United Arab Emirates','AED','amazon.ae'],['SA','Saudi Arabia','SAR','amazon.sa'],['IN','India','INR','amazon.in'],
  ['JP','Japan','JPY','amazon.co.jp'],['SG','Singapore','SGD','amazon.sg'],['AU','Australia','AUD','amazon.com.au']
];
const demo = {
  headphones:{name:'Wireless Headphones',score:88,price:49,market:'US',note:'Demo comparison — connect approved product feeds for live prices.'},
  watch:{name:'Smart Watch',score:82,price:79,market:'US',note:'Demo comparison — connect approved product feeds for live prices.'},
  shoes:{name:'Running Shoes',score:78,price:65,market:'US',note:'Demo comparison — connect approved product feeds for live prices.'}
};
const q=document.getElementById('q'), results=document.getElementById('results'), currency=document.getElementById('currency');
const marketSelect=document.getElementById('market');
function marketOptions(){return MARKETS.map(m=>`<option value="${m[0]}">${m[1]} — ${m[2]}</option>`).join('')}
if(marketSelect){marketSelect.innerHTML=marketOptions(); marketSelect.value='AE';}
function money(v,c){return new Intl.NumberFormat(undefined,{style:'currency',currency:c,maximumFractionDigits:0}).format(v)}
function render(items){results.innerHTML=items.map(x=>`<article class="card"><div class="score">${x.score}/100</div><h3>${x.name}</h3><p>Lowest demo offer: <strong>${money(x.price,currency.value)}</strong></p><small>${x.note}</small><button class="btn" onclick="viewDeal('${x.name.replace(/'/g,\"\\'\")}')">View deal</button></article>`).join('')}
function viewDeal(name){ alert('Demo only: live affiliate tracking will activate after an approved provider account and tracking IDs are configured server-side. Product: '+name); }
function search(){const s=(q.value||'').toLowerCase(); const list=Object.values(demo).filter(x=>!s||x.name.toLowerCase().includes(s)||s.includes(x.name.split(' ')[1]?.toLowerCase()||'')); render(list.length?list:Object.values(demo));}
document.getElementById('searchBtn')?.addEventListener('click',search); q?.addEventListener('keydown',e=>{if(e.key==='Enter')search()}); currency?.addEventListener('change',search); search();
const photo=document.getElementById('photo'),preview=document.getElementById('preview'); photo?.addEventListener('change',()=>{const f=photo.files?.[0]; if(f){preview.src=URL.createObjectURL(f); preview.hidden=false;}});
document.getElementById('listingBtn')?.addEventListener('click',()=>{const n=document.getElementById('sellName').value||'Product'; const c=document.getElementById('condition').value; document.getElementById('listing').textContent=`${n}\nCondition: ${c}\n\nAI-ready title: ${n} — ${c}\nDescription: Quality ${n.toLowerCase()} offered in ${c.toLowerCase()} condition.\n\nProduction AI listing generation activates when an approved AI provider is connected.`});
