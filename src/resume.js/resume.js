const CLASS_NAME_RESUMEJS_COMPONENT = "z-resumejs";

function helloSection({ title = "Hello", greeting } = {}) {
    const introItem = sectionItem(null, greeting, "muted");
    return section(title, [introItem]);
}

function withTechFooter({ techs = [], ...item } = {}) {
    const footer = techs.length
        ? labelLine({ label: "Tech", list: techs })
        : null;
    return { ...item, footer };
}

function workContent({ title = "Work", companies = [] } = {}) {
    return {
        title,
        groups: companies.map(({ name, date, links, roles = [] }) => ({
            title: name,
            date,
            links,
            list: roles.map(withTechFooter),
        })),
    };
}

function projectsContent({ title = "Projects", domains = [] } = {}) {
    return {
        title,
        groups: domains.map(({ title, projects = [] }) => ({
            title,
            list: projects.map(({ name, ...rest }) =>
                withTechFooter({ title: name, ...rest })
            ),
        })),
    };
}

function createResume(id = "site-resume", content = null) {
    if (!content) return;

    const container = div(`resume-container ${CLASS_NAME_RESUMEJS_COMPONENT}`);
    if (id) container.id = id;

    const opts = { cls: "indent" };
    container.appendChild(helloSection(content.hello));
    container.appendChild(listSection(workContent(content.work), opts));
    container.appendChild(listSection(projectsContent(content.projects), opts));

    return container;
}

function Resume(content) {
    return createResume("site-resume", content);
}
