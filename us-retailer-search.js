"use strict";
/* Use only the configured US Associates tag; no guessed IDs or price claims. */
(function(){
  const form=document.getElementById("usSearch");
  if(!form)return;
  form.addEventListener("submit",function(){
    const tags=window.DEALLENS_AFFILIATE_TAGS||{};
    const tag=typeof tags.US==="string"?tags.US.trim():"";
    let field=form.querySelector('input[name="tag"]');
    if(!tag){if(field)field.remove();return;}
    if(!field){field=document.createElement("input");field.type="hidden";field.name="tag";form.appendChild(field);}
    field.value=tag;
  });
})();
