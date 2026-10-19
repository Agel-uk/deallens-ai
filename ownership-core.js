"use strict";
/* Pure, dependency-free calculator shared by browser and Node regression tests. */
(function(root){
  function total(p,years){
    if(![1,2,3,5,10].includes(years))throw new RangeError("Invalid ownership period");
    for(const key of ["price","delivery","annual","subscription","maintenance"]){
      if(!Number.isFinite(p[key])||p[key]<0||p[key]>10000000)throw new RangeError("Invalid cost: "+key);
    }
    const cents=value=>Math.round(value*100);
    const purchase=cents(p.price)+cents(p.delivery);
    const recurring=years*(cents(p.annual)+cents(p.maintenance)+12*cents(p.subscription));
    return (purchase+recurring)/100;
  }
  const api=Object.freeze({total});
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  else root.DealLensOwnership=api;
})(typeof window!=="undefined"?window:{});
