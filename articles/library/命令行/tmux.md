# tmux

## 配置

配置路径：`~/.config/tmux/config.conf` 软连接到 `~/.tmux.conf`

配置：

```bash
### tmux config ###
# set-option -g status-position top   # 状态栏位置

# set-option -g mouse on              # tmux version >= 2.1
setw -g mouse-resize-pane on        # 鼠标修改窗格大小
setw -g mouse-select-pane on        # 鼠标选择窗格
setw -g mouse-select-window on      # 鼠标切换窗口
setw -g mode-mouse on               # 鼠标复制

setw -g mode-keys vi                # 复制模式使用 vi 键位

set -g status-utf8          on      # 状态栏支持utf8
set -g status-interval      1       # 状态栏刷新时间
set -g status-justify       left    # 状态栏列表左对齐
setw -g monitor-activity    on      # 非当前窗口有内容更新时在状态栏通知

set -g renumber-windows     on      # 关掉某个窗口后，编号重排
set-option -g allow-rename  off     # 禁止自动重命名窗口

set -wg window-status-format " #I #W "            # 状态栏窗口名称格式
set -wg window-status-current-format " #I:#W#F "  # 状态栏当前窗口名称格式(#I：序号，#w：窗口名称，#F：间隔符)
set -wg window-status-separator ""                # 状态栏窗口名称之间的间隔

# 设置选中窗口的背景色为黑色，文本颜色为绿色
set-window-option -g window-status-current-bg black
set-window-option -g window-status-current-fg green

# 分屏快捷键
bind-key \ split-window -h          # 水平分屏
bind-key - split-window -v          # 垂直分屏

# 绑定刷新配置快捷键
bind-key r source-file ~/.tmux.conf \; display-message "Config reloading..."
```

## 常用指令

[Tmux Cheat Sheet](https://tmuxcheatsheet.com/)