# zpw Wiki

Short recipes. Every snippet is plain JS, no build step on your side.

## 1. A whole site (bundle)

`index.html`:

```html
<link rel="stylesheet" href="zpw.min.css" />
<script defer src="zpw.min.js"></script>
<script defer src="content.js"></script>
<script defer src="index.js"></script>
<body></body>
```

`index.js`:

```js
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
    ],
});
```

Routes use the URL hash: `index.html#/updates`. The server only serves `index.html`, so any static host works.

`App` options:

| Option    | Meaning                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `header`  | Options for `Header()`; `header.name` is also the page-title suffix.                                     |
| `footer`  | Options for `Footer()`.                                                                                  |
| `routes`  | List of routes (below).                                                                                  |
| `width`   | Page width: `LAYOUT.COMPACT` (default), `BLOG`, `READ`, `WIDE`, `FULL`, or any CSS width like `"900px"`. |
| `seo`     | Defaults for `Seo()`, applied on every route (see section 8).                                            |
| `favicon` | Options for `Favicon()` (see section 8).                                                                 |

A route is `{ path, title?, render, seo? }`:

- `render` returns a DOM node, such as `Resume(...)`, `Blogs(...)` or `Decks()`.
- `title` becomes `"<title> · <header.name>"` in the tab. Without it, the tab shows `header.name`.
- `seo` overrides the `App` defaults for that route only, for example `{ description: "My posts" }`.
- An unknown path shows "Page not found." with a link home.

`App` also adds the style panel and the "Top" button, and returns `{ go(path), show(path) }`:

```js
const app = App({ header, routes });
app.go("/blogs"); // same as clicking a link to #/blogs
```

## 2. One module only (standalone)

Load just that module's `.min.css` and `.min.js`, then call it:

```html
<link rel="stylesheet" href="header.min.css" />
<script defer src="header.min.js"></script>
<script defer>
    addEventListener("DOMContentLoaded", () => {
        document.body.append(
            Header({ name: "Loc Dao", links: [{ label: "home", href: "#/" }] })
        );
    });
</script>
```

Modules: `header`, `footer`, `resume`, `updates`, `blogs`, `deck`, `seo`, and `zpw` (all of them). Working pages for each module except `zpw` are in `dist/standalone/<module>.js.html`.

Load only one bundle per page: each one embeds the same base code, so a second one fails with `Identifier 'ALIGN' has already been declared`. To use several modules together, load `zpw` instead.

## 3. Header and footer

```js
const HEADER_CONTENT = {
    name: "Loc Dao (LD)",
    subtext: [["Software Engineer", "Seattle"], ["me@example.com"]],
    links: [
        { label: "home", href: "#/" },
        { label: "github", href: "https://github.com/you" },
    ],
};
const FOOTER_CONTENT = { text: "Copyright by LD" };
```

`subtext` items are joined with `·`. A flat list wraps every 3 items; a list of lists is one row per inner list.

Register in `App`: header and footer are options, not routes. They show on every page.

```js
App({ header: HEADER_CONTENT, footer: FOOTER_CONTENT, routes: [] });
```

## 4. Resume

```js
const RESUME_CONTENT = {
    hello: { title: "Hello", greeting: "Hi, I like coding." },
    work: {
        title: "Work",
        companies: [
            {
                name: "Company ABC",
                date: { start: "Jan 2024", end: "Present" },
                roles: [
                    {
                        title: "Software Engineer",
                        date: { start: "Jan 2024", end: "Present" },
                        lines: ["Built core platform services."],
                        links: {
                            code: "https://github.com/x/y",
                            preview: ["assets/a.png"],
                        },
                        techs: ["React", "Node.js"],
                    },
                ],
            },
        ],
    },
};
```

`Resume(RESUME_CONTENT)` returns the page. `projects` groups projects by domain:

```js
projects: {
    title: "Projects",
    domains: [
        {
            title: "Web",
            projects: [
                {
                    name: "My site",
                    lines: ["A personal website."],
                    links: { live: "https://example.com" },
                    techs: ["HTML", "CSS", "JS"],
                },
            ],
        },
    ],
},
```

Register in `App`:

```js
{ path: "/", render: () => Resume(RESUME_CONTENT) }
```

## 5. Updates

```js
const UPDATES_CONTENT = {
    title: "Updates",
    groups: [
        {
            title: "2026",
            list: [{ date: "2026-10-01", title: "Hello", lines: ["World"] }],
        },
    ],
};
```

Register in `App`:

```js
{ path: "/updates", title: "Updates", render: () => Updates(UPDATES_CONTENT) }
```

## 6. Blog (Markdown)

Put posts in `posts/<slug>.md`:

````md
---
title: Hello World
subtitle: A first post.
author: Loc Dao
date: 2026-10-01
category: articles
summary: Short text for the list and for search engines.
image: https://example.com/card.png
imagealt: Card image
---

Your **Markdown** here. Code blocks are highlighted:

```c
int main(void) { return 0; }
```
````

Then `make`. It writes `blogs/<slug>.html` (static HTML) and `blogs-index.js`. Load `blogs-index.js` in `index.html`, then register the list in `App`. Each post is its own HTML page, so it is not a route:

```js
{ path: "/blogs", title: "Blogs", render: () => Blogs(BLOGS_INDEX) }
```

Building posts needs `pandoc`.

### Code themes

A post page that has code blocks shows a "Code:" dropdown at the bottom left. The choice is saved in `localStorage` (key `code-theme`) and is shared with deck slides.

| Theme                                                                          | Look                                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `default`                                                                      | Follows the site light/dark theme and the accent color.            |
| `monokai`, `nord`, `gruber-darker`, `github-dark`, `github-light`, `solarized` | Fixed palette with its own background, whatever the site theme is. |

Add your own theme in two places. First the colors, in `src/blogs.js/blogs-code-colortheme.css`:

```css
[data-code-theme="my-theme"] {
    --code-bg: #101820;
    --code-fg: #e0e0e0;
    --code-kw: #ffcc00; /* keywords */
    --code-type: #6cb6ff; /* types, attribute names */
    --code-num: #c792ea; /* numbers */
    --code-str: #a5d6a7; /* strings */
    --code-com: #6a737d; /* comments */
}
```

Then its name, in the `CODE_THEMES` list in `src/blogs.js/blogs-code-colortheme.js`:

```js
const CODE_THEMES = [CODE_THEME_DEFAULT, "monokai", "my-theme"];
```

Posts get colors from pandoc's token classes (`.kw`, `.st`, `.co`, ...). Deck slides use their own small highlighter that emits the same classes, so a theme applies to both.

## 7. Decks (slides)

One file per deck, `decks/<name>.js`:

```js
const INTRO_DECK = {
    id: "intro",
    title: "Intro",
    date: "2026-10-03",
    summary: "What this talk is about.",
    slides: [
        { title: "Hello", text: "A plain object per slide." },
        { title: "List", bullets: ["one", "two"] },
        { title: "Code", code: { lang: "js", text: "const x = 1;" } },
        { title: "Image", image: { src: "assets/a.png", alt: "A picture" } },
    ],
};

registerDeck(INTRO_DECK);
```

Load the deck files after the bundle and before `index.js`, so `registerDeck` exists when they run:

```html
<script defer src="zpw.min.js"></script>
<script defer src="decks/intro.js"></script>
<script defer src="index.js"></script>
```

Register in `App`:

```js
{ path: "/decks", title: "Decks", render: () => Decks() }
```

Keys: `←` `→` change slide, `Home`/`End`, `f` fullscreen, `Esc` close. A slide has a link: `?deck=intro&s=2`.

`code.lang`: `html`, `css`, `js`, `java`, `c`, `cpp`, `python`, `sh`. Others get a generic highlight.

## 8. SEO and favicon

Register in `App`: they are options, not routes. `seo` sets the defaults, and each route can override them.

```js
App({
    // ...
    favicon: { text: "LD", bg: "#111111", fg: "#4ade80" },
    seo: {
        description: "Software engineer.",
        url: "https://example.com/",
        siteName: "Example",
        image: "https://example.com/card.png",
        imageAlt: "Card",
    },
});
```

Or without `App`:

```js
Seo({ title: "My page", description: "Hello." });
Favicon({ emoji: "🚀" }); // also { href: "assets/favicon.svg" }
```

Crawlers and social cards do not run JS, so also put the same tags in `index.html`. Posts get theirs from the front matter at build time.

## 9. Build

| Command                                         | Output                                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| `make`                                          | `dist/`: bundles, standalone pages, demo site, posts    |
| `make demo`                                     | `dist-github/`: the demo for GitHub Pages               |
| `make example`                                  | posts for running `example/` from source                |
| `make release`                                  | `dist-release/`: only the versioned module bundles      |
| `make demo SITE_URL=https://you.github.io/zpw/` | also writes `sitemap.xml`, and `robots.txt` links to it |

`SITE_URL` needs a trailing slash. It also enables `canonical` and `og:url` on posts.

`make`, `make demo` and `make example` run `make clean` first, so each one wipes `dist/`, `dist-github/`, `dist-release/` and the generated posts before building. `make release` only replaces `dist-release/`.

To try the snippets from this wiki, run `make`, serve the repo (`npx live-server`) and open `/test/`. There is one page per section.

## 10. Release

```sh
scripts/release.sh patch   # or minor | major
git push origin HEAD v1.1.1
```

The script:

1. bumps the `VERSION` file (`v1.1.0` to `v1.1.1`),
2. runs `make release`, and stops without a commit or tag if the build fails,
3. commits `chore: release v1.1.1` and tags it.

It does not push. Pushing the tag runs the Release workflow, which runs `make release` and uploads everything in `dist-release/` (`<module>-vX.Y.Z.min.{js,css}`) as release assets. Each bundle starts with a `/*! zpw vX.Y.Z */` comment.

## 11. Style controls

The panel (accent color, contrast, light/dark) is added by `App`. The choice is saved in `localStorage`. To add it to a standalone page, call it after the page has loaded:

```js
addEventListener("DOMContentLoaded", () => {
    renderStyleControlComponent(document.body);
});
```

Only the `blogs`, `deck` and `zpw` bundles contain the panel. The other standalone bundles do not.
