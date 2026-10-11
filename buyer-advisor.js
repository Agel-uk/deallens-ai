"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const guides = Array.isArray(window.DEALLENS_GUIDES) ? window.DEALLENS_GUIDES : [];
  const goalNames = {work:'Work & productivity',home:'Home & everyday use',travel:'Travel & commuting',fitness:'Fitness & outdoors',commute:'Calls & listening'};
  const concerns = {value:'Compare total ownership cost, not just the headline price.',reliability:'Check warranty coverage, repair support, spare parts and seller reputation.',portability:'Verify size, weight, power requirements and real-world portability.',performance:'Check sustained performance under your actual workload, not marketing peaks.',simplicity:'Prefer clear controls, easy maintenance and a reasonable return window.'};
  const create = (tag, text, cls) => { const el=document.createElement(tag); if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el; };
  function render(){
    const goal=$('goal').value, group=$('group').value, concern=$('concern').value, currency=$('currency').value;
    const budgetInput=$('budget').value.trim(), budget=budgetInput===''?null:Number(budgetInput);
    const report=$('brief'); report.replaceChildren();report.append(create('h2','Your buying brief'));
    if(budget!==null&&(!Number.isFinite(budget)||budget<0||budget>10000000)){report.append(create('p','Enter a valid budget between 0 and 10,000,000.'));return;}
    const heading=create('p','Shopping goal: '+goalNames[goal]+'.');report.append(heading);
    const meta=create('div',undefined,'brief-meta');meta.append(create('span',budget===null?'Budget not specified':'Budget ceiling: '+new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(budget)+' '+currency));meta.append(create('span','Priority: '+$('concern').selectedOptions[0].text));report.append(meta);
    const note=create('p','Key check: '+concerns[concern]);report.append(note);
    const filtered=guides.filter(g=>group==='all'||g.group===group);
    const ranked=filtered.map(g=>({g,score:(g.use===goal?5:0)+(g.group===group&&group!=='all'?3:0)+(g.group==='tech'&&goal==='commute'?1:0)})).sort((a,b)=>b.score-a.score||a.g.name.localeCompare(b.g.name)).slice(0,6);
    if(!ranked.length){report.append(create('p','No category guides match. Try a different category.'));return;}
    report.append(create('h3','Research these relevant categories'));
    const cards=create('div',undefined,'advisor-results');
    ranked.forEach(({g})=>{const card=create('article',undefined,'advisor-result');card.append(create('h3',g.name));card.append(create('p','Check first: '+g.primary+'.'));card.append(create('p','Also verify: '+g.secondary+'.'));const a=create('a','Read original buying guide →');a.href=g.url;card.append(a);cards.append(card);});report.append(cards);
    report.append(create('h3','Before you buy'));
    const ul=create('ul',undefined,'advisor-checks');['Confirm compatibility with devices and intended use.','Compare independent specifications and reputable reviews.','Check the retailer’s current price, taxes, shipping and returns.','Keep a record of warranty terms and the seller’s identity.','Use Decision Lab to compare verified products using your priorities.'].forEach(s=>ul.append(create('li',s)));report.append(ul);
    report.append(create('p','No products were tested or priced by this tool. The category suggestions are editorial starting points, not endorsements.'));
  }
  $('build').addEventListener('click',render);
  $('clear').addEventListener('click',()=>{$('goal').value='work';$('group').value='all';$('budget').value='';$('currency').value='USD';$('concern').value='value';$('brief').replaceChildren(create('h2','Your buying brief'),create('p','Choose your shopping goal and select Build my buying brief.'));});
  $('print').addEventListener('click',()=>window.print());
})();