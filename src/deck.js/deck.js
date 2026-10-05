const CLASS_NAME_DECKJS_COMPONENT = "z-deckjs";

const DECK_PARAM = "deck";
const SLIDE_PARAM = "s";
const DECK_UNGROUPED = "All";

const KEYS_PREV = [KEY_PREV, "PageUp"];
const KEY_SPACE = " ";
const KEYS_NEXT = [KEY_NEXT, "PageDown", KEY_SPACE];
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_FULLSCREEN = "f";
const KEY_ESCAPE = "Escape";

const OPEN_SOURCE = Object.freeze({ CLICK: "click", URL: "url" });

const DECK_REGISTRY = [];
let activePlayer = null;

function findDeck(id) {
    return DECK_REGISTRY.find((d) => d.id === id);
}

// def: { id, title, date?, summary?, category?, slides: [slide] }
// slide: { title?, text?, bullets?, code?: { lang?, text } | string,
//          image?: { src, alt? } }
function registerDeck(def = {}) {
    if (!def.id) {
        throw new Error("registerDeck: id is required");
    }
    if (!def.slides?.length) {
        throw new Error(`registerDeck(${def.id}): slides is empty`);
    }
    if (findDeck(def.id)) {
        throw new Error(`registerDeck(${def.id}): duplicate id`);
    }

    DECK_REGISTRY.push(def);
}

function renderSlide(slide = {}) {
    const node = div("deck-slide");

    if (slide.title) {
        node.appendChild(h(2, slide.title, "deck-slide-title"));
    }

    if (slide.text) {
        node.appendChild(p(slide.text, "deck-slide-text"));
    }

    if (slide.bullets?.length) {
        const ul = el("ul", "", "deck-slide-bullets");
        slide.bullets.forEach((b) => ul.appendChild(el("li", b)));
        node.appendChild(ul);
    }

    if (slide.code) {
        const code =
            typeof slide.code === "string" ? { text: slide.code } : slide.code;
        const pre = el("pre", "", "deck-slide-code sourceCode");
        const c = el("code");
        if (code.lang) {
            c.className = `language-${code.lang}`;
        }
        c.appendChild(highlight(code.text, code.lang));
        pre.appendChild(c);
        node.appendChild(pre);
    }

    if (slide.image) {
        const img = el("img", "", "deck-slide-image");
        img.src = slide.image.src;
        img.alt = slide.image.alt || "";
        node.appendChild(img);
    }

    return node;
}

function deckItem({ id, title, date, summary }) {
    const lines = Array.isArray(summary) ? summary : summary ? [summary] : [];

    return {
        title,
        date: date?.toString(),
        url: `?${DECK_PARAM}=${encodeURIComponent(id)}`,
        lines,
    };
}

function deckGroups(decks) {
    const groups = new Map();

    for (const deck of decks) {
        const category = deck.category || DECK_UNGROUPED;

        if (!groups.has(category)) {
            groups.set(category, []);
        }

        groups.get(category).push(deck);
    }

    const result = [];

    for (const [title, decksInGroup] of groups) {
        decksInGroup.sort((a, b) => {
            const dateA = String(a.date || "");
            const dateB = String(b.date || "");

            return dateB.localeCompare(dateA);
        });

        result.push({
            title,
            list: decksInGroup.map(deckItem),
        });
    }

    return result;
}

// List of every registered deck. Clicking one opens the player.
function Decks({ title = "Decks" } = {}) {
    const container = List(
        { title, groups: deckGroups(DECK_REGISTRY) },
        {
            id: "site-decks",
            cls: `decks-container ${CLASS_NAME_DECKJS_COMPONENT}`,
        }
    );

    container.addEventListener("click", (e) => {
        const a = e.target.closest(`a[href^="?${DECK_PARAM}="]`);
        if (!a) {
            return;
        }

        e.preventDefault();
        openDeck(new URL(a.href).searchParams.get(DECK_PARAM));
    });

    return container;
}

function deckUrl(id, index) {
    const url = new URL(location.href);
    url.searchParams.set(DECK_PARAM, id);
    url.searchParams.set(SLIDE_PARAM, String(index + 1));
    return url.toString();
}

function stripDeckParams() {
    const url = new URL(location.href);
    url.searchParams.delete(DECK_PARAM);
    url.searchParams.delete(SLIDE_PARAM);
    return url.toString();
}

function closePlayer() {
    activePlayer?.close();
}

function toggleFullscreen(target) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }
    target.requestFullscreen?.();
}

function openDeck(id, start = 0, source = OPEN_SOURCE.CLICK) {
    const deck = findDeck(id);
    if (!deck) {
        return;
    }

    closePlayer();

    const total = deck.slides.length;
    let index = 0;

    const dlg = el("div", "", "deck-player");
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-label", deck.title);

    const stage = div("deck-stage");
    const fill = div("deck-progress-fill");
    const progress = div("deck-progress");
    progress.appendChild(fill);
    const count = el("span", "", "muted deck-count");

    const show = (n) => {
        index = Math.min(Math.max(n, 0), total - 1);
        stage.replaceChildren(renderSlide(deck.slides[index]));
        count.textContent = `${index + 1} / ${total}`;
        fill.style.width = `${((index + 1) / total) * 100}%`;
        history.replaceState({ deck: id }, "", deckUrl(id, index));
    };

    const navBtn = (label, aria, fn) => {
        const b = button(label);
        b.setAttribute("aria-label", aria);
        b.onclick = fn;
        return b;
    };

    const bar = div("deck-bar");
    const hasCode = deck.slides.some((s) => s.code);
    bar.append(
        el("span", deck.title, "deck-title"),
        count,
        ...(hasCode ? [createCodeThemeControl()] : []),
        navBtn("<", "Previous slide", () => show(index - 1)),
        navBtn(">", "Next slide", () => show(index + 1)),
        navBtn("Full", "Toggle fullscreen", () => toggleFullscreen(dlg)),
        navBtn("Close", "Close deck", () => close())
    );

    dlg.append(stage, progress, bar);

    const onKey = (e) => {
        if (e.key === KEY_ESCAPE) {
            close();
            return;
        }

        if (e.key === KEY_SPACE && e.target.closest("button")) {
            return;
        }

        const handled = [...KEYS_PREV, ...KEYS_NEXT, KEY_HOME, KEY_END];
        if (KEYS_PREV.includes(e.key)) {
            show(index - 1);
        } else if (KEYS_NEXT.includes(e.key)) {
            show(index + 1);
        } else if (e.key === KEY_HOME) {
            show(0);
        } else if (e.key === KEY_END) {
            show(total - 1);
        } else if (e.key === KEY_FULLSCREEN) {
            toggleFullscreen(dlg);
        }

        if (handled.includes(e.key)) {
            e.preventDefault();
        }
    };

    const close = () => {
        document.removeEventListener("keydown", onKey);
        dlg.remove();
        if (activePlayer?.close === close) {
            activePlayer = null;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        const hasParams = new URL(location.href).searchParams.has(DECK_PARAM);
        if (!hasParams) {
            return;
        }
        if (source === OPEN_SOURCE.CLICK && history.state?.deck === id) {
            history.back();
            return;
        }
        history.replaceState(null, "", stripDeckParams());
    };

    document.body.appendChild(dlg);
    renderStyleControlComponent(dlg, "deck-style-control", ALIGN.RIGHT);
    document.addEventListener("keydown", onKey);
    activePlayer = { id, close };

    if (source === OPEN_SOURCE.CLICK) {
        history.pushState({ deck: id }, "", deckUrl(id, 0));
    }
    show(start);
}

function openDeckFromUrl() {
    const params = new URL(location.href).searchParams;
    const id = params.get(DECK_PARAM);
    if (!id || activePlayer?.id === id) {
        return;
    }

    openDeck(id, Number(params.get(SLIDE_PARAM) || 1) - 1, OPEN_SOURCE.URL);
}

addEventListener("DOMContentLoaded", openDeckFromUrl);
addEventListener("popstate", () => {
    const hasParams = new URL(location.href).searchParams.has(DECK_PARAM);
    if (hasParams) {
        openDeckFromUrl();
        return;
    }
    closePlayer();
});
