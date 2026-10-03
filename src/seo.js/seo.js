const SEO_JSONLD_ID = "seo-jsonld";
const SEO_FAVICON_ID = "seo-favicon";
const SEO_APPLE_ID = "seo-apple-touch";
const SEO_CARD_LARGE = "summary_large_image";
const SEO_CARD_SMALL = "summary";
const SVG_MIME = "image/svg+xml";

function seoTag(tag, selector, attrs) {
    let node = document.head.querySelector(selector);
    if (!node) {
        node = el(tag);
        document.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
}

function seoMeta(name, content) {
    if (!content) {
        return;
    }
    seoTag("meta", `meta[name="${name}"]`, { name, content });
}

function seoProp(property, content) {
    if (!content) {
        return;
    }
    seoTag("meta", `meta[property="${property}"]`, { property, content });
}

function seoLink(rel, href, id) {
    if (!href) {
        return;
    }
    const selector = id ? `#${id}` : `link[rel="${rel}"]`;
    const attrs = { rel, href };
    if (id) {
        attrs.id = id;
    }
    seoTag("link", selector, attrs);
}

function Seo({
    title,
    description,
    url,
    image,
    imageAlt,
    type = "website",
    siteName,
    author,
    themeColor,
    locale,
    robots,
    jsonLd,
} = {}) {
    if (title) {
        document.title = title;
    }

    seoMeta("description", description);
    seoMeta("author", author);
    seoMeta("theme-color", themeColor);
    seoMeta("robots", robots);
    seoLink("canonical", url);

    seoProp("og:type", type);
    seoProp("og:site_name", siteName);
    seoProp("og:title", title);
    seoProp("og:description", description);
    seoProp("og:url", url);
    seoProp("og:image", image);
    seoProp("og:image:alt", imageAlt);
    seoProp("og:locale", locale);

    seoMeta("twitter:card", image ? SEO_CARD_LARGE : SEO_CARD_SMALL);
    seoMeta("twitter:title", title);
    seoMeta("twitter:description", description);
    seoMeta("twitter:image", image);
    seoMeta("twitter:image:alt", imageAlt);

    if (jsonLd) {
        const node = seoTag("script", `#${SEO_JSONLD_ID}`, {
            id: SEO_JSONLD_ID,
            type: "application/ld+json",
        });
        node.textContent = JSON.stringify(jsonLd);
    }
}

// Inline SVG, so no image file is needed.
//   Favicon({ emoji: "<emoji>" })
//   Favicon({ text: "LD", bg: "#111", fg: "#4ade80" })
//   Favicon({ href: "assets/favicon.png", appleTouch: "assets/touch.png" })
function faviconSvg({ emoji, text, bg = "#111111", fg = "#ffffff" }) {
    if (emoji) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
    }

    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
        `<rect width="100" height="100" rx="20" fill="${bg}"/>` +
        `<text x="50" y="50" text-anchor="middle" dominant-baseline="central" ` +
        `font-family="sans-serif" font-weight="700" font-size="52" fill="${fg}">${text}</text>` +
        `</svg>`
    );
}

function Favicon(options = {}) {
    const { href, appleTouch } = options;

    if (href) {
        seoLink("icon", href, SEO_FAVICON_ID);
    } else if (options.emoji || options.text) {
        const svg = faviconSvg(options);
        seoLink(
            "icon",
            `data:${SVG_MIME},${encodeURIComponent(svg)}`,
            SEO_FAVICON_ID
        );
        document.getElementById(SEO_FAVICON_ID).type = SVG_MIME;
    }

    seoLink("apple-touch-icon", appleTouch, SEO_APPLE_ID);
}
