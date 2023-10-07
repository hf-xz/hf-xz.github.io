import { defineConfig } from 'vitepress'
import taskLists from 'markdown-it-task-lists';
import sidebar from './sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "海风盒子",
  description: "海风把记忆都封了盒",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '50 projects', link: '/articles/50projects50days/' },
      { text: 'Examples', link: '/examples/markdown-examples' },
    ],

    // import sidebar from './sidebar'
    sidebar,

    // outline
    outline: [2, 4], // 显示 2-4 级标题
    outlineTitle: '大纲',

    // footer
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hf-xz' }
    ]
  },

  // srcExclude: [
  //   'TODO.md',
  //   'README.md',
  // ],

  cleanUrls: true,

  markdown: {
    config: (md) => {
      // use more markdown-it plugins!
      md.use(taskLists)
    }
  }
})
