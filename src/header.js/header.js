const CLASS_NAME_HEADERJS_COMPONENT = "z-headerjs";

function createHeaderComponent({
    name = "",
    links = [],
    nameAlign = ALIGN.CENTER,
    navAlign = ALIGN.CENTER,
    id = "site-header",
    nameId = "site-name",
    navId = "site-nav",
} = {}) {
    const header = el("header", "", `${CLASS_NAME_HEADERJS_COMPONENT}`);
    if (id) header.id = id;

    if (name) {
        header.appendChild(
            createNameComponent(nameId, name, getValidAlign(nameAlign))
        );
    }

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
