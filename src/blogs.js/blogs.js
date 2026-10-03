const CLASS_NAME_BLOGSJS_COMPONENT = "z-blogsjs";

const BLOG_CATEGORIES = Object.freeze([
    { key: "paper", title: "Papers" },
    { key: "articles", title: "Articles" },
]);

function postCategory(post) {
    return post.category || "other";
}

function blogItem({ slug, url, title, date, summary } = {}) {
    return {
        title,
        date: date ? String(date) : undefined,
        url: url || `blogs/${slug}.html`,
        lines: summary ? [summary] : [],
    };
}

function blogGroups(posts = []) {
    const map = {};

    for (const post of posts) {
        const cat = postCategory(post);
        if (!map[cat]) map[cat] = [];
        map[cat].push(post);
    }

    const categories = [...BLOG_CATEGORIES];
    for (const cat in map) {
        if (!categories.some((c) => c.key === cat)) {
            categories.push({ key: cat, title: cat });
        }
    }

    const groups = [];
    for (const { key, title } of categories) {
        if (!map[key]?.length) continue;

        map[key].sort((a, b) =>
            String(b.date ?? "").localeCompare(String(a.date ?? ""))
        );

        const list = [];
        for (const item of map[key]) {
            list.push(blogItem(item));
        }

        groups.push({ title, list });
    }

    return groups;
}

// posts: [{ slug, title, date, category, summary }]
function Blogs(posts) {
    if (!posts) return;

    return List(
        { title: "Blogs", groups: blogGroups(posts) },
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
