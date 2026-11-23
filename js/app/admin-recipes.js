(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("adminRecipes");
    if (!list) return;
    const ingredients = document.getElementById("moderationList");
    const a = document.getElementById("adminIngredientsTab"),
      b = document.getElementById("adminRecipesTab"),
      status = document.getElementById("adminStatus");
    function tab(recipes) {
      list.hidden = !recipes;
      ingredients.hidden = recipes;
      const more = document.getElementById("adminMoreRecipes");
      if (more) more.style.display = recipes ? "" : "none";
      a.setAttribute("aria-pressed", String(!recipes));
      b.setAttribute("aria-pressed", String(recipes));
    }
    a.onclick = () => tab(false);
    b.onclick = () => {
      tab(true);
      load(true);
    };
    let cursor = null,
      loading = false;
    const more = document.getElementById("adminMoreRecipes");
    if (more) more.onclick = () => load(false);
    async function load(reset = false) {
      if (loading) return;
      loading = true;
      if (more) more.disabled = true;
      if (reset) {
        cursor = null;
        list.textContent = "Завантаження…";
      }
      try {
        const u = auth.currentUser;
        if (!u) {
          list.textContent = "Увійдіть у свій акаунт.";
          return;
        }
        const admin = await db.collection("admins").doc(u.uid).get();
        if (!admin.exists) {
          list.textContent = "Недостатньо прав.";
          return;
        }
        const base = db
          .collection("recipes")
          .where("status", "==", "published")
          .orderBy(firebase.firestore.FieldPath.documentId());
        const query = cursor
          ? base.startAfter(cursor).limit(50)
          : base.limit(50);
        const snap = await query.get();
        if (reset) list.replaceChildren();
        if (snap.empty) {
          if (reset) list.textContent = "Рецептів немає.";
          return;
        }
        cursor = snap.docs[snap.docs.length - 1];
        if (more) more.hidden = snap.size < 50;
        for (const d of snap.docs) {
          const r = d.data(),
            row = document.createElement("div");
          row.className = "panel admin-recipe";
          const desc = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = r.title || "Без назви";
          const meta = document.createElement("p");
          meta.className = "muted small";
          meta.textContent =
            "Автор: " + (r.authorId || "невідомий") + " · ID: " + d.id;
          desc.append(title, meta);
          const actions = document.createElement("div");
          actions.className = "inline";
          const open = document.createElement("a");
          open.className = "btn ghost";
          open.href = "recipe.html?id=" + encodeURIComponent(d.id);
          open.textContent = "Переглянути";
          const del = document.createElement("button");
          del.textContent = "Видалити";
          del.onclick = async () => {
            if (!confirm("Назавжди видалити рецепт «" + r.title + "»?")) return;
            del.disabled = true;
            try {
              const batch = db.batch();
              batch.delete(d.ref);
              window.LS_SEARCH_INDEX.mark(batch, d.ref, true);
              await batch.commit();
              row.remove();
              status.textContent = "Рецепт видалено.";
            } catch (e) {
              status.textContent = "Помилка: " + e.message;
              del.disabled = false;
            }
          };
          actions.append(open, del);
          row.append(desc, actions);
          list.append(row);
        }
      } catch (e) {
        status.textContent = "Помилка завантаження рецептів: " + e.message;
      } finally {
        loading = false;
        if (more) more.disabled = false;
      }
    }
  });
})();
