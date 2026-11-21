/* DealLens AI — US-first Amazon offer links. No geo redirects. */
(function(){
"use strict";
const TAG="deallensai-20";
function init(){
  document.querySelectorAll(".global-market-panel").forEach(el=>el.remove());
  document.querySelectorAll("a.offer-link[data-query]").forEach(link=>{
    const query=(link.dataset.query||"").trim();
    if(!query)return;
    const url=new URL("https://www.amazon.com/s");
    url.searchParams.set("k",query);
    url.searchParams.set("tag",TAG);
    link.href=url.toString();
    link.target="_blank";
    link.rel="sponsored nofollow noopener noreferrer";
  });
  document.querySelectorAll(".global-market-status").forEach(el=>{el.textContent="Amazon.com · United States · USD"});
  document.querySelectorAll(".affiliate-us-disclosure").forEach(el=>{el.textContent="(paid link) As an Amazon Associate I earn from qualifying purchases."});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();