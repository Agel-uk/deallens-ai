"use strict";
(function(){
  const $=id=>document.getElementById(id);
  const fields=["price","delivery","annual","subscription","maintenance"];
  const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
  function read(suffix){
    const costs={};
    for(const field of fields){
      const raw=$(field+suffix).value.trim();
      const value=Number(raw);
      if(raw===""||!Number.isFinite(value)||value<0||value>10000000)throw new Error("Enter a valid nonnegative amount for "+field+" in option "+suffix+".");
      costs[field]=value;
    }
    return {name:($("name"+suffix).value.trim()||"Option "+suffix).slice(0,70),...costs};
  }
  function total(p,years){return p.price+p.delivery+years*(p.annual+p.maintenance+12*p.subscription);}
  function cell(value){const td=document.createElement("td");td.textContent=value;return td;}
  function row(table,label,a,b){const tr=document.createElement("tr");const th=document.createElement("th");th.scope="row";th.textContent=label;tr.append(th,cell(a),cell(b));table.append(tr);}
  function calculate(){
    const result=$("costResult");result.replaceChildren();
    try{
      const years=Number($("years").value),a=read("A"),b=read("B");
      if(![1,2,3,5,10].includes(years))throw new Error("Select a valid ownership period.");
      const ta=total(a,years),tb=total(b,years);
      const heading=document.createElement("h2");heading.textContent=years+"-year ownership comparison";
      const table=document.createElement("table");const head=document.createElement("tr");
      ["Cost component",a.name,b.name].forEach(label=>{const th=document.createElement("th");th.scope="col";th.textContent=label;head.append(th);});
      table.append(head);
      row(table,"Purchase + delivery",money(a.price+a.delivery),money(b.price+b.delivery));
      row(table,"Annual supplies × "+years,money(a.annual*years),money(b.annual*years));
      row(table,"Monthly subscriptions × "+(years*12),money(a.subscription*years*12),money(b.subscription*years*12));
      row(table,"Annual maintenance × "+years,money(a.maintenance*years),money(b.maintenance*years));
      row(table,"Estimated total",money(ta),money(tb));
      const summary=document.createElement("p");const diff=Math.abs(ta-tb);
      summary.textContent=Math.abs(ta-tb)<0.005?"Both options have the same estimated total cost.":(ta<tb?a.name:b.name)+" has a lower estimated total cost by "+money(diff)+".";
      const caveat=document.createElement("p");caveat.className="cost-note";caveat.textContent="Excludes taxes, inflation, financing, resale value, unexpected repairs and changing prices. Lower cost does not necessarily mean better quality or fit.";
      result.append(heading,table,summary,caveat);
    }catch(error){const p=document.createElement("p");p.setAttribute("role","alert");p.textContent=error.message;result.append(p);}
  }
  $("calculate").addEventListener("click",calculate);
  $("print").addEventListener("click",()=>window.print());
  calculate();
})();