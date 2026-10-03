function createNameComponent(id = "site-name", text, align = ALIGN.CENTER) {
    const side = getValidAlign(align);
    const _cls = `name text-align-${side}`;

    const e = p(text, _cls);
    if (id) e.id = id;

    return e;
}

function renderNameComponent(parent, nameId, text, align = ALIGN.CENTER) {
    if (!parent) return;
    const nameComponent = createNameComponent(nameId, text, align);
    if (!nameComponent) return;
    parent.appendChild(nameComponent);
}

const SUBTEXT_SEP = " · ";
const SUBTEXT_PER_ROW = 3;

function cleanItems(items) {
    return [].concat(items).filter((s) => s && String(s).trim());
}

// Flat list: wrapped every SUBTEXT_PER_ROW.
//   ["A", "B", "C", "D"]      -> "A · B · C" / "D"
// Any nested array: each entry is one explicit row.
//   [["A", "B"], ["C"]]       -> "A · B" / "C"
function subtextRows(items) {
    const list = [].concat(items);
    if (list.some(Array.isArray)) {
        return list.map(cleanItems).filter((row) => row.length);
    }

    const flat = cleanItems(list);
    const rows = [];
    for (let i = 0; i < flat.length; i += SUBTEXT_PER_ROW) {
        rows.push(flat.slice(i, i + SUBTEXT_PER_ROW));
    }
    return rows;
}

function createSubtextComponent(
    id = "site-subtext",
    items = [],
    align = ALIGN.CENTER
) {
    const rows = subtextRows(items);
    if (!rows.length) return;

    const side = getValidAlign(align);
    const e = div(`subtext text-align-${side}`);
    if (id) e.id = id;

    for (const row of rows) {
        e.appendChild(p(row.join(SUBTEXT_SEP)));
    }

    return e;
}
