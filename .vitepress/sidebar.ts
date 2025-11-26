import generateSidebar from "./utils/generateSidebar";

let sidebar = {
  "/examples/": [
    {
      base: "/examples/",
      text: "Examples",
      items: [
        { text: "Markdown Examples", link: "markdown-examples" },
        { text: "Runtime API Examples", link: "api-examples" },
      ],
    },
  ],
  "/articles/50projects50days/": [generateSidebar("articles/50projects50days")],
  "/articles/initial/": [generateSidebar("articles/initial")],
  "/articles/library/": [generateSidebar("articles/library")],
  "/articles/llm/": [generateSidebar("articles/llm")],
};

export default sidebar;
