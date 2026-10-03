const CLASS_NAME_APPJS_COMPONENT = "z-appjs";

function normalizePath(path) {
    const clean = path
        .replace(/\/index\.html$/, "/")
        .replace(/\.html$/, "")
        .replace(/\/+$/, "");
    return clean || "/";
}

// Hash routing: the route lives in the URL fragment (index.html#/blogs), so
// the server only ever has to serve index.html.
function currentRoute() {
    return normalizePath(location.hash.replace(/^#/, ""));
}

function notFoundBody() {
    const box = div("not-found");
    box.append(p("Page not found."), link("Back to home", "#/"));
    return box;
}

function App({
    header = {},
    routes = [],
    footer = {},
    width = LAYOUT.COMPACT,
} = {}) {
    const byPath = new Map(routes.map((r) => [normalizePath(r.path), r]));
    const siteName = header.name || "";

    const headerNode = Header(header);
    const footerNode = Footer(footer);
    const body = el("main", "", `${CLASS_NAME_APPJS_COMPONENT}-body`);
    body.id = "site-body";

    const markActive = (path) => {
        headerNode.querySelectorAll("a[href^='#']").forEach((a) => {
            const active = normalizePath(a.hash.slice(1)) === path;
            if (active) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    };

    const show = (path) => {
        const route = byPath.get(path);
        body.replaceChildren(route ? route.render() : notFoundBody());
        document.title = route?.title
            ? `${route.title} · ${siteName}`
            : siteName;
        markActive(path);
    };

    const go = (path) => {
        if (path === currentRoute()) scrollTo({ top: 0 });
        else location.hash = path;
    };

    // Hash links navigate natively; we only react to the route change.
    addEventListener("hashchange", () => {
        show(currentRoute());
        scrollTo({ top: 0 });
    });

    renderPage(document.body, {
        width,
        header: headerNode,
        main: body,
        footer: footerNode,
    });
    renderStyleControlComponent(
        document.body,
        "style-control-container",
        ALIGN.RIGHT
    );
    renderGoToTopButton(document.body, "scroll-to-top", ALIGN.RIGHT);

    show(currentRoute());

    return { go, show };
}
