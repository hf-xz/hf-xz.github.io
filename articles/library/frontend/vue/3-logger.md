---
title: 增强：日志控制
---

# 日志控制

为了防止将开发环境的日志输出（如 `console.log`）带到生产环境，需要配置一下 Vite 来在打包时剔除日志输出。

在 `vite.config.ts` 中添加如下内容：

```ts
esbuild: {
  pure: ['console.log'],
  drop: ['debugger']
}
```

:::tip
注意，这里并没有完全剔除 `console`，你仍可以用 `console.info`, `console.error` 等方式输出必要的日志。
:::
