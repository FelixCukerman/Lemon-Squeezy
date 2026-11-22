/* LemonSqueezy v1.9: loading skeletons, accessible empty states and card entrance. */
(function(){
'use strict';
const page=document.body.dataset.page;
const skeleton=()=>'<div class="ls-skeleton-card" aria-hidden="true"><div class="ls-skeleton-image"></div><div class="ls-skeleton-body"><div class="ls-skeleton-line wide"></div><div class="ls-skeleton-line"></div><div class="ls-skeleton-line short"></div></div></div>';
const empty=(icon,title,description,href,label)=>`<div class="ls-empty"><div class="ls-empty-icon" aria-hidden="true">${icon}</div><h3>${title}</h3><p>${description}</p>${href?`<a class="btn" href="${href}">${label} ↗</a>`:''}</div>`;
function skeletons(node,n){if(node){node.setAttribute('aria-busy','true');node.innerHTML=Array.from({length:n},skeleton).join('')}}
const catalog=document.getElementById('cards'),popular=document.getElementById('popularCarousel'),favorites=document.getElementById('favoritesList');
if(page==='home'){skeletons(catalog,3);skeletons(popular,3)}
if(page==='catalog')skeletons(catalog,6);
if(page==='favorites')skeletons(favorites,3);
const watch=new MutationObserver(records=>{
 for(const record of records){
  const target=record.target;
  if(!(target instanceof HTMLElement))continue;
  if(!target.matches('#cards,#popularCarousel,#favoritesList'))continue;
  if(target.querySelector('.ls-skeleton-card'))continue;
  target.removeAttribute('aria-busy');
  const cards=[...target.querySelectorAll('.card')];
  if(cards.length){
   cards.forEach((card,i)=>{
    if(card.dataset.lsAnimated)return;
    card.dataset.lsAnimated='1';
    card.classList.add('ls-card-enter');
    card.style.setProperty('--ls-delay',`${Math.min(i%12,8)*45}ms`);
   });
  }else if(page==='favorites'&&target.id==='favoritesList'&&target.textContent.includes('немає')){
   target.innerHTML=empty('♡','Тут поки порожньо','Зберігай цікаві рецепти, і вони з’являться тут.','recipes.html','Знайти рецепти');
  }else if(page==='catalog'&&target.id==='cards'&&!target.querySelector('.ls-empty')){
   const count=document.getElementById('count')?.textContent||'';
   if(/0 рецепт|не знайдено|нічого/i.test(count)||!target.textContent.trim())target.innerHTML=empty('⌕','Рецептів не знайдено','Спробуй змінити інгредієнти або налаштування фільтрів.','','');
  }else if(page==='home'&&target.id==='cards'&&target.textContent.includes('немає')){
   target.innerHTML=empty('✳','Тут скоро будуть рецепти','Додай перший рецепт до нашої колекції.','create-recipe.html','Додати рецепт');
  }
 }
});
['cards','popularCarousel','favoritesList'].forEach(id=>{const node=document.getElementById(id);if(node)watch.observe(node,{childList:true})});
})();
