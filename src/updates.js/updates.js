const CLASS_NAME_UPDATESJS_COMPONENT = "z-updatesjs";

function Updates(content) {
    if (!content) return;

    return List(
        { ...content, title: content.title || "Updates" },
        {
            id: "site-updates",
            cls: `updates-container ${CLASS_NAME_UPDATESJS_COMPONENT}`,
        }
    );
}
