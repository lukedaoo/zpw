# Zod Personal Website

A template to build my personal website.

## Motivation

I just want a fully personal website template that has zero dependencies at runtime: pure HTML + CSS + JS.
With the help of AI, it could be done easily.

## Modules

- core: the common code used by the other modules
- header.js, footer.js: a simple text-based header and footer for a website
- resume.js: displays your work and personal projects
- updates.js: for writing quick notes, like life event updates, reflections, etc.
- blogs.js: write articles in Markdown. All Markdown files are compiled into pure HTML at build time, so the deployed site is just HTML: no plugin or Markdown needed at runtime. It does have a system dependency on pandoc.
- seo.js: a simple way to add SEO tags, along with a favicon, to a website
- deck.js: PowerPoint-style presentations. You write your slides as plain JavaScript objects and you have a presentation.
- app.js: the entry point of a single-page site. Routes use the URL hash (`#/blogs`), so the server only has to serve `index.html`. You decide which routes to add to your website; it could be just resume + updates. You name them.

## Technical decisions

- Technology supported by all browsers: vanilla JS, HTML and CSS.
- Runtime dependencies: JavaScript, HTML and CSS.
- System dependencies: make, pandoc, npx esbuild (to minify CSS and JS), shell scripts.
- Each module can be used standalone or as a bundle (all modules in one).

## Getting started

- Take a look at the [live demo](https://lukedaoo.github.io/zpw/).
- Check the example (the port can vary):

    ```sh
    make example && npx live-server
    ```

    Then open `localhost:8080/example`.

- Or build everything:

    ```sh
    make all && npx live-server
    ```

    Then open `localhost:8080/dist` or `localhost:8080/dist/standalone/*.html`.

- To try the snippets from the wiki, run `make all`, then open `localhost:8080/test/`.
- To publish a release: `scripts/release.sh patch`, then push the tag. See the wiki.

## Wiki

See [WIKI.md](WIKI.md).

## License

MIT
