# LemonSqueezy

Статичний сайт для GitHub Pages. Точка входу: `index.html`.

- `css/` — стилі сайту.
- `js/app/` — власні JavaScript-модулі (без зміни порядку підключення).
- `js/config/` — конфігурація Firebase.
- `js/data/` — демодані, довідники та мапінги зображень.
- `assets/images/` — зображення та SVG-ілюстрації.
- `*.html` у корені — сторінки сайту зі збереженими URL.
- `sw.js`, `cache-init.js` — service worker та його реєстрація.
- `firestore.rules` — правила безпеки Firestore для розгортання окремо.

Firebase SDK та іконки Lucide, які підключені через CDN, не копіюються до репозиторію.
