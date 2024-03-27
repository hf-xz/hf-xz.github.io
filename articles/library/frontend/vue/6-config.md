---
title: 增强：使用配置文件
---

# 使用配置文件

[Vite 官方文档](https://cn.vitejs.dev/guide/env-and-mode)

## 简单配置

1. 配置 vite，修改环境加载路径

```ts
// vite.config.ts
export default defineConfig({
  ...
  envDir: 'config' // [!code ++]
})
```

2. 添加配置文件

创建文件夹 `config`，写入三个 env 文件：

::: code-group

```env [.env]
# .env 任何环境都会加载

# 客户端变量，以 VITE_ 为前缀，会被客户端加载，不要存放敏感信息
# VITE_APP_TITLE=Vite App

# 其他变量
```

```env [.env.development]
# .env.development 只在开发环境加载

# 客户端变量，以 VITE_ 为前缀，会被客户端加载，不要存放敏感信息
# VITE_ENV_NAME=development

# 其他变量
```

```env [.env.production]
# .env.production 只在生产环境加载

# 客户端变量，以 VITE_ 为前缀，会被客户端加载，不要存放敏感信息
# VITE_ENV_NAME=production

# 其他变量
```

:::

## 项目中使用

- 获取环境：`import.meta.env.MODE`
  - 判断生产环境：`import.meta.env.PROD`
  - 判断开发环境：`import.meta.env.DEV`
- 获取变量 ABC：`import.meta.env.VITE_ABC`
