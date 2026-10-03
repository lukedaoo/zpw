const LANGUAGES_DECK = {
    id: "languages",
    title: "Code highlighting",
    date: "2026-10-04",
    summary: "One slide per supported language. Try the Code dropdown.",
    category: "talks",
    slides: [
        {
            title: "Code slides",
            text: "Set code.lang to pick the language. Switch themes with the Code dropdown in the bar.",
        },
        {
            title: "HTML",
            code: {
                lang: "html",
                text: '<!doctype html>\n<!-- a comment -->\n<a class="btn" href="/deck">Open &amp; play</a>',
            },
        },
        {
            title: "CSS",
            code: {
                lang: "css",
                text: '/* theme */\n@media (min-width: 600px) {\n    .deck a:hover {\n        color: #4ade80;\n        margin: -0.5rem 2px;\n        content: "x";\n    }\n}',
            },
        },
        {
            title: "JavaScript",
            code: {
                lang: "js",
                text: "// register a deck\nclass Deck extends Base {\n    async load(id = 42) {\n        return `deck ${id}` ?? null;\n    }\n}",
            },
        },
        {
            title: "Java",
            code: {
                lang: "java",
                text: '@Override\npublic static void main(String[] args) {\n    List<String> names = new ArrayList<>();\n    int count = 3; // slides\n    System.out.println("hi");\n}',
            },
        },
        {
            title: "C",
            code: {
                lang: "c",
                text: '#include <stdio.h>\n#define MAX 10\n\nint main(void) {\n    uint8_t n = 0xFF; // byte\n    printf("%d\\n", MAX);\n    return 0;\n}',
            },
        },
        {
            title: "C++",
            code: {
                lang: "cpp",
                text: "#include <memory>\n\nnamespace app {\ntemplate <typename T>\nclass Box {\npublic:\n    virtual void run() noexcept;\n};\n}\n\nauto p = std::make_unique<app::Box<int>>();",
            },
        },
        {
            title: "Python",
            code: {
                lang: "python",
                text: '# a comment\ndef greet(name="world"):\n    return f"hello {name}" if name else None',
            },
        },
    ],
};

registerDeck(LANGUAGES_DECK);
