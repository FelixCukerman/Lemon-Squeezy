"use strict";
const profileCache = new Map();
async function resolvePublicName(uid, fallback = "Користувач") {
  if (!uid) return fallback;
  if (profileCache.has(uid)) return profileCache.get(uid);
  try {
    const doc = await db.collection("users").doc(uid).get();
    const name = doc.exists ? String(doc.data().displayName || "").trim() : "";
    if (name) {
      profileCache.set(uid, name);
      return name;
    }
  } catch (e) {
    console.warn("Не вдалося завантажити ім’я автора", e);
  }
  return fallback;
}
async function renderAuthorName(uid) {
  const host = document.querySelector("#recipe h1");
  if (!host || !uid) return;
  const by = document.createElement("p");
  by.className = "muted author-byline";
  by.textContent = "Автор: завантаження…";
  host.insertAdjacentElement("afterend", by);
  by.textContent = "Автор: " + (await resolvePublicName(uid, "Користувач"));
}
function initProfilePage() {
  if (document.body.dataset.page !== "account") return;
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    const nameInput = document.getElementById("profileName");
    const message = document.getElementById("profileStatus");
    const show = (text, error = false) => {
      message.textContent = text;
      message.className = "status " + (error ? "error" : "success");
    };
    nameInput.value = user.displayName || "";
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().displayName) {
        nameInput.value = doc.data().displayName;
        profileCache.set(user.uid, nameInput.value);
      } else if (user.displayName) {
        await db
          .collection("users")
          .doc(user.uid)
          .set({
            displayName: user.displayName,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        profileCache.set(user.uid, user.displayName);
      }
    } catch (e) {
      show("Не вдалося завантажити профіль: " + e.message, true);
    }
    document.getElementById("profileForm").onsubmit = async (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      if (name.length < 2 || name.length > 60) {
        show("Вкажи ім’я від 2 до 60 символів.", true);
        return;
      }
      const btn = document.getElementById("saveProfile");
      btn.disabled = true;
      try {
        await db
          .collection("users")
          .doc(user.uid)
          .set({
            displayName: name,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        await user.updateProfile({ displayName: name });
        profileCache.set(user.uid, name);
        document.getElementById("who").textContent = name + " · " + user.email;
        show("Ім’я збережено. Воно відображатиметься в рецептах і коментарях.");
      } catch (e) {
        show("Помилка збереження: " + e.message, true);
      } finally {
        btn.disabled = false;
      }
    };
    document.getElementById("passwordForm").onsubmit = async (event) => {
      event.preventDefault();
      const current = document.getElementById("currentPassword"),
        next = document.getElementById("newPassword"),
        repeat = document.getElementById("repeatPassword");
      if (next.value.length < 6) {
        show("Новий пароль має містити щонайменше 6 символів.", true);
        return;
      }
      if (next.value !== repeat.value) {
        show("Нові паролі не збігаються.", true);
        return;
      }
      const btn = document.getElementById("changePassword");
      btn.disabled = true;
      try {
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          current.value,
        );
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(next.value);
        current.value = "";
        next.value = "";
        repeat.value = "";
        show("Пароль успішно змінено.");
      } catch (e) {
        show("Не вдалося змінити пароль: " + e.message, true);
      } finally {
        btn.disabled = false;
      }
    };
  });
}
document.addEventListener("DOMContentLoaded", initProfilePage);
