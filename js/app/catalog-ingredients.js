// Multi-ingredient chip controls for catalog. Keep original comma-separated fields
// as the source of truth for the existing search and shareable URL logic.
(function () {
  "use strict";
  function norm(s) {
    return String(s || "")
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }
  function setup(id, otherId) {
    const original = document.getElementById(id);
    if (!original) return;
    const shell = document.createElement("div");
    shell.className = "ingredient-multi";
    const chips = document.createElement("div");
    chips.className = "ingredient-chips";
    const entry = document.createElement("input");
    entry.type = "text";
    entry.className = "ingredient-entry";
    entry.autocomplete = "off";
    entry.placeholder =
      id === "include" ? "Додати інгредієнт…" : "Виключити інгредієнт…";
    entry.setAttribute("aria-label", entry.placeholder);
    const suggestions = document.createElement("div");
    suggestions.className = "ingredient-options";
    suggestions.hidden = true;
    suggestions.setAttribute("role", "listbox");
    suggestions.id = id + "Suggestions";
    entry.setAttribute("aria-controls", suggestions.id);
    entry.setAttribute("aria-expanded", "false");
    shell.append(chips, entry, suggestions);
    original.insertAdjacentElement("afterend", shell);
    original.classList.add("ingredient-source-hidden");
    original.tabIndex = -1;
    const parse = () =>
      original.value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    function sync(items) {
      original.value = items.join(", ");
      original.dispatchEvent(new Event("input", { bubbles: true }));
      render();
    }
    function add(value) {
      const name = value.trim();
      if (!name) return;
      const items = parse();
      if (items.some((x) => norm(x) === norm(name))) return;
      const other = document.getElementById(otherId).value.split(",").map(norm);
      if (other.includes(norm(name))) {
        entry.setCustomValidity("Інгредієнт уже є у протилежному фільтрі");
        entry.reportValidity();
        return;
      }
      entry.setCustomValidity("");
      sync([...items, name]);
      entry.value = "";
      suggestions.hidden = true;
      entry.setAttribute("aria-expanded", "false");
      entry.focus();
    }
    function render() {
      chips.replaceChildren();
      parse().forEach((name) => {
        const chip = document.createElement("span");
        chip.className = "ingredient-chip";
        chip.append(document.createTextNode(name));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Прибрати " + name);
        remove.addEventListener("click", () =>
          sync(parse().filter((x) => norm(x) !== norm(name))),
        );
        chip.append(remove);
        chips.append(chip);
      });
    }
    function showSuggestions() {
      suggestions.replaceChildren();
      const query = norm(entry.value);
      if (!query) {
        suggestions.hidden = true;
        entry.setAttribute("aria-expanded", "false");
        return;
      }
      const candidates = (
        typeof BUILTIN_INGREDIENTS !== "undefined" ? BUILTIN_INGREDIENTS : []
      )
        .filter(
          (x) =>
            norm(x).includes(query) &&
            !parse().some((y) => norm(y) === norm(x)),
        )
        .slice(0, 8);
      candidates.forEach((name) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = name;
        b.setAttribute("role", "option");
        b.addEventListener("mousedown", (e) => e.preventDefault());
        b.addEventListener("click", () => add(name));
        suggestions.append(b);
      });
      suggestions.hidden = !candidates.length;
      entry.setAttribute("aria-expanded", String(candidates.length > 0));
    }
    entry.addEventListener("input", () => {
      entry.setCustomValidity("");
      showSuggestions();
    });
    entry.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        add(entry.value);
      } else if (e.key === "Backspace" && !entry.value && parse().length) {
        sync(parse().slice(0, -1));
      } else if (e.key === "Escape") suggestions.hidden = true;
    });
    entry.addEventListener("blur", () => {
      setTimeout(() => (suggestions.hidden = true), 150);
    });
    // Allow URL restoration and reset buttons from the existing catalog logic.
    original.addEventListener("input", render);
    const reset = document.getElementById("resetFilters");
    if (reset)
      reset.addEventListener("click", () => {
        entry.value = "";
        suggestions.hidden = true;
        render();
      });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "catalog") {
      setup("include", "exclude");
      setup("exclude", "include");
    }
  });
})();
