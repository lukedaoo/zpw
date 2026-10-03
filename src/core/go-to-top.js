function createGoToTopButton(id = "scroll-to-top", align = ALIGN.RIGHT) {
    const SCROLL_OFFSET = 20;

    const side = getValidAlign(align, ALIGN.RIGHT);

    const b = button("Top", `btn scroll-to-top align-${side}`);
    if (id) b.id = id;
    b.setAttribute("aria-label", "Scroll to page start");
    b.hidden = true;
    b.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

    const update = () => {
        b.hidden = scrollY < SCROLL_OFFSET;
    };
    addEventListener("scroll", update, { passive: true });
    update();

    return b;
}

function renderGoToTopButton(
    parent,
    id = "scroll-to-top",
    align = ALIGN.RIGHT
) {
    if (!parent) return;
    const goToTop = createGoToTopButton(id, align);
    if (!goToTop) return;
    parent.append(goToTop);
}
