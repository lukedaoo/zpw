const CLASS_NAME_BLOGSJS_COMPONENT = "z-blogsjs";

function blogItem({ slug, url, title, date, summary } = {}) {
    const lines = Array.isArray(summary) ? summary : summary ? [summary] : [];
    return {
        title,
        date: date ? String(date) : undefined,
        url: url || `blogs/${slug}.html`,
        lines,
    };
}

// posts: [{ slug, title, date, category?, summary }]
// category is free text; each distinct value becomes a group.
function Blogs(posts) {
    if (!posts) return;

    return List(
        { title: "Blogs", groups: listGroups(posts, blogItem) },
        {
            id: "site-blogs",
            cls: `blogs-container ${CLASS_NAME_BLOGSJS_COMPONENT}`,
        }
    );
}

// Runs on a generated post page: adds the style panel and the top button.
function BlogPost() {
    renderPage(document.body, {
        width: LAYOUT.BLOG,
        header: document.querySelector(".blog-nav"),
        main: document.querySelector(".blog-post"),
    });
    renderStyleControlComponent(
        document.body,
        "style-control-container",
        ALIGN.RIGHT
    );
    renderGoToTopButton(document.body, "scroll-to-top", ALIGN.RIGHT);
    renderCodeThemeControl(document.body);
}
