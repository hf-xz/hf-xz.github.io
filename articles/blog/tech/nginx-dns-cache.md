---
date: 2026.03.19
---

# Nginx DNS Cache 问题

## 现象

Docker Compose 环境下，服务容器重启后，Nginx 持续返回 502 Bad Gateway，但手动重启 Nginx 容器后立刻恢复正常。

典型的错误日志长这样：

```
connect() failed (113: No route to host) while connecting to upstream
```

反复出现的 IP 是已经被销毁的旧容器地址。

## 原因

这不是 Nginx 的 bug，而是它的设计取舍。

Nginx 处理 `proxy_pass` 时，如果后面直接跟一个域名（不含变量），它只会在**启动或 reload 配置时解析一次**，然后把得到的 IP 永久缓存在内存中。

```nginx
# 这种写法只会解析一次
proxy_pass http://backend-service:8080;
```

Docker Compose 的动态 IP 分配机制让这个问题暴露了出来。容器重启或重建时，Docker 很可能会分配一个新的 IP 地址。但 Nginx 内存里的旧 IP 不会自动更新，于是它一直往一个已经不存在的主机发请求，502 就来了。

重启 Nginx 之所以能“解决”，是因为这会触发一次全新的 DNS 解析，Nginx 拿到新 IP 后一切正常——直到下次容器 IP 再变。

## 静态解析 vs 动态解析

Nginx 对 `proxy_pass` 域名的处理有两条路径：

| 写法                                                          | 解析时机   | IP 变化感知                |
| ------------------------------------------------------------- | ---------- | -------------------------- |
| `proxy_pass http://backend:8080;`                             | 启动时一次 | 无                         |
| `set $backend backend:8080;`<br>`proxy_pass http://$backend;` | 运行时按需 | 有（受 resolver 缓存控制） |

关键区别在于**是否使用了变量**。只有 `proxy_pass` 中包含变量时，Nginx 才会启用内置的异步 DNS 解析器，在运行时按需查询。

## 解决方案：resolver + 变量

### 配置要点

必须同时满足两个条件，缺一不可：

1. **显式配置 `resolver`**，指向 Docker 内置 DNS（`127.0.0.11`）
2. **`proxy_pass` 使用变量**，不能是字面量域名

```nginx
server {
    listen 80;
    server_name _;

    location / {
        # Docker 内置 DNS，valid 控制缓存时长
        resolver 127.0.0.11 valid=10s ipv6=off;

        # 将后端地址赋值给变量
        set $backend "http://backend-service:8080";

        # 使用变量触发动态解析
        proxy_pass $backend;

        # 变量写法下 Host 头不会自动继承，需要显式设置
        proxy_set_header Host $proxy_host;

        # 常规代理头
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 关于 valid 参数

`valid=10s` 表示 DNS 解析结果最多缓存 10 秒。服务重启后，Nginx 最多需要 10 秒就能感知到新 IP。

对于 Docker Compose 这种容器重启频繁度不高的场景，10 到 30 秒是比较合理的值。Docker 内置 DNS 在同一个 bridge 网络内响应极快，这个频率的查询开销可以忽略不计。

`ipv6=off` 建议加上。Docker 环境通常不配置 IPv6，关掉可以避免因 IPv6 解析失败而拖慢请求。

### 常见踩坑

**resolver 放错位置。** 写在 `http` 块顶层可能被忽略，应该放在 `server` 或 `location` 块内。

**漏掉 valid 参数。** 不指定 `valid` 时，Nginx 可能永久缓存解析结果，等于白配。

**以为 upstream 块也能动态解析。** 在 `upstream` 块里写域名，即使配了 `resolver` 也不会生效——域名仍然只在启动时解析一次。

**HTTPS 后端忘了 SNI。** 如果后端是 HTTPS，还需要 `proxy_ssl_server_name on;` 和 `proxy_ssl_name $backend;`，否则 TLS 握手会失败。

## 在 Kubernetes 中如何解决？

Kubernetes 的网络模型和 Docker Compose 有本质区别。

在 K8s 中，你通常不会直接代理 Pod IP，而是代理 **Service 名称**。Service 是一个稳定的虚拟 IP（ClusterIP），由 kube-proxy 维护从 ClusterIP 到 Pod 的转发规则。

当 Pod 重建时，Service 的 ClusterIP **不会变**，变的是它背后的 Endpoints。这意味着，如果你的 Nginx 直接代理 Service 名称（或 ClusterIP），**根本不会遇到 Docker Compose 里的这个问题**。

```
Pod 重建 → 新 Pod IP → Endpoints 更新 → ClusterIP 不变
```

### 那 K8s 里还需要 resolver 吗？

取决于你代理的目标。

**场景一：直接代理 Service 名称（最常见）**

如果你在 Nginx 配置里写的是 `proxy_pass http://my-service:8080;`，而 `my-service` 是一个 K8s Service，那么：

- Service 名称由 CoreDNS 解析，返回的是**稳定的 ClusterIP**
- Pod 重建不影响 ClusterIP
- **不需要 resolver 和变量**，静态解析完全没问题

这是 K8s 设计的一个核心优势：Service 抽象层天然屏蔽了 Pod IP 的变化。

**场景二：代理 Headless Service 或直接代理 Pod 域名**

Headless Service（`clusterIP: None`）没有 ClusterIP，DNS 直接返回 Pod IP 列表。Pod 重建后 IP 会变。

如果你在代理 Headless Service 的名称，或者通过 StatefulSet 的 Pod DNS（如 `pod-0.my-service.namespace.svc.cluster.local`）代理，那么仍然会遇到 IP 变化的问题。

此时需要同样的方案：`resolver` 指向 **CoreDNS 的 ClusterIP**，配合变量使用。

```nginx
resolver 10.247.3.10 valid=10s ipv6=off;

set $backend "http://pod-0.my-service.namespace.svc.cluster.local:8080";
proxy_pass $backend;
```

CoreDNS 的 ClusterIP 可以通过 `kubectl get svc -n kube-system coredns` 获取。

**场景三：使用 Nginx Ingress Controller**

如果你用的是 K8s 的 Nginx Ingress Controller，情况又不一样。Ingress Controller 会监听 Service 和 Endpoints 的变化，自动更新 upstream 配置。它内部使用的是一套不同于原生 Nginx 的动态更新机制，你不必手动处理 resolver 问题。

## 小结

Docker Compose 下的 502 问题，根源是 Nginx 静态解析与 Docker 动态 IP 的错配。解法是 `resolver 127.0.0.11 valid=10s` + 变量形式的 `proxy_pass`。

K8s 中，直接代理 Service 名称通常不会遇到这个问题，因为 ClusterIP 是稳定的。只有代理 Headless Service 或 Pod 级别 DNS 时才需要同样的处理，resolver 指向 CoreDNS。
