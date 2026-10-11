"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const markets = {
    US:{name:"United States",currency:"USD",domain:"www.amazon.com"},
    GB:{name:"United Kingdom",currency:"GBP",domain:"www.amazon.co.uk"},
    DE:{name:"Germany",currency:"EUR",domain:"www.amazon.de"},
    CA:{name:"Canada",currency:"CAD",domain:"www.amazon.ca"},
    AE:{name:"United Arab Emirates",currency:"AED",domain:"www.amazon.ae"},
    FR:{name:"France",currency:"EUR",domain:"www.amazon.fr"},
    AU:{name:"Australia",currency:"AUD",domain:"www.amazon.com.au"},
    JP:{name:"Japan",currency:"JPY",domain:"www.amazon.co.jp"}
  };
  const products = {
    headphones:{name:"Wireless headphones",query:"wireless headphones",guide:"guide-wireless-headphones.html",checks:["Comfort and fit for long sessions","Noise cancellation and transparency mode","Microphone quality for calls","Battery life and return policy"]},
    laptops:{name:"Laptops",query:"laptop computer",guide:"guide-laptops.html",checks:["CPU, RAM and storage for your workload","Screen quality and battery life","Ports, keyboard and repair support","Operating system and warranty"]},
    powerbanks:{name:"Power banks",query:"usb c power bank",guide:"guide-power-banks.html",checks:["USB-C PD wattage and device compatibility","Capacity and realistic charging losses","Airline battery limits when traveling","Safety certifications and warranty"]},
    monitors:{name:"Computer monitors",query:"computer monitor",guide:"guide-monitors.html",checks:["Size, resolution and refresh rate","Ports and laptop compatibility","Stand ergonomics and VESA mounting","Panel quality and return policy"]},
    tablets:{name:"Tablets",query:"tablet computer",guide:"guide-tablets.html",checks:["Operating system and app compatibility","Screen size and battery life","Storage, keyboard and pen support","Updates and repair policy"]},
    ssds:{name:"Portable SSDs",query:"portable external ssd",guide:"guide-portable-ssds.html",checks:["Capacity and sustained transfer speeds","USB connection compatibility","Durability and encryption","Warranty and data backup"]},
    vacuums:{name:"Robot vacuums",query:"robot vacuum cleaner",guide:"guide-robot-vacuums.html",checks:["Floor type and obstacle handling","Navigation and mapping privacy","Replacement parts and maintenance","Dock size and warranty"]},
    chairs:{name:"Office chairs",query:"ergonomic office chair",guide:"guide-office-chairs.html",checks:["Adjustability and lumbar support","Seat dimensions and materials","Return policy and assembly","Warranty and spare parts"]},
    coffee:{name:"Coffee makers",query:"coffee maker machine",guide:"guide-coffee-makers.html",checks:["Drink type and brewing method","Cleaning and consumable costs","Counter space and noise","Serviceability and warranty"]},
    watches:{name:"Smart watches",query:"smart watch",guide:"guide-smart-watches.html",checks:["Phone and app compatibility","Battery life and charging","Sensor limitations and features","Updates, comfort and warranty"]}
  };
  const priorityText = {
    value:"Compare the total delivered cost and ongoing ownership expenses.",
    reliability:"Prioritize warranty coverage, service options and independent reliability evidence.",
    performance:"Look for credible benchmarks relevant to your actual workload.",
    portability:"Check weight, dimensions and battery life in realistic use.",
    simplicity:"Favor easy setup, clear controls and low maintenance."
  };
  const el = (tag, text, cls) => { const n=document.createElement(tag); if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n; };
  const selectedMarket = () => markets[$("market").value];
  function updateCurrency(){
    $("currency-help").textContent="Currency: "+selectedMarket().currency+". Budget is a planning limit, not a live price filter. No currency conversion is performed.";
  }
  function render(event){
    event.preventDefault();
    const m=selectedMarket(), p=products[$("category").value], priority=$("priority").value;
    const raw=$("budget").value.trim(), budget=raw===""?null:Number(raw), target=$("results");
    target.replaceChildren(el("h2","Your shopping plan"));
    if(budget!==null&&(!Number.isFinite(budget)||budget<=0||budget>10000000)){
      target.append(el("p","Enter a budget greater than zero and no more than 10,000,000.", "hub-error"));return;
    }
    const head=el("div",undefined,"hub-result-head");
    head.append(el("h3",p.name+" in "+m.name));
    head.append(el("span",m.currency,"hub-pill"));target.append(head);
    target.append(el("p",budget===null?"No maximum budget specified.":"Your planning budget: "+new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(budget)+" "+m.currency+"."));
    target.append(el("p",priorityText[priority]));
    target.append(el("h3","What to check before buying"));
    const list=el("ul",undefined,"hub-checks");
    p.checks.forEach(s=>list.append(el("li",s)));
    target.append(list);
    const links=el("div",undefined,"hub-links");
    const guide=el("a","Read our independent buying guide →","hub-secondary");guide.href=p.guide;links.append(guide);
    const tags=window.DEALLENS_AFFILIATE_TAGS||{};
    const tag=typeof tags[$("market").value]==="string"&&/^[a-zA-Z0-9_-]{2,40}$/.test(tags[$("market").value])?tags[$("market").value]:"";
    const params=new URLSearchParams({k:p.query});
    if(tag)params.set("tag",tag);
    const retailer=el("a","Browse "+m.name+" retailer listings ↗","hub-button");
    retailer.href="https://"+m.domain+"/s?"+params.toString();
    retailer.target="_blank";retailer.rel="noopener noreferrer sponsored";
    links.append(retailer);target.append(links);
    target.append(el("p",tag?"This retailer search uses the public affiliate tag configured for this market. Verify that the affiliate account remains approved.":"This market currently uses a standard retailer search link without an affiliate tracking tag.","hub-small"));
    target.append(el("p","Important: the budget is NOT applied to the retailer search results. Prices, taxes, shipping, stock, seller identity, returns and product suitability must be checked on the retailer site.","hub-warning"));
    const compare=el("p");const a=el("a","Compare verified products in Decision Lab →");a.href="decision-lab.html";compare.append(a);target.append(compare);
  }
  $("market").addEventListener("change",updateCurrency);
  $("hub-form").addEventListener("submit",render);
  $("hub-form").addEventListener("reset",()=>{requestAnimationFrame(()=>{updateCurrency();$("results").replaceChildren(el("h2","Your shopping plan"),el("p","Select your preferences and build your plan."));});});
  updateCurrency();
})();