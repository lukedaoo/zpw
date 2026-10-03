const CLASS_NAME_HEADERJS_COMPONENT = "z-headerjs";

function createHeaderComponent({
    name = "",
    subtext = [],
    links = [],
    nameAlign = ALIGN.CENTER,
    subtextAlign = nameAlign,
    navAlign = ALIGN.CENTER,
    id = "site-header",
    nameId = "site-name",
    subtextId = "site-subtext",
    navId = "site-nav",
} = {}) {
    const header = el("header", "", `${CLASS_NAME_HEADERJS_COMPONENT}`);
    if (id) header.id = id;

    if (name) {
        header.appendChild(
            createNameComponent(nameId, name, getValidAlign(nameAlign))
        );
    }

    const subtextNode = createSubtextComponent(
        subtextId,
        subtext,
        getValidAlign(subtextAlign)
    );
    if (subtextNode) header.appendChild(subtextNode);

    const hasNav = links && links.length;

    if (hasNav) {
        header.appendChild(
            createNavComponent(navId, links, getValidAlign(navAlign))
        );
    }

    return header;
}

function Header(options) {
    return createHeaderComponent(options);
}
