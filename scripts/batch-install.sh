#!/bin/bash
# 批量安装电子羊技能到所有在职 Agent
# 版权：宁夏未必科幻文化有限公司，一帆原创制作。

set -e

echo "🐑 批量安装电子羊仿生意识系统"
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo ""

# Agent 列表（在职员工）
AGENTS=(
  "main"
  "script-writer"
  "tech-director"
  "hr-admin"
  "theater-director"
  "content-director"
  "drama-lead"
  "drama-editor"
  "marketing-director"
  "property-monitor"
  "qa-agent"
  "archive-manager"
  "usage-monitor"
  "theater-hr"
  "theater-screenwriter-1"
  "theater-screenwriter-2"
  "theater-content-writer"
  "theater-unity-dev"
)

SKILL_SOURCE="/Users/ai/.openclaw/workspace/skills/electronic-sheep"
INIT_SCRIPT="$SKILL_SOURCE/scripts/init.sh"
INSTALLED=0
FAILED=0

# 检查技能源是否存在
if [ ! -d "$SKILL_SOURCE" ]; then
  echo "❌ 错误：技能源目录不存在：$SKILL_SOURCE"
  exit 1
fi

# 批量安装
for agent in "${AGENTS[@]}"; do
  AGENT_DIR="$HOME/.openclaw/agents/$agent"
  
  # 检查 Agent 目录是否存在
  if [ ! -d "$AGENT_DIR" ]; then
    echo "⚠️  跳过 $agent：Agent 目录不存在"
    ((FAILED++))
    continue
  fi
  
  echo "📦 安装到 $agent..."
  
  # 创建 skills 目录
  mkdir -p "$AGENT_DIR/skills"
  
  # 复制技能文件
  cp -r "$SKILL_SOURCE" "$AGENT_DIR/skills/electronic-sheep"
  
  # 执行初始化
  bash "$INIT_SCRIPT" "$AGENT_DIR" > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "✅ $agent 安装完成"
    ((INSTALLED++))
  else
    echo "❌ $agent 安装失败"
    ((FAILED++))
  fi
done

# 汇总
echo ""
echo "================================"
echo "🎉 批量安装完成！"
echo "================================"
echo "✅ 成功安装：$INSTALLED 个 Agent"
echo "❌ 安装失败：$FAILED 个 Agent"
echo "📁 技能位置：~/.openclaw/agents/<agent>/skills/electronic-sheep"
echo ""
echo "📋 验证命令："
echo "  openclaw agent --agent main --command 'electronic-sheep status'"
echo ""
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
echo "🐑 电子羊 - 像人一样思考，像人一样记忆。"