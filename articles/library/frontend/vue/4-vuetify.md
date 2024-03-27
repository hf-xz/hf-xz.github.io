---
title: 增强：Vuetify
---

# 引入 Vuetify

[Vuetify](https://vuetifyjs.com/zh-Hans/) 是一个基于 [Metarial Design](https://m3.material.io) 设计的 Vue 组件库。

## 安装

### 本体与插件

1. 安装依赖

```zsh
yarn add vuetify
yarn add -D vite-plugin-vuetify
```

2. 配置 Vite：

::: code-group

```ts [vite.config.ts]
import vuetify from "vite-plugin-vuetify"; // [!code ++]

export default defineConfig({
  plugins: [
    vue(),
    vuetify(), // [!code ++]
  ],
});
```

:::

3. 配置 Vue：

::: code-group

```ts [plugins/vuetify.ts]
import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

export default vuetify;
```

:::

::: code-group

```ts [main.ts]
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify"; // [!code ++]

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify); // [!code ++]

app.mount("#app");
```

:::

### 图标库

参考[文档](https://vuetifyjs.com/zh-Hans/features/icon-fonts/)

1. 安装

```zsh
yarn add @mdi/font -D
```

2. 引入

::: code-group

```ts [plugins/vuetify.ts]
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // [!code ++]
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

export default vuetify;
```

:::

至此，Vuetify 安装完毕，你可以在代码中使用 Vuetify 提供的组件了。
