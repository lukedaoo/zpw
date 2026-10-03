function createNameComponent(id = "site-name", text, align = ALIGN.CENTER) {
    const side = getValidAlign(align);
    const _cls = `name text-align-${side}`;

    const e = p(text, _cls);
    if (id) e.id = id;

    return e;
}

function renderNameComponent(parent, nameId, text, align = ALIGN.CENTER) {
    if (!parent) return;
    const nameComponent = createNameComponent(nameId, text, align);
    if (!nameComponent) return;
    parent.appendChild(nameComponent);
}

const SUBTEXT_SEP = " · ";
const SUBTEXT_PER_ROW = 3;

function createSubtextComponent(
    id = "site-subtext",
    items = [],
    align = ALIGN.CENTER
) {
    const list = [].concat(items).filter(Boolean);
    if (!list.length) return;

    const side = getValidAlign(align);
    const e = div(`subtext text-align-${side}`);
    if (id) e.id = id;

    for (let i = 0; i < list.length; i += SUBTEXT_PER_ROW) {
        const row = list.slice(i, i + SUBTEXT_PER_ROW);
        e.appendChild(p(row.join(SUBTEXT_SEP)));
    }

    return e;
}
