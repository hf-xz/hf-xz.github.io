---
title: 增强：Toast 消息
---

# Toast 消息

使用 [vue-toastification](https://github.com/Maronato/vue-toastification) 库，[live demo](https://vue-toastification.maronato.dev)。

## 安装

1. 安装依赖

```zsh
yarn add vue-toastification@next
```

2. 配置插件

::: code-group

```ts [src/plugins/toast.ts]
import Toast, { type PluginOptions } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true,
};

export default { Toast, options };
```

:::

3. 注入到 Vue

::: code-group

```ts [src/main.ts]
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import toast from "./plugins/toast"; // [!code ++]

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(toast.Toast, toast.options); // [!code ++]

app.mount("#app");
```

:::

4. 配置自动引入

在 `vite.config.ts`，`AutoImport` 的 `imports` 下添加如下内容：

```ts
{
  'vue-toastification': ['Toast', 'useToast']
}
```

## 使用

在需要的地方：

```ts
useToast().error("错误信息");
```

更多配置与高级使用方法可以查看[官网](https://github.com/Maronato/vue-toastification)。
