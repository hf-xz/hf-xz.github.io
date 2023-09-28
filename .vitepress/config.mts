import { defineConfig } from 'vitepress'
import taskLists from 'markdown-it-task-lists';

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

    sidebar: {
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/examples/markdown-examples' },
            { text: 'Runtime API Examples', link: '/examples/api-examples' }
          ]
        }
      ],
      // TODO: 根据目录结构自动生成 Sidebar
      '/articles/50projects50days/': [
        {
          text: '50 projects 50 days',
          link: '/articles/50projects50days/',
          items: [
            { text: 'day01-expanding-cards', link: '/articles/50projects50days/day01' },
            { text: 'test', link: '/articles/50projects50days/test' },
          ]
        }
      ]
    },

    // outline
    outline: [2, 4], // 显示 2-4 级标题
    outlineTitle: '目录',

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
