/* UI-only progressive enhancements. No Firebase reads/writes. */
(()=>{'use strict';
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function animateIn(node){if(reduce||!node.animate)return;node.animate([{opacity:0,transform:'translateY(10px) scale(.99)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});}
 function animateOut(node,done){if(reduce||!node.animate){done();return;}const a=node.animate([{opacity:1,transform:'translateY(0)',height:node.offsetHeight+'px'},{opacity:0,transform:'translateY(-8px)',height:'0px',marginTop:'0px',marginBottom:'0px',paddingTop:'0px',paddingBottom:'0px'}],{duration:240,easing:'ease-in-out'});a.onfinish=done;a.oncancel=done;}
 document.addEventListener('DOMContentLoaded',()=>{
  const page=document.body.dataset.page;
  if(page==='create'||page==='edit'){
   const parent=document.getElementById('recipeForm');
   if(parent){parent.addEventListener('click',e=>{
    const add=e.target.closest('#addIngredient,#addStep');
    if(add){const target=document.getElementById(add.id==='addIngredient'?'ingredients':'steps');requestAnimationFrame(()=>{if(target&&target.lastElementChild)animateIn(target.lastElementChild)});}
    const remove=e.target.closest('.remove');if(remove){const row=remove.closest('.ingredient-row,.step-row');if(row){e.stopPropagation();e.preventDefault();animateOut(row,()=>row.remove());}}
   },true);}
   const steps=document.getElementById('steps');
   if(steps){const renumber=()=>steps.querySelectorAll('.step-row').forEach((row,i)=>{row.style.setProperty('--step-number',JSON.stringify(String(i+1).padStart(2,'0')))});new MutationObserver(renumber).observe(steps,{childList:true});renumber();}
   const form=document.getElementById('recipeForm');if(form){form.addEventListener('submit',()=>{const btn=document.getElementById('submit');if(btn){btn.classList.add('is-submitting');setTimeout(()=>btn.classList.remove('is-submitting'),1800);}});}
  }
  const adminTabs=document.querySelectorAll('#adminIngredientsTab,#adminRecipesTab');
  adminTabs.forEach(tab=>tab.addEventListener('click',()=>{adminTabs.forEach(t=>t.classList.toggle('ui-tab-active',t===tab));}));
  const statusEls=document.querySelectorAll('[role="status"]');
  const observer=new MutationObserver(mutations=>{for(const m of mutations){const target=m.target.nodeType===1?m.target:m.target.parentElement;if(target&&target.matches&&target.matches('[role="status"]')&&target.textContent.trim())target.classList.add('ui-status-visible');}});
  statusEls.forEach(el=>observer.observe(el,{childList:true,characterData:true,subtree:true}));
 });
})();
