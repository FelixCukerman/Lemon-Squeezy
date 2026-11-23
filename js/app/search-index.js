(function () {
  "use strict";
  const norm = (s) =>
    String(s || "")
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
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
  const collection = db.collection("searchIndex");
  async function load() {
    const manifest = await collection.doc("manifest").get({ source: "server" });
    if (
      !manifest.exists ||
      !Number.isInteger(manifest.data().parts) ||
      manifest.data().parts < 1 ||
      manifest.data().parts > 100
    )
      return null;
    const docs = await Promise.all(
      Array.from({ length: manifest.data().parts }, (_, i) =>
        collection
          .doc((manifest.data().prefix || "part-") + String(i).padStart(3, "0"))
          .get(),
      ),
    );
    if (docs.some((x) => !x.exists || !Array.isArray(x.data().items)))
      return null;
    const base = docs.flatMap((x) => x.data().items);
    // Merge per-recipe change markers. A marker and recipe change are committed atomically.
    // Re-fetching changed recipes avoids trusting user-supplied search-index content.
    // Paginate markers rather than silently abandoning the index after 500 changes.
    // Firestore charges one document read per marker; show the count in the UI.
    const changes = [];
    let last = null;
    const MAX_CHANGES = 5000;
    while (true) {
      let q = db
        .collection("searchIndexChanges")
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limit(250);
      if (last) q = q.startAfter(last);
      const page = await q.get({ source: "server" });
      changes.push(...page.docs);
      if (changes.length > MAX_CHANGES)
        throw Error(
          "Понад 5 000 змін. Адміністратор має перевірити індекс; повний пошук тимчасово недоступний.",
        );
      if (page.size < 250) break;
      last = page.docs[page.docs.length - 1];
    }
    const byId = new Map(base.map((x) => [x.id, x]));
    for (let offset = 0; offset < changes.length; offset += 20) {
      const batch = changes.slice(offset, offset + 20);
      const values = await Promise.all(
        batch.map(async (d) => {
          if (d.data().deleted) return { id: d.id, deleted: true };
          const recipe = await db
            .collection("recipes")
            .doc(d.id)
            .get({ source: "server" });
          return recipe.exists && recipe.data().status === "published"
            ? { id: d.id, item: compact(d.id, recipe.data()) }
            : { id: d.id, deleted: true };
        }),
      );
      values.forEach((v) =>
        v.deleted ? byId.delete(v.id) : byId.set(v.id, v.item),
      );
    }
    const items = [...byId.values()];
    return {
      items,
      complete: !!manifest.data().complete,
      at: Date.now(),
      index: true,
      changes: changes.length,
      revision: manifest.data().revision || "",
    };
  }
  async function assertAdmin() {
    const u = auth.currentUser;
    if (!u) throw Error("Спочатку увійди.");
    const a = await db
      .collection("admins")
      .doc(u.uid)
      .get({ source: "server" });
    if (!a.exists) throw Error("Потрібні права адміністратора.");
  }
  // Cutoff is a server-side timestamp recorded BEFORE reading recipes.
  // Any change after cutoff keeps its marker, even when included in the new snapshot.
  async function rebuild(onProgress, compactMarkers = false) {
    await assertAdmin();
    const control = collection.doc("compactionControl");
    if (onProgress)
      onProgress("Етап 1/4: створення контрольної позначки часу…");
    await control.set({
      cutoff: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const controlSnap = await control.get({ source: "server" });
    const cutoff = controlSnap.data().cutoff;
    if (!cutoff) throw Error("Не вдалося отримати серверний час початку.");
    if (onProgress) onProgress("Етап 2/4: читання рецептів…");
    let items = [],
      cursor = null;
    while (items.length < 5000) {
      let q = db
        .collection("recipes")
        .where("status", "==", "published")
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limit(Math.min(250, 5000 - items.length));
      if (cursor) q = q.startAfter(cursor);
      const snap = await q.get({ source: "server" });
      snap.docs.forEach((d) => items.push(compact(d.id, d.data())));
      if (onProgress) onProgress("Прочитано рецептів: " + items.length);
      if (snap.size < 250) break;
      cursor = snap.docs[snap.docs.length - 1];
    }
    const chunks = [];
    for (let i = 0; i < items.length; i += 80)
      chunks.push(items.slice(i, i + 80));
    if (!chunks.length) chunks.push([]);
    // Unique part IDs avoid overwriting parts used by an older manifest.
    if (onProgress) onProgress("Етап 3/4: запис компактного індексу…");
    const prefix =
      "g" + Date.now() + "-" + Math.floor(Math.random() * 1000000) + "-part-";
    for (let i = 0; i < chunks.length; i++) {
      await collection.doc(prefix + String(i).padStart(3, "0")).set({
        items: chunks[i],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      if (onProgress)
        onProgress(
          "Індексовано: " +
            Math.min((i + 1) * 80, items.length) +
            " / " +
            items.length,
        );
    }
    await collection.doc("manifest").set({
      prefix,
      parts: chunks.length,
      count: items.length,
      complete: items.length < 5000,
      revision: prefix,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    if (!compactMarkers) return { count: items.length, removed: 0 };
    // Each deletion is transactional. If a recipe was edited since the cutoff,
    // its marker has a newer timestamp and cannot be removed.
    if (onProgress) onProgress("Етап 4/4: очищення старих маркерів…");
    let removed = 0,
      last = null;
    while (true) {
      let q = db
        .collection("searchIndexChanges")
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limit(200);
      if (last) q = q.startAfter(last);
      const page = await q.get({ source: "server" });
      if (page.empty) break;
      for (const doc of page.docs) {
        if (doc.data().updatedAt?.toMillis?.() > cutoff.toMillis()) continue;
        const didDelete = await db.runTransaction(async (tx) => {
          const current = await tx.get(doc.ref);
          if (!current.exists) return false;
          const updated = current.data().updatedAt;
          if (!updated || updated.toMillis() > cutoff.toMillis()) return false;
          tx.delete(doc.ref);
          return true;
        });
        if (didDelete) removed++;
      }
      if (onProgress) onProgress("Прибрано старих маркерів: " + removed);
      if (page.size < 200) break;
      last = page.docs[page.docs.length - 1];
    }
    return { count: items.length, removed };
  }
  // All recipe mutations use a Firestore batch to keep index markers consistent.
  function mark(batch, ref, deleted) {
    batch.set(db.collection("searchIndexChanges").doc(ref.id), {
      deleted: !!deleted,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  window.LS_SEARCH_INDEX = { load, rebuild, mark };
})();
