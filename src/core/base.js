function el(tag, text, clsOrStyles, styles) {
    const e = document.createElement(tag);
    if (text) e.textContent = text;

    if (typeof clsOrStyles === "string") {
        if (clsOrStyles) e.className = clsOrStyles;
        if (styles && typeof styles === "object")
            Object.assign(e.style, styles);
    } else if (clsOrStyles && typeof clsOrStyles === "object") {
        Object.assign(e.style, clsOrStyles);
    }

    return e;
}

function h(level, text, clsOrStyles, styles) {
    return el(`h${level}`, text, clsOrStyles, styles);
}

function div(clsOrStyles, styles) {
    return el("div", "", clsOrStyles, styles);
}

function p(text, clsOrStyles, styles) {
    return el("p", text, clsOrStyles, styles);
}

function button(text, clsOrStyles = "btn", styles) {
    return el("button", text, clsOrStyles, styles);
}

function link(label, href, cls = "", styles = {}) {
    const a = el("a", label, cls, styles);
    a.href = href;
    if (/^https?:/.test(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }
    return a;
}

const ALIGN = Object.freeze({
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
});

function getValidAlign(align, fallback = ALIGN.CENTER) {
    const valid = Object.values(ALIGN).includes(align);
    return valid ? align : fallback;
}

const BRACKETED_CLS = Object.freeze({
    BOX: "bracketed",
    BRACKET: "muted",
    SEP: "sep",
});

function bracketed(items, cls = BRACKETED_CLS) {
    const box = el("span", null, cls.BOX);
    box.appendChild(el("span", "[ ", cls.BRACKET));

    items.forEach((it, i) => {
        if (i) {
            box.appendChild(el("span", "|", cls.SEP));
        }
        box.appendChild(it.node || link(it.label, it.href, it.cls));
    });

    box.appendChild(el("span", " ]", cls.BRACKET));
    return box;
}
