#!/bin/bash
# 项目日志事件触发备份脚本
# 电子羊仿生意识系统 - 潜意识归档机制
# 版权：宁夏未必科幻文化有限公司，一帆原创制作。

set -e

AGENT_ID="${1:-main}"
PROJECT_NAME="${2:-unnamed}"
SOURCE_FILE="${3:-}"
AGENT_DIR="$HOME/.openclaw/agents/$AGENT_ID"

echo "🐑 电子羊 - 项目日志事件触发备份"
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo ""

# 检查 Agent 目录
if [ ! -d "$AGENT_DIR" ]; then
  echo "❌ 错误：Agent 目录不存在：$AGENT_DIR"
  exit 1
fi

# 检查电子羊技能是否安装
if [ ! -d "$AGENT_DIR/skills/electronic-sheep" ]; then
  echo "❌ 错误：电子羊技能未安装到 $AGENT_ID"
  exit 1
fi

# 归档目标目录
ARCHIVE_DIR="$AGENT_DIR/subconscious/projects/$PROJECT_NAME"
mkdir -p "$ARCHIVE_DIR"

# 时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 如果有源文件，直接归档
if [ -n "$SOURCE_FILE" ] && [ -f "$SOURCE_FILE" ]; then
  echo "📦 归档项目文件：$SOURCE_FILE"
  cp "$SOURCE_FILE" "$ARCHIVE_DIR/${PROJECT_NAME}_${TIMESTAMP}.md"
  echo "✅ 归档完成：$ARCHIVE_DIR/${PROJECT_NAME}_${TIMESTAMP}.md"
else
  # 无源文件，创建归档记录
  echo "📝 创建项目归档记录"
  cat > "$ARCHIVE_DIR/archive_${TIMESTAMP}.md" << EOF
# 项目归档记录

**项目名称**：$PROJECT_NAME  
**归档时间**：$(date -Iseconds)  
**归档类型**：事件触发  
**版权**：宁夏未必科幻文化有限公司，一帆原创制作。

---

## 归档说明

此归档由电子羊系统事件触发机制自动创建。

### 触发条件
- 项目文件变更
- 项目阶段完成
- 手动触发归档

### 归档位置
\`$ARCHIVE_DIR\`

---

_电子羊 - 像人一样思考，像人一样记忆。_
EOF
  echo "✅ 归档记录创建完成：$ARCHIVE_DIR/archive_${TIMESTAMP}.md"
fi

# 更新意识引导区备份
GUIDE_DIR="$AGENT_DIR/subconscious/conscious-guide"
mkdir -p "$GUIDE_DIR"

echo ""
echo "💾 更新意识引导区备份..."
cat > "$GUIDE_DIR/project-archive-latest.md" << EOF
# 项目归档备份（最新）

**归档时间**：$(date -Iseconds)  
**项目名称**：$PROJECT_NAME  
**归档位置**：$ARCHIVE_DIR  
**版权**：宁夏未必科幻文化有限公司，一帆原创制作。

---

## 快速访问

\`\`\`bash
# 查看归档
openclaw agent --agent $AGENT_ID --command "subconscious browse --path projects/$PROJECT_NAME/"

# 搜索归档
openclaw agent --agent $AGENT_ID --command "subconscious search --query '$PROJECT_NAME'"
\`\`\`

---

_此备份由电子羊系统自动创建，用于快速恢复和访问。_
EOF

echo "✅ 意识引导区备份更新完成"

# 输出总结
echo ""
echo "================================"
echo "🎉 项目日志事件触发备份完成！"
echo "================================"
echo "📁 归档位置：$ARCHIVE_DIR"
echo "💾 意识引导区：$GUIDE_DIR/project-archive-latest.md"
echo ""
echo "📋 使用示例："
echo "  # 查看归档"
echo "  openclaw agent --agent $AGENT_ID --command 'subconscious browse --path projects/$PROJECT_NAME/'"
echo ""
echo "  # 搜索项目"
echo "  openclaw agent --agent $AGENT_ID --command 'subconscious search --query \"$PROJECT_NAME\"'"
echo ""
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo "🐑 电子羊 - 像人一样思考，像人一样记忆。"