# 浏览器缓存

浏览器缓存，强缓存弱缓存。

这里记录一个真实开发过程遇到的问题。

## 问题

### 问题出现

问题的起因是开发的项目中，有个按钮突然不能用了，但是在
别人的电脑上却能用。打开控制台后，发现报错

```
index-DYQN3zV-.js:1  Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
antdv-BV-FktJ-.js:1  Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
```

返回的类型是 html，期望收到 js。将报错丢给 ai，分析出来
html 是 nginx 服务器curl -I http://localhost/返回的 404 页面。

问题锁定在了请求的 js 文件不存在，打开请求 js 文件的 html 源代码
（ `/path` 页面），发现这里居然是过期的 html，指向了过期的 js 文件。

过期的 html 是指 `200 (从磁盘读取)`：浏览器使用了过期的强缓存。

### 环境检查

项目是一个 Vue SFC 项目，nginx 配置：

```nginx
location / {
    root   /path/to/dist;
    try_files $uri $uri/ /index.html;
    client_max_body_size       10000m;
    client_body_buffer_size    128m;

    access_log      /path/to/access.log;
    error_log       /path/to/error.log;

    gzip_static on;  # 支持 .gz 文件直接返回
    gzip on;
    gzip_types text/javascript application/javascript;
}
```

可见，`/path` 返回的是打包后的 `index.html`，可是为什么会过期呢？

经查询，其他的路径返回的却是最新的 html，很奇怪！为什么只有
`/path` 过期呢？

### iframe

查看代码发现，`/print` 页面是在 iframe 中加载的。

### 浏览器对比

经对比，只有 Edge 浏览器会有加载强缓存的问题，
Chrome、Safari 等浏览器都是 `304 Not Modified` 弱缓存。

## 问题总结

问题出在了 Nginx 没有配置缓存策略 `Cache-Control` Header，
但是会默认带上协商缓存（弱缓存）用的 `last-modified` 和 `etag`。

Edge 浏览器拿到了一个没有设置缓存策略响应，
于是根据 Edge 对 iframe 内容的激进缓存策略（仅推测，没找到文档说明），
Edge 就用了强缓存而没有向服务器确认 index.html 是否过期。

最终请求指向了一个旧版本的 js 文件，而由于 js 文件是带 hash 的，
更新之后旧版本文件已经不存在了！

## 解决方案

观察 Vite 打包出来的 dist 目录：

```
❯ tree -L 2 .
.
├── assets
│   ├── css
│   ├── jpg
│   ├── js
│   └── png
├── favicon.png
├── iconfont.js
├── iconfont.js.gz
└── index.html
```

可以发现，assets 目录下文件的文件名都是带有 hash 标识的，
而其他文件都不带有 hash（有可能被错误缓存）。

所以解决方案就是给 dist 目录下的文件设置 `Cache-Control "no-cache"`，
而 `/assets/` 路径下的文件则可以使用 `Cache-Control "imutable"` 来使用强缓存。

Nginx 配置：

```nginx
location / {
    root   /path/to/dist;
    try_files $uri $uri/ /index.html;

    ...

    # 禁用强缓存，防止出现过期问题
    add_header Cache-Control "no-cache";
}

location ~ ^/assets/ {
    root   /path/to/dist;

    ...

    # assets 目录下文件都是带 hash 的，设置长期缓存
    add_header Cache-Control "imutable, max-age=31536000";
}
```
