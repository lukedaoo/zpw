const INTRO_DECK = {
    id: "intro",
    title: "Intro to zpw",
    date: "2026-10-03",
    summary: "What zpw is and how the modules fit together.",
    category: "talks",
    slides: [
        {
            title: "zpw",
            text: "A small toolkit for personal sites. Plain HTML, CSS and JS.",
        },
        {
            title: "Modules",
            bullets: [
                "header, footer: page chrome",
                "resume, updates, blogs: content lists",
                "seo: head tags and favicon",
                "deck: slide shows, like this one",
            ],
        },
        {
            title: "Use one module",
            text: "Each module is a standalone bundle.",
            code: {
                lang: "html",
                text: '<script defer src="header.min.js"></script>',
            },
        },
        {
            title: "Keys",
            bullets: [
                "Left / Right: previous, next",
                "Home / End: first, last",
                "f: fullscreen",
                "Esc: close",
            ],
        },
        {
            title: "Images",
            image: {
                src: "assets/deck-sample.svg",
                alt: "Sample bar chart",
            },
        },
    ],
};

registerDeck(INTRO_DECK);
