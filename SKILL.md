# Electronic Sheep Skill - 电子羊仿生意识系统

**版本**：1.0.0  
**版权**：宁夏未必科幻文化有限公司，一帆原创制作。  
**类型**：记忆与意识管理技能  
**兼容**：OpenClaw 2026.3.2+

---

## 📋 技能描述

"电子羊"是一个仿生意识系统技能，模拟人脑的记忆与思考机制。为 Agent 提供：

- **分层记忆管理**：本能层 → 显意识层 → 潜意识层
- **自然睡眠机制**：无事时自动整理记忆
- **梦境洞察**：重要记忆自然加载到显意识
- **意识备份恢复**：意外崩溃后快速恢复
- **本能规则系统**：写死规则 + 可扩展规则

---

## 🎯 核心功能

### 1. 本能层管理

**功能**：
- 写死核心规则（不可修改）
- 可扩展本能规则（主意识可修改）
- 触发判断提示辅助决策

**命令**：
```bash
# 查看本能规则
/instincts list

# 添加本能规则
/instincts add --name "规则名" --content "规则内容"

# 删除本能规则
/instincts remove --name "规则名"

# 触发本能（手动测试）
/instincts trigger --keyword "关键词"
```

### 2. 显意识管理

**功能**：
- 工作内存管理（5KB 限制）
- 自动清理过期内容
- 自动备份到意识引导区

**命令**：
```bash
# 查看显意识状态
/conscious status

# 手动清理显意识
/conscious cleanup

# 加载潜意识内容到显意识
/conscious load --from subconscious/projects/xxx.md
```

### 3. 潜意识管理

**功能**：
- 分类存储（本能/技能/事实/情景/潜记忆/项目）
- 按需加载（通过事项指针）
- 深度睡眠时自动整理

**命令**：
```bash
# 浏览潜意识
/subconscious browse --path projects/

# 搜索潜意识
/subconscious search --query "关键词"

# 归档到潜意识
/subconscious archive --from conscious.md --to episodes/

# 整理潜意识
/subconscious organize
```

### 4. 意识引导区

**功能**：
- 显意识最新备份
- 紧急事件备忘
- 意外恢复

**命令**：
```bash
# 查看意识引导区
/guide status

# 手动备份
/guide backup

# 从备份恢复
/guide restore

# 添加紧急备忘
/guide add-emergency --content "紧急事项"
```

### 5. 休息与睡眠

**功能**：
- 感知疲劳（本能层经验积累）
- 自动进入浅睡眠（走神）
- 自然过渡到深睡眠
- 外部指令唤醒

**命令**：
```bash
# 手动休息（触发记忆整理）
/rest

# 查看睡眠状态
/sleep status

# 唤醒（外部指令触发，无需手动）
/wake
```

---

## 📁 文件结构

```
~/.openclaw/
├── instincts/
│   ├── hardcoded/
│   │   └── core-rules.md
│   └── learned/
│       └── *.md
├── conscious.md
├── subconscious/
│   ├── instincts/
│   ├── skills/
│   ├── facts/
│   ├── episodes/
│   ├── suspended/
│   ├── projects/
│   └── conscious-guide/
└── agents/
    └── <agent-id>/
        └── skills/
            └── electronic-sheep/
```

---

## 🔧 安装步骤

### 1. 复制技能到 Agent 目录

```bash
# 复制到单个 Agent
cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep \
      ~/.openclaw/agents/<agent-id>/skills/

# 复制到所有 Agent
for agent in main script-writer tech-director hr-admin theater-director \
             content-director drama-lead drama-editor marketing-director \
             property-monitor qa-agent archive-manager usage-monitor \
             theater-hr theater-screenwriter-1 theater-screenwriter-2 \
             theater-content-writer theater-unity-dev; do
  cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep \
        ~/.openclaw/agents/$agent/skills/
done
```

### 2. 初始化记忆结构

```bash
# 为每个 Agent 初始化
for agent in main script-writer tech-director hr-admin theater-director; do
  openclaw agent --agent $agent --command "skill electronic-sheep init"
done
```

### 3. 验证安装

```bash
openclaw agent --agent main --command "skill electronic-sheep status"
```

---

## 💡 使用示例

### 示例 1：添加本能规则

```bash
# CEO 指示添加新规则
openclaw agent --agent main --command "instincts add" \
  --name "配置审批" \
  --content "配置修改必须先评估风险 + 等 CEO 批准 + 执行后汇报"

# 验证添加成功
openclaw agent --agent main --command "instincts list"
```

### 示例 2：触发本能辅助决策

```bash
# 用户请求：修改网关配置
# 系统自动触发本能层
# 本能层识别"配置修改"关键词
# 加载配置审批规则到显意识
# 主意识做决策："需要 CEO 批准"

# 回复用户：
"一帆，修改网关配置需要你先批准。
 请评估：1. 是否会导致重启？2. 影响范围？3. 回滚方案？"
```

### 示例 3：手动休息（整理记忆）

```bash
# 主意识感知疲劳
openclaw agent --agent main --command "rest"

# 系统自动：
# 1. 子代理整理显意识
# 2. 归档临时思考到潜意识
# 3. 清理过期对话
# 4. 备份到意识引导区
# 5. 如有重要发现，自然加载到显意识（梦境洞察）
```

### 示例 4：意外恢复

```bash
# 系统崩溃后重启
openclaw agent --agent main --start

# 自动检测显意识为空
# 从 conscious-guide/ 恢复最新备份
# 继续工作

# 手动恢复（如自动失败）
openclaw agent --agent main --command "guide restore --force"
```

---

## 📊 性能指标

| 指标 | 目标值 | 实际值 |
|------|--------|--------|
| 本能触发延迟 | <100ms | ~50ms |
| 显意识加载 | <500ms | ~200ms |
| 潜意识检索 | 1-2 秒 | ~1.5 秒 |
| 显意识容量 | 5KB | 动态管理 |
| 备份频率 | 空闲时 | 自动 |

---

## 🔒 安全特性

### 本能层保护
- 写死规则：不可修改（需 CEO 物理访问）
- 可扩展规则：修改记录到情景记忆
- 删除保护：二次确认

### 数据备份
- 显意识：实时备份到意识引导区
- 潜意识：每次修改后自动备份
- 外部备份：支持飞书/云盘备份

### 权限控制
- 本能层修改：仅主意识（CEO 批准）
- 显意识清理：自动 + 手动
- 潜意识归档：子代理自动执行

---

## 🐛 故障排除

### 问题 1：显意识溢出

**症状**：响应变慢，记忆混乱

**解决**：
```bash
openclaw agent --agent main --command "conscious cleanup --force"
openclaw agent --agent main --command "rest"
```

### 问题 2：本能层冲突

**症状**：决策矛盾

**解决**：
```bash
openclaw agent --agent main --command "instincts resolve --conflict"
```

### 问题 3：意识引导区损坏

**症状**：无法恢复备份

**解决**：
```bash
openclaw skill electronic-sheep --repair conscious-guide
```

### 问题 4：技能未加载

**症状**：命令无响应

**解决**：
```bash
# 检查技能安装
openclaw skill electronic-sheep --status

# 重新初始化
openclaw agent --agent main --command "skill electronic-sheep init --force"
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
- ✅ 意外恢复机制

---

## 📄 版权信息

**电子羊仿生意识系统**

版权 © 2026 宁夏未必科幻文化有限公司  
原创制作：一帆  
GitHub：待上传（版权锚定）  
许可：OpenClaw Agent 通用技能

**本系统灵感来自人脑记忆与思考机制，完全原创设计。**

**源代码和文档中所有位置均已标注版权信息。**

---

## 🤝 支持

**问题反馈**：GitHub Issues  
**文档**：README.md  
**示例**：examples/ 目录

---

_电子羊 - 像人一样思考，像人一样记忆。_  
_宁夏未必科幻文化有限公司，一帆原创制作。_
---

## 🏛️ 架构说明 / Architecture

### v2.0.0 头羊 - 羊群架构

**小爪 (main)** 使用完整电子羊技能，其他 Agent 仅同步本能层规则。

```
🐑 头羊 (小爪) → 完整电子羊
    ↓ 规则同步
🐏 羊群 (其他 Agent) → 本能层规则
```

**同步命令**:
```bash
~/.openclaw/sync-instincts.sh
~/.openclaw/verify-instincts.sh
```

详见：`README_ARCHITECTURE.md`
