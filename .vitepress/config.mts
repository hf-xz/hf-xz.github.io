import { defineConfig } from 'vitepress'
import taskLists from 'markdown-it-task-lists'
import { withMermaid } from 'vitepress-plugin-mermaid'

import sidebar from './sidebar';

// https://vitepress.dev/reference/site-config
let config = defineConfig({
  title: "海风盒子",
  description: "海风把记忆都封了盒",
  lang: "zh-CN",
  head: [
    ['link', {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes:'32x32', href:'/favicon-32x32.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes:'16x16', href:'/favicon-16x16.png'}],
    ['link', {rel: 'manifest', href: '/site.webmanifest'}],
    ['link', {rel: 'stylesheet', href: 'https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css'}],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '资源库', link: '/articles/library/' },
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
  },
  
  // optionally, you can pass MermaidConfig
  mermaid: {
    // refer for options:
    // https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    // set additional css class for mermaid container
    class: "mermaid"
  }
})

config = withMermaid(config)

export default config
