"use strict";
/* Consent-first GA4 event measurement. Disabled until a real measurement ID is configured. */
(function(){
  const GA4_MEASUREMENT_ID=""; // Set your real G-XXXXXXXXXX ID here after creating a GA4 web stream.
  const ID=(GA4_MEASUREMENT_ID||window.DEALLENS_ANALYTICS_ID||"").trim();
  const valid=/^G-[A-Z0-9]{6,15}$/.test(ID);
  const KEY="deallens_analytics_consent_v1";
  const choice=()=>{try{return localStorage.getItem(KEY)}catch{return null}};
  const save=v=>{try{localStorage.setItem(KEY,v)}catch{}};
  let enabled=false;
  function send(event,params){
    if(!enabled||typeof window.gtag!=="function")return;
    window.gtag("event",event,{...params,transport_type:"beacon"});
  }
  function start(){
    if(!valid||enabled)return;
    enabled=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag("js",new Date());
    window.gtag("config",ID,{anonymize_ip:true,send_page_view:true});
    const script=document.createElement("script");
    script.async=true;script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ID);
    document.head.appendChild(script);
  }
  function banner(){
    if(!valid||choice()!==null)return;
    const aside=document.createElement("aside");
    aside.setAttribute("aria-label","Optional analytics consent");
    aside.style.cssText="position:fixed;bottom:12px;left:12px;right:12px;max-width:540px;z-index:9999;padding:18px;background:#142438;color:#fff;border:1px solid #7796b6;border-radius:12px;box-shadow:0 8px 32px #0006;font:15px/1.5 system-ui";
    const p=document.createElement("p");p.textContent="May we use optional Google Analytics to understand guide visits and shopping-link clicks? You can decline; the site still works.";
    p.style.margin="0 0 12px";
    const actions=document.createElement("div");actions.style.cssText="display:flex;gap:10px;flex-wrap:wrap";
    function button(label,value){const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="min-height:44px;padding:8px 16px;border:1px solid #fff;border-radius:8px;background:#fff;color:#142438;font-weight:700;cursor:pointer";b.addEventListener("click",()=>{save(value);aside.remove();if(value==="yes")start()});return b;}
    actions.append(button("Allow analytics","yes"),button("Decline","no"));
    const link=document.createElement("a");link.href="privacy.html";link.textContent="Privacy policy";link.style.cssText="color:#c7e6ff;display:inline-block;margin-top:10px";
    aside.append(p,actions,link);document.body.appendChild(aside);
  }
  function eventTarget(node){
    if(!(node instanceof Element))return null;
    return node.closest("a[href],button");
  }
  function classify(anchor){
    if(!anchor||anchor.tagName!=="A")return null;
    let url;try{url=new URL(anchor.href,location.href)}catch{return null}
    if(!["http:","https:"].includes(url.protocol))return null;
    const host=url.hostname.toLowerCase();
    if(host==="amazon.com"||host.endsWith(".amazon.com")||/^amazon\.[a-z.]+$/.test(host)||/^www\.amazon\.[a-z.]+$/.test(host)){
      return {name:"retailer_outbound_click",params:{retailer:"amazon",market_host:host,source_page:location.pathname.split("/").pop()||"index.html",affiliate_tag_present:url.searchParams.has("tag")}};
    }
    if(url.origin!==location.origin)return null;
    const page=url.pathname.split("/").pop();
    if(page==="decision-lab.html"||page==="ownership-cost.html"||page==="us-shopping.html"){
      return {name:"buyer_path_click",params:{destination:page,source_page:location.pathname.split("/").pop()||"index.html"}};
    }
    return null;
  }
  document.addEventListener("click",function(e){
    const el=eventTarget(e.target);
    const tracked=classify(el);
    if(tracked)send(tracked.name,tracked.params);
  },{capture:true});
  document.addEventListener("submit",function(e){const form=e.target;if(!(form instanceof HTMLFormElement))return;let action;try{action=new URL(form.action,location.href)}catch{return}if(action.hostname.endsWith("amazon.com")||/^www\\.amazon\\.[a-z.]+$/.test(action.hostname)){send("retailer_search_submit",{retailer:"amazon",market_host:action.hostname,source_page:location.pathname.split("/").pop()||"index.html"})}},true);
  document.addEventListener("DOMContentLoaded",()=>{if(choice()==="yes")start();else banner()});
  window.DealLensAnalytics={enabled:()=>enabled,resetConsent:()=>{save("no");location.reload()}};
})();
