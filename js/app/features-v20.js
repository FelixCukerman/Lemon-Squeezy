/* LemonSqueezy v2.0: recipe cooking checklist, link sharing and favorites management. */
(function(){
'use strict';
const page=document.body.dataset.page;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(message){
 let el=document.getElementById('lsActionToast');
 if(!el){el=document.createElement('div');el.id='lsActionToast';el.className='ls-action-toast';el.setAttribute('role','status');document.body.append(el)}
 el.textContent=message;el.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove('visible'),2600);
}
function openShareModal(){
 const existing=document.getElementById('lsShareOverlay');
 if(existing){existing.querySelector('.ls-share-field')?.focus();return}
 const url=location.href;
 const local=location.protocol==='file:';
 const overlay=document.createElement('div');overlay.id='lsShareOverlay';overlay.className='ls-share-overlay';
 overlay.innerHTML=`<section class="ls-share-modal" role="dialog" aria-modal="true" aria-labelledby="lsShareTitle" aria-describedby="lsShareDescription">
  <button type="button" class="ls-share-close" aria-label="Закрити">×</button>
  <div class="ls-share-symbol" aria-hidden="true">↗</div>
  <h2 id="lsShareTitle">Поділитися рецептом</h2>
  <p id="lsShareDescription">Скопіюй посилання та надішли його друзям.</p>
  ${local?'<p class="ls-share-warning">Зараз сайт відкрито з комп’ютера. Це посилання працюватиме лише на твоєму пристрої. Для поширення опублікуй сайт на GitHub Pages.</p>':''}
  <label for="lsShareUrl">Посилання на рецепт</label>
  <div class="ls-share-url-row"><input id="lsShareUrl" class="ls-share-field" type="text" readonly aria-label="Посилання на рецепт"><button type="button" class="ls-share-copy">Копіювати</button></div>
  <p class="ls-share-feedback" role="status" aria-live="polite"></p>
 </section>`;
 document.body.append(overlay);
 const field=overlay.querySelector('.ls-share-field');field.value=url;
 const copy=overlay.querySelector('.ls-share-copy'),feedback=overlay.querySelector('.ls-share-feedback');
 const oldFocus=document.activeElement;
 function close(){document.removeEventListener('keydown',onKey);overlay.remove();document.body.classList.remove('ls-share-open');oldFocus?.focus?.()}
 function onKey(e){if(e.key==='Escape'){e.preventDefault();close()}
  if(e.key==='Tab'){const controls=[overlay.querySelector('.ls-share-close'),field,copy];const i=controls.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();controls.at(-1).focus()}else if(!e.shiftKey&&i===controls.length-1){e.preventDefault();controls[0].focus()}}
 }
 overlay.querySelector('.ls-share-close').addEventListener('click',close);
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',onKey);
 copy.addEventListener('click',async()=>{
  // No navigator.share: avoids invoking the native share sheet in Opera.
  let success=false;
  try{if(navigator.clipboard?.writeText&&window.isSecureContext){await navigator.clipboard.writeText(url);success=true}}catch(e){}
  if(!success){field.focus();field.select();try{success=document.execCommand('copy')}catch(e){}}
  if(success){feedback.textContent='Посилання скопійовано';copy.textContent='Скопійовано ✓';notify('Посилання скопійовано')}
  else{field.focus();field.select();feedback.textContent='Автоматичне копіювання недоступне. Натисни Ctrl + C, щоб скопіювати виділене посилання.'}
 });
 document.body.classList.add('ls-share-open');overlay.querySelector('.ls-share-close').focus();
}
function recipeFeatures(){
 const root=document.getElementById('recipe');if(!root)return;
 let applied=false;
 const observer=new MutationObserver(()=>{
  if(applied||!root.querySelector('.recipe-heading,.recipe-steps-panel'))return;
  applied=true;observer.disconnect();
  const panel=root.querySelector('.recipe-steps-panel'),list=panel?.querySelector('ol.steps');
  if(!panel||!list||!list.children.length)return;
  const title=panel.querySelector('h2');
  const info=document.createElement('div');info.className='ls-cooking-progress';info.innerHTML='<div class="ls-cooking-progress-copy"><span>Прогрес приготування</span><strong id="lsCookingCount">0%</strong></div><div class="ls-cooking-track"><span id="lsCookingFill"></span></div>';
  title?.insertAdjacentElement('afterend',info);
  const steps=[...list.children];
  function update(){const done=steps.filter(li=>li.classList.contains('ls-step-done')).length;document.getElementById('lsCookingCount').textContent=`${done} із ${steps.length}`;document.getElementById('lsCookingFill').style.width=(done/steps.length*100)+'%';if(done===steps.length)notify('Усі кроки виконано. Смачного!')}
  steps.forEach((li,i)=>{
   const label=document.createElement('label');label.className='ls-step-check';label.innerHTML=`<input type="checkbox" aria-label="Крок ${i+1} виконано"><span class="ls-step-indicator" aria-hidden="true">✓</span><span class="ls-step-label">Готово</span>`;
   const checkbox=label.querySelector('input');
   checkbox.addEventListener('change',()=>{li.classList.toggle('ls-step-done',checkbox.checked);update()});
   li.append(label);
  });
  const reset=document.createElement('button');reset.type='button';reset.className='ls-reset-steps';reset.textContent='Скинути прогрес';
  reset.onclick=()=>{steps.forEach(li=>{li.classList.remove('ls-step-done');li.querySelector('.ls-step-check input').checked=false});update()};
  panel.append(reset);update();
 });
 observer.observe(root,{childList:true,subtree:true});
}
function favoritesFeatures(){
 const host=document.getElementById('favoritesList');if(!host)return;
 let user=null,busy=false;
 if(typeof auth!=='undefined')auth.onAuthStateChanged(u=>{user=u});
 const observer=new MutationObserver(()=>{
  if(busy)return;
  busy=true;
  try{
   host.querySelectorAll('a.card:not([data-ls-favorite])').forEach(card=>{
    card.dataset.lsFavorite='1';
    const url=new URL(card.href,location.href),id=url.searchParams.get('id');if(!id)return;
    const wrap=document.createElement('div');wrap.className='ls-favorite-card';
    card.parentNode.insertBefore(wrap,card);wrap.append(card);
    const remove=document.createElement('button');remove.type='button';remove.className='ls-remove-favorite';remove.textContent='♥ Прибрати з вибраного';remove.setAttribute('aria-label','Прибрати рецепт із вибраного');
    remove.onclick=async()=>{
     if(!user){notify('Увійди, щоб керувати вибраним');return}
     if(remove.disabled)return;
     remove.disabled=true;remove.textContent='Видаляємо…';
     try{await db.collection('favorites').doc(user.uid+'_'+id).delete();wrap.remove();notify('Рецепт прибрано з вибраного');
      if(!host.querySelector('.ls-favorite-card'))host.innerHTML='<div class="ls-empty"><div class="ls-empty-icon" aria-hidden="true">♡</div><h3>Тут поки порожньо</h3><p>Зберігай цікаві рецепти, і вони з’являться тут.</p><a class="btn" href="recipes.html">Знайти рецепти ↗</a></div>';
     }catch(e){remove.disabled=false;remove.textContent='♥ Прибрати з вибраного';notify('Не вдалося видалити рецепт')}
    };
    wrap.append(remove);
   });
  }finally{busy=false}
 });
 observer.observe(host,{childList:true,subtree:true});
}
if(page==='recipe')recipeFeatures();
if(page==='favorites')favoritesFeatures();
})();
