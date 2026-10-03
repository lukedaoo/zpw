function createNavComponent(id = "site-nav", links, align = ALIGN.CENTER) {
    const side = getValidAlign(align);
    const items = links.map((it) => ({ ...it, cls: "nav-link" }));

    const list = bracketed(items, {
        BOX: `nav-list text-align-${side}`,
        BRACKET: "nav-bracket",
        SEP: "nav-sep",
    });
    if (id) list.id = id;

    return list;
}

function renderNavComponent(parent, navId, links, align = ALIGN.CENTER) {
    if (!parent) return;
    const navComponent = createNavComponent(navId, links, align);
    if (!navComponent) return;
    parent.appendChild(navComponent);
}
