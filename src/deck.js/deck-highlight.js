const HL = Object.freeze({
    COMMENT: "co",
    STRING: "st",
    NUMBER: "dv",
    KEYWORD: "kw",
    TYPE: "dt",
    CONST: "cn",
    PREPROC: "pp",
    WORD: "word",
});

const LANG_ALIASES = Object.freeze({
    js: "javascript",
    mjs: "javascript",
    jsx: "javascript",
    ts: "javascript",
    typescript: "javascript",
    h: "c",
    cc: "c",
    cpp: "c",
    cxx: "c",
    hh: "c",
    hpp: "c",
    "c++": "c",
    htm: "html",
    xml: "html",
    svg: "html",
    py: "hash",
    python: "hash",
    sh: "hash",
    bash: "hash",
    make: "hash",
    yaml: "hash",
    yml: "hash",
    rb: "hash",
    ruby: "hash",
    toml: "hash",
});

const SLASH_COMMENT_RE = /\/\/[^\n]*|\/\*[\s\S]*?\*\//;
const BLOCK_COMMENT_RE = /\/\*[\s\S]*?\*\//;
const HASH_COMMENT_RE = /#[^\n]*/;
const STRING_RE = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/;
const TEXT_BLOCK_RE = /"""[\s\S]*?"""/;
const NUMBER_RE = /\b\d[\w.]*/;
const WORD_RE = /\b[A-Za-z_$][\w$]*/;
const ANNOTATION_RE = /@[A-Za-z_]\w*/;

const C_PREPROC_RE = /(?<=^[ \t]*)#[ \t]*[a-z]+/;
const C_INCLUDE_RE = /(?<=#[ \t]*include[ \t]*)<[^>\n]+>/;

const CSS_AT_RULE_RE = /@[\w-]+/;
const CSS_HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const CSS_PROPERTY_RE = /[-\w]+(?=\s*:[^;{}]*[;}])/;
const CSS_SELECTOR_RE = /[.#][-\w]+/;
const CSS_NUMBER_RE = /(?<![\w-])-?\d*\.?\d+(?:%|[a-z]+)?/;

const HTML_COMMENT_RE = /<!--[\s\S]*?-->/;
const HTML_DOCTYPE_RE = /<!doctype[^>]*>/i;
const HTML_TAG_RE = /<\/?[A-Za-z][\w-]*|\/?>/;
const HTML_VALUE_RE = /(?<==\s*)(?:"[^"]*"|'[^']*')/;
const HTML_ATTR_RE = /[\w:-]+(?=\s*=)/;
const HTML_ENTITY_RE = /&#?\w+;/;

const words = (text = "") => new Set(text.split(" ").filter(Boolean));

function profile(tokens, { keywords, types, consts, capsAreTypes } = {}) {
    return {
        tokens,
        keywords: words(keywords),
        types: words(types),
        consts: words(consts),
        capsAreTypes: Boolean(capsAreTypes),
        regex: new RegExp(
            tokens.map(([re]) => `(${re.source})`).join("|"),
            "gm"
        ),
    };
}

const GENERIC_TOKENS = [
    [SLASH_COMMENT_RE, HL.COMMENT],
    [STRING_RE, HL.STRING],
    [NUMBER_RE, HL.NUMBER],
    [WORD_RE, HL.WORD],
];

const PROFILES = Object.freeze({
    generic: profile(GENERIC_TOKENS, {
        keywords:
            "if else for while do return function fn def class struct enum " +
            "union switch case break continue new delete import from export " +
            "default try catch throw typeof sizeof in is not and or async " +
            "await yield package interface extends implements static public " +
            "private protected extern typedef const let var use mod pub " +
            "match impl trait self this goto with as",
        types:
            "int char long short unsigned signed float double bool void " +
            "string i8 i16 i32 i64 u8 u16 u32 u64 usize size_t",
        consts: "true false null undefined NULL",
    }),

    hash: profile(
        [
            [HASH_COMMENT_RE, HL.COMMENT],
            [STRING_RE, HL.STRING],
            [NUMBER_RE, HL.NUMBER],
            [WORD_RE, HL.WORD],
        ],
        {
            keywords:
                "if elif else for while return def class import from try " +
                "except finally raise in is not and or lambda with as pass " +
                "break continue yield async await then fi do done esac case " +
                "function export local",
            consts: "None True False true false nil",
        }
    ),

    c: profile(
        [
            [SLASH_COMMENT_RE, HL.COMMENT],
            [C_PREPROC_RE, HL.PREPROC],
            [C_INCLUDE_RE, HL.STRING],
            [STRING_RE, HL.STRING],
            [NUMBER_RE, HL.NUMBER],
            [WORD_RE, HL.WORD],
        ],
        {
            keywords:
                "auto break case const continue default do else enum extern " +
                "for goto if inline register restrict return sizeof static " +
                "struct switch typedef union volatile while class namespace " +
                "template typename using virtual override final public " +
                "private protected friend operator new delete this try catch " +
                "throw constexpr consteval constinit noexcept explicit " +
                "mutable decltype static_assert typeid dynamic_cast " +
                "static_cast const_cast reinterpret_cast and or not xor " +
                "co_await co_yield co_return concept requires",
            types:
                "void char short int long float double signed unsigned bool " +
                "wchar_t char8_t char16_t char32_t size_t ssize_t ptrdiff_t " +
                "intptr_t uintptr_t int8_t int16_t int32_t int64_t uint8_t " +
                "uint16_t uint32_t uint64_t FILE std",
            consts: "true false NULL nullptr EOF",
        }
    ),

    javascript: profile(GENERIC_TOKENS, {
        keywords:
            "break case catch class const continue debugger default delete " +
            "do else export extends finally for function if import in " +
            "instanceof let new of return static super switch this throw " +
            "try typeof var void while with yield async await get set " +
            "interface type enum implements public private protected",
        types: "string number boolean object any unknown never",
        consts: "true false null undefined NaN Infinity",
        capsAreTypes: true,
    }),

    java: profile(
        [
            [SLASH_COMMENT_RE, HL.COMMENT],
            [TEXT_BLOCK_RE, HL.STRING],
            [STRING_RE, HL.STRING],
            [ANNOTATION_RE, HL.PREPROC],
            [NUMBER_RE, HL.NUMBER],
            [WORD_RE, HL.WORD],
        ],
        {
            keywords:
                "abstract assert break case catch class continue default do " +
                "else enum extends final finally for if implements import " +
                "instanceof interface native new package private protected " +
                "public return static strictfp super switch synchronized " +
                "this throw throws transient try volatile while var record " +
                "sealed permits yield",
            types: "boolean byte char short int long float double void",
            consts: "true false null",
            capsAreTypes: true,
        }
    ),

    css: profile([
        [BLOCK_COMMENT_RE, HL.COMMENT],
        [STRING_RE, HL.STRING],
        [CSS_AT_RULE_RE, HL.KEYWORD],
        [CSS_HEX_RE, HL.NUMBER],
        [CSS_PROPERTY_RE, HL.TYPE],
        [CSS_SELECTOR_RE, HL.KEYWORD],
        [CSS_NUMBER_RE, HL.NUMBER],
    ]),

    html: profile([
        [HTML_COMMENT_RE, HL.COMMENT],
        [HTML_DOCTYPE_RE, HL.PREPROC],
        [HTML_TAG_RE, HL.KEYWORD],
        [HTML_VALUE_RE, HL.STRING],
        [HTML_ATTR_RE, HL.TYPE],
        [HTML_ENTITY_RE, HL.CONST],
    ]),
});

function profileFor(lang = "") {
    const key = lang.toLowerCase();
    return PROFILES[LANG_ALIASES[key] || key] || PROFILES.generic;
}

function wordClass(prof, word) {
    if (prof.keywords.has(word)) {
        return HL.KEYWORD;
    }
    if (prof.types.has(word)) {
        return HL.TYPE;
    }
    if (prof.consts.has(word)) {
        return HL.CONST;
    }
    if (prof.capsAreTypes && /^[A-Z][a-z]/.test(word)) {
        return HL.TYPE;
    }
    return null;
}

function tokenClass(prof, match) {
    const group = match.findIndex((g, i) => i > 0 && g !== undefined) - 1;
    const cls = prof.tokens[group][1];
    return cls === HL.WORD ? wordClass(prof, match[0]) : cls;
}

function highlight(text, lang) {
    const prof = profileFor(lang);
    const frag = document.createDocumentFragment();
    let last = 0;

    for (const m of text.matchAll(prof.regex)) {
        const cls = tokenClass(prof, m);
        if (!cls) {
            continue;
        }

        if (m.index > last) {
            frag.appendChild(
                document.createTextNode(text.slice(last, m.index))
            );
        }
        frag.appendChild(el("span", m[0], cls));
        last = m.index + m[0].length;
    }

    if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
    }

    return frag;
}
