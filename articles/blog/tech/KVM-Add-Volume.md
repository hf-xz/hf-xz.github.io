---
date: 2026.11.03
---

# KVM 虚拟机添加磁盘

## 一、在宿主机创建 qcow2 磁盘并挂到虚拟机

**1. 创建虚拟磁盘文件（宿主机执行）**
```bash
qemu-img create -f qcow2 /var/lib/libvirt/images/<vm-name>-data.qcow2 2T
```

**2. 挂载到虚拟机（宿主机执行）**
```bash
sudo virsh attach-disk <vm-name> /var/lib/libvirt/images/<vm-name>-data.qcow2 vdb \
  --subdriver qcow2 --persistent
```
- `--persistent` 让配置写入持久化 XML，重启不丢。
- 如果报 `failed to get domain`，先 `virsh uri` 确认连接，必要时用 `sudo virsh -c qemu:///system ...`。

**3. 虚拟机内确认磁盘**
```bash
lsblk
```
应看到 `vdb` 无分区、无文件系统，大小正确。

---

## 二、创建文件系统

**1. 确认现有盘的文件系统类型，保持一致**
```bash
lsblk -f
```

**2. 整盘格式化（不分区，参考 graylog 那台的做法）**
```bash
# 如果现有盘是 xfs
sudo mkfs.xfs /dev/vdb
# 如果现有盘是 ext4
sudo mkfs.ext4 /dev/vdb
```

**3. 如果内核报 ext4 特性不支持**（你遇到过）
用保守特性重新格式化：
```bash
sudo mkfs.ext4 -O ^metadata_csum,^64bit /dev/vdb
```
确认：
```bash
lsblk -f /dev/vdb
```

---

## 三、临时挂载并迁移数据

**1. 临时挂载到空目录**
```bash
sudo mkdir -p /mnt/newdisk
sudo mount /dev/vdb /mnt/newdisk
```

**2. 复制原数据（保留权限属主）**
```bash
sudo cp -a /home/dell/data/. /mnt/newdisk/
```
用 `/.` 而不是 `/*`，确保隐藏文件也复制。数据量大时可用 `rsync -a --info=progress2` 替代。

**3. 核对复制结果**
```bash
sudo du -sh /home/dell/data /mnt/newdisk
ls -la /home/dell/data /mnt/newdisk
```

**4. 卸载临时挂载，正式挂到目标路径**
```bash
sudo umount /mnt/newdisk
sudo mkdir -p /home/dell/data
sudo mount /dev/vdb /home/dell/data
```

**5. 修正挂载后的目录属主（关键，你踩过）**
挂载后目录属主由文件系统根 inode 决定，`cp -a` 会保留源属主，可能变成 `sunmy:sunmy`。按业务用户修正：
```bash
sudo chown dell:dell /home/dell/data
# 如需递归改新盘所有文件
# sudo chown -R dell:dell /home/dell/data
```
同时确认上级目录可进入：
```bash
sudo chmod 755 /home/dell
```

**6. 业务验证**
启动业务、看日志、确认能读写 `/home/dell/data`。**验证通过前不要删原数据。**

---

## 四、写入 /etc/fstab

**1. 拿 UUID**
```bash
sudo blkid /dev/vdb
```

**2. 备份并删除旧行，用命令重写（避免空格/不可见字符）**
```bash
sudo cp /etc/fstab /etc/fstab.bak
sudo sed -i '\#/home/dell/data#d' /etc/fstab
echo "UUID=<你的UUID>  /home/dell/data  ext4  defaults,nofail  0  2" | sudo tee -a /etc/fstab
```
要点：
- 字段之间用两个空格，挂载点**末尾不带斜杠**，行首行尾无空格。
- 文件系统类型写实际类型（`ext4` 或 `xfs`）。
- **必须加 `nofail`**，避免挂载失败阻塞启动。

**3. 让 systemd 重新加载并测试**
```bash
sudo systemctl daemon-reload
sudo systemctl reset-failed home-dell-data.mount 2>/dev/null
sudo mount -a
sudo systemctl start home-dell-data.mount
systemctl status home-dell-data.mount --no-pager
```
若失败，用 `sudo journalctl -u home-dell-data.mount -b --no-pager` 看 `ExecMount` 的具体报错。

**4. 验证 fstab 语法**
```bash
sudo findmnt --verify --verbose
```

---

## 五、清理原数据（验证通过后）

**1. 卸载新盘，露出原目录**
```bash
sudo umount /home/dell/data
```

**2. 确认看到的是系统盘上的旧文件**
```bash
ls -la /home/dell/data
```

**3. 删除旧数据释放系统盘空间**
```bash
sudo rm -rf /home/dell/data/*
sudo rm -rf /home/dell/data/.[!.]* /home/dell/data/..?* 2>/dev/null
```

**4. 重新挂载新盘**
```bash
sudo mount /dev/vdb /home/dell/data
```

---

## 六、重启验证

```bash
sudo reboot
```
起来后确认：
```bash
lsblk -f /dev/vdb
mount | grep dell
systemctl status home-dell-data.mount --no-pager
ls -ld /home/dell/data
```
状态应为 `active (mounted)`，属主符合业务用户。

---

### 关键避坑清单

| 坑                              | 规避                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `failed to get domain`          | 用 `sudo virsh -c qemu:///system` 或 `virsh uri` 确认连接 |
| 重启丢盘                        | `attach-disk` 加 `--persistent`                           |
| ext4 特性不支持                 | `mkfs.ext4 -O ^metadata_csum,^64bit`                      |
| 挂载后属主变 `sunmy`            | 挂载状态下 `chown dell:dell /home/dell/data`              |
| fstab 空格导致 systemd 挂载失败 | 用 `echo ... | tee -a` 重写，不用 Vim 手调                |
| 挂载失败阻塞启动                | fstab 加 `nofail`                                         |
| 业务用户进不去 `/home/dell`     | `chmod 755 /home/dell`，或把挂载点换到 `/data`            |
