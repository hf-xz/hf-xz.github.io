---
title: 搭建
---

# 搭建

本网站基于 [Vitepress](https://vitepress.dev/) 构建。

> VitePress is a Static Site Generator (SSG) designed for building fast, content-centric websites. In a nutshell, VitePress takes your source content written in Markdown, applies a theme to it, and generates static HTML pages that can be easily deployed anywhere.

## 项目创建

1. 创建仓库

    首先打开 Github 随意创建一个空仓库，我选择的是使用 `<username>.github.io` 这个特殊仓库，当然使用其他仓库也没问题。

    需要注意的是，如果想用一个仓库就完成代码托管和部署，那这个仓库一定要是公开仓库，不能是私有仓库。*（可以使用一个私有仓库保存代码，一个公开仓库部署的方式，但我觉得没必要）*

2.  本地创建项目

    首先本地找个喜欢的目录，把仓库拉到本地：
   
    ```bash
    git clone REPOSITORY DIRNAME && cd DIRNAME # 替换大写变量！
    ```

    然后就是创建 Vitepress 项目的步骤了，可以参考 [官方文档](https://vitepress.dev/guide/getting-started)，下面简要带过一下：

    1. 安装 Vitepress：

        ```bash
        npm add -D vitepress
        ```

    2. 使用 setup wizard 初始化项目：

        ```bash
        npx vitepress init
        ```

        运行后会有一些配置，按自己喜欢的选择就好。

        ::: details *我的配置，仅供参考：*
        ```
        ┌  Welcome to VitePress!
        │
        ◇  Where should VitePress initialize the config?
        │  ./
        │
        ◇  Site title:
        │  My Awesome Project
        │
        ◇  Site description:
        │  A VitePress Site
        │
        ◇  Theme:
        │  Default Theme + Customization
        │
        ◇  Use TypeScript for config and theme files?
        │  Yes
        │
        ◇  Add VitePress npm scripts to package.json?
        │  Yes
        │
        └  Done! Now run npm run docs:dev and start writing.

        Tips:
        - Since you've chosen to customize the theme, you should also explicitly install vue as a dev dependency.
        ```
        :::

    3. 如果用自定义主题的话要单独安装 `vue`：

        ```bash
        npm install vue -D
        ```

    4. 安装到这里就完成啦！运行下面的命令就可以查看预览了。

        ```bash
        vitrepress dev
        # or
        npm run docs:dev # 需要上面配置时选择创建 npm scripts
        ```

3. 提交代码
   
    项目创建完后第一件事当然是提交 initial commit 啦：

    ```bash
    git add *
    git commit -m "initial commit"
    git push
    ```

    这样代码就推送到 Github 上了，下面我们将简单配置本项目，让这个网站看起来更舒服一些。

## 初步配置

- 添加 `.gitignore`
  
    ```
    .vitepress/dist
    .vitepress/cache
    node_modules/
    .vscode/
    ```

- 整理文件结构
  
    vitepress 的 [路由生成](https://vitepress.dev/guide/routing) 是遵守实际的文件结构的。

    > VitePress uses file-based routing, which means the generated HTML pages are mapped from the directory structure of the source Markdown files.

    将创建项目生成的两个样例文件 `api-examples.md` 和 `markdown-examples.md` 放到一个 `examples` 文件夹中（也可以直接删掉）。

    此外，再新建一个 `articles` 文件夹用于存放之后写的文章。

    `index.md` 就留在根目录就好。

- 配置 `.vitepress` 文件夹下的配置文件 `config.mts`：

    我的 [配置文件](https://github.com/hf-xz/hf-xz.github.io/blob/master/.vitepress/config.mts) 目前更新还比较频繁，所以请参照 [官方文档](https://vitepress.dev/reference/site-config#site-config) 自行查看。我会尽量在我的配置文件中写好注释。
