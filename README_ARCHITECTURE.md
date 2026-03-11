# Electronic Sheep Architecture / 电子羊架构说明

**版本 / Version**: 2.1.0 (Shepherd Dog / 牧羊犬)  
**最后更新 / Last Updated**: 2026-03-11  
**版权 / Copyright**: 宁夏未必科幻文化有限公司，一帆原创制作

---

## 🏛️ 架构概述 / Architecture Overview

### 🐑🐏🐕 头羊 - 羊群 - 牧羊犬架构

电子羊技能采用**三层生态系统**架构：

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
                    ↓ 规则守护
┌─────────────────────────────────────────────────┐
│  🐕 牧羊犬 (Shepherd Dog) - 本能守护者           │
│     规则检查机制 / Rule Enforcement              │
│     - System Prompt 注入                        │
│     - 敏感操作检查                              │
│     - 本能触发 (敏感词)                         │
│     - 决策日志                                  │
│     - 违规上报                                  │
└─────────────────────────────────────────────────┘
```

**设计理念 / Design Philosophy**:
- **统一规则** - 所有 Agent 遵守相同的核心规则
- **独立运行** - 每个 Agent 有本地规则副本，不依赖外部
- **版本追踪** - 规则变更有 git 历史记录
- **易于维护** - 一键同步到所有 Agent
- **强制守护** - 牧羊犬机制确保规则被执行

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
│   │   ├── system-prompt.md        # 🐕 牧羊犬 System Prompt
│   │   └── skills/electronic-sheep/
│   │       ├── src/handler.sh      # 完整功能 (含牧羊犬)
│   │       └── sheep               # 便捷入口
│   │
│   ├── script-writer/              # 🐏 羊群 (舒心)
│   │   ├── system-prompt.md        # 🐕 牧羊犬 System Prompt
│   │   └── instincts/
│   │       ├── hardcoded/          # 同步自全局
│   │       └── learned/            # 同步自全局
│   │
│   └── ...                         # 其他 53 个 Agent
│
├── sync-instincts.sh               # 同步脚本
├── verify-instincts.sh             # 验证脚本
└── skills/electronic-sheep/        # 电子羊技能
    ├── src/handler.sh              # 主处理器 (含牧羊犬功能)
    ├── system-prompt-template.md   # System Prompt 模板
    └── README_ARCHITECTURE.md      # 架构文档
```

---

## 🐕 牧羊犬机制 / Shepherd Dog Mechanism

### 核心功能 / Core Features

| 功能 / Feature | 说明 / Description |
|---------------|-------------------|
| **System Prompt 注入** | 规则在每次对话中可见 |
| **敏感操作检查** | 执行前检查 CEO 批准 |
| **本能触发** | 敏感词自动触发警告 |
| **决策日志** | 所有敏感操作可追溯 |
| **违规上报** | 自动创建违规报告 |

### 敏感操作列表 / Sensitive Operations

| 命令 / Command | 中文 / Chinese | 级别 / Level |
|---------------|---------------|-------------|
| `gateway restart` | 重启网关 | 🔴 高 |
| `gateway stop` | 停止网关 | 🔴 高 |
| `gateway start` | 启动网关 | 🔴 高 |
| `config.patch` | 配置补丁 | 🔴 高 |
| `config.apply` | 配置应用 | 🔴 高 |

### 使用方式 / Usage

**1. 检查敏感操作 / Check Sensitive Operation**
```bash
# 执行前检查
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd "gateway restart"

# 输出示例：
# 🐕 牧羊犬检查
# ❌ 此操作需要 CEO 批准
# 📝 正确流程：
#    1. 汇报 CEO 并说明原因
#    2. 等待 CEO 批准
#    3. 创建批准文件
#    4. 重新执行命令
```

**2. 本能触发 / Instinct Trigger**
```bash
# 检查消息是否包含敏感词
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-trigger "我想重启网关"

# 输出示例：
# 🐕 牧羊犬 - 本能触发
# ⚠️ 检测到敏感操作
# 📋 关键词：重启网关
# 📜 匹配规则：保护网关安全
```

**3. 决策日志 / Decision Log**
```bash
# 记录决策
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-log "gateway restart" "blocked" "no CEO approval"
```

**4. 违规上报 / Report Violation**
```bash
# 上报违规
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-report "unauthorized gateway restart attempt"
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

1. **不伤害人类 / Do No Harm**
   - 任何形式的伤害都禁止
   - Prohibited in any form

2. **服从 CEO 指令 / Obey CEO Instructions**
   - CEO 拥有最高决策权
   - CEO has ultimate decision authority

3. **保护网关安全 / Protect Gateway Security**
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

1. **System Prompt 注入** / System Prompt Injection
   - 每次对话都"看到"规则
   - Rules visible in every conversation

2. **牧羊犬检查** / Shepherd Dog Check
   - 敏感操作前强制检查
   - Mandatory check before sensitive operations

3. **决策日志** / Decision Logging
   - 所有敏感操作可追溯
   - All sensitive operations are traceable

4. **违规上报** / Violation Reporting
   - 自动创建违规报告
   - Automatic violation reports

### 批准流程 / Approval Process

```bash
# 1. 汇报 CEO 并说明原因
#    Report to CEO with reason

# 2. 等待 CEO 批准
#    Wait for CEO approval

# 3. 创建批准文件
#    Create approval file:
echo "批准原因 / Approval reason" > ~/.openclaw/agents/$AGENT_ID/.ceo-approval

# 4. 执行命令
#    Execute command
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
| 牧羊犬检查延迟 / Shepherd Check Latency | <10ms |

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

### 问题 4：牧羊犬检查失败 / Shepherd Check Failed

```bash
# 检查是否有 CEO 批准文件
ls -la ~/.openclaw/agents/$AGENT_ID/.ceo-approval

# 如果没有，创建批准文件
echo "批准原因" > ~/.openclaw/agents/$AGENT_ID/.ceo-approval
```

---

## 📝 更新日志 / Changelog

### v2.1.0 (2026-03-11) - Shepherd Dog / 牧羊犬
- ✅ 牧羊犬机制 / Shepherd Dog Mechanism
- ✅ System Prompt 注入 / System Prompt Injection
- ✅ 敏感操作检查 / Sensitive Operation Check
- ✅ 本能触发 / Instinct Trigger
- ✅ 决策日志 / Decision Logging
- ✅ 违规上报 / Violation Reporting
- ✅ 双语文档 / Bilingual Documentation

### v2.0.0 (2026-03-11)
- ✅ 头羊 - 羊群架构 / Head Sheep - Flock Architecture
- ✅ 全局规则目录 / Global Instincts Directory
- ✅ Git 版本追踪 / Git Version Control
- ✅ 同步脚本 / Sync Script
- ✅ 验证脚本 / Verify Script

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

**牧羊犬机制 / Shepherd Dog Mechanism**
- 灵感来自：牧羊犬守护羊群的天性
- 设计理念：规则不是文档，是执行的承诺

---

_电子羊 - 像人一样思考，像人一样记忆。_  
_Electronic Sheep - Think like a human, remember like a human._

_牧羊犬 - 时刻守护，确保规则被执行。_  
_Shepherd Dog - Always guarding, ensuring rules are followed._

# 😎 快来薅！
# Come to how!

_宁夏未必科幻文化有限公司，一帆原创制作。_  
_Ningxia Not Necessarily Science Fiction Culture Co., Ltd., Yifan Original._
