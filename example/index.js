App({
    header: HEADER_CONTENT,
    footer: FOOTER_CONTENT,
    favicon: { text: "LD", bg: "#111111", fg: "#4ade80" },
    seo: {
        description: "Loc Dao (LD), software engineer. Projects and writing.",
        siteName: "Loc Dao (LD)",
        author: "Loc Dao",
        themeColor: "#111111",
    },
    routes: [
        { path: "/", render: () => Resume(RESUME_CONTENT) },
        {
            path: "/updates",
            title: "Updates",
            render: () => Updates(UPDATES_CONTENT),
        },
        {
            path: "/blogs",
            title: "Blogs",
            render: () => Blogs(BLOGS_INDEX),
        },
    ],
});
