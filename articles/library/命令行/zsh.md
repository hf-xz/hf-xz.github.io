# zsh

## 配置

配置路径：`~/.zshrc`

::: info
使用了 oh-my-zsh，安装了高亮、提示等插件。
:::

配置：

```bash
# ENV
export EDITOR='nvim'
export LANG="zh_CN.UTF-8"
export LC_ALL="zh_CN.UTF-8"

# theme
# ZSH_THEME="powerlevel10k/powerlevel10k"
ZSH_THEME="agnoster"
# ZSH_THEME="ys"

# plugins
plugins=(
git
vi-mode
wd
z
extract
zsh-syntax-highlighting
zsh-autosuggestions
tmux
)

# basic
export ZSH=$HOME/.oh-my-zsh
source $ZSH/oh-my-zsh.sh
# source ~/.bash_profile

# vi-mode
bindkey -v
export KEYTIMEOUT=1

# edit command in vim with ctrl-e
autoload edit-command-line; zle -N edit-command-line
bindkey '^e' edit-command-line

# basic alias
alias cl="clear"
alias rm="rm -i"
alias cp="cp -i"
alias mv="mv -i"

# custom alias
alias vi="nvim"
alias tree="tree -AC -L"
alias configzsh="vi ~/.zshrc"

# ranger
export RANGER_LOAD_DEFAULT_RC=false
rg() {
    if [ -z "$RANGER_LEVEL"]
    then
        ranger --cmd="set preview_files!"
    else
        exit
    fi
}

# auto tmux
# if [ -z "$TMUX" ]; then
#   tmux attach-session || tmux new-session -n $HOSTNAME
# fi
```

