const CLASS_NAME_FOOTERJS_COMPONENT = "z-footerjs";

function createFooterComponent({
    id = "site-footer",
    text,
    align = ALIGN.CENTER,
} = {}) {
    const side = getValidAlign(align, ALIGN.CENTER);
    const footer = el(
        "footer",
        text,
        `${CLASS_NAME_FOOTERJS_COMPONENT} text-align-${side}`
    );
    if (id) footer.id = id;

    return footer;
}

function Footer(options) {
    return createFooterComponent(options);
}
