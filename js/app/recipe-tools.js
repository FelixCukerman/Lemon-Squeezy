(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  function num(x) {
    return Number.isFinite(Number(x)) ? Math.max(0, Number(x)) : 0;
  }
  function fmt(n) {
    return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(
      n,
    );
  }
  function el(tag, cls, content) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (content !== undefined) n.textContent = content;
    return n;
  }
  function recipeEnhancements() {
    const root = $("recipe");
    if (!root) return;
    const observer = new MutationObserver(() => {
      if (
        !root.querySelector(".recipe-hero") ||
        root.querySelector(".ls-recipe-tools")
      )
        return;
      const toolbar = el("div", "ls-recipe-tools");
      const print = el("button", "ls-print-icon");
      print.type = "button";
      print.setAttribute("aria-label", "Роздрукувати рецепт");
      print.title = "Роздрукувати рецепт";
      print.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/></svg>';
      print.onclick = () => window.print();
      const share = el("button", "ls-print-icon");
      share.type = "button";
      share.setAttribute("aria-label", "Поділитися рецептом");
      share.title = "Поділитися рецептом";
      share.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.2M8.7 13.3l6.6 4.2"/></svg>';
      share.onclick = () => {
        if (typeof openShareModal === "function") openShareModal();
      };
      toolbar.append(share, print);
      const cover = root.querySelector(".recipe-cover");
      cover.append(toolbar);
      const stepsList = root.querySelector("ol.steps");
      if (stepsList) stepsList.id = "recipeSteps";
      const list = $("ingredientList");
      if (list) {
        [...list.children].forEach((li, i) => {
          const label = el("label", "ls-ingredient-check");
          const check = document.createElement("input");
          check.type = "checkbox";
          check.setAttribute(
            "aria-label",
            "Підготовлено: " + li.textContent.trim(),
          );
          const span =
            li.querySelector(".ingredient-label") ||
            el("span", "ingredient-label", li.textContent.trim());
          li.replaceChildren(label);
          label.append(check, span);
          check.addEventListener("change", () => {
            li.classList.toggle("ls-done", check.checked);
            updateProgress();
          });
        });
        function updateProgress() {
          const total = list.children.length,
            done = list.querySelectorAll(
              'input[type="checkbox"]:checked',
            ).length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          const fill = $("ingredientProgressFill"),
            text = $("ingredientProgressText"),
            percent = $("ingredientProgressPercent");
          if (fill) fill.style.width = pct + "%";
          if (text) text.textContent = done + " із " + total + " підготовлено";
          if (percent) percent.textContent = pct + "%";
          const bar = root.querySelector(".ingredient-progress-track");
          if (bar) bar.setAttribute("aria-valuenow", String(done));
          const panel = root.querySelector(".recipe-ingredients-panel");
          if (panel)
            panel.classList.toggle("all-prepared", total > 0 && done === total);
        }
        updateProgress();
      }
      observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }
  async function accountStats() {
    const host = $("lsAuthorStats");
    if (!host) return;
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      host.replaceChildren(el("p", "muted", "Завантажуємо статистику..."));
      try {
        const own = await db
          .collection("recipes")
          .where("authorId", "==", user.uid)
          .where("status", "==", "published")
          .limit(100)
          .get();
        const ids = new Set(own.docs.map((d) => d.id));
        // Bounded queries: no per-recipe fanout. Counts can be incomplete when limits are reached.
        const [views, ratings] = await Promise.all([
          db.collection("recipeViews").limit(500).get(),
          db.collection("ratings").limit(500).get(),
        ]);
        const counters = {};
        ids.forEach(
          (id) => (counters[id] = { views: 0, ratingCount: 0, ratingSum: 0 }),
        );
        views.forEach((d) => {
          if (counters[d.id]) counters[d.id].views = num(d.data().count);
        });
        ratings.forEach((d) => {
          const v = d.data();
          if (
            counters[v.recipeId] &&
            Number.isInteger(v.value) &&
            v.value >= 1 &&
            v.value <= 5
          ) {
            counters[v.recipeId].ratingCount++;
            counters[v.recipeId].ratingSum += v.value;
          }
        });
        const total = Object.values(counters).reduce(
          (a, c) => ({
            views: a.views + c.views,
            ratings: a.ratings + c.ratingCount,
            sum: a.sum + c.ratingSum,
          }),
          { views: 0, ratings: 0, sum: 0 },
        );
        const grid = el("div", "ls-stats-grid");
        for (const [name, value] of [
          ["Опубліковано рецептів", fmt(ids.size)],
          ["Переглядів", fmt(total.views)],
          ["Оцінок", fmt(total.ratings)],
          [
            "Середня оцінка",
            total.ratings ? fmt(total.sum / total.ratings) : "Немає",
          ],
        ]) {
          const card = el("div", "ls-stat");
          card.append(el("strong", "", value), el("span", "", name));
          grid.append(card);
        }
        const table = el("div", "ls-stats-table");
        for (const d of own.docs) {
          const r = d.data(),
            c = counters[d.id];
          const row = el("div", "ls-stat-row");
          const link = el("a", "", r.title || "Рецепт");
          link.href = "recipe.html?id=" + encodeURIComponent(d.id);
          row.append(
            link,
            el(
              "span",
              "",
              fmt(c.views) +
                " перегл. · " +
                (c.ratingCount
                  ? fmt(c.ratingSum / c.ratingCount) +
                    " ★ (" +
                    fmt(c.ratingCount) +
                    ")"
                  : "Без оцінок"),
            ),
          );
          table.append(row);
        }
        host.replaceChildren(
          grid,
          el("h3", "", "Статистика за рецептами"),
          table,
        );
        if (views.size === 500 || ratings.size === 500 || own.size === 100)
          host.append(
            el(
              "p",
              "muted small",
              "Показано приблизну статистику. Через ліміти вибірок деякі перегляди або оцінки можуть не враховуватися.",
            ),
          );
        else
          host.append(
            el(
              "p",
              "muted small",
              "Перегляди приблизні та не захищені від накручування.",
            ),
          );
      } catch (e) {
        host.replaceChildren(
          el("p", "error", "Не вдалося завантажити статистику: " + e.message),
        );
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "recipe") recipeEnhancements();
    if (document.body.dataset.page === "account") accountStats();
  });
})();
