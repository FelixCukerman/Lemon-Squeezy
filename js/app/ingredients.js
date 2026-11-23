// Approved built-in ingredient catalog. Admin-approved additions are stored in Firestore.
const BUILTIN_INGREDIENTS = [
  "Борошно пшеничне",
  "Борошно житнє",
  "Борошно кукурудзяне",
  "Борошно рисове",
  "Борошно мигдальне",
  "Борошно цільнозернове",
  "Крохмаль кукурудзяний",
  "Крохмаль картопляний",
  "Рис",
  "Рис арборіо",
  "Рис басматі",
  "Рис жасмин",
  "Гречка",
  "Булгур",
  "Кус-кус",
  "Кіноа",
  "Вівсяні пластівці",
  "Манна крупа",
  "Пшоно",
  "Перлова крупа",
  "Макарони",
  "Спагеті",
  "Тальятеле",
  "Локшина",
  "Локшина рисова",
  "Хліб",
  "Батон",
  "Багет",
  "Бріош",
  "Лаваш",
  "Тортилья",
  "Панірувальні сухарі",
  "Сухарі",
  "Кукурудзяні пластівці",
  "Цукор",
  "Цукор тростинний",
  "Цукрова пудра",
  "Мед",
  "Кленовий сироп",
  "Ванільний цукор",
  "Ваніль",
  "Ванільний екстракт",
  "Какао",
  "Шоколад чорний",
  "Шоколад молочний",
  "Шоколад білий",
  "Розпушувач",
  "Сода харчова",
  "Дріжджі сухі",
  "Дріжджі свіжі",
  "Желатин",
  "Агар-агар",
  "Сіль",
  "Сіль морська",
  "Перець чорний",
  "Перець білий",
  "Паприка",
  "Паприка копчена",
  "Куркума",
  "Карі",
  "Кориця",
  "Мускатний горіх",
  "Імбир мелений",
  "Кмин",
  "Коріандр мелений",
  "Орегано",
  "Базилік сушений",
  "Чебрець",
  "Розмарин",
  "Лавровий лист",
  "Гвоздика",
  "Кардамон",
  "Перець чилі",
  "Пластівці чилі",
  "Хмелі-сунелі",
  "Сумах",
  "Кунжут",
  "Мак",
  "Насіння льону",
  "Насіння чіа",
  "Насіння соняшника",
  "Насіння гарбуза",
  "Волоські горіхи",
  "Мигдаль",
  "Фундук",
  "Кеш’ю",
  "Арахіс",
  "Фісташки",
  "Кокосова стружка",
  "Родзинки",
  "Курага",
  "Чорнослив",
  "Фініки",
  "Журавлина сушена",
  "Масло вершкове",
  "Олія соняшникова",
  "Олія оливкова",
  "Олія кунжутна",
  "Олія кокосова",
  "Сало",
  "Смалець",
  "Молоко",
  "Вершки",
  "Сметана",
  "Йогурт натуральний",
  "Йогурт грецький",
  "Кефір",
  "Ряжанка",
  "Сир кисломолочний",
  "Сир вершковий",
  "Маскарпоне",
  "Рикота",
  "Фета",
  "Бринза",
  "Моцарела",
  "Чедер",
  "Пармезан",
  "Гауда",
  "Брі",
  "Камамбер",
  "Яйце",
  "Білок яєчний",
  "Жовток яєчний",
  "Куряче філе",
  "Куряче стегно",
  "Курячі крильця",
  "Індиче філе",
  "Фарш курячий",
  "Фарш індичий",
  "Яловичина",
  "Яловичий фарш",
  "Свинина",
  "Свинячий фарш",
  "Бекон",
  "Шинка",
  "Мортадела",
  "Ковбаса",
  "Сосиски",
  "Качка",
  "Баранина",
  "Печінка куряча",
  "Лосось",
  "Форель",
  "Тунець",
  "Тріска",
  "Хек",
  "Оселедець",
  "Скумбрія",
  "Креветки",
  "Кальмари",
  "Мідії",
  "Крабові палички",
  "Ікра",
  "Картопля",
  "Батат",
  "Морква",
  "Цибуля ріпчаста",
  "Цибуля червона",
  "Цибуля зелена",
  "Цибуля порей",
  "Часник",
  "Помідор",
  "Помідори чері",
  "Томатна паста",
  "Томати у власному соку",
  "Огірок",
  "Огірок маринований",
  "Корнішони",
  "Перець солодкий",
  "Перець гострий",
  "Баклажан",
  "Кабачок",
  "Цукіні",
  "Гарбуз",
  "Броколі",
  "Цвітна капуста",
  "Капуста білокачанна",
  "Капуста червонокачанна",
  "Капуста пекінська",
  "Капуста брюссельська",
  "Шпинат",
  "Рукола",
  "Салат айсберг",
  "Листя салату",
  "Селера стеблова",
  "Корінь селери",
  "Буряк",
  "Редиска",
  "Редька",
  "Пастернак",
  "Петрушка",
  "Кріп",
  "Кінза",
  "М’ята",
  "Базилік",
  "Розмарин свіжий",
  "Чебрець свіжий",
  "Печериці",
  "Гливи",
  "Білі гриби",
  "Лисички",
  "Гриби сушені",
  "Квасоля",
  "Квасоля консервована",
  "Нут",
  "Сочевиця",
  "Горошок зелений",
  "Кукурудза консервована",
  "Кукурудза",
  "Оливки",
  "Маслини",
  "Каперси",
  "Авокадо",
  "Лимон",
  "Лайм",
  "Апельсин",
  "Мандарин",
  "Грейпфрут",
  "Яблуко",
  "Груша",
  "Банан",
  "Ананас",
  "Манго",
  "Ківі",
  "Персик",
  "Абрикос",
  "Слива",
  "Виноград",
  "Полуниця",
  "Малина",
  "Чорниця",
  "Лохина",
  "Ожина",
  "Вишня",
  "Черешня",
  "Журавлина",
  "Смородина",
  "Гранат",
  "Фейхоа",
  "Кавун",
  "Диня",
  "Кокосове молоко",
  "Вода",
  "Вода газована",
  "Бульйон курячий",
  "Бульйон овочевий",
  "Бульйон яловичий",
  "Сік апельсиновий",
  "Сік ананасовий",
  "Оцет яблучний",
  "Оцет винний білий",
  "Оцет винний червоний",
  "Оцет рисовий",
  "Оцет бальзамічний",
  "Соєвий соус",
  "Рибний соус",
  "Устричний соус",
  "Соус теріякі",
  "Соус чилі",
  "Соус томатний",
  "Кетчуп",
  "Майонез",
  "Гірчиця",
  "Гірчиця діжонська",
  "Паста карі",
  "Паста місо",
  "Тахіні",
  "Арахісова паста",
  "Вино біле сухе",
  "Вино червоне сухе",
  "Лимонний сік",
  "Лаймовий сік",
  "Цедра лимона",
  "Цедра апельсина",
  "Вершковий сир",
  "Малина заморожена",
  "Ягоди заморожені",
];
const INGREDIENT_UNITS = [
  "",
  "г",
  "кг",
  "мл",
  "л",
  "шт.",
  "ч. л.",
  "ст. л.",
  "дрібка",
  "пучок",
  "зубчик",
  "склянка",
  "за смаком",
];
let approvedIngredientNames = [...BUILTIN_INGREDIENTS];
const ingredientNorm = (s) =>
  String(s || "")
    .normalize("NFKC")
    .toLocaleLowerCase("uk-UA")
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
async function loadIngredientCatalog() {
  try {
    const snap = await db.collection("ingredients").limit(500).get();
    approvedIngredientNames = [
      ...new Map(
        [
          ...BUILTIN_INGREDIENTS,
          ...snap.docs.map((d) => d.data().name).filter(Boolean),
        ].map((n) => [ingredientNorm(n), n]),
      ).values(),
    ];
  } catch (e) {
    console.warn("Каталог Firestore недоступний; використано вбудований:", e);
  }
  const dl = document.getElementById("ingredientSuggestionsList");
  if (dl) {
    dl.replaceChildren();
    approvedIngredientNames.forEach((n) => {
      const o = document.createElement("option");
      o.value = n;
      dl.append(o);
    });
  }
}
function canonicalIngredient(s) {
  return approvedIngredientNames.find(
    (n) => ingredientNorm(n) === ingredientNorm(s),
  );
}
async function suggestIngredient() {
  const field = document.getElementById("suggestIngredientName"),
    name = field.value.trim();
  const msg = document.getElementById("suggestionStatus");
  if (name.length < 2 || name.length > 100) {
    msg.textContent = "Вкажи назву від 2 до 100 символів.";
    return;
  }
  if (canonicalIngredient(name)) {
    msg.textContent = "Цей інгредієнт уже є в каталозі.";
    return;
  }
  const u = auth.currentUser;
  if (!u) {
    msg.textContent = "Спочатку увійди в акаунт.";
    return;
  }
  try {
    await db
      .collection("ingredientSuggestions")
      .add({
        name,
        normalizedName: ingredientNorm(name),
        authorId: u.uid,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    field.value = "";
    msg.textContent = "Пропозицію надіслано на модерацію.";
  } catch (e) {
    msg.textContent = e.message;
  }
}
async function initIngredientTools() {
  await loadIngredientCatalog();
  const btn = document.getElementById("suggestIngredientButton");
  if (btn) btn.addEventListener("click", suggestIngredient);
}
async function adminIngredients() {
  const root = document.getElementById("moderationList");
  auth.onAuthStateChanged(async (u) => {
    if (!u) {
      root.textContent = "Увійдіть, щоб відкрити адміністрування.";
      return;
    }
    try {
      const admin = await db.collection("admins").doc(u.uid).get();
      if (!admin.exists) {
        root.textContent = "Доступ лише для адміністратора.";
        return;
      }
      const snap = await db
        .collection("ingredientSuggestions")
        .where("status", "==", "pending")
        .limit(100)
        .get();
      root.replaceChildren();
      if (snap.empty) {
        root.textContent = "Нових пропозицій немає.";
        return;
      }
      for (const d of snap.docs) {
        const data = d.data();
        const row = document.createElement("div");
        row.className = "panel ingredient-moderation";
        const name = document.createElement("strong");
        name.textContent = data.name;
        const approve = document.createElement("button");
        approve.textContent = "Схвалити";
        const reject = document.createElement("button");
        reject.className = "ghost";
        reject.textContent = "Відхилити";
        const act = async (ok) => {
          approve.disabled = reject.disabled = true;
          try {
            if (ok) {
              const key = encodeURIComponent(data.normalizedName);
              await db
                .collection("ingredients")
                .doc(key)
                .set({
                  name: data.name,
                  normalizedName: data.normalizedName,
                  approvedBy: u.uid,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
            await d.ref.update({
              status: ok ? "approved" : "rejected",
              reviewedBy: u.uid,
              reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            row.remove();
          } catch (e) {
            alert(e.message);
            approve.disabled = reject.disabled = false;
          }
        };
        approve.onclick = () => act(true);
        reject.onclick = () => act(false);
        row.append(name, approve, reject);
        root.append(row);
      }
    } catch (e) {
      root.textContent = "Не вдалося завантажити модерацію: " + e.message;
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("ingredientSuggestionsList"))
    initIngredientTools();
  if (document.body.dataset.page === "admin") adminIngredients();
});
