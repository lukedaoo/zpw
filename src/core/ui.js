const KEY_PREV = "ArrowLeft";
const KEY_NEXT = "ArrowRight";

function labelLine({ label = "", list = [], sep = " · " } = {}) {
    const line = div("label-line");
    if (label) line.appendChild(el("span", label + ": ", "label-line-label"));
    line.appendChild(document.createTextNode(list.join(sep)));
    return line;
}

function codeLive({ code, live, preview, url } = {}) {
    const links = [];
    if (code) links.push({ label: "code", href: code });
    if (live) links.push({ label: "live", href: live });
    if (url) links.push({ label: "url", href: url });
    if (preview?.length) links.push({ node: previewNode(preview) });
    return links;
}

function openGallery(images, start) {
    const multi = images.length > 1;
    const dlg = el("dialog", null, "gallery");
    const img = el("img");
    const count = el("span", null, "muted");
    let i = start;

    const show = (n) => {
        i = (n + images.length) % images.length;
        img.src = images[i];
        img.alt = "Preview " + (i + 1) + " of " + images.length;
        count.textContent = i + 1 + " / " + images.length;
    };

    const navBtn = (label, aria, fn) => {
        const b = button(label);
        b.setAttribute("aria-label", aria);
        b.onclick = fn;
        return b;
    };

    const bar = div("gallery-bar");
    if (multi) {
        bar.append(
            count,
            navBtn("<", "Previous", () => show(i - 1)),
            navBtn(">", "Next", () => show(i + 1))
        );
    }
    bar.appendChild(navBtn("Close", "Close gallery", () => dlg.close()));

    const thumbs = div("gallery-thumbs");
    if (multi) {
        images.forEach((src, n) => {
            const t = el("img");
            t.src = src;
            t.alt = "";
            t.onclick = () => show(n);
            thumbs.appendChild(t);
        });
    }

    dlg.append(bar, img, thumbs);

    dlg.addEventListener("click", (e) => {
        if (e.target === dlg) {
            dlg.close();
        }
    });
    dlg.addEventListener("keydown", (e) => {
        if (e.key === KEY_PREV) {
            show(i - 1);
        }
        if (e.key === KEY_NEXT) {
            show(i + 1);
        }
    });
    dlg.addEventListener("close", () => dlg.remove());

    document.body.appendChild(dlg);
    show(i);
    dlg.showModal();
}

function previewNode(images) {
    const b = button("preview", "preview");
    b.type = "button";
    b.onclick = () => openGallery(images, 0);
    return b;
}

const ITEM_TONE = Object.freeze({
    ACCENT: "accent",
    MUTED: "muted",
});

function itemHeader(title, { date, links = [], tone = ITEM_TONE.ACCENT } = {}) {
    const head = div("item-head");
    const text = el("p");
    const heading = h(
        3,
        typeof title === "string" ? title : null,
        `item-title item-title-${tone}`
    );
    if (title instanceof Node) heading.appendChild(title);
    text.appendChild(heading);

    if (date) {
        text.appendChild(el("span", " " + date, "muted date"));
    }
    head.appendChild(text);

    if (links.length) {
        head.appendChild(bracketed(links));
    }

    return head;
}

function fold(header, content, cls = "") {
    const d = el("details", null, "fold" + (cls ? " " + cls : ""));
    const sum = el("summary");

    if (typeof header === "string") {
        sum.textContent = header;
    } else if (header) {
        sum.appendChild(header);
    }

    d.open = true;
    d.appendChild(sum);

    if (content) {
        if (Array.isArray(content)) {
            content.forEach((c) => d.appendChild(c));
        } else if (typeof content === "string") {
            const p = el("p", content);
            d.appendChild(p);
        } else {
            d.appendChild(content);
        }
    }

    return d;
}

function sectionItem(title, content, cls = "", meta = null) {
    const isText = typeof title === "string";
    const header = isText ? itemHeader(title, meta || {}) : title;

    return fold(header, content, "fold-item" + (cls ? " " + cls : ""));
}

function section(title, items = [], cls = "") {
    const body = div("section-body");

    items.forEach((it) => {
        body.appendChild(it);
    });

    const header = typeof title === "string" ? h(2, title) : title;
    const sec = fold(header, body, "fold-section" + (cls ? " " + cls : ""));

    return sec;
}

function fillSectionItem(sectionItemNode, lines, footer) {
    if (!lines?.length && !footer) {
        return sectionItemNode;
    }

    const details = div("item-details");

    if (lines?.length) {
        const ul = el("ul", null, "bullets");
        lines.forEach((line) => ul.appendChild(el("li", line)));
        details.appendChild(ul);
    }

    if (footer) {
        if (typeof footer === "string") {
            const footerEl = div("item-footer");
            footerEl.textContent = footer;
            details.appendChild(footerEl);
        } else {
            details.appendChild(footer);
        }
    }

    sectionItemNode.appendChild(details);
    return sectionItemNode;
}
