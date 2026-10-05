const CLASS_NAME_UPDATESJS_COMPONENT = "z-updatesjs";

// content: { title?, groups: [...] } or { title?, list: [{ category?, ... }] }
function Updates(content) {
    if (!content) return;

    const { list, groups = listGroups(list) } = content;

    return List(
        { ...content, title: content.title || "Updates", groups },
        {
            id: "site-updates",
            cls: `updates-container ${CLASS_NAME_UPDATESJS_COMPONENT}`,
        }
    );
}
