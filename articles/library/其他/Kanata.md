# Kanata

参考:
- https://github.com/jtroo/kanata/discussions/1537
- https://github.com/dreamsofcode-io/home-row-mods/tree/main/kanata/macos

## 配置文件

- [kanata 配置文件](https://github.com/hf-xz/dotfiles/blob/master/kanata/kanata.kbd)
- com.example.kanata.plist:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
      <key>Label</key>
      <string>com.example.kanata</string>

      <key>ProgramArguments</key>
      <array>
          <string>{{ path to kanata }}</string>
          <string>-c</string>
          <string>{{ path to config }}</string>
      </array>

      <key>RunAtLoad</key>
      <true/>

      <key>KeepAlive</key>
      <true/>

      <key>StandardOutPath</key>
      <string>/Library/Logs/Kanata/kanata.out.log</string>

      <key>StandardErrorPath</key>
      <string>/Library/Logs/Kanata/kanata.err.log</string>
  </dict>
  </plist>
  ```

## 步骤

### 安装驱动 karabiner-elements

```sh
brew install --cask karabiner-elements
```

运行 karabiner-elements 根据提示设置所有 macos 权限

配置完后退出 karabiner-elements 应用程序，包括菜单栏中的！

### 安装 kanata

```sh
brew install kanata
```

准备 kanata 配置文件（见上文）

运行 `sudo kanata -d -c ~/.config/kanata/kanata.kbd` 验证安装

### 配置 lauchctl

将 plist（见上文）写入 `com.example.kanata.plist`

```sh
sudo cp ./com.example.kanata.plist /Library/LaunchDaemons/
```

### 操作

```sh
# 注册
sudo launchctl load /Library/LaunchDaemons/com.example.kanata.plist
# 启动
sudo launchctl start com.example.kanata
# 其他命令
sudo launchctl stop    com.example.kanata # 停止
sudo launchctl print   system/com.example.kanata # 查看状态
sudo launchctl enable  system/com.example.kanata # 启用（开机启动）
sudo launchctl disable system/com.example.kanata # 禁用
sudo launchctl unload  system/com.example.kanata # 注销

# 查看日志
sudo tail -f /Library/Logs/Kanata/kanata.err.log
```