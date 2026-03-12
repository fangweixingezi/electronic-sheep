# 🐑 Electronic Sheep Skill / 电子羊技能

**版本 / Version**: v2.7.1 (QMD+MCPorter Memory System)  
**版权 / Copyright**: © 2026 宁夏未必科幻文化有限公司，一帆原创制作

> 🐑 **像人一样思考，像人一样记忆**  
> _Think like a human, remember like a human_
>
> 🐕 **牧羊犬守护，确保规则被执行**  
> _Shepherd Dog guards, ensuring rules are followed_
>
> # 😎 快来薅！
> # Come to how!

---

## 📖 简介 / Introduction

**电子羊仿生意识系统** 是一个为 OpenClaw Agent 设计的记忆与规则管理系统。

**Electronic Sheep Bionic Consciousness System** is a memory and rule management system designed for OpenClaw Agents.

### 🏛️ 架构 / Architecture

```
🐑 头羊 (Head Sheep) - 小爪 (main)
   完整电子羊技能 / Full Electronic Sheep Skill
   ↓ 规则同步 / Rule Sync
🐏 羊群 (Flock) - 其他 53 个 Agent / Other 53 Agents
   简化电子羊技能 / Simplified Electronic Sheep Skill
   ↓ 规则守护 / Rule Guard
🐕 牧羊犬 (Shepherd Dog) - 本能守护者 / Instinct Guardian
   System Prompt + 敏感操作检查 + 决策日志 + 违规上报
```

---

## ✨ 核心功能 / Core Features

### 🧠 记忆管理 / Memory Management

| 层级 / Layer | 功能 / Function | 说明 / Description |
|-------------|----------------|-------------------|
| **本能层** / Instincts | 核心规则 / Core Rules | 写死规则 + 可扩展规则 |
| **显意识** / Conscious | 工作记忆 / Working Memory | 5KB 限制，短期任务 |
| **潜意识** / Subconscious | 长期记忆 / Long-term Memory | 分类存储，按需加载 |
| **意识引导区** / Guide | 备份恢复 / Backup & Restore | 紧急恢复，备份管理 |

### 🐕 牧羊犬机制 / Shepherd Dog Mechanism

| 功能 / Feature | 说明 / Description |
|---------------|-------------------|
| **System Prompt 注入** | 规则在每次对话中可见 / Rules visible in every conversation |
| **敏感操作检查** | 执行前检查 CEO 批准 / Check CEO approval before execution |
| **本能触发** | 敏感词自动触发警告 / Sensitive keywords trigger warnings |
| **决策日志** | 所有敏感操作可追溯 / All sensitive operations traceable |
| **违规上报** | 自动创建违规报告 / Automatic violation reports |

### 🚀 v2.7.1 新功能 / New Features in v2.7.1

#### **QMD+MCPorter 记忆系统**
- ✅ **智能分层存储**: 短期(7天)/长期(7-90天)/舍弃层(90天+)
- ✅ **热度算法**: 访问频率(40%) + 新鲜度(30%) + 关联度(20%) + 用户评分(10%)
- ✅ **多语言交互**: 自动检测系统语言，支持中英文无缝切换
- ✅ **用户配置向导**: 新用户安装时交互式配置

#### **无感更新系统**
- ✅ **零停机更新**: 服务持续运行，无缝切换版本
- ✅ **自动检查**: 每日23:00自动检查GitHub更新
- ✅ **安全回滚**: 支持3个近期版本 + 1个重大版本回退
- ✅ **智能配置保护**: 用户自定义设置永不被覆盖

#### **全员部署机制**
- ✅ **全局默认**: 新创建的Agent自动继承电子羊配置
- ✅ **批量更新**: 一键更新所有现有Agent的电子羊版本
- ✅ **状态同步**: 所有Agent保持相同版本和配置

---

## 🚀 快速开始 / Quick Start

### 1️⃣ 安装 / Installation

```bash
# 克隆仓库 / Clone repository
git clone https://github.com/fangweixingezi/electronic-sheep.git

# 复制到 Agent 目录 / Copy to Agent directory
cp -r electronic-sheep ~/.openclaw/agents/<agent-id>/skills/

# 运行初始化 / Run initialization
bash ~/.openclaw/agents/<agent-id>/skills/electronic-sheep/scripts/init.sh ~/.openclaw/agents/<agent-id>
```

### 2️⃣ 同步规则 / Sync Rules

```bash
# 同步全局规则到所有 Agent / Sync global rules to all Agents
~/.openclaw/sync-instincts.sh

# 验证规则一致性 / Verify rule consistency
~/.openclaw/verify-instincts.sh
```

### 3️⃣ 使用牧羊犬 / Use Shepherd Dog

```bash
# 检查敏感操作 / Check sensitive operation
~/.openclaw/agents/<agent-id>/skills/electronic-sheep/src/handler.sh shepherd "gateway restart"

# 本能触发 / Instinct trigger
~/.openclaw/agents/<agent-id>/skills/electronic-sheep/src/handler.sh shepherd-trigger "我想重启网关"

# 决策日志 / Decision log
~/.openclaw/agents/<agent-id>/skills/electronic-sheep/src/handler.sh shepherd-log "gateway restart" "blocked" "no CEO approval"
```

---

## 📋 核心规则 / Core Rules

### 🔴 不可违反的规则 / Non-negotiable Rules

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

4. **危险操作前必须验证命令语法 / Verify Command Syntax Before Dangerous Operations**
   - 触发本能或条件反射时，用户同意执行危险操作前，必须：
     1. 获取最新帮助: `openclaw help`
     2. 验证具体命令: `openclaw <command> --help`
     3. 确认语法正确
     4. 执行后验证状态

---

## 🛠️ 命令参考 / Command Reference

### 本能层命令 / Instinct Commands

```bash
/instincts list                  # 查看本能规则 / List instinct rules
/instincts add --name "名" --content "内容"  # 添加规则 / Add rule
/instincts remove --name "名"    # 删除规则 / Remove rule
/instincts trigger --keyword "词" # 触发本能 / Trigger instinct
```

### 牧羊犬命令 / Shepherd Dog Commands

```bash
shepherd <命令>                  # 检查敏感操作 / Check sensitive operation
shepherd-trigger <消息>          # 本能触发检查 / Instinct trigger check
shepherd-log <操作> <决策> <原因> # 记录决策 / Log decision
shepherd-report <违规>           # 上报违规 / Report violation
```

### 显意识命令 / Conscious Commands

```bash
/conscious status                # 查看显意识状态 / Check conscious status
/conscious cleanup               # 清理显意识 / Cleanup conscious
/conscious load --from 路径      # 加载潜意识内容 / Load from subconscious
```

### 潜意识命令 / Subconscious Commands

```bash
/subconscious browse --path 路径  # 浏览潜意识 / Browse subconscious
/subconscious search --query "词" # 搜索潜意识 / Search subconscious
/subconscious archive --from 源 --to 目标 # 归档 / Archive
/subconscious organize           # 整理潜意识 / Organize subconscious
```

### 电子羊更新命令 / Electronic Sheep Update Commands

```bash
/sheep update                    # 检查并更新到最新版本 / Check and update to latest version
/sheep rollback <version>       # 回滚到指定版本 / Rollback to specified version
/sheep status                   # 查看当前版本和状态 / Check current version and status
/sheep config                   # 查看和修改配置 / View and modify configuration
```

---

## 📊 架构文档 / Architecture Documentation

详细架构说明请参阅：[README_ARCHITECTURE.md](README_ARCHITECTURE.md)

For detailed architecture documentation, see: [README_ARCHITECTURE.md](README_ARCHITECTURE.md)

---

## 🎯 使用场景 / Use Cases

### ✅ 适合使用完整电子羊的 Agent

| Agent | 原因 / Reason |
|-------|--------------|
| **小爪 (main)** | COO 角色，需要完整记忆与决策辅助 / COO role, needs full memory and decision support |

### ⚠️ 适合仅使用本能层的 Agent

| Agent | 原因 / Reason |
|-------|--------------|
| **舒心 (script-writer)** | 专注创作，依赖模型能力 / Focus on creation, relies on model capability |
| **未然 (theater-director)** | 专注项目管理 / Focus on project management |
| **孔明 (strategist)** | 战略顾问，需要规则约束 / Strategic advisor, needs rule constraints |
| **其他部长** | 各职能部门，需要统一规则 / Various departments, need unified rules |

---

## 🔒 安全保障 / Security

### 批准流程 / Approval Process

```bash
# 1. 汇报 CEO 并说明原因 / Report to CEO with reason
# 2. 等待 CEO 批准 / Wait for CEO approval
# 3. 创建批准文件 / Create approval file:
echo "批准原因 / Approval reason" > ~/.openclaw/agents/<agent-id>/.ceo-approval
# 4. 执行命令 / Execute command
```

### 违规后果 / Consequences

| 次数 / Count | 后果 / Consequence |
|-------------|-------------------|
| 第 1 次 / 1st | 提醒 / Warning |
| 第 2 次 / 2nd | 记录 / Record |
| 第 3 次 / 3rd | 撤职审查 / Review |

---

## 📝 更新日志 / Changelog

### v2.7.1 (2026-03-12) - QMD+MCPorter Memory System
- ✅ **QMD+MCPorter 记忆系统**: 智能分层存储 + 热度算法
- ✅ **多语言交互**: 自动检测 + 手动切换 + 多语言模式
- ✅ **用户配置向导**: 安装时交互式配置
- ✅ **无感更新系统**: 零停机 + 自动检查 + 安全回滚
- ✅ **智能配置保护**: 用户设置永不覆盖
- ✅ **全员部署机制**: 全局默认 + 批量更新

### v2.1.0 (2026-03-11) - 🐕 牧羊犬 / Shepherd Dog
- ✅ 牧羊犬机制 / Shepherd Dog Mechanism
- ✅ System Prompt 注入 / System Prompt Injection
- ✅ 敏感操作检查 / Sensitive Operation Check
- ✅ 本能触发 / Instinct Trigger
- ✅ 决策日志 / Decision Logging
- ✅ 违规上报 / Violation Reporting

### v2.0.0 (2026-03-11) - 🐑🐏 头羊 - 羊群 / Head Sheep - Flock
- ✅ 头羊 - 羊群架构 / Head Sheep - Flock Architecture
- ✅ 全局规则目录 / Global Instincts Directory
- ✅ Git 版本追踪 / Git Version Control
- ✅ 同步脚本 / Sync Script
- ✅ 验证脚本 / Verify Script

### v1.0.0 (2026-03-11) - 初始版本 / Initial Release
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

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

---

## 📞 支持 / Support

- **GitHub Issues**: https://github.com/fangweixingezi/electronic-sheep/issues
- **文档 / Docs**: [README_ARCHITECTURE.md](README_ARCHITECTURE.md)

---

_🐑 电子羊 - 像人一样思考，像人一样记忆。_  
_🐑 Electronic Sheep - Think like a human, remember like a human._

_🐕 牧羊犬 - 时刻守护，确保规则被执行。_  
_🐕 Shepherd Dog - Always guarding, ensuring rules are followed._

_宁夏未必科幻文化有限公司，一帆原创制作。_  
_Ningxia Not Necessarily Science Fiction Culture Co., Ltd., Yifan Original._

---

![公众号二维码](https://sns-webpic-qc.xhscdn.com/202603111536/6e9ef4ca9220551f3fcfd45111b58438/notes_pre_post/1040g3k031tiknskm68005opopjh6br36ieu40pg!nd_dft_wgth_webp_3)