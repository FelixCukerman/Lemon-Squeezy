/* v2.3.20: Keep the real submit button inside its form. No proxy buttons. */
(() => {
  function init() {
    const form = document.getElementById('recipeForm');
    const submit = form?.querySelector('#submit');
    if (!form || !submit) return;
    const label = submit.textContent.trim() || 'Зберегти рецепт';
    submit.classList.add('ls-save-fab');
    submit.setAttribute('aria-label', label);
    submit.setAttribute('title', label);
    submit.innerHTML = '<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>';
    document.body.classList.add('ls-save-fab-ready');
    submit.addEventListener('click', () => {
      submit.classList.remove('ls-save-pulse');
      void submit.offsetWidth;
      submit.classList.add('ls-save-pulse');
    });
    submit.addEventListener('animationend', () => submit.classList.remove('ls-save-pulse'));
    // A small motion accent during page scrolling, without an extra control.
    let lastY = window.scrollY;
    let lastMotion = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 18) return;
      lastY = y;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const now = performance.now();
      if (now - lastMotion < 850) return;
      lastMotion = now;
      submit.classList.remove('ls-save-scrolling');
      void submit.offsetWidth;
      submit.classList.add('ls-save-scrolling');
    }, {passive:true});
    submit.addEventListener('animationend', () => submit.classList.remove('ls-save-scrolling'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
