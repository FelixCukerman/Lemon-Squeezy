(function () {
  "use strict";
  const scores = Object.create(null);
  async function recordView(id) {
    if (!id) return;
    const key = "ls-view-v08:" + id;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch (_) {}
    try {
      const ref = db.collection("recipeViews").doc(id);
      await db.runTransaction(async (tx) => {
        const doc = await tx.get(ref);
        if (doc.exists)
          tx.update(ref, { count: firebase.firestore.FieldValue.increment(1) });
        else tx.set(ref, { count: 1 });
      });
      try {
        sessionStorage.setItem(key, "1");
      } catch (_) {}
    } catch (e) {
      console.warn("Не вдалося врахувати перегляд:", e);
    }
  }
  async function loadPopularity(recipes) {
    // Two bounded public queries; no one-query-per-recipe N+1 cost.
    const ids = new Set(recipes.map((r) => r.id));
    const [views, ratings] = await Promise.all([
      db.collection("recipeViews").limit(500).get(),
      db.collection("ratings").limit(500).get(),
    ]);
    for (const r of recipes) scores[r.id] = 0;
    views.docs.forEach((d) => {
      if (ids.has(d.id))
        scores[d.id] =
          (scores[d.id] || 0) + Math.max(0, Number(d.data().count) || 0);
    });
    const groups = Object.create(null);
    ratings.docs.forEach((d) => {
      const v = d.data();
      if (!ids.has(v.recipeId)) return;
      const g = groups[v.recipeId] || (groups[v.recipeId] = { n: 0, sum: 0 });
      g.n++;
      g.sum += Number(v.value) || 0;
    });
    Object.entries(groups).forEach(([id, g]) => {
      scores[id] = (scores[id] || 0) + g.n * 3 + (g.sum / g.n) * 2;
    });
  }
  window.LS_METRICS = { scores, recordView, loadPopularity };
})();
