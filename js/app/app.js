"use strict";
const $ = (id) => document.getElementById(id);
const qs = new URLSearchParams(location.search);
const categories = [
  "Сніданки",
  "Закуски",
  "Салати",
  "Супи",
  "Основні страви",
  "Гарніри",
  "Соуси та заправки",
  "Випічка",
  "Десерти",
  "Напої",
  "Консервація",
  "Хліб і тісто",
];
const difficulties = { easy: "Легко", medium: "Середньо", hard: "Складно" };
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const status = (message, error = false) => {
  const e = $("status");
  if (e) {
    e.textContent = message;
    e.className = "status " + (error ? "error" : "success");
  }
};
const fail = (e) => {
  console.error(e);
  const messages = {
    "permission-denied":
      "Немає дозволу на цю дію. Перевір авторизацію та актуальність Firestore Rules.",
    unavailable:
      "Не вдалося зв’язатися з Firebase. Перевір інтернет і повтори спробу.",
    "resource-exhausted": "Досягнуто ліміту Firebase. Спробуй пізніше.",
    unauthenticated: "Потрібно увійти в акаунт.",
  };
  status(messages[e?.code] || e?.message || String(e), true);
};
const normalize = (s) =>
  String(s || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
function go(file) {
  location.href = file;
}
function cardIcon(type) {
  const paths = {
    time: '<path d="M5 22h14M5 2h14M17 2v4.172a2 2 0 0 1-.586 1.414L12 12l-4.414-4.414A2 2 0 0 1 7 6.172V2M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414 4.414A2 2 0 0 1 17 17.828V22"/>',
    difficulty:
      '<path d="M8.5 14.5A6 6 0 0 1 18 19H6a6 6 0 0 1 2.5-4.5Z"/><path d="M12 3c0 3-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-1-3s-1 2-2 2c0-3 1-5-1-8Z"/>',
    category:
      '<path d="M6 8h12l1 11H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M3 19h18"/>',
  };
  return `<svg class="card-meta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]}</svg>`;
}

const countryCodes = {
  Україна: "UA",
  Італія: "IT",
  Франція: "FR",
  Іспанія: "ES",
  Греція: "GR",
  Грузія: "GE",
  Туреччина: "TR",
  Польща: "PL",
  Німеччина: "DE",
  "Велика Британія": "GB",
  США: "US",
  Мексика: "MX",
  Японія: "JP",
  Китай: "CN",
  "Південна Корея": "KR",
  Таїланд: "TH",
  Вʼєтнам: "VN",
  Індія: "IN",
  Португалія: "PT",
  Австрія: "AT",
  Швейцарія: "CH",
  Швеція: "SE",
  Норвегія: "NO",
  Данія: "DK",
  Нідерланди: "NL",
  Бельгія: "BE",
  Чехія: "CZ",
  Угорщина: "HU",
  Румунія: "RO",
  Болгарія: "BG",
  Хорватія: "HR",
  Сербія: "RS",
  Ізраїль: "IL",
  Ліван: "LB",
  Марокко: "MA",
  Єгипет: "EG",
  Туніс: "TN",
  Індонезія: "ID",
  Малайзія: "MY",
  Сінгапур: "SG",
  Філіппіни: "PH",
  Бразилія: "BR",
  Аргентина: "AR",
  Перу: "PE",
  Канада: "CA",
  Австралія: "AU",
  "Нова Зеландія": "NZ",
};
function countryFlag(name) {
  const code = countryCodes[name];
  return code
    ? String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
    : "";
}
function photoFor(r) {
  return r.imageUrl || window.LS_VERIFIED_PHOTOS?.[r.id]?.url || "";
}
function renderCard(r) {
  return `<a class="card" href="recipe.html?id=${encodeURIComponent(r.id)}"><div class="card-photo">${photoFor(r) ? `<img src="${esc(photoFor(r))}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">` : `<img src="${esc(window.LS_RECIPE_ART?.[r.id] || "")}" alt="Ілюстративна картка: ${esc(r.title)}" loading="lazy">`}${countryCodes[r.country] ? `<span class="card-country-flag" title="${esc(r.country)}"><img src="https://flagcdn.com/w80/${countryCodes[r.country].toLowerCase()}.png" alt="Прапор: ${esc(r.country)}" loading="lazy" onerror="this.parentElement.hidden=true"></span>` : ""}</div><div class="card-body"><h3>${esc(r.title)}</h3><div class="meta"><span class="card-meta-item">${cardIcon("time")}<span>${Number(r.totalTimeMinutes) || 0} хв</span></span><span class="card-meta-item">${cardIcon("difficulty")}<span>${esc(difficulties[r.difficulty] || "")}</span></span><span class="card-meta-item">${cardIcon("category")}<span>${esc((r.categoryIds || []).join(", "))}</span></span></div></div></a>`;
}
async function published(limit = 120) {
  const s = await db
    .collection("recipes")
    .where("status", "==", "published")
    .limit(limit)
    .get();
  return s.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0),
    );
}
function initNav() {
  auth.onAuthStateChanged((user) => {
    const link = $("accountLink");
    if (link) link.textContent = user ? "Мій акаунт" : "Увійти";
    const create = $("createLink");
    if (create) create.hidden = !user;
  });
}
async function home() {
  try {
    const r = await published(120);
    $("cards").innerHTML = r.length
      ? r.slice(0, 6).map(renderCard).join("")
      : '<p class="muted">Рецептів поки немає. Стань першим автором!</p>';
    const track = $("popularCarousel"),
      prev = $("popularPrev"),
      next = $("popularNext"),
      note = $("popularStatus");
    if (!track) return;
    if (!r.length) {
      track.innerHTML =
        '<p class="muted">Популярні рецепти з’являться після публікації.</p>';
      return;
    }
    try {
      await window.LS_METRICS.loadPopularity(r);
      const scores = window.LS_METRICS.scores;
      const ranked = [...r].sort(
        (a, b) =>
          (Number(scores[b.id]) || 0) - (Number(scores[a.id]) || 0) ||
          (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0),
      );
      const hasActivity = ranked.some((x) => Number(scores[x.id]) > 0);
      const chosen = ranked.slice(0, 12);
      track.innerHTML = chosen.map(renderCard).join("");
      if (!hasActivity)
        note.textContent =
          "Поки що немає переглядів або оцінок, тому показуємо нові рецепти.";
      else
        note.textContent =
          "Популярність враховує перегляди та оцінки. Рейтинг приблизний.";
    } catch (e) {
      console.warn("Не вдалося завантажити популярність:", e);
      track.innerHTML = r.slice(0, 12).map(renderCard).join("");
      note.textContent =
        "Дані популярності тимчасово недоступні. Показуємо нові рецепти.";
    }
    const originals = [...track.children].filter((el) =>
      el.classList.contains("card"),
    );
    if (originals.length > 1) {
      const before = originals.map((el) => el.cloneNode(true));
      const after = originals.map((el) => el.cloneNode(true));
      before.forEach((el) => {
        el.classList.add("carousel-clone");
        el.setAttribute("aria-hidden", "true");
        el.querySelectorAll("a,button,input").forEach((a) => (a.tabIndex = -1));
      });
      after.forEach((el) => {
        el.classList.add("carousel-clone");
        el.setAttribute("aria-hidden", "true");
        el.querySelectorAll("a,button,input").forEach((a) => (a.tabIndex = -1));
      });
      track.prepend(...before);
      track.append(...after);
    }
    const step = () => {
      const card = track.querySelector(".card");
      return card ? card.getBoundingClientRect().width + 20 : 300;
    };
    const cycleWidth = () => step() * originals.length;
    if (originals.length > 1) {
      track.scrollLeft = cycleWidth();
    }
    let settleTimer = 0;
    const normalize = () => {
      if (originals.length < 2) return;
      const w = cycleWidth(),
        x = track.scrollLeft;
      // Teleport only when we are inside a cloned segment, not halfway through real cards.
      if (x < w - 2 || x >= 2 * w - 2) {
        const previousSnap = track.style.scrollSnapType;
        const previousBehavior = track.style.scrollBehavior;
        track.style.scrollSnapType = "none";
        track.style.scrollBehavior = "auto";
        track.scrollLeft = x < w ? x + w : x - w;
        requestAnimationFrame(() => {
          track.style.scrollSnapType = previousSnap;
          track.style.scrollBehavior = previousBehavior;
        });
      }
    };
    const update = () => {
      prev.disabled = next.disabled = originals.length < 2;
    };
    prev.onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    next.onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
    track.addEventListener(
      "scroll",
      () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(normalize, 110);
      },
      { passive: true },
    );
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        track.scrollBy({
          left: (e.key === "ArrowRight" ? 1 : -1) * step(),
          behavior: "smooth",
        });
      }
    });
    let resizeTimer = 0,
      lastWidth = track.clientWidth;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (
          originals.length > 1 &&
          Math.abs(track.clientWidth - lastWidth) > 1
        ) {
          lastWidth = track.clientWidth;
          track.style.scrollBehavior = "auto";
          track.scrollLeft = cycleWidth();
          track.style.scrollBehavior = "";
        }
        update();
      }, 180);
    });
    requestAnimationFrame(update);
  } catch (e) {
    fail(e);
  }
}
async function catalog() {
  return window.LS_CATALOG.init();
}
async function recipe() {
  const id = qs.get("id");
  if (!id) {
    status("Не вказано ID рецепта", true);
    return;
  }
  try {
    const s = await db.collection("recipes").doc(id).get();
    if (!s.exists || s.data().status !== "published") {
      status("Рецепт не знайдено", true);
      return;
    }
    const r = s.data();
    document.title = r.title + " | LemonSqueezy";
    $("recipe").innerHTML =
      `<div class="recipe-heading"><div class="recipe-category">${esc((r.categoryIds || []).join(" · "))}</div><h1>${esc(r.title)}</h1><p class="recipe-intro">${esc(r.description || "")}</p>${r.country ? `<p class="recipe-country">Країна: ${esc(r.country)}</p>` : ``}<div class="recipe-facts"><span>◷ ${Number(r.totalTimeMinutes) || 0} хв</span><span>✦ ${esc(difficulties[r.difficulty] || "")}</span>${r.servings ? `<span>♧ ${Number(r.servings)} порцій</span>` : ""}</div>${
        (r.dietaryTags || []).length
          ? `<div class="dietary-badges">${r.dietaryTags
              .filter((t) => window.LS_DIETARY?.[t])
              .map(
                (t) =>
                  `<span class="dietary-badge">${esc(window.LS_DIETARY[t])}</span>`,
              )
              .join("")}</div>`
          : ""
      }</div><div class="recipe-cover">${photoFor({ ...r, id }) ? `<img class="recipe-hero" src="${esc(photoFor({ ...r, id }))}" alt="${esc(r.title)}" referrerpolicy="no-referrer">` : `<img class="recipe-hero" src="${esc(window.LS_RECIPE_ART?.[id] || "")}" alt="Ілюстративна картка: ${esc(r.title)}">`}</div><div id="authorActions" class="author-controls"></div><div class="two recipe-columns"><div class="panel recipe-ingredients-panel"><div class="recipe-panel-heading"><div><p class="eyebrow">Підготовка</p><h2>Інгредієнти</h2></div></div><div class="ingredient-toolbar">${r.servings ? `<div class="servings-control" aria-label="Кількість порцій"><span class="servings-label">Порцій</span><div class="servings-stepper"><button type="button" id="servingsMinus" class="serving-step" aria-label="Зменшити кількість порцій">−</button><output id="servingsCount" aria-live="polite">${Number(r.servings)}</output><button type="button" id="servingsPlus" class="serving-step" aria-label="Збільшити кількість порцій">+</button></div></div>` : ""}<div class="ingredient-recalc-bar"><button type="button" id="recalcToggle" class="ingredient-recalc-btn" aria-pressed="false" aria-label="Перерахувати інгредієнти" title="Перерахувати інгредієнти"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 10h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2"/></svg></button><span id="recalcHint" class="ingredient-recalc-hint" hidden>Натисни на кількість конкретного інгредієнта. Зміни залишаться до перезавантаження.</span></div></div><div class="ingredient-progress"><div class="ingredient-progress-copy"><span id="ingredientProgressText">0 із ${(r.ingredients || []).length} підготовлено</span><span id="ingredientProgressPercent">0%</span></div><div class="ingredient-progress-track" role="progressbar" aria-label="Підготовка інгредієнтів" aria-valuemin="0" aria-valuemax="${(r.ingredients || []).length}" aria-valuenow="0"><div id="ingredientProgressFill"></div></div></div><ul id="ingredientList">${(r.ingredients || []).map((i) => `<li>${esc(i.name)} ${esc(i.amount || "")} ${esc(i.unit || "")}</li>`).join("")}</ul><p class="muted small ls-check-hint">Відмічай підготовлені інгредієнти. Позначки зберігаються лише до закриття цієї сторінки.</p></div><div class="panel recipe-steps-panel"><p class="eyebrow">Крок за кроком</p><h2>Приготування</h2><ol class="steps">${(r.steps || []).map((x) => `<li><span class="step-content">${esc(x.text)}${x.imageUrl ? `<img src="${esc(x.imageUrl)}" loading="lazy" alt="Фото кроку">` : ""}</span></li>`).join("")}</ol></div></div>`;
    recipeActions(id, r.authorId);
    servingsWidget(r);
    communityWidgets(id, r);
    renderAuthorName(r.authorId);
    if (window.LS_METRICS) window.LS_METRICS.recordView(id);
  } catch (e) {
    fail(e);
  }
}
function authPage(mode) {
  const form = $("authForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("email").value.trim(),
      pass = $("password").value;
    try {
      $("submit").disabled = true;
      if (mode === "register") {
        if (pass !== $("confirm").value) throw Error("Паролі не збігаються");
        const name = $("displayName").value.trim();
        if (name.length < 2 || name.length > 60)
          throw Error("Ім’я має містити від 2 до 60 символів");
        const result = await auth.createUserWithEmailAndPassword(email, pass);
        await result.user.updateProfile({ displayName: name });
        try {
          await db
            .collection("users")
            .doc(result.user.uid)
            .set({
              displayName: name,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        } catch (profileError) {
          console.warn("Профіль Firestore не збережено:", profileError);
        }
      } else await auth.signInWithEmailAndPassword(email, pass);
      go("index.html");
    } catch (err) {
      console.error("Recipe save failed:", err);
      fail(err);
      $("status")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      $("submit").disabled = false;
    }
  });
}
function addIngredient() {
  const box = document.createElement("div");
  box.className = "ingredient-row inline";
  box.innerHTML =
    '<input class="ingredient-name" list="ingredientSuggestionsList" autocomplete="off" placeholder="Почни вводити назву" required maxlength="100"><input class="ingredient-amount" placeholder="Кількість, напр. 200" maxlength="30"><select class="ingredient-unit"><option value="">Без одиниці</option><option value="г">г</option><option value="кг">кг</option><option value="мл">мл</option><option value="л">л</option><option value="шт.">шт.</option><option value="ч. л.">ч. л.</option><option value="ст. л.">ст. л.</option><option value="дрібка">дрібка</option><option value="пучок">пучок</option><option value="зубчик">зубчик</option><option value="склянка">склянка</option><option value="за смаком">за смаком</option></select><button type="button" class="ghost remove">×</button>';
  box.querySelector(".remove").onclick = () => box.remove();
  $("ingredients").append(box);
}
function addStep() {
  const box = document.createElement("div");
  box.className = "step-row";
  box.innerHTML =
    '<label>Опис кроку</label><textarea class="step-text" required maxlength="3000"></textarea><label>URL фото кроку (необов’язково)</label><input class="step-image" type="url" placeholder="https://..."><button type="button" class="ghost remove">Видалити крок</button>';
  box.querySelector(".remove").onclick = () => box.remove();
  $("steps").append(box);
}
function setupRecipeFormValidation() {
  const form = $("recipeForm");
  if (!form) return;
  form.addEventListener(
    "invalid",
    (e) => {
      const field = e.target;
      const label = field.id
        ? document
            .querySelector('label[for="' + field.id + '"]')
            ?.textContent?.trim()
        : null;
      status(
        "Перевір поле «" +
          (label || field.getAttribute("placeholder") || "обов’язкове поле") +
          "»: " +
          (field.validationMessage || "некоректне значення"),
        true,
      );
      field.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    true,
  );
}
function createPage(editMode = false) {
  setupRecipeFormValidation();
  auth.onAuthStateChanged(async (u) => {
    if (!u) {
      status("Увійди, щоб редагувати рецепт.", true);
      $("recipeForm").classList.add("hidden");
      return;
    }
    if (editMode) {
      const id = qs.get("id");
      if (!id) return status("Не вказано рецепт", true);
      try {
        const snap = await db.collection("recipes").doc(id).get();
        if (!snap.exists || snap.data().authorId !== u.uid) {
          $("recipeForm").classList.add("hidden");
          return status("Редагування недоступне", true);
        }
        fillRecipeForm(snap.data());
        $("recipeForm").dataset.recipeId = id;
        $("recipeForm").addEventListener(
          "input",
          () => (window.recipeDirty = true),
        );
        $("recipeForm").addEventListener(
          "change",
          () => (window.recipeDirty = true),
        );
      } catch (e) {
        fail(e);
      }
    }
  });
  Object.entries(window.LS_DIETARY || {}).forEach(([id, label]) => {
    const l = document.createElement("label");
    l.className = "dietary-choice";
    const i = document.createElement("input");
    i.type = "checkbox";
    i.value = id;
    l.append(i, document.createTextNode(label));
    $("dietaryChecks")?.append(l);
  });
  categories.forEach((c) => {
    const l = document.createElement("label");
    l.className = "dietary-choice";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = c;
    l.append(input, document.createTextNode(c));
    $("categories").append(l);
  });
  $("addIngredient").onclick = addIngredient;
  $("addStep").onclick = addStep;
  addIngredient();
  addStep();
  $("recipeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return status("Потрібна авторизація", true);
    const categoryIds = [
      ...$("categories").querySelectorAll("input:checked"),
    ].map((x) => x.value);
    const ingredients = [...$("ingredients").children].map((x) => ({
      name: x.querySelector(".ingredient-name").value.trim(),
      amount: x.querySelector(".ingredient-amount").value.trim(),
      unit: x.querySelector(".ingredient-unit").value.trim(),
    }));
    const steps = [...$("steps").children].map((x) => ({
      text: x.querySelector(".step-text").value.trim(),
      imageUrl: x.querySelector(".step-image").value.trim(),
    }));
    if (
      !categoryIds.length ||
      !ingredients.length ||
      !steps.length ||
      ingredients.some((x) => !x.name) ||
      steps.some((x) => !x.text)
    )
      return status("Вкажи категорію, інгредієнти та кроки.", true);
    if (!editMode && ingredients.some((x) => !canonicalIngredient(x.name)))
      return status(
        "Обери інгредієнти з каталогу. Якщо потрібного немає, запропонуй його на модерацію.",
        true,
      );
    if (editMode) {
      const oldNames = new Set(
        (window.originalIngredientNames || []).map(ingredientNorm),
      );
      if (
        ingredients.some(
          (x) =>
            !canonicalIngredient(x.name) &&
            !oldNames.has(ingredientNorm(x.name)),
        )
      )
        return status("Нові інгредієнти потрібно обирати з каталогу.", true);
    }
    ingredients.forEach((x) => {
      x.name = canonicalIngredient(x.name) || x.name;
    });
    const url = $("imageUrl").value.trim();
    if (
      (url && !url.startsWith("https://")) ||
      steps.some((x) => x.imageUrl && !x.imageUrl.startsWith("https://"))
    )
      return status(
        "Посилання на зображення повинні починатися з https://",
        true,
      );
    const country = $("country")?.value.trim() || "";
    const dietaryTags = [
      ...$("dietaryChecks").querySelectorAll("input:checked"),
    ].map((x) => x.value);
    const data = {
      country,
      dietaryTags,
      authorId: user.uid,
      title: $("title").value.trim(),
      description: $("description").value.trim(),
      imageUrl: url,
      categoryIds,
      difficulty: $("difficulty").value,
      totalTimeMinutes: Number($("time").value),
      servings: $("servings").value ? Number($("servings").value) : null,
      ingredients,
      steps,
      status: "published",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      $("submit").disabled = true;
      let ref;
      if (editMode) {
        const id = $("recipeForm").dataset.recipeId;
        if (!id) throw Error("Рецепт ще не завантажено");
        ref = db.collection("recipes").doc(id);
        delete data.createdAt;
        delete data.authorId;
        delete data.status;
        const batch = db.batch();
        batch.update(ref, data);
        window.LS_SEARCH_INDEX.mark(batch, ref, false);
        await batch.commit();
        window.recipeDirty = false;
      } else {
        ref = db.collection("recipes").doc();
        const batch = db.batch();
        batch.set(ref, data);
        window.LS_SEARCH_INDEX.mark(batch, ref, false);
        await batch.commit();
      }
      window.LS_EDITOR_DRAFT?.clear();
      window.recipeDirty = false;
      go("recipe.html?id=" + encodeURIComponent(ref.id));
    } catch (err) {
      fail(err);
    } finally {
      $("submit").disabled = false;
    }
  });
}

function warnUnsaved(e) {
  if (window.recipeDirty) {
    e.preventDefault();
    e.returnValue = "";
  }
}
function fillRecipeForm(r) {
  window.originalIngredientNames = (r.ingredients || []).map((i) => i.name);
  $("title").value = r.title || "";
  $("description").value = r.description || "";
  $("imageUrl").value = r.imageUrl || "";
  if ($("country")) $("country").value = r.country || "";
  $("time").value = r.totalTimeMinutes || "";
  $("servings").value = r.servings || "";
  $("difficulty").value = r.difficulty || "easy";
  $("categories")
    .querySelectorAll("input")
    .forEach((i) => (i.checked = (r.categoryIds || []).includes(i.value)));
  $("dietaryChecks")
    ?.querySelectorAll("input")
    .forEach((i) => (i.checked = (r.dietaryTags || []).includes(i.value)));
  $("ingredients").replaceChildren();
  (r.ingredients || []).forEach((i) => {
    addIngredient();
    const x = $("ingredients").lastElementChild;
    x.querySelector(".ingredient-name").value = i.name || "";
    x.querySelector(".ingredient-amount").value = i.amount || "";
    {
      const unit = x.querySelector(".ingredient-unit");
      if (i.unit && ![...unit.options].some((o) => o.value === i.unit)) {
        const opt = document.createElement("option");
        opt.value = i.unit;
        opt.textContent = i.unit;
        unit.append(opt);
      }
      unit.value = i.unit || "";
    }
  });
  $("steps").replaceChildren();
  (r.steps || []).forEach((i) => {
    addStep();
    const x = $("steps").lastElementChild;
    x.querySelector(".step-text").value = i.text || "";
    x.querySelector(".step-image").value = i.imageUrl || "";
  });
  window.recipeDirty = false;
}
async function deleteRecipe(id) {
  if (!confirm("Видалити рецепт назавжди? Цю дію неможливо скасувати.")) return;
  try {
    const ref = db.collection("recipes").doc(id);
    const batch = db.batch();
    batch.delete(ref);
    window.LS_SEARCH_INDEX.mark(batch, ref, true);
    await batch.commit();
    go("account.html");
  } catch (e) {
    fail(e);
  }
}
function recipeActions(id, authorId) {
  auth.onAuthStateChanged((u) => {
    const area = $("authorActions");
    if (!area) return;
    area.replaceChildren();
    if (!u || u.uid !== authorId) return;
    const edit = document.createElement("a");
    edit.className = "btn";
    edit.href = "edit-recipe.html?id=" + encodeURIComponent(id);
    edit.textContent = "Редагувати";
    const del = document.createElement("button");
    del.className = "ghost";
    del.textContent = "Видалити";
    del.onclick = () => deleteRecipe(id);
    area.append(edit, del);
  });
}
function servingsWidget(r) {
  const list = $("ingredientList");
  if (!list) return;
  const original = r.ingredients || [];
  const baseServings = Number(r.servings);
  const parseAmount = (value) => {
    const str = String(value ?? "")
      .trim()
      .replace(/\s/g, "")
      .replace(",", ".");
    return /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(str) ? Number(str) : null;
  };
  const fmt = (n) =>
    Number(n.toFixed(2)).toLocaleString("uk-UA", { maximumFractionDigits: 2 });
  let factor = 1,
    servings =
      Number.isFinite(baseServings) && baseServings > 0
        ? Math.max(1, Math.round(baseServings))
        : null,
    editing = false;
  const toggle = $("recalcToggle"),
    hint = $("recalcHint"),
    panel = list.closest(".recipe-ingredients-panel");
  const render = () => {
    const out = $("servingsCount");
    if (out && servings !== null) out.textContent = servings;
    const minus = $("servingsMinus");
    if (minus) minus.disabled = servings === null || servings <= 1;
    const plus = $("servingsPlus");
    if (plus) plus.disabled = servings === null || servings >= 100;
    [...list.children].forEach((li, i) => {
      const item = original[i];
      if (!item) return;
      const numeric = parseAmount(item.amount),
        shown =
          numeric !== null ? fmt(numeric * factor) : String(item.amount || "");
      let label = li.querySelector(".ingredient-label");
      if (!label) {
        label = document.createElement("span");
        label.className = "ingredient-label";
        const existing = li.querySelector(".ls-ingredient-check");
        if (existing) existing.append(label);
        else li.append(label);
      }
      label.replaceChildren();
      const name = document.createElement("span");
      name.textContent = item.name || "";
      label.append(name);
      if (shown) {
        label.append(document.createTextNode(" "));
        const amount = document.createElement("span");
        amount.className =
          "ls-amount" +
          (editing && numeric !== null && numeric > 0
            ? " ls-amount-editable"
            : "");
        amount.textContent = shown;
        if (editing && numeric !== null && numeric > 0) {
          amount.tabIndex = 0;
          amount.setAttribute("role", "button");
          amount.setAttribute("aria-label", "Змінити кількість: " + item.name);
          amount.dataset.index = i;
        }
        label.append(amount);
      }
      if (item.unit) label.append(document.createTextNode(" " + item.unit));
    });
  };
  function editAmount(target) {
    if (!editing || list.querySelector(".ls-amount-input")) return;
    const i = Number(target.dataset.index),
      base = parseAmount(original[i]?.amount);
    if (base === null || base <= 0) return;
    const old = base * factor;
    const input = document.createElement("input");
    input.type = "number";
    input.className = "ls-amount-input";
    input.min = "0.01";
    input.step = "any";
    input.value = Number(old.toFixed(2));
    input.setAttribute("aria-label", "Нова кількість: " + original[i].name);
    target.replaceWith(input);
    input.focus();
    input.select();
    let finished = false;
    function finish(save) {
      if (finished) return;
      finished = true;
      const value = Number(input.value);
      if (
        save &&
        input.value.trim() !== "" &&
        Number.isFinite(value) &&
        value > 0
      ) {
        factor = value / base;
        if (baseServings > 0)
          servings = Math.min(
            100,
            Math.max(1, Math.round(baseServings * factor)),
          );
      }
      render();
    }
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        finish(false);
      }
    });
    input.addEventListener("blur", () => finish(true));
    input.addEventListener("click", (e) => e.stopPropagation());
  }
  const stepServings = (delta) => {
    if (servings === null) return;
    const next = Math.max(1, Math.min(100, servings + delta));
    if (next === servings) return;
    const active = list.querySelector(".ls-amount-input");
    if (active) active.blur();
    factor *= next / servings;
    servings = next;
    render();
  };
  $("servingsMinus")?.addEventListener("click", () => stepServings(-1));
  $("servingsPlus")?.addEventListener("click", () => stepServings(1));
  toggle?.addEventListener("click", () => {
    const active = list.querySelector(".ls-amount-input");
    if (active) active.blur();
    editing = !editing;
    toggle.setAttribute(
      "aria-label",
      editing ? "Завершити перерахунок" : "Перерахувати інгредієнти",
    );
    toggle.title = editing
      ? "Завершити перерахунок"
      : "Перерахувати інгредієнти";
    toggle.setAttribute("aria-pressed", String(editing));
    if (hint) hint.hidden = !editing;
    panel?.classList.toggle("recalc-mode", editing);
    render();
  });
  list.addEventListener("click", (e) => {
    const target = e.target.closest(".ls-amount-editable");
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      editAmount(target);
    }
  });
  list.addEventListener("keydown", (e) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.matches(".ls-amount-editable")
    ) {
      e.preventDefault();
      editAmount(e.target);
    }
  });
  list.addEventListener("click", (e) => {
    if (e.target.matches(".ls-amount-input")) e.stopPropagation();
  });
  render();
}

function accountPage() {
  auth.onAuthStateChanged(async (u) => {
    if (!u) {
      go("login.html");
      return;
    }
    $("who").textContent = (u.displayName || u.email) + " · " + u.email;
    $("signout").onclick = () => auth.signOut().then(() => go("index.html"));
    try {
      const s = await db
        .collection("recipes")
        .where("authorId", "==", u.uid)
        .where("status", "==", "published")
        .limit(100)
        .get();
      const recipes = s.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((x) => x.status === "published");
      $("myRecipes").innerHTML = recipes.length
        ? recipes
            .map(
              (r) =>
                `<div class="author-card">${renderCard(r)}<div class="author-controls"><a class="btn" href="edit-recipe.html?id=${encodeURIComponent(r.id)}">Редагувати</a><button type="button" class="ghost" data-delete="${esc(r.id)}">Видалити</button></div></div>`,
            )
            .join("")
        : "<p>Ти ще не опублікував жодного рецепта.</p>";
      $("myRecipes")
        .querySelectorAll("[data-delete]")
        .forEach((b) => (b.onclick = () => deleteRecipe(b.dataset.delete)));
    } catch (e) {
      fail(e);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  const p = document.body.dataset.page;
  if (p === "home") home();
  if (p === "catalog") catalog();
  if (p === "recipe") recipe();
  if (p === "login" || p === "register") authPage(p);
  if (p === "create") createPage();
  if (p === "edit") createPage(true);
  if (p === "account") accountPage();
});

// v0.5: Favorites, immutable ratings and comments. All writes are checked by Firestore rules.
function friendlyDate(value) {
  try {
    return value?.toDate?.().toLocaleDateString("uk-UA") || "";
  } catch (_) {
    return "";
  }
}
function communityWidgets(id, r) {
  const host = document.createElement("section");
  host.className = "community";
  host.innerHTML = `<div class="panel"><div class="community-heading"><h2>Зберегти та оцінити</h2><button id="favoriteButton" type="button" class="ghost" disabled>♡ У вибране</button></div><p id="ratingSummary" class="muted">Завантаження оцінок…</p><div id="ratingButtons" class="rating-buttons" aria-label="Оцінити рецепт"></div><p id="communityStatus" role="status" class="status"></p></div><div class="panel"><h2>Коментарі</h2><form id="commentForm" class="form hidden"><label for="commentText">Ваш коментар</label><textarea id="commentText" maxlength="1500" required placeholder="Поділіться враженнями…"></textarea><button id="commentSubmit" type="submit">Опублікувати</button></form><p id="commentSignIn" class="muted">Щоб залишити коментар, <a href="login.html">увійдіть</a>.</p><div id="commentList" class="comments"><p class="muted">Завантаження коментарів…</p></div></div>`;
  $("recipe").append(host);
  const note = (msg, err = false) => {
    const el = $("communityStatus");
    el.textContent = msg;
    el.className = "status " + (err ? "error" : "success");
  };
  let user = null;
  const favoriteRef = () => db.collection("favorites").doc(user.uid + "_" + id);
  const ratingRef = () => db.collection("ratings").doc(id + "_" + user.uid);
  async function loadRating() {
    try {
      const snap = await db
        .collection("ratings")
        .where("recipeId", "==", id)
        .limit(500)
        .get();
      const values = snap.docs.map((x) => x.data().value);
      const avg = values.length
        ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
        : null;
      $("ratingSummary").textContent = avg
        ? `Середня оцінка: ${avg} / 5 · Оцінок: ${values.length}`
        : "Цей рецепт ще не оцінили.";
      const mine = user
        ? snap.docs.find((x) => x.id === id + "_" + user.uid)
        : null;
      const box = $("ratingButtons");
      box.replaceChildren();
      for (let v = 1; v <= 5; v++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ghost";
        b.textContent = "★ " + v;
        b.disabled = !user || !!mine;
        b.title = mine ? "Ви вже оцінили рецепт" : "Оцінити на " + v;
        b.onclick = async () => {
          try {
            b.disabled = true;
            await ratingRef().set({
              recipeId: id,
              userId: user.uid,
              value: v,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            note("Дякуємо за оцінку!");
            await loadRating();
          } catch (e) {
            note(e.message, true);
            await loadRating();
          }
        };
        box.append(b);
      }
      if (mine)
        note(
          "Ваша оцінка: " +
            mine.data().value +
            " / 5. Змінювати оцінку не можна.",
        );
    } catch (e) {
      $("ratingSummary").textContent =
        "Не вдалося завантажити оцінки: " + e.message;
    }
  }
  async function loadComments() {
    try {
      const snap = await db
        .collection("comments")
        .where("recipeId", "==", id)
        .limit(200)
        .get();
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0),
        );
      const list = $("commentList");
      list.replaceChildren();
      if (!data.length) {
        list.innerHTML = '<p class="muted">Коментарів ще немає.</p>';
        return;
      }
      for (const c of data) {
        const item = document.createElement("article");
        item.className = "comment";
        const top = document.createElement("div");
        top.className = "comment-top";
        const name = document.createElement("strong");
        name.textContent = c.authorName || "Користувач";
        const date = document.createElement("span");
        date.className = "muted small";
        date.textContent = friendlyDate(c.createdAt);
        top.append(name, date);
        const body = document.createElement("p");
        body.textContent = c.text;
        item.append(top, body);
        if (user && c.authorId === user.uid) {
          const del = document.createElement("button");
          del.type = "button";
          del.className = "ghost";
          del.textContent = "Видалити";
          del.onclick = async () => {
            if (!confirm("Видалити коментар?")) return;
            try {
              await db.collection("comments").doc(c.id).delete();
              await loadComments();
            } catch (e) {
              note(e.message, true);
            }
          };
          item.append(del);
        }
        list.append(item);
        resolvePublicName(c.authorId, c.authorName || "Користувач")
          .then((n) => {
            name.textContent = n;
          })
          .catch(() => {});
      }
    } catch (e) {
      $("commentList").textContent =
        "Не вдалося завантажити коментарі: " + e.message;
    }
  }
  $("commentForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const input = $("commentText");
    const text = input.value.trim();
    if (!text || text.length > 1500) return;
    const button = $("commentSubmit");
    button.disabled = true;
    try {
      await db
        .collection("comments")
        .add({
          recipeId: id,
          authorId: user.uid,
          authorName:
            user.displayName || user.email?.split("@")[0] || "Користувач",
          text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      input.value = "";
      await loadComments();
    } catch (e) {
      note(e.message, true);
    } finally {
      button.disabled = false;
    }
  };
  auth.onAuthStateChanged(async (u) => {
    user = u;
    const fb = $("favoriteButton");
    fb.disabled = !u;
    $("commentForm").classList.toggle("hidden", !u);
    $("commentSignIn").classList.toggle("hidden", !!u);
    fb.textContent = u ? "♡ У вибране" : "Увійдіть, щоб зберегти";
    if (u) {
      try {
        const snap = await favoriteRef().get();
        fb.textContent = snap.exists ? "♥ У вибраному" : "♡ У вибране";
        fb.onclick = async () => {
          fb.disabled = true;
          try {
            const snap = await favoriteRef().get();
            if (snap.exists) {
              await favoriteRef().delete();
              fb.textContent = "♡ У вибране";
            } else {
              await favoriteRef().set({
                userId: u.uid,
                recipeId: id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
              fb.textContent = "♥ У вибраному";
            }
          } catch (e) {
            note(e.message, true);
          } finally {
            fb.disabled = false;
          }
        };
      } catch (e) {
        note(e.message, true);
      }
    }
    await Promise.all([loadRating(), loadComments()]);
  });
}
async function favoritesPage() {
  auth.onAuthStateChanged(async (u) => {
    if (!u) {
      go("login.html");
      return;
    }
    try {
      const snap = await db
        .collection("favorites")
        .where("userId", "==", u.uid)
        .limit(200)
        .get();
      const favorites = snap.docs
        .map((d) => d.data())
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0),
        );
      const found = await Promise.all(
        favorites.map(async (f) => {
          try {
            const doc = await db.collection("recipes").doc(f.recipeId).get();
            return doc.exists && doc.data().status === "published"
              ? { id: doc.id, ...doc.data() }
              : null;
          } catch (_) {
            return null;
          }
        }),
      );
      $("favoritesList").innerHTML = found.filter(Boolean).length
        ? found.filter(Boolean).map(renderCard).join("")
        : '<p class="muted">Тут поки немає збережених рецептів.</p>';
    } catch (e) {
      fail(e);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "favorites") favoritesPage();
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".top .nav");
  if (!nav) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-toggle";
  btn.textContent = "☰";
  btn.setAttribute("aria-label", "Відкрити меню");
  btn.setAttribute("aria-expanded", "false");
  nav.insertBefore(btn, nav.querySelector(".logo").nextSibling);
  btn.onclick = () => {
    const open = nav.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "✕" : "☰";
  };
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      btn.textContent = "☰";
      btn.setAttribute("aria-expanded", "false");
    }),
  );
});
