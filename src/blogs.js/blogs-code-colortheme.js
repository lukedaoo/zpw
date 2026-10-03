const CODE_THEME_DEFAULT = "default";
const CODE_THEME_KEY = "code-theme";
const CODE_THEMES = [
    CODE_THEME_DEFAULT,
    "monokai",
    "nord",
    "gruber-darker",
    "github-dark",
    "github-light",
    "solarized",
];

function setCodeTheme(name, save) {
    const root = document.documentElement;
    if (name === CODE_THEME_DEFAULT) root.removeAttribute("data-code-theme");
    else root.setAttribute("data-code-theme", name);
    if (save) storageSet(CODE_THEME_KEY, name);
}

function createCodeThemeControl() {
    const saved = storageGet(CODE_THEME_KEY);
    const current = CODE_THEMES.includes(saved) ? saved : CODE_THEME_DEFAULT;
    setCodeTheme(current);

    const box = div("code-theme-control");
    const select = el("select", "", "code-theme-select");
    select.setAttribute("aria-label", "Code theme");

    for (const name of CODE_THEMES) {
        const o = el("option", name);
        o.value = name;
        select.appendChild(o);
    }
    select.value = current;
    select.onchange = () => setCodeTheme(select.value, true);

    box.append(el("span", "Code:"), select);
    return box;
}

function renderCodeThemeControl(parent = document.body) {
    if (!document.querySelector(".sourceCode")) return;
    parent.appendChild(createCodeThemeControl());
}
