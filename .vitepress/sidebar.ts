let sidebar = {
  '/examples/': [
    {
      base: '/examples/',
      text: 'Examples',
      items: [
        { text: 'Markdown Examples', link: 'markdown-examples' },
        { text: 'Runtime API Examples', link: 'api-examples' }
      ]
    }
  ],
  '/articles/50projects50days/': [ generateSidebar('articles/50projects50days') ],
  '/articles/initial/': [ generateSidebar('articles/initial') ],
}

export default sidebar

// 根据目录结构自动生成 Sidebar
import { readdirSync, statSync } from 'fs'
import { join, parse } from 'path'
import matter from 'gray-matter'

import { DefaultTheme } from 'vitepress'
type SidebarItem = DefaultTheme.SidebarItem

function generateSidebar(dir: string) {
  // 初始化 SidebarItem
  let sidebar: SidebarItem = {
    base: `/${dir}/`,
    // text 初始值为目录名
    text: `${parse(dir).name}`,
    items: []
  }
  // 遍历目录
  let files = readdirSync(dir)
  let subDirs: string[] = []
  files.forEach((file) => {
    let path = join(dir, file)
    let stat = statSync(path)
    if (stat.isDirectory()) {
      // 稍后处理子文件夹
      subDirs.push(file)
    } else {
      // 处理 md 文件
      if (file.endsWith('.md')) {
        let { data } = matter.read(path)
        let { title } = data
        if (!title) {
          // frontmatter 中没有 title，就用文件名作为 title
          title = file.replace(/\.md$/, '')
        }
        if (file == 'index.md') {
          // 如果有 index 文件，就把它作为 Sidebar 的标题
          sidebar['text'] = title
          sidebar['link'] = file.replace(/\.md$/, '')
          return
        }
        // 一般不是 index 的文件，就作为 Sidebar 的子项
        let item: SidebarItem = {
          text: title,
          link: file.replace(/\.md$/, '')
        }
        sidebar.items!.push(item)
      }
    }
  })
  subDirs.forEach((subDir) => {
    let subSidebar = generateSidebar(join(dir, subDir))
    sidebar.items!.push(subSidebar)
  })
  return sidebar
}
