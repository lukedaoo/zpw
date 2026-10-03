const INTRO_DECK = {
    id: "intro",
    title: "Intro",
    date: "2026-10-03",
    summary: "What this talk is about.",
    slides: [
        { title: "Hello", text: "A plain object per slide." },
        { title: "List", bullets: ["one", "two"] },
        {
            title: "Code",
            code: { lang: "js", text: "const x = 1;" },
        },
        {
            title: "Image",
            image: {
                src: "../example/assets/deck-sample.svg",
                alt: "A picture",
            },
        },
    ],
};

registerDeck(INTRO_DECK);

const INTRO_DECK_2 = {
    id: "intro2",
    title: "Intro",
    date: "2026-10-03",
    summary: "What this talk is about.",
    slides: [
        { title: "Hello", text: "A plain object per slide." },
        { title: "List", bullets: ["one", "two"] },
        {
            title: "Code",
            code: { lang: "js", text: "const x = 1;" },
        },
        {
            title: "Image",
            image: {
                src: "../example/assets/deck-sample.svg",
                alt: "A picture",
            },
        },
    ],
};

registerDeck(INTRO_DECK_2);
