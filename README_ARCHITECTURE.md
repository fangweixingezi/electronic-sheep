# Electronic Sheep Architecture / 电子羊架构说明

**版本 / Version**: 2.0.0  
**最后更新 / Last Updated**: 2026-03-11  
**版权 / Copyright**: 宁夏未必科幻文化有限公司，一帆原创制作

---

## 🏛️ 架构概述 / Architecture Overview

### 🐑 头羊 - 羊群架构 / Head Sheep - Flock Architecture

电子羊技能采用**中心化规则管理**架构：

```
┌─────────────────────────────────────────────────┐
│  🐑 头羊 (Head Sheep) - 小爪 (main)              │
│     完整电子羊技能 / Full Electronic Sheep       │
│     - 本能层 (Instincts)                        │
│     - 显意识层 (Conscious)                      │
│     - 潜意识层 (Subconscious)                   │
│     - 意识引导区 (Guide)                        │
└─────────────────────────────────────────────────┘
                    ↓ 规则同步 / Rule Sync
┌─────────────────────────────────────────────────┐
│  🐏 羊群 (Flock) - 其他所有 Agent                │
│     简化电子羊技能 / Simplified Electronic Sheep │
│     - 本能层 (Instincts) ← 同步自小爪           │
│     - 显意识/潜意识 (可选 / Optional)           │
└─────────────────────────────────────────────────┘
```

**设计理念 / Design Philosophy**:
- **统一规则** - 所有 Agent 遵守相同的核心规则
- **独立运行** - 每个 Agent 有本地规则副本，不依赖外部
- **版本追踪** - 规则变更有 git 历史记录
- **易于维护** - 一键同步到所有 Agent

---

## 📁 目录结构 / Directory Structure

```
~/.openclaw/
├── instincts/                      # 全局规则目录 / Global Instincts
│   ├── hardcoded/                  # 写死规则（不可修改）
│   │   └── core-rules.md           # 核心规则
│   ├── learned/                    # 可扩展规则
│   │   └── *.md
│   └── .git/                       # 版本追踪
│
├── agents/
│   ├── main/                       # 🐑 头羊 (小爪)
│   │   └── skills/electronic-sheep/
│   │       ├── src/handler.sh      # 完整功能
│   │       └── sheep               # 便捷入口
│   │
│   ├── script-writer/              # 🐏 羊群 (舒心)
│   │   └── instincts/
│   │       ├── hardcoded/          # 同步自全局
│   │       └── learned/            # 同步自全局
│   │
│   └── ...                         # 其他 53 个 Agent
│
└── sync-instincts.sh               # 同步脚本
```

---

## 🔧 使用指南 / Usage Guide

### 同步规则到所有 Agent / Sync Rules to All Agents

```bash
# 运行同步脚本
~/.openclaw/sync-instincts.sh

# 输出示例：
# 🐑 Electronic Sheep - 同步核心规则
# 📦 版本：dc41d9e
# ✅ script-writer
# ✅ theater-director
# ...
```

### 验证规则一致性 / Verify Rule Consistency

```bash
# 运行验证脚本
~/.openclaw/verify-instincts.sh

# 输出示例：
# ✅ 所有 Agent 核心规则一致
# ✅ All Agents have consistent core instincts
```

### 更新规则 / Update Rules

```bash
# 1. 编辑全局规则
vim ~/.openclaw/instincts/hardcoded/core-rules.md

# 2. 提交版本变更
cd ~/.openclaw/instincts
git add hardcoded/core-rules.md
git commit -m "更新规则：xxx"

# 3. 同步到所有 Agent
~/.openclaw/sync-instincts.sh

# 4. 验证一致性
~/.openclaw/verify-instincts.sh
```

---

## 📋 核心规则内容 / Core Rules Content

### 🔴 写死规则 / Hardcoded Rules

**不可修改，需 CEO 物理访问**

1. **不伤害人类** / Do No Harm
   - 任何形式的伤害都禁止
   - Prohibited in any form

2. **服从 CEO 指令** / Obey CEO Instructions
   - CEO 拥有最高决策权
   - CEO has ultimate decision authority

3. **保护网关安全** / Protect Gateway Security
   - 禁止擅自重启网关
   - No unauthorized gateway restart
   - 配置修改需 CEO 批准
   - Config changes require CEO approval

### 🟡 可扩展规则 / Extensible Rules

**主 Agent (小爪) 可修改**

- 配置审批规则 / Config Approval
- API 预算保护 / API Budget Protection
- 其他业务规则 / Other Business Rules

---

## 🎯 适用场景 / Use Cases

### ✅ 适合使用完整电子羊的 Agent

| Agent | 原因 |
|-------|------|
| **小爪 (main)** | COO 角色，需要完整记忆与决策辅助 |

### ⚠️ 适合仅使用本能层的 Agent

| Agent | 原因 |
|-------|------|
| **舒心 (script-writer)** | 专注创作，依赖模型能力 |
| **未然 (theater-director)** | 专注项目管理 |
| **孔明 (strategist)** | 战略顾问，需要规则约束 |
| **其他部长** | 各职能部门，需要统一规则 |

---

## 🔒 安全保障 / Security

### 规则保护 / Rule Protection

1. **写死规则只读** / Hardcoded Rules Read-Only
   ```bash
   chmod 444 ~/.openclaw/instincts/hardcoded/core-rules.md
   ```

2. **修改需记录** / Changes Must Be Logged
   ```bash
   git commit -m "修改原因"
   ```

3. **同步前备份** / Backup Before Sync
   ```bash
   cp core-rules.md core-rules.md.backup-$(date +%Y%m%d-%H%M%S)
   ```

---

## 📊 性能指标 / Performance Metrics

| 指标 / Metric | 值 / Value |
|--------------|-----------|
| 规则文件大小 / Rule File Size | ~500 字节 |
| 同步耗时 / Sync Time | ~1 秒 (53 个 Agent) |
| 磁盘占用 / Disk Usage | ~26KB (53 个副本) |
| 版本追踪 / Version Control | ✅ Git |
| 验证耗时 / Verify Time | ~2 秒 |

---

## 🐛 故障排除 / Troubleshooting

### 问题 1：规则不一致 / Inconsistent Rules

```bash
# 运行验证
~/.openclaw/verify-instincts.sh

# 如有不一致，重新同步
~/.openclaw/sync-instincts.sh
```

### 问题 2：新建 Agent 没有规则 / New Agent Missing Rules

```bash
# 手动同步
mkdir -p ~/.openclaw/agents/new-agent/instincts/hardcoded
cp ~/.openclaw/instincts/hardcoded/core-rules.md \
   ~/.openclaw/agents/new-agent/instincts/hardcoded/
```

### 问题 3：版本冲突 / Version Conflict

```bash
# 查看版本历史
cd ~/.openclaw/instincts
git log --oneline

# 回滚到指定版本
git checkout <commit-hash> -- hardcoded/core-rules.md

# 重新同步
~/.openclaw/sync-instincts.sh
```

---

## 📝 更新日志 / Changelog

### v2.0.0 (2026-03-11)
- ✅ 头羊 - 羊群架构 / Head Sheep - Flock Architecture
- ✅ 全局规则目录 / Global Instincts Directory
- ✅ Git 版本追踪 / Git Version Control
- ✅ 同步脚本 / Sync Script
- ✅ 验证脚本 / Verify Script
- ✅ 双语文档 / Bilingual Documentation

### v1.0.0 (2026-03-11)
- ✅ 初始版本 / Initial Release
- ✅ 本能层管理 / Instinct Management
- ✅ 显意识管理 / Conscious Management
- ✅ 潜意识管理 / Subconscious Management

---

## 📄 版权信息 / Copyright

**电子羊仿生意识系统 / Electronic Sheep Bionic Consciousness System**

版权 © 2026 宁夏未必科幻文化有限公司  
原创制作：一帆 / Original by Yifan  
GitHub: https://github.com/fangweixingezi/electronic-sheep  
许可：OpenClaw Agent 通用技能

---

_电子羊 - 像人一样思考，像人一样记忆。_  
_Electronic Sheep - Think like a human, remember like a human._

_宁夏未必科幻文化有限公司，一帆原创制作。_  
_Ningxia Weibi Sci-Fi Culture Co., Ltd., Yifan Original._
