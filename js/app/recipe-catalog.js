// Important: without a server-maintained search index, full-text/AND search across 5k
// documents requires reading those documents at least once per cache lifetime.
(function () {
  "use strict";
  const PAGE = 12,
    BATCH = 250,
    MAX = 5000,
    TTL = 10 * 60 * 1000,
    CACHE_KEY = "ls-catalog-v1-cache";
  const $ = (id) => document.getElementById(id);
  const norm = (s) =>
    String(s || "")
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  const token = (s) =>
    String(s || "")
      .split(",")
      .map(norm)
      .filter(Boolean);
  const compact = (id, r) => ({
    id,
    title: r.title || "",
    imageUrl: r.imageUrl || "",
    categoryIds: r.categoryIds || [],
    country: r.country || "",
    dietaryTags: r.dietaryTags || [],
    difficulty: r.difficulty || "",
    totalTimeMinutes: r.totalTimeMinutes || 0,
    ingredients: (r.ingredients || []).map((i) =>
      typeof i === "string" ? i : i.name || "",
    ),
    createdAtMs: r.createdAt?.toMillis?.() || 0,
  });
  const dateValue = (r) => r.createdAtMs || 0;
  function readCache() {
    try {
      const o = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      return o &&
        Date.now() - o.at < TTL &&
        Array.isArray(o.items) &&
        o.items.length <= MAX
        ? o
        : null;
    } catch (_) {
      return null;
    }
  }
  function writeCache(items, complete) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ at: Date.now(), items, complete }),
      );
    } catch (_) {
      /* quota or file:// policy */
    }
  }
  async function init() {
    const params = new URLSearchParams(location.search);
    const els = {
      q: $("q"),
      include: $("include"),
      exclude: $("exclude"),
      difficulty: $("difficulty"),
      maxTime: $("maxTime"),
      sort: $("sort"),
      country: $("countryFilter"),
      categories: $("categoryChecks"),
    };
    const selected = new Set(),
      selectedDiet = new Set();
    let items = [],
      cursor = null,
      complete = false,
      busy = false,
      currentPage = Math.max(1, parseInt(params.get("page"), 10) || 1),
      signature = "";
    const note = $("catalogNote"),
      more = $("loadMoreRecipes"),
      allButton = $("loadAllRecipes");
    const keys = [
      "q",
      "include",
      "exclude",
      "difficulty",
      "maxTime",
      "sort",
      "country",
    ];
    keys.forEach((k) => {
      if (params.has(k)) els[k].value = params.get(k);
    });
    if (!["newest", "popular", "timeAsc", "timeDesc"].includes(els.sort.value))
      els.sort.value = "newest";
    (params.get("categories") || "")
      .split("|")
      .filter((c) => categories.includes(c))
      .forEach((c) => selected.add(c));
    Object.entries(window.LS_DIETARY || {}).forEach(([id, name]) => {
      const label = document.createElement("label");
      label.className = "dietary-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = id;
      input.onchange = () => {
        input.checked ? selectedDiet.add(id) : selectedDiet.delete(id);
        update();
      };
      label.append(input, document.createTextNode(name));
      $("dietaryFilterChecks")?.append(label);
    });
    (params.get("dietary") || "")
      .split("|")
      .filter((x) => window.LS_DIETARY?.[x])
      .forEach((x) => selectedDiet.add(x));
    $("dietaryFilterChecks")
      ?.querySelectorAll("input")
      .forEach((i) => (i.checked = selectedDiet.has(i.value)));
    categories.forEach((name, i) => {
      const label = document.createElement("label");
      label.className = "category-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = name;
      input.id = "cat-" + i;
      input.checked = selected.has(name);
      input.onchange = () => {
        input.checked ? selected.add(name) : selected.delete(name);
        update();
      };
      label.append(input, document.createTextNode(name));
      els.categories.append(label);
    });
    const sig = () =>
      [
        ...keys.map((k) => els[k].value),
        [...selected].sort().join("|"),
        [...selectedDiet].sort().join("|"),
      ].join("::");
    function render() {
      // Country options are static so the styled dropdown remains in sync with the catalog.

      const q = norm(els.q.value),
        inc = token(els.include.value),
        exc = token(els.exclude.value),
        diff = els.difficulty.value,
        maxTime = Number(els.maxTime.value) || Infinity;
      const results = items.filter((r) => {
        if (q && !norm(r.title).includes(q)) return false;
        if (selected.size && !r.categoryIds.some((c) => selected.has(c)))
          return false;
        if (els.country.value && r.country !== els.country.value) return false;
        if (diff && r.difficulty !== diff) return false;
        if (![...selectedDiet].every((t) => (r.dietaryTags || []).includes(t)))
          return false;
        if ((Number(r.totalTimeMinutes) || Infinity) > maxTime) return false;
        const names = r.ingredients.map(norm);
        if (!inc.every((t) => names.some((n) => n.includes(t)))) return false;
        if (exc.some((t) => names.some((n) => n.includes(t)))) return false;
        return true;
      });
      const popularity = (r) => Number(window.LS_METRICS?.scores?.[r.id] || 0);
      results.sort((a, b) =>
        els.sort.value === "timeAsc"
          ? Number(a.totalTimeMinutes) - Number(b.totalTimeMinutes) ||
            dateValue(b) - dateValue(a)
          : els.sort.value === "timeDesc"
            ? Number(b.totalTimeMinutes) - Number(a.totalTimeMinutes) ||
              dateValue(b) - dateValue(a)
            : els.sort.value === "popular"
              ? popularity(b) - popularity(a) || dateValue(b) - dateValue(a)
              : dateValue(b) - dateValue(a),
      );
      const pages = Math.max(1, Math.ceil(results.length / PAGE));
      currentPage = Math.min(Math.max(1, currentPage), pages);
      $("count").textContent =
        (complete ? "Знайдено " : "Знайдено серед завантажених ") +
        results.length +
        " рецептів";
      $("cards").innerHTML = results.length
        ? results
            .slice((currentPage - 1) * PAGE, currentPage * PAGE)
            .map(renderCard)
            .join("")
        : '<div class="empty-results"><h3>Поки нічого не знайдено</h3><p>Спробуй змінити фільтри або завантажити решту каталогу.</p></div>';
      const nav = $("pagination");
      nav.replaceChildren();
      if (pages > 1) {
        const button = (label, page, disabled = false, active = false) => {
          const el = document.createElement("button");
          el.type = "button";
          el.textContent = label;
          el.disabled = disabled || active;
          el.className = "page-button" + (active ? " active" : "");
          if (active) el.setAttribute("aria-current", "page");
          el.onclick = () => {
            currentPage = page;
            render();
            document
              .querySelector(".catalog-heading")
              .scrollIntoView({ behavior: "smooth" });
          };
          nav.append(el);
        };
        button("‹", currentPage - 1, currentPage === 1);
        const nums = new Set(
          [1, pages, currentPage - 1, currentPage, currentPage + 1].filter(
            (n) => n >= 1 && n <= pages,
          ),
        );
        let prev = 0;
        [...nums]
          .sort((a, b) => a - b)
          .forEach((n) => {
            if (n - prev > 1) {
              const dots = document.createElement("span");
              dots.textContent = "…";
              dots.className = "page-ellipsis";
              nav.append(dots);
            }
            button(String(n), n, false, n === currentPage);
            prev = n;
          });
        button("›", currentPage + 1, currentPage === pages);
      }
      const url = new URL(location.href);
      keys.forEach((k) => {
        const v = els[k].value;
        if (v && (k !== "sort" || v !== "newest")) url.searchParams.set(k, v);
        else url.searchParams.delete(k);
      });
      if (selectedDiet.size)
        url.searchParams.set("dietary", [...selectedDiet].join("|"));
      else url.searchParams.delete("dietary");
      if (selected.size)
        url.searchParams.set("categories", [...selected].join("|"));
      else url.searchParams.delete("categories");
      if (currentPage > 1) url.searchParams.set("page", String(currentPage));
      else url.searchParams.delete("page");
      history.replaceState(null, "", url.href);
      more.hidden =
        !!note.dataset.index || busy || complete || items.length >= MAX;
      allButton.hidden =
        !!note.dataset.index || busy || complete || items.length >= MAX;
      note.textContent = note.dataset.index
        ? "Пошук за компактним індексом з автоматичним урахуванням змін. " +
          (note.dataset.changes || "0") +
          " записів змін (загалом)."
        : busy
          ? "Завантажуємо…"
          : complete
            ? "Пошук охоплює весь доступний каталог. Дані кешуються в цій вкладці до 10 хвилин."
            : items.length >= MAX
              ? "Досягнуто межі 5 000 рецептів. Пошук може бути неповним."
              : "Зараз завантажено " +
                items.length +
                " рецептів. Пошук і кількість результатів поки неповні. Натисни «Шукати в усьому каталозі» для повного пошуку (це витрачає читання Firestore).";
    }
    function update() {
      const next = sig();
      if (next !== signature) currentPage = 1;
      signature = next;
      render();
    }
    keys.forEach((k) =>
      els[k].addEventListener(
        k === "q" || k === "include" || k === "exclude" ? "input" : "change",
        () => {
          update();
          if (k === "sort" && els.sort.value === "popular") loadPopularity();
        },
      ),
    );
    $("resetFilters").onclick = () => {
      keys.forEach((k) => (els[k].value = k === "sort" ? "newest" : ""));
      selected.clear();
      selectedDiet.clear();
      $("dietaryFilterChecks")
        ?.querySelectorAll("input")
        .forEach((i) => (i.checked = false));
      els.categories
        .querySelectorAll("input")
        .forEach((i) => (i.checked = false));
      update();
    };
    $("toggleFilters").onclick = () => {
      const opened = $("filterPanel").classList.toggle("open");
      $("toggleFilters").setAttribute("aria-expanded", String(opened));
    };
    async function loadPopularity() {
      if (window.LS_METRICS)
        try {
          await window.LS_METRICS.loadPopularity(items);
          render();
        } catch (e) {
          console.warn("Popularity:", e);
        }
    }
    async function fetchNext() {
      if (busy || complete || items.length >= MAX) return;
      busy = true;
      render();
      try {
        let query = db
          .collection("recipes")
          .where("status", "==", "published")
          .orderBy(firebase.firestore.FieldPath.documentId())
          .limit(Math.min(BATCH, MAX - items.length));
        if (cursor) query = query.startAfter(cursor);
        else if (items.length) {
          // Cache contains only compact fields, resume by last document ID.
          query = query.startAfter(items[items.length - 1].id);
        }
        const snapshot = await query.get();
        const seen = new Set(items.map((r) => r.id));
        snapshot.docs.forEach((d) => {
          if (!seen.has(d.id)) {
            items.push(compact(d.id, d.data()));
            seen.add(d.id);
          }
        });
        if (snapshot.docs.length)
          cursor = snapshot.docs[snapshot.docs.length - 1];
        if (snapshot.size < BATCH) complete = true;
        writeCache(items, complete);
      } catch (e) {
        status("Не вдалося завантажити каталог: " + e.message, true);
      } finally {
        busy = false;
        render();
      }
    }
    more.onclick = fetchNext;
    allButton.onclick = async () => {
      allButton.disabled = true;
      more.disabled = true;
      try {
        while (!complete && items.length < MAX) {
          const before = items.length;
          await fetchNext();
          if (items.length === before) break;
        }
        if (els.sort.value === "popular") await loadPopularity();
      } finally {
        allButton.disabled = false;
        more.disabled = false;
      }
    };
    let index = null;
    try {
      index = await window.LS_SEARCH_INDEX.load();
    } catch (e) {
      console.warn("Пошуковий індекс недоступний, резервний режим:", e);
    }
    const cache = index ? null : readCache();
    if (index) {
      items = index.items;
      complete = index.complete;
      note.dataset.index = "1";
      note.dataset.changes = String(index.changes || 0);
    } else if (cache) {
      items = cache.items;
      complete = cache.complete;
    }
    signature = sig();
    if (items.length) {
      render();
      if (els.sort.value === "popular") loadPopularity();
    } else await fetchNext();
  }
  window.LS_CATALOG = { init };
})();
