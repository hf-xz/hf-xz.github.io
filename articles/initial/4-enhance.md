---
title: 功能扩展 
---

# 功能扩展 

## Markdown 功能加强

Vitepress 已经为 Markdown 添加了许多功能扩展（如 emoji，代码高亮，代码组等）了，详见 [官方文档](https://vitepress.dev/guide/markdown)。

但还是有一些实用的功能并没有被支持，比如 taskLists：

```markdown
- [ ] todo
- [x] finished
```

所幸 Vitepress 使用 [markdown-it](https://github.com/markdown-it/markdown-it) 作为 Markdown 渲染引擎，所以所有 `markdown-it` 的插件我们都可以在 Vitepress 中使用，官方教程在 [这里](https://vitepress.dev/guide/markdown#advanced-configuration)。下面我会演示一下我是如何添加 taskList 支持的：

```typescript{7-12}
// .vitepress/config.mts
import taskLists from 'markdown-it-task-lists' // [!code ++]

let config = defineConfig({
  ..., // 其他配置

  markdown: {
    config: (md) => {
      // use more markdown-it plugins!
      md.use(taskLists)
    }
  },
}

export default config
```

添加完后，上述的例子将会被渲染这样：

- [ ] todo
- [x] finished

## Vitepress 集成 Mermaid

使用现成插件 [vitepress-plugin-mermaid](https://emersonbottero.github.io/vitepress-plugin-mermaid/)。

首先安装插件：

```bash
npm i vitepress-plugin-mermaid mermaid -D
```

然后编辑配置文件：

```typescript{6-15}
import { withMermaid } from 'vitepress-plugin-mermaid' // [!code ++]

let config = defineConfig({
  ..., // 其他配置

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
}

config = withMermaid(config) // [!code ++]

export default config
```

然后就可以像在 Typora 里写 mermaid 一样了。


````markdown
``` mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```
````

``` mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

## COS 图床 + PicGo 上传

这个网站中的图片存储是个麻烦事。直接存到项目里的话，图片太多太乱而且 git 也不好管理。找个图床存的话，又总担心图床跑路。最后看了半天，还是决定掏点小钱去买个 COS 服务来存图片。

配置过程我也都参考的网上的资料，我就不再赘述一遍了，简单罗列几篇文章在下面：

- [知乎：使用 PicGo+腾讯云对象存储COS 作为图床](https://zhuanlan.zhihu.com/p/119250383)
- [PicGo 官网](https://picgo.github.io/PicGo-Doc/)
- [VSCode 版 PicGo](https://github.com/PicGo/vs-picgo)
- [Typora 上传图片](https://support.typora.io/Upload-Image/)

将 COS、PicGo 配置好之后就可以使用 COS 当图床，用 PicGo 来快捷上传了。可以根据平时写文章的软件再多配置一下 VSCode 和 Typora。

::: info
使用 PicGo 上传图片之后，如果在本地(markdown 中)又删除了这张图片，那么 COS 中的图片不会随之删除。
这会造成 COS 存储空间的浪费，并带来额外费用。*（很少很少）* 
:::

## 自动生成 Sidebar

有些文章集合需要一个 Sidebar 来当目录，我通过一个 `generateSidebar` 函数来实现这个功能。原理图如下：

```mermaid
flowchart TD
    start[generateSidebar]
    res[当前目录的 Sidebar]
    start --> B{遍历当前目录}
    B -->|对于 .md 文件| C{Markdown}
    B -->|对于子目录| D[递归子目录]
    D -->|将子目录插入当前目录| res
    C -->|是 index.md| E[index.md]
    C -->|不是 index.md| F[others.md]
    E -->|设置当前目录的标题和连接| res
    F -->|将文章插入当前目录| res
    res --> return[return Sidebar]
```

:::details 实现代码
```typescript
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
```
:::

使用：

:::code-group
```typescript [sidebar.ts]
// My separate sidebar file.
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
  '/articles/initial/': [ generateSidebar('articles/initial') ], // [!code focus]
}

export default sidebar
```

```[file structure]
initial
├── 1-build.md
├── 2-deploy.md
├── 3-guide.md
├── 4-enhance.md
└── index.md
```
:::

最终效果就像在本页面看到的一样，Sidebar 会作为几篇文章的一个目录，如果在某一级目录下有 `index.md` 那么这个这一级目录的标题将可以点击并跳转到这个 `index.md`。
