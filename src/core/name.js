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
