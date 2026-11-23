(function () {
  "use strict";
  function setup(select) {
    const wrap = document.createElement("div");
    wrap.className = "ls-select";
    select.parentNode.insertBefore(wrap, select);
    wrap.append(select);
    select.classList.add("ls-select-native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ls-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const list = document.createElement("div");
    list.className = "ls-select-menu";
    list.setAttribute("role", "listbox");
    list.id = "ls-list-" + select.id;
    trigger.setAttribute("aria-controls", list.id);
    wrap.append(trigger, list);
    let active = 0;
    function refresh() {
      const current = select.selectedIndex < 0 ? 0 : select.selectedIndex;
      active = current;
      trigger.textContent = select.options[current]?.textContent || "Обрати";
      list.querySelectorAll("[role=option]").forEach((el, i) => {
        el.setAttribute("aria-selected", String(i === current));
        el.classList.toggle("is-selected", i === current);
      });
    }
    function close(focus = false) {
      wrap.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      if (focus) trigger.focus();
    }
    function open() {
      document.querySelectorAll(".ls-select.is-open").forEach((el) => {
        if (el !== wrap) {
          el.classList.remove("is-open");
          el.querySelector(".ls-select-trigger")?.setAttribute(
            "aria-expanded",
            "false",
          );
        }
      });
      wrap.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      refresh();
    }
    function choose(i) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      refresh();
      close(true);
    }
    Array.from(select.options).forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ls-select-option";
      btn.setAttribute("role", "option");
      btn.textContent = opt.textContent;
      btn.addEventListener("click", () => choose(i));
      list.append(btn);
    });
    trigger.addEventListener("click", () =>
      wrap.classList.contains("is-open") ? close() : open(),
    );
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (
        ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(e.key)
      ) {
        e.preventDefault();
        if (!wrap.classList.contains("is-open")) open();
        if (e.key === "ArrowDown")
          active = Math.min(select.options.length - 1, active + 1);
        if (e.key === "ArrowUp") active = Math.max(0, active - 1);
        if (e.key === "Home") active = 0;
        if (e.key === "End") active = select.options.length - 1;
        if (e.key === "Enter" || e.key === " ") choose(active);
        else {
          list
            .querySelectorAll(".ls-select-option")
            .forEach((el, i) => el.classList.toggle("is-active", i === active));
          list.children[active]?.scrollIntoView({ block: "nearest" });
        }
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && wrap.classList.contains("is-open")) close(true);
    });
    select.addEventListener("change", refresh);
    // Reset in catalog code sets select.value directly without change event.
    document
      .getElementById("resetFilters")
      ?.addEventListener("click", () => queueMicrotask(refresh));
    refresh();
  }
  document.addEventListener("DOMContentLoaded", () =>
    ["countryFilter", "difficulty", "maxTime", "sort"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) setup(el);
    }),
  );
})();
