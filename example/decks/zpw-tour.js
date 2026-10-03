const ZPW_TOUR_DECK = {
    id: "zpw-tour",
    title: "Writing a deck",
    date: "2026-10-02",
    summary: "One file per deck, slides are plain objects.",
    category: "talks",
    slides: [
        { title: "One file per deck", text: "Put it in decks/<name>.js." },
        {
            title: "Register it",
            code: {
                lang: "js",
                text: 'const MY_DECK = {\n    id: "my-deck",\n    title: "My deck",\n    slides: [{ title: "Hello" }],\n};\n\nregisterDeck(MY_DECK);',
            },
        },
        {
            title: "Slide fields",
            bullets: ["title", "text", "bullets", "code", "image"],
        },
        { title: "List them", code: "document.body.append(Decks());" },
    ],
};

registerDeck(ZPW_TOUR_DECK);
