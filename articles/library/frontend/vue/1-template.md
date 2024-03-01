---
title: 基础：模板项目
---

# Vue 3 模板项目

下面将介绍如何利用上面提到的库，创建一个实用的 Vue 3 空白项目。

## 1. 准备工作

- 准备 node 18+ 环境，推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 node 版本

```zsh
nvm use 20 # 使用 node 20
```

- 安装 yarn （仅推荐，非必需）

## 2. 初始化

首先使用 vite 模板初始化项目：

```zsh
yarn create vue
```

根据提示，创建项目：

```text
✔ 请输入项目名称： … template
✔ 是否使用 TypeScript 语法？ … 是
✔ 是否启用 JSX 支持？ … 是 （可以不用，但不能没有）
✔ 是否引入 Vue Router 进行单页面应用开发？ … 是
✔ 是否引入 Pinia 用于状态管理？ … 是
✔ 是否引入 Vitest 用于单元测试？ … 是
✔ 是否要引入一款端到端（End to End）测试工具？ › 不需要 （这个真很少用到）
✔ 是否引入 ESLint 用于代码质量检测？ … 是
✔ 是否引入 Prettier 用于代码格式化？ … 是
```

根据提示，进入项目路径初始化项目并启动：

```zsh
cd template
yarn
yarn format
yarn dev
```

等到项目启动成功就是初始化完成啦 🎉

## 3. 项目合作

为了让项目适合于团队合作（自己用也一样，可以更规范），下面做一些准备工作。

**记录项目 node 版本**

```zsh
node -v > .nvmrc
```

使用上述命令将 node 版本保存后，就可以使用 `nvm use` 命令来直接切换到项目的 node 版本，避免因忘记切换 node 版本导致的各种错误。

**初始化 git 仓库**

```zsh
git init
git add .
git commit -m "initial commit" # 这条指令可以等下面配置完编码规范再执行
```

**编码规范**

ESLint 和 Prettier 在我们上面初始化的时候已经选择上了，初始化程序会自动为我们引入包并写好配置文件，我们就不用管了。下面安装一下用于 git 提交时自动检查代码的功能。

- husky

```zsh
yarn add -D husky
jq '.scripts += {"postinstall": "husky"}' package.json > tmp.json && mv tmp.json package.json # 没有 jq 就手动修改 package.json
yarn # 初始化 husky
```

:::info
这样配置之后，其他人下载本项目用 `yarn` 指令安装依赖时也会初始化 husky。
:::

::: tip
如果你用 yarn 之外的工具（npm 等），请添加 `prepare` 而不是 `postinstall`。
:::

这时你应该能看到项目里多出来一个 `.husky` 文件夹，说明 husky 初始化成功了。

- lint-staged

```zsh
yarn add -D lint-staged
```

在项目根目录创建一个 `.lintstagedrc.json` 文件，在这里配置 lint-staged 规则，一个样例如下：

```json
{
  "src/**/*.{js,ts,vue}": ["prettier --write", "eslint"]
}
```

```zsh
# 将 lint-staged 添加到 husky 的钩子中
echo "yarn lint-staged" > .husky/pre-commit
```

:::tip
你可以通过添加一个 `test.ts` 文件，并写入 `var a = 1` 来测试是否配置成功。

```zsh
yarn lint

git add .
yarn lint-staged

git commit -m 'test'
```

:::

:::tip
若执行 `yarn lint` 报错 "There was a problem loading formatter"，请尝试删除 `yarn.lock` 文件后重新执行 `yarn`，这是 yarn 1.x 与 eslint 的兼容性问题。
:::

## 4. 结束

至此一个具备基础功能、适合于团队合作的 Vue 3 空白项目就创建完成了，后面还有更多的增强功能，请按需使用。

- [自动引入](./2-autoimport.md)
- [封装日志](./3-logger.md)
- [封装 axios 请求](./4-axios.md)
