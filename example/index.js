App({
    header: HEADER_CONTENT,
    footer: FOOTER_CONTENT,
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
