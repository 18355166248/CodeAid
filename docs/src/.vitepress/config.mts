import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeAid",
  description: "代码助手",
  head: [["link", { rel: "icon", href: "/codeAidSingleLogo.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "指南", link: "/guide/start" }],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [{ text: "开始", link: "/guide/start" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/18355166248/CodeAid" },
    ],
  },
});
