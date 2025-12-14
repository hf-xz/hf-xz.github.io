# 新电脑配置

新电脑配置秉持最简原则，能不装的东西都不装。
下面记录本次更换 m4 macbook air 的配置过程：

## 1. 基础配置

### 1.1. 系统设置

依照习惯配置：

- Dock 栏大小及内容
- 触控板速度
- 右上角现实信息
- Capslock 与 Control 对调
- 等等其他系统配置

### 1.2. 网络配置

首先要有网！

通过与原来的电脑连接同一 WIFI 然后使用原电脑的梯子获取梯子软件。

### 1.3. 高级系统设置

一些没有图形化界面入口的设置：

- 长按连续输入（而不是输入变体）：`defaults write -g ApplePressAndHoldEnabled -bool false`

## 2. 软件安装

软件安装秉持着能用 Homebrew 就用 `brew install` 的宗旨。

### 2.1. 安装 Homebrew

从 [官网](https://brew.sh) 获得运行命令：

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装即可（需要先配好网络！）。

### 2.2. Homebrew 安装软件

可以安装 [Applite](https://github.com/milanvarady/Applite) 来作为图形化界面
管理 homebrew 安装的应用。
同时这个软件有导出功能可以一键导出所有安装的应用方便在新电脑配置。

以下是这次换电脑后用 `brew install` 直接安装的软件：

命令行软件：

| 软件名    | 用途                |
| --------- | ------------------- |
| kanata    | 键盘映射软件        |
| fish      | 跨平台终端，替代zsh |
| starship  | 跨 shell prompt     |
| nvim      | neovim yes!         |
| im-select | vim 自动切换输入法  |
| ripgrep   | better grep         |
| fd        | better find         |
| zoxide    | better cd           |
| bat       | better cat          |
| fzf       | 模糊搜索工具        |
| tmux      | 终端复用            |
| yazi      | 文件浏览器          |
| git       | 代码版本管理        |
| lazygit   | 懒的 git            |
| gum       | 更直观的 shell 脚本 |
| glow      | 终端 Markdown 渲染  |
| fvm       | node 版本管理       |
| yarn      | 前端依赖管理        |
| uv        | python 管理         |

图形化软件：

| 软件名                   | 用途            |
| ------------------------ | --------------- |
| font-maple-mono-nf-cn    | MapleMono 字体  |
| font-fira-code-nerd-font | FiraCode 字体   |
| raycast                  | 聚焦替代        |
| swift-shift              | 快捷拖动窗口    |
| arc                      | 浏览器          |
| visual-studio-code       | 编辑器          |
| wezterm                  | 终端            |
| orbstack                 | docker 界面     |
| typora                   | markdown 编辑器 |
| neovide                  | nvim 界面       |
| medis                    | redis 客户端    |
| dbeaver-community        | sql 客户端      |
| snipaste                 | 截图工具        |
| mos                      | 鼠标工具        |
| betterdisplay            | 显示器工具      |
| hiddenbar                | 状态栏工具      |
| stats                    | 状态栏系统监控  |
| iina                     | 播放器          |
| wechat                   | 微信            |
| cherry-studio            | ai 客户端       |

## 3. 终端配置

### 3.1. 基础配置

首先确保安装了 `antigen`

```sh
brew install antigen
```

下载 dotfiles，并安装

```sh
git clone git@github.com:hf-xz/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
./install
```

终端会自动安装依赖和配置文件

### 3.2. ssh 配置

运行以下命令以初始化 `.ssh` 目录并创建密钥对：

```sh
ssh-keygen -C "xuan__zai@outlook.com" # 创建密钥，记得输入 passphrase
ssh-add ~/.ssh/id_ed25519 # 添加私钥到 ssh-agent
```
