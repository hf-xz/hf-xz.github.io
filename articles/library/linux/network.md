# 网络相关

## 修改 ip

| 发行版 & 版本                                | 网络管理工具              | 配置文件路径                                                                          | 操作方式                                                                                    |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Ubuntu 18.04+**<br>**Debian 10+**          | **Netplan** (默认)        | `/etc/netplan/*.yaml`                                                                 | 编辑 YAML 文件 → `sudo netplan apply`                                                       |
| **Ubuntu ≤16.04**<br>**Debian ≤9**           | **ifupdown**              | `/etc/network/interfaces`                                                             | 编辑文件 → `sudo systemctl restart networking`                                              |
| **CentOS/RHEL 7**                            | **network-scripts**       | `/etc/sysconfig/network-scripts/ifcfg-enp1s0`                                         | 编辑 ifcfg 文件 → `sudo systemctl restart network`                                          |
| **CentOS/RHEL 8+**<br>**AlmaLinux/Rocky 8+** | **NetworkManager** (默认) | `/etc/NetworkManager/system-connections/enp1s0.nmconnection`<br>（或用 `nmcli` 生成） | 建议用 `nmcli` 或编辑 `.nmconnection` → `sudo nmcli con reload && sudo nmcli con up enp1s0` |
| **Fedora（较新）**                           | **NetworkManager**        | 同上                                                                                  | 同上                                                                                        |

> ⚠️ 修改前备份原文件！改错可能导致网络断开。

## 修改 hostname

```sh
sudo hostnamectl set-hostname <hostname>

# 添加其他主机 hostname 解析
sudo vi /etc/hosts
```
