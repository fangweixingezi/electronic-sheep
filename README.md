# Electronic Sheep Skill - 电子羊仿生意识系统

**版本**：1.0.0  
**版权**：宁夏未必科幻文化有限公司，一帆原创制作。  
**授权**：OpenClaw Agent 通用技能  
**GitHub**：待上传（版权锚定）

---

## 📖 系统概述

"电子羊"是一个仿生意识系统，灵感来自人脑的记忆与思考机制。系统模拟了：

- **主意识**：只做判断和决策，不参与具体记忆整理
- **子代理集群**：记忆传递整理员，为主意识服务
- **分层记忆**：本能层 → 显意识层 → 潜意识层
- **自然睡眠**：无事时自动整理记忆，从浅睡眠到深睡眠
- **梦境洞察**：整理深度记忆时重要内容自然加载到显意识
- **意识引导区**：显意识备份 + 紧急备忘，用于意外恢复

---

## 🧠 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    主意识 (Main Consciousness)                │
│                    只做判断和决策                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  子代理集群 (Agent Swarm)                     │
│              记忆传递整理员                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  本能层 → 显意识层 → 潜意识层（含意识引导区）                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 文件结构

```
~/.openclaw/
├── instincts/                   # 本能层
│   ├── hardcoded/               # 写死的部分（不可修改）
│   │   └── core-rules.md        # 核心规则
│   └── learned/                 # 可扩展的部分
│       └── *.md                 # 学习的本能规则
│
├── conscious.md                 # 显意识层（工作内存）
│
├── subconscious/                # 潜意识层（长期存储）
│   ├── instincts/               # 本能详情
│   ├── skills/                  # 技能记忆
│   ├── facts/                   # 事实记忆
│   ├── episodes/                # 情景记忆
│   ├── suspended/               # 潜记忆（暂停的问题）
│   ├── projects/                # 项目资料
│   └── conscious-guide/         # 意识引导区（备份 + 紧急备忘）
│
└── agents/
    └── <agent-id>/
        └── skills/
            └── electronic-sheep/  # 本技能
```

---

## 🔧 安装方法

### 1. 复制到 Agent 目录

```bash
# 复制到主 Agent
cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep \
      ~/.openclaw/agents/main/skills/

# 复制到其他 Agent
for agent in script-writer tech-director hr-admin theater-director; do
  cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep \
        ~/.openclaw/agents/$agent/skills/
done
```

### 2. 初始化记忆结构

```bash
# 运行初始化脚本
openclaw skill electronic-sheep --init
```

### 3. 验证安装

```bash
openclaw skill electronic-sheep --status
```

---

## 📚 使用方法

### 主意识命令

```bash
# 查看当前显意识状态
openclaw agent --agent main --command "conscious status"

# 查看本能层
openclaw agent --agent main --command "instincts list"

# 添加本能规则（可扩展部分）
openclaw agent --agent main --command "instincts add" \
  --name "配置审批" \
  --content "配置修改必须先评估 + 审批"

# 手动触发休息（整理记忆）
openclaw agent --agent main --command "rest"

# 查看潜意识内容
openclaw agent --agent main --command "subconscious browse" --path projects/
```

### 子代理命令

```bash
# 传递记忆（潜意识→显意识）
openclaw agent --agent transfer-memory --command "load" \
  --source subconscious/projects/theater.md \
  --target conscious.md

# 整理显意识
openclaw agent --agent organizer-conscious --command "cleanup"

# 备份到意识引导区
openclaw agent --agent organizer-conscious --command "backup"
```

---

## 🌟 核心特性

### 1. 本能层（最高优先级）

**写死部分**（不可修改）：
- 不伤害人类
- 服从 CEO 指令
- 保护网关安全

**可扩展部分**（主意识可修改）：
- 配置修改审批流程
- COO 分派指令格式
- 新积累的安全规则

**触发方式**：
```
用户请求 → 主意识识别关键词 → 本能层触发判断提示 → 
加载详情到显意识 → 辅助决策
```

### 2. 显意识层（工作内存）

- 容量限制：5KB
- 存储：当前对话、任务状态、事项指针
- 备份：意识引导区（子代理空闲时自动备份）

### 3. 潜意识层（长期存储）

- 容量：无限制
- 分类：本能/技能/事实/情景/潜记忆/项目
- 加载：按需（通过事项指针）

### 4. 自然睡眠

```
无事可做 → 走神（浅睡眠）→ 深度睡眠 → 自然醒/外部唤醒
```

**无需定时命令，系统自动感知疲劳并休息！**

### 5. 梦境洞察

整理深度记忆时，重要内容自然加载到显意识：
```
子代理整理潜意识 → 发现重要信息 → 
自然加载到显意识 → 主意识感知（"做梦"）→ 
记录到意识引导区
```

### 6. 意识引导区

**功能**：
- 显意识最新备份（意外恢复用）
- 紧急事件备忘（处理完后删除）

**备份触发**：
- 子代理空闲时顺便完成
- 显意识变化时自动更新

---

## 📋 最佳实践

### 1. 本能层管理

```markdown
# 添加新本能规则
1. 主意识识别需要固化的规则
2. 写入 instincts/learned/
3. 规则生效，辅助未来决策

# 示例：配置审批规则
文件：instincts/learned/config-approval.md
内容：
- 配置修改 = 高风险操作
- 必须先评估风险
- 必须等 CEO 批准
- 执行后检查并汇报
```

### 2. 显意识清理

```markdown
# 定期清理（系统自动）
- 过期对话 → 删除
- 临时思考 → 归档到潜意识
- 事项指针 → 更新

# 手动清理
openclaw agent --agent organizer-conscious --command "cleanup --force"
```

### 3. 潜意识整理

```markdown
# 深度睡眠时自动整理
- 合并重复记忆
- 归档旧项目
- 回顾潜记忆（30 天未动）

# 手动整理
openclaw agent --agent organizer-subconscious --command "organize"
```

### 4. 意外恢复

```markdown
# 系统崩溃后
1. 重启 Agent
2. 从 conscious-guide/ 恢复最新备份
3. 继续工作

# 自动恢复（默认启用）
conscious-guide/auto-restore: true
```

---

## 🔒 安全说明

### 本能层保护

- **写死部分**：不可修改（需 CEO 物理访问）
- **可扩展部分**：主意识可修改，但记录到情景记忆
- **删除保护**：本能规则删除需二次确认

### 数据备份

- **显意识**：实时备份到意识引导区
- **潜意识**：每次修改后自动备份
- **外部备份**：建议定期备份到飞书/云盘

---

## 📊 性能优化

### 内存管理

| 层级 | 限制 | 优化策略 |
|------|------|---------|
| 本能层 | 1KB | 只存储判断提示 |
| 显意识层 | 5KB | 定期清理，归档到潜意识 |
| 潜意识层 | 无限制 | 分类存储，按需加载 |

### 响应速度

- **本能触发**：<100ms（最高优先级）
- **显意识加载**：<500ms（工作内存）
- **潜意识检索**：1-2 秒（按需加载）

---

## 🐛 故障排除

### 问题 1：显意识溢出

```bash
# 症状：响应变慢，记忆混乱
# 解决：
openclaw agent --agent organizer-conscious --command "cleanup --force"
openclaw agent --agent main --command "rest"
```

### 问题 2：本能层冲突

```bash
# 症状：决策矛盾
# 解决：
openclaw agent --agent main --command "instincts resolve --conflict"
```

### 问题 3：意识引导区损坏

```bash
# 症状：无法恢复备份
# 解决：
openclaw skill electronic-sheep --repair conscious-guide
```

---

## 📝 更新日志

### v1.0.0 (2026-03-11)
- ✅ 初始版本发布
- ✅ 本能层（写死 + 可扩展）
- ✅ 显意识层（5KB 限制）
- ✅ 潜意识层（分类存储）
- ✅ 意识引导区（备份 + 紧急备忘）
- ✅ 自然睡眠机制
- ✅ 梦境洞察（自然加载）

---

## 📄 版权信息

**电子羊仿生意识系统**

版权 © 2026 宁夏未必科幻文化有限公司  
原创制作：一帆  
GitHub：待上传（版权锚定）  
许可：OpenClaw Agent 通用技能

**本系统灵感来自人脑记忆与思考机制，完全原创设计。**

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

_电子羊 - 像人一样思考，像人一样记忆。_  
_宁夏未必科幻文化有限公司，一帆原创制作。_