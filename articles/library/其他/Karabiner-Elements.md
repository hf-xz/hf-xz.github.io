# Karabiner-Elements

这是一个自定义键盘映射的工具，我用这个工具来实现一些符合我习惯的
键盘映射功能。

## 安装

```sh
brew install karabiner-elements
```

安装好后运行程序，按要求开启权限

## CapsLock

首先是大小写锁定，因为我习惯用 vim 模式，所以 esc 和 ctrl 对我来
说很重要。相对的，capslock 键对我来说并没有那么重要，反而占据了
一个方便的位置（处于 home row）。综上，我采用了如下的策略：

- caps -> esc
- caps + [key] -> ctrl + [key]
- shift + caps -> caps

这样既满足了 esc 快速回 normal 模式，也满足了命令行等场景需要 ctrl

切换输入法则由 shift + caps 或者 caps + space ( -> ctrl + space)

以上通过 predefined rule `e0da Caps Lock` 实现 (Complex Modifications)
