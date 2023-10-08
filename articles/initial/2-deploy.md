---
title: 部署
---

# 部署

部署方面，代码存放在 Gihub。通过 `Github Page` 和 `Vercel` 两种方式进行部署。
最后在腾讯云购买域名解析到 Vercel 上解决国内访问的的问题。

## Github Page

首先，[官方文档](https://vitepress.dev/guide/deploy#github-pages)。

按文档的步骤，我们首先在 `.github/workflows` 文件夹下新建一个 `deploy.yml` 的文件，然后将下面的内容写入文件中：

*修改的地方是我的项目与官方文档不一样的地方，请自行辨别是否需要修改*

```yml
# Sample workflow for building and deploying a VitePress site to GitHub Pages
#
name: Deploy VitePress site to Pages

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches: [main] // [!code --]
    branches: [master] // [!code ++]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm # or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: npm ci # or pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: |
          npm run docs:build # or pnpm docs:build / yarn docs:build / bun run docs:build
          touch docs/.vitepress/dist/.nojekyll // [!code --]
          touch .vitepress/dist/.nojekyll // [!code ++]
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs/.vitepress/dist // [!code --]
          path: .vitepress/dist // [!code ++]

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

如果像我一样使用 `<username>.github.io` 这个仓库的话，此时如果保存项目并推送到 Github 的话会发现网站并没有像预期的使用 Vitepress 部署。这是因为 Github 为 `<username>.github.io` 这个仓库添加了一个默认的构建方法，这个方法使用 `jekyll` 来构建网站。

> If you want to use a build process other than Jekyll or you do not want a dedicated branch to hold your compiled static files, we recommend that you write a GitHub Actions workflow to publish your site.

参考 [官方指南](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow) 来修改项目配置。改好之后，推送代码到 Github，等构建部署完之后应该就可以访问 `https://<username>.github.io` 来查看构建好的网站了。

## Vercel

Vercel 的配置就相对简单了，都是图形化界面，参考 [官方文档](https://vitepress.dev/guide/deploy#netlify-vercel-cloudflare-pages-aws-amplify-render) 就好，注意如果像我一样项目在根目录而不在 `docs/` 文件夹下的话记得修改对应的路径。

## 域名

我们的两个部署方式虽然都是免费的，也提供了域名访问，但是由于国内的网络环境，两个部署方式提供的域名均无法在不使用魔法的情况下访问。

所幸访问不了的原因大都是 DNS 污染，也就是通过它提供的域名（`xxx.gihub.io` 和 `xxx.vercel.app`）无法解析到对应的 ip 地址，这种情况我们只需要自己购买一个域名然后解析到 Vercel 就好了。步骤如下：

1. 购买域名

    这个就不赘述了，大家去自己喜欢的地方买就好。

2. 域名解析

    买完的域名添加两条解析记录：

    | Type  | Name | Value                      |
    | :---- | :--- | :------------------------- |
    | A     | @    | 76.223.126.88              |
    | CNAME | www  | cname-china.vercel-dns.com |

    ::: tip 
    注意这里的 Value 和下一步中 Vercel 给出的 Value 不一样，因为我这里给出的是针对国内的 Value。 
    :::

3. 配置 Vercel

    打开 Vercel 项目，在上边标签栏中选择 `Settings`，然后从左边的选项中选择 `Domains`。在打开的页面中输入你购买并配置好的域名，点击 `Add` 按钮即可。

    如果成功的话，你应该在页面下面的列表中看到你添加的域名，并且这个域名中的条目都是打对勾的（说明配置正确）。

    接下来就只需要等待解析生效就可以了 *(Good news! Your DNS records are set up correctly, but it can take some time for them to propagate globally.)*。

## Clean Urls

如果不开启 Clean Urls 功能的话，每个 `article.md` 都会生成对应的 `path/to/article.html`，结尾有个 `.html` 就很烦😕。参考 [官方文档](https://vitepress.dev/guide/routing#generating-clean-url)，开启也很简单：

### Github

Github 原本是不支持的（我配置本项目时 Vitepress 的官方文档还是这么写的）但是我发现只要在配置文件 `.vitepress/config.mts` 中配置 `cleanUrls: true` 就已经可以了（意思 Github 现在支持了） 。

### Vercel

Vercel 除了要在 Vitepress 的配置文件里配置之外，还要在根目录创建一个 `vercel.json` 文件，里面写入以下内容：

```json{3}
{
  ... // other config
  "cleanUrls": true
}
```

配置好了之后，现在每个 `article.md` 生成的路径就是 `path/to/article` 了，就像现在本页面的 URL 一样，非常干爽👏。
