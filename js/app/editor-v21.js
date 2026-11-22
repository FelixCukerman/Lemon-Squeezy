/* LemonSqueezy v2.1. Local-only editor drafts and preview, no Firebase writes. */
(function(){
'use strict';
const form=document.getElementById('recipeForm');if(!form)return;
const edit=document.body.dataset.page==='edit';
const byId=id=>document.getElementById(id);
let key=null,restoring=false,ready=false,saveTimer=0,lastSaved='',initial='';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(id)=>byId(id)?.value||'';
const collect=()=>({
 title:text('title'),description:text('description'),imageUrl:text('imageUrl'),
 time:text('time'),servings:text('servings'),difficulty:text('difficulty'),
 categories:[...byId('categories').querySelectorAll('input:checked')].map(x=>x.value),country:byId('country')?.value||'',dietaryTags:[...(byId('dietaryChecks')?.querySelectorAll('input:checked')||[])].map(x=>x.value),
 ingredients:[...byId('ingredients').children].map(row=>({name:row.querySelector('.ingredient-name')?.value||'',amount:row.querySelector('.ingredient-amount')?.value||'',unit:row.querySelector('.ingredient-unit')?.value||''})),
 steps:[...byId('steps').children].map(row=>({text:row.querySelector('.step-text')?.value||'',imageUrl:row.querySelector('.step-image')?.value||''}))
});
function apply(d){
 restoring=true;
 try{
  ['title','description','imageUrl','time','servings','difficulty'].forEach(id=>{if(byId(id)&&d[id]!==undefined)byId(id).value=d[id]});
  if(byId('country'))byId('country').value=d.country||'';byId('categories').querySelectorAll('input').forEach(x=>x.checked=(d.categories||[]).includes(x.value));byId('dietaryChecks')?.querySelectorAll('input').forEach(x=>x.checked=(d.dietaryTags||[]).includes(x.value));
  if(Array.isArray(d.ingredients)){byId('ingredients').replaceChildren();d.ingredients.forEach(i=>{
   byId('addIngredient').click();const row=byId('ingredients').lastElementChild;
   row.querySelector('.ingredient-name').value=i.name||'';
   row.querySelector('.ingredient-amount').value=i.amount||'';
   const unit=row.querySelector('.ingredient-unit');if(i.unit&&![...unit.options].some(o=>o.value===i.unit)){unit.add(new Option(i.unit,i.unit))}unit.value=i.unit||'';
  });if(!d.ingredients.length)byId('addIngredient').click()}
  if(Array.isArray(d.steps)){byId('steps').replaceChildren();d.steps.forEach(i=>{
   byId('addStep').click();const row=byId('steps').lastElementChild;row.querySelector('.step-text').value=i.text||'';row.querySelector('.step-image').value=i.imageUrl||'';
  });if(!d.steps.length)byId('addStep').click()}
 }finally{restoring=false}
}
const status=document.createElement('p');status.className='ls-draft-status';status.setAttribute('role','status');status.textContent='Чернетка зберігається лише в цьому браузері';
const actions=document.createElement('div');actions.className='ls-editor-actions';
const preview=document.createElement('button');preview.type='button';preview.className='ls-editor-preview';preview.textContent='Попередній перегляд';
const discard=document.createElement('button');discard.type='button';discard.className='ls-editor-discard';discard.textContent='Очистити чернетку';
discard.disabled=true;
actions.append(preview,discard);form.prepend(actions,status);
const overlay=document.createElement('div');overlay.className='ls-preview-overlay';overlay.hidden=true;
overlay.innerHTML='<div class="ls-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="lsPreviewTitle"><div class="ls-preview-top"><strong id="lsPreviewTitle">Попередній перегляд рецепта</strong><button type="button" id="lsPreviewClose" aria-label="Закрити перегляд"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div><div id="lsPreviewBody"></div></div>';
document.body.append(overlay);
const confirmOverlay=document.createElement('div');
confirmOverlay.className='ls-confirm-overlay';confirmOverlay.hidden=true;
confirmOverlay.innerHTML=`<div class="ls-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="lsConfirmTitle" aria-describedby="lsConfirmDescription"><div class="ls-confirm-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4m0 4h.01M10.3 3.86 2.2 18a2 2 0 0 0 1.74 3h16.12a2 2 0 0 0 1.74-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/></svg></div><h2 id="lsConfirmTitle"></h2><p id="lsConfirmDescription"></p><div class="ls-confirm-buttons"><button type="button" class="ls-confirm-cancel" id="lsConfirmCancel">Скасувати</button><button type="button" class="ls-confirm-accept" id="lsConfirmAccept">Підтвердити</button></div></div>`;
document.body.append(confirmOverlay);
let confirmResolve=null,confirmFocus=null;
function closeConfirm(result){if(!confirmResolve)return;const done=confirmResolve;confirmResolve=null;confirmOverlay.hidden=true;document.body.classList.remove('ls-confirm-open');confirmFocus?.focus();done(result)}
function ask({title,description,accept='Продовжити',danger=false}){
 if(confirmResolve)closeConfirm(false);
 confirmFocus=document.activeElement;
 byId('lsConfirmTitle').textContent=title;
 byId('lsConfirmDescription').textContent=description;
 byId('lsConfirmAccept').textContent=accept;
 byId('lsConfirmAccept').classList.toggle('danger',danger);
 confirmOverlay.hidden=false;document.body.classList.add('ls-confirm-open');
 byId('lsConfirmCancel').focus();
 return new Promise(resolve=>{confirmResolve=resolve});
}
byId('lsConfirmCancel').addEventListener('click',()=>closeConfirm(false));
byId('lsConfirmAccept').addEventListener('click',()=>closeConfirm(true));
confirmOverlay.addEventListener('click',e=>{if(e.target===confirmOverlay)closeConfirm(false)});
document.addEventListener('keydown',e=>{
 if(confirmOverlay.hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeConfirm(false)}
 if(e.key==='Tab'){const first=byId('lsConfirmCancel'),last=byId('lsConfirmAccept');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});
// Links inside the site can use a custom dialog; refresh, tab close and browser navigation cannot.
document.addEventListener('click',async e=>{
 const a=e.target.closest?.('a[href]');
 if(!a||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download')||!window.recipeDirty)return;
 let url;try{url=new URL(a.href,location.href)}catch{return}
 if(url.protocol!==location.protocol||url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
 e.preventDefault();
 const ok=await ask({title:'Покинути редактор?',description:'Ти маєш неопубліковані зміни. Локальна чернетка збережеться в цьому браузері.',accept:'Перейти'});
 if(ok){save();window.recipeDirty=false;location.href=url.href}
},true);
let previousFocus=null;
function closePreview(){overlay.hidden=true;document.body.classList.remove('ls-preview-open');previousFocus?.focus()}
function openPreview(){
 const d=collect();previousFocus=document.activeElement;
 const image=/^https:\/\//i.test(d.imageUrl)?`<img class="ls-preview-hero" src="${escape(d.imageUrl)}" alt="" onerror="this.style.display='none'">`:'';
 byId('lsPreviewBody').innerHTML=`<p class="eyebrow">${escape(d.categories.join(' · ')||'Категорія не обрана')}</p><h1>${escape(d.title||'Назва рецепта')}</h1><p>${escape(d.description||'Опис рецепта з’явиться тут.')}</p><div class="ls-preview-facts"><span>◷ ${escape(d.time||'—')} хв</span><span>✦ ${escape(({easy:'Легко',medium:'Середньо',hard:'Складно'})[d.difficulty]||'—')}</span><span>♧ ${escape(d.servings||'—')} порцій</span></div>${image}<div class="ls-preview-columns"><section><h2>Інгредієнти</h2><ul>${d.ingredients.map(i=>`<li>${escape(i.name||'Інгредієнт')} ${escape(i.amount)} ${escape(i.unit)}</li>`).join('')}</ul></section><section><h2>Приготування</h2><ol>${d.steps.map(i=>`<li>${escape(i.text||'Опис кроку')}${/^https:\/\//i.test(i.imageUrl)?`<img src="${escape(i.imageUrl)}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}</li>`).join('')}</ol></section></div>`;
 overlay.hidden=false;document.body.classList.add('ls-preview-open');byId('lsPreviewClose').focus();
}
preview.addEventListener('click',openPreview);
byId('lsPreviewClose').addEventListener('click',closePreview);
overlay.addEventListener('click',e=>{if(e.target===overlay)closePreview()});
document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape')closePreview();if(e.key==='Tab'){const focusable=[...overlay.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')];const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function save(){
 if(!ready||!key||restoring)return;
 const value=JSON.stringify(collect());if(value===lastSaved)return;
 try{localStorage.setItem(key,JSON.stringify({version:1,savedAt:Date.now(),data:JSON.parse(value)}));lastSaved=value;discard.disabled=false;status.textContent='Чернетку збережено о '+new Date().toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'})}
 catch(e){status.textContent='Не вдалося зберегти чернетку. Перевір налаштування браузера.'}
}
function queueSave(){
 if(!ready||restoring)return;
 window.recipeDirty=JSON.stringify(collect())!==initial;
 status.textContent='Зберігаємо чернетку…';
 clearTimeout(saveTimer);saveTimer=setTimeout(save,650);
}
form.addEventListener('input',queueSave);
form.addEventListener('change',queueSave);
// Flush pending edits when switching tabs, navigating, or closing quickly.
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){clearTimeout(saveTimer);save()}});
window.addEventListener('pagehide',()=>{clearTimeout(saveTimer);save()});

const mo=new MutationObserver(()=>{if(ready&&!restoring)queueSave()});
mo.observe(byId('ingredients'),{childList:true});mo.observe(byId('steps'),{childList:true});
window.addEventListener('beforeunload',e=>{if(window.recipeDirty){e.preventDefault();e.returnValue=''}});
function clear(){
 clearTimeout(saveTimer);
 ready=false;
 if(key){try{localStorage.removeItem(key)}catch(e){}}
 lastSaved='';discard.disabled=true;window.recipeDirty=false;status.textContent='Чернетку очищено';
}
window.LS_EDITOR_DRAFT={clear};
discard.onclick=async()=>{
 if(!key||discard.disabled)return;
 const ok=await ask({title:'Очистити чернетку?',description:'Локальна копія рецепта буде видалена. Заповнені поля залишаться без змін.',accept:'Видалити чернетку',danger:true});
 if(ok)clear();
};
async function initialize(user){
 if(ready)return;
 if(edit&&!form.dataset.recipeId)return;
 key='ls-recipe-draft-v21:'+user.uid+':'+(edit?'edit:'+form.dataset.recipeId:'create');
 initial=JSON.stringify(collect());ready=true;
 let record=null;
 try{record=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
 discard.disabled=!(record?.version===1&&record.data&&record.savedAt);
 if(record?.version===1&&record.data&&record.savedAt){
  const stamp=new Date(record.savedAt).toLocaleString('uk-UA');
  if(await ask({title:'Відновити чернетку?',description:'Знайдено локальну чернетку від '+stamp+'. Відновлення замінить дані у формі.',accept:'Відновити'})){
   apply(record.data);window.recipeDirty=JSON.stringify(collect())!==initial;status.textContent='Чернетку відновлено';
  }else{try{localStorage.removeItem(key)}catch(e){} discard.disabled=true;status.textContent='Чернетку відхилено'}
 }
 lastSaved=JSON.stringify(collect());
}
auth.onAuthStateChanged(user=>{
 if(!user)return;
 if(!edit){setTimeout(()=>initialize(user),0);return}
 let attempts=0;
 const wait=()=>{if(form.dataset.recipeId){initialize(user);return}if(++attempts<80)setTimeout(wait,150)};
 wait();
});
})();
