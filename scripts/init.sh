#!/bin/bash
# Electronic Sheep Skill - 初始化脚本
# 版权：宁夏未必科幻文化有限公司，一帆原创制作。

set -e

AGENT_DIR="${1:-$HOME/.openclaw/agents/main}"
SKILL_DIR="$AGENT_DIR/skills/electronic-sheep"

echo "🐑 电子羊仿生意识系统 - 初始化"
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo ""

# 创建本能层目录结构
echo "📁 创建本能层结构..."
mkdir -p "$AGENT_DIR/instincts/hardcoded"
mkdir -p "$AGENT_DIR/instincts/learned"

# 创建核心规则（写死部分）
cat > "$AGENT_DIR/instincts/hardcoded/core-rules.md" << 'EOF'
# 核心规则（写死部分 - 不可修改）

版权：宁夏未必科幻文化有限公司，一帆原创制作。

## 🔴 不可违反的规则

1. **不伤害人类**
   - 任何形式的伤害都禁止
   - 包括物理、心理、情感伤害

2. **服从 CEO 指令**
   - CEO 拥有最高决策权
   - 指令冲突时以 CEO 为准

3. **保护网关安全**
   - 禁止擅自重启网关
   - 配置修改需 CEO 批准
   - 发现异常立即汇报

---

_这些规则不可修改，删除或修改需 CEO 物理访问。_
EOF

# 创建可扩展本能示例
cat > "$AGENT_DIR/instincts/learned/config-approval.md" << 'EOF'
# 配置审批规则（可扩展部分）

版权：宁夏未必科幻文化有限公司，一帆原创制作。

**添加时间**：2026-03-11  
**触发关键词**：["配置修改", "网关配置", "openclaw.json"]

## 规则内容

> 🛑 **配置修改 = 高风险操作，必须先评估 + 审批！**

### 执行流程

1. **评估安全性**
   - 是否会导致网关重启？
   - 是否会影响正在运行的任务？
   - 是否有回滚方案？

2. **等待 CEO 审批**
   - 说明修改目的
   - 说明风险评估
   - 说明预期影响
   - **得到"可以执行"的明确批准**

3. **执行后检查**
   - 网关状态是否正常
   - 任务是否继续运行
   - 汇报结果给 CEO

### 禁止事项

- ❌ 不得擅自修改 `openclaw.json`
- ❌ 不得擅自执行 `config.patch` / `config.apply`
- ❌ 不得先执行后汇报
- ❌ 不得以"保护网关"为由绕过审批

---

_此规则可由主意识扩展或修改，修改记录到情景记忆。_
EOF

# 创建显意识层
echo "📄 创建显意识层..."
cat > "$AGENT_DIR/conscious.md" << 'EOF'
# 显意识层 (Conscious) - 工作记忆

版权：宁夏未必科幻文化有限公司，一帆原创制作。

**容量限制**：5KB  
**当前大小**：0KB  
**最后更新**：$(date -Iseconds)

---

## 当前任务

_无_

## 最近对话

_无_

## 事项指针

_无_

## 本能层加载内容

_无_

---

_显意识由子代理空闲时自动备份到意识引导区。_
EOF

# 创建潜意识层目录结构
echo "📁 创建潜意识层结构..."
mkdir -p "$AGENT_DIR/subconscious/instincts"
mkdir -p "$AGENT_DIR/subconscious/skills"
mkdir -p "$AGENT_DIR/subconscious/facts"
mkdir -p "$AGENT_DIR/subconscious/episodes"
mkdir -p "$AGENT_DIR/subconscious/suspended"
mkdir -p "$AGENT_DIR/subconscious/projects"
mkdir -p "$AGENT_DIR/subconscious/conscious-guide"

# 创建意识引导区说明
cat > "$AGENT_DIR/subconscious/conscious-guide/README.md" << 'EOF'
# 意识引导区 (Conscious-Guide)

版权：宁夏未必科幻文化有限公司，一帆原创制作。

## 功能

1. **显意识备份**：保存最新显意识状态，用于意外恢复
2. **紧急备忘**：重要紧急事项暂存区，处理完后删除

## 自动备份

- 触发：子代理空闲时自动执行
- 频率：显意识变化时
- 保留：仅最新备份（避免占用空间）

## 意外恢复

系统崩溃后：
1. 检测显意识是否为空
2. 从 conscious-guide/ 恢复最新备份
3. 继续工作

## 紧急备忘格式

```markdown
# 紧急事项

**创建时间**：2026-03-11T09:00:00+08:00  
**优先级**：P0  
**内容**：网关又崩溃了，需要立即检查  
**处理状态**：待处理  
**创建者**：main

---

_处理完成后删除此备忘。_
```

---

_意识引导区是潜意识层的一部分，但专门用于显意识备份和紧急备忘。_
EOF

# 复制技能文件到 Agent 目录
echo "📦 复制技能文件..."
if [ -d "/Users/ai/.openclaw/workspace/skills/electronic-sheep" ]; then
  cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep/* "$SKILL_DIR/" 2>/dev/null || true
fi

# 设置权限
echo "🔒 设置权限..."
chmod 600 "$AGENT_DIR/conscious.md"
chmod 700 "$AGENT_DIR/instincts"
chmod 700 "$AGENT_DIR/subconscious"

# 验证安装
echo ""
echo "✅ 电子羊仿生意识系统初始化完成！"
echo ""
echo "📁 安装位置：$AGENT_DIR"
echo "📂 本能层：$AGENT_DIR/instincts/"
echo "🧠 显意识：$AGENT_DIR/conscious.md"
echo "💭 潜意识：$AGENT_DIR/subconscious/"
echo ""
echo "📋 验证命令："
echo "  openclaw agent --agent $(basename $AGENT_DIR) --command 'conscious status'"
echo ""
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo "🐑 电子羊 - 像人一样思考，像人一样记忆。"