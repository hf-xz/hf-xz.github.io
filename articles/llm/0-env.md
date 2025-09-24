# 环境准备

## Python 环境

使用现代化的 Python 环境管理工具 [uv](https://docs.astral.sh/uv/) 来管理环境。

```sh
# 初始化
uv init
# 添加依赖
uv add <package-name>
# 安装依赖 (从 pyproject.toml 中读取)
uv sync
```
