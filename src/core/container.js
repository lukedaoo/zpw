const LAYOUT = Object.freeze({
    COMPACT: "640px", // Minimalist text, single-column homepages
    BLOG: "720px", // Optimal line length for long-form articles
    READ: "800px", // Technical posts with wide code blocks or tables
    WIDE: "960px", // Grid listings, portfolios, projects page
    FULL: "1140px", // Multi-column layouts, dashboards
});

function container(width = LAYOUT.COMPACT, cls = "container") {
    const isCustomWidth =
        typeof width === "string" && !width.startsWith("layout-");

    if (isCustomWidth) {
        return div(cls, {
            maxWidth: width,
            width: "100%",
            marginInline: "auto",
        });
    }

    const widthClass = width.startsWith("layout-") ? width : `layout-${width}`;
    const combinedCls = cls ? `${widthClass} ${cls}` : widthClass;
    return div(combinedCls);
}

function createPageComponent(options = {}) {
    const {
        width = LAYOUT.COMPACT,
        cls = "container",
        id = "container",
        header = null,
        main = null,
        footer = null,
    } = options;

    const page = container(width, cls);
    if (id) page.id = id;

    [header, main, footer]
        .filter((node) => node instanceof Node)
        .forEach((node) => page.appendChild(node));

    return page;
}

function renderPage(parent = document.body, options = {}) {
    const pageNode = createPageComponent(options);
    parent.prepend(pageNode);
}
