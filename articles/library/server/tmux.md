# tmux

## 配置

配置路径：`~/.tmux.conf`

配置：

```bash
# set-option -g status-position top

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

set -wg window-status-format " #I #W "            # 状态栏窗口名称格式
set -wg window-status-current-format " #I:#W#F "  # 状态栏当前窗口名称格式(#I：序号，#w：窗口名称，#F：间隔符)
set -wg window-status-separator ""                # 状态栏窗口名称之间的间隔

bind-key - split-window -h
bind-key | split-window -v
```