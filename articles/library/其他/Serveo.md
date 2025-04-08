# Serveo

> Serveo is an SSH server just for remote port forwarding. When a user connects to Serveo, they get a public URL that anybody can use to connect to their localhost server.

## 介绍

官网: [https://serveo.net/](https://serveo.net/)

这是一个 SSH 反向代理服务，使用起来非常简单，只需要在终端中运行以下命令：

```bash
ssh -R 80:localhost:8080 serveo.net
```

就可以将本地的 8080 端口映射到 Serveo 的 80 端口上。Serveo 会返回一个 URL，任何人都可以通过这个 URL 访问你的本地服务。

## 自定义域名

你可以参考官网的 `Custom Domain` 章节来添加自己的域名。

简单来说，你需要：

1. 通过 `ssh-keygen -l` 命令获取你的 fingerprint（形如 SHA256:pmc7ZRv7ymCmghUwHoJWEm5ToSTd33ryeDeps5RnfRY）。
2. 在域名解析添加一条 CNAME 记录，指向 `serveo.net`。
3. 在域名解析添加一条 TXT 记录，主机记录为 `_serveo-authkey.[domain]`（步骤2），值为 `[fingerprint]`（步骤1）。

然后你就可以通过 `ssh -R domain.your.address:80:localhost:8080 serveo.net` 来使用你的域名了。

## 命令包装

为了方便使用，可以将上面的命令封装成一个函数并放到 `zshrc` 中：

```sh
# serveo
serveo() {
  if [[ $# -eq 0 ]]; then
    echo "错误：必须指定本地端口号！"
    echo "用法：serveo <本地端口>"
    return 1  # 返回非零状态码表示失败
  fi

  local port="$1"
  # 可选：验证端口是否为有效数字（1-65535）
  if ! [[ "$port" =~ ^[0-9]+$ ]] || ((port < 1 || port > 65535)); then
    echo "错误：端口号必须是 1-65535 之间的整数！"
    return 1
  fi

  # 执行 SSH 端口转发
  ssh -R "serveo.hfxz.link:80:localhost:${port}" serveo.net
}
```

然后就可以通过运行 `serveo <port>` 来快速将本地的端口映射到我的 `serveo.hfxz.link` 上了。
