"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const sandbox={module:{exports:{}}};
vm.runInNewContext(fs.readFileSync(require("node:path").join(__dirname,"../ownership-core.js"),"utf8"),sandbox);
const {total}=sandbox.module.exports;
const base={price:250,delivery:15,annual:20,subscription:5,maintenance:10};
assert.equal(total(base,3),535,"Three-year total");
assert.equal(total({...base,price:0,delivery:0,annual:0,subscription:0,maintenance:0},1),0,"Zero costs");
assert.equal(total({...base,price:0.1,delivery:0.2,annual:0,subscription:0,maintenance:0},1),0.3,"Cent-accurate decimals");
assert.equal(total(base,1),355,"One-year total");
assert.equal(total(base,10),1165,"Ten-year total");
for(const bad of [-1,NaN,Infinity,10000001]){
  assert.throws(()=>total({...base,price:bad},3),/Invalid cost/);
}
assert.throws(()=>total(base,4),/Invalid ownership period/);
assert.throws(()=>total({...base,subscription:undefined},3),/Invalid cost/);
console.log("PASS: ownership cost calculations, decimal accuracy and validation");
