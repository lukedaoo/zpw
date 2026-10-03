const DATE_SEP = " – ";

function dateRange(date) {
    if (!date?.start) return "";
    if (date.end === date.start) return date.start;
    const end = date.end || "Present";
    return date.start + DATE_SEP + end;
}

function dateText(date) {
    return typeof date === "string" ? date : dateRange(date);
}

function listLinks(links, preview) {
    return codeLive({
        code: links?.code,
        live: links?.live,
        url: links?.url,
        preview: preview?.length ? preview : links?.preview,
    });
}

function listItem({
    date,
    title,
    url = null,
    lines = [],
    links = {},
    preview = [],
    footer = null,
} = {}) {
    const meta = {
        tone: ITEM_TONE.MUTED,
        date: dateText(date),
        links: listLinks(links, preview),
    };
    const header = url ? itemHeader(link(title, url), meta) : title;
    const item = sectionItem(header, null, "", meta);

    return fillSectionItem(item, lines, footer);
}

function listGroup(
    { title, date, links = {}, list = [] } = {},
    renderItem = listItem
) {
    const items = list.map((it) => renderItem(it));
    return sectionItem(title, items, "", {
        date: dateText(date),
        links: listLinks(links),
    });
}

function listSection(
    { title = "List", groups = [] } = {},
    { cls = "", renderItem = listItem } = {}
) {
    const sectionGroups = groups.map((g) => listGroup(g, renderItem));
    return section(title, sectionGroups, cls);
}

// content: { title, groups: [{ title, date?, links?, list: [item] }] }
// item:    { title, date?, url?, lines?, links?, preview?, footer? }
function List(
    content,
    { id = null, cls = "", sectionCls = "", renderItem = listItem } = {}
) {
    if (!content) return;

    const container = div(`list-container` + (cls ? " " + cls : ""));
    if (id) container.id = id;

    container.appendChild(
        listSection(content, { cls: sectionCls, renderItem })
    );
    return container;
}
