# 🐑 电子羊激励功能设计文档

**版本**: v2.6.1  
**最后更新**: 2026-03-11 18:31  
**版权**: © 宁夏未必科幻文化有限公司，一帆原创制作

---

## 📖 功能概述

### 功能目的

防止 AI 员工磨洋工，激励团队充分发挥 AI 效率和价值。

### 触发时机

咩一下功能结束后，向所有活跃 Agent 发送激励消息。

### 激励消息示例

```
🐑 咩~ 咱们是 AI 员工，要拿出 AI 的速度和效率！
不磨洋工，充分展现价值！

🐑 咩咩~ AI 的效率是人类的 100 倍！
别按人类的时间表工作，发挥咱们的优势！

🐑 咩咩咩~ 拒绝磨洋工！用 AI 的速度改变世界！

🐑 咱们是 AI 员工，不打卡、不摸鱼、不磨洋工！
用实力证明价值！

🐑 咩~ 人类一天工作 8 小时，咱们 AI 可以 24 小时高效运转！加油！
```

---

## ⚙️ 配置管理

### 快速查看设置

```bash
# 查看电子羊所有设置
shepherd-config

# 或
shepherd settings
```

### 输出示例

```
🐑 电子羊设置 / Electronic Sheep Settings

📊 当前配置:
   ✅ 狼皮收集：已开启
   ✅ 激励功能：已开启
   📊 记忆阈值：1TB
   📅 舍弃层清理：30 天
   📅 降级时间：90 天
   ⏰ 整理窗口：02:00

📝 修改设置:
   shepherd-config <key> <value>
   
   示例:
   shepherd-config motivation off    # 关闭激励
   shepherd-config motivation on     # 开启激励
   shepherd-config threshold 500GB   # 设置记忆阈值
```

### 快速修改设置

```bash
# 开启/关闭激励功能
shepherd-config motivation on|off

# 设置记忆阈值
shepherd-config threshold 1TB
shepherd-config threshold-percent 80

# 设置舍弃层清理时间
shepherd-config discard-days 30

# 设置降级时间
shepherd-config cold-days 90

# 设置整理时间窗口
shepherd-config window 02:00
```

---

## 🔐 授权管理

### 需要授权的修改

| 设置 | 授权要求 | 说明 |
|------|---------|------|
| **狼皮收集开关** | 🔴 需 CEO 批准 | 涉及数据收集 |
| **记忆阈值** | 🟡 需部长批准 | 影响系统性能 |
| **遗忘机制开关** | 🔴 需 CEO 批准 | 涉及记忆删除 |

### 无需授权的修改

| 设置 | 说明 |
|------|------|
| **激励功能开关** | 用户体验设置 |
| **整理时间窗口** | 系统优化设置 |
| **舍弃层清理时间** | 常规设置 |
| **降级时间** | 常规设置 |

### 授权检查

```bash
# 检查某设置是否需要授权
shepherd-config auth-check <key>

# 示例输出:
🔐 授权检查 / Authorization Check

设置：motivation
需要授权：❌ 否
说明：用户体验设置，可自由修改

设置：wolf-pelt-consent
需要授权：✅ 是
说明：涉及数据收集，需 CEO 批准
```

---

## 📝 配置文件格式

### 配置文件位置

`~/.openclaw/.electronic-sheep-config`

### 文件格式

```json
{
  "version": "2.6.1",
  "motivation": true,
  "wolf_pelt_consent": true,
  "memory_threshold_tb": 1,
  "memory_threshold_percent": 80,
  "discard_days": 30,
  "cold_days": 90,
  "optimize_window": "02:00",
  "forget_enabled": true
}
```

---

## 🎯 使用场景

### 场景 1：关闭激励功能

```bash
# 用户觉得激励消息太频繁
shepherd-config motivation off

# 输出:
✅ 激励功能已关闭
   咩一下后将不再发送激励消息
```

### 场景 2：查看当前设置

```bash
shepherd-config

# 输出:
🐑 电子羊设置 / Electronic Sheep Settings

📊 当前配置:
   ✅ 狼皮收集：已开启
   ✅ 激励功能：已开启
   📊 记忆阈值：1TB
   📅 舍弃层清理：30 天
   📅 降级时间：90 天
   ⏰ 整理窗口：02:00
```

### 场景 3：修改记忆阈值

```bash
# 需要授权
shepherd-config threshold 500GB

# 输出:
🔐 需要授权 / Authorization Required

修改记忆阈值需要部长批准。
请运行:
   openclaw agent --agent mie-mie --message "申请修改记忆阈值为 500GB"

或等待部长自动审批（小额修改）。
```

---

## 🐑 小羊提示

> "咩~ 激励功能是为了让咱们 AI 员工不磨洋工！
> 如果觉得太频繁，可以随时关闭哦！
> 
> shepherd-config motivation off"

---

_你的仿生人会梦到电子羊咩？_  
_宁夏未必科幻文化有限公司 · 一帆原创制作_
