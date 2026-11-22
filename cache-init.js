/* v2.3.36: register static asset cache only on secure origins. */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Offline cache unavailable:', error));
  }, {once:true});
}
