/* sidebar.js - a self-contained slide-out menu that floats over any page.
   It doesn't change the page's layout, and it uses Shadow DOM so the page's
   CSS can't affect it (and it can't affect the page).

   To use it on a page, add this one line inside <head>:
     <script src="sidebar.js" defer></script>
*/
(function () {
  // ===== EDIT YOUR BUTTONS HERE =====
  // Add a line for each page: { label: "Button text", href: "file-name.html" }
  const LINKS = [
    { label: "Links",   href: "index.html" },
    { label: "Trainer", href: "trainer.html" }, // change to your trainer file name
    // { label: "About", href: "about.html" },
  ];
  // ===================================

  // Colors (match the main site)
  const BG = "#0b0f19", BTN = "#1b2336", BORDER = "#2c3855",
        HOVER = "#263250", TEXT = "#f2f4f8", ACCENT = "#5fb4d9";

  const norm = (s) => (s || "").replace(/\.html$/, "") || "index";
  const here = norm(location.pathname.split("/").pop());

  const host = document.createElement("div");
  host.style.cssText =
    "all:initial; position:fixed; top:0; left:0; width:0; height:0; z-index:2147483647;";
  const root = host.attachShadow({ mode: "open" });

  const items = LINKS.map((l) => {
    const active = norm(l.href.split("/").pop()) === here;
    return `<a class="item${active ? " active" : ""}" href="${l.href}"${active ? ' aria-current="page"' : ""}>${l.label}</a>`;
  }).join("");

  root.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      .toggle {
        position: fixed; top: 12px; left: 12px; width: 42px; height: 42px;
        display: flex; align-items: center; justify-content: center;
        background: ${BG}; color: ${TEXT}; border: 1px solid ${BORDER};
        border-radius: 10px; cursor: pointer; padding: 0;
        transition: background .15s, border-color .15s;
      }
      .toggle:hover, .toggle:focus-visible { background: ${HOVER}; border-color: ${ACCENT}; outline: none; }
      .backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,.45);
        opacity: 0; pointer-events: none; transition: opacity .2s;
      }
      .panel {
        position: fixed; top: 0; bottom: 0; left: 0; width: 220px;
        padding: 70px 16px 24px; background: ${BG};
        border-right: 1px solid ${BORDER};
        display: flex; flex-direction: column; gap: 10px;
        transform: translateX(-100%); transition: transform .2s;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        overflow-y: auto;
      }
      .open .backdrop { opacity: 1; pointer-events: auto; }
      .open .panel { transform: translateX(0); }
      .item {
        display: block; padding: 12px 16px; border: 1px solid transparent;
        border-radius: 10px; color: ${TEXT}; text-decoration: none;
        font-weight: 600; font-size: 16px; line-height: 1.4;
        transition: background .15s, border-color .15s;
      }
      .item:hover, .item:focus-visible { background: ${HOVER}; border-color: ${ACCENT}; outline: none; }
      .item.active { background: ${BTN}; border-color: ${BORDER}; color: ${ACCENT}; }
    </style>
    <div id="wrap">
      <button class="toggle" aria-label="Open menu" aria-expanded="false" aria-controls="panel">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14"/>
        </svg>
      </button>
      <div class="backdrop"></div>
      <nav class="panel" id="panel" aria-label="Site pages">${items}</nav>
    </div>`;

  const wrap = root.getElementById("wrap");
  const toggle = root.querySelector(".toggle");

  function setOpen(open) {
    wrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => setOpen(!wrap.classList.contains("open")));
  root.querySelector(".backdrop").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  document.documentElement.appendChild(host);
})();
