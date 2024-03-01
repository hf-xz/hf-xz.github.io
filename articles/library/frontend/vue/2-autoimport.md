---
title: 增强：自动引入
---

# 自动引入

## 自动引入 api

1. 安装依赖 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

```zsh
yarn add -D unplugin-auto-import
```

2. 配置 Vite

在 `vite.config.ts` 中引入插件

```ts
// vite.config.ts
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      // 需要自动引入的库，可以去官方查看支持哪些
      imports: ["vue", "vue-router", "pinia", "vitest"],
      // 生成 auto-imports.d.ts 文件，后面配置 TS 用
      dts: true,
    }),
  ],
});
```

3. 配置 TS

执行一次 `yarn dev`，根目录会多出来一个 `auto-imports.d.ts` 文件，这是为了防止我们不用显式声明后 TS 报错未定义而生成的类型定义文件，需要把它添加到 `tsconfig.app.json` 的 `include` 里。

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"], // [!code --]
  "include": ["auto-imports.d.ts", "env.d.ts", "src/**/*", "src/**/*.vue"], // [!code ++]
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. 测试

随后你可以尝试在 `App.vue` 中写入 `const a = ref(1)`，你会发现不需要引入 `ref` 也可以使用（VSCode 请重启窗口来重新加载 TS 服务）。同理，`useRoute`、`defineStore` 等方法也不用引入了。

## 自动引入组件

1. 安装依赖 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

```zsh
yarn add -D unplugin-vue-components
```

2. 配置 Vite

在 `vite.config.ts` 中引入插件

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    Components({
      // 要搜索组件的目录的相对路径
      dirs: ["src/components"],
      // 如果要引入第三方组件库，在这里注册即可
      resolvers: [],
      // 生成  components.d.ts 文件，后面配置 TS 用
      dts: true,
    }),
  ],
});
```

3. 配置 TS

跟上面类似，运行一次 `yarn dev` 将生成的 `components.d.ts` 添加到 `include` 里。

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "components.d.ts", // [!code ++]
    "auto-imports.d.ts",
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. 测试

尝试把 `App.vue` 中的

```ts
import HelloWorld from "./components/HelloWorld.vue";
```

去掉，会发现还是可以正常使用 `HelloWorld` 组件，说明配置成功。

5. 第三方库自动引入

这里以 Element Plus 为例。

安装 Elemnt Plus

```zsh
yarn add element-plus
```

编辑 `vite.config.ts`

```ts
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // [!code ++]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia", "vitest"],
      resolvers: [ElementPlusResolver()], // [!code ++]
      dts: true,
    }),
    Components({
      dirs: ["src/components"],
      resolvers: [ElementPlusResolver()], // [!code ++]
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

现在，你可以直接在页面中使用 Element Plus 中的组件而不需要引入了。
