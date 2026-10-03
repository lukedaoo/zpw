const HEADER_CONTENT = {
    name: "Loc Dao (LD)",

    links: [
        { label: "home", href: "#/" },
        { label: "email", href: "mailto:locdao.fw@gmail.com" },
        { label: "github", href: "https://github.com/lukedaoo" },
        { label: "linkedin", href: "https://www.linkedin.com/" },
        { label: "updates", href: "#/updates" },
        { label: "blogs", href: "#/blogs" },
    ],
};

const RESUME_CONTENT = {
    hello: {
        title: "Hello",
        greeting: "Welcome to my site! I like coding",
    },
    work: {
        title: "Work",
        companies: [
            {
                name: "Company ABC",
                date: { start: "Jan 2024", end: "Present" },
                links: {
                    code: "https://github.com/example/project-1",
                    live: "https://project-1.example.com",
                },
                roles: [
                    {
                        title: "Software Engineer",
                        date: { start: "Jan 2024", end: "Present" },
                        lines: [
                            "Engineered end-to-end features for core platform services.",
                        ],
                        links: {
                            code: "https://github.com/example/project-1",
                            live: "https://project-1.example.com",
                            preview: ["assets/img.png"],
                        },
                        techs: ["React", "Node.js", "PostgreSQL"],
                    },
                    {
                        title: "Software Engineer Intern",
                        date: { start: "Oct 2023", end: "Jan 2024" },
                        lines: [],
                        techs: ["React", "Node.js", "PostgreSQL"],
                    },
                ],
            },
            {
                name: "Company XYZ",
                date: { start: "Jun 2022", end: "Dec 2023" },
                roles: [
                    {
                        title: "Junior Developer",
                        date: { start: "Jun 2022", end: "Dec 2023" },
                        lines: [
                            "Developed modular UI components and maintained integration test coverage.",
                            "Refactored legacy codebases to improve maintainability and performance.",
                        ],
                        techs: ["TypeScript", "Express", "MongoDB"],
                    },
                ],
            },
        ],
    },
    projects: {
        title: "Projects",
        domains: [
            {
                title: "Web Dev",
                projects: [
                    {
                        name: "Project 1",
                        date: { start: "Jan 2024", end: "Mar 2024" },
                        lines: [
                            "A lightweight web application for managing daily workflows and task execution.",
                        ],
                        links: {
                            code: "https://github.com/example/project-1",
                            live: "https://project-1.example.com",
                        },
                        techs: ["React", "Tailwind CSS", "Vite"],
                    },
                ],
            },
            {
                title: "Systems",
                projects: [
                    {
                        name: "Project 2",
                        date: { start: "Aug 2023", end: "Nov 2023" },
                        lines: [
                            "A command-line tool designed for multi-threaded file parsing and data processing.",
                        ],
                        links: {
                            code: "https://github.com/example/project-2",
                        },
                        techs: ["C++", "CMake", "POSIX Threads"],
                    },
                ],
            },
        ],
    },
};

const FOOTER_CONTENT = {
    text: `Copyright by LD © ${new Date().getFullYear()}`,
};
