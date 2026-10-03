const ACCENTS = ["green", "purple", "white"];

function storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // storage unavailable: the choice just won't persist
    }
}

function currentTheme() {
    const fromAttr = document.documentElement.getAttribute("data-theme");
    const fromMedia = matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    return fromAttr || fromMedia;
}

function updateThemeButton() {
    const t = currentTheme();
    document.querySelectorAll(".btn-theme").forEach((b) => {
        b.textContent = t === "light" ? "Light" : "Dark";
        b.setAttribute("aria-label", "Theme: " + t + ". Click to switch.");
    });
}

function toggleTheme() {
    const target = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", target);
    storageSet("theme", target);
    updateThemeButton();
}

function setContrast(on, save) {
    if (on) document.documentElement.setAttribute("data-contrast", "high");
    else document.documentElement.removeAttribute("data-contrast");
    document
        .querySelectorAll(".contrast")
        .forEach((b) => b.setAttribute("aria-pressed", String(on)));
    if (save) storageSet("contrast", on ? "high" : "normal");
}

function setAccent(name, save) {
    if (!ACCENTS.includes(name)) return;
    document.documentElement.setAttribute("data-accent", name);
    document.querySelectorAll(".swatch").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.accent === name));
    });
    if (save) storageSet("accent", name);
}

function createStyleControlPanel(
    id = "style-control-container",
    align = ALIGN.RIGHT
) {
    const side = getValidAlign(align, ALIGN.RIGHT);
    const container = div(`container style-controls-container align-${side}`);
    if (id) container.id = id;

    const panel = div("style-controls-panel");
    ACCENTS.forEach((name) => {
        const b = button(null, "swatch");
        b.dataset.accent = name;
        b.title = name;
        b.setAttribute("aria-label", "Accent " + name);
        b.onclick = () => setAccent(name, true);
        panel.appendChild(b);
    });

    const c = button("Contrast", "btn contrast");
    c.onclick = () =>
        setContrast(
            !document.documentElement.hasAttribute("data-contrast"),
            true
        );
    panel.appendChild(c);

    const t = button(null, "btn btn-theme");
    t.onclick = toggleTheme;
    panel.appendChild(t);

    const toggle = button("Style", "btn-style");
    const setPanel = (open, save) => {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        if (save) storageSet("controls", open ? "open" : "closed");
    };
    setPanel(storageGet("controls") !== "closed");
    toggle.onclick = () => setPanel(panel.hidden, true);

    container.append(panel, toggle);
    return container;
}

function restoreStyle() {
    const root = document.documentElement;
    const theme = storageGet("theme");
    if (theme) root.setAttribute("data-theme", theme);
    if (storageGet("contrast") === "high") {
        root.setAttribute("data-contrast", "high");
    }
    const accent = storageGet("accent");
    if (ACCENTS.includes(accent)) root.setAttribute("data-accent", accent);
}

function renderStyleControlComponent(
    parent,
    id = "style-control-container",
    align = ALIGN.RIGHT
) {
    if (!parent) return;
    restoreStyle();
    const styleControlComponent = createStyleControlPanel(id, align);
    if (!styleControlComponent) return;
    parent.appendChild(styleControlComponent);

    updateThemeButton();
    setAccent(document.documentElement.getAttribute("data-accent"));
    setContrast(document.documentElement.hasAttribute("data-contrast"));
}
